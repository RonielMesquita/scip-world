import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Grad from '../components/Grad';
import Colors from '../constants/colors';
import { useLanguage } from '../contexts/LanguageContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import EmpresasScreen from '../screens/EmpresasScreen';
import SCIPScreen from '../screens/SCIPScreen';
import CursosScreen from '../screens/CursosScreen';
import ComunidadeScreen from '../screens/ComunidadeScreen';

const Tab = createBottomTabNavigator();

// ─── Icons ────────────────────────────────────────────────────────────────────
const ICONS: Record<string, [string, string]> = {
  Home:       ['home',        'home-outline'],
  Empresas:   ['business',    'business-outline'],
  SCIP:       ['layers',      'layers-outline'],
  Cursos:     ['play-circle', 'play-circle-outline'],
  Comunidade: ['people',      'people-outline'],
};

// ─── Animated Tab Item ────────────────────────────────────────────────────────
function AnimatedTabItem({ isFocused, onPress, icon }: {
  isFocused: boolean; onPress: () => void;
  icon: JSX.Element; label: string; color: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isFocused ? 1.22 : 1,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();
  }, [isFocused]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.tabItem} activeOpacity={0.7}>
      {isFocused && <View style={styles.activeIndicator} />}
      <Animated.View style={{ transform: [{ scale }] }}>
        {icon}
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Custom Tab Bar ────────────────────────────────────────────────────────────
function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  const icons: { [key: string]: (color: string, focused: boolean) => JSX.Element } = {
    Home:       (color, f) => <Ionicons name={f ? ICONS.Home[0] : ICONS.Home[1] as any} size={24} color={color} />,
    Empresas:   (color, f) => <Ionicons name={f ? ICONS.Empresas[0] : ICONS.Empresas[1] as any} size={24} color={color} />,
    SCIP:       (color, f) => <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.white, letterSpacing: 0.5 }}>SCIP</Text>,
    Cursos:     (color, f) => <Ionicons name={f ? ICONS.Cursos[0] : ICONS.Cursos[1] as any} size={24} color={color} />,
    Comunidade: (color, f) => <Ionicons name={f ? ICONS.Comunidade[0] : ICONS.Comunidade[1] as any} size={24} color={color} />,
  };

  const labels: { [key: string]: string } = {
    Home: t('nav.home'),
    Empresas: t('nav.empresas'),
    Estimar: t('nav.estimar'),
    Cursos: t('nav.cursos'),
    Comunidade: t('nav.comunidade'),
  };

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom || 8 }]}>
      <Grad
        colors={['rgba(4,8,15,0.98)', '#04080F']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.tabBarBorder} />
      <View style={styles.tabBarContent}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const isCenter = route.name === 'SCIP';
          const color = isFocused ? Colors.cyan : Colors.textDim;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.centerTabButton}
                activeOpacity={0.85}
              >
                <Grad
                  colors={Colors.gradients.tech}
                  style={styles.centerButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.centerIconWrapper}>
                    {icons[route.name](Colors.white, true)}
                  </View>
                </Grad>
                <View style={styles.centerGlow} />
              </TouchableOpacity>
            );
          }

          return (
            <AnimatedTabItem
              key={route.key}
              isFocused={isFocused}
              onPress={onPress}
              icon={icons[route.name](color, isFocused)}
              label={labels[route.name]}
              color={color}
            />
          );
        })}
      </View>
    </View>
  );
}

// ─── Tab Navigator ─────────────────────────────────────────────────────────────
export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Empresas" component={EmpresasScreen} />
      <Tab.Screen name="SCIP" component={SCIPScreen} />
      <Tab.Screen name="Cursos" component={CursosScreen} />
      <Tab.Screen name="Comunidade" component={ComunidadeScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 8,
  },
  tabBarBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  tabBarContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.cyan,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.2,
  },
  centerTabButton: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 0,
    marginTop: -22,
    position: 'relative',
  },
  centerButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.blue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 14,
      },
      android: { elevation: 8 },
    }),
  },
  centerIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerGlow: {
    position: 'absolute',
    top: 4,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.blue,
    opacity: 0.2,
    transform: [{ scale: 1.3 }],
  },
});
