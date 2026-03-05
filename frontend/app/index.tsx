import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../src/constants/theme';
import {
  storeOwner,
  dashboardStats,
  aiInsight,
  topSellers,
  festivalAlert,
} from '../src/constants/mockData';
import { useRouter } from 'expo-router';

// Helper to get greeting in Hindi
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'सुप्रभात';
  if (hour < 17) return 'नमस्कार';
  return 'शुभ संध्या';
};

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(dashboardStats);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => setRefreshing(false), 1500);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

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
            <Text style={styles.greeting}>
              {getGreeting()}, {storeOwner.name}! 🙏
            </Text>
            <Text style={styles.storeName}>
              {storeOwner.storeName}, {storeOwner.city}
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardRevenue]}>
            <Text style={styles.statLabel}>Today's Revenue</Text>
            <Text style={[styles.statValue, { color: Colors.success }]}>
              {formatCurrency(stats.todayRevenue)}
            </Text>
            <View style={styles.statChange}>
              <Ionicons name="arrow-up" size={12} color={Colors.success} />
              <Text style={[styles.statChangeText, { color: Colors.success }]}>
                {stats.todayRevenueChange}%
              </Text>
            </View>
          </View>

          <View style={[styles.statCard, styles.statCardItems]}>
            <Text style={styles.statLabel}>Items Sold</Text>
            <Text style={[styles.statValue, { color: Colors.secondary }]}>
              {stats.itemsSold}
            </Text>
            <Text style={styles.statSubtext}>today</Text>
          </View>

          <View style={[styles.statCard, styles.statCardWeekly]}>
            <Text style={styles.statLabel}>Weekly Revenue</Text>
            <Text style={[styles.statValue, { color: Colors.accent }]}>
              {formatCurrency(stats.weeklyRevenue)}
            </Text>
            <Text style={styles.statSubtext}>this week</Text>
          </View>
        </View>

        {/* AI Insight Card */}
        <View style={styles.aiInsightCard}>
          <View style={styles.aiInsightHeader}>
            <View style={styles.aiIconContainer}>
              <Ionicons name="bulb" size={20} color={Colors.accent} />
            </View>
            <Text style={styles.aiInsightTitle}>AI Insight</Text>
          </View>
          <Text style={styles.aiInsightText}>
            {aiInsight.icon} {aiInsight.message}
          </Text>
        </View>

        {/* Top Sellers */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top Sellers Today</Text>
          {topSellers.map((item, index) => (
            <View key={item.id} style={styles.topSellerItem}>
              <View style={styles.topSellerRank}>
                <Text style={styles.rankText}>{index + 1}</Text>
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
            <Text style={styles.festivalTitle}>
              {festivalAlert.festival} in {festivalAlert.daysAway} days
            </Text>
          </View>
          <View style={styles.festivalBadge}>
            <Text style={styles.festivalBadgeText}>{festivalAlert.impact} Impact</Text>
          </View>
          <Text style={styles.festivalSuggestion}>{festivalAlert.suggestion}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: Colors.primaryLight }]}
            onPress={() => router.push('/scanner')}
          >
            <Ionicons name="scan" size={24} color={Colors.primary} />
            <Text style={[styles.quickActionText, { color: Colors.primary }]}>Scan Bill</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: Colors.secondaryLight }]}
            onPress={() => router.push('/invoice')}
          >
            <Ionicons name="receipt" size={24} color={Colors.secondary} />
            <Text style={[styles.quickActionText, { color: Colors.secondary }]}>New Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: Colors.accentLight }]}
            onPress={() => router.push('/pricing')}
          >
            <Ionicons name="pricetag" size={24} color={Colors.accent} />
            <Text style={[styles.quickActionText, { color: Colors.accent }]}>Check Prices</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 20 }} />
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
    marginBottom: 4,
  },
  storeName: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  notificationBtn: {
    padding: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardRevenue: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
  },
  statCardItems: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondary,
  },
  statCardWeekly: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  statValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statChangeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    marginLeft: 2,
  },
  statSubtext: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },
  aiInsightCard: {
    backgroundColor: Colors.accentLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  aiIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
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
  },
  sectionContainer: {
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  rankText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
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
    backgroundColor: Colors.warningLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.warning + '40',
  },
  festivalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  festivalEmoji: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  festivalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  festivalBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  festivalBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  festivalSuggestion: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickActionBtn: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  quickActionText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
});
