import type { NextApiRequest, NextApiResponse } from 'next';
import { twiml } from 'twilio';
import { LegalAgent } from '../../lib/legal-agent';

// IMPORTANT: Twilio sends form-urlencoded data. Next.js by default parses it into req.body.
// If you use middleware that disables body parsing, adjust accordingly.

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const body = req.body || {};
    const incoming = String(body.Body || body.body || '').trim();
    const from = String(body.From || body.from || ''); // e.g. 'whatsapp:+2449xxxx'

    console.log('Twilio incoming message from', from, '->', incoming);

    const agent = new LegalAgent();
    const reply = await agent.processQuery(incoming || '');

    const messagingResponse = new twiml.MessagingResponse();
    messagingResponse.message(reply);

    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(messagingResponse.toString());
  } catch (err) {
    console.error('Error handling Twilio webhook:', err);
    const messagingResponse = new twiml.MessagingResponse();
    messagingResponse.message('Desculpe, ocorreu um erro no servidor ao processar sua mensagem.');
    res.setHeader('Content-Type', 'text/xml');
    return res.status(500).send(messagingResponse.toString());
  }
}