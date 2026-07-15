import { LEARNING_PATH } from '../path';
import { GRAMMAR_EXERCISES, GRAMMAR_NOTES } from '../grammarExercises';
import { FLASHCARD_DATA } from '../bookContent';

describe('LEARNING_PATH integrity', () => {
  it('has no duplicate node ids', () => {
    const ids = LEARNING_PATH.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every grammar node has at least one exercise', () => {
    const grammarNodes = LEARNING_PATH.filter((n) => n.type === 'grammar');
    for (const node of grammarNodes) {
      const count = GRAMMAR_EXERCISES.filter((e) => e.noteId === node.refId).length;
      expect(count).toBeGreaterThan(0);
    }
  });

  it('every grammar node references a note that exists', () => {
    const noteIds = new Set(GRAMMAR_NOTES.map((n) => n.id));
    const grammarNodes = LEARNING_PATH.filter((n) => n.type === 'grammar');
    for (const node of grammarNodes) {
      expect(noteIds.has(node.refId)).toBe(true);
    }
  });

  it('every vocabulary node has at least one flashcard in that category', () => {
    const vocabNodes = LEARNING_PATH.filter((n) => n.type === 'vocabulary');
    for (const node of vocabNodes) {
      const count = FLASHCARD_DATA.filter((c) => c.category === node.refId).length;
      expect(count).toBeGreaterThan(0);
    }
  });

  it('every grammar note that has exercises is reachable from the path', () => {
    // Guards against silently adding a new note+exercises without wiring it into the trail.
    const notesWithExercises = new Set(GRAMMAR_NOTES.filter((n) =>
      GRAMMAR_EXERCISES.some((e) => e.noteId === n.id),
    ).map((n) => n.id));
    const pathGrammarIds = new Set(
      LEARNING_PATH.filter((n) => n.type === 'grammar').map((n) => n.refId),
    );
    expect(pathGrammarIds).toEqual(notesWithExercises);
  });
});
