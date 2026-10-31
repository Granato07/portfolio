// Formato que os dois idiomas (pt.ts e en.ts) precisam seguir.
// Se faltar algum campo em um dos idiomas, o `npm run build` avisa.

export type Lang = 'pt' | 'en';

export type CategoriaProjeto = 'backend' | 'qualidade' | 'ia' | 'seguranca' | 'academico';

/** Capa desenhada do projeto, usada quando não há foto. */
export type CapaProjeto =
  | { tipo: 'api'; titulo: string; rotas: [metodo: string, rota: string][]; rodape: string }
  | { tipo: 'testes'; titulo: string; casos: [id: string, nome: string, ok: boolean][]; rodape: string }
  | { tipo: 'monorepo'; titulo: string; arvore: string[]; rodape: string }
  | { tipo: 'pipeline'; titulo: string; etapas: [etapa: string, ferramenta: string][] }
  | { tipo: 'codigo'; titulo: string; linhas: string[]; rodape: string }
  | { tipo: 'linguagens'; titulo: string; itens: [linguagem: string, paradigma: string][] }
  | { tipo: 'ctf'; titulo: string; desafios: string[]; rodape: string };

export interface Projeto {
  id: string;
  nome: string;
  contexto: string;
  periodo: string;
  categorias: CategoriaProjeto[];
  resumo: string;
  detalhes: string[];
  stack: string[];
  repositorio?: string;
  link?: { rotulo: string; url: string };
  capa: CapaProjeto;
  /** nome do arquivo em src/assets/fotos/ (opcional) */
  foto?: string;
  destaque?: boolean;
}

export interface ItemExperiencia {
  tipo: string;
  icone: 'graduation-cap' | 'briefcase' | 'award';
  titulo: string;
  organizacao: string;
  periodo: string;
  local?: string;
  modalidade?: string;
  atual?: boolean;
  descricao: string;
  atividades: string[];
  tags: string[];
}

export interface Conquista {
  titulo: string;
  onde: string;
  quando: string;
  texto: string;
  icone: 'award' | 'trophy' | 'medal' | 'shield';
  /** nome do arquivo em src/assets/fotos/ */
  foto?: string;
}

export interface Conteudo {
  lang: Lang;
  htmlLang: string;
  ogLocale: string;
  meta: { titulo: string; descricao: string };
  nav: { id: string; rotulo: string }[];
  ui: {
    pularConteudo: string;
    baixarCv: string;
    cv: string;
    alternarTema: string;
    abrirMenu: string;
    fecharMenu: string;
    trocarIdioma: string;
    idiomaAlvo: string;
    voltarTopo: string;
    abreNovaAba: string;
    codigo: string;
    detalhes: string;
    fechar: string;
    atual: string;
    anterior: string;
    proximo: string;
    deslize: string;
    copiar: string;
    copiado: string;
  };
  hero: {
    selo: string;
    cargo: string;
    texto: string;
    ctaPrincipal: string;
    ctaSecundario: string;
    rolar: string;
  };
  console: {
    rotulo: string;
    enviar: string;
    enviando: string;
    rodape: string;
    rotasDisponiveis: string;
    rotas: Record<string, unknown>;
    naoEncontrada: { mensagem: string; chaveErro: string; chaveRota: string; chaveRotas: string };
    cafe: Record<string, unknown>;
    arremesso: { acertou: string; errou: string; chaveResultado: string; chaveTentativas: string; chaveAcertos: string; chaveAproveitamento: string };
  };
  sobre: {
    titulo: string;
    subtitulo: string;
    paragrafos: string[];
    focos: { icone: string; titulo: string; texto: string }[];
    fatos: { rotulo: string; valor: string }[];
    ctaContato: string;
    fotoAlt: string;
  };
  github: {
    titulo: string;
    subtitulo: string;
    repos: string;
    linguagem: string;
    linguagens: string;
    ultimoPush: string;
    recentes: string;
    verPerfil: string;
    atualizado: string;
  };
  experiencia: { titulo: string; subtitulo: string; itens: ItemExperiencia[]; atividadesRotulo: string; tagsRotulo: string };
  projetos: {
    titulo: string;
    subtitulo: string;
    filtros: { id: CategoriaProjeto | 'todos'; rotulo: string }[];
    itens: Projeto[];
    oQueFiz: string;
    tecnologias: string;
    /** use {n} onde entra o número */
    contagemUm: string;
    contagemVarios: string;
  };
  habilidades: {
    titulo: string;
    subtitulo: string;
    grupos: { id: string; rotulo: string; itens: string[] }[];
    estudando: string;
    tambem: string;
  };
  conquistas: {
    titulo: string;
    subtitulo: string;
    itens: Conquista[];
    certificadosTitulo: string;
    certificados: { nome: string; emissor: string; ano?: string; url?: string }[];
    verCertificado: string;
  };
  contato: {
    titulo: string;
    subtitulo: string;
    canais: { email: string; whatsapp: string; linkedin: string; github: string };
    dicas: { email: string; whatsapp: string; linkedin: string; github: string };
    formTitulo: string;
    formTexto: string;
    nome: string;
    email: string;
    mensagem: string;
    placeholderNome: string;
    placeholderEmail: string;
    placeholderMensagem: string;
    enviar: string;
    enviando: string;
    sucesso: string;
    erroCampos: string;
    erroLimite: string;
    erroGeral: string;
    local: string;
    disponibilidade: string;
  };
  rodape: { frase: string; direitos: string; feitoCom: string };
  naoEncontrado: { titulo: string; texto: string; voltar: string };
}
