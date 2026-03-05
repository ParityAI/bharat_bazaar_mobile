import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '../../src/constants/theme';
import { AnimatedNumber } from '../../src/components/AnimatedNumber';
import {
  storeOwner,
  dashboardStats,
  aiInsight,
  topSellers,
  festivalAlert,
  weatherData,
  weeklyChartData,
} from '../../src/constants/mockData';

const { width } = Dimensions.get('window');

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'सुप्रभात!';
  if (hour < 17) return 'नमस्कार!';
  return 'शुभ संध्या!';
};

// Simple Bar Chart Component
const WeeklyChart = () => {
  const maxValue = Math.max(...weeklyChartData.map(d => d.value));
  
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Weekly Revenue</Text>
      <View style={styles.chartBars}>
        {weeklyChartData.map((item, index) => (
          <View key={item.day} style={styles.chartBarContainer}>
            <View style={styles.chartBarWrapper}>
              <View 
                style={[
                  styles.chartBar, 
                  { height: `${(item.value / maxValue) * 100}%` },
                  index === 5 && styles.chartBarHighlight
                ]} 
              />
            </View>
            <Text style={styles.chartLabel}>{item.day}</Text>
            <Text style={styles.chartValue}>₹{(item.value / 1000).toFixed(0)}K</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 🙏</Text>
            <Text style={styles.storeName}>{storeOwner.storeName}</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationBtn}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Revenue Hero Card */}
        <Animated.View 
          style={[
            styles.heroCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>Today's Revenue</Text>
            <AnimatedNumber
              value={dashboardStats.todayRevenue}
              prefix="₹"
              style={styles.heroValue}
              duration={1500}
            />
            <View style={styles.heroBadge}>
              <Ionicons name="arrow-up" size={14} color={Colors.success} />
              <Text style={styles.heroBadgeText}>+{dashboardStats.todayRevenueChange}% vs yesterday</Text>
            </View>
          </View>
          <View style={styles.heroSparkline}>
            {/* Mini sparkline representation */}
            {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
              <View key={i} style={[styles.sparklineBar, { height: h }]} />
            ))}
          </View>
        </Animated.View>

        {/* Stats Cards Row */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.statsScroll}
          contentContainerStyle={styles.statsContainer}
        >
          <View style={[styles.statCard, styles.statCardBlue]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="cube-outline" size={20} color={Colors.info} />
            </View>
            <Text style={styles.statLabel}>Items Sold</Text>
            <AnimatedNumber value={dashboardStats.itemsSold} style={styles.statValue} />
            <Text style={styles.statSubtext}>today</Text>
          </View>

          <View style={[styles.statCard, styles.statCardRed]}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.errorLight }]}>
              <Ionicons name="warning-outline" size={20} color={Colors.error} />
            </View>
            <Text style={styles.statLabel}>Low Stock</Text>
            <AnimatedNumber value={dashboardStats.lowStock} style={[styles.statValue, { color: Colors.error }]} />
            <Text style={styles.statSubtext}>items</Text>
          </View>

          <View style={[styles.statCard, styles.statCardPurple]}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.accentLight }]}>
              <Ionicons name="clipboard-outline" size={20} color={Colors.accent} />
            </View>
            <Text style={styles.statLabel}>Orders</Text>
            <AnimatedNumber value={dashboardStats.pendingOrders} style={[styles.statValue, { color: Colors.accent }]} />
            <Text style={styles.statSubtext}>pending</Text>
          </View>
        </ScrollView>

        {/* AI Insight Card */}
        <View style={styles.aiInsightCard}>
          <View style={styles.aiInsightHeader}>
            <View style={styles.aiIconContainer}>
              <Ionicons name="bulb" size={20} color={Colors.accent} />
            </View>
            <Text style={styles.aiInsightTitle}>AI Insights</Text>
          </View>
          <Text style={styles.aiInsightText}>
            {aiInsight.icon} {aiInsight.message}
          </Text>
          <View style={styles.aiInsightActions}>
            <TouchableOpacity style={styles.aiActionOutline}>
              <Text style={styles.aiActionOutlineText}>Dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.aiActionFilled}>
              <Text style={styles.aiActionFilledText}>Stock Now</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.textWhite} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Top Sellers */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top Sellers Today</Text>
          {topSellers.map((item, index) => (
            <View key={item.id} style={styles.topSellerItem}>
              <View style={[
                styles.topSellerRank,
                index === 0 && styles.rankGold,
                index === 1 && styles.rankSilver,
                index === 2 && styles.rankBronze,
              ]}>
                <Text style={[
                  styles.rankText,
                  index < 3 && styles.rankTextTop
                ]}>
                  {item.emoji || (index + 1)}
                </Text>
              </View>
              <View style={styles.topSellerInfo}>
                <Text style={styles.topSellerName}>{item.name}</Text>
                <Text style={styles.topSellerSold}>{item.sold} sold</Text>
              </View>
              <Text style={styles.topSellerRevenue}>{formatCurrency(item.revenue)}</Text>
            </View>
          ))}
        </View>

        {/* Festival Alert */}
        <View style={styles.festivalCard}>
          <View style={styles.festivalHeader}>
            <Text style={styles.festivalEmoji}>🎆</Text>
            <View style={styles.festivalTitleContainer}>
              <Text style={styles.festivalTitle}>
                {festivalAlert.festival} in {festivalAlert.daysAway} days
              </Text>
              <View style={styles.festivalImpactBadge}>
                <Text style={styles.festivalImpactText}>{festivalAlert.impact} Impact</Text>
              </View>
            </View>
          </View>
          <Text style={styles.festivalSuggestion}>{festivalAlert.suggestion}</Text>
          <TouchableOpacity style={styles.festivalButton}>
            <Text style={styles.festivalButtonText}>Prepare Stock</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/scanner')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="camera" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Scan Bill</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/invoice')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.secondaryLight }]}>
              <Ionicons name="receipt" size={24} color={Colors.secondary} />
            </View>
            <Text style={styles.quickActionText}>New Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/pricing')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.accentLight }]}>
              <Ionicons name="pricetag" size={24} color={Colors.accent} />
            </View>
            <Text style={styles.quickActionText}>Check Price</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/chat')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.successLight }]}>
              <Ionicons name="chatbubble-ellipses" size={24} color={Colors.success} />
            </View>
            <Text style={styles.quickActionText}>Ask Munim-ji</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Revenue Chart */}
        <WeeklyChart />

        {/* Weather Widget */}
        <View style={styles.weatherWidget}>
          <View style={styles.weatherMain}>
            <Text style={styles.weatherIcon}>☁️</Text>
            <View>
              <Text style={styles.weatherCity}>{weatherData.city} • {weatherData.temp}°C</Text>
              <Text style={styles.weatherCondition}>{weatherData.condition} • Humidity {weatherData.humidity}%</Text>
            </View>
          </View>
          <Text style={styles.weatherImpact}>Business Impact: {weatherData.impact}</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  storeName: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    marginTop: 2,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  heroCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    ...Shadows.lg,
  },
  heroContent: {
    flex: 1,
  },
  heroLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  heroValue: {
    fontSize: FontSizes.hero,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
  },
  heroBadgeText: {
    fontSize: FontSizes.sm,
    color: Colors.success,
    fontWeight: FontWeights.medium,
    marginLeft: 4,
  },
  heroSparkline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 60,
    gap: 4,
  },
  sparklineBar: {
    width: 6,
    backgroundColor: Colors.primary,
    borderRadius: 3,
    opacity: 0.3,
  },
  statsScroll: {
    marginBottom: Spacing.md,
    marginHorizontal: -Spacing.md,
  },
  statsContainer: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  statCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    width: 130,
    ...Shadows.md,
  },
  statCardBlue: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },
  statCardRed: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  statCardPurple: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.infoLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  statValue: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginVertical: 2,
  },
  statSubtext: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  aiInsightCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
    ...Shadows.md,
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  aiIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  aiInsightTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.accent,
  },
  aiInsightText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  aiInsightActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  aiActionOutline: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  aiActionOutlineText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    fontWeight: FontWeights.medium,
  },
  aiActionFilled: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accent,
    gap: 4,
  },
  aiActionFilledText: {
    fontSize: FontSizes.sm,
    color: Colors.textWhite,
    fontWeight: FontWeights.medium,
  },
  sectionContainer: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  topSellerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  topSellerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  rankGold: {
    backgroundColor: '#FEF3C7',
  },
  rankSilver: {
    backgroundColor: '#F3F4F6',
  },
  rankBronze: {
    backgroundColor: '#FED7AA',
  },
  rankText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.textMuted,
  },
  rankTextTop: {
    fontSize: 16,
  },
  topSellerInfo: {
    flex: 1,
  },
  topSellerName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  topSellerSold: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  topSellerRevenue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.success,
  },
  festivalCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  festivalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  festivalEmoji: {
    fontSize: 32,
    marginRight: Spacing.sm,
  },
  festivalTitleContainer: {
    flex: 1,
  },
  festivalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  festivalImpactBadge: {
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  festivalImpactText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  festivalSuggestion: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  festivalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  festivalButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  quickActionCard: {
    width: (width - Spacing.md * 2 - Spacing.sm) / 2 - 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.md,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  chartContainer: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  chartTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarWrapper: {
    height: 80,
    width: 24,
    backgroundColor: Colors.divider,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  chartBarHighlight: {
    backgroundColor: Colors.success,
  },
  chartLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },
  chartValue: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  weatherWidget: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  weatherIcon: {
    fontSize: 32,
    marginRight: Spacing.sm,
  },
  weatherCity: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  weatherCondition: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  weatherImpact: {
    fontSize: FontSizes.sm,
    color: Colors.secondary,
    fontWeight: FontWeights.medium,
  },
});
