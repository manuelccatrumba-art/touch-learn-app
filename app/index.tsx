import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Reanimated, { useAnimatedStyle, useSharedValue, withTiming, withRepeat } from 'react-native-reanimated';
import { Message } from '../types';
import { CEFRLevel } from '../types';
import { FlowItem } from '../types/flow';
import { Colors } from '../constants/Colors';
import { streamChatMessage } from '../services/claudeApi';
import { incrementProgress, addXP, getFlashcards, getProgress } from '../services/storage';
import { getCompletedNodes } from '../services/pathProgress';
import { getProfile, UserProfile } from '../services/profile';
import {
  getFlowItems,
  appendFlowItem,
  replaceFlowItem,
  wasSuggestedToday,
  wasSuggestedWithinDays,
  markSuggested,
} from '../services/flowStorage';
import { getDueCount } from '../utils/spacedRepetition';
import { GRAMMAR_NOTES } from '../constants/grammarExercises';
import { LEARNING_PATH } from '../constants/path';
import { CULTURE_NUGGETS } from '../constants/culture';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';
import TouchLearnLogo from '../components/TouchLearnLogo';
import ProfileSheet from '../components/ProfileSheet';
import VoiceConversationModal, { VoiceState } from '../components/VoiceConversationModal';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { speakTutor, stopSpeaking } from '../services/speech';
import GrammarFlowCard from '../components/flow/GrammarFlowCard';
import VocabReviewFlowCard from '../components/flow/VocabReviewFlowCard';
import DailyPhraseFlowCard from '../components/flow/DailyPhraseFlowCard';
import ProgressFlowCard from '../components/flow/ProgressFlowCard';

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

const WELCOME_TEXT =
  'Olá! Eu sou o Touch Learn. 👋\n\nPodes conversar comigo em inglês, ou escrever "vocabulário", "gramática", "cultura" ou "o meu progresso" para eu trazer isso já aqui para a conversa.';

type Command = { kind: 'vocab' | 'grammar' | 'culture' | 'progress'; level?: CEFRLevel };

function detectCommand(text: string): Command | null {
  const t = text.trim().toLowerCase();
  if (!t) return null;
  const levelMatch = t.match(/\b(a1|a2|b1|b2|c1|c2)\b/);
  const level = levelMatch ? (levelMatch[1].toUpperCase() as CEFRLevel) : undefined;
  if (/vocabul[aá]rio/.test(t)) return { kind: 'vocab', level };
  if (/gram[aá]tica/.test(t)) return { kind: 'grammar', level };
  if (/cultura/.test(t)) return { kind: 'culture' };
  if (/progresso/.test(t)) return { kind: 'progress' };
  return null;
}

