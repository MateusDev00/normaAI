// app/api/twilio/route.ts - ATUALIZADO
import { NextRequest } from "next/server";
import twilio from "twilio";
import { LegalAgent } from "@/lib/legal-agent";

export async function POST(req: NextRequest) {
  console.log("📱 Webhook Twilio chamado");
  
  try {
    const formData = await req.formData();
    const incomingMsg = formData.get("Body")?.toString() || "";
    const fromNumber = formData.get("From")?.toString() || "";

    console.log(`✅ Mensagem recebida de ${fromNumber}: "${incomingMsg}"`);

    if (!incomingMsg.trim()) {
      const twiml = new twilio.twiml.MessagingResponse();
      twiml.message("Olá! Sou o NormAI 🤖. Envie sua consulta sobre legislação angolana!");
      
      return new Response(twiml.toString(), {
        headers: { 
          "Content-Type": "text/xml; charset=utf-8" // ✅ Adicionar charset
        },
      });
    }

    // Processar a consulta
    const agent = new LegalAgent();
    let reply = await agent.processQuery(incomingMsg, true);

    // ✅ Corrigir encoding dos caracteres
    reply = reply.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos
    // Ou manter acentos mas garantir encoding correto:
    // reply = Buffer.from(reply, 'utf8').toString();

    console.log(`✅ Resposta gerada: ${reply.substring(0, 100)}...`);

    // Criar resposta TwiML
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(reply);

    const responseXml = twiml.toString();
    
    return new Response(responseXml, {
      headers: { 
        "Content-Type": "text/xml; charset=utf-8" // ✅ charset UTF-8
      },
    });

  } catch (err) {
    console.error("❌ Erro no webhook Twilio:", err);
    
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message("Desculpe, ocorreu um erro. Tente novamente.");
    
    return new Response(twiml.toString(), {
      headers: { 
        "Content-Type": "text/xml; charset=utf-8"
      },
    });
  }
}