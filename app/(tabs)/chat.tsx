import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Message, Conversation } from '../../types';
import { Colors } from '../../constants/Colors';
import { streamChatMessage } from '../../services/claudeApi';
import {
  getActiveConversation,
  setActiveConversation,
  incrementProgress,
  addXP,
} from '../../services/storage';
import { QUICK_REPLIES } from '../../constants/bookContent';
import ChatBubble from '../../components/ChatBubble';
import TypingIndicator from '../../components/TypingIndicator';
import VoiceConversationModal, { VoiceState } from '../../components/VoiceConversationModal';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { speakTutor, stopSpeaking } from '../../services/speech';

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function TutorOrb() {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1.08, { duration: 900 }), withTiming(1, { duration: 900 })),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <Reanimated.View style={[orbStyles.wrapper, animatedStyle]}>
      <LinearGradient
        colors={['#ffc93c', '#ff9d4d', '#ff6b7a']}
        locations={[0, 0.55, 1]}
        start={{ x: 0.15, y: 0.1 }}
        end={{ x: 0.9, y: 1 }}
        style={orbStyles.orb}
      >
        <View style={orbStyles.highlight} />
      </LinearGradient>
    </Reanimated.View>
  );
}

const orbStyles = StyleSheet.create({
  wrapper: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 10,
  },
  orb: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlight: {
    position: 'absolute',
    top: 10,
    left: 14,
    width: 20,
    height: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});

function newConversation(): Conversation {
  return { id: makeId(), messages: [], createdAt: Date.now(), updatedAt: Date.now() };
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Olá! Eu sou o Touch Learn, seu assistente inteligente de inglês! 👋\n\nEstou aqui para te ajudar a dominar o inglês de forma prática e natural.\n\nPodemos:\n• 💬 Conversar em inglês\n• 📝 Praticar exercícios\n• 🔤 Explicar regras gramaticais\n• 🌍 Aprender expressões do dia a dia\n\nComo posso te ajudar hoje?',
  timestamp: Date.now(),
};

