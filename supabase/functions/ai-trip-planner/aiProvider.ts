export interface AIProvider {
  generateTrip(systemPrompt: string, userPrompt: string, tools?: any[]): Promise<any>;
}

export class GeminiProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = Deno.env.get('GEMINI_API_KEY') || '';
    this.model = Deno.env.get('GEMINI_MODEL') || 'gemini-1.5-flash';
  }

  async generateTrip(systemPrompt: string, userPrompt: string, tools?: any[]): Promise<any> {
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in Edge Function secrets.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini Error:", errorText);
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOutput) {
       throw new Error("Gemini API returned an empty or malformed response.");
    }
    
    return JSON.parse(textOutput);
  }
}
