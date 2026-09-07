import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../../components/AppText';
import TextInput from '../../components/AppTextInput';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { FlashCard } from '../../types';
import { getFlashcards, addXP, incrementProgress } from '../../services/storage';
import { speakEnglish, stopSpeaking } from '../../services/speech';
import { isCloseMatch } from '../../utils/textMatch';
import { hapticSuccess, hapticError } from '../../utils/haptics';

const SESSION_SIZE = 10;
const XP_CORRECT = 8;
const XP_ATTEMPT = 2;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type Screen = 'home' | 'session' | 'summary';

export default function ListeningScreen() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('home');
  const [pool, setPool] = useState<FlashCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionCards, setSessionCards] = useState<FlashCard[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [sessionResults, setSessionResults] = useState({ correct: 0, total: 0 });

  useFocusEffect(
    useCallback(() => {
      getFlashcards().then((cards) => {
        setPool(cards);
        setLoading(false);
      });
      return () => {
        stopSpeaking();
      };
    }, []),
  );

  function startSession() {
    const picked = shuffle(pool).slice(0, Math.min(SESSION_SIZE, pool.length));
    setSessionCards(picked);
    setIndex(0);
    setAnswer('');
    setChecked(false);
    setCorrect(false);
    setSessionResults({ correct: 0, total: 0 });
    setScreen('session');
  }

  function play() {
    const card = sessionCards[index];
    if (!card) return;
    setPlaying(true);
    speakEnglish(card.english, {
      onDone: () => setPlaying(false),
      onStopped: () => setPlaying(false),
      onError: () => setPlaying(false),
    });
  }

  async function verify() {
    const card = sessionCards[index];
    const isRight = isCloseMatch(answer, card.english);
    setChecked(true);
    setCorrect(isRight);
    if (isRight) hapticSuccess(); else hapticError();
    setSessionResults((r) => ({ correct: r.correct + (isRight ? 1 : 0), total: r.total + 1 }));
    await addXP(isRight ? XP_CORRECT : XP_ATTEMPT);
    await incrementProgress({ exercisesCompleted: 1, exercisesCorrect: isRight ? 1 : 0 });
  }

  function next() {
    stopSpeaking();
    if (index + 1 < sessionCards.length) {
      setIndex(index + 1);
      setAnswer('');
      setChecked(false);
      setCorrect(false);
    } else {
      setScreen('summary');
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (screen === 'summary') {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <Text style={styles.summaryEmoji}>🎧</Text>
        <Text style={styles.summaryTitle}>Sessão concluída!</Text>
        <Text style={styles.summarySub}>
          {sessionResults.correct} de {sessionResults.total} corretas
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setScreen('home')}>
          <Text style={styles.primaryBtnText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen === 'session') {
    const card = sessionCards[index];
    if (!card) return null;
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.sessionHeader}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => { stopSpeaking(); setScreen('home'); }}>
            <Text style={styles.sessionClose}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.sessionProg}>{index + 1} / {sessionCards.length}</Text>
        </View>

        <View style={styles.sessionBody}>
          <TouchableOpacity style={styles.playBtn} onPress={play} disabled={playing}>
            <Ionicons name={playing ? 'volume-high' : 'play'} size={36} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.playHint}>Toca para ouvir a frase em inglês</Text>

          {!checked ? (
            <>
              <TextInput
                style={styles.input}
                value={answer}
                onChangeText={setAnswer}
                placeholder="Escreve o que ouviste..."
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={[styles.primaryBtn, !answer.trim() && { opacity: 0.5 }]}
                onPress={verify}
                disabled={!answer.trim()}
              >
                <Text style={styles.primaryBtnText}>Verificar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.resultBox}>
              <Text style={[styles.resultText, { color: correct ? Colors.success : Colors.coral }]}>
                {correct ? `✓ Correto! +${XP_CORRECT} XP` : `✗ Era: "${card.english}"`}
              </Text>
              <Text style={styles.resultPt}>{card.portuguese}</Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={next}>
                <Text style={styles.primaryBtnText}>
                  {index + 1 < sessionCards.length ? 'Seguinte →' : 'Terminar'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.homeContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Listening</Text>
          <Text style={styles.headerSub}>Treina a tua compreensão auditiva com as frases do vocabulário</Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="headset" size={28} color={Colors.coral} />
          <Text style={styles.infoText}>
            Vais ouvir {Math.min(SESSION_SIZE, pool.length)} frases em inglês, uma de cada vez, e escrever o que
            entendeste. Pequenos erros de escrita são tolerados.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, pool.length === 0 && { opacity: 0.5 }]}
          onPress={startSession}
          disabled={pool.length === 0}
        >
          <Text style={styles.primaryBtnText}>Começar sessão →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24 },

  header: { marginTop: 40, marginBottom: 24 },
  headerTitle: { color: Colors.text, fontSize: 26, fontWeight: '800' },
  headerSub: { color: Colors.textSecondary, fontSize: 13, marginTop: 6 },

  homeContent: { padding: 20 },
  infoCard: {
    backgroundColor: Colors.card, borderRadius: 18, padding: 20, alignItems: 'center', gap: 12, marginBottom: 24,
  },
  infoText: { color: Colors.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 19 },

  primaryBtn: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 15, alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 4,
  },
  primaryBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },

  sessionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 16,
  },
  closeBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.card,
    alignItems: 'center', justifyContent: 'center',
  },
  sessionClose: { color: Colors.textSecondary, fontSize: 16, fontWeight: '700' },
  sessionProg: { color: Colors.text, fontWeight: '700' },

  sessionBody: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  playBtn: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.primaryDark,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 6,
  },
  playHint: { color: Colors.textMuted, fontSize: 12, marginBottom: 8 },

  input: {
    width: '100%', backgroundColor: Colors.card, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    color: Colors.text, fontSize: 15,
  },

  resultBox: { width: '100%', alignItems: 'center', gap: 10 },
  resultText: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  resultPt: { color: Colors.textSecondary, fontSize: 13, marginBottom: 8, textAlign: 'center' },

  summaryEmoji: { fontSize: 56, marginBottom: 12 },
  summaryTitle: { color: Colors.text, fontSize: 22, fontWeight: '800', marginBottom: 6 },
  summarySub: { color: Colors.textSecondary, fontSize: 14, marginBottom: 24 },
});
