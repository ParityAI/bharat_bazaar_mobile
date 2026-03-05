import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSizes, FontWeights } from '../src/constants/theme';
import { BrandLogo } from '../src/components/BrandLogo';

const MAX_MOBILE_WIDTH = 390;
const width = Math.min(Dimensions.get('window').width, MAX_MOBILE_WIDTH);

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const loadingWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Loading bar animation
    Animated.timing(loadingWidth, {
      toValue: width * 0.6,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Navigate to onboarding after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Brand Logo */}
        <View style={styles.iconContainer}>
          <BrandLogo size={80} color={Colors.textWhite} />
        </View>

        {/* App Name */}
        <Text style={styles.appName}>BharatBazaar AI</Text>
        <Text style={styles.appNameHindi}>भारत बाज़ार AI</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>Weighed by Intelligence</Text>
      </Animated.View>

      {/* Loading Bar */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingTrack}>
          <Animated.View
            style={[
              styles.loadingBar,
              { width: loadingWidth },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 36,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
    letterSpacing: 1,
  },
  appNameHindi: {
    fontSize: 24,
    fontWeight: FontWeights.medium,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
  },
  tagline: {
    fontSize: FontSizes.lg,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 16,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    width: '60%',
  },
  loadingTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    backgroundColor: Colors.textWhite,
    borderRadius: 2,
  },
});
