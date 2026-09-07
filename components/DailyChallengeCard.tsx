import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Text from './AppText';
import TextInput from './AppTextInput';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { Colors } from '../constants/Colors';
import { getTodayNugget, getDailyChallengeState, answerDailyChallenge, DAILY_CHALLENGE_XP } from '../services/dailyChallenge';
import { hapticSuccess, hapticError } from '../utils/haptics';
import ParticleBurst from './ParticleBurst';

type Variant = 'compact' | 'hero';

interface Props {
  variant: Variant;
  onAnswered?: (correct: boolean) => void;
}

// Cartão único do Desafio Diário, montado tanto na Início (variant="compact")
// como em Desafios (variant="hero"). Antes havia duas cópias independentes
// desta lógica, cada uma com o próprio useState — o mesmo desafio podia ser
// respondido em cada ecrã separadamente, rendendo XP duas vezes por dia (ou
// mais, a cada troca de separador). Agora o estado "já respondido hoje" vem
// de AsyncStorage via services/dailyChallenge, partilhado pelos dois sítios.
export default function DailyChallengeCard({ variant, onAnswered }: Props) {
  const nugget = getTodayNugget();
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [alreadyAnsweredOnLoad, setAlreadyAnsweredOnLoad] = useState(false);
  const [burst, setBurst] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getDailyChallengeState().then((state) => {
        if (cancelled) return;
        if (state?.completed) {
          setChecked(true);
          setCorrect(state.correct);
          setAlreadyAnsweredOnLoad(true);
        }
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  async function submit() {
    const result = await answerDailyChallenge(answer);
    setChecked(true);
    setCorrect(result.correct);
    if (!result.alreadyAnswered) {
      if (result.correct) {
        setBurst((b) => b + 1);
        hapticSuccess();
      } else {
        hapticError();
      }
    }
    onAnswered?.(result.correct);
  }

  const isCompact = variant === 'compact';
  const Container: any = isCompact ? View : LinearGradient;
  const containerProps: any = isCompact
    ? { style: styles.compactCard }
    : { colors: Colors.gradientHero, start: { x: 0, y: 0 }, end: { x: 1, y: 1 }, style: styles.heroCard };

  if (loading) {
    return (
      <Container {...containerProps}>
        <ActivityIndicator color={Colors.primaryLight} />
      </Container>
    );
  }

  return (
    <Container {...containerProps}>
      <ParticleBurst trigger={burst} />
      <View style={styles.headerRow}>
        <Text style={isCompact ? styles.compactLabel : styles.heroLabel}>
          {isCompact ? 'Desafio diário' : 'DESAFIO DE HOJE'}
        </Text>
        <Text style={styles.giftIcon}>🎁</Text>
      </View>
      <Text style={isCompact ? styles.compactPrompt : styles.heroPrompt} numberOfLines={isCompact ? 2 : undefined}>
        {nugget.translation}
      </Text>
      {!isCompact && <Text style={styles.heroHint}>Traduz esta frase para inglês</Text>}

      {!checked ? (
        <>
          <TextInput
            style={isCompact ? styles.compactInput : styles.heroInput}
            value={answer}
            onChangeText={setAnswer}
            placeholder={isCompact ? 'Traduz para inglês...' : 'A tua resposta...'}
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.btn, !answer.trim() && { opacity: 0.5 }]}
            onPress={submit}
            disabled={!answer.trim()}
          >
            <Text style={styles.btnText}>Verificar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View>
          <Text style={[styles.result, { color: correct ? Colors.success : Colors.coral }]}>
            {correct ? `✓ Certo! +${DAILY_CHALLENGE_XP} XP` : `✗ Era: "${nugget.phrase}"`}
          </Text>
          {!isCompact && nugget.explanation && <Text style={styles.explanation}>{nugget.explanation}</Text>}
          <Text style={styles.alreadyDoneHint}>
            {alreadyAnsweredOnLoad || checked ? 'Já respondeste ao desafio de hoje — volta amanhã para um novo.' : ''}
          </Text>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  compactCard: { flex: 1, backgroundColor: Colors.card, borderRadius: 18, padding: 14, position: 'relative' },
  heroCard: {
    borderRadius: 22, padding: 20, marginBottom: 30, position: 'relative',
    shadowColor: Colors.purple, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 10,
  },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  compactLabel: { color: Colors.text, fontSize: 13, fontWeight: '700' },
  heroLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  giftIcon: { fontSize: 18 },

  compactPrompt: { color: Colors.textSecondary, fontSize: 12, marginTop: 8, marginBottom: 10, minHeight: 32 },
  heroPrompt: { color: Colors.text, fontSize: 20, fontWeight: '700', marginTop: 12 },
  heroHint: { color: Colors.textMuted, fontSize: 12, marginTop: 6, marginBottom: 16 },

  compactInput: {
    backgroundColor: Colors.surface, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8,
    color: Colors.text, fontSize: 12, marginBottom: 8,
  },
  heroInput: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    color: Colors.text, fontSize: 15, marginBottom: 12,
  },

  btn: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  result: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  explanation: { color: Colors.textSecondary, fontSize: 12, marginBottom: 10, lineHeight: 18 },
  alreadyDoneHint: { color: Colors.textMuted, fontSize: 11 },
});
