import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const TTS_API_URL = process.env.EXPO_PUBLIC_TTS_API_URL ?? '';
const FETCH_TIMEOUT_MS = 15000;

interface SpeakCallbacks {
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (message: string) => void;
}

let currentSound: Audio.Sound | null = null;
let currentCallbacks: SpeakCallbacks | null = null;
let speechToken = 0;
let audioModeReady = false;

async function ensureAudioMode() {
  if (audioModeReady) return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    audioModeReady = true;
  } catch {
    // will retry on next call
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

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchAndPlay(text: string, myToken: number, callbacks: SpeakCallbacks) {
  if (!TTS_API_URL || !text.trim()) {
    if (myToken === speechToken) callbacks.onDone?.();
    return;
  }

  try {
    const res = await fetchWithTimeout(
      TTS_API_URL,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      },
      FETCH_TIMEOUT_MS,
    );
    if (myToken !== speechToken) return;

    if (!res.ok) {
      let detail = `Servidor de voz devolveu erro ${res.status}`;
      try {
        const errBody = await res.json();
        if (errBody?.error) detail = errBody.error;
      } catch {
        // keep default detail
      }
      callbacks.onError?.(detail);
      callbacks.onDone?.();
      return;
    }

    const data = await res.json();
    if (myToken !== speechToken) return;
    if (!data?.audio) {
      callbacks.onError?.('Resposta de voz sem áudio.');
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

    const { sound } = await Audio.Sound.createAsync(
      { uri: fileUri },
      { shouldPlay: false, volume: 1.0 },
    );
    if (myToken !== speechToken) {
      await sound.unloadAsync();
      FileSystem.deleteAsync(fileUri, { idempotent: true });
      return;
    }
    currentSound = sound;

    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) {
        if ((status as any).error) {
          callbacks.onError?.(`Falha ao tocar áudio: ${(status as any).error}`);
          if (myToken === speechToken) callbacks.onDone?.();
        }
        return;
      }
      if (!status.didJustFinish) return;
      sound.unloadAsync();
      FileSystem.deleteAsync(fileUri, { idempotent: true });
      if (myToken === speechToken) {
        currentSound = null;
        currentCallbacks = null;
        callbacks.onDone?.();
      }
    });

    // Explicit play call — more reliable across devices than relying solely
    // on shouldPlay at creation time.
    await sound.playAsync();
  } catch (err: any) {
    if (myToken !== speechToken) return;
    const message = err?.name === 'AbortError'
      ? 'A voz demorou demasiado tempo a responder (sem internet ou servidor lento).'
      : `Erro de voz: ${err?.message ?? 'desconhecido'}`;
    callbacks.onError?.(message);
    callbacks.onDone?.();
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
