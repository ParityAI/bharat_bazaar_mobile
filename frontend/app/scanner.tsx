import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../src/constants/theme';
import { scannedItems as mockScannedItems } from '../src/constants/mockData';

interface ScannedItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  selected: boolean;
}

export default function ScannerScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const handleScan = async () => {
    setIsScanning(true);
    setIsProcessing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      setScannedItems(mockScannedItems);
      setHasScanned(true);
      setIsScanning(false);
      setIsProcessing(false);
    }, 2500);
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
      'Success! ✅',
      `Added ${selectedItems.length} items to inventory worth ${formatCurrency(totalAmount)}`,
      [{ text: 'OK', onPress: () => {
        setHasScanned(false);
        setScannedItems([]);
      }}]
    );
  };

  const handleReset = () => {
    setHasScanned(false);
    setScannedItems([]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bill Scanner</Text>
        <Text style={styles.headerSubtitle}>Scan wholesale bills to update inventory</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!hasScanned ? (
          <>
            {/* Camera Viewfinder Area */}
            <View style={styles.cameraContainer}>
              {isProcessing ? (
                <View style={styles.processingOverlay}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text style={styles.processingText}>🧠 AI analyzing...</Text>
                  <Text style={styles.processingSubtext}>Extracting items from bill</Text>
                </View>
              ) : (
                <>
                  <View style={styles.cameraBorder}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                  </View>
                  <Ionicons name="receipt-outline" size={80} color={Colors.textMuted} />
                  <Text style={styles.cameraPlaceholder}>Position bill within frame</Text>
                </>
              )}
            </View>

            {/* Scan Button */}
            <TouchableOpacity
              style={styles.scanButton}
              onPress={handleScan}
              disabled={isScanning}
            >
              <Ionicons name="camera" size={24} color={Colors.textWhite} />
              <Text style={styles.scanButtonText}>
                {isScanning ? 'Scanning...' : 'Scan Bill'}
              </Text>
            </TouchableOpacity>

            {/* Instructions */}
            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsTitle}>How it works</Text>
              <View style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>1</Text>
                </View>
                <Text style={styles.instructionText}>Point camera at wholesale bill</Text>
              </View>
              <View style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>2</Text>
                </View>
                <Text style={styles.instructionText}>AI extracts items & prices automatically</Text>
              </View>
              <View style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>3</Text>
                </View>
                <Text style={styles.instructionText}>Review & add to your inventory</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Scanned Results Header */}
            <View style={styles.resultsHeader}>
              <View style={styles.successBadge}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.successText}>Scan Complete</Text>
              </View>
              <View style={styles.sourceBadge}>
                <Text style={styles.sourceBadgeText}>Source: Bill Scan</Text>
              </View>
            </View>

            <Text style={styles.confidenceText}>AI extracted {scannedItems.length} items with 98% confidence</Text>

            {/* Scanned Items List */}
            <View style={styles.itemsContainer}>
              {scannedItems.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemCard, !item.selected && styles.itemCardUnselected]}
                  onPress={() => toggleItem(item.id)}
                >
                  <View style={styles.checkboxContainer}>
                    <View style={[styles.checkbox, item.selected && styles.checkboxSelected]}>
                      {item.selected && <Ionicons name="checkmark" size={14} color={Colors.textWhite} />}
                    </View>
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, !item.selected && styles.itemNameUnselected]}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemDetails}>
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </Text>
                  </View>
                  <Text style={[styles.itemTotal, !item.selected && styles.itemTotalUnselected]}>
                    {formatCurrency(item.total)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Total Section */}
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(totalAmount)}</Text>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={[styles.addButton, selectedItems.length === 0 && styles.addButtonDisabled]}
              onPress={handleAddToInventory}
              disabled={selectedItems.length === 0}
            >
              <Ionicons name="checkmark-circle" size={22} color={Colors.textWhite} />
              <Text style={styles.addButtonText}>
                Add {selectedItems.length} Items to Inventory
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.rescanButton} onPress={handleReset}>
              <Ionicons name="refresh" size={20} color={Colors.primary} />
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
  cameraContainer: {
    height: 300,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  cameraBorder: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
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
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  cameraPlaceholder: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
  processingOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
    marginTop: Spacing.md,
  },
  processingSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 4,
  },
  scanButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scanButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  instructionsCard: {
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  instructionsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  instructionNumberText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  instructionText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  successText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.success,
  },
  sourceBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
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
  itemsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemCardUnselected: {
    opacity: 0.6,
    backgroundColor: Colors.divider,
  },
  checkboxContainer: {
    marginRight: Spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
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
  itemNameUnselected: {
    color: Colors.textMuted,
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
  itemTotalUnselected: {
    color: Colors.textMuted,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
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
    backgroundColor: Colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
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
