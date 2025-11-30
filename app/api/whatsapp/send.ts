// FILE: pages/api/whatsapp/send.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { sendWhatsAppMessage } from '../../../lib/twilio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { to, text } = req.body || {};
  if (!to || !text) return res.status(400).json({ error: 'Missing `to` or `text` in body' });

  try {
    const msg = await sendWhatsAppMessage(to, text);
    return res.status(200).json({ success: true, sid: msg.sid });
  } catch (err) {
    console.error('Error sending WhatsApp message:', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}