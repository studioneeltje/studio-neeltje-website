import { createServer } from 'node:http';
import { open, readFile, unlink } from 'node:fs/promises';
import { contactMessage, sendSenderMail } from './sender-transport.mjs';

export const trialOrigin = 'https://test.studioneeltje.com';
export const trialMailbox = 'info@studioneeltje.com';
export const trialNames = 'TEST Studio Neeltje';
export const trialPhone = '0600000000';
const maxBodyBytes = 4096;

function reply(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'noindex, nofollow',
  });
  response.end(JSON.stringify(payload));
}

async function readSubmission(request) {
  const parts = [];
  let size = 0;
  for await (const part of request) {
    size += part.length;
    if (size > maxBodyBytes) return null;
    parts.push(part);
  }
  return JSON.parse(Buffer.concat(parts).toString('utf8'));
}

export function createHostingTrial({ token, checklist, send, lockDirectory }) {
  return createServer(async (request, response) => {
    const safeFailure = status => reply(response, status, { success: false });
    const path = request.url?.split('?')[0];
    if (!['/sender-proef', '/sender-proef/', '/'].includes(path)) return safeFailure(404);
    if (request.method === 'GET') return reply(response, 200, { ready: Boolean(token) });
    if (request.method !== 'POST') return safeFailure(405);
    if (request.headers.origin !== trialOrigin) return safeFailure(403);
    if (!/^application\/json(?:\s*;|$)/i.test(request.headers['content-type'] || '')) return safeFailure(415);
    if (!token) return safeFailure(503);

    let data;
    try { data = await readSubmission(request); } catch { return safeFailure(400); }
    if (!data || data.website_url) return safeFailure(400);
    const { form, names, phone, email, newsletter_consent: consent } = data;
    const isContact = form === 'contact' && names === trialNames && phone === trialPhone;
    const isChecklist = form === 'checklist' && email === trialMailbox && consent === 'yes';
    if (!isContact && !isChecklist) return safeFailure(400);

    // Each proof may be accepted once, even across worker restarts.
    const lock = new URL('./' + form + '.lock', lockDirectory);
    try {
      const handle = await open(lock, 'wx', 0o600);
      await handle.close();
    } catch (error) {
      return safeFailure(error.code === 'EEXIST' ? 409 : 500);
    }
    try {
      const message = isContact ? contactMessage({ names, phone }, { trial: true }) : checklist;
      const receipt = await sendSenderMail({ token, mailbox: trialMailbox, recipient: trialMailbox, message, send });
      if (receipt.accepted) return reply(response, 200, { success: true });
      console.error(`Sender hosting trial ${form} returned status ${receipt.status}`);
      // An explicit rejection is safe to retry. Keep the lock if delivery is uncertain.
      if (receipt.status >= 400 && receipt.status < 500) await unlink(lock);
      return safeFailure(502);
    } catch {
      console.error(`Sender hosting trial ${form} did not confirm delivery`);
      return safeFailure(502);
    }
  });
}

export async function startHostingTrial() {
  const checklist = JSON.parse(await readFile(new URL('./checklist.json', import.meta.url), 'utf8'));
  const lockDirectory = new URL('./', import.meta.url);
  return createHostingTrial({ token: process.env.SN_SENDER_TOKEN, checklist, lockDirectory })
    .listen(Number(process.env.PORT || 3000), '127.0.0.1');
}
