// app/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    status: "ok",
    service: "NormAI WhatsApp Webhook",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
}