import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'ledger-ai',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
    },
    { status: 200 }
  );
}

