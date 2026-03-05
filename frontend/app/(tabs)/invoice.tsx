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
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '../../src/constants/theme';
import { storeOwner, invoiceItems } from '../../src/constants/mockData';

export default function InvoiceScreen() {
  const [showPreview, setShowPreview] = useState(false);
  const [customerName, setCustomerName] = useState('Ramesh Sharma');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [showSuccess, setShowSuccess] = useState(false);

  const formatCurrency = (amount: number) => 
    `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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

  const invoiceNumber = 'INV-2026-0342';
  const invoiceDate = '05 Mar 2026';

  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
    return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
  };

  const amountInWords = () => {
    const rupees = Math.floor(grandTotal);
    const paise = Math.round((grandTotal - rupees) * 100);
    let result = 'Rupees ' + numberToWords(rupees);
    if (paise > 0) result += ' and ' + paise + ' Paise';
    return result + ' Only';
  };

  const handleGenerate = () => {
    setShowPreview(true);
  };

  const handleDownload = () => {
    Alert.alert('Download Started', 'Invoice PDF is being generated...', [{ text: 'OK' }]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleWhatsApp = () => {
    Alert.alert('Share on WhatsApp', 'Opening WhatsApp...', [{ text: 'OK' }]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="receipt" size={24} color={Colors.secondary} />
        </View>
        <View>
          <Text style={styles.headerTitle}>🧾 Tax Invoice</Text>
          <Text style={styles.headerSubtitle}>GST compliant invoicing</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!showPreview ? (
          <>
            {/* Customer Details */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Customer Details</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Customer Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={18} color={Colors.textMuted} />
                  <TextInput
                    style={styles.textInput}
                    value={customerName}
                    onChangeText={setCustomerName}
                    placeholder="Enter customer name"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={18} color={Colors.textMuted} />
                  <TextInput
                    style={styles.textInput}
                    value={customerPhone}
                    onChangeText={setCustomerPhone}
                    placeholder="Enter phone number"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>

            {/* Items */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Invoice Items</Text>
              
              {invoiceItems.map((item, index) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemMeta}>
                      Qty: {item.qty} × {formatCurrency(item.rate)} | GST: {item.gstPercent}%
                    </Text>
                  </View>
                  <Text style={styles.itemAmount}>
                    {formatCurrency(calculateItemAmount(item.qty, item.rate, item.gstPercent))}
                  </Text>
                </View>
              ))}

              <TouchableOpacity style={styles.addItemButton} onPress={() => {
                Alert.alert('Demo Mode', 'In the full version, you can add custom items to your invoice.', [{ text: 'OK' }]);
              }}>
                <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
                <Text style={styles.addItemText}>Add Another Item</Text>
              </TouchableOpacity>
            </View>

            {/* Totals */}
            <View style={styles.totalsCard}>
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
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.grandTotalLabel}>Grand Total</Text>
                <Text style={styles.grandTotalValue}>{formatCurrency(grandTotal)}</Text>
              </View>
            </View>

            {/* Generate Button */}
            <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
              <Ionicons name="document-text" size={22} color={Colors.textWhite} />
              <Text style={styles.generateButtonText}>Generate Invoice</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Invoice Preview */}
            <View style={styles.invoicePreview}>
              {/* Invoice Header */}
              <View style={styles.invoiceHeader}>
                <View>
                  <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
                  <View style={styles.gstBadge}>
                    <Text style={styles.gstBadgeText}>GST</Text>
                  </View>
                </View>
                <View style={styles.invoiceMeta}>
                  <Text style={styles.invoiceMetaText}>Invoice #: {invoiceNumber}</Text>
                  <Text style={styles.invoiceMetaText}>Date: {invoiceDate}</Text>
                </View>
              </View>

              {/* Seller Info */}
              <View style={styles.sellerSection}>
                <Text style={styles.sellerName}>{storeOwner.storeName}</Text>
                <Text style={styles.sellerDetail}>{storeOwner.city}</Text>
                <Text style={styles.sellerDetail}>GSTIN: {storeOwner.gstin}</Text>
              </View>

              {/* Buyer Info */}
              <View style={styles.buyerSection}>
                <Text style={styles.buyerLabel}>Bill To:</Text>
                <Text style={styles.buyerName}>{customerName}</Text>
                <Text style={styles.buyerDetail}>{customerPhone}</Text>
              </View>

              {/* Items Table */}
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.colItem]}>Item</Text>
                  <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
                  <Text style={[styles.tableHeaderCell, styles.colRate]}>Rate</Text>
                  <Text style={[styles.tableHeaderCell, styles.colGst]}>GST</Text>
                  <Text style={[styles.tableHeaderCell, styles.colAmount]}>Amount</Text>
                </View>
                {invoiceItems.map((item, index) => (
                  <View key={item.id} style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}>
                    <View style={styles.colItem}>
                      <Text style={styles.tableCell}>{item.name}</Text>
                      <Text style={styles.hsnCode}>HSN: {item.hsn}</Text>
                    </View>
                    <Text style={[styles.tableCell, styles.colQty]}>{item.qty}</Text>
                    <Text style={[styles.tableCell, styles.colRate]}>{formatCurrency(item.rate)}</Text>
                    <Text style={[styles.tableCell, styles.colGst]}>{item.gstPercent}%</Text>
                    <Text style={[styles.tableCell, styles.colAmount]}>
                      {formatCurrency(calculateItemAmount(item.qty, item.rate, item.gstPercent))}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Invoice Totals */}
              <View style={styles.invoiceTotals}>
                <View style={styles.invoiceTotalRow}>
                  <Text style={styles.invoiceTotalLabel}>Subtotal</Text>
                  <Text style={styles.invoiceTotalValue}>{formatCurrency(subtotal)}</Text>
                </View>
                <View style={styles.invoiceTotalRow}>
                  <Text style={styles.invoiceTotalLabel}>CGST</Text>
                  <Text style={styles.invoiceTotalValue}>{formatCurrency(cgst)}</Text>
                </View>
                <View style={styles.invoiceTotalRow}>
                  <Text style={styles.invoiceTotalLabel}>SGST</Text>
                  <Text style={styles.invoiceTotalValue}>{formatCurrency(sgst)}</Text>
                </View>
                <View style={[styles.invoiceTotalRow, styles.invoiceGrandTotal]}>
                  <Text style={styles.invoiceGrandTotalLabel}>Grand Total</Text>
                  <Text style={styles.invoiceGrandTotalValue}>{formatCurrency(grandTotal)}</Text>
                </View>
              </View>

              {/* Amount in Words */}
              <View style={styles.amountWords}>
                <Text style={styles.amountWordsLabel}>Amount in Words:</Text>
                <Text style={styles.amountWordsText}>{amountInWords()}</Text>
              </View>

              {/* Signature */}
              <View style={styles.signatureSection}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureText}>Authorized Signatory</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
                <Ionicons name="document-text" size={20} color={Colors.textWhite} />
                <Text style={styles.downloadButtonText}>Download PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
                <Ionicons name="logo-whatsapp" size={20} color={Colors.textWhite} />
                <Text style={styles.whatsappButtonText}>Share on WhatsApp</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.emailButton} onPress={() => {
              Alert.alert('Email Sent!', 'Invoice emailed to customer successfully.', [{ text: 'OK' }]);
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 3000);
            }}>
              <Ionicons name="mail-outline" size={20} color={Colors.secondary} />
              <Text style={styles.emailButtonText}>Email Invoice</Text>
            </TouchableOpacity>

            {/* Success Toast */}
            {showSuccess && (
              <View style={styles.successToast}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={styles.successToastText}>Sale recorded — Dashboard updated!</Text>
              </View>
            )}

            {/* New Invoice */}
            <TouchableOpacity style={styles.newInvoiceButton} onPress={() => setShowPreview(false)}>
              <Ionicons name="add-circle-outline" size={22} color={Colors.primary} />
              <Text style={styles.newInvoiceText}>Create New Invoice</Text>
            </TouchableOpacity>
          </>
        )}

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
    backgroundColor: Colors.secondaryLight,
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
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  cardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingLeft: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  itemMeta: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemAmount: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  addItemText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  totalsCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  totalLabel: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
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
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadows.md,
  },
  generateButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  invoicePreview: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadows.lg,
  },
  invoiceHeader: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  invoiceTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  gstBadge: {
    backgroundColor: Colors.textWhite,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  gstBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  invoiceMeta: {
    alignItems: 'flex-end',
  },
  invoiceMetaText: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.9)',
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
    color: Colors.textMuted,
    marginTop: 2,
  },
  buyerSection: {
    padding: Spacing.md,
    backgroundColor: Colors.background,
  },
  buyerLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  buyerName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  buyerDetail: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  table: {
    padding: Spacing.sm,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.textPrimary,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  tableHeaderCell: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  tableRow: {
    flexDirection: 'row',
    padding: Spacing.sm,
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: Colors.background,
  },
  tableCell: {
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
  },
  hsnCode: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  colItem: {
    flex: 2.5,
  },
  colQty: {
    flex: 0.8,
    textAlign: 'center',
  },
  colRate: {
    flex: 1.3,
    textAlign: 'right',
  },
  colGst: {
    flex: 0.8,
    textAlign: 'center',
  },
  colAmount: {
    flex: 1.5,
    textAlign: 'right',
  },
  invoiceTotals: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  invoiceTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  invoiceTotalLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  invoiceTotalValue: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  invoiceGrandTotal: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  invoiceGrandTotalLabel: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  invoiceGrandTotalValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  amountWords: {
    padding: Spacing.md,
    backgroundColor: Colors.background,
  },
  amountWordsLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  amountWordsText: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    fontStyle: 'italic',
  },
  signatureSection: {
    padding: Spacing.md,
    alignItems: 'flex-end',
  },
  signatureLine: {
    width: 120,
    height: 1,
    backgroundColor: Colors.textPrimary,
    marginBottom: 4,
  },
  signatureText: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.info,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadows.md,
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
    backgroundColor: Colors.whatsappGreen,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadows.md,
  },
  whatsappButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.secondary,
    marginBottom: Spacing.md,
  },
  emailButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.secondary,
  },
  successToast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.successLight,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
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
    borderRadius: BorderRadius.lg,
    borderStyle: 'dashed',
    gap: Spacing.sm,
  },
  newInvoiceText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
});
