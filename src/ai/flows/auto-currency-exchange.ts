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
    // For demonstration purposes, we'll use a fixed set of more realistic rates.
    console.log(`Getting exchange rate from ${input.fromCurrency} to ${input.toCurrency}`);
    
    const rates: {[key: string]: {[key: string]: number}} = {
      USD: { EUR: 0.93, JPY: 157.5, GBP: 0.79, AUD: 1.5, CAD: 1.37, CHF: 0.9, CNY: 7.25, USD: 1 },
      EUR: { USD: 1.08, JPY: 169.5, GBP: 0.85, AUD: 1.62, CAD: 1.47, CHF: 0.97, CNY: 7.8, EUR: 1 },
      GBP: { USD: 1.27, JPY: 199.5, EUR: 1.18, AUD: 1.9, CAD: 1.74, CHF: 1.14, CNY: 9.2, GBP: 1 },
    };

    const fromRate = rates[input.fromCurrency];
    if (fromRate && fromRate[input.toCurrency]) {
      return fromRate[input.toCurrency];
    }
    
    // Fallback for inverse conversion if direct rate isn't defined
    const toRate = rates[input.toCurrency];
    if (toRate && toRate[input.fromCurrency]) {
      return 1 / toRate[input.fromCurrency];
    }
    
    // Default rate if no specific path is found
    if (input.fromCurrency === input.toCurrency) {
        return 1;
    } else {
        return 1.05;
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
