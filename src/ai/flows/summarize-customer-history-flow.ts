'use server';
/**
 * @fileOverview Um fluxo Genkit para analisar e resumir o histórico financeiro e de relacionamento de um cliente.
 *
 * - summarizeCustomerHistory - A função para chamar o fluxo de sumarização.
 * - SummarizeCustomerHistoryInput - O tipo de entrada (dados do cliente e propostas).
 * - SummarizeCustomerHistoryOutput - O tipo de saída (string com o resumo).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProposalSummarySchema = z.object({
  product: z.string(),
  status: z.string(),
  grossAmount: z.number(),
  netAmount: z.number(),
  commissionValue: z.number(),
});

const SummarizeCustomerHistoryInputSchema = z.object({
  customerName: z.string().describe('O nome do cliente.'),
  customerObservations: z.string().optional().describe('Anotações e observações sobre o cliente.'),
  proposals: z.array(ProposalSummarySchema).describe('Uma lista das propostas de empréstimo associadas ao cliente.'),
});
export type SummarizeCustomerHistoryInput = z.infer<typeof SummarizeCustomerHistoryInputSchema>;

const SummarizeCustomerHistoryOutputSchema = z.string().describe('Um resumo analítico e bem formatado do histórico do cliente.');
export type SummarizeCustomerHistoryOutput = z.infer<typeof SummarizeCustomerHistoryOutputSchema>;

export async function summarizeCustomerHistory(input: SummarizeCustomerHistoryInput): Promise<SummarizeCustomerHistoryOutput> {
  return summarizeCustomerHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCustomerHistoryPrompt',
  input: { schema: SummarizeCustomerHistoryInputSchema },
  output: { schema: SummarizeCustomerHistoryOutputSchema },
  prompt: `Você é um assistente financeiro especialista em análise de crédito e relacionamento com o cliente.
Sua tarefa é analisar o histórico de propostas e as anotações sobre um cliente e gerar um resumo estratégico para o agente de crédito.

O nome do cliente é {{{customerName}}}.

**Histórico de Propostas:**
{{#each proposals}}
- Produto: {{{product}}}, Status: {{{status}}}, Valor Bruto: {{{grossAmount}}}, Comissão: {{{commissionValue}}}
{{/each}}

**Anotações sobre o cliente:**
{{{customerObservations}}}

Com base nessas informações, gere um resumo que contenha:
1.  **Análise Financeira**: Qual o volume total de negócios gerado? Qual o potencial de comissão? O cliente costuma ter propostas aprovadas?
2.  **Análise de Relacionamento**: Com base nas observações, qual o perfil do cliente (ex: "bom relacionamento", "busca urgência", "sensível a taxas")?
3.  **Recomendação Estratégica**: Qual poderia ser o próximo passo com este cliente? (ex: "Oferecer um refinanciamento", "Manter contato para futuras oportunidades", "Requer atenção especial devido a restrições").

Seja conciso, use marcadores (bullet points) para clareza e forneça insights que ajudem o agente a tomar decisões. A saída deve ser em português do Brasil.`,
});

const summarizeCustomerHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeCustomerHistoryFlow',
    inputSchema: SummarizeCustomerHistoryInputSchema,
    outputSchema: SummarizeCustomerHistoryOutputSchema,
  },
  async input => {
    // Se não houver propostas e nem observações, retorne uma mensagem padrão.
    if (input.proposals.length === 0 && !input.customerObservations) {
        return 'Não há dados suficientes para gerar um resumo sobre este cliente. Adicione propostas ou observações para obter uma análise.';
    }
    const { output } = await prompt(input);
    return output!;
  }
);
