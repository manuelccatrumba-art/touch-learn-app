import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const TTS_API_URL = process.env.EXPO_PUBLIC_TTS_API_URL ?? '';

interface SpeakCallbacks {
  onDone?: () => void;
  onStopped?: () => void;
}

let currentSound: Audio.Sound | null = null;
let currentCallbacks: SpeakCallbacks | null = null;
let speechToken = 0;
let audioModeReady = false;

async function ensureAudioMode() {
  if (audioModeReady) return;
  audioModeReady = true;
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
  } catch {
    // non-fatal
  }
}

async function unloadCurrent() {
  const sound = currentSound;
  currentSound = null;
  if (sound) {
    try {
      await sound.unloadAsync();
    } catch {
      // already unloaded
    }
  }
}

async function beginNewUtterance(callbacks: SpeakCallbacks): Promise<number> {
  speechToken++;
  await unloadCurrent();
  currentCallbacks = callbacks;
  return speechToken;
}

export function stopSpeaking() {
  speechToken++;
  const callbacks = currentCallbacks;
  currentCallbacks = null;
  unloadCurrent();
  callbacks?.onStopped?.();
}

export function stripMarkdownForSpeech(content: string) {
  return content
    .replace(/^#{1,3}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^[•-]\s+/gm, '')
    .replace(/^---$/gm, '')
    .trim();
}

async function fetchAndPlay(text: string, myToken: number, callbacks: SpeakCallbacks) {
  if (!TTS_API_URL || !text.trim()) {
    if (myToken === speechToken) callbacks.onDone?.();
    return;
  }

  try {
    const res = await fetch(TTS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (myToken !== speechToken) return;

    if (!res.ok) {
      callbacks.onDone?.();
      return;
    }

    const data = await res.json();
    if (myToken !== speechToken) return;
    if (!data?.audio) {
      callbacks.onDone?.();
      return;
    }

    await ensureAudioMode();
    if (myToken !== speechToken) return;

    const fileUri = `${FileSystem.cacheDirectory}tl-tts-${Date.now()}.mp3`;
    await FileSystem.writeAsStringAsync(fileUri, data.audio, {
      encoding: FileSystem.EncodingType.Base64,
    });
    if (myToken !== speechToken) {
      FileSystem.deleteAsync(fileUri, { idempotent: true });
      return;
    }

    const { sound } = await Audio.Sound.createAsync({ uri: fileUri }, { shouldPlay: true });
    if (myToken !== speechToken) {
      await sound.unloadAsync();
      FileSystem.deleteAsync(fileUri, { idempotent: true });
      return;
    }
    currentSound = sound;

    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded || !status.didJustFinish) return;
      sound.unloadAsync();
      FileSystem.deleteAsync(fileUri, { idempotent: true });
      if (myToken === speechToken) {
        currentSound = null;
        currentCallbacks = null;
        callbacks.onDone?.();
      }
    });
  } catch {
    if (myToken === speechToken) callbacks.onDone?.();
  }
}

// Plain single-language utterance (e.g. a flashcard word/phrase known to be English).
export async function speakEnglish(text: string, callbacks: SpeakCallbacks = {}) {
  const myToken = await beginNewUtterance(callbacks);
  await fetchAndPlay(text, myToken, callbacks);
}

// Speaks a tutor reply that mixes Portuguese explanations with English examples.
// The ElevenLabs multilingual voice handles the language switch naturally in one pass.
export async function speakTutor(text: string, callbacks: SpeakCallbacks = {}) {
  const myToken = await beginNewUtterance(callbacks);
  const clean = stripMarkdownForSpeech(text);
  await fetchAndPlay(clean, myToken, callbacks);
}
