import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const promptText = "Generate a single unique and creative name for a Filipino male character. The name should be a traditional or modern Filipino name. Do not include any other text, just the name.";
    const payload = {
      contents: [{
        parts: [{
          text: promptText
        }]
      }]
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response:', errorText);
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    const generatedName = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    const name = generatedName?.replace(/["']+/g, '') || "Pogi";
    
    return NextResponse.json({ name });
  } catch (error: any) {
    console.error('Name generation error:', error);
    return NextResponse.json({ name: "Pogi" }, { status: 200 });
  }
}