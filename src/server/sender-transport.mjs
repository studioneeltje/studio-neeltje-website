const senderEndpoint = 'https://api.sender.net/v2/message/send';

export function contactMessage({ names, phone }, { trial = false } = {}) {
  return {
    subject: `${trial ? '[TEST Studio Neeltje] ' : ''}Nieuwe contactaanvraag`,
    text: `${trial ? 'Proefaanvraag' : 'Contactaanvraag'} van de nieuwe website.\n\nNamen: ${names}\nTelefoonnummer: ${phone}`,
  };
}

export async function sendSenderMail({ token, mailbox, recipient, message, send = fetch }) {
  const response = await send(senderEndpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: { email: mailbox, name: 'Studio Neeltje' }, to: { email: recipient }, ...message }),
    redirect: 'error',
    signal: AbortSignal.timeout(12000),
  });
  const receipt = await response.json().catch(() => null);
  return {
    status: response.status,
    accepted: response.ok && receipt?.success === true && typeof receipt.emailId === 'string' && receipt.emailId.length > 0,
    receipt,
  };
}
