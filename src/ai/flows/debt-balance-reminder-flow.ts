'use server';

/**
 * @fileOverview Define um fluxo Genkit para gerar lembretes sobre o prazo de chegada de saldo devedor.
 *
 * - debtBalanceReminder - A função para gerar o lembrete.
 * - DebtBalanceReminderInput - O tipo de entrada para a função.
 * - DebtBalanceReminderOutput - O tipo de saída para a função.
 */

import { ai } from '@/ai/genkit';
import {z} from 'genkit';

const DebtBalanceReminderInputSchema = z.object({
  customerName: z.string().describe('O nome do cliente.'),
  proposalNumber: z.string().describe('O número de identificação da proposta.'),
  daysWaiting: z.number().describe('O número de dias úteis que a proposta está aguardando o saldo.'),
});
export type DebtBalanceReminderInput = z.infer<typeof DebtBalanceReminderInputSchema>;

const DebtBalanceReminderOutputSchema = z.object({
  reminderMessage: z.string().describe('A mensagem de lembrete para o agente de crédito.'),
});
export type DebtBalanceReminderOutput = z.infer<typeof DebtBalanceReminderOutputSchema>;

export async function debtBalanceReminder(input: DebtBalanceReminderInput): Promise<DebtBalanceReminderOutput> {
  return debtBalanceReminderFlow(input);
}

const prompt = ai.definePrompt({
    name: 'debtBalanceReminderPrompt',
    input: { schema: DebtBalanceReminderInputSchema },
    output: { schema: DebtBalanceReminderOutputSchema },
    prompt: `Gere um lembrete conciso e urgente para um agente de crédito. A proposta de portabilidade nº {{{proposalNumber}}} para o cliente {{{customerName}}} está aguardando a chegada do saldo devedor há {{{daysWaiting}}} dias úteis. A mensagem deve alertar que o prazo de 5 dias úteis está se esgotando e sugerir uma verificação sobre a chegada do saldo ou um possível cancelamento. A saída deve ser em português do Brasil.`
});

const debtBalanceReminderFlow = ai.defineFlow(
    {
        name: 'debtBalanceReminderFlow',
        inputSchema: DebtBalanceReminderInputSchema,
        outputSchema: DebtBalanceReminderOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
