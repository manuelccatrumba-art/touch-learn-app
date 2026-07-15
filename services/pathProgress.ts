import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@et:path_completed';

export async function getCompletedNodes(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function markNodeComplete(nodeId: string): Promise<string[]> {
  const completed = await getCompletedNodes();
  if (!completed.includes(nodeId)) {
    completed.push(nodeId);
    await AsyncStorage.setItem(KEY, JSON.stringify(completed));
  }
  return completed;
}
