//payment.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Header from './components/common/Header';
import { Colors } from './components/styles/Colors';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

// Unified container style
const AppStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 0,
  },
  header: {
    paddingTop: 50, // Status bar height
  },
};

const PaymentPage = () => {
  const params = useLocalSearchParams();
  const { 
    galleryId, 
    title, 
    price, 
    artistName, 
    artistAvatar, 
    galleryImage,
    deadline,
    stock 
  } = params;

  // Ensure parameters are string type
  const getStringParam = (param: string | string[] | undefined): string => {
    if (Array.isArray(param)) {
      return param[0] || '';
    }
    return param || '';
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate fees and totals (US market focused)
  const basePrice = parseFloat(getStringParam(price)) || 0;
  const processingFee = basePrice * 0.029 + 0.30; // Stripe-like fee structure
  const platformFee = basePrice * 0.05; // 5% platform fee
  const salesTax = basePrice * 0.0875; // Average US sales tax ~8.75%
  const totalAmount = basePrice + processingFee + platformFee + salesTax;

  const saveGalleryPurchase = async (orderData: any) => {
    try {
      const existingPurchases = await AsyncStorage.getItem('purchasedGalleries');
      const purchases = existingPurchases ? JSON.parse(existingPurchases) : [];
      
      const newPurchase = {
        ...orderData,
        id: Date.now(),
        purchaseDate: new Date().toISOString().split('T')[0],
        status: 'in_progress',
        orderNumber: `ORD-${Date.now()}`,
        hasReviewed: false,
        progress: 0
      };
      
      purchases.unshift(newPurchase); // Add to beginning of array
      await AsyncStorage.setItem('purchasedGalleries', JSON.stringify(purchases));
      
      console.log('Gallery purchase saved:', newPurchase);
      return newPurchase;
    } catch (error) {
      console.error('Error saving gallery purchase:', error);
      throw error;
    }
  };

  const updateGalleryStock = async () => {
    try {
      // This would typically update stock in your backend
      // For now, we'll simulate stock reduction
      console.log('Stock reduced for gallery:', getStringParam(galleryId));
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleConfirmPayment = async () => {
    if (!agreeToTerms) {
      Alert.alert('Terms Required', 'Please agree to the terms and conditions to proceed.');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Prepare order data
      const orderData = {
        galleryId: getStringParam(galleryId),
        title: getStringParam(title),
        price: basePrice,
        totalPaid: totalAmount.toFixed(2),
        artistName: getStringParam(artistName),
        artistAvatar: getStringParam(artistAvatar),
        image: getStringParam(galleryImage),
        deadline: getStringParam(deadline),
        category: 'Gallery Purchase',
        paymentMethod: selectedPaymentMethod,
        fees: {
          processing: processingFee.toFixed(2),
          platform: platformFee.toFixed(2),
          tax: salesTax.toFixed(2)
        }
      };
      
      // Save purchase to storage
      const savedPurchase = await saveGalleryPurchase(orderData);
      
      // Update stock
      await updateGalleryStock();
      
      // Show success alert
      Alert.alert(
        'Payment Successful! 🎉',
        `Your order #${savedPurchase.orderNumber} has been placed successfully.\n\nThe artist will begin working on your commission and you'll receive updates on progress.`,
        [
          {
            text: 'View My Orders',
            onPress: () => {
              router.dismiss();
              router.push('/purchased-gallery');
            }
          },
          {
            text: 'Continue Shopping',
            style: 'cancel',
            onPress: () => {
              router.dismiss();
              router.push('/homepage');
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Payment processing error:', error);
      Alert.alert(
        'Payment Failed',
        'We encountered an issue processing your payment. Please try again or contact support.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Security badge component
  const SecurityBadge = () => (
    <View style={styles.securityBadge}>
      <Text style={styles.securityIcon}>🔒</Text>
      <Text style={styles.securityText}>256-bit SSL Encrypted • PCI DSS Compliant</Text>
    </View>
  );

  // Artist info component
  const ArtistInfo = () => (
    <View style={styles.artistInfo}>
      <Image source={{ uri: getStringParam(artistAvatar) || 'https://i.pravatar.cc/60?img=1' }} style={styles.artistAvatar} />
      <View style={styles.artistDetails}>
        <Text style={styles.artistName}>{getStringParam(artistName)}</Text>
        <Text style={styles.reviewCount}>⭐ 4.9 • 229 reviews • Pro Artist</Text>
      </View>
      <View style={styles.verifiedBadge}>
        <Text style={styles.verifiedText}>✓ Verified</Text>
      </View>
    </View>
  );

  // Order summary component
  const OrderSummary = () => (
    <View style={styles.orderSummary}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      <View style={styles.orderItem}>
        <Image source={{ uri: getStringParam(galleryImage) }} style={styles.orderItemImage} />
        <View style={styles.orderItemInfo}>
          <Text style={styles.orderItemTitle}>{getStringParam(title)}</Text>
          <Text style={styles.orderItemDetails}>
            Delivery: {getStringParam(deadline)}{'\n'}
            Stock: {getStringParam(stock) || '2/3 remaining'}
          </Text>
        </View>
      </View>
    </View>
  );

  // Payment method item component
  const PaymentMethodItem = ({ 
    method, 
    icon, 
    title, 
    subtitle, 
    extraInfo 
  }: { 
    method: string; 
    icon: string; 
    title: string; 
    subtitle?: string; 
    extraInfo?: React.ReactNode 
  }) => (
    <TouchableOpacity 
      style={[styles.paymentMethodItem, selectedPaymentMethod === method && styles.selectedPayment]}
      onPress={() => setSelectedPaymentMethod(method)}
    >
      <View style={styles.paymentMethodLeft}>
        <Text style={styles.paymentMethodIcon}>{icon}</Text>
        <Text style={styles.paymentMethodText}>{title}</Text>
        {subtitle && <Text style={styles.paymentMethodSubtext}>{subtitle}</Text>}
        {extraInfo}
      </View>
      <View style={[styles.radio, selectedPaymentMethod === method && styles.radioSelected]} />
    </TouchableOpacity>
  );

  // Price breakdown component
  const PriceBreakdown = () => (
    <View style={styles.priceBreakdown}>
      <Text style={styles.sectionTitle}>Price Details</Text>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Artwork Price</Text>
        <Text style={styles.priceValue}>${basePrice.toFixed(2)}</Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Platform Fee (5%)</Text>
        <Text style={styles.priceValue}>${platformFee.toFixed(2)}</Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Processing Fee</Text>
        <Text style={styles.priceValue}>${processingFee.toFixed(2)}</Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Sales Tax</Text>
        <Text style={styles.priceValue}>${salesTax.toFixed(2)}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
      </View>
    </View>
  );

  // Money back guarantee component
  const MoneyBackGuarantee = () => (
    <View style={styles.guaranteeSection}>
      <Text style={styles.guaranteeIcon}>🛡️</Text>
      <View style={styles.guaranteeContent}>
        <Text style={styles.guaranteeTitle}>Money Back Guarantee</Text>
        <Text style={styles.guaranteeText}>
          100% satisfaction guaranteed. If you're not happy with the final result, we'll work with the artist for revisions or provide a full refund.
        </Text>
      </View>
    </View>
  );

  // Terms agreement component
  const TermsAgreement = () => (
    <TouchableOpacity 
      style={styles.termsAgreement}
      onPress={() => setAgreeToTerms(!agreeToTerms)}
    >
      <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
        {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.termsText}>
        I agree to the <Text style={styles.termsLink}>Terms of Service</Text>, <Text style={styles.termsLink}>Privacy Policy</Text>, and <Text style={styles.termsLink}>Refund Policy</Text>
      </Text>
    </TouchableOpacity>
  );

  // Bottom payment button component
  const PaymentButton = () => (
    <View style={styles.paymentBottom}>
      <TouchableOpacity 
        style={[styles.confirmPaymentBtn, (!agreeToTerms || isProcessing) && styles.confirmPaymentBtnDisabled]}
        onPress={handleConfirmPayment}
        disabled={!agreeToTerms || isProcessing}
      >
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <Text style={styles.processingText}>🔄 Processing Payment...</Text>
          </View>
        ) : (
          <View style={styles.paymentButtonContent}>
            <Text style={styles.confirmPaymentText}>Complete Purchase</Text>
            <Text style={styles.paymentAmount}>${totalAmount.toFixed(2)}</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <Text style={styles.disclaimerText}>
        By completing this purchase, you authorize the charge and agree to our terms
      </Text>
    </View>
  );

  return (
    <View style={AppStyles.container}>
      {/* Header using common Header component */}
      <Header 
        title="Secure Checkout" 
        showBackButton={true}
        onBackPress={() => router.back()}
        style={AppStyles.header}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Security Badge */}
        <SecurityBadge />

        {/* Artist Info */}
        <ArtistInfo />

        {/* Order Summary */}
        <OrderSummary />

        {/* Payment Methods */}
        <View style={styles.paymentMethods}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <PaymentMethodItem
            method="card"
            icon="💳"
            title="Credit/Debit Card"
            extraInfo={
              <View style={styles.cardLogos}>
                <Text style={styles.cardLogo}>💳</Text>
                <Text style={styles.cardLogo}>💳</Text>
                <Text style={styles.cardLogo}>💳</Text>
              </View>
            }
          />

          <PaymentMethodItem
            method="paypal"
            icon="🏦"
            title="PayPal"
            subtitle="Pay with your PayPal account"
          />

          <PaymentMethodItem
            method="apple"
            icon="📱"
            title="Apple Pay"
            subtitle="Touch ID or Face ID"
          />

          <PaymentMethodItem
            method="wallet"
            icon="💰"
            title="Platform Wallet"
            extraInfo={
              <Text style={styles.walletBalance}>Balance: $1,426.00</Text>
            }
          />
        </View>

        {/* Price Breakdown */}
        <PriceBreakdown />

        {/* Money Back Guarantee */}
        <MoneyBackGuarantee />

        {/* Terms Agreement */}
        <TermsAgreement />

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Payment Button */}
      <PaymentButton />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Layout.spacing.xl,
  },

  // Security Badge
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A2A1A',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.xl,
    marginVertical: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  securityIcon: {
    fontSize: 16,
    marginRight: Layout.spacing.sm,
  },
  securityText: {
    color: Colors.success,
    ...Typography.caption,
    fontWeight: 'bold',
  },

  // Artist Info
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
    ...Layout.borderBottom,
  },
  artistAvatar: {
    ...Layout.avatar,
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Layout.spacing.md,
  },
  artistDetails: {
    flex: 1,
  },
  artistName: {
    ...Typography.h6,
    marginBottom: Layout.spacing.xs,
  },
  reviewCount: {
    ...Typography.bodySmallMuted,
  },
  verifiedBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.md,
  },
  verifiedText: {
    ...Typography.badge,
  },

  // Order Summary
  orderSummary: {
    paddingVertical: Layout.spacing.xl,
    ...Layout.borderBottom,
  },
  sectionTitle: {
    ...Typography.h5,
    marginBottom: Layout.spacing.lg,
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
  },
  orderItemImage: {
    width: 80,
    height: 80,
    borderRadius: Layout.radius.md,
    marginRight: Layout.spacing.lg,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.sm,
  },
  orderItemDetails: {
    ...Typography.bodyMuted,
    lineHeight: 20,
  },

  // Payment Methods
  paymentMethods: {
    paddingVertical: Layout.spacing.xl,
    ...Layout.borderBottom,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
    marginBottom: Layout.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPayment: {
    borderColor: Colors.primary,
    backgroundColor: '#1A2A3A',
  },
  paymentMethodLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  paymentMethodIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  paymentMethodText: {
    ...Typography.bodySmall,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  paymentMethodSubtext: {
    ...Typography.caption,
  },
  cardLogos: {
    flexDirection: 'row',
    marginTop: 2,
  },
  cardLogo: {
    fontSize: 12,
    marginRight: Layout.spacing.xs,
  },
  walletBalance: {
    ...Typography.bodySmall,
    color: Colors.success,
    fontWeight: 'bold',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: Layout.radius.md,
    borderWidth: 2,
    borderColor: Colors.textMuted,
  },
  radioSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // Price Breakdown
  priceBreakdown: {
    paddingVertical: Layout.spacing.xl,
    ...Layout.borderBottom,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  priceLabel: {
    ...Typography.bodySmallMuted,
  },
  priceValue: {
    ...Typography.bodySmall,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Layout.spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Layout.spacing.sm,
  },
  totalLabel: {
    ...Typography.h5,
  },
  totalValue: {
    ...Typography.h4,
    color: Colors.secondary,
  },

  // Guarantee Section
  guaranteeSection: {
    flexDirection: 'row',
    backgroundColor: '#1A1A2A',
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    marginVertical: Layout.spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  guaranteeIcon: {
    fontSize: 24,
    marginRight: Layout.spacing.md,
  },
  guaranteeContent: {
    flex: 1,
  },
  guaranteeTitle: {
    ...Typography.h6,
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  guaranteeText: {
    ...Typography.bodyMuted,
    lineHeight: 20,
  },

  // Terms Agreement
  termsAgreement: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Layout.spacing.xl,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: Layout.radius.xs,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    marginRight: Layout.spacing.md,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    ...Typography.bodyMuted,
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    color: Colors.primary,
  },

  bottomPadding: {
    height: Layout.spacing.xl,
  },

  // Bottom Payment Button
  paymentBottom: {
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
    backgroundColor: Colors.background,
    ...Layout.borderTop,
  },
  confirmPaymentBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  confirmPaymentBtnDisabled: {
    backgroundColor: Colors.card,
  },
  paymentButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Layout.spacing.lg,
  },
  confirmPaymentText: {
    ...Typography.button,
  },
  paymentAmount: {
    ...Typography.h5,
    fontWeight: 'bold',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processingText: {
    ...Typography.button,
  },
  disclaimerText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default PaymentPage;