
'use server';

/**
 * @fileOverview Implements automatic currency exchange during travel mode.
 *
 * This flow now accepts a pre-fetched exchange rate and performs the conversion.
 * The exchange rate should be fetched on the client-side.
 *
 * - autoCurrencyExchange - A function that converts an amount from one currency to another using a provided exchange rate.
 * - AutoCurrencyExchangeInput - The input type for the autoCurrencyExchange function.
 * - AutoCurrencyExchangeOutput - The return type for the autoCurrencyExchange function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoCurrencyExchangeInputSchema = z.object({
  amount: z.number().describe('The amount to convert.'),
  exchangeRate: z.number().describe('The pre-fetched exchange rate to use for the conversion.'),
});
export type AutoCurrencyExchangeInput = z.infer<typeof AutoCurrencyExchangeInputSchema>;

const AutoCurrencyExchangeOutputSchema = z.object({
  convertedAmount: z.number().describe('The converted amount in the target currency.'),
});
export type AutoCurrencyExchangeOutput = z.infer<typeof AutoCurrencyExchangeOutputSchema>;

export async function autoCurrencyExchange(input: AutoCurrencyExchangeInput): Promise<AutoCurrencyExchangeOutput> {
  return autoCurrencyExchangeFlow(input);
}

const autoCurrencyExchangeFlow = ai.defineFlow(
  {
    name: 'autoCurrencyExchangeFlow',
    inputSchema: AutoCurrencyExchangeInputSchema,
    outputSchema: AutoCurrencyExchangeOutputSchema,
  },
  async (input) => {
    // Perform the conversion using the provided rate
    const convertedAmount = input.amount * input.exchangeRate;
    
    // Return the result in the expected format
    return { convertedAmount };
  }
);
