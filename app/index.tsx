import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';
import { getProfile } from '../services/profile';

export default function Index() {
  const [target, setTarget] = useState<'/trail' | '/placement' | null>(null);

  useEffect(() => {
    getProfile().then((p) => setTarget(p.placementDone ? '/trail' : '/placement'));
  }, []);

  if (!target) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return <Redirect href={target} />;
}
