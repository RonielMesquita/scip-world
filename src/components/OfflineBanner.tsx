import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import Colors from '../constants/colors';

export default function OfflineBanner() {
  const isOnline = useNetworkStatus();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: isOnline ? 0 : 1,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [isOnline]);

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-40, 0] }) }],
        },
      ]}
      pointerEvents={isOnline ? 'none' : 'auto'}
    >
      <View style={styles.dot} />
      <Text style={styles.text}>Sem conexão — exibindo conteúdo salvo</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 9,
    backgroundColor: '#1A0A00',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,140,0,0.3)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.amber,
  },
  text: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.amber,
    letterSpacing: 0.3,
  },
});
