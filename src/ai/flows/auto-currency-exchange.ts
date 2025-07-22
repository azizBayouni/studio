'use server';

/**
 * @fileOverview Implements automatic currency exchange during travel mode.
 *
 * - autoCurrencyExchange - A function that converts an amount from one currency to another using a current exchange rate.
 * - AutoCurrencyExchangeInput - The input type for the autoCurrencyExchange function.
 * - AutoCurrencyExchangeOutput - The return type for the autoCurrencyExchange function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoCurrencyExchangeInputSchema = z.object({
  amount: z.number().describe('The amount to convert.'),
  fromCurrency: z.string().describe('The currency to convert from (e.g., USD).'),
  toCurrency: z.string().describe('The currency to convert to (e.g., EUR).'),
});
export type AutoCurrencyExchangeInput = z.infer<typeof AutoCurrencyExchangeInputSchema>;

const AutoCurrencyExchangeOutputSchema = z.object({
  convertedAmount: z.number().describe('The converted amount in the target currency.'),
});
export type AutoCurrencyExchangeOutput = z.infer<typeof AutoCurrencyExchangeOutputSchema>;

export async function autoCurrencyExchange(input: AutoCurrencyExchangeInput): Promise<AutoCurrencyExchangeOutput> {
  return autoCurrencyExchangeFlow(input);
}

const getExchangeRate = ai.defineTool(
  {
    name: 'getExchangeRate',
    description: 'Retrieves the current exchange rate between two currencies.',
    inputSchema: z.object({
      fromCurrency: z.string().describe('The currency to convert from (e.g., USD).'),
      toCurrency: z.string().describe('The currency to convert to (e.g., EUR).'),
    }),
    outputSchema: z.number().describe('The current exchange rate between the two currencies.'),
  },
  async input => {
    // This is a placeholder implementation. In a real application, this would
    // call an external API or database to get the current exchange rate.
    // For demonstration purposes, we'll just return a fixed rate.
    console.log(`Getting exchange rate from ${input.fromCurrency} to ${input.toCurrency}`);
    if (input.fromCurrency === 'USD' && input.toCurrency === 'EUR') {
      return 0.9;
    } else if (input.fromCurrency === 'EUR' && input.toCurrency === 'USD') {
      return 1.1;
    } else if (input.fromCurrency === input.toCurrency) {
      return 1;
    } else {
      return 1.05; // A default exchange rate
    }
  }
);

// This prompt is no longer used by the flow but is kept for potential future use or reference.
const prompt = ai.definePrompt({
  name: 'autoCurrencyExchangePrompt',
  tools: [getExchangeRate],
  input: {schema: AutoCurrencyExchangeInputSchema},
  output: {schema: AutoCurrencyExchangeOutputSchema},
  prompt: `Convert the given amount from one currency to another using the current exchange rate.

Amount: {{amount}}
From Currency: {{fromCurrency}}
To Currency: {{toCurrency}}

Use the getExchangeRate tool to get the current exchange rate.`,
  system: `You are a currency conversion expert. Use the getExchangeRate tool to determine the current exchange rate and convert the amount to the specified currency. Return the converted amount.`, 
});

const autoCurrencyExchangeFlow = ai.defineFlow(
  {
    name: 'autoCurrencyExchangeFlow',
    inputSchema: AutoCurrencyExchangeInputSchema,
    outputSchema: AutoCurrencyExchangeOutputSchema,
  },
  async (input) => {
    if (input.fromCurrency === input.toCurrency) {
      return { convertedAmount: input.amount };
    }
    
    // Directly call the tool to get the exchange rate
    const exchangeRate = await getExchangeRate({ 
        fromCurrency: input.fromCurrency, 
        toCurrency: input.toCurrency 
    });

    // Perform the conversion
    const convertedAmount = input.amount * exchangeRate;
    
    // Return the result in the expected format
    return { convertedAmount };
  }
);
