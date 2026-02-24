'use server';
/**
 * @fileOverview Fluxo Genkit para extrair dados de clientes a partir de imagens ou PDFs (OCR).
 *
 * - extractDataFromImage - Função principal para extração via visão computacional multimodal.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BenefitFromImageSchema = z.object({
    number: z.string().optional().describe('Número do benefício INSS.'),
    species: z.string().optional().describe('Espécie do benefício.'),
    salary: z.number().optional().describe('Valor do salário ou benefício.'),
    rmcBank: z.string().optional().describe('Banco da reserva RMC identificado.'),
    rccBank: z.string().optional().describe('Banco da reserva RCC identificado.'),
});

const ExtractFromImageOutputSchema = z.object({
    name: z.string().optional().describe('Nome completo do cliente.'),
    cpf: z.string().optional().describe('CPF formatado 000.000.000-00.'),
    birthDate: z.string().optional().describe('Data de nascimento no formato YYYY-MM-DD.'),
    benefits: z.array(BenefitFromImageSchema).optional().describe('Lista de benefícios, salários e cartões identificados no extrato ou documento.'),
    city: z.string().optional().describe('Cidade do endereço.'),
    state: z.string().optional().describe('Estado (UF) do endereço.'),
    phone: z.string().optional().describe('Telefone de contato encontrado.'),
}).describe('Dados extraídos da imagem ou PDF do documento.');

export type ExtractFromImageOutput = z.infer<typeof ExtractFromImageOutputSchema>;

export async function extractDataFromImage(photoDataUri: string): Promise<ExtractFromImageOutput> {
  return extractDataFromImageFlow({ photoDataUri });
}

const extractDataFromImageFlow = ai.defineFlow(
  {
    name: 'extractDataFromImageFlow',
    inputSchema: z.object({
      photoDataUri: z.string().describe("A imagem ou PDF do documento como data URI Base64."),
    }),
    outputSchema: ExtractFromImageOutputSchema,
  },
  async (input) => {
    // Detecta o mime-type a partir da Data URI para envio correto ao modelo multimodal
    let contentType = 'image/jpeg';
    const match = input.photoDataUri.match(/^data:([^;]+);base64,/);
    if (match) {
        contentType = match[1];
    }

    try {
        const { output } = await ai.generate({
          prompt: [
            { text: `Você é um assistente de elite para correspondentes bancários.
            Analise este documento (RG, CNH, PDF de Extrato de Empréstimos ou Ficha) e extraia os dados estruturados.
            
            REGRAS CRÍTICAS:
            1. Identifique Nome, CPF e Nascimento.
            2. EXTRATOS PDF: Localize todos os Números de Benefício (NB), seus valores de Salário/Mensalidade e bancos de cartões (RMC/RCC).
            3. Formate a data de nascimento como YYYY-MM-DD.
            4. Seja extremamente preciso nos caracteres para evitar erros de digitação.
            5. Se identificar múltiplos benefícios, liste-os individualmente.` },
            { media: { url: input.photoDataUri, contentType: contentType } }
          ],
          output: { schema: ExtractFromImageOutputSchema }
        });

        return output || {};
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("A Inteligência Artificial não conseguiu processar este documento. Verifique se o arquivo não está protegido por senha ou muito pesado.");
    }
  }
);
