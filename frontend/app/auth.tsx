import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '../src/constants/theme';
import { useAuth } from '../src/context/AuthContext';
import { isOnboardingDone } from '../src/services/storage';

type AuthStep = 'phone' | 'otp' | 'name';

export default function AuthScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const otpRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [step]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const animateStep = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  };

  const DEMO_PHONE = '9876543210';
  const DEMO_OTP = '123456';
  const DEMO_NAME = 'Demo Judge';

  const handleDemoLogin = async () => {
    setPhone(DEMO_PHONE);
    setIsLoading(true);
    try {
      await login({
        phone: `+91${DEMO_PHONE}`,
        name: DEMO_NAME,
        isVerified: true,
        createdAt: new Date().toISOString(),
      });
      const done = await isOnboardingDone();
      if (done) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number');
      return;
    }
    setIsLoading(true);
    // Simulate OTP send
    setTimeout(() => {
      setIsLoading(false);
      setResendTimer(30);
      // Auto-fill OTP for demo number
      if (phone === DEMO_PHONE) {
        setOtp(DEMO_OTP.split(''));
      }
      setStep('otp');
      animateStep();
    }, 1500);
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP');
      return;
    }
    setIsLoading(true);
    // Simulate OTP verification (accept any 6-digit code)
    setTimeout(() => {
      setIsLoading(false);
      // Pre-fill name for demo number
      if (phone === DEMO_PHONE) {
        setName(DEMO_NAME);
      }
      setStep('name');
      animateStep();
    }, 1000);
  };

  const handleComplete = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name');
      return;
    }
    setIsLoading(true);
    try {
      await login({
        phone: `+91${phone}`,
        name: name.trim(),
        isVerified: true,
        createdAt: new Date().toISOString(),
      });
      const done = await isOnboardingDone();
      if (done) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    Alert.alert('OTP Sent', 'A new OTP has been sent to your phone');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="storefront" size={48} color={Colors.textWhite} />
          </View>
          <Text style={styles.appTitle}>BharatBazaar AI</Text>
          <Text style={styles.appTitleHindi}>भारत बाज़ार AI</Text>

          {/* Prototype Notice for Judges */}
          <View style={styles.prototypeBadge}>
            <Ionicons name="phone-portrait-outline" size={14} color={Colors.textWhite} />
            <Text style={styles.prototypeBadgeText}>
              Native Mobile App — deployed as web prototype for demo
            </Text>
          </View>
        </View>

        {/* Form */}
        <Animated.View
          style={[
            styles.formSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {step === 'phone' && (
            <View style={styles.formCard}>
              {/* Demo Login Banner for Judges */}
              <View style={styles.demoBanner}>
                <View style={styles.demoBannerHeader}>
                  <Ionicons name="flash" size={22} color="#F59E0B" />
                  <Text style={styles.demoBannerTitle}>Demo Mode</Text>
                </View>
                <Text style={styles.demoBannerDesc}>
                  Phone: 9876543210  |  OTP: 123456
                </Text>
                <TouchableOpacity style={styles.demoBtn} onPress={handleDemoLogin}>
                  {isLoading ? (
                    <ActivityIndicator color={Colors.textWhite} />
                  ) : (
                    <>
                      <Ionicons name="flash" size={18} color={Colors.textWhite} />
                      <Text style={styles.demoBtnText}>Quick Demo Login</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.demoDivider}>
                <View style={styles.demoDividerLine} />
                <Text style={styles.demoDividerText}>OR LOGIN</Text>
                <View style={styles.demoDividerLine} />
              </View>

              <Text style={styles.formTitle}>Welcome! 🙏</Text>
              <Text style={styles.formSubtitle}>Enter your phone number to get started</Text>

              <View style={styles.phoneInputRow}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  value={phone}
                  onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, '').slice(0, 10))}
                  placeholder="98765 43210"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="phone-pad"
                  maxLength={10}
                  autoFocus
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, phone.length !== 10 && styles.primaryBtnDisabled]}
                onPress={handleSendOtp}
                disabled={phone.length !== 10 || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.textWhite} />
                ) : (
                  <>
                    <Text style={styles.primaryBtnText}>Send OTP</Text>
                    <Ionicons name="arrow-forward" size={20} color={Colors.textWhite} />
                  </>
                )}
              </TouchableOpacity>

              <Text style={styles.termsText}>
                By continuing, you agree to our Terms of Service
              </Text>
            </View>
          )}

          {step === 'otp' && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Verify OTP</Text>
              <Text style={styles.formSubtitle}>
                Enter the 6-digit code sent to +91 {phone}
              </Text>

              <View style={styles.otpRow}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => { otpRefs.current[index] = ref; }}
                    style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value.replace(/[^0-9]/g, '').slice(0, 1), index)}
                    onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    autoFocus={index === 0}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, otp.join('').length !== 6 && styles.primaryBtnDisabled]}
                onPress={handleVerifyOtp}
                disabled={otp.join('').length !== 6 || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.textWhite} />
                ) : (
                  <Text style={styles.primaryBtnText}>Verify</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleResendOtp} disabled={resendTimer > 0}>
                <Text style={[styles.resendText, resendTimer > 0 && styles.resendTextDisabled]}>
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setStep('phone'); animateStep(); }}>
                <Text style={styles.changeNumberText}>Change number</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'name' && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Almost done!</Text>
              <Text style={styles.formSubtitle}>What should we call you?</Text>

              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={Colors.textMuted}
                autoFocus
                autoCapitalize="words"
              />

              <TouchableOpacity
                style={[styles.primaryBtn, !name.trim() && styles.primaryBtnDisabled]}
                onPress={handleComplete}
                disabled={!name.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.textWhite} />
                ) : (
                  <>
                    <Text style={styles.primaryBtnText}>Get Started</Text>
                    <Ionicons name="arrow-forward" size={20} color={Colors.textWhite} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          {['phone', 'otp', 'name'].map((s, i) => (
            <View
              key={s}
              style={[
                styles.stepDot,
                step === s && styles.stepDotActive,
                ['otp', 'name'].indexOf(step) > i ? styles.stepDotDone : null,
              ]}
            />
          ))}
        </View>

        {/* App Store Notice */}
        <View style={styles.appStoreNotice}>
          <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.appStoreNoticeText}>
            Built with React Native + Expo — planning App Store & Play Store release if selected
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  keyboardView: {
    flex: 1,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  appTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  appTitleHindi: {
    fontSize: FontSizes.xl,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  prototypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  prototypeBadgeText: {
    fontSize: FontSizes.xs,
    color: Colors.textWhite,
    fontWeight: FontWeights.medium,
  },
  formSection: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  formCard: {
    alignItems: 'center',
  },
  formTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  formSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  phoneInputRow: {
    flexDirection: 'row',
    width: '100%',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  countryCode: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  countryCodeText: {
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    letterSpacing: 2,
  },
  otpRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    textAlign: 'center',
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  otpInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  nameInput: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  primaryBtnDisabled: {
    backgroundColor: Colors.textMuted,
  },
  primaryBtnText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  termsText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  resendText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.sm,
  },
  resendTextDisabled: {
    color: Colors.textMuted,
  },
  changeNumberText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  stepDotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  stepDotDone: {
    backgroundColor: Colors.success,
  },
  demoDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  demoDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  demoDividerText: {
    marginHorizontal: Spacing.md,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    fontWeight: FontWeights.medium,
  },
  demoBanner: {
    width: '100%',
    backgroundColor: '#FFFBEB',
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: '#F59E0B',
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  demoBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  demoBannerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: '#92400E',
  },
  demoBannerDesc: {
    fontSize: FontSizes.md,
    color: '#78350F',
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F59E0B',
    gap: Spacing.xs,
  },
  demoBtnText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  appStoreNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: 6,
    backgroundColor: Colors.primary,
  },
  appStoreNoticeText: {
    fontSize: FontSizes.xs,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});
