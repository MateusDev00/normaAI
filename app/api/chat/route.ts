// app/api/chat/route.ts - ATUALIZADO
import { NextResponse } from 'next/server';
import { LegalAgent } from '@/lib/legal-agent';

export const runtime = 'edge'; // Melhor performance na Vercel

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória e deve ser texto' },
        { status: 400 }
      );
    }

    const agent = new LegalAgent();
    const response = await agent.processQuery(message);

    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na API chat:', error);
    return NextResponse.json(
      { error: 'Serviço temporariamente indisponível' },
      { status: 503 }
    );
  }
}