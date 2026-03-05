import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '../../src/constants/theme';
import { products, cities, pricingStrategies, competitorPrices } from '../../src/constants/mockData';
import { AnimatedNumber } from '../../src/components/AnimatedNumber';

export default function PricingScreen() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedCity, setSelectedCity] = useState('Lucknow');
  const [costPrice, setCostPrice] = useState('280');
  const [sellingPrice, setSellingPrice] = useState('350');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  
  const fadeAnims = useRef(pricingStrategies.map(() => new Animated.Value(0))).current;
  const slideAnims = useRef(pricingStrategies.map(() => new Animated.Value(30))).current;

  useEffect(() => {
    if (showResults) {
      // Stagger animation for strategy cards
      pricingStrategies.forEach((_, index) => {
        Animated.parallel([
          Animated.timing(fadeAnims[index], {
            toValue: 1,
            duration: 400,
            delay: index * 150,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnims[index], {
            toValue: 0,
            duration: 400,
            delay: index * 150,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      fadeAnims.forEach(anim => anim.setValue(0));
      slideAnims.forEach(anim => anim.setValue(30));
    }
  }, [showResults]);

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setShowResults(false);
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

  const maxCompetitorPrice = Math.max(competitorPrices.amazon, competitorPrices.bigBasket, competitorPrices.localAvg);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="pricetag" size={24} color={Colors.accent} />
        </View>
        <View>
          <Text style={styles.headerTitle}>💰 Smart Pricing</Text>
          <Text style={styles.headerSubtitle}>AI-powered pricing strategies</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Input Card */}
        <View style={styles.inputCard}>
          {/* Product */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Product</Text>
            <TouchableOpacity style={styles.picker} onPress={() => setShowProductPicker(true)}>
              <Text style={styles.pickerText}>{selectedProduct.name}</Text>
              <Ionicons name="chevron-down" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Price Row */}
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
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>
          </View>

          {/* City */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>City</Text>
            <TouchableOpacity style={styles.picker} onPress={() => setShowCityPicker(true)}>
              <Ionicons name="location-outline" size={18} color={Colors.textMuted} />
              <Text style={[styles.pickerText, { marginLeft: 8 }]}>{selectedCity}</Text>
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
                <Text style={styles.analyzeButtonText}>🧠 Analyzing market data...</Text>
              </>
            ) : (
              <>
                <Ionicons name="analytics" size={22} color={Colors.textWhite} />
                <Text style={styles.analyzeButtonText}>Get AI Pricing</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Results */}
        {showResults && (
          <>
            <Text style={styles.sectionTitle}>Recommended Strategies</Text>

            {pricingStrategies.map((strategy, index) => (
              <Animated.View
                key={strategy.id}
                style={[
                  styles.strategyCard,
                  { 
                    backgroundColor: strategy.bgColor,
                    borderLeftColor: strategy.color,
                    opacity: fadeAnims[index],
                    transform: [{ translateY: slideAnims[index] }]
                  },
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
                    {strategy.emoji} {strategy.name}
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
                      ₹{strategy.price}
                    </Text>
                  </View>
                  <View style={styles.marginContainer}>
                    <Text style={styles.strategyPriceLabel}>Margin</Text>
                    <Text style={[styles.strategyMargin, { color: strategy.color }]}>
                      {strategy.margin}%
                    </Text>
                  </View>
                </View>

                <Text style={styles.strategyDescription}>{strategy.description}</Text>

                {/* Confidence Bar */}
                <View style={styles.confidenceBar}>
                  <View style={[styles.confidenceFill, { width: `${strategy.confidence}%`, backgroundColor: strategy.color }]} />
                </View>
              </Animated.View>
            ))}

            {/* Competitor Comparison */}
            <View style={styles.competitorCard}>
              <View style={styles.competitorHeader}>
                <Ionicons name="stats-chart" size={20} color={Colors.secondary} />
                <Text style={styles.competitorTitle}>Market Prices</Text>
              </View>
              
              {[{name: 'Amazon', price: competitorPrices.amazon}, {name: 'BigBasket', price: competitorPrices.bigBasket}, {name: 'Local Avg', price: competitorPrices.localAvg}].map(comp => (
                <View key={comp.name} style={styles.competitorRow}>
                  <Text style={styles.competitorName}>{comp.name}</Text>
                  <View style={styles.competitorBarContainer}>
                    <View style={[styles.competitorBar, { width: `${(comp.price / maxCompetitorPrice) * 100}%` }]} />
                  </View>
                  <Text style={styles.competitorPrice}>{formatCurrency(comp.price)}</Text>
                </View>
              ))}
            </View>

            {/* Festival Alert */}
            <View style={styles.festivalAlert}>
              <Text style={styles.festivalEmoji}>🎆</Text>
              <View style={styles.festivalContent}>
                <Text style={styles.festivalTitle}>Diwali Demand Surge</Text>
                <Text style={styles.festivalText}>Premium strategy recommended for next 2 weeks</Text>
              </View>
            </View>

            {/* Apply Button */}
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply Balanced Price</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Product Picker Modal */}
      <Modal visible={showProductPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Product</Text>
              <TouchableOpacity onPress={() => setShowProductPicker(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={products}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, selectedProduct.id === item.id && styles.modalItemSelected]}
                  onPress={() => handleProductSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  {selectedProduct.id === item.id && (
                    <Ionicons name="checkmark" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* City Picker Modal */}
      <Modal visible={showCityPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select City</Text>
              <TouchableOpacity onPress={() => setShowCityPicker(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={cities}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, selectedCity === item && styles.modalItemSelected]}
                  onPress={() => { setSelectedCity(item); setShowCityPicker(false); }}
                >
                  <Ionicons name="location" size={18} color={selectedCity === item ? Colors.primary : Colors.textMuted} />
                  <Text style={[styles.modalItemText, { marginLeft: 8 }]}>{item}</Text>
                  {selectedCity === item && (
                    <Ionicons name="checkmark" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  inputCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.md,
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
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerText: {
    flex: 1,
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
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currencySymbol: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  priceTextInput: {
    flex: 1,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
    marginLeft: 4,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    ...Shadows.md,
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
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    ...Shadows.sm,
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
  marginContainer: {
    alignItems: 'flex-end',
  },
  strategyMargin: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  strategyDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  confidenceBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  competitorCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
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
  competitorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  competitorName: {
    width: 70,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  competitorBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.divider,
    borderRadius: 4,
    marginHorizontal: Spacing.sm,
    overflow: 'hidden',
  },
  competitorBar: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 4,
  },
  competitorPrice: {
    width: 60,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  festivalAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.warning + '40',
    marginBottom: Spacing.md,
  },
  festivalEmoji: {
    fontSize: 32,
    marginRight: Spacing.sm,
  },
  festivalContent: {
    flex: 1,
  },
  festivalTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  festivalText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  applyButton: {
    backgroundColor: Colors.success,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  applyButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
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
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  modalItemSelected: {
    backgroundColor: Colors.primaryLight,
  },
  modalItemText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
});
