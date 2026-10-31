import type { ImageMetadata } from 'astro';

// Carrega tudo que estiver em src/assets/fotos/. O Astro otimiza
// automaticamente (gera WebP/AVIF em tamanhos menores) no build.
const arquivos = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/fotos/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

export function foto(nome?: string): ImageMetadata | undefined {
  if (!nome) return undefined;
  const chave = Object.keys(arquivos).find((k) => k.endsWith(`/${nome}`));
  return chave ? arquivos[chave].default : undefined;
}
