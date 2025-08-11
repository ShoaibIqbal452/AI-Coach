import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8000';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { detail: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const requestBody = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/v1/progress/adaptive-plan`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying adaptive plan request:', error);
    return NextResponse.json(
      { detail: 'Failed to generate adaptive plan' },
      { status: 500 }
    );
  }
}
