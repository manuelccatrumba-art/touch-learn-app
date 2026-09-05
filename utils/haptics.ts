import * as Haptics from 'expo-haptics';

// Wrapper silencioso — expo-haptics pode rejeitar em web/emuladores sem
// suporte a vibração, e isso nunca deve interromper o fluxo da app (um
// "toque" a mais ou a menos não é motivo para mostrar erro ao utilizador).
function safe(fn: () => Promise<void>) {
  fn().catch(() => {});
}

export function hapticSuccess() {
  safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

export function hapticError() {
  safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
}

export function hapticSelect() {
  safe(() => Haptics.selectionAsync());
}

export function hapticTap() {
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}
