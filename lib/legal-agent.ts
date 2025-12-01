/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/legal-agent.ts
import { Groq } from 'groq-sdk';
import { LexAOScraper } from './scraper';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!
});

const scraper = new LexAOScraper();

// Modelos: O Llama 3.3 70B é muito mais inteligente para ler leis longas.
// Se a velocidade for crítica, mantenha o 8b, mas o 70b alucina muito menos.
const WHATSAPP_MODELS = [
  'llama-3.3-70b-versatile',     // Prioridade 1: Máxima precisão e contexto
  'llama-3.1-8b-instant',        // Prioridade 2: Velocidade
  'gemma2-9b-it'                 // Prioridade 3: Alternativa
];

export class LegalAgent {
  async processQuery(query: string, forWhatsApp: boolean = false): Promise<string> {
    console.log(`🔍 NormAI Analisando: "${query}"`);
    
    let context = '';
    let sourceUrl = '';

    // 1. Fase de Recuperação (Retrieval)
    try {
      const documents = await scraper.searchDocuments(query);
      
      if (documents.length > 0) {
        const mainDoc = documents[0]; // Pega o resultado mais relevante
        sourceUrl = mainDoc.url;
        
        console.log(`📄 Documento encontrado: ${mainDoc.title}`);
        console.log(`⬇️ Baixando conteúdo completo da lei...`);
        
        // AQUI ESTÁ A CORREÇÃO: Baixa o texto completo
        const fullContent = await scraper.getDocumentDetails(mainDoc.url);
        
        if (fullContent && fullContent.length > 100) {
          // Limita o contexto para não estourar tokens (aprox 6000 chars)
          context = fullContent.substring(0, 6000); 
        } else {
          // Fallback se não conseguir ler o detalhe
          context = `Resumo: ${mainDoc.snippet}`;
        }
      } else {
        console.log('⚠️ Nenhum documento encontrado no Lex.ao');
      }
    } catch (error) {
      console.error('⚠️ Falha no scraping:', error);
    }

    // 2. Construção do Prompt (Rigoroso)
    const prompt = this.buildStrictPrompt(query, context);

    // 3. Fase de Geração (Generation)
    for (const model of WHATSAPP_MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { 
              role: "system", 
              content: "Você é o NormAI, um jurista digital angolano Sênior. Sua prioridade máxima é a precisão factual baseada EXCLUSIVAMENTE no contexto fornecido." 
            },
            { role: "user", content: prompt }
          ],
          model: model,
          temperature: 0, // ZERO para remover alucinação e garantir consistência
          max_tokens: 1024, 
        });

        let response = completion.choices?.[0]?.message?.content || "";

        // Adiciona a fonte se ela existir e o modelo não a citou
        if (sourceUrl && !response.includes(sourceUrl)) {
          response += `\n\nFonte consultada: ${sourceUrl}`;
        }

        return response;

      } catch (err: any) {
        console.warn(`❌ Falha no modelo ${model}, tentando próximo...`);
        continue;
      }
    }

    return "Não consegui consultar a base jurídica no momento. Por favor, tente novamente em instantes.";
  }

  private buildStrictPrompt(query: string, context: string): string {
    // Se não há contexto (scraper falhou), instrui o modelo a ser cauteloso
    if (!context) {
      return `
PERGUNTA DO USUÁRIO: "${query}"

INSTRUÇÃO CRÍTICA: Não foi possível acessar a base de dados oficial (Lex.ao) neste momento.
Responda APENAS se tiver certeza absoluta sobre a Lei Geral Angolana (Constituição, Código Civil/Penal). 
Se for algo específico (decretos recentes, multas exatas), diga: "Não encontrei o documento específico na minha base atual, recomendo verificar no Diário da República."
Seja breve.
      `.trim();
    }

    // Se há contexto, instrui o modelo a usá-lo como "Verdade Absoluta"
    return `
CONTEXTO JURÍDICO OFICIAL (LEI RECUPERADA):
"""
${context}
"""

PERGUNTA DO USUÁRIO: "${query}"

INSTRUÇÕES OBRIGATÓRIAS:
1. Responda à pergunta usando APENAS as informações contidas no "CONTEXTO JURÍDICO OFICIAL" acima.
2. Se a resposta não estiver no texto, diga CLARAMENTE: "A lei fornecida não menciona especificamente este ponto."
3. NÃO invente artigos, números ou multas que não estejam no texto.
4. Cite o nome da lei ou decreto se estiver visível no contexto.
5. Seja direto e profissional.

RESPOSTA:
    `.trim();
  }
}