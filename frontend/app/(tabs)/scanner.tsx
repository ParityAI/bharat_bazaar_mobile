import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '../../src/constants/theme';
import { scannedItems as mockScannedItems } from '../../src/constants/mockData';

interface ScannedItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  selected: boolean;
}

export default function ScannerScreen() {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'results'>('idle');
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanText, setScanText] = useState('Reading items...');
  const laserAnim = useRef(new Animated.Value(0)).current;

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  useEffect(() => {
    if (scanState === 'scanning') {
      // Animate laser line
      Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Progress simulation
      let progress = 0;
      const texts = ['Reading items...', 'Extracting prices...', 'Almost done...'];
      const interval = setInterval(() => {
        progress += 5;
        setScanProgress(progress);
        if (progress < 33) setScanText(texts[0]);
        else if (progress < 66) setScanText(texts[1]);
        else setScanText(texts[2]);

        if (progress >= 100) {
          clearInterval(interval);
          setScannedItems(mockScannedItems);
          setScanState('results');
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [scanState]);

  const handleScan = () => {
    setScanState('scanning');
    setScanProgress(0);
  };

  const toggleItem = (id: string) => {
    setScannedItems(items =>
      items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectedItems = scannedItems.filter(item => item.selected);
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.total, 0);

  const handleAddToInventory = () => {
    Alert.alert(
      '✅ Success!',
      `${selectedItems.length} items added to inventory! 📦`,
      [{ text: 'OK', onPress: () => setScanState('idle') }]
    );
  };

  const handleReset = () => {
    setScanState('idle');
    setScannedItems([]);
  };

  const laserTranslateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="scan" size={24} color={Colors.primary} />
        </View>
        <View>
          <Text style={styles.headerTitle}>📸 Bill Scanner</Text>
          <Text style={styles.headerSubtitle}>Scan wholesale bills to update inventory</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {scanState === 'idle' && (
          <>
            {/* Camera Area */}
            <View style={styles.cameraContainer}>
              <View style={styles.cameraBorder}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              <Ionicons name="camera" size={60} color={Colors.textMuted} />
              <Text style={styles.cameraPlaceholder}>Position bill within frame</Text>
            </View>

            {/* Buttons */}
            <TouchableOpacity style={styles.primaryButton} onPress={handleScan}>
              <Ionicons name="camera" size={24} color={Colors.textWhite} />
              <Text style={styles.primaryButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleScan}>
              <Ionicons name="folder-outline" size={22} color={Colors.primary} />
              <Text style={styles.secondaryButtonText}>Upload from Gallery</Text>
            </TouchableOpacity>

            {/* Tips */}
            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>💡 Tips for best results</Text>
              <Text style={styles.tipsText}>• Hold steady, ensure good lighting</Text>
              <Text style={styles.tipsText}>• Works with Hindi & English bills</Text>
              <Text style={styles.tipsText}>• Flatten the bill for better accuracy</Text>
            </View>
          </>
        )}

        {scanState === 'scanning' && (
          <>
            {/* Scanning Animation */}
            <View style={styles.scanningContainer}>
              {/* Bill placeholder */}
              <View style={styles.billPreview}>
                {/* Scan corners */}
                <View style={[styles.scanCorner, styles.scanTopLeft]} />
                <View style={[styles.scanCorner, styles.scanTopRight]} />
                <View style={[styles.scanCorner, styles.scanBottomLeft]} />
                <View style={[styles.scanCorner, styles.scanBottomRight]} />
                
                {/* Bill lines */}
                <View style={styles.billLines}>
                  <View style={[styles.billLine, { width: '80%' }]} />
                  <View style={[styles.billLine, { width: '60%' }]} />
                  <View style={[styles.billLine, { width: '90%' }]} />
                  <View style={[styles.billLine, { width: '70%' }]} />
                  <View style={[styles.billLine, { width: '85%' }]} />
                  <View style={[styles.billLine, { width: '55%' }]} />
                </View>

                {/* Laser line */}
                <Animated.View 
                  style={[
                    styles.laserLine,
                    { transform: [{ translateY: laserTranslateY }] }
                  ]} 
                />
              </View>

              {/* Progress */}
              <View style={styles.progressSection}>
                <Text style={styles.scanningText}>🧠 {scanText}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${scanProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>{scanProgress}%</Text>
              </View>
            </View>
          </>
        )}

        {scanState === 'results' && (
          <>
            {/* Success Header */}
            <View style={styles.successHeader}>
              <View style={styles.successBadge}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                <Text style={styles.successText}>Scan Complete</Text>
              </View>
              <View style={styles.sourceBadge}>
                <Text style={styles.sourceBadgeText}>Source: Bill Scan</Text>
              </View>
            </View>

            <Text style={styles.confidenceText}>
              AI extracted {scannedItems.length} items with 98% confidence
            </Text>

            {/* Items List */}
            <View style={styles.itemsList}>
              {scannedItems.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.itemCard,
                    !item.selected && styles.itemCardUnselected
                  ]}
                  onPress={() => toggleItem(item.id)}
                >
                  <View style={[
                    styles.checkbox,
                    item.selected && styles.checkboxSelected
                  ]}>
                    {item.selected && <Ionicons name="checkmark" size={16} color={Colors.textWhite} />}
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, !item.selected && styles.textMuted]}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemDetails}>
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </Text>
                  </View>
                  <Text style={[styles.itemTotal, !item.selected && styles.textMuted]}>
                    {formatCurrency(item.total)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Total */}
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(totalAmount)}</Text>
            </View>

            {/* Actions */}
            <TouchableOpacity
              style={[
                styles.addButton,
                selectedItems.length === 0 && styles.addButtonDisabled
              ]}
              onPress={handleAddToInventory}
              disabled={selectedItems.length === 0}
            >
              <Ionicons name="checkmark-circle" size={22} color={Colors.textWhite} />
              <Text style={styles.addButtonText}>
                Add {selectedItems.length} Items to Inventory
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.rescanButton} onPress={handleReset}>
              <Ionicons name="camera" size={20} color={Colors.primary} />
              <Text style={styles.rescanButtonText}>Scan Another Bill</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
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
    backgroundColor: Colors.primaryLight,
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
  cameraContainer: {
    height: 280,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.md,
  },
  cameraBorder: {
    position: 'absolute',
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: Colors.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  cameraPlaceholder: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },
  primaryButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: Spacing.lg,
  },
  secondaryButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  tipsCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  tipsTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  tipsText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  scanningContainer: {
    alignItems: 'center',
  },
  billPreview: {
    width: '100%',
    height: 280,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.md,
  },
  scanCorner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: Colors.success,
  },
  scanTopLeft: {
    top: 12,
    left: 12,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  scanTopRight: {
    top: 12,
    right: 12,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  scanBottomLeft: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  scanBottomRight: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  billLines: {
    position: 'absolute',
    top: 40,
    left: 30,
    right: 30,
    gap: 16,
  },
  billLine: {
    height: 16,
    backgroundColor: Colors.border,
    borderRadius: 8,
  },
  laserLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: Colors.success,
    borderRadius: 2,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
  },
  scanningText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  progressText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.success,
  },
  successHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  successText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.success,
  },
  sourceBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  sourceBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.accent,
  },
  confidenceText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  itemsList: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  itemCardUnselected: {
    opacity: 0.5,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  checkboxSelected: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  itemDetails: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemTotal: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.success,
  },
  textMuted: {
    color: Colors.textMuted,
  },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: Spacing.md,
  },
  totalLabel: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },
  addButtonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  addButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  rescanButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.primary,
  },
});
