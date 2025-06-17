import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
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

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wallet');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleConfirmPayment = () => {
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    // Handle payment logic here
    console.log('Processing payment...', {
      galleryId: getStringParam(galleryId),
      paymentMethod: selectedPaymentMethod,
      amount: getStringParam(price)
    });
    
    // Simulate payment success
    alert('Payment successful! Your order has been placed.');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Confirm Order</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Artist Info */}
        <View style={styles.artistInfo}>
          <Image source={{ uri: getStringParam(artistAvatar) || 'https://i.pravatar.cc/60?img=1' }} style={styles.artistAvatar} />
          <Text style={styles.artistName}>{getStringParam(artistName)}</Text>
          <Text style={styles.reviewCount}>229 reviews</Text>
        </View>

        {/* Order Item */}
        <View style={styles.orderItem}>
          <Image source={{ uri: getStringParam(galleryImage) || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop' }} style={styles.orderItemImage} />
          <View style={styles.orderItemInfo}>
            <Text style={styles.orderItemTitle}>{getStringParam(title) || 'Original Custom Live2D (No Drawing)'}</Text>
            <Text style={styles.orderItemPrice}>¥{getStringParam(price)}</Text>
            <Text style={styles.orderItemDeadline}>Deadline: {getStringParam(deadline) || '3 days after artist accepts'}</Text>
            <Text style={styles.orderItemStock}>Remaining stock: {getStringParam(stock) || '2/3'}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethods}>
          <Text style={styles.paymentMethodsTitle}>Payment Method</Text>
          
          <TouchableOpacity 
            style={styles.paymentMethodItem}
            onPress={() => setSelectedPaymentMethod('alipay')}
          >
            <View style={styles.paymentMethodLeft}>
              <Text style={styles.paymentMethodIcon}>💳</Text>
              <Text style={styles.paymentMethodText}>Alipay</Text>
            </View>
            <View style={[styles.radio, selectedPaymentMethod === 'alipay' && styles.radioSelected]} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.paymentMethodItem}
            onPress={() => setSelectedPaymentMethod('wallet')}
          >
            <View style={styles.paymentMethodLeft}>
              <Text style={styles.paymentMethodIcon}>💰</Text>
              <Text style={styles.paymentMethodText}>Top-up Account</Text>
              <Text style={styles.walletBalance}>¥1426</Text>
            </View>
            <View style={[styles.radio, selectedPaymentMethod === 'wallet' && styles.radioSelected]} />
          </TouchableOpacity>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Text style={styles.securityText}>✅ Your funds are protected by the platform until you confirm receipt. Rest assured.</Text>
        </View>

        {/* Terms Agreement */}
        <TouchableOpacity 
          style={styles.termsAgreement}
          onPress={() => setAgreeToTerms(!agreeToTerms)}
        >
          <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
            {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.termsText}>I have read and agree to the </Text>
          <Text style={styles.termsLink}>Artist Platform Purchase Agreement</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom */}
      <View style={styles.paymentBottom}>
        <View style={styles.totalAmount}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalPrice}>¥{getStringParam(price)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.confirmPaymentBtn, !agreeToTerms && styles.confirmPaymentBtnDisabled]}
          onPress={handleConfirmPayment}
          disabled={!agreeToTerms}
        >
          <Text style={styles.confirmPaymentText}>Confirm Payment</Text>
        </TouchableOpacity>
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
  artistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  reviewCount: {
    fontSize: 14,
    color: '#888',
  },
  orderItem: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
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
  orderItemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  orderItemDeadline: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  orderItemStock: {
    fontSize: 14,
    color: '#888',
  },
  paymentMethods: {
    paddingVertical: 20,
  },
  paymentMethodsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
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
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
  walletBalance: {
    fontSize: 16,
    color: '#00A8FF',
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
  securityNotice: {
    backgroundColor: '#1A4A3A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 20,
  },
  securityText: {
    fontSize: 14,
    color: '#4AE54A',
    lineHeight: 20,
  },
  termsAgreement: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#666',
    marginRight: 12,
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
  },
  termsLink: {
    fontSize: 14,
    color: '#00A8FF',
  },
  bottomPadding: {
    height: 20,
  },
  paymentBottom: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    backgroundColor: '#0A0A0A',
  },
  totalAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#888',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  confirmPaymentBtn: {
    backgroundColor: '#00A8FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmPaymentBtnDisabled: {
    backgroundColor: '#333',
  },
  confirmPaymentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default PaymentPage;