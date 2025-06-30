//add-payment-method
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { Colors } from './components/styles/Colors';
import GlobalStyles from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

type PaymentType = 'card' | 'paypal' | 'apple_pay' | 'google_pay';

interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

const AddPaymentMethodPage = () => {
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>('card');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [paypalEmail, setPaypalEmail] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [loading, setLoading] = useState(false);

  const paymentTypes = [
    {
      id: 'card' as PaymentType,
      title: 'Credit or Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'paypal' as PaymentType,
      title: 'PayPal',
      icon: '🅿️',
      description: 'Pay with your PayPal account'
    },
    {
      id: 'apple_pay' as PaymentType,
      title: 'Apple Pay',
      icon: '🍎',
      description: 'Available on iOS devices'
    },
    {
      id: 'google_pay' as PaymentType,
      title: 'Google Pay',
      icon: '🟢',
      description: 'Available on Android devices'
    }
  ];

  const formatCardNumber = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiryDate = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const validateCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.length >= 13 && cleaned.length <= 19;
  };

  const validateExpiryDate = (expiryDate: string) => {
    if (expiryDate.length !== 5) return false;
    
    const [month, year] = expiryDate.split('/');
    const monthNum = parseInt(month);
    const yearNum = parseInt(`20${year}`);
    
    if (monthNum < 1 || monthNum > 12) return false;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      return false;
    }
    
    return true;
  };

  const validateCVV = (cvv: string) => {
    return cvv.length >= 3 && cvv.length <= 4;
  };

  const validateCardholderName = (name: string) => {
    return name.trim().length >= 2;
  };

  const validatePaypalEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canSubmit = () => {
    switch (selectedPaymentType) {
      case 'card':
        return (
          validateCardNumber(cardDetails.cardNumber) &&
          validateExpiryDate(cardDetails.expiryDate) &&
          validateCVV(cardDetails.cvv) &&
          validateCardholderName(cardDetails.cardholderName)
        );
      case 'paypal':
        return validatePaypalEmail(paypalEmail);
      case 'apple_pay':
      case 'google_pay':
        return true; // These would be handled by native APIs
      default:
        return false;
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!canSubmit()) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would be an API call to add payment method
      // const response = await addPaymentMethod({
      //   type: selectedPaymentType,
      //   details: selectedPaymentType === 'card' ? cardDetails : { email: paypalEmail },
      //   setAsDefault
      // });

      Alert.alert(
        'Success',
        'Payment method added successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to add payment method. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentTypeSelect = (type: PaymentType) => {
    setSelectedPaymentType(type);
    
    // Handle platform-specific payment methods
    if (type === 'apple_pay') {
      if (Platform.OS !== 'ios') {
        Alert.alert(
          'Not Available',
          'Apple Pay is only available on iOS devices.',
          [{ text: 'OK' }]
        );
        return;
      }
      // In real app, check if Apple Pay is set up
    } else if (type === 'google_pay') {
      if (Platform.OS !== 'android') {
        Alert.alert(
          'Not Available',
          'Google Pay is only available on Android devices.',
          [{ text: 'OK' }]
        );
        return;
      }
      // In real app, check if Google Pay is set up
    }
  };

  const PaymentTypeSelector = () => (
    <View style={styles.paymentTypesContainer}>
      <Text style={styles.sectionTitle}>Select Payment Method</Text>
      {paymentTypes.map((type) => (
        <TouchableOpacity
          key={type.id}
          style={[
            styles.paymentTypeOption,
            selectedPaymentType === type.id && styles.paymentTypeOptionActive
          ]}
          onPress={() => handlePaymentTypeSelect(type.id)}
        >
          <View style={styles.paymentTypeLeft}>
            <Text style={styles.paymentTypeIcon}>{type.icon}</Text>
            <View style={styles.paymentTypeInfo}>
              <Text style={[
                styles.paymentTypeTitle,
                selectedPaymentType === type.id && styles.paymentTypeTitleActive
              ]}>
                {type.title}
              </Text>
              <Text style={styles.paymentTypeDescription}>
                {type.description}
              </Text>
            </View>
          </View>
          <View style={[
            styles.radioButton,
            selectedPaymentType === type.id && styles.radioButtonActive
          ]}>
            {selectedPaymentType === type.id && (
              <View style={styles.radioButtonInner} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const CardDetailsForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Card Details</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Card Number</Text>
        <TextInput
          style={[
            styles.input,
            cardDetails.cardNumber.length > 0 && !validateCardNumber(cardDetails.cardNumber) && styles.inputError
          ]}
          value={cardDetails.cardNumber}
          onChangeText={(text) => setCardDetails({
            ...cardDetails,
            cardNumber: formatCardNumber(text)
          })}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor={Colors.textMuted}
          keyboardType="numeric"
          maxLength={19}
        />
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: Layout.spacing.md }]}>
          <Text style={styles.inputLabel}>Expiry Date</Text>
          <TextInput
            style={[
              styles.input,
              cardDetails.expiryDate.length > 0 && !validateExpiryDate(cardDetails.expiryDate) && styles.inputError
            ]}
            value={cardDetails.expiryDate}
            onChangeText={(text) => setCardDetails({
              ...cardDetails,
              expiryDate: formatExpiryDate(text)
            })}
            placeholder="MM/YY"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.inputLabel}>CVV</Text>
          <TextInput
            style={[
              styles.input,
              cardDetails.cvv.length > 0 && !validateCVV(cardDetails.cvv) && styles.inputError
            ]}
            value={cardDetails.cvv}
            onChangeText={(text) => setCardDetails({
              ...cardDetails,
              cvv: text.replace(/\D/g, '').substring(0, 4)
            })}
            placeholder="123"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Cardholder Name</Text>
        <TextInput
          style={[
            styles.input,
            cardDetails.cardholderName.length > 0 && !validateCardholderName(cardDetails.cardholderName) && styles.inputError
          ]}
          value={cardDetails.cardholderName}
          onChangeText={(text) => setCardDetails({
            ...cardDetails,
            cardholderName: text
          })}
          placeholder="John Doe"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="words"
        />
      </View>
    </View>
  );

  const PayPalForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>PayPal Account</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>PayPal Email</Text>
        <TextInput
          style={[
            styles.input,
            paypalEmail.length > 0 && !validatePaypalEmail(paypalEmail) && styles.inputError
          ]}
          value={paypalEmail}
          onChangeText={setPaypalEmail}
          placeholder="your-email@example.com"
          placeholderTextColor={Colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
    </View>
  );

  return (
    <View style={GlobalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment Method</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <PaymentTypeSelector />

          {selectedPaymentType === 'card' && <CardDetailsForm />}
          {selectedPaymentType === 'paypal' && <PayPalForm />}
          {(selectedPaymentType === 'apple_pay' || selectedPaymentType === 'google_pay') && (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>
                {selectedPaymentType === 'apple_pay' ? 'Apple Pay' : 'Google Pay'}
              </Text>
              <Text style={styles.infoText}>
                {selectedPaymentType === 'apple_pay' 
                  ? 'Apple Pay will be set up using your device\'s biometric authentication.'
                  : 'Google Pay will be set up using your Google account.'}
              </Text>
            </View>
          )}

          {/* Set as Default Option */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.defaultOption}
              onPress={() => setSetAsDefault(!setAsDefault)}
            >
              <View style={styles.defaultOptionLeft}>
                <Text style={styles.defaultOptionTitle}>Set as Default Payment Method</Text>
                <Text style={styles.defaultOptionDescription}>
                  Use this payment method for future transactions
                </Text>
              </View>
              <View style={[
                styles.checkbox,
                setAsDefault && styles.checkboxActive
              ]}>
                {setAsDefault && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View style={GlobalStyles.bottomPadding} />
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              (!canSubmit() || loading) && styles.submitButtonDisabled
            ]}
            onPress={handleAddPaymentMethod}
            disabled={!canSubmit() || loading}
          >
            <Text style={[
              styles.submitButtonText,
              (!canSubmit() || loading) && styles.submitButtonTextDisabled
            ]}>
              {loading ? 'Adding...' : 'Add Payment Method'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: Layout.spacing.xl,
  },

  // Section
  sectionTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.lg,
  },

  // Payment Types
  paymentTypesContainer: {
    marginTop: Layout.spacing.xl,
    marginBottom: Layout.spacing.xxl,
  },
  paymentTypeOption: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentTypeOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.artist,
  },
  paymentTypeLeft: {
    ...Layout.row,
    alignItems: 'center',
    flex: 1,
  },
  paymentTypeIcon: {
    fontSize: 24,
    marginRight: Layout.spacing.lg,
  },
  paymentTypeInfo: {
    flex: 1,
  },
  paymentTypeTitle: {
    ...Typography.body,
    marginBottom: Layout.spacing.xs,
  },
  paymentTypeTitleActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  paymentTypeDescription: {
    ...Typography.bodySmallMuted,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },

  // Form
  formContainer: {
    marginBottom: Layout.spacing.xxl,
  },
  inputGroup: {
    marginBottom: Layout.spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputLabel: {
    ...Typography.label,
    marginBottom: Layout.spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.error,
  },
  infoText: {
    ...Typography.bodyMuted,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    lineHeight: 20,
  },

  // Options
  optionsContainer: {
    marginBottom: Layout.spacing.xl,
  },
  defaultOption: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  defaultOptionLeft: {
    flex: 1,
    marginRight: Layout.spacing.lg,
  },
  defaultOptionTitle: {
    ...Typography.body,
    marginBottom: Layout.spacing.xs,
  },
  defaultOptionDescription: {
    ...Typography.bodySmallMuted,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: Layout.radius.xs,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Submit
  submitContainer: {
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.radius.md,
    paddingVertical: Layout.spacing.lg,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.card,
  },
  submitButtonText: {
    ...Typography.button,
    color: Colors.text,
  },
  submitButtonTextDisabled: {
    color: Colors.textDisabled,
  },
});

export default AddPaymentMethodPage;