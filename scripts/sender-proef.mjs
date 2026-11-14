import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { access, readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { load } from 'cheerio';
import { checklistMessage, contactMessage, sendSenderMail } from '../src/server/sender.mjs';

const host = '127.0.0.1';
const mailbox = 'info@studioneeltje.com';
const names = 'TEST Studio Neeltje';
const phone = '0600000000';
const mime = {
  '.avif': 'image/avif', '.css': 'text/css', '.gif': 'image/gif',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.js': 'text/javascript',
  '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2',
};
const trialPages = new Map([
  ['/contact.html', 'contact'],
  ['/weddingschecklist.html', 'checklist'],
]);
const thanksPages = new Set(['/bedankt-contact.html', '/bedankt-checklist.html']);

function reply(response, status, body, type = 'text/plain; charset=utf-8') {
  response.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'noindex, nofollow',
  });
  response.end(body);
}

async function readBody(request) {
  const parts = [];
  let length = 0;
  for await (const part of request) {
    length += part.length;
    if (length > 4096) throw new Error('Formulier te groot.');
    parts.push(part);
  }
  return Buffer.concat(parts).toString('utf8');
}

function refusalReason(status, receipt) {
  const description = [receipt?.message, receipt?.error].filter(value => typeof value === 'string').join(' ');
  if (/under review|pending (?:review|approval)|account.{0,30}(?:review|approval)/i.test(description)) return 'accountbeoordeling loopt';
  if (status === 401 || /invalid.{0,20}token|expired.{0,20}token/i.test(description)) return 'sleutel geweigerd';
  if (/domain|sender address|authenticate/i.test(description)) return 'afzender of domein geweigerd';
  if (/quota|credit|limit|plan|subscription/i.test(description)) return 'verzendlimiet of abonnement';
  return 'geen specifieke reden beschikbaar';
}

