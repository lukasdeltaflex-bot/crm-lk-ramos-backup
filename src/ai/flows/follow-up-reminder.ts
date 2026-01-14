
'use server';

/**
 * @fileOverview Define um fluxo Genkit para gerar lembretes de acompanhamento para propostas de longa duração.
 *
 * - followUpReminder - A função para gerar o lembrete de acompanhamento.
 * - FollowUpReminderInput - O tipo de entrada para a função.
 * - FollowUpReminderOutput - O tipo de saída para a função.
 */

import { ai } from '@/ai/genkit';
import {z} from 'genkit';

const FollowUpReminderInputSchema = z.object({
  customerName: z.string().describe('O nome do cliente.'),
  proposalNumber: z.string().describe('O número de identificação da proposta.'),
  daysOpen: z.number().describe('O número de dias que a proposta está no status "Em Andamento".'),
});
export type FollowUpReminderInput = z.infer<typeof FollowUpReminderInputSchema>;

const FollowUpReminderOutputSchema = z.object({
  reminderMessage: z.string().describe('A mensagem de lembrete para o agente de crédito.'),
});
export type FollowUpReminderOutput = z.infer<typeof FollowUpReminderOutputSchema>;

export async function followUpReminder(input: FollowUpReminderInput): Promise<FollowUpReminderOutput> {
  return followUpReminderFlow(input);
}

const prompt = ai.definePrompt({
    name: 'followUpReminderPrompt',
    input: { schema: FollowUpReminderInputSchema },
    output: { schema: FollowUpReminderOutputSchema },
    prompt: `Gere um lembrete conciso para um agente de crédito. A proposta de empréstimo nº {{{proposalNumber}}} para o cliente {{{customerName}}} está aberta há {{{daysOpen}}} dias. A mensagem deve sugerir um contato com o cliente para uma atualização. A saída deve ser em português do Brasil.`
});

const followUpReminderFlow = ai.defineFlow(
    {
        name: 'followUpReminderFlow',
        inputSchema: FollowUpReminderInputSchema,
        outputSchema: FollowUpReminderOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
