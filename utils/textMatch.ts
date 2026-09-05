// Comparação tolerante de respostas escritas pelo utilizador (desafio diário,
// exercício de listening) contra a frase certa — tolera erros de pontuação e
// pequenos typos, mas NÃO aceita fragmentos parciais como certos (ao contrário
// da verificação antiga que aceitava qualquer substring de >3 caracteres).

export function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[.?!,;:'"]/g, '')
    .replace(/\s+/g, ' ');
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = new Array(n + 1);
  let curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1, // remoção
        curr[j - 1] + 1, // inserção
        prev[j - 1] + cost, // substituição
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

export function similarity(a: string, b: string): number {
  const na = normalizeAnswer(a);
  const nb = normalizeAnswer(b);
  if (na === nb) return 1;
  const maxLen = Math.max(na.length, nb.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(na, nb) / maxLen;
}

// threshold 0.82: tolera 1-2 typos numa frase curta, mas rejeita respostas
// parciais/erradas (ex.: escrever só uma palavra da frase completa).
export function isCloseMatch(answer: string, target: string, threshold = 0.82): boolean {
  if (!normalizeAnswer(answer)) return false;
  return similarity(answer, target) >= threshold;
}
