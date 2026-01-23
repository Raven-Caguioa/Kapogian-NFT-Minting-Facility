import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const promptText = "Generate a name of a foreign country, do not include any other text.";
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
    const generatedCountry = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    const country = generatedCountry?.replace(/["']+/g, '') || "a foreign land";
    
    return NextResponse.json({ country });
  } catch (error: any) {
    console.error('Country generation error:', error);
    return NextResponse.json({ country: "a foreign land" }, { status: 200 });
  }
}