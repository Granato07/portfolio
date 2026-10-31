// =====================================================================
//  Animações da página
//  - .reveal: aparece com transição quando entra na tela (uma vez só)
//  - [data-visto]: ganha a classe .visto quando entra na tela (permanente)
//  - [data-contar]: número que conta de 0 até o valor final
//  - [data-brilho]: brilho que acompanha o mouse
//  - barra de progresso de leitura e botão de voltar ao topo
//  Tudo respeita "reduzir movimento" do sistema.
// =====================================================================

const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const raiz = document.documentElement;

function contar(el: HTMLElement) {
  const fim = Number(el.dataset.contar);
  if (!Number.isFinite(fim) || semMovimento) return;
  const inicio = performance.now();
  const dur = 1200;
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
  window.setTimeout(() => {
    el.classList.remove('reveal', 'is-in');
    el.removeAttribute('data-anim');
  }, atraso + 1000);
}

const naTela = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight * 0.92 && r.bottom > 0 && r.width > 0;
};

const elementos = [...document.querySelectorAll<HTMLElement>('.reveal')];
const vistos = [...document.querySelectorAll<HTMLElement>('[data-visto]')];

if (semMovimento || !('IntersectionObserver' in window)) {
  vistos.forEach((v) => v.classList.add('visto'));
} else {
  // O que já está na tela ao carregar aparece direto, sem piscar
  elementos.filter(naTela).forEach((el) => {
    el.classList.add('is-in');
    window.setTimeout(() => el.classList.remove('reveal', 'is-in'), 1200);
  });
  raiz.classList.add('anima');

  const obs = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        if (el.classList.contains('reveal')) revelar(el);
        if (el.hasAttribute('data-visto')) el.classList.add('visto');
        if (!el.hasAttribute('data-visto') || el.classList.contains('visto')) obs.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  elementos.filter((el) => el.classList.contains('reveal')).forEach((el) => obs.observe(el));
  vistos.forEach((v) => (naTela(v) ? v.classList.add('visto') : obs.observe(v)));

  // Brilho que segue o mouse
  document.querySelectorAll<HTMLElement>('[data-brilho]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

// Barra de progresso e botão de voltar ao topo
const barra = document.querySelector<HTMLElement>('[data-progresso]');
const topo = document.querySelector<HTMLElement>('[data-topo]');
let agendado = false;
const atualizar = () => {
  agendado = false;
  const max = raiz.scrollHeight - window.innerHeight;
  const p = max > 0 ? window.scrollY / max : 0;
  barra?.style.setProperty('--progresso', p.toFixed(4));
  topo?.toggleAttribute('data-visivel', window.scrollY > window.innerHeight * 0.9);
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
