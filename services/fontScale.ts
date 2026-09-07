import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_FONT_SCALE_INDEX, FONT_SCALE_STEPS } from '../constants/typography';

const KEY = '@et:font_scale_index';

export async function getFontScaleIndex(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return DEFAULT_FONT_SCALE_INDEX;
  const parsed = Number(raw);
  if (Number.isNaN(parsed) || parsed < 0 || parsed >= FONT_SCALE_STEPS.length) {
    return DEFAULT_FONT_SCALE_INDEX;
  }
  return parsed;
}

export async function setFontScaleIndex(index: number): Promise<void> {
  await AsyncStorage.setItem(KEY, String(index));
}
