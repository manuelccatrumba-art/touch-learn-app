import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './Colors';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export const SEGMENT_ICONS: Record<'grammar' | 'vocabulary' | 'culture', { icon: IoniconName; color: string }> = {
  grammar: { icon: 'help-circle', color: Colors.error },
  vocabulary: { icon: 'book', color: Colors.primary },
  culture: { icon: 'sparkles', color: Colors.success },
};
