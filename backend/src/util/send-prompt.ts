import { AppError } from '@core/app-error';
import { ai } from '../core/ai';

export async function sendPrompt(userPrompt: string, schema?: any) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Recommended for fast, general-purpose tasks
      contents: userPrompt,
      config: {
        temperature: 0.7, // Controls randomness (0.0 is deterministic, 1.0 is creative)
        maxOutputTokens: schema ? 1000 : 200, // Limits the length of the response
        responseMimeType: schema ? 'application/json' : 'text/plain',
        responseSchema: schema,
      },
    });

    // 3. Extract the text response
    const outputText = response.text;
    console.log('\n--- Gemini Response ---');
    console.log(outputText);
    console.log('------------------------');

    if (schema && outputText) {
      return JSON.parse(outputText);
    }

    return outputText;
  } catch (error) {
    console.error('An error occurred while sending prompt to AI:', error);
    // let this error get handled by global error handler
    throw AppError.InternalServerError(error);
  }
}
