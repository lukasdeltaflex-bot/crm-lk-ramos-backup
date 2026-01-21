'use server';
/**
 * @fileOverview Um fluxo Genkit para extrair dados estruturados de clientes a partir de um texto não estruturado.
 *
 * - extractCustomerData - A função para chamar o fluxo de extração.
 * - ExtractCustomerDataInput - O tipo de entrada (string com o texto).
 * - ExtractCustomerDataOutput - O tipo de saída (objeto com os dados do cliente).
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const BenefitSchema = z.object({
    number: z.string().describe("O número do benefício INSS do cliente."),
    species: z.string().optional().describe("A espécie do benefício (ex: Aposentadoria por Idade, Pensão por Morte)."),
});

const ExtractCustomerDataOutputSchema = z.object({
    name: z.string().optional().describe('O nome completo do cliente.'),
    cpf: z.string().optional().describe('O CPF do cliente (formato 000.000.000-00).'),
    benefits: z.array(BenefitSchema).optional().describe('Uma lista de benefícios do cliente, cada um com número e espécie.'),
    phone: z.string().optional().describe('O número de telefone principal do cliente (formato (00) 90000-0000).'),
    phone2: z.string().optional().describe('Um segundo número de telefone do cliente, se houver (formato (00) 90000-0000).'),
    email: z.string().optional().describe('O endereço de e-mail do cliente.'),
    birthDate: z.string().optional().describe('A data de nascimento do cliente no formato YYYY-MM-DD.'),
    cep: z.string().optional().describe('O CEP do endereço do cliente (formato 00000-000).'),
    street: z.string().optional().describe('O logradouro (rua, avenida) do cliente.'),
    number: z.string().optional().describe('O número do endereço do cliente.'),
    complement: z.string().optional().describe('O complemento do endereço (apto, bloco).'),
    neighborhood: z.string().optional().describe('O bairro do cliente.'),
    city: z.string().optional().describe('A cidade do cliente.'),
    state: z.string().optional().describe('O estado (UF) do cliente.'),
}).describe('Os dados extraídos do cliente.');
export type ExtractCustomerDataOutput = z.infer<typeof ExtractCustomerDataOutputSchema>;

export async function extractCustomerData(text: string): Promise<ExtractCustomerDataOutput> {
  return extractCustomerDataFlow(text);
}

const prompt = ai.definePrompt({
  name: 'extractCustomerDataPrompt',
  input: { schema: z.string() },
  output: { schema: ExtractCustomerDataOutputSchema },
  prompt: `### TAREFA
Você é um assistente de extração de dados especialista e altamente preciso. Sua tarefa é analisar o texto de entrada e extrair as informações para preencher um objeto JSON. O texto de entrada sempre segue a mesma ESTRUTURA de campos, mas os DADOS de cada cliente são diferentes. Siga as regras estritamente.

### ESTRUTURA DO TEXTO DE ENTRADA
O texto sempre seguirá este padrão:
Linha 1: \`CPF: {cpf} / Benefício: {numero_beneficio}\`
Linha 2: \`Nome: {nome_completo}\`
Linha 3: \`Data de Nascimento: {dd/mm/aaaa} - Idade: {idade} anos\`
Linha 4: \`Endereço: {logradouro} {numero} {complemento_opcional}\`
Linha 5: \`Bairro: {bairro}\`
Linha 6: \`Cidade: {cidade} - Estado: {estado}\`
Linha 7: \`CEP: {cep}\`

### REGRAS DE EXTRAÇÃO E FORMATAÇÃO (OBRIGATÓRIO)

1.  **CPF**: Extraia o valor do CPF da Linha 1.
2.  **Benefício**: Extraia o valor do Benefício da Linha 1. O resultado no JSON para o campo \`benefits\` DEVE ser um array de objetos, como neste exemplo: \`[{ "number": "1588063230" }]\`.
3.  **Nome**: Extraia o nome completo da Linha 2. Formate para Title Case (Ex: "Natalina Santos Peixoto").
4.  **Data de Nascimento**: Extraia APENAS a data da Linha 3. **CRÍTICO**: Ignore completamente o texto sobre a idade (Ex: "- Idade: 71 anos"). **CRÍTICO**: Converta a data do formato \`DD/MM/YYYY\` para o formato \`YYYY-MM-DD\`.
5.  **Endereço (Lógica Precisa)**: Esta é a parte mais importante.
    *   Na linha de Endereço, encontre o **primeiro bloco de dígitos numéricos**. Este será o valor para o campo \`number\` no JSON.
    *   Todo o texto que vem **ANTES** do \`number\` é o valor do campo \`street\`.
    *   Todo o texto que vem **DEPOIS** do \`number\` (se houver) é o valor do campo \`complement\`.
    *   **Exemplo 1**: "ODETE GORI BICUDO 190" -> \`street\`: "Odete Gori Bicudo", \`number\`: "190".
    *   **Exemplo 2**: "AVENIDA PAVAO 700 APTO 83" -> \`street\`: "Avenida Pavao", \`number\`: "700", \`complement\`: "Apto 83".
    *   **Exemplo 3**: "SAO PAULO 1240" -> \`street\`: "Sao Paulo", \`number\`: "1240".
    *   Formate os campos \`street\` e \`complement\` para Title Case.
6.  **Outros Campos de Endereço**: Extraia Bairro, Cidade, Estado e CEP de suas respectivas linhas. Formate Bairro e Cidade para Title Case. Mantenha Estado em MAIÚSCULAS.
7.  **Regra de Ouro (Não Invente Dados)**: Se o texto de entrada não contiver informações como \`phone\` ou \`email\`, simplesmente omita essas chaves do JSON final. Não adicione valores como \`null\`, \`undefined\` ou strings vazias para campos não encontrados.

### TEXTO PARA PROCESSAR
{{{input}}}

Agora, analise o texto acima e produza o JSON estruturado seguindo TODAS as regras estritamente.`,
});

const extractCustomerDataFlow = ai.defineFlow(
  {
    name: 'extractCustomerDataFlow',
    inputSchema: z.string(),
    outputSchema: ExtractCustomerDataOutputSchema,
  },
  async (input) => {
    if (!input || input.trim() === '') {
        throw new Error('O texto de entrada não pode estar vazio.');
    }
    const { output } = await prompt(input);
    return output!;
  }
);
