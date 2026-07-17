import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlowItem } from '../types/flow';

const ITEMS_KEY = '@et:flow_items';
const SUGGESTION_KEY = '@et:flow_last_suggestion';
const MAX_ITEMS = 200;

export async function getFlowItems(): Promise<FlowItem[]> {
  const raw = await AsyncStorage.getItem(ITEMS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function appendFlowItem(item: FlowItem): Promise<FlowItem[]> {
  const items = await getFlowItems();
  items.push(item);
  const trimmed = items.slice(-MAX_ITEMS);
  await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export async function replaceFlowItem(id: string, patch: Partial<FlowItem>): Promise<FlowItem[]> {
  const items = await getFlowItems();
  const idx = items.findIndex((i) => i.id === id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...patch } as FlowItem;
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  }
  return items;
}

export async function clearFlow(): Promise<void> {
  await AsyncStorage.removeItem(ITEMS_KEY);
}

// ── Proatividade: evita repetir a mesma sugestão no mesmo dia ──────────────

type SuggestionKind = 'daily_phrase' | 'vocab_review' | 'continue_lesson' | 'weekly_progress';

interface SuggestionLog {
  [kind: string]: number; // timestamp da última vez que foi sugerido
}

async function getSuggestionLog(): Promise<SuggestionLog> {
  const raw = await AsyncStorage.getItem(SUGGESTION_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function wasSuggestedToday(kind: SuggestionKind): Promise<boolean> {
  const log = await getSuggestionLog();
  const last = log[kind];
  if (!last) return false;
  return new Date(last).toDateString() === new Date().toDateString();
}

export async function wasSuggestedWithinDays(kind: SuggestionKind, days: number): Promise<boolean> {
  const log = await getSuggestionLog();
  const last = log[kind];
  if (!last) return false;
  return Date.now() - last < days * 86400000;
}

export async function markSuggested(kind: SuggestionKind): Promise<void> {
  const log = await getSuggestionLog();
  log[kind] = Date.now();
  await AsyncStorage.setItem(SUGGESTION_KEY, JSON.stringify(log));
}
