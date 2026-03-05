import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../src/constants/theme';
import { products, cities, pricingStrategies, competitorPrices } from '../src/constants/mockData';

export default function PricingScreen() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedCity, setSelectedCity] = useState('Lucknow');
  const [costPrice, setCostPrice] = useState('280');
  const [sellingPrice, setSellingPrice] = useState('350');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const handleProductSelect = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setCostPrice(product.costPrice.toString());
    setSellingPrice(product.sellingPrice.toString());
    setShowProductPicker(false);
  };

  const renderPickerModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    data: any[],
    renderItem: (item: any) => JSX.Element
  ) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => renderItem(item)}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Pricing</Text>
        <Text style={styles.headerSubtitle}>AI-powered pricing strategies</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Input Section */}
        <View style={styles.inputSection}>
          {/* Product Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Product</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowProductPicker(true)}
            >
              <Text style={styles.pickerText}>{selectedProduct.name}</Text>
              <Ionicons name="chevron-down" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Price Inputs */}
          <View style={styles.priceRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Cost Price</Text>
              <View style={styles.priceInput}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.priceTextInput}
                  value={costPrice}
                  onChangeText={setCostPrice}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Selling Price</Text>
              <View style={styles.priceInput}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.priceTextInput}
                  value={sellingPrice}
                  onChangeText={setSellingPrice}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>
          </View>

          {/* City Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>City</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowCityPicker(true)}
            >
              <Text style={styles.pickerText}>{selectedCity}</Text>
              <Ionicons name="chevron-down" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Analyze Button */}
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <ActivityIndicator color={Colors.textWhite} />
                <Text style={styles.analyzeButtonText}>Analyzing...</Text>
              </>
            ) : (
              <>
                <Ionicons name="analytics" size={22} color={Colors.textWhite} />
                <Text style={styles.analyzeButtonText}>Get AI Pricing</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Results Section */}
        {showResults && (
          <>
            {/* Strategy Cards */}
            <Text style={styles.sectionTitle}>Recommended Strategies</Text>
            {pricingStrategies.map(strategy => (
              <View
                key={strategy.id}
                style={[
                  styles.strategyCard,
                  { backgroundColor: strategy.bgColor, borderColor: strategy.color + '40' },
                  strategy.recommended && styles.strategyCardRecommended,
                ]}
              >
                {strategy.recommended && (
                  <View style={[styles.recommendedBadge, { backgroundColor: strategy.color }]}>
                    <Ionicons name="star" size={12} color={Colors.textWhite} />
                    <Text style={styles.recommendedText}>RECOMMENDED</Text>
                  </View>
                )}
                <View style={styles.strategyHeader}>
                  <Text style={[styles.strategyName, { color: strategy.color }]}>
                    {strategy.name}
                  </Text>
                  <View style={[styles.confidenceBadge, { backgroundColor: strategy.color + '20' }]}>
                    <Text style={[styles.confidenceText, { color: strategy.color }]}>
                      {strategy.confidence}% confidence
                    </Text>
                  </View>
                </View>
                <View style={styles.strategyPricing}>
                  <View>
                    <Text style={styles.strategyPriceLabel}>Suggested Price</Text>
                    <Text style={[styles.strategyPrice, { color: strategy.color }]}>
                      {formatCurrency(strategy.price)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.strategyPriceLabel}>Margin</Text>
                    <Text style={[styles.strategyMargin, { color: strategy.color }]}>
                      {strategy.margin}%
                    </Text>
                  </View>
                </View>
                <Text style={styles.strategyDescription}>{strategy.description}</Text>
              </View>
            ))}

            {/* Competitor Prices */}
            <View style={styles.competitorCard}>
              <View style={styles.competitorHeader}>
                <Ionicons name="stats-chart" size={20} color={Colors.secondary} />
                <Text style={styles.competitorTitle}>Market Analysis</Text>
              </View>
              <View style={styles.competitorPrices}>
                <View style={styles.competitorItem}>
                  <Text style={styles.competitorName}>Amazon</Text>
                  <Text style={styles.competitorPrice}>{formatCurrency(competitorPrices.amazon)}</Text>
                </View>
                <View style={styles.competitorItem}>
                  <Text style={styles.competitorName}>BigBasket</Text>
                  <Text style={styles.competitorPrice}>{formatCurrency(competitorPrices.bigBasket)}</Text>
                </View>
                <View style={styles.competitorItem}>
                  <Text style={styles.competitorName}>Local Avg</Text>
                  <Text style={styles.competitorPrice}>{formatCurrency(competitorPrices.localAvg)}</Text>
                </View>
              </View>
            </View>

            {/* Festival Alert */}
            <View style={styles.festivalAlert}>
              <Text style={styles.festivalAlertIcon}>🎆</Text>
              <View style={styles.festivalAlertContent}>
                <Text style={styles.festivalAlertTitle}>Diwali Demand Surge</Text>
                <Text style={styles.festivalAlertText}>
                  Consider Premium strategy for next 2 weeks
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Product Picker Modal */}
      {renderPickerModal(
        showProductPicker,
        () => setShowProductPicker(false),
        'Select Product',
        products,
        (item) => (
          <TouchableOpacity
            style={[
              styles.pickerItem,
              selectedProduct.id === item.id && styles.pickerItemSelected,
            ]}
            onPress={() => handleProductSelect(item)}
          >
            <Text style={styles.pickerItemText}>{item.name}</Text>
            {selectedProduct.id === item.id && (
              <Ionicons name="checkmark" size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>
        )
      )}

      {/* City Picker Modal */}
      {renderPickerModal(
        showCityPicker,
        () => setShowCityPicker(false),
        'Select City',
        cities,
        (item) => (
          <TouchableOpacity
            style={[
              styles.pickerItem,
              selectedCity === item && styles.pickerItemSelected,
            ]}
            onPress={() => {
              setSelectedCity(item);
              setShowCityPicker(false);
            }}
          >
            <Text style={styles.pickerItemText}>{item}</Text>
            {selectedCity === item && (
              <Ionicons name="checkmark" size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  inputSection: {
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  priceRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currencySymbol: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginRight: 4,
  },
  priceTextInput: {
    flex: 1,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
  },
  analyzeButton: {
    backgroundColor: Colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzeButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  strategyCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  strategyCardRecommended: {
    borderWidth: 2,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: 4,
    marginBottom: Spacing.sm,
  },
  recommendedText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  strategyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  strategyName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  confidenceBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  confidenceText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  strategyPricing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  strategyPriceLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  strategyPrice: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  strategyMargin: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  strategyDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  competitorCard: {
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  competitorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  competitorTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  competitorPrices: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  competitorItem: {
    alignItems: 'center',
  },
  competitorName: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  competitorPrice: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  festivalAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.warning + '40',
  },
  festivalAlertIcon: {
    fontSize: 28,
    marginRight: Spacing.sm,
  },
  festivalAlertContent: {
    flex: 1,
  },
  festivalAlertTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  festivalAlertText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  pickerItemSelected: {
    backgroundColor: Colors.primaryLight,
  },
  pickerItemText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
});
