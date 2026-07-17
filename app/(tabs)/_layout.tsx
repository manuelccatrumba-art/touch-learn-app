import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
        size={22}
        color={color}
      />
    </View>
  );
}

// Botão central elevado do Tutor — gradiente azul→roxo, acima da tab bar.
function TutorTabButton({ onPress, accessibilityState }: any) {
  const focused = accessibilityState?.selected;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        top: -18,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LinearGradient
        colors={Colors.gradientTutor}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 58,
          height: 58,
          borderRadius: 29,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 4,
          borderColor: Colors.background,
          shadowColor: Colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={26} color={Colors.white} />
      </LinearGradient>
    </TouchableOpacity>
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
        name="licoes"
        options={{
          title: 'Lições',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="book" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: '',
          tabBarButton: (props) => <TutorTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="desafios"
        options={{
          title: 'Desafios',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="trophy" color={color} focused={focused} />
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

      {/* Continuam navegáveis via deep-link, mas escondidas da tab bar. */}
      <Tabs.Screen name="grammar" options={{ href: null }} />
      <Tabs.Screen name="vocabulary" options={{ href: null }} />
      <Tabs.Screen name="culture" options={{ href: null }} />
      <Tabs.Screen name="library" options={{ href: null }} />
    </Tabs>
  );
}