export async function createSenderTrial({
  port = 4193,
  dist = resolve('dist'),
  send = fetch,
  onAccepted = kind => console.log('Sender accepteerde de proefmail voor ' + kind + '.'),
} = {}) {
  const directory = resolve(dist);
  const template = await readFile(new URL('../emails/trouwchecklist-bezorgmail.html', import.meta.url), 'utf8');
  await Promise.all(['contact.html', 'weddingschecklist.html', 'downloads/trouwchecklist.pdf'].map(file => access(resolve(directory, file))));
  const setupPath = '/proef/' + randomBytes(18).toString('hex');
  const attempts = new Set();
  let token;
  let origin;

  async function handle(request, response) {
    const url = new URL(request.url, origin);
    if (request.headers.host !== new URL(origin).host || url.origin !== origin) return reply(response, 403, 'Deze proef is lokaal.');
    const { pathname } = url;
    if (pathname === setupPath) response.setHeader('Content-Security-Policy', "default-src 'none'; form-action 'self'; frame-ancestors 'none'");
    if (request.method === 'POST') {
      if (request.headers.origin !== origin) return reply(response, 403, 'Deze proef is lokaal.');
      if (pathname === setupPath) {
        if (token || attempts.size === 2) return reply(response, 409, 'De proef is al ingesteld.');
        const candidate = new URLSearchParams(await readBody(request)).get('token')?.trim();
        if (!candidate || !/^[\x21-\x7e]{16,2048}$/.test(candidate)) return reply(response, 400, 'Vul de toegangssleutel uit Sender in.');
        token = candidate;
        console.log('De toegangssleutel voor de lokale proef is ingesteld.');
        return reply(response, 200, '<h1>Sender-proef staat klaar</h1><p>Ga naar het <a href="/contact.html">contactformulier</a> en de <a href="/weddingschecklist.html#checklist-aanvragen">trouwchecklist</a>.</p>', 'text/html; charset=utf-8');
      }
      if (pathname !== '/api/aanvraag' || !token) return reply(response, 403, 'De proef is nog niet aangesloten.');
      let data;
      try { data = JSON.parse(await readBody(request)); } catch { return reply(response, 400, 'Ongeldig formulier.'); }
      if (!data || data.website_url) return reply(response, 400, 'Ongeldig formulier.');
      const kind = data.form;
      const contact = kind === 'contact' && data.names === names && data.phone === phone;
      const checklist = kind === 'checklist' && data.email === mailbox && data.newsletter_consent === 'yes';
      if (!contact && !checklist) return reply(response, 400, 'Gebruik de afgesproken proefgegevens.');
      if (attempts.has(kind)) return reply(response, 409, 'Deze proefaanvraag is al verwerkt.');
      attempts.add(kind);
      const message = contact
        ? contactMessage({ names, phone }, { trial: true })
        : checklistMessage(template, origin, { trial: true });
      try {
        const { accepted, status, receipt } = await sendSenderMail({ token, mailbox, recipient: mailbox, message, send });
        if (!accepted) {
          if (status >= 400 && status < 500) attempts.delete(kind);
          console.error('Sender weigerde de ' + kind + 'proef (HTTP ' + status + '): ' + refusalReason(status, receipt) + '.');
          return reply(response, 502, '{"success":false}', 'application/json');
        }
        if (attempts.size === 2) token = undefined;
        onAccepted(kind);
        return reply(response, 200, '{"success":true}', 'application/json');
      } catch {
        console.error('Sender gaf geen bevestiging voor de ' + kind + 'proef.');
        return reply(response, 502, '{"success":false}', 'application/json');
      }
    }
    if (request.method !== 'GET') return reply(response, 405, 'Gebruik GET of POST.');
    if (pathname === setupPath) {
      return reply(response, 200, '<!doctype html><html lang="nl"><meta charset="utf-8"><title>Sender-proef Studio Neeltje</title><h1>Verzendproef Studio Neeltje</h1><p>Plak hier de tijdelijke Sender-sleutel. Deze blijft in het geheugen van de lokale proef.</p><form method="post" autocomplete="off"><label>Tijdelijke Sender-sleutel <input type="password" name="token" required autocomplete="off"></label> <button>Proef aansluiten</button></form></html>', 'text/html; charset=utf-8');
    }
    if (trialPages.has(pathname) || thanksPages.has(pathname)) {
      const html = await readFile(resolve(directory, '.' + pathname), 'utf8');
      if (!trialPages.has(pathname)) return reply(response, 200, html, 'text/html; charset=utf-8');
      const kind = trialPages.get(pathname);
      const $ = load(html);
      const form = $('main form[data-form-kind="' + kind + '"]');
      if (token && !attempts.has(kind)) {
        const config = JSON.parse($('#sn-form-settings').text());
        config.services[kind] = { provider: 'json', endpoint: '/api/aanvraag', activated: true };
        $('#sn-form-settings').text(JSON.stringify(config));
        form.attr('data-form-ready', 'true');
        form.find('button[type="submit"]').removeAttr('disabled aria-disabled');
        form.find('.sn-form-connection-note').remove();
        const hint = kind === 'contact'
          ? 'Proefgegevens: ' + names + ' en ' + phone + '.'
          : 'Proefadres: ' + mailbox + '.';
        form.prepend($('<p>').text(hint));
      }
      return reply(response, 200, $.html(), 'text/html; charset=utf-8');
    }
    if (!/^\/(?:assets\/|media\/|downloads\/|studio-neeltje-logo\.|classic-photo-wall-v2\.)/.test(pathname)) return reply(response, 404, 'Pagina niet gevonden.');
    const file = resolve(directory, '.' + pathname);
    if (!file.startsWith(directory + sep) || !mime[extname(file)]) return reply(response, 404, 'Bestand niet gevonden.');
    try { return reply(response, 200, await readFile(file), mime[extname(file)]); } catch (error) {
      if (error.code === 'ENOENT') return reply(response, 404, 'Bestand niet gevonden.');
      throw error;
    }
  }

  const server = createServer((request, response) => {
    handle(request, response).catch(() => reply(response, 500, 'De lokale proef gaf een fout.'));
  });
  await new Promise((resolveListen, rejectListen) => {
    server.once('error', rejectListen);
    server.listen(port, host, resolveListen);
  });
  origin = 'http://' + host + ':' + server.address().port;
  const expiry = setTimeout(() => server.close(), 45 * 60 * 1000);
  expiry.unref();
  server.on('close', () => { token = undefined; clearTimeout(expiry); });
  return { server, origin, setupURL: origin + setupPath };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const trial = await createSenderTrial();
  console.log('Lokale Sender-proef: ' + trial.setupURL);
}
