import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../src/constants/theme';
import { storeOwner, invoiceItems } from '../src/constants/mockData';

export default function InvoiceScreen() {
  const [showSuccess, setShowSuccess] = useState(false);

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Calculate invoice totals
  const calculateItemAmount = (qty: number, rate: number, gstPercent: number) => {
    const baseAmount = qty * rate;
    const gstAmount = (baseAmount * gstPercent) / 100;
    return baseAmount + gstAmount;
  };

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const totalGst = invoiceItems.reduce((sum, item) => {
    const baseAmount = item.qty * item.rate;
    return sum + (baseAmount * item.gstPercent) / 100;
  }, 0);
  const cgst = totalGst / 2;
  const sgst = totalGst / 2;
  const grandTotal = subtotal + totalGst;

  // Generate invoice number
  const invoiceNumber = 'INV-2026-0342';
  const invoiceDate = '05 Mar 2026';

  const handleDownloadPDF = () => {
    Alert.alert('Download PDF', 'Invoice PDF download started...', [{ text: 'OK' }]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleShareWhatsApp = () => {
    Alert.alert('Share on WhatsApp', 'Opening WhatsApp...', [{ text: 'OK' }]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Invoice Generator</Text>
        <Text style={styles.headerSubtitle}>Create GST compliant invoices</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Invoice Preview Card */}
        <View style={styles.invoiceCard}>
          {/* Invoice Header */}
          <View style={styles.invoiceHeader}>
            <Text style={styles.taxInvoiceTitle}>Tax Invoice</Text>
            <View style={styles.invoiceBadge}>
              <Text style={styles.invoiceBadgeText}>GST</Text>
            </View>
          </View>

          {/* Seller Details */}
          <View style={styles.sellerSection}>
            <Text style={styles.sellerName}>{storeOwner.storeName}</Text>
            <Text style={styles.sellerDetail}>{storeOwner.city}</Text>
            <Text style={styles.sellerDetail}>GSTIN: {storeOwner.gstin}</Text>
          </View>

          {/* Invoice Meta */}
          <View style={styles.invoiceMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Invoice No.</Text>
              <Text style={styles.metaValue}>{invoiceNumber}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Date</Text>
              <Text style={styles.metaValue}>{invoiceDate}</Text>
            </View>
          </View>

          {/* Items Table */}
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colItem]}>Item</Text>
              <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
              <Text style={[styles.tableHeaderText, styles.colRate]}>Rate</Text>
              <Text style={[styles.tableHeaderText, styles.colGst]}>GST</Text>
              <Text style={[styles.tableHeaderText, styles.colAmount]}>Amount</Text>
            </View>

            {/* Table Rows */}
            {invoiceItems.map((item, index) => (
              <View key={item.id} style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}>
                <Text style={[styles.tableCell, styles.colItem]} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={[styles.tableCell, styles.colQty]}>{item.qty}</Text>
                <Text style={[styles.tableCell, styles.colRate]}>{formatCurrency(item.rate)}</Text>
                <Text style={[styles.tableCell, styles.colGst]}>{item.gstPercent}%</Text>
                <Text style={[styles.tableCell, styles.colAmount]}>
                  {formatCurrency(calculateItemAmount(item.qty, item.rate, item.gstPercent))}
                </Text>
              </View>
            ))}
          </View>

          {/* Totals Section */}
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>CGST</Text>
              <Text style={styles.totalValue}>{formatCurrency(cgst)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>SGST</Text>
              <Text style={styles.totalValue}>{formatCurrency(sgst)}</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(grandTotal)}</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.invoiceFooter}>
            <Text style={styles.footerText}>Thank you for your business!</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadPDF}>
            <Ionicons name="document-text" size={22} color={Colors.textWhite} />
            <Text style={styles.downloadButtonText}>Download PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.whatsappButton} onPress={handleShareWhatsApp}>
            <Ionicons name="logo-whatsapp" size={22} color={Colors.textWhite} />
            <Text style={styles.whatsappButtonText}>Share on WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Success Toast */}
        {showSuccess && (
          <View style={styles.successToast}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            <Text style={styles.successToastText}>Sale recorded — Dashboard updated</Text>
          </View>
        )}

        {/* New Invoice Button */}
        <TouchableOpacity style={styles.newInvoiceButton}>
          <Ionicons name="add-circle-outline" size={22} color={Colors.primary} />
          <Text style={styles.newInvoiceText}>Create New Invoice</Text>
        </TouchableOpacity>

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
  invoiceCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  taxInvoiceTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  invoiceBadge: {
    backgroundColor: Colors.textWhite,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  invoiceBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  sellerSection: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  sellerName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  sellerDetail: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  invoiceMeta: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.divider,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  metaValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  tableContainer: {
    padding: Spacing.sm,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.textPrimary,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  tableHeaderText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  tableRow: {
    flexDirection: 'row',
    padding: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  tableRowAlt: {
    backgroundColor: Colors.background,
  },
  tableCell: {
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
  },
  colItem: {
    flex: 2.5,
  },
  colQty: {
    flex: 0.8,
    textAlign: 'center',
  },
  colRate: {
    flex: 1.5,
    textAlign: 'right',
  },
  colGst: {
    flex: 1,
    textAlign: 'center',
  },
  colAmount: {
    flex: 1.8,
    textAlign: 'right',
  },
  totalsSection: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  totalLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  grandTotalRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  grandTotalLabel: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  grandTotalValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  invoiceFooter: {
    backgroundColor: Colors.divider,
    padding: Spacing.md,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  downloadButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  whatsappButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  successToast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.successLight,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  successToastText: {
    fontSize: FontSizes.md,
    color: Colors.success,
    fontWeight: FontWeights.medium,
  },
  newInvoiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    borderStyle: 'dashed',
    gap: Spacing.sm,
  },
  newInvoiceText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
});
