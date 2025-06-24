import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Import components
import Header from './components/common/Header';
import LoadingState from './components/common/LoadingState';

// Import styles
import { Colors } from './components/styles/Colors';
import GlobalStyles from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

interface PortfolioItem {
  id: string;
  uri: string;
  title: string;
  description: string;
  type: 'image' | 'document';
}

interface VerificationFormData {
  // Personal Information
  fullName: string;
  artistName: string;
  bio: string;
  experience: string;
  
  // Contact & Social
  website: string;
  instagram: string;
  twitter: string;
  artstation: string;
  
  // Professional Details
  specialties: string[];
  priceRange: {
    min: string;
    max: string;
  };
  
  // Verification Documents
  idDocument: any;
  portfolio: PortfolioItem[];
  
  // Terms
  agreeToTerms: boolean;
  agreeToCommission: boolean;
}

const ArtistVerificationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<VerificationFormData>({
    fullName: '',
    artistName: '',
    bio: '',
    experience: '',
    website: '',
    instagram: '',
    twitter: '',
    artstation: '',
    specialties: [],
    priceRange: { min: '', max: '' },
    idDocument: null,
    portfolio: [],
    agreeToTerms: false,
    agreeToCommission: false
  });

  const totalSteps = 4;
  const availableSpecialties = [
    'Digital Art', 'Traditional Art', 'Character Design', 'Concept Art',
    'Illustration', '3D Modeling', 'Animation', 'Portrait', 'Landscape',
    'Abstract', 'Comic/Manga', 'Logo Design', 'UI/UX Design'
  ];

  const experienceLevels = [
    'Beginner (< 1 year)', 
    'Intermediate (1-3 years)', 
    'Advanced (3-5 years)', 
    'Professional (5+ years)'
  ];

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleIdDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({
          ...prev,
          idDocument: result.assets[0]
        }));
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handlePortfolioImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 10 - formData.portfolio.length,
      });

      if (!result.canceled) {
        const newItems: PortfolioItem[] = result.assets.map((asset, index) => ({
          id: `portfolio_${Date.now()}_${index}`,
          uri: asset.uri,
          title: '',
          description: '',
          type: 'image' as const
        }));

        setFormData(prev => ({
          ...prev,
          portfolio: [...prev.portfolio, ...newItems]
        }));
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    }
  };

  const updatePortfolioItem = (id: string, field: 'title' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removePortfolioItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter(item => item.id !== id)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.artistName && formData.bio && formData.experience);
      case 2:
        return formData.specialties.length > 0 && formData.priceRange.min && formData.priceRange.max;
      case 3:
        return !!(formData.idDocument && formData.portfolio.length >= 3);
      case 4:
        return formData.agreeToTerms && formData.agreeToCommission;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      Alert.alert('Incomplete Information', 'Please fill in all required fields before continuing.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      Alert.alert('Incomplete', 'Please complete all required fields and accept the terms.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API submission delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Get current user info
      const userInfoString = await AsyncStorage.getItem('userInfo');
      let currentUserInfo = {};
      
      if (userInfoString) {
        currentUserInfo = JSON.parse(userInfoString);
      }

      // Update user with artist verification data
      const updatedUserInfo = {
        ...currentUserInfo,
        isArtist: true,
        artistVerificationStatus: 'pending',
        artistVerificationDate: new Date().toISOString(),
        artistData: {
          fullName: formData.fullName,
          artistName: formData.artistName,
          bio: formData.bio,
          experience: formData.experience,
          socialLinks: {
            website: formData.website,
            instagram: formData.instagram,
            twitter: formData.twitter,
            artstation: formData.artstation
          },
          specialties: formData.specialties,
          priceRange: formData.priceRange,
          portfolioCount: formData.portfolio.length,
          submissionDate: new Date().toISOString()
        }
      };

      // Save updated user info
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

      // Save portfolio data separately
      await AsyncStorage.setItem('artistPortfolio', JSON.stringify(formData.portfolio));

      // For demo purposes, auto-approve the verification
      setTimeout(async () => {
        const verifiedUserInfo = {
          ...updatedUserInfo,
          artistVerificationStatus: 'verified'
        };
        await AsyncStorage.setItem('userInfo', JSON.stringify(verifiedUserInfo));
      }, 1000);

      Alert.alert(
        'Verification Submitted! 🎉',
        'Your artist verification has been submitted successfully. You\'ll receive a notification once it\'s reviewed (usually within 24-48 hours).\n\nFor demonstration purposes, you\'ll be automatically verified shortly.',
        [
          {
            text: 'Continue to Profile',
            onPress: () => {
              router.replace('/profile');
            }
          }
        ]
      );

    } catch (error) {
      console.error('Verification submission error:', error);
      Alert.alert('Submission Failed', 'Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={GlobalStyles.progressBar}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              GlobalStyles.progressFill,
              {
                backgroundColor: index < currentStep ? Colors.success : 
                              index === currentStep - 1 ? Colors.primary : Colors.card,
                flex: 1,
                height: 4,
                marginHorizontal: 2,
                borderRadius: Layout.radius.xs
              }
            ]}
          />
        ))}
      </View>
      <Text style={styles.progressText}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepSubtitle}>Let us know who you are</Text>

      <View style={styles.inputGroup}>
        <Text style={GlobalStyles.inputLabel}>Full Legal Name *</Text>
        <TextInput
          style={GlobalStyles.input}
          value={formData.fullName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
          placeholder="Your legal name for verification"
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={GlobalStyles.inputLabel}>Artist Display Name *</Text>
        <TextInput
          style={GlobalStyles.input}
          value={formData.artistName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, artistName: text }))}
          placeholder="How you want to be known as an artist"
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={GlobalStyles.inputLabel}>Artist Bio *</Text>
        <TextInput
          style={[GlobalStyles.input, styles.textArea]}
          value={formData.bio}
          onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
          placeholder="Tell clients about your artistic journey, style, and what makes your work unique..."
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={500}
        />
        <Text style={styles.characterCount}>{formData.bio.length}/500</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={GlobalStyles.inputLabel}>Experience Level *</Text>
        <View style={styles.experienceOptions}>
          {experienceLevels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.experienceOption,
                formData.experience === level && styles.selectedExperience
              ]}
              onPress={() => setFormData(prev => ({ ...prev, experience: level }))}
            >
              <Text style={[
                styles.experienceText,
                formData.experience === level && styles.selectedExperienceText
              ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Professional Details</Text>
      <Text style={styles.stepSubtitle}>Your specialties and pricing</Text>

      <View style={styles.inputGroup}>
        <Text style={GlobalStyles.inputLabel}>Art Specialties * (Select at least one)</Text>
        <View style={styles.specialtiesContainer}>
          {availableSpecialties.map((specialty) => (
            <TouchableOpacity
              key={specialty}
              style={[
                GlobalStyles.filterButton,
                formData.specialties.includes(specialty) && GlobalStyles.activeFilterButton
              ]}
              onPress={() => handleSpecialtyToggle(specialty)}
            >
              <Text style={[
                GlobalStyles.filterButtonText,
                formData.specialties.includes(specialty) && styles.selectedText
              ]}>
                {specialty}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={GlobalStyles.inputLabel}>Price Range (USD) *</Text>
        <View style={styles.priceRangeContainer}>
          <View style={styles.priceInputContainer}>
            <Text style={styles.priceLabel}>Minimum</Text>
            <TextInput
              style={[GlobalStyles.input, styles.priceInput]}
              value={formData.priceRange.min}
              onChangeText={(text) => setFormData(prev => ({
                ...prev,
                priceRange: { ...prev.priceRange, min: text }
              }))}
              placeholder="25"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.priceSeparator}>to</Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.priceLabel}>Maximum</Text>
            <TextInput
              style={[GlobalStyles.input, styles.priceInput]}
              value={formData.priceRange.max}
              onChangeText={(text) => setFormData(prev => ({
                ...prev,
                priceRange: { ...prev.priceRange, max: text }
              }))}
              placeholder="500"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>
        </View>
        <Text style={styles.priceHint}>
          Set your typical commission price range. You can adjust these later.
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={GlobalStyles.inputLabel}>Social Links (Optional)</Text>
        
        <View style={styles.socialInputContainer}>
          <Text style={styles.socialLabel}>🌐 Website</Text>
          <TextInput
            style={GlobalStyles.input}
            value={formData.website}
            onChangeText={(text) => setFormData(prev => ({ ...prev, website: text }))}
            placeholder="https://your-portfolio.com"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.socialInputContainer}>
          <Text style={styles.socialLabel}>📷 Instagram</Text>
          <TextInput
            style={GlobalStyles.input}
            value={formData.instagram}
            onChangeText={(text) => setFormData(prev => ({ ...prev, instagram: text }))}
            placeholder="@your_username"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.socialInputContainer}>
          <Text style={styles.socialLabel}>🎨 ArtStation</Text>
          <TextInput
            style={GlobalStyles.input}
            value={formData.artstation}
            onChangeText={(text) => setFormData(prev => ({ ...prev, artstation: text }))}
            placeholder="artstation.com/your_profile"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
          />
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Verification Documents</Text>
      <Text style={styles.stepSubtitle}>Upload required documents and portfolio</Text>

      <View style={styles.inputGroup}>
        <Text style={GlobalStyles.inputLabel}>Identity Verification *</Text>
        <Text style={styles.inputHint}>
          Upload a government-issued ID (driver's license, passport, etc.)
        </Text>
        <TouchableOpacity
          style={styles.documentUpload}
          onPress={handleIdDocumentPicker}
        >
          {formData.idDocument ? (
            <View style={styles.documentSelected}>
              <Text style={styles.documentIcon}>📄</Text>
              <Text style={styles.documentName}>{formData.idDocument.name}</Text>
              <Text style={styles.documentSize}>
                {(formData.idDocument.size / 1024 / 1024).toFixed(2)} MB
              </Text>
            </View>
          ) : (
            <View style={styles.documentPlaceholder}>
              <Text style={styles.uploadIcon}>📤</Text>
              <Text style={styles.uploadText}>Tap to upload ID document</Text>
              <Text style={styles.uploadSubtext}>PDF, JPG, PNG (Max 10MB)</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={GlobalStyles.inputLabel}>Portfolio Samples * (Minimum 3)</Text>
        <Text style={styles.inputHint}>
          Upload your best artwork to showcase your skills
        </Text>
        
        <TouchableOpacity
          style={styles.portfolioUpload}
          onPress={handlePortfolioImagePicker}
          disabled={formData.portfolio.length >= 10}
        >
          <Text style={styles.uploadIcon}>🎨</Text>
          <Text style={styles.uploadText}>
            {formData.portfolio.length === 0 ? 'Add Portfolio Images' : 'Add More Images'}
          </Text>
          <Text style={styles.uploadSubtext}>
            {formData.portfolio.length}/10 images • JPG, PNG
          </Text>
        </TouchableOpacity>

        {formData.portfolio.length > 0 && (
          <View style={styles.portfolioGrid}>
            {formData.portfolio.map((item) => (
              <View key={item.id} style={styles.portfolioItem}>
                <Image source={{ uri: item.uri }} style={styles.portfolioImage} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePortfolioItem(item.id)}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.portfolioTitleInput}
                  value={item.title}
                  onChangeText={(text) => updatePortfolioItem(item.id, 'title', text)}
                  placeholder="Artwork title"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Terms & Conditions</Text>
      <Text style={styles.stepSubtitle}>Review and accept our terms</Text>

      <View style={styles.termsContainer}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setFormData(prev => ({ ...prev, agreeToTerms: !prev.agreeToTerms }))}
        >
          <View style={[styles.checkbox, formData.agreeToTerms && styles.checkboxChecked]}>
            {formData.agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <View style={styles.checkboxContent}>
            <Text style={styles.checkboxText}>
              I agree to the <Text style={styles.linkText}>Terms of Service</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setFormData(prev => ({ ...prev, agreeToCommission: !prev.agreeToCommission }))}
        >
          <View style={[styles.checkbox, formData.agreeToCommission && styles.checkboxChecked]}>
            {formData.agreeToCommission && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <View style={styles.checkboxContent}>
            <Text style={styles.checkboxText}>
              I understand the commission process and agree to deliver quality work within agreed timelines
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.verificationNotice}>
        <Text style={styles.noticeIcon}>ℹ️</Text>
        <View style={styles.noticeContent}>
          <Text style={styles.noticeTitle}>Verification Process</Text>
          <Text style={styles.noticeText}>
            • Our team will review your application within 24-48 hours{'\n'}
            • You'll receive an email notification with the result{'\n'}
            • If approved, you can immediately start accepting commissions{'\n'}
            • If additional information is needed, we'll contact you
          </Text>
        </View>
      </View>
    </View>
  );

  if (isSubmitting) {
    return (
      <SafeAreaView style={GlobalStyles.container}>
        <Header 
          title="Submitting Verification"
          showBackButton={false}
        />
        <LoadingState
          text="Submitting your verification..."
          animationType="pulse"
          size="large"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <Header 
        title="Artist Verification"
        onBackPress={() => router.back()}
      />

      {renderProgressBar()}

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentStep > 1 && (
            <TouchableOpacity style={GlobalStyles.secondaryButton} onPress={handlePrevious}>
              <Text style={GlobalStyles.secondaryButtonText}>Previous</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.navigationSpacer} />
          
          {currentStep < totalSteps ? (
            <TouchableOpacity 
              style={[
                GlobalStyles.primaryButton,
                !validateStep(currentStep) && GlobalStyles.disabledButton
              ]} 
              onPress={handleNext}
              disabled={!validateStep(currentStep)}
            >
              <Text style={[
                GlobalStyles.primaryButtonText,
                !validateStep(currentStep) && GlobalStyles.disabledButtonText
              ]}>
                Next
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[
                styles.submitButton,
                (!validateStep(currentStep) || isSubmitting) && GlobalStyles.disabledButton
              ]} 
              onPress={handleSubmit}
              disabled={!validateStep(currentStep) || isSubmitting}
            >
              <Text style={[
                styles.submitButtonText,
                (!validateStep(currentStep) || isSubmitting) && GlobalStyles.disabledButtonText
              ]}>
                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Simplified styles - using style system
const styles = StyleSheet.create({
  progressContainer: {
    ...Layout.paddingHorizontal,
    paddingVertical: Layout.spacing.lg,
    alignItems: 'center',
  },
  progressText: {
    ...Typography.caption,
    marginTop: Layout.spacing.sm,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: Layout.spacing.xl,
  },
  stepTitle: {
    ...Typography.h3,
    marginBottom: Layout.spacing.sm,
  },
  stepSubtitle: {
    ...Typography.bodyMuted,
    marginBottom: Layout.spacing.xxxl,
  },
  inputGroup: {
    marginBottom: Layout.spacing.xl,
  },
  inputHint: {
    ...Typography.caption,
    marginBottom: Layout.spacing.md,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    ...Typography.caption,
    textAlign: 'right',
    marginTop: Layout.spacing.sm,
  },
  experienceOptions: {
    gap: Layout.spacing.md,
  },
  experienceOption: {
    backgroundColor: Colors.surface,
    padding: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  selectedExperience: {
    borderColor: Colors.primary,
    backgroundColor: Colors.artist,
  },
  experienceText: {
    ...Typography.body,
    textAlign: 'center',
  },
  selectedExperienceText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  selectedText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  priceRangeContainer: {
    ...Layout.row,
    alignItems: 'center',
    gap: Layout.spacing.lg,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    ...Typography.caption,
    marginBottom: Layout.spacing.sm,
  },
  priceInput: {
    textAlign: 'center',
  },
  priceSeparator: {
    ...Typography.body,
    color: Colors.textMuted,
    marginTop: Layout.spacing.xl,
  },
  priceHint: {
    ...Typography.caption,
    marginTop: Layout.spacing.sm,
  },
  socialInputContainer: {
    marginBottom: Layout.spacing.md,
  },
  socialLabel: {
    ...Typography.caption,
    marginBottom: Layout.spacing.sm,
  },
  documentUpload: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  documentSelected: {
    alignItems: 'center',
  },
  documentIcon: {
    fontSize: 32,
    marginBottom: Layout.spacing.sm,
  },
  documentName: {
    ...Typography.body,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.xs,
  },
  documentSize: {
    ...Typography.caption,
  },
  documentPlaceholder: {
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: Layout.spacing.sm,
  },
  uploadText: {
    ...Typography.body,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.xs,
  },
  uploadSubtext: {
    ...Typography.caption,
  },
  portfolioUpload: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  portfolioGrid: {
    ...Layout.row,
    flexWrap: 'wrap',
    gap: Layout.spacing.md,
  },
  portfolioItem: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.sm,
    position: 'relative',
  },
  portfolioImage: {
    width: '100%',
    height: 120,
    borderRadius: Layout.radius.sm,
    marginBottom: Layout.spacing.sm,
  },
  removeButton: {
    position: 'absolute',
    top: Layout.spacing.xs,
    right: Layout.spacing.xs,
    width: 24,
    height: 24,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    ...Typography.badge,
    color: Colors.text,
  },
  portfolioTitleInput: {
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.sm,
    padding: Layout.spacing.sm,
    ...Typography.caption,
    color: Colors.text,
  },
  termsContainer: {
    marginBottom: Layout.spacing.xxxl,
  },
  checkboxContainer: {
    ...Layout.row,
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.xl,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: Layout.radius.xs,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: 'bold',
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxText: {
    ...Typography.body,
    lineHeight: 24,
  },
  linkText: {
    color: Colors.link,
    textDecorationLine: 'underline',
  },
  verificationNotice: {
    backgroundColor: Colors.artist,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    ...Layout.row,
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  noticeIcon: {
    fontSize: 20,
    marginRight: Layout.spacing.md,
    marginTop: 2,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    ...Typography.body,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Layout.spacing.sm,
  },
  noticeText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  navigationContainer: {
    ...Layout.row,
    ...Layout.paddingHorizontal,
    paddingVertical: Layout.spacing.lg,
    ...Layout.borderTop,
    backgroundColor: Colors.background,
  },
  navigationSpacer: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.xl,
  },
  submitButtonText: {
    ...Typography.button,
    color: Colors.text,
  },
});

export default ArtistVerificationPage;