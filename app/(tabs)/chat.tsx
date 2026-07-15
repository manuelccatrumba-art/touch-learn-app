import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
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

  const { listening, error: voiceError, start: startListening, stop: stopListening } = useVoiceInput(
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

  useFocusEffect(
    useCallback(() => {
      loadConversation();
    }, []),
  );

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
          content: `⚠️ ${err.message}\n\nVerifique sua conexão e chave de API no arquivo .env`,
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatarWrapper}>
              <View style={styles.headerAvatar}>
                <Text style={styles.headerAvatarText}>TL</Text>
              </View>
              <View style={styles.headerOnlineDot} />
            </View>
            <View>
              <Text style={styles.headerBrand}>TOUCH LEARN</Text>
              <Text style={styles.headerSubtitle}>Assistente Inteligente de Inglês</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={openVoiceCall} style={styles.callBtn}>
              <Ionicons name="call" size={16} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={clearChat} style={styles.newChatBtn}>
              <View style={styles.newChatInner}>
                <Ionicons name="add" size={16} color={Colors.primary} />
                <Text style={styles.newChatText}>Novo</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <VoiceConversationModal
        visible={voiceCallOpen}
        state={voiceCallState}
        caption={voiceCaption}
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
          <TouchableOpacity
            style={[styles.micBtn, listening && styles.micBtnActive]}
            onPress={() => (listening ? stopListening() : startListening())}
            disabled={isStreaming}
          >
            <Ionicons name={listening ? 'mic' : 'mic-outline'} size={20} color={listening ? Colors.white : Colors.primary} />
          </TouchableOpacity>
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

  header: {
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  headerAccent: {
    height: 3,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerAvatarWrapper: { position: 'relative' },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  headerAvatarText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  headerOnlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  headerBrand: {
    color: Colors.text,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1.5,
  },
  headerSubtitle: { color: Colors.textSecondary, fontSize: 11, marginTop: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  callBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  newChatBtn: {},
  newChatInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  newChatText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },

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
  micBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnActive: {
    backgroundColor: Colors.error,
  },
  stopIcon: { alignItems: 'center', justifyContent: 'center' },
  stopSquare: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: Colors.white,
  },
});