export default function ChatScreen() {
  const params = useLocalSearchParams<{ seedPhrase?: string; seedTranslation?: string }>();
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation>(newConversation());
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const listRef = useRef<FlatList>(null);
  const abortRef = useRef(false);

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
    if (listening) {
      micPulse.value = withRepeat(
        withSequence(withTiming(1, { duration: 800 }), withTiming(0, { duration: 0 })),
        -1,
        false,
      );
    } else {
      micPulse.value = withTiming(0, { duration: 150 });
    }
  }, [listening]);
  const micPulseStyle = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - micPulse.value),
    transform: [{ scale: 1 + micPulse.value * 0.6 }],
  }));

  function statusLabel(): string {
    if (isStreaming) return 'a pensar...';
    if (listening) return 'a ouvir...';
    return 'pronto';
  }

  useFocusEffect(
    useCallback(() => {
      if (params.seedPhrase) {
        startSeededConversation(params.seedPhrase, params.seedTranslation);
      } else {
        loadConversation();
      }
    }, [params.seedPhrase, params.seedTranslation]),
  );

  async function startSeededConversation(phrase: string, translation?: string) {
    const seedText =
      `🎯 **Desafio do dia!**\n\nA frase de hoje é: **"${phrase}"**` +
      `${translation ? ` (${translation})` : ''}.\n\n` +
      `Tenta usá-la numa frase tua, como se estivesses numa situação real. ` +
      `Podes escrever em português ou inglês — vou ajudar-te a melhorar! 💪`;
    const seeded: Conversation = {
      id: makeId(),
      messages: [{ id: makeId(), role: 'assistant', content: seedText, timestamp: Date.now() }],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversation(seeded);
    await setActiveConversation(seeded);
    router.setParams({ seedPhrase: undefined, seedTranslation: undefined });
  }

  useEffect(() => {
    if (voiceError) {
      Alert.alert('Reconhecimento de fala', voiceError);
    }
  }, [voiceError]);

  async function loadConversation() {
    const saved = await getActiveConversation();
    if (saved && saved.messages.length > 0) {
      setConversation(saved);
    }
  }

  const allMessages: Message[] = [
    WELCOME,
    ...conversation.messages,
    ...(isStreaming
      ? [
          {
            id: 'streaming',
            role: 'assistant' as const,
            content: streamingText || '...',
            timestamp: Date.now(),
          },
        ]
      : []),
  ];

  async function sendMessage(text: string, viaVoice = false) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setInput('');
    abortRef.current = false;

    const userMsg: Message = {
      id: makeId(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    const updatedMessages = [...conversation.messages, userMsg];
    const updatedConv: Conversation = {
      ...conversation,
      messages: updatedMessages,
      updatedAt: Date.now(),
    };
    setConversation(updatedConv);
    await setActiveConversation(updatedConv);

    setIsStreaming(true);
    setStreamingText('');

    let fullText = '';

    await streamChatMessage(updatedMessages, {
      onChunk: (chunk) => {
        if (abortRef.current) return;
        fullText += chunk;
        setStreamingText(fullText);
        listRef.current?.scrollToEnd({ animated: true });
      },
      onComplete: async () => {
        if (abortRef.current) return;
        const assistantMsg: Message = {
          id: makeId(),
          role: 'assistant',
          content: fullText,
          timestamp: Date.now(),
        };
        const finalConv: Conversation = {
          ...updatedConv,
          messages: [...updatedMessages, assistantMsg],
          updatedAt: Date.now(),
        };
        setConversation(finalConv);
        setIsStreaming(false);
        setStreamingText('');
        await setActiveConversation(finalConv);
        await incrementProgress({ totalMessages: 1 });
        await addXP(5);
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
      onError: (err) => {
        setIsStreaming(false);
        setStreamingText('');
        const errMsg: Message = {
          id: makeId(),
          role: 'assistant',
          content: `⚠️ ${err.message}`,
          timestamp: Date.now(),
        };
        const finalConv = { ...updatedConv, messages: [...updatedMessages, errMsg], updatedAt: Date.now() };
        setConversation(finalConv);

        if (viaVoice && voiceCallOpenRef.current) {
          setVoiceCallState('listening');
          setVoiceCaption('A ouvir...');
          startListening();
        }
      },
    });
  }

  function clearChat() {
    const fresh = newConversation();
    setConversation(fresh);
    setActiveConversation(fresh);
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header — orbe pulsante em vez do cabeçalho institucional */}
      <View style={styles.orbHeader}>
        <TouchableOpacity onPress={clearChat} style={styles.orbCornerBtn}>
          <Ionicons name="add" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.orbCenter}>
          <TutorOrb />
          <Text style={styles.orbStatusLabel}>{statusLabel()}</Text>
        </View>
        <TouchableOpacity onPress={openVoiceCall} style={styles.orbCornerBtn}>
          <Ionicons name="call" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <VoiceConversationModal
        visible={voiceCallOpen}
        state={voiceCallState}
        caption={voiceCaption}
        volume={micVolume}
        onClose={closeVoiceCall}
      />

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={listRef}
          data={allMessages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) =>
            item.id === 'streaming' && streamingText === '' ? (
              <TypingIndicator />
            ) : (
              <ChatBubble message={item} />
            )
          }
          style={styles.list}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Quick replies */}
        {conversation.messages.length === 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickScroll}
            contentContainerStyle={styles.quickContent}
          >
            {QUICK_REPLIES.map((r) => (
              <TouchableOpacity
                key={r}
                style={styles.quickChip}
                onPress={() => sendMessage(r)}
              >
                <Text style={styles.quickChipText}>{r}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Digite em inglês ou português..."
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
            disabled={isStreaming}
          >
            <Reanimated.View style={[styles.micPulseRing, micPulseStyle]} />
            <LinearGradient
              colors={listening ? [Colors.coral, Colors.orange] : Colors.gradientTutor}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.micBtn}
            >
              <Ionicons name={listening ? 'mic' : 'mic-outline'} size={18} color={Colors.white} />
            </LinearGradient>
          </Pressable>
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || isStreaming) && styles.sendBtnDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
          >
            {isStreaming ? (
              <View style={styles.stopIcon}>
                <View style={styles.stopSquare} />
              </View>
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

  orbHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: Colors.background,
  },
  orbCornerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbCenter: { alignItems: 'center', gap: 8 },
  orbStatusLabel: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },

  list: { flex: 1, backgroundColor: Colors.background },
  listContent: { paddingVertical: 14 },

  quickScroll: { maxHeight: 52, flexGrow: 0, backgroundColor: Colors.background },
  quickContent: {
    paddingHorizontal: 12,
    gap: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  quickChip: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  quickChipText: { color: Colors.primaryLight, fontSize: 13, fontWeight: '500' },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.background,
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 24,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 11 : 9,
    color: Colors.text,
    fontSize: 15,
    maxHeight: 120,
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.card,
    shadowOpacity: 0,
    elevation: 0,
  },
  micWrapper: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  micPulseRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.coral,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  stopIcon: { alignItems: 'center', justifyContent: 'center' },
  stopSquare: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: Colors.white,
  },
});
