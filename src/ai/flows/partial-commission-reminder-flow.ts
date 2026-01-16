'use server';

/**
 * @fileOverview Define um fluxo Genkit para gerar lembretes para cobrar comissões pagas parcialmente.
 *
 * - partialCommissionReminder - A função para gerar o lembrete.
 * - PartialCommissionReminderInput - O tipo de entrada para a função.
 * - PartialCommissionReminderOutput - O tipo de saída para a função.
 */

import { ai } from '@/ai/genkit';
import {z} from 'genkit';

const PartialCommissionReminderInputSchema = z.object({
  customerName: z.string().describe('O nome do cliente.'),
  proposalNumber: z.string().describe('O número de identificação da proposta.'),
  amountPaid: z.number().describe('O valor parcial da comissão que já foi pago.'),
  totalCommission: z.number().describe('O valor total da comissão esperado.'),
  daysSincePayment: z.number().describe('O número de dias desde o pagamento parcial.'),
});
export type PartialCommissionReminderInput = z.infer<typeof PartialCommissionReminderInputSchema>;

const PartialCommissionReminderOutputSchema = z.object({
  reminderMessage: z.string().describe('A mensagem de lembrete para o agente de crédito.'),
});
export type PartialCommissionReminderOutput = z.infer<typeof PartialCommissionReminderOutputSchema>;

export async function partialCommissionReminder(input: PartialCommissionReminderInput): Promise<PartialCommissionReminderOutput> {
  return partialCommissionReminderFlow(input);
}

const prompt = ai.definePrompt({
    name: 'partialCommissionReminderPrompt',
    input: { schema: PartialCommissionReminderInputSchema },
    output: { schema: PartialCommissionReminderOutputSchema },
    prompt: `Gere um lembrete para um agente de crédito. A comissão da proposta nº {{{proposalNumber}}} para o cliente {{{customerName}}} foi paga parcialmente (R$ {{{amountPaid}}} de R$ {{{totalCommission}}}) há {{{daysSincePayment}}} dias. A mensagem deve sugerir a cobrança do valor restante junto à promotora/banco. A saída deve ser em português do Brasil.`
});

const partialCommissionReminderFlow = ai.defineFlow(
    {
        name: 'partialCommissionReminderFlow',
        inputSchema: PartialCommissionReminderInputSchema,
        outputSchema: PartialCommissionReminderOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
