import { GRAMMAR_NOTES, GRAMMAR_EXERCISES } from './grammarExercises';
import { CATEGORY_LABELS } from './bookContent';
import { FlashCardCategory } from '../types';

export type PathNodeType = 'grammar' | 'vocabulary';

export interface PathNode {
  id: string;
  type: PathNodeType;
  refId: string; // noteId (grammar) or category (vocabulary)
  title: string;
  icon: string;
}

const notesWithExercises = GRAMMAR_NOTES.filter((n) =>
  GRAMMAR_EXERCISES.some((e) => e.noteId === n.id),
);

function grammarNode(noteId: string): PathNode {
  const note = notesWithExercises.find((n) => n.id === noteId);
  if (!note) throw new Error(`Grammar note ${noteId} has no exercises`);
  return { id: note.id, type: 'grammar', refId: note.id, title: note.title, icon: note.icon };
}

function vocabNode(category: FlashCardCategory): PathNode {
  const label = CATEGORY_LABELS[category];
  return {
    id: `vocab-${category}`,
    type: 'vocabulary',
    refId: category,
    title: label.title,
    icon: label.emoji,
  };
}

export const LEARNING_PATH: PathNode[] = [
  grammarNode('NL1'),
  grammarNode('NL2'),
  grammarNode('NL3'),
  vocabNode('greetings'),
  grammarNode('NL4'),
  grammarNode('NL5'),
  grammarNode('NL6'),
  vocabNode('family'),
  grammarNode('NL7'),
  grammarNode('NL8'),
  grammarNode('NL9'),
  grammarNode('NL10'),
  grammarNode('NL11'),
  grammarNode('NL12'),
  grammarNode('NL13'),
  vocabNode('travel'),
  grammarNode('NL14'),
  grammarNode('NL15'),
  vocabNode('business'),
  grammarNode('NL16'),
  grammarNode('NL17'),
  vocabNode('professional'),
  grammarNode('NL18'),
  grammarNode('NL19'),
  grammarNode('NL20'),
  vocabNode('correspondence'),
  vocabNode('shopping'),
  grammarNode('NL21'),
  vocabNode('health'),
  grammarNode('NL22'),
  grammarNode('NL23'),
  vocabNode('technology'),
  grammarNode('NL24'),
  grammarNode('NL25'),
  grammarNode('NL26'),
  grammarNode('NL27'),
  grammarNode('NL28'),
  grammarNode('NL29'),
  grammarNode('NL30'),
];

export interface LearningModule {
  id: string;
  title: string;
  icon: string;
  nodes: PathNode[];
}

// Thematic groupings over LEARNING_PATH, used by the dashboard's module cards.
export const LEARNING_MODULES: LearningModule[] = [
  { id: 'basics', title: 'Fundamentos', icon: '🌱', nodes: LEARNING_PATH.slice(0, 8) },
  { id: 'grammar-core', title: 'Gramática Intermédia', icon: '📘', nodes: LEARNING_PATH.slice(8, 16) },
  { id: 'practical', title: 'Comunicação Prática', icon: '💬', nodes: LEARNING_PATH.slice(16, 22) },
  { id: 'advanced', title: 'Inglês Avançado', icon: '🚀', nodes: LEARNING_PATH.slice(22, 26) },
  { id: 'real-life', title: 'Vida Real', icon: '🌍', nodes: LEARNING_PATH.slice(26, 32) },
  { id: 'mastery', title: 'Domínio Avançado', icon: '🏆', nodes: LEARNING_PATH.slice(32, 39) },
];
