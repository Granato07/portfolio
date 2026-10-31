// =====================================================================
//  Animações da página
//  - .reveal: aparece com transição quando entra na tela (uma vez só)
//  - [data-visto]: ganha a classe .visto quando entra na tela (permanente)
//  - [data-contar]: número que conta de 0 até o valor final
//  - [data-brilho]: brilho que acompanha o mouse
//  - [data-tilt]: inclinação 3D que segue o mouse
//  - [data-desliza]: texto que anda para os lados conforme a rolagem
//  - [data-luz]: luz do topo que segue o mouse
//  - [data-relogio]: horário local de Santa Rita do Sapucaí
//  - barra de progresso de leitura e botão de voltar ao topo
//  Com "reduzir movimento" ligado no sistema, o CSS troca tudo por fades
//  curtos e os efeitos que seguem o mouse ou a rolagem ficam desligados.
// =====================================================================

const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mouseFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const raiz = document.documentElement;

function contar(el: HTMLElement) {
  const fim = Number(el.dataset.contar);
  if (!Number.isFinite(fim) || semMovimento) return;
  const inicio = performance.now();
  const dur = 1400;
  const passo = (t: number) => {
    const p = Math.min((t - inicio) / dur, 1);
    el.textContent = String(Math.round(fim * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(passo);
  };
  el.textContent = '0';
  requestAnimationFrame(passo);
}

function revelar(el: HTMLElement) {
  if (el.classList.contains('is-in')) return;
  el.classList.add('is-in');
  el.querySelectorAll<HTMLElement>('[data-contar]').forEach(contar);
  // Depois da entrada, devolve o elemento às transições normais (hover etc.)
  const atraso = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
  const palavras = el.querySelectorAll('.palavras .w').length;
  window.setTimeout(() => {
    el.classList.remove('reveal', 'is-in');
    el.removeAttribute('data-anim');
  }, atraso + 1100 + palavras * 70);
}

const naTela = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight * 0.9 && r.bottom > 0 && r.width > 0;
};

// ---------------------------------------------------------------------
//  Entradas ao rolar
// ---------------------------------------------------------------------
const elementos = [...document.querySelectorAll<HTMLElement>('.reveal')];
const vistos = [...document.querySelectorAll<HTMLElement>('[data-visto]')];

if (!('IntersectionObserver' in window)) {
  vistos.forEach((v) => v.classList.add('visto'));
} else {
  raiz.classList.add('anima', 'anima-ok');
  const obs = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        if (el.classList.contains('reveal')) revelar(el);
        if (el.hasAttribute('data-visto')) el.classList.add('visto');
        obs.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );
  // O que já está na tela ao carregar também anima (com um pequeno atraso para o navegador pintar o estado inicial)
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      elementos.forEach((el) => (naTela(el) ? revelar(el) : obs.observe(el)));
      vistos.forEach((v) => (naTela(v) ? v.classList.add('visto') : obs.observe(v)));
    }),
  );
}

// ---------------------------------------------------------------------
//  Efeitos que seguem o mouse (só com mouse, e sem "reduzir movimento")
// ---------------------------------------------------------------------
if (!semMovimento && mouseFino) {
  document.querySelectorAll<HTMLElement>('[data-brilho]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.classList.add('inclinando');
      el.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
    });
    el.addEventListener('pointerleave', () => {
      el.classList.remove('inclinando');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });

  const luz = document.querySelector<HTMLElement>('[data-luz]');
  const hero = luz?.closest('section');
  hero?.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    luz!.style.setProperty('--hx', `${e.clientX - r.left}px`);
    luz!.style.setProperty('--hy', `${e.clientY - r.top}px`);
  });
}

// ---------------------------------------------------------------------
//  Rolagem: barra de progresso, botão de topo e textos que deslizam
// ---------------------------------------------------------------------
const barra = document.querySelector<HTMLElement>('[data-progresso]');
const topo = document.querySelector<HTMLElement>('[data-topo]');
const deslizantes = semMovimento ? [] : [...document.querySelectorAll<HTMLElement>('[data-desliza]')];
let agendado = false;

const atualizar = () => {
  agendado = false;
  const max = raiz.scrollHeight - window.innerHeight;
  barra?.style.setProperty('--progresso', (max > 0 ? window.scrollY / max : 0).toFixed(4));
  topo?.toggleAttribute('data-visivel', window.scrollY > window.innerHeight * 0.9);
  for (const el of deslizantes) {
    const r = el.getBoundingClientRect();
    if (r.bottom < -200 || r.top > window.innerHeight + 200) continue;
    const centro = r.top + r.height / 2 - window.innerHeight / 2;
    const dir = Number(el.dataset.desliza) || 1;
    el.style.transform = `translate3d(calc(-20% + ${(centro * 0.35 * dir).toFixed(1)}px), 0, 0)`;
  }
};
window.addEventListener(
  'scroll',
  () => {
    if (!agendado) {
      agendado = true;
      requestAnimationFrame(atualizar);
    }
  },
  { passive: true },
);
window.addEventListener('resize', atualizar);
atualizar();

// ---------------------------------------------------------------------
//  Relógio local
// ---------------------------------------------------------------------
const relogio = document.querySelector<HTMLElement>('[data-relogio]');
if (relogio) {
  const formato = new Intl.DateTimeFormat(relogio.dataset.lang || 'pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
  const tic = () => {
    relogio.textContent = (relogio.dataset.relogio ?? '').replace('{hora}', formato.format(new Date()));
  };
  tic();
  window.setInterval(tic, 15_000);
}
