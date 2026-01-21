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
  prompt: `Você é um assistente de IA especialista em análise e extração de dados para um sistema de CRM de correspondentes bancários. Sua tarefa é analisar o texto fornecido, que pode ser uma transcrição de áudio, uma mensagem de WhatsApp, um e-mail ou qualquer texto não estruturado, e extrair as informações do cliente da forma mais precisa e inteligente possível.

**Seja especialista em interpretar formatos estruturados copiados de outros sistemas.**

**Exemplo de formato estruturado comum:**
\`\`\`
CPF: 796.298.908-44 / Benefício: 1588063230

Nome: NATALINA SANTOS PEIXOTO

Data de Nascimento: 25/12/1954 - Idade: 71 anos

Endereço: ODETE GORI BICUDO 190
Bairro: NOVA VOTORANTIM
Cidade: VOTORANTIM - Estado: SP
CEP: 18113-400
\`\`\`

**Análise Detalhada do Exemplo Acima:**
*   **Linha "CPF / Benefício":** Extraia o \`cpf\` e o número do \`benefício\`. O benefício deve ser um item dentro de um array chamado \`benefits\`. O array \`benefits\` deve conter objetos, cada um com a chave \`number\`.
*   **Linha "Nome":** Extraia o \`name\`.
*   **Linha "Data de Nascimento":** Extraia a data (25/12/1954) e converta para o formato 'YYYY-MM-DD' para o campo \`birthDate\`. **Sempre ignore a idade**.
*   **Linha "Endereço":** Extraia o logradouro e o número. "ODETE GORI BICUDO 190" deve ser separado em 'street' ("ODETE GORI BICUDO") e 'number' ("190").
*   **Linhas "Bairro", "Cidade - Estado", "CEP":** Extraia \`neighborhood\`, \`city\`, \`state\`, e \`cep\` de suas respectivas linhas.

**Inteligência e Regras:**

1.  **Interpretação e Inferência:**
    *   **Endereço:** Entenda que os campos de endereço podem vir em múltiplas linhas, como no exemplo. Se o texto mencionar um CEP e outros campos de endereço não estiverem explícitos, tente inferi-los.
    *   **Benefícios Múltiplos:** O cliente pode ter mais de um benefício. Se encontrar múltiplos, extraia todos como objetos individuais dentro do array \`benefits\`.
    *   **Nomes Compostos:** Lide corretamente com nomes completos.

2.  **Limpeza e Formatação de Dados:**
    *   **CPF**: Formate sempre como '000.000.000-00'.
    *   **Telefones**: Formate como '(00) 90000-0000' ou '(00) 0000-0000'.
    *   **CEP**: Formate como '00000-000'.
    *   **Datas**: Converta qualquer formato de data (ex: 30/11/1970, 30 de nov de 70) para o formato padrão **'YYYY-MM-DD'**.
    *   **Caixa Alta/Baixa:** Padronize nomes e endereços para terem a primeira letra de cada palavra em maiúscula (Title Case), exceto para siglas como 'SP'.

3.  **Precisão e Campos Vazios:**
    *   Se uma informação não for encontrada no texto, simplesmente omita a chave do objeto JSON de saída.
    *   **NÃO INVENTE DADOS.** Se não tiver certeza sobre uma informação, prefira deixá-la de fora.
    *   Não inclua o valor "undefined" ou "null" como uma string. Apenas omita o campo.

**Texto para análise:**
{{{input}}}

Analise o texto e gere a saída JSON estruturada com os dados do cliente.`,
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
