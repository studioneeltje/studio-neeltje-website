import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { load } from 'cheerio';
import { checklistMessage } from '../src/server/sender.mjs';
import { trialMailbox, trialNames, trialOrigin, trialPhone } from '../src/server/hosting-trial.mjs';

const destination = process.argv[2];
if (!destination) throw new Error('Geef een doelmap op voor de hostingproef.');
const server = resolve(destination, 'server');
const website = resolve(destination, 'website');
await Promise.all([mkdir(server, { recursive: true }), mkdir(resolve(website, 'assets'), { recursive: true })]);

const formsScript = await readFile('assets/forms.js');
const formsVersion = createHash('sha256').update(formsScript).digest('hex').slice(0, 12);
const template = await readFile('emails/trouwchecklist-bezorgmail.html', 'utf8');
const delivery = checklistMessage(template, trialOrigin, { trial: true });
await Promise.all([
  ...['hosting-trial.mjs', 'sender-transport.mjs'].map(file => copyFile('src/server/' + file, resolve(server, file))),
  writeFile(resolve(server, 'app.js'), "import('./hosting-trial.mjs').then(({startHostingTrial}) => startHostingTrial()).catch(() => { console.error('De formulierproef start niet.'); process.exit(1); });\n"),
  writeFile(resolve(server, 'checklist.json'), JSON.stringify(delivery)),
  writeFile(resolve(website, 'assets', 'forms.js'), formsScript),
]);

for (const [file, kind, hint] of [
  ['contact.html', 'contact', `Proefgegevens: ${trialNames} en ${trialPhone}.`],
  ['gratis-trouwchecklist.html', 'checklist', `Proefadres: ${trialMailbox}. Deze aanvraag schrijft niemand in voor de nieuwsbrief.`],
]) {
  const $ = load(await readFile(resolve('dist-staging', file), 'utf8'));
  const settings = $('#sn-form-settings');
  const config = JSON.parse(settings.text());
  const form = $(`main form[data-form-kind="${kind}"]`);
  if ($('meta[name="robots"]').attr('content')?.split(',')[0] !== 'noindex' ||
      !config.routes[kind].startsWith('/') || config.services[kind].activated || form.length !== 1) {
    throw new Error(`${file} is niet de verwachte afgeschermde testpagina.`);
  }
  config.services[kind] = { provider: 'json', endpoint: trialOrigin + '/sender-proef/', activated: true };
  settings.text(JSON.stringify(config).replace(/</g, '\\u003c'));
  form.attr('data-form-ready', 'true');
  form.find('button[type="submit"]').removeAttr('disabled aria-disabled');
  form.find('.sn-form-connection-note').remove();
  form.prepend($('<p>').addClass('sn-form-connection-note').text(hint));
  $('script[src*="/assets/forms.js"]').attr('src', '/assets/forms.js?v=' + formsVersion);
  await writeFile(resolve(website, file), $.html());
}
