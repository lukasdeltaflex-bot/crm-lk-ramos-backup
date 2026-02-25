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
  bank: z.string().optional(),
  dateDigitized: z.string().optional(),
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

// O esquema de saída da Flow continua sendo uma string para compatibilidade com o componente UI
const SummarizeCustomerHistoryOutputSchema = z.string().describe('Um resumo analítico e bem formatado do histórico do cliente.');
export type SummarizeCustomerHistoryOutput = z.infer<typeof SummarizeCustomerHistoryOutputSchema>;

// Esquema interno do prompt para garantir que a IA retorne JSON válido
const PromptOutputSchema = z.object({
  analysis: z.string().describe('O resumo estratégico detalhado e formatado.'),
});

export async function summarizeCustomerHistory(input: SummarizeCustomerHistoryInput): Promise<SummarizeCustomerHistoryOutput> {
  return summarizeCustomerHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCustomerHistoryPrompt',
  input: { schema: SummarizeCustomerHistoryInputSchema },
  output: { schema: PromptOutputSchema },
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `Você é um assistente financeiro de elite da LK RAMOS INVESTIMENTOS.
Sua missão é gerar uma análise estratégica resumida do perfil do cliente {{{customerName}}}.

HISTÓRICO DE OPERAÇÕES:
{{#each proposals}}
- Data: {{{dateDigitized}}}, Banco: {{{bank}}}, Produto: {{{product}}}, Status: {{{status}}}, Valor Bruto: R$ {{{grossAmount}}}, Comissão: R$ {{{commissionValue}}}
{{/each}}

OBSERVAÇÕES ADICIONAIS:
{{{customerObservations}}}

ESTRUTURA DO RESUMO (Retorne no campo "analysis"):
1. 📈 **Análise Financeira**: Resuma o volume total e a rentabilidade (comissões). Mencione se o cliente tem alta taxa de aprovação ou muitas reprovações.
2. 🤝 **Perfil de Relacionamento**: Baseado nas observações, qual o comportamento dele? (Ex: busca urgência, fiel a um banco, cliente difícil, etc).
3. 🚀 **Recomendação de Ouro**: Qual o próximo passo óbvio? (Ex: Oferecer Refinanciamento pois o último contrato tem 1 ano, ou aguardar margem livre).

Seja direto, profissional e use um tom de consultoria para o agente de crédito. Use marcadores e negrito para facilitar a leitura rápida.
A saída deve ser em português do Brasil.`,
});

const summarizeCustomerHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeCustomerHistoryFlow',
    inputSchema: SummarizeCustomerHistoryInputSchema,
    outputSchema: SummarizeCustomerHistoryOutputSchema,
  },
  async input => {
    // Validação básica de dados
    if (input.proposals.length === 0 && !input.customerObservations) {
        return 'Não há dados suficientes para gerar um resumo sobre este cliente. Adicione propostas ou observações para obter uma análise estratégica.';
    }

    try {
        const { output } = await prompt(input);
        
        if (!output || !output.analysis) {
            throw new Error('Resposta da IA veio vazia ou malformada.');
        }

        return output.analysis;
    } catch (error) {
        console.error("Summarize Flow Error:", error);
        return 'A IA não conseguiu processar os dados no momento devido a um erro técnico ou filtro de segurança. Por favor, tente novamente em alguns instantes.';
    }
  }
);