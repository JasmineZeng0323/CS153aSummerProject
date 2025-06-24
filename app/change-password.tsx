// app/change-password.tsx
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

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial
    };
  };

  const passwordValidation = validatePassword(newPassword);

  const canSubmit = () => {
    return (
      currentPassword.length > 0 &&
      passwordValidation.isValid &&
      newPassword === confirmPassword &&
      newPassword !== currentPassword
    );
  };

  const handleChangePassword = async () => {
    if (!canSubmit()) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would be an API call
      // const response = await changePassword({
      //   currentPassword,
      //   newPassword
      // });

      Alert.alert(
        'Success',
        'Your password has been changed successfully.',
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
        'Failed to change password. Please check your current password and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <View style={styles.requirementItem}>
      <Text style={[styles.requirementIcon, met && styles.requirementMet]}>
        {met ? '✓' : '○'}
      </Text>
      <Text style={[styles.requirementText, met && styles.requirementMetText]}>
        {text}
      </Text>
    </View>
  );

  return (
    <View style={GlobalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Requirements</Text>
            <Text style={styles.sectionDescription}>
              Choose a strong password to keep your account secure.
            </Text>
          </View>

          {/* Current Password */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter your current password"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Text style={styles.eyeIcon}>
                  {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter your new password"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Text style={styles.eyeIcon}>
                  {showNewPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Password Requirements */}
            {newPassword.length > 0 && (
              <View style={styles.requirementsContainer}>
                <PasswordRequirement 
                  met={passwordValidation.minLength}
                  text="At least 8 characters"
                />
                <PasswordRequirement 
                  met={passwordValidation.hasUpper}
                  text="One uppercase letter"
                />
                <PasswordRequirement 
                  met={passwordValidation.hasLower}
                  text="One lowercase letter"
                />
                <PasswordRequirement 
                  met={passwordValidation.hasNumber}
                  text="One number"
                />
                <PasswordRequirement 
                  met={passwordValidation.hasSpecial}
                  text="One special character"
                />
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  confirmPassword.length > 0 && newPassword !== confirmPassword && styles.inputError
                ]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your new password"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.eyeIcon}>
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}

            {newPassword.length > 0 && newPassword === currentPassword && (
              <Text style={styles.errorText}>
                New password must be different from current password
              </Text>
            )}
          </View>

          {/* Security Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Tips</Text>
            <View style={styles.tipsContainer}>
              <View style={styles.tip}>
                <Text style={styles.tipIcon}>🔐</Text>
                <Text style={styles.tipText}>
                  Use a unique password that you don't use elsewhere
                </Text>
              </View>
              <View style={styles.tip}>
                <Text style={styles.tipIcon}>🔄</Text>
                <Text style={styles.tipText}>
                  Change your password regularly for better security
                </Text>
              </View>
              <View style={styles.tip}>
                <Text style={styles.tipIcon}>📱</Text>
                <Text style={styles.tipText}>
                  Consider using a password manager
                </Text>
              </View>
            </View>
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
            onPress={handleChangePassword}
            disabled={!canSubmit() || loading}
          >
            <Text style={[
              styles.submitButtonText,
              (!canSubmit() || loading) && styles.submitButtonTextDisabled
            ]}>
              {loading ? 'Changing Password...' : 'Change Password'}
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
  section: {
    marginTop: Layout.spacing.xxl,
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.sm,
  },
  sectionDescription: {
    ...Typography.bodyMuted,
    lineHeight: 20,
  },

  // Input
  inputSection: {
    marginBottom: Layout.spacing.xxl,
  },
  inputLabel: {
    ...Typography.label,
    marginBottom: Layout.spacing.sm,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    fontSize: 16,
    paddingRight: 50,
  },
  inputError: {
    borderColor: Colors.error,
  },
  eyeButton: {
    position: 'absolute',
    right: Layout.spacing.lg,
    top: '50%',
    transform: [{ translateY: -12 }],
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 16,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Layout.spacing.sm,
  },

  // Password Requirements
  requirementsContainer: {
    marginTop: Layout.spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  requirementItem: {
    ...Layout.row,
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  requirementIcon: {
    fontSize: 14,
    color: Colors.textMuted,
    marginRight: Layout.spacing.md,
    width: 16,
  },
  requirementMet: {
    color: Colors.success,
  },
  requirementText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  requirementMetText: {
    color: Colors.success,
  },

  // Tips
  tipsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tip: {
    ...Layout.row,
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.md,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: Layout.spacing.md,
    marginTop: 2,
  },
  tipText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    flex: 1,
    lineHeight: 18,
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

export default ChangePasswordPage;