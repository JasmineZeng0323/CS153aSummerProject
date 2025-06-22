import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

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

  // 确保参数是字符串类型
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Secure Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Security Badge */}
        <View style={styles.securityBadge}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>256-bit SSL Encrypted • PCI DSS Compliant</Text>
        </View>

        {/* Artist Info */}
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

        {/* Order Summary */}
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

        {/* Payment Methods */}
        <View style={styles.paymentMethods}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity 
            style={[styles.paymentMethodItem, selectedPaymentMethod === 'card' && styles.selectedPayment]}
            onPress={() => setSelectedPaymentMethod('card')}
          >
            <View style={styles.paymentMethodLeft}>
              <Text style={styles.paymentMethodIcon}>💳</Text>
              <Text style={styles.paymentMethodText}>Credit/Debit Card</Text>
              <View style={styles.cardLogos}>
                <Text style={styles.cardLogo}>💳</Text>
                <Text style={styles.cardLogo}>💳</Text>
                <Text style={styles.cardLogo}>💳</Text>
              </View>
            </View>
            <View style={[styles.radio, selectedPaymentMethod === 'card' && styles.radioSelected]} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentMethodItem, selectedPaymentMethod === 'paypal' && styles.selectedPayment]}
            onPress={() => setSelectedPaymentMethod('paypal')}
          >
            <View style={styles.paymentMethodLeft}>
              <Text style={styles.paymentMethodIcon}>🏦</Text>
              <Text style={styles.paymentMethodText}>PayPal</Text>
              <Text style={styles.paymentMethodSubtext}>Pay with your PayPal account</Text>
            </View>
            <View style={[styles.radio, selectedPaymentMethod === 'paypal' && styles.radioSelected]} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentMethodItem, selectedPaymentMethod === 'apple' && styles.selectedPayment]}
            onPress={() => setSelectedPaymentMethod('apple')}
          >
            <View style={styles.paymentMethodLeft}>
              <Text style={styles.paymentMethodIcon}>📱</Text>
              <Text style={styles.paymentMethodText}>Apple Pay</Text>
              <Text style={styles.paymentMethodSubtext}>Touch ID or Face ID</Text>
            </View>
            <View style={[styles.radio, selectedPaymentMethod === 'apple' && styles.radioSelected]} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentMethodItem, selectedPaymentMethod === 'wallet' && styles.selectedPayment]}
            onPress={() => setSelectedPaymentMethod('wallet')}
          >
            <View style={styles.paymentMethodLeft}>
              <Text style={styles.paymentMethodIcon}>💰</Text>
              <Text style={styles.paymentMethodText}>Platform Wallet</Text>
              <Text style={styles.walletBalance}>Balance: $1,426.00</Text>
            </View>
            <View style={[styles.radio, selectedPaymentMethod === 'wallet' && styles.radioSelected]} />
          </TouchableOpacity>
        </View>

        {/* Price Breakdown */}
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

        {/* Money Back Guarantee */}
        <View style={styles.guaranteeSection}>
          <Text style={styles.guaranteeIcon}>🛡️</Text>
          <View style={styles.guaranteeContent}>
            <Text style={styles.guaranteeTitle}>Money Back Guarantee</Text>
            <Text style={styles.guaranteeText}>
              100% satisfaction guaranteed. If you're not happy with the final result, we'll work with the artist for revisions or provide a full refund.
            </Text>
          </View>
        </View>

        {/* Terms Agreement */}
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

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Payment Button */}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Security Badge
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A2A1A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  securityText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Artist Info
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  artistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  artistDetails: {
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#888',
  },
  verifiedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Order Summary
  orderSummary: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
  },
  orderItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  orderItemDetails: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },

  // Payment Methods
  paymentMethods: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPayment: {
    borderColor: '#00A8FF',
    backgroundColor: '#1A2A3A',
  },
  paymentMethodLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  paymentMethodIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  paymentMethodSubtext: {
    fontSize: 12,
    color: '#888',
  },
  cardLogos: {
    flexDirection: 'row',
    marginTop: 4,
  },
  cardLogo: {
    fontSize: 12,
    marginRight: 4,
  },
  walletBalance: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666',
  },
  radioSelected: {
    backgroundColor: '#00A8FF',
    borderColor: '#00A8FF',
  },

  // Price Breakdown
  priceBreakdown: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#888',
  },
  priceValue: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },

  // Guarantee Section
  guaranteeSection: {
    flexDirection: 'row',
    backgroundColor: '#1A1A2A',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#00A8FF',
  },
  guaranteeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  guaranteeContent: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00A8FF',
    marginBottom: 4,
  },
  guaranteeText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },

  // Terms Agreement
  termsAgreement: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#666',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#00A8FF',
    borderColor: '#00A8FF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    color: '#00A8FF',
  },

  bottomPadding: {
    height: 20,
  },

  // Bottom Payment Button
  paymentBottom: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  confirmPaymentBtn: {
    backgroundColor: '#00A8FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  confirmPaymentBtnDisabled: {
    backgroundColor: '#333',
  },
  paymentButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  confirmPaymentText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentAmount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default PaymentPage;