import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, originDesc, cuteness, confidence, tiliFactor } = await request.json();
    
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const promptText = `
      You are a lore generator for a fictional universe called "Kapogian Chibis".
      A Kapogian Chibi is a confident, good-looking Filipino male.
      Their stats are: Cuteness is ${cuteness} out of 100, Confidence is ${confidence} out of 100, and Tili Factor is ${tiliFactor} out of 100.
      Create a detailed lore for a Kapogian Chibi named **${name}**, a ${originDesc}.
      The lore should be about 150 words and include a backstory, personality description influenced by their stats, a heroic anecdote, and a concluding sentence.
      Do not mention the exact stat numbers in the narrative. Focus on the creative description.
      Use markdown formatting like bolding and italics to make the text stylish.
    `;
    
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
    const generatedLore = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    const lore = generatedLore || 'No lore generated.';
    
    return NextResponse.json({ lore });
  } catch (error: any) {
    console.error('Lore generation error:', error);
    return NextResponse.json({ lore: 'Failed to generate lore.' }, { status: 200 });
  }
}