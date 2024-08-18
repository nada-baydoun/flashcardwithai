import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Test API route is working' });
}

// Add this line to test if the file is being loaded
console.log('test/route.js file loaded');