import { NextResponse } from 'next/server';
import { buildLoginUrl } from '../../../lib/keycloak';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const loginUrl = buildLoginUrl(baseUrl);
  return NextResponse.redirect(loginUrl);
}