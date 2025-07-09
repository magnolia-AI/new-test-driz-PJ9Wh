import { NextResponse } from 'next/server';

export async function GET() {
  /*
    WARNING: Exposing all environment variables can be a significant security risk.
    This endpoint is intended for debugging in a controlled development environment ONLY.
    Do NOT deploy this to production without filtering out sensitive keys.
  */
  const envVars = process.env;

  return NextResponse.json(envVars);
}

