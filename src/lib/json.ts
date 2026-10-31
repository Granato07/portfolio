// Formata e colore um JSON. Roda no servidor (primeira resposta já vem no
// HTML) e no navegador (respostas do console). Escapa o texto antes de
// colorir, então nada que o visitante digita vira HTML.

const escapar = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function jsonColorido(valor: unknown): string[] {
  const texto = escapar(JSON.stringify(valor, null, 2));
  const html = texto.replace(
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?)/g,
    (m) => {
      let cls = 'j-num';
      if (m.startsWith('"')) cls = m.endsWith(':') ? 'j-key' : 'j-str';
      else if (/^(true|false|null)$/.test(m)) cls = 'j-bool';
      return `<span class="${cls}">${m}</span>`;
    },
  );
  return html.split('\n');
}
