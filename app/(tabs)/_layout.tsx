import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import { Colors } from '../../constants/Colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, color, focused }: { name: IconName; color: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {focused && (
        <View style={{
          position: 'absolute',
          top: -4,
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: Colors.primaryGlow,
        }} />
      )}
      <Ionicons
        name={focused ? name : (`${name}-outline` as IconName)}
        size={24}
        color={color}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 82 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 6,
          shadowColor: Colors.primary,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: Colors.tabBarActive,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="trail"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Tutor',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="chatbubbles" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Biblioteca',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="library" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person" color={color} focused={focused} />
          ),
        }}
      />

      {/* Ainda navegáveis (deep-links a partir da Trilha/Biblioteca), mas
          escondidos da tab bar para reduzir a fragmentação de 7 para 4 abas. */}
      <Tabs.Screen name="grammar" options={{ href: null }} />
      <Tabs.Screen name="vocabulary" options={{ href: null }} />
      <Tabs.Screen name="culture" options={{ href: null }} />
    </Tabs>
  );
}
