import { NextResponse } from 'next/server';

/**
 * 🛡️ BACKEND PROXY (Node.js / Next.js API Route)
 * Esta função roda no servidor e é responsável por consultar o ViaCEP.
 * Removido o cache agressivo para evitar falhas em consultas consecutivas no App Hosting.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ cep: string }> }
) {
  const { cep: rawCep } = await params;
  const cep = rawCep.replace(/\D/g, '');

  if (cep.length !== 8) {
    return NextResponse.json({ error: 'CEP Inválido' }, { status: 400 });
  }

  try {
    // 🛡️ NO-CACHE: Garante que cada busca seja fresca, ideal para testes de múltiplos CEPs
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Serviço externo indisponível' }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('CEP Proxy Error:', error);
    return NextResponse.json({ error: 'Falha na comunicação com o serviço de CEP' }, { status: 500 });
  }
}
