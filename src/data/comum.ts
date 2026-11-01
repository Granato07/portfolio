// =====================================================================
//  DADOS QUE NÃO MUDAM COM O IDIOMA
//  Textos ficam em src/conteudo/pt.ts e src/conteudo/en.ts.
// =====================================================================

export const site = {
  // Troque pelo seu domínio definitivo quando publicar.
  url: 'https://danielgranato.vercel.app',
};

export const perfil = {
  nome: 'Daniel Granato',
  nomeCompleto: 'Daniel Granato Botelho Poscidonio',
  iniciais: 'DG',
  // Foto da seção "Sobre" (formato retrato). Ex.: 'perfil.jpg' em src/assets/fotos/
  foto: 'perfil.jpg',
  // Currículos para download (coloque os PDFs em public/).
  // Enquanto não houver versão em inglês, as duas apontam para o mesmo arquivo.
  curriculo: {
    pt: '/curriculo-daniel-granato.pdf',
    en: '/curriculo-daniel-granato.pdf',
  },
};

export const contatos = {
  email: 'daniel.granato@ges.inatel.br',
  whatsappNumero: '5535997404107',
  whatsappExibicao: '+55 (35) 99740-4107',
  linkedin: 'https://www.linkedin.com/in/danielgranato',
  linkedinExibicao: 'in/danielgranato',
  github: 'https://github.com/Granato07',
  githubUsuario: 'Granato07',
};

// Formulário de contato: precisa das variáveis RESEND_API_KEY e
// CONTACT_TO_EMAIL configuradas na Vercel (veja o README).
// Para esconder o formulário, troque para false.
export const formularioAtivo = true;

// Repositórios que NÃO devem aparecer na lista automática do GitHub.
export const reposOcultos = ['Granato07', 'MiniProjeto_Mobicar-s'];

// Usado se a API do GitHub não responder durante o build.
export const githubReserva = {
  repos: 9,
  linguagemPrincipal: 'TypeScript',
  linguagens: ['TypeScript', 'Java', 'Python', 'C++', 'HTML'],
  recentes: [
    { nome: 'task-api', descricao: 'API REST de tarefas em Node.js + TypeScript, com SQLite e testes automatizados.', linguagem: 'TypeScript', url: 'https://github.com/Granato07/task-api' },
    { nome: 'QA-swaglabs', descricao: 'Projeto de QA sobre o SauceDemo: casos de teste, relatórios de bug e automação E2E com Playwright.', linguagem: 'TypeScript', url: 'https://github.com/Granato07/QA-swaglabs' },
    { nome: 'CTF-write-up', descricao: null, linguagem: null, url: 'https://github.com/Granato07/CTF-write-up' },
    { nome: 'S01', descricao: 'Exercícios de paradigmas de programação em 10 linguagens (Inatel).', linguagem: 'C++', url: 'https://github.com/Granato07/S01' },
  ],
};

// ---------------------------------------------------------------------
//  TECNOLOGIAS: nome exibido -> ícone do simple-icons (ou sigla).
//  Lista de ícones: https://simpleicons.org
// ---------------------------------------------------------------------
export const tecnologias: Record<string, { icone?: string; sigla?: string }> = {
  'Node.js': { icone: 'siNodedotjs' },
  TypeScript: { icone: 'siTypescript' },
  JavaScript: { icone: 'siJavascript' },
  Express: { icone: 'siExpress' },
  SQLite: { icone: 'siSqlite' },
  SQL: { sigla: 'SQL' },
  'Drizzle ORM': { icone: 'siDrizzle' },
  'APIs REST': { sigla: 'API' },
  Vitest: { icone: 'siVitest' },
  Supertest: { sigla: 'ST' },
  Playwright: { sigla: 'PW' },
  Postman: { icone: 'siPostman' },
  Insomnia: { icone: 'siInsomnia' },
  Git: { icone: 'siGit' },
  GitHub: { icone: 'siGithub' },
  'GitHub Actions': { icone: 'siGithubactions' },
  Docker: { icone: 'siDocker' },
  pnpm: { icone: 'siPnpm' },
  npm: { icone: 'siNpm' },
  Trello: { icone: 'siTrello' },
  Python: { icone: 'siPython' },
  Java: { icone: 'siOpenjdk' },
  'C++': { icone: 'siCplusplus' },
  HTML: { icone: 'siHtml5' },
  CSS: { icone: 'siCss' },
  Haskell: { icone: 'siHaskell' },
  Prolog: { sigla: 'PL' },
  Lisp: { icone: 'siCommonlisp' },
  Rust: { icone: 'siRust' },
  Lua: { icone: 'siLua' },
  'C#': { icone: 'siDotnet' },
  Pandas: { icone: 'siPandas' },
  NumPy: { icone: 'siNumpy' },
  Jupyter: { icone: 'siJupyter' },
  Seaborn: { sigla: 'SNS' },
  Matplotlib: { sigla: 'MPL' },
  Claude: { icone: 'siClaude' },
  Gemini: { icone: 'siGooglegemini' },
  'Gemini API': { icone: 'siGooglegemini' },
  Groq: { sigla: 'GQ' },
  'Groq API': { sigla: 'GQ' },
  v0: { icone: 'siV0' },
  'Next.js': { icone: 'siNextdotjs' },
  Vercel: { icone: 'siVercel' },
  'scikit-learn': { icone: 'siScikitlearn' },
  'Structured outputs': { sigla: '{ }' },
  ChatGPT: { sigla: 'GPT' },
  ElevenLabs: { icone: 'siElevenlabs' },
  'Google Flow': { sigla: 'FL' },
  'Prompt engineering': { sigla: '>_' },
  AWS: { sigla: 'AWS' },
  Kaggle: { icone: 'siKaggle' },
  Astro: { icone: 'siAstro' },
};
