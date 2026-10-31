import { pt } from './pt';
import { en } from './en';
import type { Conteudo, Lang } from './tipos';

export const conteudos: Record<Lang, Conteudo> = { pt, en };

/** Caminho da página inicial em cada idioma. */
export const rotaIdioma: Record<Lang, string> = { pt: '/', en: '/en/' };

export type { Conteudo, Lang } from './tipos';
