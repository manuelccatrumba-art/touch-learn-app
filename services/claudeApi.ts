import { Message } from '../types';

const SERVER_URL = process.env.EXPO_PUBLIC_CHAT_API_URL ?? '';

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export async function streamChatMessage(
  messages: Message[],
  callbacks: StreamCallbacks,
): Promise<void> {
  if (!SERVER_URL) {
    callbacks.onError(new Error('Servidor não configurado. Adicione EXPO_PUBLIC_CHAT_API_URL no arquivo .env'));
    return;
  }

  let response: Response;
  try {
    response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });
  } catch {
    callbacks.onError(new Error('Sem conexão com a internet. Verifique sua rede.'));
    return;
  }

  if (!response.ok) {
    let msg = `Erro ${response.status}`;
    try {
      const body = await response.json();
      msg = body?.error ?? msg;
    } catch {}
    callbacks.onError(new Error(msg));
    return;
  }

  try {
    const data = await response.json();
    const text: string = data?.text ?? '';
    if (text) callbacks.onChunk(text);
    callbacks.onComplete();
  } catch {
    callbacks.onError(new Error('Erro ao processar resposta do servidor'));
  }
}

export async function sendSingleMessage(prompt: string): Promise<string> {
  if (!SERVER_URL) throw new Error('Servidor não configurado');

  const response = await fetch(SERVER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
  });

  if (!response.ok) throw new Error(`Erro ${response.status}`);
  const data = await response.json();
  return data?.text ?? '';
}
