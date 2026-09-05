import { isCloseMatch, similarity } from '../textMatch';

describe('isCloseMatch', () => {
  const target = "It's raining cats and dogs";

  it('accepts an exact match regardless of case/punctuation', () => {
    expect(isCloseMatch("it's raining cats and dogs.", target)).toBe(true);
    expect(isCloseMatch('ITS RAINING CATS AND DOGS', target)).toBe(true);
  });

  it('tolerates a small typo', () => {
    expect(isCloseMatch("it's raning cats and dogs", target)).toBe(true);
  });

  it('rejects a short fragment of the correct phrase (the old exploit)', () => {
    // No sistema antigo, "cats" era aceite como certo porque a frase certa
    // "contém" a resposta. Isto tinha de deixar de acontecer.
    expect(isCloseMatch('cats', target)).toBe(false);
    expect(isCloseMatch('dogs', target)).toBe(false);
  });

  it('rejects an empty or unrelated answer', () => {
    expect(isCloseMatch('', target)).toBe(false);
    expect(isCloseMatch('completely unrelated sentence here', target)).toBe(false);
  });

  it('similarity is 1 for identical normalized strings', () => {
    expect(similarity('Hello!', 'hello')).toBe(1);
  });
});
