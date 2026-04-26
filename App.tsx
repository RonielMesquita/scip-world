import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import Grad from './src/components/Grad';
import AppNavigator from './src/navigation/AppNavigator';
import Colors from './src/constants/colors';
import { AuthProvider } from './src/contexts/AuthContext';
import { LanguageProvider } from './src/contexts/LanguageContext';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      setAppReady(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!appReady) {
    return (
      <View style={styles.splash}>
        <Grad
          colors={Colors.gradients.background}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.splashContent}>
          <View style={styles.splashLogo}>
            <Grad
              colors={Colors.gradients.tech}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
              borderRadius={20}
            />
            <Text style={styles.splashLogoText}>S</Text>
          </View>
          <Text style={styles.splashTitle}>SCIP WORLD</Text>
          <Text style={styles.splashTagline}>Structural Concrete Insulated Panels</Text>
        </View>
      </View>
    );
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar style="light" backgroundColor="transparent" translucent />
          {Platform.OS === 'web' ? (
            <View style={styles.webOuter}>
              <View style={styles.webContainer}>
                <AppNavigator />
              </View>
            </View>
          ) : (
            <AppNavigator />
          )}
        </SafeAreaProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  webOuter: {
    flex: 1,
    backgroundColor: '#020508',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webContainer: {
    width: '100%',
    maxWidth: 430,
    height: '100%',
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0 0 60px rgba(0,0,0,0.8)' } as any : {}),
  },
  splash: {
    flex: 1,
    backgroundColor: Colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashContent: {
    alignItems: 'center',
    gap: 12,
  },
  splashLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  splashLogoText: {
    fontSize: 42,
    fontWeight: '400',
    color: '#FFFFFF',
    zIndex: 1,
  },
  splashTitle: {
    fontSize: 23,
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  splashTagline: {
    fontSize: 14,
    color: '#A0A8B8',
    letterSpacing: 0.5,
  },
});
