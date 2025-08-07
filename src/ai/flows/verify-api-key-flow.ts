
'use server';

/**
 * @fileOverview Implements a flow to verify an ExchangeRate-API key.
 *
 * - verifyApiKey - A function that checks if a given API key is valid.
 * - VerifyApiKeyInput - The input type for the verifyApiKey function.
 * - VerifyApiKeyOutput - The return type for the verifyApiKey function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import axios from 'axios';

const VerifyApiKeyInputSchema = z.object({
  apiKey: z.string().describe('The ExchangeRate-API key to verify.'),
});
export type VerifyApiKeyInput = z.infer<typeof VerifyApiKeyInputSchema>;

const VerifyApiKeyOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the API key is valid or not.'),
  error: z.string().optional().describe('The error message if the key is invalid.'),
});
export type VerifyApiKeyOutput = z.infer<typeof VerifyApiKeyOutputSchema>;

export async function verifyApiKey(input: VerifyApiKeyInput): Promise<VerifyApiKeyOutput> {
  return verifyApiKeyFlow(input);
}

const verifyApiKeyFlow = ai.defineFlow(
  {
    name: 'verifyApiKeyFlow',
    inputSchema: VerifyApiKeyInputSchema,
    outputSchema: VerifyApiKeyOutputSchema,
  },
  async (input) => {
    if (!input.apiKey) {
      return { isValid: false, error: 'API key is empty.' };
    }

    const url = `https://v6.exchangerate-api.com/v6/${input.apiKey}/latest/USD`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data.result === 'success') {
        return { isValid: true };
      } else {
        // The API returns an error-type field on failure.
        const errorType = data['error-type'] || 'Unknown error';
        console.error('API Key Verification Failed:', errorType);
        return { isValid: false, error: `Invalid API Key. Reason: ${errorType}` };
      }
    } catch (error) {
      console.error('Failed to verify API key:', error);
      return { isValid: false, error: 'Failed to connect to the exchange rate service.' };
    }
  }
);
