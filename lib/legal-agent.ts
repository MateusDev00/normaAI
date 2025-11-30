/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/legal-agent.ts - ATUALIZADO
import { Groq } from 'groq-sdk';
import { LexAOScraper } from './scraper';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!
});

const scraper = new LexAOScraper();

// Modelos prioritários para WhatsApp (mais rápidos)
const WHATSAPP_MODELS = [
  'llama-3.1-8b-instant',      // Mais rápido
  'gemma2-9b-it',              // Equilibrado
  'llama-3.3-70b-versatile'    // Mais preciso (se necessário)
];

export class LegalAgent {
  async processQuery(query: string, forWhatsApp: boolean = false): Promise<string> {
    console.log(`🔍 Processando query: "${query}" | WhatsApp: ${forWhatsApp}`);
    
    let context = '';
    
    // Para WhatsApp, buscar contexto de forma mais rápida
    if (forWhatsApp) {
      try {
        const documents = await scraper.searchDocuments(query);
        if (documents.length > 0) {
          const mainDocument = documents[0];
          context = `DOCUMENTO: ${mainDocument.title}\nURL: ${mainDocument.url}\n`;
        }
      } catch (error) {
        console.log('⚠️ Erro no scraping, continuando sem contexto...');
      }
    }

    const prompt = this.buildLegalPrompt(query, context);

    // Tentar modelos em ordem de prioridade
    for (const model of WHATSAPP_MODELS) {
      try {
        console.log(`🔄 Tentando modelo: ${model}`);
        
        const completion = await groq.chat.completions.create({
          messages: [
            { 
              role: "system", 
              content: "Você é o NormAI, assistente jurídico especializado em legislação angolana. Seja conciso e objetivo." 
            },
            { role: "user", content: prompt }
          ],
          model: model,
          temperature: 0.2,
          max_tokens: forWhatsApp ? 800 : 1024, // Limitar tokens no WhatsApp
         
        });

        const response = completion.choices?.[0]?.message?.content || "Não foi possível obter resposta.";
        console.log(`✅ Resposta obtida do modelo ${model}`);
        
        return response;

      } catch (err: any) {
        console.warn(`❌ Erro com modelo ${model}:`, err.message);
        continue; // Tentar próximo modelo
      }
    }

    return "Desculpe, estou com dificuldades técnicas no momento. Por favor, tente novamente mais tarde.";
  }

  private buildLegalPrompt(query: string, context: string): string {
    return `
Você é o NormAI, assistente especializado em legislação angolana.

${context ? `CONTEXTO ENCONTRADO:\n${context}\n` : ''}

PERGUNTA: ${query}

INSTRUÇÕES:
- Responda de forma CLARA e OBJETIVA
- Foque na legislação angolana
- Se não souber, diga que não encontrou a informação
- Não invente informações
- Seja útil e direto

RESPOSTA:
    `.trim();
  }
}