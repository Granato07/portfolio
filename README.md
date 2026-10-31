# Portfólio de Daniel Granato

Site pessoal em português e inglês, feito com [Astro](https://astro.build) e TypeScript.

- **Páginas:** `/` (português) e `/en/` (inglês).
- **Estático por padrão:** quase tudo vira HTML pronto no build. Só o formulário de contato (`/api/contato`) roda no servidor, como função da Vercel.
- **Nenhuma chave no navegador:** a chave do Resend (e-mail) e o token do GitHub ficam em variáveis de ambiente no servidor.

## Rodar no seu computador

Pré-requisito: [Node.js](https://nodejs.org) 22 ou mais novo.

```bash
npm install      # baixa as dependências (só na primeira vez)
npm run dev      # abre em http://localhost:4321 e atualiza sozinho ao salvar
npm run build    # confere os tipos e gera a versão final
```

## Editar o conteúdo

| O que mudar | Onde |
| --- | --- |
| Textos em português (sobre, projetos, experiência, conquistas…) | `src/conteudo/pt.ts` |
| Textos em inglês | `src/conteudo/en.ts` (mesma estrutura) |
| Links, e-mail, WhatsApp, currículo, foto de perfil | `src/data/comum.ts` |
| Ícone de uma tecnologia nova | `tecnologias` em `src/data/comum.ts` (nomes em [simpleicons.org](https://simpleicons.org)) |
| Cores e fontes | `src/styles/global.css` (topo do arquivo) |

Os dois idiomas seguem o mesmo formato (`src/conteudo/tipos.ts`). Se você adicionar um campo em um e esquecer no outro, o `npm run build` avisa.

**Novo projeto:** copie um bloco dentro de `projetos.itens` nos dois idiomas. Em `categorias`, escolha entre `backend`, `qualidade`, `ia`, `seguranca` e `academico` para ele aparecer nos filtros. `destaque: true` deixa o card maior e no topo. A `capa` é o desenho que aparece no lugar da foto. Há 7 tipos prontos (`api`, `testes`, `monorepo`, `pipeline`, `codigo`, `linguagens` e `ctf`), descritos em `tipos.ts`.

**Currículo:** substitua `public/curriculo-daniel-granato.pdf`. Quando tiver a versão em inglês, coloque em `public/` e aponte `curriculo.en` em `comum.ts` para ela.

### Fotos

1. Coloque a imagem em `src/assets/fotos/` (jpg, png ou webp). Pode ser grande: o Astro reduz e converte no build.
2. Escreva o nome do arquivo no campo `foto`.

| Onde aparece | Campo | Formato ideal |
| --- | --- | --- |
| Sobre mim | `perfil.foto` em `comum.ts` | retrato (4:5) |
| Conquistas (DeMolay, basquete, JUBs, Atlética, cibersegurança) | `foto` de cada conquista, em `pt.ts` **e** `en.ts` | paisagem (16:10) |
| Capa de projeto (opcional) | `foto` do projeto | paisagem |

Sem foto, o site mostra um visual próprio no lugar. Nada fica quebrado.

## Publicar na Vercel (grátis)

1. **Crie um repositório no GitHub** e envie a pasta. O `.gitignore` já impede que `node_modules`, `dist` e `.env` subam.
   ```bash
   git init
   git add .
   git commit -m "Portfólio"
   git branch -M main
   git remote add origin https://github.com/Granato07/portfolio.git
   git push -u origin main
   ```
2. **Entre em [vercel.com](https://vercel.com)** com o GitHub e clique em *Add New > Project*.
3. **Importe o repositório** e clique em *Deploy*. A Vercel reconhece o Astro sozinha.
4. O site fica no ar em `https://<nome-do-projeto>.vercel.app`, e cada `git push` atualiza o site.
5. **Ajuste o endereço no código:** troque `https://danielgranato.vercel.app` pelo endereço real em `astro.config.mjs`, `src/data/comum.ts` e `public/robots.txt`. Assim o preview do link no LinkedIn e no WhatsApp mostra a imagem certa.

**Domínio próprio (opcional):** depois de comprar um `.dev` ou `.com.br`, adicione em *Project > Settings > Domains*.

### Ativar o formulário de contato

O formulário usa o [Resend](https://resend.com), que tem plano gratuito.

1. Crie a conta no Resend e gere uma API key em *API Keys*.
2. Na Vercel, em *Project > Settings > Environment Variables*, crie:
   - `RESEND_API_KEY`: a chave gerada.
   - `CONTACT_TO_EMAIL`: o e-mail que vai receber as mensagens. Sem domínio próprio, o Resend só envia para o e-mail da sua conta, então use esse.
   - `CONTACT_FROM_EMAIL` (opcional): só quando tiver um domínio verificado no Resend.
3. Faça um novo deploy (*Deployments > Redeploy*).

Enquanto as variáveis não existirem, o formulário mostra uma mensagem com o seu e-mail para a pessoa escrever direto. Para tirar o formulário do site, troque `formularioAtivo` para `false` em `comum.ts`.

Proteções do formulário (`src/pages/api/contato.ts`):
- aceita só requisições vindas do próprio site;
- campo invisível e tempo mínimo de preenchimento barram robôs;
- limite de 3 mensagens a cada 10 minutos por IP;
- validação de tamanho e formato dos campos no servidor, não só no navegador.

## Segurança

- **Cabeçalhos HTTP** em `vercel.json`:
  - `Content-Security-Policy`: o navegador só executa scripts do próprio site. Nenhum script inline nem de terceiros, o que bloqueia a maioria dos ataques de XSS.
  - `Strict-Transport-Security`: força HTTPS.
  - `X-Frame-Options` e `frame-ancestors`: o site não pode ser embutido em outro (evita clickjacking).
  - `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`.
- **Fontes servidas pelo próprio site**, sem Google Fonts: nenhum dado do visitante vai para terceiros.
- **Console do topo:** tudo que o visitante digita é escapado antes de aparecer na tela.
- **Links externos** com `rel="noopener noreferrer"`.

Depois de publicar, teste o endereço em [securityheaders.com](https://securityheaders.com). Deve dar nota A.

## Dados do GitHub

A seção "Atividade no GitHub" é montada no build: repositórios públicos, linguagens e os 4 repositórios atualizados mais recentemente. Repositórios em `reposOcultos` (`comum.ts`) não aparecem. Se a API do GitHub não responder, o site usa os dados de reserva em `githubReserva`.

- **Token (opcional):** se o build esbarrar no limite da API, crie um token em *GitHub > Settings > Developer settings > Fine-grained tokens*, sem marcar permissão nenhuma. Depois cadastre como `GITHUB_TOKEN` na Vercel.
- **Atualização diária (opcional):** crie um Deploy Hook na Vercel (*Settings > Git > Deploy Hooks*). Salve a URL como segredo `VERCEL_DEPLOY_HOOK` no GitHub (*Settings > Secrets and variables > Actions*). O workflow `.github/workflows/atualizar-site.yml` refaz o site todo dia.

## Estrutura

```
src/
  conteudo/        textos: pt.ts, en.ts e o formato em tipos.ts
  data/comum.ts    links, contatos, fotos, tecnologias
  assets/fotos/    suas fotos
  components/      cada seção da página
  lib/             GitHub, fotos, ícones, formatação de JSON
  pages/           / , /en/ , 404 e api/contato
  styles/          cores, fontes e estilos gerais
public/            currículo, ícones e imagens de preview
```

## Animações

As animações ficam em `src/lib/animacoes.ts`, e os estilos no fim de `src/styles/global.css`.

- `class="reveal"`: o elemento sobe com fade quando entra na tela.
- `data-anim="left"`, `"right"`, `"zoom"`, `"fade"` ou `"blur"`: muda o tipo de entrada.
- `style="--d: 120ms"`: atrasa a entrada, para criar sequência entre cards.
- `data-brilho`: brilho roxo que acompanha o mouse no cartão.
- `data-contar`: número que conta até o valor final.

Quem ativou "reduzir movimento" no sistema vê tudo sem animação, e sem JavaScript o conteúdo aparece normalmente.

## Easter eggs

No console do topo, tente `GET /v1/cafe` ou `GET /v1/arremesso`.