export default function FlowScreen() {
  const [items, setItems] = useState<FlowItem[]>([]);
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const listRef = useRef<FlatList>(null);
  const abortRef = useRef(false);
  const itemsRef = useRef<FlowItem[]>([]);

  const [voiceCallOpen, setVoiceCallOpen] = useState(false);
  const [voiceCallState, setVoiceCallState] = useState<VoiceState>('listening');
  const [voiceCaption, setVoiceCaption] = useState('');
  const voiceCallOpenRef = useRef(false);

  const { listening, error: voiceError, volume: micVolume, start: startListening, stop: stopListening } = useVoiceInput(
    (transcript, isFinal) => {
      if (voiceCallOpenRef.current) {
        setVoiceCaption(transcript || 'A ouvir...');
        if (isFinal && transcript.trim()) {
          setVoiceCallState('thinking');
          sendMessage(transcript, true);
        }
      } else {
        setInput(transcript);
      }
    },
  );

  useEffect(() => {
    if (voiceError) Alert.alert('Reconhecimento de fala', voiceError);
  }, [voiceError]);

  function openVoiceCall() {
    voiceCallOpenRef.current = true;
    setVoiceCallOpen(true);
    setVoiceCallState('listening');
    setVoiceCaption('Diz algo em inglês...');
    startListening();
  }

  function closeVoiceCall() {
    voiceCallOpenRef.current = false;
    setVoiceCallOpen(false);
    stopListening();
    stopSpeaking();
  }

  const micPulse = useSharedValue(0);
  useEffect(() => {
    micPulse.value = listening
      ? withRepeat(withTiming(1, { duration: 800 }), -1, false)
      : withTiming(0, { duration: 150 });
  }, [listening]);
  const micPulseStyle = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - micPulse.value),
    transform: [{ scale: 1 + micPulse.value * 0.6 }],
  }));

  async function refreshHeaderStats() {
    const p = await getProgress();
    setXp(p.xp);
    setStreak(p.currentStreak);
  }

  async function pushItems(newItems: FlowItem[]) {
    itemsRef.current = [...itemsRef.current, ...newItems];
    setItems(itemsRef.current);
    for (const it of newItems) {
      await appendFlowItem(it);
    }
  }

  async function resolveItem(id: string) {
    itemsRef.current = itemsRef.current.map((i) => (i.id === id ? ({ ...i, resolved: true } as FlowItem) : i));
    setItems(itemsRef.current);
    await replaceFlowItem(id, { resolved: true } as Partial<FlowItem>);
    refreshHeaderStats();
  }

  function tutorText(text: string): FlowItem {
    return {
      id: makeId(),
      type: 'tutor_message',
      timestamp: Date.now(),
      message: { id: makeId(), role: 'assistant', content: text, timestamp: Date.now() },
    };
  }

  async function runProactiveSuggestions() {
    const additions: FlowItem[] = [];

    if (!(await wasSuggestedToday('daily_phrase'))) {
      const nugget = CULTURE_NUGGETS[dayOfYear() % CULTURE_NUGGETS.length];
      additions.push(tutorText('A frase de hoje para praticares:'));
      additions.push({ id: makeId(), type: 'daily_phrase_card', nuggetId: nugget.id, timestamp: Date.now() });
      await markSuggested('daily_phrase');
    }

    const cards = await getFlashcards();
    const due = getDueCount(cards);
    if (due > 0 && !(await wasSuggestedToday('vocab_review'))) {
      additions.push(tutorText(`Reparei que tens ${due} flashcards a ficar frios — uma revisão rápida?`));
      additions.push({ id: makeId(), type: 'vocab_review_card', resolved: false, timestamp: Date.now() });
      await markSuggested('vocab_review');
    }

    if (!(await wasSuggestedWithinDays('continue_lesson', 2))) {
      const completed = await getCompletedNodes();
      const nextNode = LEARNING_PATH.find((n) => n.type === 'grammar' && !completed.includes(n.id));
      if (nextNode) {
        additions.push(tutorText(`Vamos continuar de onde paraste? A próxima é "${nextNode.title}".`));
        additions.push({ id: makeId(), type: 'grammar_card', noteId: nextNode.refId, resolved: false, timestamp: Date.now() });
        await markSuggested('continue_lesson');
      }
    }

    if (!(await wasSuggestedWithinDays('weekly_progress', 7))) {
      additions.push(tutorText('Já lá vai uma semana — como estás a ir:'));
      additions.push({ id: makeId(), type: 'progress_card', timestamp: Date.now() });
      await markSuggested('weekly_progress');
    }

    if (additions.length > 0) await pushItems(additions);
  }

  useEffect(() => {
    (async () => {
      getProfile().then(setProfile);
      refreshHeaderStats();
      const stored = await getFlowItems();
      if (stored.length === 0) {
        await pushItems([tutorText(WELCOME_TEXT)]);
      } else {
        itemsRef.current = stored;
        setItems(stored);
      }
      setReady(true);
      await runProactiveSuggestions();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePracticePhrase(phrase: string, translation: string) {
    await pushItems([
      tutorText(`🎯 **Desafio!** Tenta usar "${phrase}" (${translation}) numa frase tua, como se estivesses numa situação real.`),
    ]);
  }

  async function handleCommand(cmd: Command) {
    if (cmd.kind === 'vocab') {
      await pushItems([
        tutorText('Aqui está o teu vocabulário:'),
        { id: makeId(), type: 'vocab_review_card', resolved: false, timestamp: Date.now() },
      ]);
    } else if (cmd.kind === 'grammar') {
      const completed = await getCompletedNodes();
      const pool = cmd.level ? GRAMMAR_NOTES.filter((n) => n.level === cmd.level) : GRAMMAR_NOTES;
      const next = pool.find((n) => !completed.includes(n.id)) ?? pool[0] ?? GRAMMAR_NOTES[0];
      await pushItems([
        tutorText(cmd.level ? `Gramática de nível ${cmd.level}:` : 'Aqui está a tua próxima nota de gramática:'),
        { id: makeId(), type: 'grammar_card', noteId: next.id, resolved: completed.includes(next.id), timestamp: Date.now() },
      ]);
    } else if (cmd.kind === 'culture') {
      const nugget = CULTURE_NUGGETS[Math.floor(Math.random() * CULTURE_NUGGETS.length)];
      await pushItems([
        tutorText('Uma expressão para conheceres:'),
        { id: makeId(), type: 'daily_phrase_card', nuggetId: nugget.id, timestamp: Date.now() },
      ]);
    } else if (cmd.kind === 'progress') {
      await pushItems([
        tutorText('Aqui está o teu progresso:'),
        { id: makeId(), type: 'progress_card', timestamp: Date.now() },
      ]);
    }
  }

  async function sendMessage(text: string, viaVoice = false) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    setInput('');
    abortRef.current = false;

    const command = detectCommand(trimmed);
    const userItem: FlowItem = {
      id: makeId(),
      type: 'user_message',
      timestamp: Date.now(),
      message: { id: makeId(), role: 'user', content: trimmed, timestamp: Date.now() },
    };
    await pushItems([userItem]);
    listRef.current?.scrollToEnd({ animated: true });

    if (command) {
      await handleCommand(command);
      listRef.current?.scrollToEnd({ animated: true });
      return;
    }

    const history: Message[] = itemsRef.current
      .filter((i): i is Extract<FlowItem, { type: 'tutor_message' | 'user_message' }> =>
        i.type === 'tutor_message' || i.type === 'user_message')
      .map((i) => i.message);

    setIsStreaming(true);
    setStreamingText('');
    let fullText = '';

    await streamChatMessage(history, {
      onChunk: (chunk) => {
        if (abortRef.current) return;
        fullText += chunk;
        setStreamingText(fullText);
        listRef.current?.scrollToEnd({ animated: true });
      },
      onComplete: async () => {
        if (abortRef.current) return;
        setIsStreaming(false);
        setStreamingText('');
        await pushItems([tutorText(fullText)]);
        await incrementProgress({ totalMessages: 1 });
        await addXP(5);
        refreshHeaderStats();
        listRef.current?.scrollToEnd({ animated: true });

        if (viaVoice && voiceCallOpenRef.current) {
          setVoiceCallState('speaking');
          setVoiceCaption(fullText);
          speakTutor(fullText, {
            onError: (msg) => setVoiceCaption(`⚠️ ${msg}`),
            onDone: () => {
              if (voiceCallOpenRef.current) {
                setVoiceCallState('listening');
                setVoiceCaption('A ouvir...');
                startListening();
              }
            },
          });
        }
      },
      onError: async (err) => {
        setIsStreaming(false);
        setStreamingText('');
        await pushItems([tutorText(`⚠️ ${err.message}`)]);
        if (viaVoice && voiceCallOpenRef.current) {
          setVoiceCallState('listening');
          setVoiceCaption('A ouvir...');
          startListening();
        }
      },
    });
  }

  function renderItem({ item }: { item: FlowItem }) {
    switch (item.type) {
      case 'tutor_message':
      case 'user_message':
        return <ChatBubble message={item.message} />;
      case 'grammar_card':
        return <GrammarFlowCard noteId={item.noteId} resolved={item.resolved} onResolved={() => resolveItem(item.id)} />;
      case 'vocab_review_card':
        return <VocabReviewFlowCard resolved={item.resolved} onResolved={() => resolveItem(item.id)} />;
      case 'daily_phrase_card':
        return <DailyPhraseFlowCard nuggetId={item.nuggetId} onPractice={handlePracticePhrase} />;
      case 'progress_card':
        return <ProgressFlowCard />;
      default:
        return null;
    }
  }

  if (!ready) return <View style={styles.safe} />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchLearnLogo size={26} />
          <Text style={styles.headerBrand}>Touch Learn</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.statBadge}>
            <Ionicons name="star" size={12} color={Colors.gold} />
            <Text style={styles.statBadgeText}>{xp}</Text>
          </View>
          <View style={styles.statBadge}>
            <Ionicons name="flame" size={13} color={Colors.primary} />
            <Text style={styles.statBadgeText}>{streak}</Text>
          </View>
          <TouchableOpacity onPress={() => setProfileOpen(true)}>
            <View style={[styles.avatarBtn, { backgroundColor: (profile?.avatarColor ?? Colors.primary) + '33', borderColor: profile?.avatarColor ?? Colors.primary }]}>
              <Text style={styles.avatarBtnEmoji}>{profile?.avatarEmoji ?? '🦁'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ProfileSheet visible={profileOpen} onClose={() => setProfileOpen(false)} />
      <VoiceConversationModal
        visible={voiceCallOpen}
        state={voiceCallState}
        caption={voiceCaption}
        volume={micVolume}
        onClose={closeVoiceCall}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={70}
      >
        <FlatList
          ref={listRef}
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListFooterComponent={isStreaming ? (streamingText ? <ChatBubble message={{ id: 'streaming', role: 'assistant', content: streamingText, timestamp: Date.now() }} /> : <TypingIndicator />) : null}
        />

        <View style={styles.inputBar}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder='Fala comigo, ou escreve "vocabulário", "gramática"...'
              placeholderTextColor={Colors.textMuted}
              multiline
              maxLength={1000}
              returnKeyType="send"
              onSubmitEditing={() => sendMessage(input)}
            />
          </View>
          <Pressable
            style={styles.micWrapper}
            onPress={() => (listening ? stopListening() : startListening())}
            onLongPress={openVoiceCall}
            disabled={isStreaming}
          >
            <Reanimated.View style={[styles.micPulseRing, micPulseStyle]} />
            <LinearGradient
              colors={listening ? [Colors.coral, Colors.tangerine] : Colors.gradientHero}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.micBtn}
            >
              <Ionicons name={listening ? 'mic' : 'mic-outline'} size={18} color={Colors.background} />
            </LinearGradient>
          </Pressable>
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || isStreaming) && styles.sendBtnDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
          >
            {isStreaming ? (
              <View style={styles.stopIcon}><View style={styles.stopSquare} /></View>
            ) : (
              <Ionicons name="send" size={18} color={Colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.background,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerBrand: { color: Colors.text, fontWeight: '800', fontSize: 14, letterSpacing: 0.3 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.primaryDeep, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 14,
  },
  statBadgeText: { color: Colors.text, fontSize: 11, fontWeight: '700' },
  avatarBtn: {
    width: 30, height: 30, borderRadius: 15, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarBtnEmoji: { fontSize: 15 },

  list: { flex: 1, backgroundColor: Colors.background },
  listContent: { paddingVertical: 14 },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.background,
    gap: 8,
  },
  inputWrapper: { flex: 1, backgroundColor: Colors.card, borderRadius: 24, overflow: 'hidden' },
  input: {
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 11 : 9,
    color: Colors.text,
    fontSize: 15,
    maxHeight: 120,
  },
  sendBtn: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4,
  },
  sendBtnDisabled: { backgroundColor: Colors.card, shadowOpacity: 0, elevation: 0 },
  micWrapper: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  micPulseRing: { position: 'absolute', width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.coral },
  micBtn: {
    width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5,
  },
  stopIcon: { alignItems: 'center', justifyContent: 'center' },
  stopSquare: { width: 14, height: 14, borderRadius: 3, backgroundColor: Colors.white },
});
