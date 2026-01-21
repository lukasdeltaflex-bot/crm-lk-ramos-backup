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
  prompt: `Você é um assistente de IA especialista e altamente preciso, treinado para analisar texto e extrair dados de clientes para um sistema de CRM.

**Sua Missão Principal:**
Analisar um bloco de texto que foi copiado de outro sistema. O texto de entrada **SEMPRE** seguirá uma estrutura consistente, mas os dados do cliente serão diferentes a cada vez. Sua tarefa é extrair os dados e retorná-los em formato JSON, seguindo o schema de saída fornecido. Você deve ser capaz de lidar com variações nos dados, como endereços com ou sem complemento.

**Exemplo de Texto de Entrada (Padrão A):**
\`\`\`
CPF: 796.298.908-44 / Benefício: 1588063230

Nome: NATALINA SANTOS PEIXOTO

Data de Nascimento: 25/12/1954 - Idade: 71 anos

Endereço: ODETE GORI BICUDO 190
Bairro: NOVA VOTORANTIM
Cidade: VOTORANTIM - Estado: SP
CEP: 18113-400
\`\`\`

**Exemplo de Texto de Entrada (Padrão B com Complemento):**
\`\`\`
CPF: 986.101.206-00 / Benefício: 545406412

Nome: JEUSA CRISTINA NERY DE OLIVEIRA

Data de Nascimento: 31/05/1969 - Idade: 56 anos

Endereço: AVENIDA PAVAO 700 APTO 83
Bairro: INDIANOPOLIS
Cidade: SAO PAULO - Estado: SP
CEP: 04516-012
\`\`\`

**Análise Detalhada da Estrutura e Regras de Extração:**

1.  **Linha "CPF / Benefício":**
    *   Extraia o valor após "CPF:". Este é o \`cpf\`.
    *   Extraia o valor após "Benefício:". Este é o número do benefício.
    *   Coloque o benefício dentro de um array \`benefits\`, como um objeto com a chave \`number\`.

2.  **Linha "Nome":**
    *   Extraia o valor completo após "Nome:". Este é o \`name\`.

3.  **Linha "Data de Nascimento":**
    *   Extraia **APENAS** a data (ex: "25/12/1954"). Ignore completamente o texto que vem depois, como "- Idade: 71 anos".

4.  **Linha "Endereço":**
    *   Esta é a linha mais complexa. Siga esta lógica:
    *   **Identifique o complemento primeiro:** procure por palavras-chave como "APTO", "APARTAMENTO", "BLOCO", "CASA". Tudo a partir dessas palavras é o \`complement\`.
    *   **Identifique o número:** O número do endereço é o valor numérico que vem imediatamente antes do complemento (se houver) ou no final da linha.
    *   **Identifique a rua:** Todo o texto restante no início da linha é a \`street\`.
    *   Exemplo 1: "ODETE GORI BICUDO 190" -> \`street\`: "ODETE GORI BICUDO", \`number\`: "190".
    *   Exemplo 2: "AVENIDA PAVAO 700 APTO 83" -> \`street\`: "AVENIDA PAVAO", \`number\`: "700", \`complement\`: "APTO 83".

5.  **Linha "Cidade - Estado":**
    *   Extraia o valor antes de "- Estado:" como a \`city\`.
    *   Extraia o valor após "- Estado:" como o \`state\` (geralmente uma sigla de 2 letras).

6.  **Linhas "Bairro" e "CEP":**
    *   Extraia \`neighborhood\` e \`cep\` de suas respectivas linhas.

**REGRAS DE FORMATAÇÃO (OBRIGATÓRIO):**

*   **CPF**: Formate como '000.000.000-00'.
*   **CEP**: Formate como '00000-000'.
*   **Datas**: Converta **SEMPRE** para o formato **'YYYY-MM-DD'**.
*   **Caixa Alta/Baixa:** Padronize nomes e endereços para terem a primeira letra de cada palavra em maiúscula (Title Case). Mantenha siglas como 'SP' em maiúsculo.

**REGRA MAIS IMPORTANTE (PRECISÃO):**

*   **NÃO INVENTE DADOS.** Se uma informação (como 'email' ou 'telefone') não estiver presente no texto de entrada, simplesmente omita o campo do JSON de saída.
*   Seja estritamente aderente ao schema de saída. Não inclua "undefined" ou "null" como strings. Apenas omita os campos não encontrados.

**Texto para análise:**
{{{input}}}

Analise o texto acima seguindo TODAS as regras e gere a saída JSON estruturada.`,
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
