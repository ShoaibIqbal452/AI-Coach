import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8000';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = searchParams.get('days') || '30';
    
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { detail: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/progress/analysis?days=${days}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying progress analysis request:', error);
    return NextResponse.json(
      { detail: 'Failed to fetch progress analysis' },
      { status: 500 }
    );
  }
}
