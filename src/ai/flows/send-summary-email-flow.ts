'use server';

/**
 * @fileOverview Define um fluxo Genkit para "enviar" um resumo por e-mail.
 *
 * - sendSummaryEmail - A função para processar o envio do e-mail de resumo.
 * - SendSummaryEmailInput - O tipo de entrada para a função.
 * - SendSummaryEmailOutput - O tipo de saída para a função.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SendSummaryEmailInputSchema = z.object({
  recipientName: z.string().describe('O nome do destinatário.'),
  recipientEmail: z.string().email().describe('O e-mail do destinatário.'),
  summaryContent: z.string().describe('O conteúdo do resumo diário em formato de texto.'),
});
export type SendSummaryEmailInput = z.infer<typeof SendSummaryEmailInputSchema>;

const SendSummaryEmailOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SendSummaryEmailOutput = z.infer<typeof SendSummaryEmailOutputSchema>;

export async function sendSummaryEmail(input: SendSummaryEmailInput): Promise<SendSummaryEmailOutput> {
  return sendSummaryEmailFlow(input);
}

const sendSummaryEmailFlow = ai.defineFlow(
  {
    name: 'sendSummaryEmailFlow',
    inputSchema: SendSummaryEmailInputSchema,
    outputSchema: SendSummaryEmailOutputSchema,
  },
  async (input) => {
    // Formata o e-mail diretamente no código, sem chamar a IA.
    const emailBody = `Olá, ${input.recipientName}!

Aqui está o seu resumo diário de pendências:

${input.summaryContent}

Atenciosamente,
Seu Assistente LK Ramos
`.trim();

    if (!emailBody) {
      // Este caso é agora virtualmente impossível, mas mantido por segurança.
      return { success: false, message: 'Falha ao formatar o corpo do e-mail.' };
    }

    // Em uma implementação real, aqui você chamaria um serviço de e-mail (ex: SendGrid, Nodemailer)
    // com o input.recipientEmail e o emailBody.
    console.log(`(Simulação) E-mail enviado para: ${input.recipientEmail}`);
    console.log(`(Simulação) Corpo do E-mail:\n${emailBody}`);

    // Como não temos um serviço de e-mail real, vamos apenas simular o sucesso.
    return { success: true, message: 'E-mail de resumo enviado com sucesso!' };
  }
);
