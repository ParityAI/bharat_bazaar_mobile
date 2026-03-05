import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '../src/constants/theme';
import { inventoryItems } from '../src/constants/mockData';

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'ok':
      return { color: Colors.success, bg: Colors.successLight, icon: 'checkmark-circle' as const, label: '' };
    case 'low':
      return { color: Colors.warning, bg: Colors.warningLight, icon: 'warning' as const, label: 'LOW STOCK' };
    case 'out':
      return { color: Colors.error, bg: Colors.errorLight, icon: 'close-circle' as const, label: 'OUT OF STOCK' };
    default:
      return { color: Colors.textMuted, bg: Colors.divider, icon: 'ellipse' as const, label: '' };
  }
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'Bill Scan':
      return '📸';
    case 'WhatsApp':
      return '💬';
    case 'Manual':
      return '✋';
    case 'Wholesale':
      return '📦';
    default:
      return '📦';
  }
};

export default function InventoryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.units * item.sellPrice), 0);
  const lowStockCount = inventoryItems.filter(i => i.status === 'low').length;
  const outOfStockCount = inventoryItems.filter(i => i.status === 'out').length;

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>📦 Inventory</Text>
          <Text style={styles.headerSubtitle}>{inventoryItems.length} items</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterChips}>
        {[
          { key: 'all', label: 'All', icon: 'apps' as const },
          { key: 'low', label: 'Low Stock', icon: 'warning' as const },
          { key: 'out', label: 'Out of Stock', icon: 'close-circle' as const },
        ].map(chip => (
          <TouchableOpacity
            key={chip.key}
            style={[
              styles.filterChip,
              filter === chip.key && styles.filterChipActive,
            ]}
            onPress={() => setFilter(chip.key)}
          >
            <Ionicons 
              name={chip.icon} 
              size={16} 
              color={filter === chip.key ? Colors.textWhite : Colors.textMuted} 
            />
            <Text style={[
              styles.filterChipText,
              filter === chip.key && styles.filterChipTextActive,
            ]}>
              {chip.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Items List */}
        {filteredItems.map(item => {
          const statusStyle = getStatusStyle(item.status);
          
          return (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <View style={styles.itemTitleRow}>
                  <Ionicons name={statusStyle.icon} size={20} color={statusStyle.color} />
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
                {statusStyle.label && (
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: statusStyle.color }]}>
                      {statusStyle.label}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.itemStats}>
                <View style={styles.itemStat}>
                  <Text style={styles.itemStatLabel}>Units</Text>
                  <Text style={[
                    styles.itemStatValue,
                    item.status === 'out' && { color: Colors.error },
                    item.status === 'low' && { color: Colors.warning },
                  ]}>
                    {item.units}
                  </Text>
                </View>
                <View style={styles.itemStat}>
                  <Text style={styles.itemStatLabel}>Cost</Text>
                  <Text style={styles.itemStatValue}>{formatCurrency(item.costPrice)}</Text>
                </View>
                <View style={styles.itemStat}>
                  <Text style={styles.itemStatLabel}>Sell</Text>
                  <Text style={styles.itemStatValue}>{formatCurrency(item.sellPrice)}</Text>
                </View>
                <View style={styles.itemStat}>
                  <Text style={styles.itemStatLabel}>Margin</Text>
                  <Text style={[styles.itemStatValue, { color: Colors.success }]}>{item.margin}%</Text>
                </View>
              </View>

              <View style={styles.itemFooter}>
                <View style={styles.sourceInfo}>
                  <Text style={styles.sourceEmoji}>{getSourceIcon(item.source)}</Text>
                  <Text style={styles.sourceText}>{item.source}</Text>
                  <Text style={styles.updatedText}>• {item.updated}</Text>
                </View>
                
                {(item.status === 'low' || item.status === 'out') && (
                  <TouchableOpacity style={styles.reorderButton} onPress={() => {
                    Alert.alert('📦 Order Placed!', `Reorder request for ${item.name} sent to wholesaler.`, [{ text: 'OK' }]);
                  }}>
                    <Text style={styles.reorderButtonText}>
                      {item.status === 'out' ? 'Order Now' : 'Reorder'}
                    </Text>
                    <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Summary Bar */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Value</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalValue)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Low Stock</Text>
          <Text style={[styles.summaryValue, { color: Colors.warning }]}>{lowStockCount}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Out</Text>
          <Text style={[styles.summaryValue, { color: Colors.error }]}>{outOfStockCount}</Text>
        </View>
      </View>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => {
        Alert.alert('Add Item', 'In the full version, scan a bill or manually add items here.', [{ text: 'OK' }]);
      }}>
        <Ionicons name="add" size={28} color={Colors.textWhite} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.card,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingLeft: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChips: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    fontWeight: FontWeights.medium,
  },
  filterChipTextActive: {
    color: Colors.textWhite,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  itemCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  itemName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  itemStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  itemStat: {
    alignItems: 'center',
  },
  itemStatLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  itemStatValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceEmoji: {
    fontSize: 14,
  },
  sourceText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  updatedText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reorderButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadows.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  summaryValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: Spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
});
