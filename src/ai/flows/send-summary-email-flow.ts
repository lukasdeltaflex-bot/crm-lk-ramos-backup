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

// Este prompt é um placeholder. Em um cenário real, você usaria um serviço de e-mail.
const prompt = ai.definePrompt({
    name: 'sendSummaryEmailPrompt',
    input: { schema: SendSummaryEmailInputSchema },
    output: { schema: z.string().nullable() },
    prompt: `Você é um assistente de envio de e-mails. Formate o seguinte resumo para ser enviado por e-mail para {{{recipientName}}}. O conteúdo é: {{{summaryContent}}}. Adicione uma saudação amigável e uma despedida. Apenas retorne o corpo do e-mail formatado.`,
});

const sendSummaryEmailFlow = ai.defineFlow(
  {
    name: 'sendSummaryEmailFlow',
    inputSchema: SendSummaryEmailInputSchema,
    outputSchema: SendSummaryEmailOutputSchema,
  },
  async (input) => {
    // Simula a formatação do e-mail.
    const { output: emailBody } = await prompt(input);

    if (!emailBody) {
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
