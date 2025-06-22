import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
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
    if (rating <= 2) return '#FF5722';
    if (rating === 3) return '#FF9800';
    return '#4CAF50';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
              placeholderTextColor="#666"
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

          <View style={styles.bottomPadding} />
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 16,
    color: '#00A8FF',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    color: '#888',
  },

  // Rating Section
  ratingSection: {
    marginHorizontal: 20,
    marginTop: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  starButton: {
    marginHorizontal: 8,
  },
  star: {
    fontSize: 40,
    color: '#333',
  },
  activeStar: {
    color: '#FFD700',
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },

  // Tags Section
  tagsSection: {
    marginHorizontal: 20,
    marginTop: 32,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  tagButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedTagButton: {
    backgroundColor: '#00A8FF',
    borderColor: '#00A8FF',
  },
  tagText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  selectedTagText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Review Section
  reviewSection: {
    marginHorizontal: 20,
    marginTop: 32,
  },
  reviewInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#333',
  },
  characterCount: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 8,
  },

  // Guidelines
  guidelines: {
    marginHorizontal: 20,
    marginTop: 32,
    backgroundColor: '#1A2A1A',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  guidelinesText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },

  bottomPadding: {
    height: 100,
  },

  // Bottom Container
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  submitButton: {
    backgroundColor: '#00A8FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledSubmitButton: {
    backgroundColor: '#333',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledSubmitButtonText: {
    color: '#666',
  },
});

export default WriteReviewPage;