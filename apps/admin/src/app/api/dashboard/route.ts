import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const DASHBOARD_API_BASE_URL = process.env.DASHBOARD_API_BASE_URL ?? 'http://52.65.89.250:8000';

export async function GET(req: NextRequest) {
  const targetUrl = new URL('/api/dashboard', DASHBOARD_API_BASE_URL);
  const startDate = req.nextUrl.searchParams.get('start_date');
  const endDate = req.nextUrl.searchParams.get('end_date');

  if (startDate) targetUrl.searchParams.set('start_date', startDate);
  if (endDate) targetUrl.searchParams.set('end_date', endDate);

  const response = await fetch(targetUrl, {
    method: 'GET',
    cache: 'no-store',
  });

  const text = await response.text();

  return new NextResponse(text, {
    status: response.status,
    headers: {
      'content-type': response.headers.get('content-type') ?? 'application/json',
    },
  });
}
