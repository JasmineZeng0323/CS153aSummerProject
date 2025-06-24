// publish-gallery.tsx - Artist Gallery Publishing Page
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
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
import { Colors } from './components/styles/Colors';
import GlobalStyles from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

const AppStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 0, 
  },
  header: {
    paddingTop: 50, 
  },
};

interface GalleryFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  contentType: string[];
  deliveryTime: string;
  stock: string;
  images: string[];
  specifications: {
    dimensions: string;
    format: string;
    colorMode: string;
    publishRights: string;
  };
  requirements: {
    acceptedTypes: string;
    notAcceptedTypes: string;
    acceptsTextDesign: boolean;
    milestones: string;
  };
}

const PublishGalleryPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<GalleryFormData>({
    title: '',
    description: '',
    price: '',
    category: '',
    contentType: [],
    deliveryTime: '',
    stock: '',
    images: [],
    specifications: {
      dimensions: '1500x1000',
      format: 'JPG',
      colorMode: 'RGB',
      publishRights: 'Artist can publish with watermark'
    },
    requirements: {
      acceptedTypes: '',
      notAcceptedTypes: '',
      acceptsTextDesign: false,
      milestones: '70% Draft, 100% Final'
    }
  });

  const categories = [
    { id: 'portrait', label: 'Portrait', icon: '👤' },
    { id: 'half-body', label: 'Half Body', icon: '👔' },
    { id: 'full-body', label: 'Full Body', icon: '🧍' },
    { id: 'q-version', label: 'Q-Version', icon: '🎭' },
    { id: 'character-design', label: 'Character Design', icon: '🎨' },
    { id: 'standing-art', label: 'Standing Art', icon: '🕴️' },
    { id: 'wallpaper', label: 'Wallpaper', icon: '🖼️' },
    { id: 'emoji-pack', label: 'Emoji Pack', icon: '😊' },
    { id: 'live2d', label: 'Live2D', icon: '🎮' }
  ];

  const contentTypes = [
    { id: 'realistic', label: 'Realistic' },
    { id: 'anime', label: 'Anime Style' },
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
    { id: 'couple', label: 'Couple' },
    { id: 'japanese', label: 'Japanese Style' },
    { id: 'ancient', label: 'Ancient Style' },
    { id: 'modern', label: 'Modern' }
  ];

  const deliveryOptions = [
    { id: '24h', label: '24 Hours Express', icon: '⚡' },
    { id: '3days', label: '3 Days', icon: '📅' },
    { id: '1week', label: '1 Week', icon: '📅' },
    { id: '2weeks', label: '2 Weeks', icon: '📅' },
    { id: 'custom', label: 'Custom Timeline', icon: '🕒' }
  ];

  // Image picker functionality
  const pickImages = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [1, 1],
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages].slice(0, 6) // Max 6 images
        }));
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateFormData = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const toggleContentType = (typeId: string) => {
    setFormData(prev => ({
      ...prev,
      contentType: prev.contentType.includes(typeId)
        ? prev.contentType.filter(id => id !== typeId)
        : [...prev.contentType, typeId]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.title.trim() !== '' && 
               formData.description.trim() !== '' && 
               formData.images.length > 0;
      case 2:
        return formData.price !== '' && 
               formData.category !== '' && 
               formData.deliveryTime !== '';
      case 3:
        return formData.stock !== '';
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep < 4) {
        setActiveStep(activeStep + 1);
      } else {
        handlePublish();
      }
    } else {
      Alert.alert('Incomplete Information', 'Please fill in all required fields before proceeding.');
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to local storage for demo
      const galleryData = {
        ...formData,
        id: Date.now(),
        artistId: 'current_user',
        createdAt: new Date().toISOString(),
        status: 'active',
        sold: 0
      };
      
      const existingGalleries = await AsyncStorage.getItem('myGalleries');
      const galleries = existingGalleries ? JSON.parse(existingGalleries) : [];
      galleries.push(galleryData);
      await AsyncStorage.setItem('myGalleries', JSON.stringify(galleries));
      
      Alert.alert(
        'Gallery Published! 🎉',
        'Your artwork has been successfully published and is now available for purchase.',
        [
          {
            text: 'View Gallery',
            onPress: () => {
              router.replace({
                pathname: '/gallery-detail',
                params: {
                  galleryId: galleryData.id,
                  title: galleryData.title,
                  price: galleryData.price
                }
              });
            }
          },
          {
            text: 'Publish Another',
            onPress: () => {
              // Reset form
              setFormData({
                title: '',
                description: '',
                price: '',
                category: '',
                contentType: [],
                deliveryTime: '',
                stock: '',
                images: [],
                specifications: {
                  dimensions: '1500x1000',
                  format: 'JPG',
                  colorMode: 'RGB',
                  publishRights: 'Artist can publish with watermark'
                },
                requirements: {
                  acceptedTypes: '',
                  notAcceptedTypes: '',
                  acceptsTextDesign: false,
                  milestones: '70% Draft, 100% Final'
                }
              });
              setActiveStep(1);
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Error publishing gallery:', error);
      Alert.alert('Error', 'Failed to publish gallery. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((step) => (
        <View key={step} style={styles.stepIndicatorContainer}>
          <View style={[
            styles.stepCircle,
            activeStep >= step && styles.activeStepCircle,
            activeStep > step && styles.completedStepCircle
          ]}>
            {activeStep > step ? (
              <Text style={styles.stepCheckmark}>✓</Text>
            ) : (
              <Text style={[
                styles.stepNumber,
                activeStep >= step && styles.activeStepNumber
              ]}>
                {step}
              </Text>
            )}
          </View>
          {step < 4 && (
            <View style={[
              styles.stepLine,
              activeStep > step && styles.activeStepLine
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      
      {/* Images Upload */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Gallery Images *</Text>
        <Text style={styles.sectionHint}>Add 1-6 images showcasing your artwork</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          {formData.images.map((uri, index) => (
            <View key={index} style={styles.uploadedImageContainer}>
              <Image source={{ uri }} style={styles.uploadedImage} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          
          {formData.images.length < 6 && (
            <TouchableOpacity style={styles.addImageButton} onPress={pickImages}>
              <Text style={styles.addImageIcon}>📷</Text>
              <Text style={styles.addImageText}>Add Images</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Title */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Gallery Title *</Text>
        <TextInput
          style={styles.textInput}
          value={formData.title}
          onChangeText={(text) => updateFormData('title', text)}
          placeholder="e.g., Anime Style Portrait with Glasses"
          placeholderTextColor={Colors.textMuted}
          maxLength={50}
        />
        <Text style={styles.characterCount}>{formData.title.length}/50</Text>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Description *</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => updateFormData('description', text)}
          placeholder="Describe your artwork, style, and what makes it special..."
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={4}
          maxLength={500}
        />
        <Text style={styles.characterCount}>{formData.description.length}/500</Text>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Pricing & Category</Text>
      
      {/* Price */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Price (USD) *</Text>
        <View style={styles.priceInputContainer}>
          <Text style={styles.priceSymbol}>$</Text>
          <TextInput
            style={styles.priceInput}
            value={formData.price}
            onChangeText={(text) => updateFormData('price', text.replace(/[^0-9]/g, ''))}
            placeholder="89"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Category */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Category *</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryOption,
                formData.category === category.id && styles.selectedCategoryOption
              ]}
              onPress={() => updateFormData('category', category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryLabel,
                formData.category === category.id && styles.selectedCategoryLabel
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content Type */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Content Style (Multi-select)</Text>
        <View style={styles.contentTypeGrid}>
          {contentTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.contentTypeOption,
                formData.contentType.includes(type.id) && styles.selectedContentType
              ]}
              onPress={() => toggleContentType(type.id)}
            >
              <Text style={[
                styles.contentTypeLabel,
                formData.contentType.includes(type.id) && styles.selectedContentTypeLabel
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Delivery Time */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Delivery Time *</Text>
        <View style={styles.deliveryGrid}>
          {deliveryOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.deliveryOption,
                formData.deliveryTime === option.id && styles.selectedDeliveryOption
              ]}
              onPress={() => updateFormData('deliveryTime', option.id)}
            >
              <Text style={styles.deliveryIcon}>{option.icon}</Text>
              <Text style={[
                styles.deliveryLabel,
                formData.deliveryTime === option.id && styles.selectedDeliveryLabel
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Stock & Requirements</Text>
      
      {/* Stock */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Available Stock *</Text>
        <TextInput
          style={styles.textInput}
          value={formData.stock}
          onChangeText={(text) => updateFormData('stock', text.replace(/[^0-9]/g, ''))}
          placeholder="10"
          placeholderTextColor={Colors.textMuted}
          keyboardType="numeric"
        />
        <Text style={styles.sectionHint}>How many copies of this artwork you want to sell</Text>
      </View>

      {/* Accepted Types */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Accepted Character Types</Text>
        <TextInput
          style={styles.textInput}
          value={formData.requirements.acceptedTypes}
          onChangeText={(text) => updateFormData('requirements.acceptedTypes', text)}
          placeholder="e.g., Adults, Young characters, Original characters"
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {/* Not Accepted Types */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Not Accepted Types</Text>
        <TextInput
          style={styles.textInput}
          value={formData.requirements.notAcceptedTypes}
          onChangeText={(text) => updateFormData('requirements.notAcceptedTypes', text)}
          placeholder="e.g., Real people, Gore, NSFW content"
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {/* Text Design */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.checkboxRow}
          onPress={() => updateFormData('requirements.acceptsTextDesign', !formData.requirements.acceptsTextDesign)}
        >
          <View style={[
            styles.checkbox,
            formData.requirements.acceptsTextDesign && styles.checkedCheckbox
          ]}>
            {formData.requirements.acceptsTextDesign && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
          <Text style={styles.checkboxLabel}>Accept text/logo design requests</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Review & Publish</Text>
      
      {/* Preview */}
      <View style={styles.previewCard}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>{formData.title}</Text>
          <Text style={styles.previewPrice}>${formData.price}</Text>
        </View>
        
        {formData.images.length > 0 && (
          <Image source={{ uri: formData.images[0] }} style={styles.previewImage} />
        )}
        
        <Text style={styles.previewDescription}>{formData.description}</Text>
        
        <View style={styles.previewMeta}>
          <Text style={styles.previewMetaText}>
            Category: {categories.find(c => c.id === formData.category)?.label}
          </Text>
          <Text style={styles.previewMetaText}>
            Delivery: {deliveryOptions.find(d => d.id === formData.deliveryTime)?.label}
          </Text>
          <Text style={styles.previewMetaText}>Stock: {formData.stock}</Text>
        </View>
      </View>

      {/* Terms */}
      <View style={styles.termsSection}>
        <Text style={styles.termsTitle}>Publishing Terms</Text>
        <Text style={styles.termsText}>
          • You retain full ownership of your artwork{'\n'}
          • Commission fees: 10% of each sale{'\n'}
          • Payments processed within 24-48 hours{'\n'}
          • You can modify or remove listings anytime{'\n'}
          • Follow community guidelines for content
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={AppStyles.container}>
        <Header title="Publishing Gallery..." style={AppStyles.header} />
        <LoadingState 
          text="Publishing your artwork..."
          animationType="pulse"
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={AppStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header 
        title="Publish Gallery"
        style={AppStyles.header}
        onBackPress={() => {
          if (activeStep > 1) {
            setActiveStep(activeStep - 1);
          } else {
            router.back();
          }
        }}
      />

      {renderStepIndicator()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeStep === 1 && renderStep1()}
        {activeStep === 2 && renderStep2()}
        {activeStep === 3 && renderStep3()}
        {activeStep === 4 && renderStep4()}
        
        <View style={GlobalStyles.bottomPadding} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {activeStep > 1 && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setActiveStep(activeStep - 1)}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[
            styles.nextButton,
            !validateStep(activeStep) && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!validateStep(activeStep)}
        >
          <Text style={styles.nextButtonText}>
            {activeStep === 4 ? 'Publish Gallery' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },

  // Step Indicator
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.xl,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStepCircle: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  completedStepCircle: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  stepNumber: {
    ...Typography.bodySmall,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  activeStepNumber: {
    color: Colors.text,
  },
  stepCheckmark: {
    ...Typography.bodySmall,
    fontWeight: 'bold',
    color: Colors.text,
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: Layout.spacing.sm,
  },
  activeStepLine: {
    backgroundColor: Colors.success,
  },

  // Step Content
  stepContent: {
    padding: Layout.spacing.xl,
  },
  stepTitle: {
    ...Typography.h4,
    marginBottom: Layout.spacing.xl,
    textAlign: 'center',
  },

  // Form Sections
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionLabel: {
    ...Typography.label,
    marginBottom: Layout.spacing.sm,
  },
  sectionHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Layout.spacing.md,
  },

  // Image Upload
  imageScroll: {
    flexDirection: 'row',
  },
  uploadedImageContainer: {
    position: 'relative',
    marginRight: Layout.spacing.md,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: Layout.radius.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: Layout.radius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  addImageIcon: {
    fontSize: 24,
    marginBottom: Layout.spacing.xs,
  },
  addImageText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },

  // Text Inputs
  textInput: {
    ...Layout.input,
    ...Typography.body,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: Layout.spacing.xs,
  },

  // Price Input
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Layout.spacing.lg,
  },
  priceSymbol: {
    ...Typography.h5,
    color: Colors.primary,
    marginRight: Layout.spacing.sm,
  },
  priceInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    paddingVertical: Layout.spacing.lg,
  },

  // Category Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryOption: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Layout.spacing.lg,
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  selectedCategoryOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.artist,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: Layout.spacing.sm,
  },
  categoryLabel: {
    ...Typography.bodySmall,
    textAlign: 'center',
  },
  selectedCategoryLabel: {
    color: Colors.primary,
    fontWeight: 'bold',
  },

  // Content Type Grid
  contentTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contentTypeOption: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    marginRight: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  selectedContentType: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  contentTypeLabel: {
    ...Typography.bodySmall,
  },
  selectedContentTypeLabel: {
    color: Colors.text,
    fontWeight: 'bold',
  },

  // Delivery Options
  deliveryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  deliveryOption: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Layout.spacing.md,
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  selectedDeliveryOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.artist,
  },
  deliveryIcon: {
    fontSize: 20,
    marginBottom: Layout.spacing.xs,
  },
  deliveryLabel: {
    ...Typography.caption,
    textAlign: 'center',
  },
  selectedDeliveryLabel: {
    color: Colors.primary,
    fontWeight: 'bold',
  },

  // Checkbox
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: Layout.radius.xs,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  checkedCheckbox: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    ...Typography.body,
    flex: 1,
  },

  // Preview Card
  previewCard: {
    ...Layout.card,
    marginBottom: Layout.spacing.lg,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  previewTitle: {
    ...Typography.h5,
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  previewPrice: {
    ...Typography.price,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: Layout.radius.md,
    marginBottom: Layout.spacing.md,
  },
  previewDescription: {
    ...Typography.bodyMuted,
    marginBottom: Layout.spacing.md,
    lineHeight: 20,
  },
  previewMeta: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Layout.spacing.md,
  },
  previewMetaText: {
    ...Typography.bodySmall,
    marginBottom: Layout.spacing.xs,
  },

  // Terms Section
  termsSection: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  termsTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.md,
  },
  termsText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    lineHeight: 18,
  },

  // Bottom Actions
  bottomActions: {
    flexDirection: 'row',
    padding: Layout.spacing.xl,
    paddingBottom: Layout.spacing.xl + 20, // Extra padding for safe area
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  backButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  backButtonText: {
    ...Typography.button,
    color: Colors.textMuted,
  },
  nextButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.card,
    opacity: 0.5,
  },
  nextButtonText: {
    ...Typography.button,
  },
});

export default PublishGalleryPage;