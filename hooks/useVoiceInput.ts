import { useCallback, useState } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

export function useVoiceInput(onResult: (text: string, isFinal: boolean) => void) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);

  useSpeechRecognitionEvent('start', () => setListening(true));
  useSpeechRecognitionEvent('end', () => {
    setListening(false);
    setVolume(0);
  });
  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results[0]?.transcript;
    if (transcript) onResult(transcript, event.isFinal);
  });
  useSpeechRecognitionEvent('error', (event) => {
    setListening(false);
    setError(event.message || event.error);
  });
  // `value` ranges roughly -2..10; anything below 0 counts as inaudible.
  // Normalized to 0..1 for driving UI (e.g. a voice-reactive orb).
  useSpeechRecognitionEvent('volumechange', (event) => {
    setVolume(Math.max(0, Math.min(1, event.value / 10)));
  });

  const start = useCallback(async () => {
    setError(null);
    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      setError('Permissão de microfone negada. Ative-a nas configurações do telefone.');
      return;
    }
    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: true,
      continuous: false,
      volumeChangeEventOptions: { enabled: true, intervalMillis: 100 },
    });
  }, []);

  const stop = useCallback(() => {
    ExpoSpeechRecognitionModule.stop();
  }, []);

  return { listening, error, volume, start, stop };
}
