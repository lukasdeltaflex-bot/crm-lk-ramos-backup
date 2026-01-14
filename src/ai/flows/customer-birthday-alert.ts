'use server';

/**
 * @fileOverview Este arquivo define um fluxo Genkit para gerar alertas de aniversário de clientes,
 * especificamente para agentes de crédito que precisam estar cientes dos clientes que se aproximam dos 75 anos.
 *
 * - customerBirthdayAlert - A função para gerar o alerta de aniversário.
 * - CustomerBirthdayAlertInput - O tipo de entrada para a função customerBirthdayAlert.
 * - CustomerBirthdayAlertOutput - O tipo de saída para a função customerBirthdayAlert.
 */

import {z} from 'genkit';

const CustomerBirthdayAlertInputSchema = z.object({
  customerName: z.string().describe('O nome do cliente.'),
  customerAge: z.number().describe('A idade do cliente.'),
});
export type CustomerBirthdayAlertInput = z.infer<typeof CustomerBirthdayAlertInputSchema>;

const CustomerBirthdayAlertOutputSchema = z.object({
  alertMessage: z.string().describe('A mensagem de alerta para o agente de crédito.'),
});
export type CustomerBirthdayAlertOutput = z.infer<typeof CustomerBirthdayAlertOutputSchema>;

export async function customerBirthdayAlert(input: CustomerBirthdayAlertInput): Promise<CustomerBirthdayAlertOutput> {
  // Implementação simulada para evitar erros de chave de API
  return {
    alertMessage: `Lembrete: O aniversário de 75 anos de ${input.customerName} está se aproximando.`
  }
}
