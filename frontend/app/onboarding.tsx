import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../src/constants/theme';
import { onboardingPages, languageOptions } from '../src/constants/mockData';

const MAX_MOBILE_WIDTH = 390;
const getResponsiveWidth = () => Math.min(Dimensions.get('window').width, MAX_MOBILE_WIDTH);
const width = getResponsiveWidth();
const height = Dimensions.get('window').height;

const OnboardingPage = ({ page, index, pageWidth }: { page: typeof onboardingPages[0]; index: number; pageWidth: number }) => {
  const getIllustration = () => {
    switch (index) {
      case 0:
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.phoneFrame}>
              <View style={styles.phoneScreen}>
                <View style={styles.miniDashboard}>
                  <View style={styles.miniHeader} />
                  <View style={styles.miniCards}>
                    <View style={[styles.miniCard, { backgroundColor: Colors.successLight }]} />
                    <View style={[styles.miniCard, { backgroundColor: Colors.infoLight }]} />
                    <View style={[styles.miniCard, { backgroundColor: Colors.accentLight }]} />
                  </View>
                  <View style={styles.miniChart} />
                </View>
              </View>
            </View>
            {/* Floating elements */}
            <View style={[styles.floatingBadge, { top: 60, right: 40, backgroundColor: Colors.successLight }]}>
              <Text style={styles.floatingText}>+18%</Text>
            </View>
            <View style={[styles.floatingBadge, { bottom: 80, left: 30, backgroundColor: Colors.accentLight }]}>
              <Text style={styles.floatingText}>AI</Text>
            </View>
          </View>
        );
      case 1:
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.billContainer}>
              <View style={styles.billPaper}>
                <View style={styles.billLine} />
                <View style={[styles.billLine, { width: '60%' }]} />
                <View style={styles.billLine} />
                <View style={[styles.billLine, { width: '80%' }]} />
                <View style={styles.billLine} />
              </View>
              {/* Scan line animation representation */}
              <View style={styles.scanLine} />
              {/* Checkmarks */}
              <View style={[styles.checkBadge, { top: 40, right: 20 }]}>
                <Ionicons name="checkmark" size={16} color={Colors.success} />
              </View>
              <View style={[styles.checkBadge, { top: 80, right: 30 }]}>
                <Ionicons name="checkmark" size={16} color={Colors.success} />
              </View>
              <View style={[styles.checkBadge, { top: 120, right: 25 }]}>
                <Ionicons name="checkmark" size={16} color={Colors.success} />
              </View>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.chatIllustration}>
              {/* Chat bubbles */}
              <View style={styles.userBubbleDemo}>
                <Text style={styles.bubbleTextDemo}>Rice ka daam?</Text>
              </View>
              <View style={styles.aiBubbleDemo}>
                <Text style={styles.bubbleTextDemo}>₹350 competitive hai! 👍</Text>
              </View>
              {/* Language badges */}
              <View style={styles.langBadges}>
                {languageOptions.map((lang, i) => (
                  <View key={lang.code} style={[styles.langBadge, i === 1 && styles.langBadgeActive]}>
                    <Text style={[styles.langBadgeText, i === 1 && styles.langBadgeTextActive]}>{lang.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.pricingIllustration}>
              {/* Strategy cards preview */}
              <View style={[styles.strategyPreview, { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' }]}>
                <Text style={[styles.strategyLabel, { color: '#3B82F6' }]}>Competitive</Text>
                <Text style={styles.strategyPrice}>₹335</Text>
              </View>
              <View style={[styles.strategyPreview, { backgroundColor: '#DCFCE7', borderColor: '#22C55E', transform: [{ scale: 1.05 }] }]}>
                <View style={styles.recommendedBadgeSmall}>
                  <Text style={styles.recommendedTextSmall}>Best</Text>
                </View>
                <Text style={[styles.strategyLabel, { color: '#22C55E' }]}>Balanced</Text>
                <Text style={styles.strategyPrice}>₹365</Text>
              </View>
              <View style={[styles.strategyPreview, { backgroundColor: '#EDE9FE', borderColor: '#7C3AED' }]}>
                <Text style={[styles.strategyLabel, { color: '#7C3AED' }]}>Premium</Text>
                <Text style={styles.strategyPrice}>₹399</Text>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.page, { width: pageWidth }]}>
      {getIllustration()}
      <View style={styles.textContainer}>
        <Text style={styles.pageTitle}>{page.title}</Text>
        <Text style={styles.pageDescription}>{page.description}</Text>
      </View>
    </View>
  );
};

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [layoutWidth, setLayoutWidth] = useState(width);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleLayout = (event: any) => {
    const w = event.nativeEvent.layout.width;
    if (w > 0) setLayoutWidth(w);
  };

  const handleScroll = (event: any) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / layoutWidth);
    setCurrentPage(page);
  };

  const handleSkip = () => {
    router.replace('/setup');
  };

  const handleGetStarted = () => {
    router.replace('/setup');
  };

  const goToPage = (pageIndex: number) => {
    scrollViewRef.current?.scrollTo({ x: pageIndex * layoutWidth, animated: true });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Swipeable pages */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onLayout={handleLayout}
        scrollEventThrottle={16}
      >
        {onboardingPages.map((page, index) => (
          <OnboardingPage key={page.id} page={page} index={index} pageWidth={layoutWidth} />
        ))}
      </ScrollView>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {/* Dot indicators */}
        <View style={styles.dotsContainer}>
          {onboardingPages.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToPage(index)}
              style={[
                styles.dot,
                currentPage === index && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Get Started button (only on last page) */}
        {currentPage === onboardingPages.length - 1 ? (
          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.textWhite} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => goToPage(currentPage + 1)}
          >
            <Ionicons name="arrow-forward" size={24} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: Spacing.sm,
  },
  skipText: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    fontWeight: FontWeights.medium,
  },
  page: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  illustrationContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  textContainer: {
    flex: 0.4,
    paddingTop: Spacing.xl,
  },
  pageTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  pageDescription: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: Spacing.md,
  },
  bottomSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  getStartedText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Illustration styles
  phoneFrame: {
    width: 180,
    height: 320,
    backgroundColor: Colors.textPrimary,
    borderRadius: 30,
    padding: 8,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 24,
    overflow: 'hidden',
  },
  miniDashboard: {
    flex: 1,
    padding: 12,
  },
  miniHeader: {
    height: 20,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 12,
  },
  miniCards: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  miniCard: {
    flex: 1,
    height: 50,
    borderRadius: 8,
  },
  miniChart: {
    flex: 1,
    backgroundColor: Colors.border,
    borderRadius: 8,
  },
  floatingBadge: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  floatingText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  billContainer: {
    width: 200,
    position: 'relative',
  },
  billPaper: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  billLine: {
    height: 12,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 12,
    width: '100%',
  },
  scanLine: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.success,
  },
  checkBadge: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatIllustration: {
    width: '100%',
    alignItems: 'center',
  },
  userBubbleDemo: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.whatsappBubble,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    marginBottom: 12,
    marginRight: 20,
  },
  aiBubbleDemo: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    marginBottom: 20,
    marginLeft: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleTextDemo: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  langBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  langBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langBadgeActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  langBadgeText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  langBadgeTextActive: {
    color: Colors.textWhite,
  },
  pricingIllustration: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  strategyPreview: {
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    alignItems: 'center',
    minWidth: 90,
  },
  strategyLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    marginBottom: 4,
  },
  strategyPrice: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  recommendedBadgeSmall: {
    position: 'absolute',
    top: -8,
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  recommendedTextSmall: {
    fontSize: 10,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
