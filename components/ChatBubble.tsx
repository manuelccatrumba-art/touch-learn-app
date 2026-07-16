import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../types';
import { Colors } from '../constants/Colors';
import { speakTutor } from '../services/speech';

interface Props {
  message: Message;
}

// Splits a line on **bold** / *italic* markers and returns styled inline nodes.
function parseInline(text: string, keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(
        <Text key={`${keyPrefix}-b-${i++}`} style={styles.bold}>
          {token.slice(2, -2)}
        </Text>,
      );
    } else {
      nodes.push(
        <Text key={`${keyPrefix}-i-${i++}`} style={styles.italic}>
          {token.slice(1, -1)}
        </Text>,
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

// Renders lightweight Markdown (#, ##, ###, ---, bullets, **bold**, *italic*)
// coming back from the assistant instead of dumping the raw syntax on screen.
function FormattedContent({ content, textStyle }: { content: string; textStyle: object }) {
  const lines = content.split('\n');
  return (
    <>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed === '' ) {
          return <View key={idx} style={{ height: 6 }} />;
        }
        if (trimmed === '---' || trimmed === '***') {
          return <View key={idx} style={styles.divider} />;
        }
        if (trimmed.startsWith('### ')) {
          return (
            <Text key={idx} style={[textStyle, styles.h3]}>
              {parseInline(trimmed.slice(4), `h3-${idx}`)}
            </Text>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <Text key={idx} style={[textStyle, styles.h2]}>
              {parseInline(trimmed.slice(3), `h2-${idx}`)}
            </Text>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <Text key={idx} style={[textStyle, styles.h1]}>
              {parseInline(trimmed.slice(2), `h1-${idx}`)}
            </Text>
          );
        }
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
          return (
            <View key={idx} style={styles.bulletRow}>
              <Text style={[textStyle, styles.bulletDot]}>•</Text>
              <Text style={[textStyle, styles.bulletText]}>
                {parseInline(trimmed.slice(2), `li-${idx}`)}
              </Text>
            </View>
          );
        }
        return (
          <Text key={idx} style={textStyle}>
            {parseInline(line, `p-${idx}`)}
          </Text>
        );
      })}
    </>
  );
}

export default function ChatBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <Animated.View
      entering={FadeInUp.duration(220)}
      style={[styles.row, isUser ? styles.rowUser : styles.rowAI]}
    >
      {!isUser && (
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarOuter}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>TL</Text>
            </View>
          </View>
          <View style={styles.onlineDot} />
        </View>
      )}

      {isUser ? (
        <LinearGradient
          colors={Colors.gradientHero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.bubbleUser]}
        >
          <FormattedContent content={message.content} textStyle={[styles.text, styles.textUser]} />
          <View style={styles.bottomRow}>
            <Text style={[styles.time, styles.timeUser]}>
              {new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </LinearGradient>
      ) : (
        <View style={[styles.bubble, styles.bubbleAI]}>
          <Text style={styles.senderName}>Touch Learn</Text>
          <FormattedContent content={message.content} textStyle={[styles.text, styles.textAI]} />
          <View style={styles.bottomRow}>
            <Text style={[styles.time, styles.timeAI]}>
              {new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {message.id !== 'streaming' && (
              <TouchableOpacity
                style={styles.listenBtn}
                onPress={() => speakTutor(message.content, {
                  onError: (msg) => Alert.alert('Não consegui falar', msg),
                })}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="volume-high" size={14} color={Colors.primaryLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {isUser && (
        <View style={styles.userAvatarWrapper}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>Eu</Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 5,
    paddingHorizontal: 12,
    alignItems: 'flex-end',
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAI: {
    justifyContent: 'flex-start',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 4,
  },
  avatarOuter: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryDeep,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  userAvatarWrapper: {
    marginLeft: 8,
    marginBottom: 4,
  },
  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: Colors.textSecondary,
    fontWeight: '700',
    fontSize: 10,
  },
  bubble: {
    maxWidth: '72%',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
  },
  senderName: {
    color: Colors.primaryLight,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 3,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  textUser: {
    color: Colors.white,
  },
  textAI: {
    color: Colors.text,
  },
  time: {
    fontSize: 10,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  timeUser: {
    color: 'rgba(255,255,255,0.55)',
  },
  timeAI: {
    color: Colors.textMuted,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    marginTop: 5,
  },
  listenBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(33,150,243,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bold: {
    fontWeight: '800',
  },
  italic: {
    fontStyle: 'italic',
    color: Colors.primaryLight,
  },
  h1: {
    fontSize: 19,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 2,
  },
  h2: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 2,
  },
  h3: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginVertical: 1,
  },
  bulletDot: {
    fontSize: 15,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
  },
});
