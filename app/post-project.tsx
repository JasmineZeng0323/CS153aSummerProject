import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Import your component library
import Header from './components/common/Header';
import { Colors } from './components/styles/Colors';
import { GlobalStyles } from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

const { width: screenWidth } = Dimensions.get('window');

const PostProjectPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState({
    projectType: 'project',
    category: '',
    purpose: '',
    purposeOption: '',
    deadline: '',
    customDeadline: new Date(),
    showDatePicker: false,
    budgetMin: '',
    budgetMax: '',
    title: '',
    detailedRequirements: '',
    referenceImages: [],
    fileFormats: [],
    publishingRights: 'requireAgreement',
    projectFlow: [
      { stage: 'Deposit Payment', percentage: 0 },
      { stage: 'Draft', percentage: 20 },
      { stage: 'Line Art', percentage: 30 },
      { stage: 'Coloring', percentage: 60 },
      { stage: 'Final Artwork', percentage: 100 }
    ]
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Data configurations
  const categories = [
    { id: 'oc', title: 'Original/OC', icon: '🎨' },
    { id: 'portrait', title: 'Portrait', icon: '👤' },
    { id: 'fanart', title: 'Fan Art', icon: '🎭' },
    { id: 'live2d', title: 'Live2D', icon: '🎬' },
    { id: 'illustration', title: 'Illustration', icon: '🖼️' },
    { id: 'design', title: 'Graphic Design', icon: '📐' },
    { id: 'other', title: 'Other - None of the above types I need', icon: '🔄' }
  ];

  const purposes = {
    personal: {
      title: 'Personal Use',
      description: 'Artwork for personal use, display and entertainment, not involving printing, large-scale sales and profit purposes.',
      options: [
        { id: 'collection', title: 'Personal Collection', icon: '⭐' },
        { id: 'social', title: 'Social Display', icon: '😊' },
        { id: 'wallpaper', title: 'Wallpaper/Avatar', icon: '🖼️' },
        { id: 'prohibition', title: 'Prohibit Sales', icon: '🚫' }
      ]
    },
    commercial: {
      title: 'Commercial Use',
      description: 'Artwork will be used for business purposes involving printing, distribution, sales and profit generation.',
      options: [
        { id: 'game', title: 'Game Assets', icon: '🎮' },
        { id: 'promotion', title: 'Commercial Promotion', icon: '📢' },
        { id: 'streaming', title: 'Virtual Streaming', icon: '📺' },
        { id: 'merchandise', title: 'Nearby Sales', icon: '🛍️' }
      ]
    }
  };

  const deadlineOptions = [
    { id: '7days', title: '7 Days', date: '2025-06-29' },
    { id: '14days', title: '14 Days', date: '2025-07-09' },
    { id: '30days', title: '30 Days', date: '2025-07-22' },
    { id: 'month_end', title: 'End of This Month', date: '2025-06-30' },
    { id: 'next_month', title: 'End of Next Month', date: '2025-07-31' }
  ];

  const fileFormats = [
    'JPG', 'PNG', 'PSD', 'AI', 'SVG', 'TIF', 'GIF', 'Other'
  ];

  const publishingRights = [
    { id: 'free', title: 'Artist can publish freely' },
    { id: 'requireAgreement', title: 'Require agreement for public posting' },
    { id: 'noPublish', title: 'Cannot be published publicly' }
  ];

  // Helper functions
  const getDeadlineDisplayText = () => {
    if (projectData.deadline === 'custom') {
      return `Selected: ${projectData.customDeadline.toLocaleDateString()}`;
    } else if (projectData.deadline) {
      const selectedOption = deadlineOptions.find(option => option.id === projectData.deadline);
      return selectedOption ? `Selected: ${selectedOption.date} (${selectedOption.title})` : 'Click to select commission deadline ▼';
    }
    return 'Click to select commission deadline ▼';
  };

  const isDeadlineSelected = () => {
    return projectData.deadline === 'custom' || projectData.deadline !== '';
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert('Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets) {
        setProjectData(prev => ({
          ...prev,
          referenceImages: [...prev.referenceImages, ...result.assets.map(asset => asset.uri)]
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handlePublish = () => {
    if (!agreedToTerms) {
      alert('Please agree to the Project Posting Guidelines');
      return;
    }
    
    console.log('Publishing project:', projectData);
    alert('Project posted successfully!');
    router.back();
  };

  const getStepTitle = () => {
    const titles = [
      'Select Type',
      'Category',
      'Deadline & Budget',
      'Requirements',
      'References',
      'Advanced',
      'Review'
    ];
    return titles[currentStep];
  };

  // Render functions for each step
  const renderProjectTypeSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Project Type</Text>
      
      <View style={[styles.typeCard, styles.selectedCard]}>
        <View style={styles.typeIcon}>
          <Text style={styles.iconText}>📋</Text>
        </View>
        <View style={styles.typeContent}>
          <Text style={styles.typeTitle}>Post Project</Text>
          <Text style={styles.typeSubtitle}>More customizable commission method</Text>
        </View>
        <Text style={styles.chevron}>✓</Text>
      </View>
      
      <View style={styles.autoSelectedNote}>
        <Text style={styles.autoSelectedText}>
          ✅ Post Project selected - Most flexible option for custom commissions
        </Text>
      </View>
    </View>
  );

  const renderCategorySelection = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Artwork Category</Text>
      
      {/* Keep 2x4 grid layout */}
      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              projectData.category === category.id && styles.selectedCategoryCard
            ]}
            onPress={() => setProjectData(prev => ({ ...prev, category: category.id }))}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryTitle}>{category.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Artwork Purpose</Text>
      
      {Object.entries(purposes).map(([key, purpose]) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.purposeSection,
            projectData.purpose === key && styles.selectedPurposeSection
          ]}
          onPress={() => setProjectData(prev => ({ ...prev, purpose: key }))}
        >
          <Text style={[
            styles.purposeTitle,
            projectData.purpose === key && styles.selectedPurposeTitle
          ]}>
            {purpose.title}
          </Text>
          <Text style={styles.purposeDescription}>{purpose.description}</Text>
          
          <View style={styles.purposeGrid}>
            {purpose.options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.purposeOption,
                  projectData.purposeOption === option.id && styles.selectedPurposeOption
                ]}
                onPress={() => setProjectData(prev => ({ ...prev, purposeOption: option.id }))}
              >
                <Text style={styles.purposeIcon}>{option.icon}</Text>
                <Text style={[
                  styles.purposeText,
                  projectData.purposeOption === option.id && styles.selectedPurposeText
                ]}>
                  {option.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDeadlineAndBudget = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Commission Deadline</Text>
      
      <TouchableOpacity 
        style={[
          styles.customDateSelector,
          isDeadlineSelected() && styles.selectedCustomDateSelector
        ]}
        onPress={() => setProjectData(prev => ({ ...prev, showDatePicker: true }))}
      >
        <Text style={[
          styles.customDateText,
          isDeadlineSelected() && styles.selectedDateText
        ]}>
          {getDeadlineDisplayText()}
        </Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={projectData.showDatePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.datePickerModal}>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity 
                  onPress={() => setProjectData(prev => ({ ...prev, showDatePicker: false }))}
                >
                  <Text style={styles.datePickerButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setProjectData(prev => ({ 
                      ...prev, 
                      deadline: 'custom',
                      showDatePicker: false 
                    }));
                  }}
                >
                  <Text style={[styles.datePickerButton, styles.confirmButton]}>Confirm</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={projectData.customDeadline}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setProjectData(prev => ({ ...prev, customDeadline: selectedDate }));
                  }
                }}
                minimumDate={new Date()}
                textColor="#FFFFFF"
              />
            </View>
          </View>
        </Modal>
      ) : (
        projectData.showDatePicker && (
          <DateTimePicker
            value={projectData.customDeadline}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setProjectData(prev => ({ 
                ...prev, 
                showDatePicker: false,
                deadline: selectedDate ? 'custom' : prev.deadline,
                customDeadline: selectedDate || prev.customDeadline
              }));
            }}
            minimumDate={new Date()}
          />
        )
      )}

      <Text style={styles.quickSelectTitle}>Quick Select</Text>
      {deadlineOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.deadlineOption,
            projectData.deadline === option.id && styles.selectedDeadlineOption
          ]}
          onPress={() => setProjectData(prev => ({ ...prev, deadline: option.id }))}
        >
          <Text style={[
            styles.deadlineTitle,
            projectData.deadline === option.id && styles.selectedDeadlineTitle
          ]}>
            {option.title}
          </Text>
          <Text style={[
            styles.deadlineDate,
            projectData.deadline === option.id && styles.selectedDeadlineDate
          ]}>
            {option.date}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Commission Budget</Text>
      <View style={styles.budgetContainer}>
        <View style={styles.budgetInput}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.budgetField}
            placeholder="Budget Lower Limit"
            placeholderTextColor={Colors.textDisabled}
            value={projectData.budgetMin}
            onChangeText={(text) => setProjectData(prev => ({ ...prev, budgetMin: text }))}
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.budgetSeparator}>–</Text>
        <View style={styles.budgetInput}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.budgetField}
            placeholder="Budget Upper Limit"
            placeholderTextColor={Colors.textDisabled}
            value={projectData.budgetMax}
            onChangeText={(text) => setProjectData(prev => ({ ...prev, budgetMax: text }))}
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.budgetUnit}>/piece</Text>
      </View>
    </View>
  );

  const renderRequirementsDetails = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Requirements Details</Text>
      
      <TextInput
        style={styles.titleInput}
        placeholder="Please fill in the title"
        placeholderTextColor={Colors.textDisabled}
        value={projectData.title}
        onChangeText={(text) => setProjectData(prev => ({ ...prev, title: text }))}
      />

      <TextInput
        style={styles.detailsInput}
        placeholder="Please fill in detailed requirements ▼"
        placeholderTextColor={Colors.textDisabled}
        value={projectData.detailedRequirements}
        onChangeText={(text) => setProjectData(prev => ({ ...prev, detailedRequirements: text }))}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      <View style={styles.exampleSection}>
        <View style={styles.exampleCard}>
          <Text style={styles.exampleIcon}>✅</Text>
          <Text style={styles.exampleTitle}>Correct Reference</Text>
          <Text style={styles.exampleText}>
            I want a half-body portrait of my original character.{'\n\n'}
            Hope for higher completion, prefer bright and colorful works. Please preserve original design features during creation.{'\n\n'}
            I communicate better in Chinese, feedback can be very timely!
          </Text>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleIcon}>❌</Text>
          <Text style={styles.exampleTitle}>Error Reference</Text>
          <Text style={styles.exampleText}>
            Teacher, whatever you want, no requirements, looks good is fine.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.helpButton}>
        <Text style={styles.helpText}>Don't know how to fill in requirements? Click for more help ›</Text>
      </TouchableOpacity>
    </View>
  );

  const renderReferenceImages = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Add Reference Images (Optional)</Text>
      
      <Text style={styles.sectionSubtitle}>Reference Images</Text>
      <TouchableOpacity style={styles.addCard} onPress={handleImagePicker}>
        <Text style={styles.addIcon}>+</Text>
        <Text style={styles.addText}>Add Images</Text>
      </TouchableOpacity>

      {projectData.referenceImages.length > 0 && (
        <View style={styles.imagePreview}>
          {projectData.referenceImages.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.previewImage} />
          ))}
        </View>
      )}

      <View style={styles.tipCard}>
        <Text style={styles.tipIcon}>💡</Text>
        <Text style={styles.tipTitle}>Tips</Text>
        <Text style={styles.tipText}>
          Reference images are pictures with style and type similar to your expected artwork, which can help artists quickly understand your needs.{'\n\n'}
          Projects with reference images can attract more artists to apply, improving project exposure and letting more artists see your project.{'\n\n'}
          If you haven't found suitable reference images, you can also describe your requirements directly to the artist after posting.
        </Text>
      </View>
    </View>
  );

  const renderAdvancedOptions = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Advanced Options (Optional)</Text>
      <Text style={styles.stepSubtitle}>In most cases, using default settings will meet your requirements.</Text>

      <Text style={styles.optionTitle}>What file formats do you need?</Text>
      <View style={styles.formatGrid}>
        {fileFormats.map((format) => (
          <TouchableOpacity
            key={format}
            style={[
              styles.formatButton,
              projectData.fileFormats.includes(format) && styles.selectedFormatButton
            ]}
            onPress={() => {
              setProjectData(prev => ({
                ...prev,
                fileFormats: prev.fileFormats.includes(format)
                  ? prev.fileFormats.filter(f => f !== format)
                  : [...prev.fileFormats, format]
              }));
            }}
          >
            <Text style={[
              styles.formatText,
              projectData.fileFormats.includes(format) && styles.selectedFormatText
            ]}>
              {format}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.optionTitle}>Select artist's artwork publishing rights</Text>
      {publishingRights.map((right) => (
        <TouchableOpacity
          key={right.id}
          style={[
            styles.rightsOption,
            projectData.publishingRights === right.id && styles.selectedRightsOption
          ]}
          onPress={() => setProjectData(prev => ({ ...prev, publishingRights: right.id }))}
        >
          <Text style={styles.rightsText}>{right.title}</Text>
          {projectData.publishingRights === right.id && (
            <Text style={styles.checkMark}>✓</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderReview = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Review</Text>
      
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewCategory}>📐 Graphic Design</Text>
          <Text style={styles.reviewDate}>📅 2025-07-31</Text>
          <Text style={styles.reviewBudget}>$ 52 – 22k</Text>
        </View>

        <Text style={styles.reviewSectionTitle}>Requirements Details</Text>
        <Text style={styles.reviewContent}>{projectData.title || 'Test Title'}</Text>

        <Text style={styles.reviewSectionTitle}>Artwork Requirements</Text>
        <View style={styles.reviewSpec}>
          <Text style={styles.specLabel}>Theme/Style</Text>
          <Text style={styles.specValue}>No Style Limit</Text>
        </View>
        <View style={styles.reviewSpec}>
          <Text style={styles.specLabel}>File Format</Text>
          <Text style={styles.specValue}>
            {projectData.fileFormats.length > 0 ? projectData.fileFormats.join(', ') : 'JPG, PNG'}
          </Text>
        </View>
        <View style={styles.reviewSpec}>
          <Text style={styles.specLabel}>Publishing Rights</Text>
          <Text style={styles.specValue}>Require agreement for public posting</Text>
        </View>

        <Text style={styles.reviewSectionTitle}>Project Workflow</Text>
        <Text style={styles.workflowDescription}>
          After selecting a collaborating artist, payment will be made according to the following workflow to the platform for escrow. 
          After the artist confirms guarantee payment, they should deliver artwork according to schedule for buyer review.
        </Text>

        <View style={styles.milestoneContainer}>
          {projectData.projectFlow.map((milestone, index) => (
            <View key={index} style={styles.milestoneItem}>
              <View style={[styles.milestoneCircle, milestone.percentage > 0 && styles.activeMilestoneCircle]}>
                <Text style={styles.milestonePercentage}>{milestone.percentage}%</Text>
              </View>
              <Text style={styles.milestoneStage}>{milestone.stage}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.termsContainer}
        onPress={() => setAgreedToTerms(!agreedToTerms)}
      >
        <View style={[styles.checkbox, agreedToTerms && styles.checkedCheckbox]}>
          {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.termsText}>
          I have read and agree to the <Text style={styles.termsLink}>《Project Posting Guidelines》</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderProjectTypeSelection();
      case 1: return renderCategorySelection();
      case 2: return renderDeadlineAndBudget();
      case 3: return renderRequirementsDetails();
      case 4: return renderReferenceImages();
      case 5: return renderAdvancedOptions();
      case 6: return renderReview();
      default: return renderProjectTypeSelection();
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      {/* Header - Use your Header component */}
      <Header 
        title={getStepTitle()}
        showBackButton={true}
        onBackPress={handleBack}
        rightElement={
          <TouchableOpacity style={styles.historyButton}>
            <Text style={styles.historyIcon}>🕐</Text>
            <Text style={styles.historyText}>Load History</Text>
          </TouchableOpacity>
        }
      />

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={GlobalStyles.progressBar}>
          <View style={[GlobalStyles.progressFill, { width: `${((currentStep + 1) / 7) * 100}%` }]} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStepContent()}
          <View style={GlobalStyles.bottomPadding} />
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          {currentStep === 6 ? (
            <>
              <TouchableOpacity style={GlobalStyles.secondaryButton} onPress={handleBack}>
                <Text style={GlobalStyles.secondaryButtonText}>Back to Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[GlobalStyles.primaryButton, !agreedToTerms && GlobalStyles.disabledButton]}
                onPress={handlePublish}
                disabled={!agreedToTerms}
              >
                <Text style={GlobalStyles.primaryButtonText}>Confirm Post</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next Step</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Progress
  progressContainer: {
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
  },
  
  // Layout
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
    marginBottom: Layout.spacing.xl,
  },
  stepSubtitle: {
    ...Typography.bodyMuted,
    marginBottom: Layout.spacing.xl,
  },

  // Header right element
  historyButton: {
    ...Layout.row,
  },
  historyIcon: {
    fontSize: 16,
    marginRight: Layout.spacing.xs,
  },
  historyText: {
    ...Typography.buttonSmall,
    color: Colors.primary,
  },
  
  // Project Type Selection
  typeCard: {
    ...Layout.card,
    ...Layout.row,
    marginBottom: Layout.spacing.md,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.artist,
  },
  typeIcon: {
    width: 50,
    height: 50,
    borderRadius: Layout.radius.round,
    backgroundColor: Colors.card,
    ...Layout.columnCenter,
    marginRight: Layout.spacing.lg,
  },
  iconText: {
    fontSize: 24,
  },
  typeContent: {
    flex: 1,
  },
  typeTitle: {
    ...Typography.h5,
    marginBottom: Layout.spacing.xs,
  },
  typeSubtitle: {
    ...Typography.bodyMuted,
  },
  chevron: {
    ...Typography.h5,
    color: Colors.primary,
  },
  autoSelectedNote: {
    backgroundColor: Colors.artist,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  autoSelectedText: {
    ...Typography.bodySmall,
    color: Colors.success,
    lineHeight: 20,
  },

  // Category Selection - Keep 2 rows layout
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.xxxl,
  },
  categoryCard: {
    width: '48%', // Ensure 2 columns
    ...Layout.card,
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategoryCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.artist,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: Layout.spacing.sm,
  },
  categoryTitle: {
    ...Typography.bodySmall,
    textAlign: 'center',
  },
  sectionTitle: {
    ...Typography.h4,
    marginBottom: Layout.spacing.lg,
  },
  purposeSection: {
    ...Layout.card,
    marginBottom: Layout.spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPurposeSection: {
    borderColor: Colors.primary,
    backgroundColor: Colors.artist,
  },
  purposeTitle: {
    ...Typography.h5,
    marginBottom: Layout.spacing.sm,
  },
  selectedPurposeTitle: {
    color: Colors.primary,
  },
  purposeDescription: {
    ...Typography.bodyMuted,
    lineHeight: 20,
    marginBottom: Layout.spacing.lg,
  },
  purposeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  purposeOption: {
    width: '50%',
    ...Layout.row,
    marginBottom: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.sm,
  },
  selectedPurposeOption: {
    backgroundColor: Colors.primary,
  },
  purposeIcon: {
    fontSize: 20,
    marginRight: Layout.spacing.sm,
  },
  purposeText: {
    ...Typography.bodySmall,
  },
  selectedPurposeText: {
    color: Colors.text,
    fontWeight: 'bold',
  },

  // Deadline and Budget
  customDateSelector: {
    ...Layout.card,
    marginBottom: Layout.spacing.xl,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCustomDateSelector: {
    borderColor: Colors.primary,
    backgroundColor: Colors.artist,
  },
  customDateText: {
    ...Typography.body,
    color: Colors.textDisabled,
  },
  selectedDateText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  
  // Date Picker Modal
  datePickerModal: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Layout.radius.xl,
    borderTopRightRadius: Layout.radius.xl,
    paddingTop: Layout.spacing.xl,
  },
  datePickerHeader: {
    ...Layout.rowSpaceBetween,
    paddingHorizontal: Layout.spacing.xl,
    paddingBottom: Layout.spacing.xl,
    ...Layout.borderBottom,
  },
  datePickerButton: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  confirmButton: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  
  quickSelectTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.lg,
  },
  deadlineOption: {
    ...Layout.card,
    ...Layout.rowSpaceBetween,
    marginBottom: Layout.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDeadlineOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.artist,
  },
  deadlineTitle: {
    ...Typography.body,
    fontWeight: 'bold',
  },
  selectedDeadlineTitle: {
    color: Colors.primary,
  },
  deadlineDate: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  selectedDeadlineDate: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  
  budgetContainer: {
    ...Layout.row,
    marginTop: Layout.spacing.lg,
  },
  budgetInput: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.sm,
    ...Layout.row,
    paddingHorizontal: Layout.spacing.md,
    flex: 1,
  },
  currencySymbol: {
    ...Typography.body,
    color: Colors.secondary,
    marginRight: Layout.spacing.sm,
  },
  budgetField: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    paddingVertical: Layout.spacing.md,
  },
  budgetSeparator: {
    ...Typography.body,
    marginHorizontal: Layout.spacing.md,
  },
  budgetUnit: {
    ...Typography.body,
    color: Colors.textMuted,
    marginLeft: Layout.spacing.sm,
  },

  // Requirements Details
  titleInput: {
    ...GlobalStyles.input,
    marginBottom: Layout.spacing.lg,
  },
  detailsInput: {
    ...GlobalStyles.input,
    minHeight: 120,
    marginBottom: Layout.spacing.xl,
  },
  exampleSection: {
    marginBottom: Layout.spacing.xl,
  },
  exampleCard: {
    ...Layout.card,
    marginBottom: Layout.spacing.md,
  },
  exampleIcon: {
    fontSize: 20,
    marginBottom: Layout.spacing.sm,
  },
  exampleTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.sm,
  },
  exampleText: {
    ...Typography.bodyMuted,
    lineHeight: 20,
  },
  helpButton: {
    paddingVertical: Layout.spacing.lg,
  },
  helpText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    textAlign: 'center',
  },

  // Reference Images
  sectionSubtitle: {
    ...Typography.h5,
    marginBottom: Layout.spacing.md,
    marginTop: Layout.spacing.xl,
  },
  addCard: {
    ...Layout.card,
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  addIcon: {
    fontSize: 32,
    color: Colors.primary,
    marginBottom: Layout.spacing.sm,
  },
  addText: {
    ...Typography.body,
    color: Colors.primary,
  },
  imagePreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Layout.spacing.lg,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: Layout.radius.sm,
    margin: Layout.spacing.xs,
  },
  tipCard: {
    backgroundColor: Colors.artist,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
  },
  tipIcon: {
    fontSize: 20,
    marginBottom: Layout.spacing.sm,
  },
  tipTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.sm,
  },
  tipText: {
    ...Typography.bodyMuted,
    lineHeight: 20,
  },

  // Advanced Options
  optionTitle: {
    ...Typography.h5,
    marginBottom: Layout.spacing.lg,
    marginTop: Layout.spacing.xl,
  },
  formatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Layout.spacing.xxxl,
  },
  formatButton: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.sm,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    margin: Layout.spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedFormatButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  formatText: {
    ...Typography.bodySmall,
  },
  selectedFormatText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  rightsOption: {
    ...Layout.card,
    ...Layout.rowSpaceBetween,
    marginBottom: Layout.spacing.sm,
  },
  selectedRightsOption: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  rightsText: {
    ...Typography.body,
    flex: 1,
  },
  checkMark: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: 'bold',
  },

  // Review
  reviewCard: {
    ...Layout.card,
    marginBottom: Layout.spacing.xl,
  },
  reviewHeader: {
    ...Layout.rowSpaceBetween,
    marginBottom: Layout.spacing.xl,
    flexWrap: 'wrap',
  },
  reviewCategory: {
    ...Typography.bodySmall,
    backgroundColor: Colors.card,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.sm,
    marginRight: Layout.spacing.sm,
    marginBottom: Layout.spacing.xs,
  },
  reviewDate: {
    ...Typography.bodySmall,
    backgroundColor: Colors.card,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.sm,
    marginRight: Layout.spacing.sm,
    marginBottom: Layout.spacing.xs,
  },
  reviewBudget: {
    ...Typography.price,
  },
  reviewSectionTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.md,
    marginTop: Layout.spacing.lg,
  },
  reviewContent: {
    ...Typography.bodyMuted,
    marginBottom: Layout.spacing.lg,
  },
  reviewSpec: {
    ...Layout.rowSpaceBetween,
    marginBottom: Layout.spacing.sm,
  },
  specLabel: {
    ...Typography.bodyMuted,
    flex: 1,
  },
  specValue: {
    ...Typography.bodySmall,
    flex: 2,
    textAlign: 'right',
  },
  workflowDescription: {
    ...Typography.bodyMuted,
    lineHeight: 20,
    marginBottom: Layout.spacing.lg,
  },
  milestoneContainer: {
    ...Layout.rowSpaceBetween,
    marginTop: Layout.spacing.lg,
  },
  milestoneItem: {
    alignItems: 'center',
    flex: 1,
  },
  milestoneCircle: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.border,
    ...Layout.columnCenter,
    marginBottom: Layout.spacing.sm,
  },
  activeMilestoneCircle: {
    backgroundColor: Colors.primary,
  },
  milestonePercentage: {
    ...Typography.badge,
    fontSize: 12,
  },
  milestoneStage: {
    ...Typography.caption,
    textAlign: 'center',
  },
  termsContainer: {
    ...Layout.row,
    paddingVertical: Layout.spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: Layout.radius.xs,
    borderWidth: 2,
    borderColor: Colors.textDisabled,
    marginRight: Layout.spacing.md,
    ...Layout.columnCenter,
  },
  checkedCheckbox: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    ...Typography.badge,
    fontSize: 12,
  },
  termsText: {
    ...Typography.bodyMuted,
    flex: 1,
  },
  termsLink: {
    color: Colors.primary,
  },

  // Bottom Buttons
  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
    backgroundColor: Colors.background,
    ...Layout.borderTop,
  },
  nextButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: Layout.radius.md,
    paddingVertical: Layout.spacing.lg,
    alignItems: 'center',
  },
  nextButtonText: {
    ...Typography.button,
  },
});

export default PostProjectPage;