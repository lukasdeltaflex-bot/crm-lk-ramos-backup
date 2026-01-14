
'use server';

/**
 * @fileOverview Define um fluxo Genkit para gerar lembretes de acompanhamento para propostas de longa duração.
 *
 * - followUpReminder - A função para gerar o lembrete de acompanhamento.
 * - FollowUpReminderInput - O tipo de entrada para a função.
 * - FollowUpReminderOutput - O tipo de saída para a função.
 */

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
  // Implementação simulada para evitar erros de chave de API
  return {
    reminderMessage: `Atenção: A proposta ${input.proposalNumber} está em andamento há ${input.daysOpen} dias. Considere contatar o cliente ${input.customerName} para uma atualização.`
  }
}
