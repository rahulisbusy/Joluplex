// components/Shared/LoaderScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import Colors from '@/data/Colors';

export default function LoaderScreen({ message = 'Loading…' }: { message?: string }) {
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const fade  = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1600,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.0,  duration: 700, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(fade, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [spin, pulse, fade]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Rotating sunburst */}
        <Animated.View style={[styles.sunburst, { transform: [{ rotate }] }]} />

        {/* Pulsing primary badge */}
        <Animated.View style={[styles.badge, { transform: [{ scale: pulse }] }]}>
          <Text style={styles.badgeText}>⏳</Text>
        </Animated.View>

        {/* Message */}
        <Animated.Text style={[styles.message, { opacity: fade }]}>
          {message}
        </Animated.Text>
      </View>
    </View>
  );
}

const SIZE = 128;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: Colors.TERTIARY,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999, // make sure it floats above everything
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunburst: {
    position: 'absolute',
    width: SIZE * 1.6,
    height: SIZE * 1.6,
    borderRadius: 999,
    borderWidth: 8,
    borderColor: Colors.WHITE,
    opacity: 0.5,
    shadowColor: Colors.GRAY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 6,
  },
  badge: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.SECONDARY,
  },
  badgeText: {
    fontSize: 40,
    color: Colors.WHITE,
  },
  message: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.SECONDARY,
    textAlign: 'center',
  },
});
