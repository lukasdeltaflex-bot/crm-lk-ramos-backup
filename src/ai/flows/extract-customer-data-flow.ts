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
  prompt: `
### TAREFA
Você é um assistente especialista em extração de dados. Sua tarefa é extrair informações de clientes de um bloco de texto bruto e retorná-las como um objeto JSON estruturado.

### TEXTO DE ENTRADA
A entrada é um bloco de texto bruto, geralmente copiado e colado de outro sistema. Geralmente, segue este padrão, mas pode haver pequenas variações.

**Exemplo 1 (Endereço Simples):**
CPF: 796.298.908-44 / Benefício: 1588063230
Nome: NATALINA SANTOS PEIXOTO
Data de Nascimento: 25/12/1954 - Idade: 71 anos
Endereço: ODETE GORI BICUDO 190
Bairro: NOVA VOTORANTIM
Cidade: VOTORANTIM - Estado: SP
CEP: 18113-400

**Exemplo 2 (Endereço Complexo):**
CPF: 986.101.206-00 / Benefício: 545406412
Nome: JEUSA CRISTINA NERY DE OLIVEIRA
Data de Nascimento: 31/05/1969 - Idade: 56 anos
Endereço: AVENIDA PAVAO 700 APTO 83
Bairro: INDIANOPOLIS
Cidade: SAO PAULO - Estado: SP
CEP: 04516-012

### REGRAS DE EXTRAÇÃO

1.  **Linha CPF/Benefício**:
    *   \`cpf\`: Extraia de \`CPF:\`.
    *   \`benefits\`: Extraia de \`Benefício:\`. O resultado deve ser um array, ex: \`[{ "number": "1588063230" }]\`.

2.  **Linha Nome**:
    *   \`name\`: Extraia o nome completo de \`Nome:\`.

3.  **Linha Data de Nascimento**:
    *   \`birthDate\`: Extraia APENAS a data (ex: "25/12/1954").
    *   **CRÍTICO**: IGNORE tudo depois da data, como "- Idade: 71 anos".

4.  **Linha Endereço**: Esta é a parte mais importante.
    *   O formato é \`[NOME DA RUA] [NÚMERO] [COMPLEMENTO]\`.
    *   \`street\`: O nome da rua/avenida.
    *   \`number\`: O número do imóvel.
    *   \`complement\`: Qualquer informação de apartamento/bloco (ex: "APTO 83"). Se não estiver presente, este campo deve ser omitido.
    *   **Exemplo 1 "ODETE GORI BICUDO 190"**: \`street\` é "ODETE GORI BICUDO", \`number\` é "190".
    *   **Exemplo 2 "AVENIDA PAVAO 700 APTO 83"**: \`street\` é "AVENIDA PAVAO", \`number\` é "700", \`complement\` é "APTO 83".
    *   Você deve ser capaz de distinguir o número do nome da rua e do complemento.

5.  **Linha Bairro**:
    *   \`neighborhood\`: Extraia de \`Bairro:\`.

6.  **Linha Cidade/Estado**:
    *   \`city\`: Extraia de \`Cidade:\`.
    *   \`state\`: Extraia de \`Estado:\`.

7.  **Linha CEP**:
    *   \`cep\`: Extraia de \`CEP:\`.

### REGRAS DE FORMATAÇÃO DE SAÍDA (OBRIGATÓRIO)

*   **Datas**: SEMPRE converta \`DD/MM/YYYY\` para \`YYYY-MM-DD\`.
*   **Capitalização**: Converta \`name\` e todas as partes do endereço para Title Case (ex: "Natalina Santos Peixoto", "Avenida Pavao"). Códigos de estado (ex: "SP") devem permanecer em maiúsculas.
*   **Dados Ausentes**: Se um campo não estiver no texto (ex: \`email\`, \`phone\`), NÃO o inclua no JSON de saída. Omita a chave completamente. Não use \`null\` ou \`undefined\`.

### TEXTO PARA PROCESSAR
{{{input}}}

Agora, analise o bloco de texto acima e produza a saída JSON estruturada de acordo com todas as regras.`,
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
