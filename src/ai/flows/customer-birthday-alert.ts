'use server';

/**
 * @fileOverview Este arquivo define um fluxo Genkit para gerar alertas de aniversário de clientes,
 * especificamente para agentes de crédito que precisam estar cientes dos clientes que se aproximam dos 75 anos.
 *
 * - customerBirthdayAlert - A função para gerar o alerta de aniversário.
 * - CustomerBirthdayAlertInput - O tipo de entrada para a função customerBirthdayAlert.
 * - CustomerBirthdayAlertOutput - O tipo de saída para a função customerBirthdayAlert.
 */

import { ai } from '@/ai/genkit';
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
  return customerBirthdayAlertFlow(input);
}

const prompt = ai.definePrompt({
    name: 'customerBirthdayAlertPrompt',
    input: { schema: CustomerBirthdayAlertInputSchema },
    output: { schema: CustomerBirthdayAlertOutputSchema },
    prompt: `Gere uma mensagem de alerta curta para um agente de crédito sobre um cliente chamado {{{customerName}}} que fará {{{customerAge}}} anos em breve. A mensagem deve ser um lembrete para verificar as políticas de empréstimo para essa idade. A saída deve ser em português do Brasil.`
});

const customerBirthdayAlertFlow = ai.defineFlow(
    {
      name: 'customerBirthdayAlertFlow',
      inputSchema: CustomerBirthdayAlertInputSchema,
      outputSchema: CustomerBirthdayAlertOutputSchema,
    },
    async (input) => {
      const { output } = await prompt(input);
      return output!;
    }
);
