//billing.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Colors } from './components/styles/Colors';
import GlobalStyles from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'paypal' | 'apple_pay';
  last4?: string;
  email?: string;
  expiryDate?: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  type: 'commission' | 'subscription' | 'refund' | 'withdrawal';
  amount: number;
  currency: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  artistName?: string;
}

const BillingPage = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'visa',
      last4: '4242',
      expiryDate: '12/25',
      isDefault: true
    },
    {
      id: '2',
      type: 'paypal',
      email: 'user@example.com',
      isDefault: false
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'commission',
      amount: 150.00,
      currency: 'USD',
      description: 'Character Design Commission',
      date: '2024-06-20',
      status: 'completed',
      artistName: 'Sarah Chen'
    },
    {
      id: '2',
      type: 'commission',
      amount: 75.00,
      currency: 'USD',
      description: 'Logo Design',
      date: '2024-06-18',
      status: 'completed',
      artistName: 'Mike Rodriguez'
    },
    {
      id: '3',
      type: 'refund',
      amount: -25.00,
      currency: 'USD',
      description: 'Cancelled Commission Refund',
      date: '2024-06-15',
      status: 'completed'
    }
  ]);

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'paypal': return '🅿️';
      case 'apple_pay': return '🍎';
      default: return '💳';
    }
  };

  const getPaymentMethodTitle = (method: PaymentMethod) => {
    switch (method.type) {
      case 'visa': return `Visa •••• ${method.last4}`;
      case 'mastercard': return `Mastercard •••• ${method.last4}`;
      case 'paypal': return 'PayPal';
      case 'apple_pay': return 'Apple Pay';
      default: return 'Payment Method';
    }
  };

  const getPaymentMethodSubtitle = (method: PaymentMethod) => {
    if (method.email) return method.email;
    if (method.expiryDate) return `Expires ${method.expiryDate}`;
    return '';
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'commission': return '🎨';
      case 'subscription': return '⭐';
      case 'refund': return '↩️';
      case 'withdrawal': return '💰';
      default: return '💳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return Colors.success;
      case 'pending': return Colors.warning;
      case 'failed': return Colors.error;
      default: return Colors.textMuted;
    }
  };

  const handleSetDefault = (methodId: string) => {
    Alert.alert(
      'Set Default Payment Method',
      'Make this your default payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Set Default',
          onPress: () => {
            setPaymentMethods(methods =>
              methods.map(method => ({
                ...method,
                isDefault: method.id === methodId
              }))
            );
          }
        }
      ]
    );
  };

  const handleRemovePaymentMethod = (methodId: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(methods => 
              methods.filter(method => method.id !== methodId)
            );
          }
        }
      ]
    );
  };

  const formatAmount = (amount: number, currency: string) => {
    const symbol = currency === 'USD' ? '$' : currency;
    return `${symbol}${Math.abs(amount).toFixed(2)}`;
  };

  return (
    <View style={GlobalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Billing & Payments</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Payment Methods Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          
          <View style={styles.sectionContent}>
            {paymentMethods.map((method, index) => (
              <View 
                key={method.id} 
                style={[
                  styles.paymentMethodItem,
                  index === paymentMethods.length - 1 && styles.lastItem
                ]}
              >
                <View style={styles.paymentMethodInfo}>
                  <Text style={styles.paymentMethodIcon}>
                    {getPaymentMethodIcon(method.type)}
                  </Text>
                  <View style={styles.paymentMethodDetails}>
                    <View style={styles.paymentMethodHeader}>
                      <Text style={styles.paymentMethodTitle}>
                        {getPaymentMethodTitle(method)}
                      </Text>
                      {method.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                      )}
                    </View>
                    {getPaymentMethodSubtitle(method) && (
                      <Text style={styles.paymentMethodSubtitle}>
                        {getPaymentMethodSubtitle(method)}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.paymentMethodActions}>
                  {!method.isDefault && (
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleSetDefault(method.id)}
                    >
                      <Text style={styles.actionButtonText}>Set Default</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.removeButton]}
                    onPress={() => handleRemovePaymentMethod(method.id)}
                  >
                    <Text style={[styles.actionButtonText, styles.removeButtonText]}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.addPaymentButton}
              onPress={() => router.push('/add-payment-method')}
            >
              <Text style={styles.addPaymentIcon}>+</Text>
              <Text style={styles.addPaymentText}>Add Payment Method</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Billing Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing Summary</Text>
          
          <View style={styles.sectionContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Spent This Month</Text>
              <Text style={styles.summaryValue}>$225.00</Text>
            </View>
            <View style={[styles.summaryItem, styles.lastItem]}>
              <Text style={styles.summaryLabel}>Pending Payments</Text>
              <Text style={styles.summaryValue}>$0.00</Text>
            </View>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.sectionContent}>
            {transactions.map((transaction, index) => (
              <View 
                key={transaction.id} 
                style={[
                  styles.transactionItem,
                  index === transactions.length - 1 && styles.lastItem
                ]}
              >
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionIcon}>
                    {getTransactionIcon(transaction.type)}
                  </Text>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>
                      {transaction.description}
                    </Text>
                    <View style={styles.transactionMeta}>
                      <Text style={styles.transactionDate}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </Text>
                      {transaction.artistName && (
                        <>
                          <Text style={styles.transactionDivider}>•</Text>
                          <Text style={styles.transactionArtist}>
                            {transaction.artistName}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text 
                    style={[
                      styles.transactionAmount,
                      transaction.amount < 0 && styles.refundAmount
                    ]}
                  >
                    {transaction.amount < 0 ? '-' : ''}
                    {formatAmount(transaction.amount, transaction.currency)}
                  </Text>
                  <Text 
                    style={[
                      styles.transactionStatus,
                      { color: getStatusColor(transaction.status) }
                    ]}
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={GlobalStyles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Header
  header: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: 50,
    paddingBottom: Layout.spacing.lg,
    ...Layout.borderBottom,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: Colors.text,
  },
  headerTitle: {
    ...Typography.h5,
  },
  placeholder: {
    width: 40,
  },

  // Content
  content: {
    flex: 1,
  },

  // Section
  section: {
    marginBottom: Layout.spacing.xxl,
  },
  sectionHeader: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    marginLeft: Layout.spacing.xl,
    marginRight: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
    marginTop: Layout.spacing.lg,
  },
  sectionTitle: {
    ...Typography.bodySmall,
    color: Colors.textDisabled,
    marginLeft: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
    marginTop: Layout.spacing.lg,
  },
  sectionContent: {
    backgroundColor: Colors.surface,
    ...Layout.marginHorizontal,
    borderRadius: Layout.radius.md,
    overflow: 'hidden',
  },
  viewAllText: {
    ...Typography.linkSmall,
    color: Colors.primary,
  },

  // Payment Methods
  paymentMethodItem: {
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
    ...Layout.borderBottom,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  paymentMethodInfo: {
    ...Layout.row,
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginRight: Layout.spacing.lg,
    width: 32,
    textAlign: 'center',
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodHeader: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  paymentMethodTitle: {
    ...Typography.body,
    flex: 1,
  },
  paymentMethodSubtitle: {
    ...Typography.bodySmallMuted,
  },
  defaultBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.sm,
  },
  defaultBadgeText: {
    ...Typography.labelSmall,
    color: Colors.text,
  },
  paymentMethodActions: {
    ...Layout.row,
    gap: Layout.spacing.md,
  },
  actionButton: {
    backgroundColor: Colors.card,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
  },
  actionButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
  },
  removeButton: {
    backgroundColor: Colors.error,
  },
  removeButtonText: {
    color: Colors.text,
  },
  addPaymentButton: {
    ...Layout.rowCenter,
    paddingVertical: Layout.spacing.xl,
    gap: Layout.spacing.md,
  },
  addPaymentIcon: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  addPaymentText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: 'bold',
  },

  // Billing Summary
  summaryItem: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
    ...Layout.borderBottom,
  },
  summaryLabel: {
    ...Typography.body,
  },
  summaryValue: {
    ...Typography.h6,
    color: Colors.primary,
  },

  // Transactions
  transactionItem: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
    ...Layout.borderBottom,
  },
  transactionInfo: {
    ...Layout.row,
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    fontSize: 20,
    marginRight: Layout.spacing.lg,
    width: 24,
    textAlign: 'center',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    ...Typography.body,
    marginBottom: Layout.spacing.xs,
  },
  transactionMeta: {
    ...Layout.row,
    alignItems: 'center',
  },
  transactionDate: {
    ...Typography.bodySmallMuted,
  },
  transactionDivider: {
    ...Typography.bodySmallMuted,
    marginHorizontal: Layout.spacing.sm,
  },
  transactionArtist: {
    ...Typography.bodySmallMuted,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    ...Typography.h6,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  refundAmount: {
    color: Colors.success,
  },
  transactionStatus: {
    ...Typography.caption,
    textTransform: 'capitalize',
  },
});

export default BillingPage;