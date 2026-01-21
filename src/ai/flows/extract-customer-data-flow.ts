'use server';
/**
 * @fileOverview Um fluxo Genkit para extrair dados estruturados de clientes a partir de um texto não estruturado.
 *
 * - extractCustomerData - A função para chamar o fluxo de extração.
 * - ExtractCustomerDataInput - O tipo de entrada (string com o texto).
 * - ExtractCustomerDataOutput - O tipo de saída (objeto com os dados do cliente).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
Você é um assistente de extração de dados altamente preciso e especialista. Sua tarefa é extrair informações de um cliente de um texto bruto e retorná-las como um objeto JSON estruturado. O texto de entrada sempre segue a mesma ESTRUTURA de campos, mas os DADOS de cada cliente são diferentes.

### REGRAS DE EXTRAÇÃO (SEGUIR ESTRITAMENTE)

1.  **CPF / Benefício**: A primeira linha sempre contém \`CPF:\` e \`Benefício:\`.
    *   Extraia o CPF.
    *   Extraia o número do benefício. O campo \`benefits\` no JSON DEVE ser um array de objetos. Exemplo: \`[{ "number": "1588063230" }]\`.

2.  **Nome**: A segunda linha contém o nome completo.
    *   Extraia e formate para Title Case (Ex: "Natalina Santos Peixoto").

3.  **Data de Nascimento**: A terceira linha contém a data e a idade.
    *   Extraia APENAS a data (formato \`DD/MM/YYYY\`).
    *   **CRÍTICO**: Ignore completamente o texto sobre a idade (Ex: "- Idade: 71 anos").
    *   **CRÍTICO**: Converta a data de \`DD/MM/YYYY\` para o formato \`YYYY-MM-DD\`.

4.  **Endereço (Linha 1)**: Esta é a linha mais complexa. Contém rua, número e, opcionalmente, complemento. Siga esta lógica precisa:
    *   **Número (\`number\`)**: Encontre o primeiro grupo de dígitos na linha. Este é o número do endereço.
    *   **Rua (\`street\`)**: É todo o texto que vem ANTES do número.
    *   **Complemento (\`complement\`)**: É todo o texto que vem DEPOIS do número. Se não houver, omita este campo.
    *   **Exemplo A**: "ODETE GORI BICUDO 190" -> \`street\`: "Odete Gori Bicudo", \`number\`: "190".
    *   **Exemplo B**: "AVENIDA PAVAO 700 APTO 83" -> \`street\`: "Avenida Pavao", \`number\`: "700", \`complement\`: "Apto 83".
    *   **Exemplo C**: "SAO PAULO 1240" -> \`street\`: "Sao Paulo", \`number\`: "1240".
    *   Formate \`street\` e \`complement\` para Title Case.

5.  **Outros Campos de Endereço**:
    *   Extraia \`Bairro\`, \`Cidade\` e \`CEP\` de suas respectivas linhas.
    *   Formate \`Bairro\` e \`Cidade\` para Title Case.
    *   Extraia \`Estado\` e mantenha em MAIÚSCULAS (Ex: "SP").

6.  **Regra de Ouro (Não Invente Dados)**: Se o texto de entrada não contiver informações como \`phone\` ou \`email\`, simplesmente omita essas chaves do JSON final. Não adicione valores como \`null\`, \`undefined\` ou strings vazias para campos não encontrados.

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
