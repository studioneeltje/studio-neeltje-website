import { load } from 'cheerio';

export { contactMessage, sendSenderMail } from './sender-transport.mjs';

const checklistPath = '/downloads/trouwchecklist.pdf';
const templateDownload = `https://www.studioneeltje.com${checklistPath}`;

export function checklistMessage(template, siteURL, { trial = false } = {}) {
  const site = new URL(siteURL);
  const localTrial = trial && site.hostname === '127.0.0.1' && site.protocol === 'http:';
  if (site.protocol !== 'https:' && !localTrial) throw new Error('Gebruik een HTTPS-adres voor de trouwchecklist.');
  const download = new URL(checklistPath, site).href;
  const $ = load(template);
  const button = $(`a[href="${templateDownload}"]`);
  if (button.length !== 1) throw new Error('De bezorgmail mist de knop voor de trouwchecklist.');
  button.attr('href', download);
  // This transactional message delivers the requested PDF. The newsletter
  // workflow supplies its own working unsubscribe link in each marketing mail.
  $('a[href="{$unsubscribe_link}"]').parent().html(trial
    ? 'Studio Neeltje · Trouwfotografie met energie<br>Dit is een proefmail voor de levering van de trouwchecklist.'
    : 'Studio Neeltje · Trouwfotografie met energie<br>Je ontvangt dit mailtje omdat je de trouwchecklist hebt aangevraagd.');
  return {
    subject: `${trial ? '[TEST Studio Neeltje] ' : ''}Hier is jullie trouwchecklist!`,
    text: `Hoi jullie,\n\nHier is jullie trouwchecklist: ${download}\n\nLiefs,\nNeeltje`,
    html: $.html(),
  };
}

