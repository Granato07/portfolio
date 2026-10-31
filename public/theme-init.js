// Aplica o tema antes da página aparecer, para não piscar.
// Padrão: escuro. Se a pessoa escolheu o claro no botão, respeita.
// Fica num arquivo separado (e não inline) para a CSP bloquear scripts inline.
(function () {
  var tema = 'dark';
  try {
    var salvo = localStorage.getItem('tema');
    if (salvo === 'light' || salvo === 'dark') tema = salvo;
  } catch (e) {}
  document.documentElement.setAttribute('data-theme', tema);
  // Esconde os elementos animados desde o primeiro quadro (o script de animações revela)
  if ('IntersectionObserver' in window) document.documentElement.classList.add('anima');
})();
