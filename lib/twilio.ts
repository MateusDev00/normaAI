 //lib/twilio.ts
 import Twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM!; // e.g. "whatsapp:+14155238886"

if (!accountSid || !authToken || !fromWhatsApp) {
  console.warn('Twilio environment vars missing (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM)');
}

export const twilioClient = Twilio(accountSid, authToken);

export async function sendWhatsAppMessage(to: string, body: string) {
  // `to` must be in E.164 without the whatsapp: prefix (e.g. +2449...)
  const toWithPrefix = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

  return twilioClient.messages.create({
    from: fromWhatsApp,
    to: toWithPrefix,
    body,
  });
}