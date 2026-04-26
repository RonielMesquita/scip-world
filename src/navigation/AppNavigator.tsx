import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { WatchHistoryProvider } from '../contexts/WatchHistoryContext';
import TabNavigator from './TabNavigator';
import LoginScreen from '../screens/LoginScreen';
import EmpresaProfileScreen from '../screens/EmpresaProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EspecialistasScreen from '../screens/EspecialistasScreen';
import EstimarScreen from '../screens/EstimarScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BusinessSetupScreen from '../screens/BusinessSetupScreen';
import { Company } from '../data/mockData';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  EmpresaProfile: { company: Company };
  Profile: undefined;
  Especialistas: undefined;
  Estimar: undefined;
  BusinessSetup: {
    initialName?: string;
    initialRole?: string;
    initialCity?: string;
    initialPhone?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <WatchHistoryProvider>
    <View style={{ flex: 1 }}>
<NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'ios',
          contentStyle: { backgroundColor: '#04080F' },
          animationDuration: 320,
        }}
      >
        {!user ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ animation: 'fade', animationDuration: 400 }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ animation: 'slide_from_bottom', animationDuration: 380 }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="MainTabs"
              component={TabNavigator}
              options={{ animation: 'fade', animationDuration: 350 }}
            />
            <Stack.Screen
              name="EmpresaProfile"
              component={EmpresaProfileScreen}
              options={{ animation: 'slide_from_bottom', animationDuration: 380 }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ animation: 'ios', animationDuration: 300 }}
            />
            <Stack.Screen
              name="Especialistas"
              component={EspecialistasScreen}
              options={{ animation: 'slide_from_bottom', animationDuration: 350 }}
            />
            <Stack.Screen
              name="Estimar"
              component={EstimarScreen}
              options={{ animation: 'slide_from_bottom', animationDuration: 350 }}
            />
            <Stack.Screen
              name="BusinessSetup"
              component={BusinessSetupScreen}
              options={{ animation: 'slide_from_bottom', animationDuration: 400 }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </View>
    </WatchHistoryProvider>
  );
}
