// =====================================================================
//  POST /api/contato
//  Recebe a mensagem do formulário e envia para o seu e-mail pelo Resend.
//  Roda no servidor (função da Vercel): a chave da API nunca chega ao
//  navegador de quem visita.
//
//  Variáveis de ambiente (Vercel > Settings > Environment Variables):
//    RESEND_API_KEY     chave do Resend (obrigatória)
//    CONTACT_TO_EMAIL   e-mail que recebe as mensagens (obrigatório)
//    CONTACT_FROM_EMAIL remetente verificado no Resend (opcional;
//                       padrão: "Portfólio <onboarding@resend.dev>")
// =====================================================================
import type { APIRoute } from 'astro';
import { site } from '../../data/comum';

export const prerender = false;

const LIMITE_POR_JANELA = 3;
const JANELA_MS = 10 * 60 * 1000;
const tentativas = new Map<string, number[]>(); // por IP, em memória (melhor esforço)

const resposta = (status: number, corpo: Record<string, unknown> = {}) =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

const limpar = (v: unknown, max: number) =>
  typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max) : '';

const emailValido = (e: string) => /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}$/.test(e);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // 1. Só aceita requisições vindas do próprio site
  const origem = request.headers.get('origin');
  const permitidas = [new URL(site.url).origin, new URL(request.url).origin];
  if (origem && !permitidas.includes(origem)) return resposta(403, { erro: 'origem' });

  if (!(request.headers.get('content-type') ?? '').includes('application/json')) return resposta(415, { erro: 'formato' });

  let dados: Record<string, unknown>;
  try {
    const texto = await request.text();
    if (texto.length > 10_000) return resposta(413, { erro: 'tamanho' });
    dados = JSON.parse(texto);
  } catch {
    return resposta(400, { erro: 'json' });
  }

  // 2. Armadilhas para robôs: campo invisível preenchido ou envio rápido demais.
  //    Responde "ok" para o robô não perceber que foi barrado.
  if (limpar(dados.site, 200) || Number(dados.tempo) < 2500) return resposta(200, { ok: true });

  // 3. Limite de envios por IP
  const ip = clientAddress ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'desconhecido';
  const agora = Date.now();
  const recentes = (tentativas.get(ip) ?? []).filter((t) => agora - t < JANELA_MS);
  if (recentes.length >= LIMITE_POR_JANELA) return resposta(429, { erro: 'limite' });
  tentativas.set(ip, [...recentes, agora]);

  // 4. Validação
  const nome = limpar(dados.nome, 80);
  const email = limpar(dados.email, 120);
  const mensagem = limpar(dados.mensagem, 2000);
  const idioma = dados.idioma === 'en' ? 'en' : 'pt';
  if (!nome || !emailValido(email) || mensagem.length < 10) return resposta(400, { erro: 'campos' });

  // 5. Envio pelo Resend
  const chave = import.meta.env.RESEND_API_KEY;
  const para = import.meta.env.CONTACT_TO_EMAIL;
  const de = import.meta.env.CONTACT_FROM_EMAIL || 'Portfólio <onboarding@resend.dev>';
  if (!chave || !para) return resposta(503, { erro: 'nao-configurado' });

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: de,
        to: [para],
        reply_to: email,
        subject: `Portfólio: mensagem de ${nome}`,
        text: `Nome: ${nome}\nE-mail: ${email}\nIdioma do site: ${idioma}\n\n${mensagem}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!r.ok) return resposta(502, { erro: 'envio' });
    return resposta(200, { ok: true });
  } catch {
    return resposta(502, { erro: 'envio' });
  }
};

// Qualquer outro método nesta rota
export const ALL: APIRoute = () => resposta(405, { erro: 'metodo' });
