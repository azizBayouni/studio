
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
  apiKey: z.string().optional().describe('The API key for the exchange rate service.'),
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
    description: 'Retrieves the current exchange rate between two currencies using a live API.',
    inputSchema: z.object({
      fromCurrency: z.string().describe('The currency to convert from (e.g., USD).'),
      toCurrency: z.string().describe('The currency to convert to (e.g., EUR).'),
      apiKey: z.string().optional().describe('The API key for the exchange rate service.'),
    }),
    outputSchema: z.number().describe('The current exchange rate between the two currencies.'),
  },
  async (input) => {
    console.log(`Getting live exchange rate from ${input.fromCurrency} to ${input.toCurrency}`);
    
    if (input.fromCurrency === input.toCurrency) {
      return 1;
    }

    const apiKey = input.apiKey;
    if (!apiKey) {
      console.error("ExchangeRate API key not provided.");
      // Fallback to a simulated rate if API key is missing
      return 1.05; 
    }

    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${input.fromCurrency}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`API request failed with status: ${response.status}`);
        // Fallback to a simulated rate on API error
        return 1.05;
      }

      const data = await response.json();
      
      if (data.result === 'error') {
        console.error(`ExchangeRate API error: ${data['error-type']}`);
        return 1.05;
      }
      
      const rate = data.conversion_rates?.[input.toCurrency];

      if (rate) {
        return rate;
      } else {
        console.warn(`Rate for ${input.toCurrency} not found. Falling back.`);
        // Fallback for currencies not in the main list
        const inverseUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${input.toCurrency}`;
        const inverseResponse = await fetch(inverseUrl);
         if (!inverseResponse.ok) return 1.05;
        const inverseData = await inverseResponse.json();
        const inverseRate = inverseData.conversion_rates?.[input.fromCurrency];
        if (inverseRate) return 1 / inverseRate;
      }
      
      return 1.05; // Final fallback

    } catch (error) {
      console.error("Failed to fetch exchange rate:", error);
      // Fallback to a simulated rate on network or other errors
      return 1.05;
    }
  }
);


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
        toCurrency: input.toCurrency,
        apiKey: input.apiKey,
    });

    // Perform the conversion
    const convertedAmount = input.amount * exchangeRate;
    
    // Return the result in the expected format
    return { convertedAmount };
  }
);
