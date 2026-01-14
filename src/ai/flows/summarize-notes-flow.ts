'use server';
/**
 * @fileOverview Um fluxo Genkit para resumir anotações de clientes.
 *
 * - summarizeNotes - A função para chamar o fluxo de sumarização.
 * - SummarizeNotesInput - O tipo de entrada (string).
 * - SummarizeNotesOutput - O tipo de saída (string).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNotesInputSchema = z.string().describe('As anotações do cliente a serem resumidas.');
export type SummarizeNotesInput = z.infer<typeof SummarizeNotesInputSchema>;

const SummarizeNotesOutputSchema = z.string().describe('As anotações do cliente resumidas e bem formatadas.');
export type SummarizeNotesOutput = z.infer<typeof SummarizeNotesOutputSchema>;

export async function summarizeNotes(input: SummarizeNotesInput): Promise<SummarizeNotesOutput> {
  return summarizeNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNotesPrompt',
  input: {schema: SummarizeNotesInputSchema},
  output: {schema: SummarizeNotesOutputSchema},
  prompt: `Você é um assistente especialista. Sua tarefa é resumir e formatar anotações de clientes para um agente de crédito.
As anotações podem estar bagunçadas, conter erros de digitação ou não estarem estruturadas.
Seu objetivo é criar um resumo limpo, conciso e de fácil leitura.
Use marcadores para informações importantes.
A saída deve ser em português do Brasil.

Aqui estão as anotações:
{{{input}}}

Gere um resumo bem estruturado.`,
});

const summarizeNotesFlow = ai.defineFlow(
  {
    name: 'summarizeNotesFlow',
    inputSchema: SummarizeNotesInputSchema,
    outputSchema: SummarizeNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
