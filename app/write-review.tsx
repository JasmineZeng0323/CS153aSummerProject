//write-review.tsx
import { router, useLocalSearchParams } from 'expo-router';
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

// Import your component library
import { Colors } from './components/styles/Colors';
import GlobalStyles from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

const WriteReviewPage = () => {
  const params = useLocalSearchParams();
  const { orderId, artistName, title } = params;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Predefined review tags
  const reviewTags = [
    'Fast Delivery',
    'Great Communication',
    'High Quality',
    'Professional',
    'Creative',
    'Exceeded Expectations',
    'Patient',
    'Responsive',
    'Detailed Work',
    'Easy to Work With',
    'Original Style',
    'Would Recommend'
  ];

  const handleRatingPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting.');
      return;
    }

    if (reviewText.trim().length < 10) {
      Alert.alert('Review Too Short', 'Please write at least 10 characters for your review.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Review submitted:', {
        orderId,
        artistName,
        rating,
        reviewText: reviewText.trim(),
        tags: selectedTags
      });

      Alert.alert(
        'Review Submitted',
        'Thank you for your feedback! Your review helps other clients make informed decisions.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Select Rating';
    }
  };

  const getRatingColor = (rating) => {
    if (rating <= 2) return Colors.error;
    if (rating === 3) return Colors.warning;
    return Colors.success;
  };

  return (
    <View style={GlobalStyles.container}>
      {/* Header - 手动实现确保正确的 padding */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write Review</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Order Info */}
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>{title || 'Commission Order'}</Text>
            <Text style={styles.artistName}>Artist: {artistName}</Text>
            <Text style={styles.orderId}>Order #{orderId}</Text>
          </View>

          {/* Rating Section */}
          <View style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>How was your experience?</Text>
            <Text style={styles.sectionSubtitle}>Rate your overall satisfaction</Text>
            
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  style={styles.starButton}
                  onPress={() => handleRatingPress(star)}
                >
                  <Text style={[
                    styles.star,
                    star <= rating && styles.activeStar,
                    star <= rating && { color: getRatingColor(rating) }
                  ]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {rating > 0 && (
              <Text style={[styles.ratingText, { color: getRatingColor(rating) }]}>
                {getRatingText(rating)}
              </Text>
            )}
          </View>

          {/* Quick Tags Section */}
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>What went well?</Text>
            <Text style={styles.sectionSubtitle}>Select all that apply (optional)</Text>
            
            <View style={styles.tagsGrid}>
              {reviewTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagButton,
                    selectedTags.includes(tag) && styles.selectedTagButton
                  ]}
                  onPress={() => handleTagToggle(tag)}
                >
                  <Text style={[
                    styles.tagText,
                    selectedTags.includes(tag) && styles.selectedTagText
                  ]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Written Review Section */}
          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle}>Write your review</Text>
            <Text style={styles.sectionSubtitle}>
              Share details about your experience to help other clients
            </Text>
            
            <TextInput
              style={styles.reviewInput}
              placeholder="Tell us about your experience with this artist. What did you like? Was the communication good? How was the final result?"
              placeholderTextColor={Colors.textDisabled}
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={1000}
            />
            
            <Text style={styles.characterCount}>
              {reviewText.length}/1000 characters
            </Text>
          </View>

          {/* Guidelines */}
          <View style={styles.guidelines}>
            <Text style={styles.guidelinesTitle}>Review Guidelines</Text>
            <Text style={styles.guidelinesText}>
              • Be honest and constructive in your feedback{'\n'}
              • Focus on your experience with the artist's work and communication{'\n'}
              • Avoid personal attacks or inappropriate language{'\n'}
              • Reviews cannot be edited once submitted{'\n'}
              • Your review will be visible to other users
            </Text>
          </View>

          <View style={GlobalStyles.bottomPadding} />
        </ScrollView>

        {/* Bottom Submit Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              (rating === 0 || isSubmitting) && styles.disabledSubmitButton
            ]}
            onPress={handleSubmitReview}
            disabled={rating === 0 || isSubmitting}
          >
            <Text style={[
              styles.submitButtonText,
              (rating === 0 || isSubmitting) && styles.disabledSubmitButtonText
            ]}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Header - 与其他页面保持完全一致
  header: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: 50, // 🎯 关键！与其他页面一致的状态栏高度
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

  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },

  // Order Info
  orderInfo: {
    ...Layout.card,
    ...Layout.marginHorizontal,
    marginTop: Layout.spacing.xl,
  },
  orderTitle: {
    ...Typography.h5,
    marginBottom: Layout.spacing.sm,
  },
  artistName: {
    ...Typography.body,
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  orderId: {
    ...Typography.bodySmallMuted,
  },

  // Rating Section
  ratingSection: {
    ...Layout.marginHorizontal,
    marginTop: Layout.spacing.xxl,
    alignItems: 'center',
  },
  sectionTitle: {
    ...Typography.h4,
    marginBottom: Layout.spacing.sm,
  },
  sectionSubtitle: {
    ...Typography.bodySmallMuted,
    marginBottom: Layout.spacing.xxl,
    textAlign: 'center',
  },
  starsContainer: {
    ...Layout.row,
    marginBottom: Layout.spacing.lg,
  },
  starButton: {
    marginHorizontal: Layout.spacing.sm,
  },
  star: {
    fontSize: 40,
    color: Colors.border,
  },
  activeStar: {
    color: Colors.rating,
  },
  ratingText: {
    ...Typography.bodyLarge,
    fontWeight: 'bold',
    marginTop: Layout.spacing.sm,
  },

  // Tags Section
  tagsSection: {
    ...Layout.marginHorizontal,
    marginTop: Layout.spacing.xxxl,
  },
  tagsGrid: {
    ...Layout.row,
    flexWrap: 'wrap',
    marginTop: Layout.spacing.lg,
  },
  tagButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.xl,
    marginRight: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedTagButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tagText: {
    ...Typography.bodySmall,
  },
  selectedTagText: {
    fontWeight: 'bold',
  },

  // Review Section
  reviewSection: {
    ...Layout.marginHorizontal,
    marginTop: Layout.spacing.xxxl,
  },
  reviewInput: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    color: Colors.text,
    ...Typography.body,
    marginTop: Layout.spacing.lg,
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  characterCount: {
    ...Typography.caption,
    textAlign: 'right',
    marginTop: Layout.spacing.sm,
  },

  // Guidelines
  guidelines: {
    ...Layout.marginHorizontal,
    marginTop: Layout.spacing.xxxl,
    backgroundColor: Colors.artist,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  guidelinesTitle: {
    ...Typography.body,
    fontWeight: 'bold',
    color: Colors.success,
    marginBottom: Layout.spacing.sm,
  },
  guidelinesText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Bottom Container
  bottomContainer: {
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
    backgroundColor: Colors.background,
    ...Layout.borderTop,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
  },
  disabledSubmitButton: {
    backgroundColor: Colors.border,
  },
  submitButtonText: {
    ...Typography.button,
  },
  disabledSubmitButtonText: {
    color: Colors.textDisabled,
  },
});

export default WriteReviewPage;