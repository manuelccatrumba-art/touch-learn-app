import { Message } from '../types';

const SERVER_URL = process.env.EXPO_PUBLIC_CHAT_API_URL ?? '';
const FETCH_TIMEOUT_MS = 45000;

if (__DEV__) {
  console.log(`[claudeApi] EXPO_PUBLIC_CHAT_API_URL ${SERVER_URL ? `definido (${SERVER_URL.length} caracteres)` : 'AUSENTE'}`);
}

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
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

// Traduz um erro de fetch/HTTP num texto específico e acionável, em vez de
// colapsar tudo (timeout, DNS, chave inválida, servidor em baixo) num único
// "sem conexão" genérico que esconde a causa real.
function describeFetchError(err: unknown): string {
  if (err instanceof Error && err.name === 'AbortError') {
    return 'O tutor demorou demasiado tempo a responder (mais de 45s). Tenta novamente — pode ser instabilidade momentânea na rede ou no servidor.';
  }
  const message = err instanceof Error ? err.message : String(err);
  if (/Network request failed/i.test(message)) {
    return 'Não foi possível alcançar o servidor. Verifica a tua ligação à internet (Wi-Fi/dados móveis) e tenta novamente.';
  }
  return `Erro de rede: ${message}`;
}

async function describeHttpError(response: Response): Promise<string> {
  let serverMsg = '';
  try {
    const body = await response.json();
    serverMsg = body?.error ?? '';
  } catch {}

  if (response.status === 401 || response.status === 403) {
    return `Chave de API inválida ou em falta no servidor (erro ${response.status}). ${serverMsg}`.trim();
  }
  if (response.status === 429) {
    return 'Limite de pedidos à API atingido. Aguarda um pouco e tenta novamente.';
  }
  if (response.status >= 500) {
    return `O servidor teve um problema (erro ${response.status}). ${serverMsg || 'Tenta novamente em instantes.'}`.trim();
  }
  return serverMsg || `Erro ${response.status} ao contactar o servidor.`;
}

export async function streamChatMessage(
  messages: Message[],
  callbacks: StreamCallbacks,
): Promise<void> {
  if (!SERVER_URL) {
    callbacks.onError(new Error('Servidor não configurado. Falta EXPO_PUBLIC_CHAT_API_URL no arquivo .env deste build.'));
    return;
  }

  let response: Response;
  try {
    response = await fetchWithTimeout(
      SERVER_URL,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      },
      FETCH_TIMEOUT_MS,
    );
  } catch (err) {
    callbacks.onError(new Error(describeFetchError(err)));
    return;
  }

  if (!response.ok) {
    callbacks.onError(new Error(await describeHttpError(response)));
    return;
  }

  try {
    const data = await response.json();
    const text: string = data?.text ?? '';
    if (text) callbacks.onChunk(text);
    callbacks.onComplete();
  } catch {
    callbacks.onError(new Error('O servidor respondeu, mas a resposta não pôde ser lida. Tenta novamente.'));
  }
}

export async function sendSingleMessage(prompt: string): Promise<string> {
  if (!SERVER_URL) throw new Error('Servidor não configurado. Falta EXPO_PUBLIC_CHAT_API_URL no arquivo .env deste build.');

  let response: Response;
  try {
    response = await fetchWithTimeout(
      SERVER_URL,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      },
      FETCH_TIMEOUT_MS,
    );
  } catch (err) {
    throw new Error(describeFetchError(err));
  }

  if (!response.ok) throw new Error(await describeHttpError(response));
  const data = await response.json();
  return data?.text ?? '';
}
