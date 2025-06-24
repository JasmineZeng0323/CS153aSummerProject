import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import StatusBadge from './components/common/StatusBadge';
import { Colors } from './components/styles/Colors';
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

interface GalleryData {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  totalStock: number;
  status: 'active' | 'paused' | 'sold_out' | 'draft';
  category: string;
  images: string[];
  createdAt: string;
  sold: number;
  views: number;
  likes: number;
  revenue: number;
}

const EditGalleryPage = () => {
  const params = useLocalSearchParams();
  const { galleryId } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [gallery, setGallery] = useState<GalleryData | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    images: [] as string[]
  });

  useEffect(() => {
    loadGallery();
  }, [galleryId]);

  const loadGallery = async () => {
    try {
      setIsLoading(true);
      const galleriesData = await AsyncStorage.getItem('myGalleries');
      
      if (galleriesData) {
        const galleries = JSON.parse(galleriesData);
        const targetGallery = galleries.find((g: GalleryData) => g.id.toString() === galleryId);
        
        if (targetGallery) {
          setGallery(targetGallery);
          setFormData({
            title: targetGallery.title,
            description: targetGallery.description || '',
            price: targetGallery.price.toString(),
            stock: targetGallery.stock.toString(),
            images: targetGallery.images || []
          });
        } else {
          Alert.alert('Error', 'Gallery not found');
          router.back();
        }
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
      Alert.alert('Error', 'Failed to load gallery data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const handleSave = async () => {
    if (!gallery) return;

    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Validation Error', 'Title is required');
      return;
    }

    if (!formData.price || parseInt(formData.price) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price');
      return;
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      Alert.alert('Validation Error', 'Please enter a valid stock amount');
      return;
    }

    setIsSaving(true);

    try {
      // Update gallery data
      const updatedGallery = {
        ...gallery,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images,
        updatedAt: new Date().toISOString()
      };

      // Update in storage
      const galleriesData = await AsyncStorage.getItem('myGalleries');
      if (galleriesData) {
        const galleries = JSON.parse(galleriesData);
        const updatedGalleries = galleries.map((g: GalleryData) =>
          g.id === gallery.id ? updatedGallery : g
        );
        
        await AsyncStorage.setItem('myGalleries', JSON.stringify(updatedGalleries));
        
        Alert.alert(
          'Success! 🎉',
          'Gallery updated successfully.',
          [
            {
              text: 'View Gallery',
              onPress: () => router.push({
                pathname: '/gallery-detail',
                params: { galleryId: gallery.id }
              })
            },
            {
              text: 'Back to Galleries',
              onPress: () => router.push('/published-galleries')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error saving gallery:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Gallery',
      'Are you sure you want to delete this gallery? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const galleriesData = await AsyncStorage.getItem('myGalleries');
              if (galleriesData) {
                const galleries = JSON.parse(galleriesData);
                const updatedGalleries = galleries.filter((g: GalleryData) => g.id !== gallery?.id);
                await AsyncStorage.setItem('myGalleries', JSON.stringify(updatedGalleries));
                
                Alert.alert('Success', 'Gallery deleted successfully.');
                router.push('/published-galleries');
              }
            } catch (error) {
              console.error('Error deleting gallery:', error);
              Alert.alert('Error', 'Failed to delete gallery. Please try again.');
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={AppStyles.container}>
        <Header title="Edit Gallery" style={AppStyles.header} />
        <LoadingState text="Loading gallery..." />
      </View>
    );
  }

  if (!gallery) {
    return (
      <View style={AppStyles.container}>
        <Header title="Edit Gallery" style={AppStyles.header} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Gallery not found</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={AppStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header 
        title="Edit Gallery"
        style={AppStyles.header}
        rightElement={
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Gallery Status */}
        <View style={styles.statusSection}>
          <View style={styles.statusHeader}>
            <Text style={styles.sectionTitle}>Gallery Status</Text>
            <StatusBadge 
              status={gallery.status as any}
              text={gallery.status.replace('_', ' ').toUpperCase()}
              size="small"
            />
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>Sold: {gallery.sold}</Text>
            <Text style={styles.statText}>Views: {gallery.views}</Text>
            <Text style={styles.statText}>Revenue: ${gallery.revenue}</Text>
          </View>
        </View>

        {/* Images Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Gallery Images</Text>
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
          <Text style={styles.sectionLabel}>Title *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.title}
            onChangeText={(text) => updateFormData('title', text)}
            placeholder="Gallery title"
            placeholderTextColor={Colors.textMuted}
            maxLength={50}
          />
          <Text style={styles.characterCount}>{formData.title.length}/50</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => updateFormData('description', text)}
            placeholder="Describe your artwork..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.characterCount}>{formData.description.length}/500</Text>
        </View>

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
          <Text style={styles.sectionHint}>
            Current: {gallery.stock}/{gallery.totalStock} • Sold: {gallery.sold}
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.disabledButton]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Changes'}
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
  
  // Delete Button
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 18,
  },

  // Status Section
  statusSection: {
    backgroundColor: Colors.surface,
    marginHorizontal: Layout.spacing.xl,
    marginVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    ...Typography.h6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },

  // Form Sections
  section: {
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.xl,
  },
  sectionLabel: {
    ...Typography.label,
    marginBottom: Layout.spacing.sm,
  },
  sectionHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Layout.spacing.xs,
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
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    fontSize: 16,
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

  // Bottom Actions
  bottomActions: {
    flexDirection: 'row',
    padding: Layout.spacing.xl,
    paddingBottom: Layout.spacing.xl + 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  cancelButtonText: {
    ...Typography.button,
    color: Colors.textMuted,
  },
  saveButton: {
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
  saveButtonText: {
    ...Typography.button,
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  errorText: {
    ...Typography.h5,
    color: Colors.error,
  },

  bottomPadding: {
    height: 100,
  },
});

export default EditGalleryPage;