// Dados do GitHub buscados no momento do BUILD (no servidor da Vercel),
// nunca no navegador de quem visita. Assim nenhum token vai para o público
// e o visitante não depende do limite de requisições da API.
// GITHUB_TOKEN é opcional. Sem o prefixo PUBLIC_, o Astro nunca o envia ao navegador.

import { githubReserva, reposOcultos } from '../data/comum';

export interface Repo {
  nome: string;
  descricao: string | null;
  linguagem: string | null;
  url: string;
  atualizadoEm?: string;
}

export interface ResumoGithub {
  repos: number;
  linguagemPrincipal: string;
  linguagens: string[];
  ultimoPush?: string;
  recentes: Repo[];
  aoVivo: boolean;
}

async function api<T>(caminho: string): Promise<T | null> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-daniel-granato',
  };
  const token = import.meta.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const r = await fetch(`https://api.github.com${caminho}`, { headers, signal: AbortSignal.timeout(8000) });
    return r.ok ? ((await r.json()) as T) : null;
  } catch {
    return null;
  }
}

let cache: Promise<ResumoGithub> | undefined;

export function resumoGithub(usuario: string): Promise<ResumoGithub> {
  cache ??= montar(usuario);
  return cache;
}

async function montar(usuario: string): Promise<ResumoGithub> {
  const u = encodeURIComponent(usuario);
  const [perfil, lista] = await Promise.all([
    api<{ public_repos: number }>(`/users/${u}`),
    api<Array<Record<string, any>>>(`/users/${u}/repos?sort=pushed&per_page=100`),
  ]);

  if (!perfil || !lista) return { ...githubReserva, aoVivo: false };

  const proprios = lista.filter((r) => !r.fork && !r.archived && !reposOcultos.includes(r.name));
  const contagem = new Map<string, number>();
  for (const r of proprios) if (r.language) contagem.set(r.language, (contagem.get(r.language) ?? 0) + 1);
  const linguagens = [...contagem.entries()].sort((a, b) => b[1] - a[1]).map(([l]) => l);

  return {
    repos: perfil.public_repos,
    linguagemPrincipal: linguagens[0] ?? githubReserva.linguagemPrincipal,
    linguagens: linguagens.slice(0, 6),
    ultimoPush: proprios[0]?.pushed_at,
    recentes: proprios.slice(0, 4).map((r) => ({
      nome: String(r.name),
      descricao: r.description ? String(r.description) : null,
      linguagem: r.language ? String(r.language) : null,
      url: String(r.html_url),
      atualizadoEm: String(r.pushed_at),
    })),
    aoVivo: true,
  };
}
