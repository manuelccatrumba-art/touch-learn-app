import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface Props {
  name: IoniconName;
  color: string;
  size?: number;
  badgeSize?: number;
  shape?: 'circle' | 'square';
}

// Consistent line-art icon-in-badge, replacing emoji used as icons across
// list rows and category markers.
export default function IconBadge({ name, color, size = 18, badgeSize = 36, shape = 'square' }: Props) {
  return (
    <View
      style={[
        styles.badge,
        {
          width: badgeSize,
          height: badgeSize,
          borderRadius: shape === 'circle' ? badgeSize / 2 : badgeSize * 0.32,
          backgroundColor: color + '22',
        },
      ]}
    >
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignItems: 'center', justifyContent: 'center' },
});
