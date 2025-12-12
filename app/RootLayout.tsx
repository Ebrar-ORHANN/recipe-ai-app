import { Stack, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        // Önce onboarding kontrolü yap
        const onboardingDone = await AsyncStorage.getItem('onboardingDone');
        
        if (!onboardingDone) {
          // Onboarding görülmemişse, onboarding'e yönlendir
          router.replace('/onboarding/step1');
          setLoading(false);
          return;
        }

        // Onboarding görülmüşse, kullanıcı durumunu kontrol et
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            router.replace('/(tabs)/home');
          } else {
            router.replace('/login');
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Onboarding kontrolü hatası:', error);
        setLoading(false);
      }
    };

    checkOnboarding();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ff914d" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}