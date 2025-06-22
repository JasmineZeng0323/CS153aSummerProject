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

const { width: screenWidth } = Dimensions.get('window');

const PostProjectPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState({
    // Step 1: Project Type Selection
    projectType: 'project', // Auto-select since only one option
    
    // Step 2: Project Category
    category: '',
    purpose: '', // 'personal' or 'commercial'
    purposeOption: '', // specific purpose option selected
    
    // Step 3: Deadline & Budget
    deadline: '',
    customDeadline: new Date(),
    showDatePicker: false,
    budgetMin: '',
    budgetMax: '',
    
    // Step 4: Requirements Details
    title: '',
    detailedRequirements: '',
    
    // Step 5: Reference Images (skipping contact cards as requested)
    referenceImages: [],
    
    // Step 6: Advanced Options
    fileFormats: [],
    publishingRights: 'requireAgreement',
    
    // Final: Review
    projectFlow: [
      { stage: 'Deposit Payment', percentage: 0 },
      { stage: 'Draft', percentage: 20 },
      { stage: 'Line Art', percentage: 30 },
      { stage: 'Coloring', percentage: 60 },
      { stage: 'Final Artwork', percentage: 100 }
    ]
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Project type options from image 1 - Only keep Post Project
  const projectTypes = [
    { id: 'project', title: 'Post Project', subtitle: 'More customizable commission method', icon: '📋' }
  ];

  // Category options from image 2
  const categories = [
    { id: 'oc', title: 'Original/OC', icon: '🎨' },
    { id: 'portrait', title: 'Portrait', icon: '👤' },
    { id: 'fanart', title: 'Fan Art', icon: '🎭' },
    { id: 'live2d', title: 'Live2D', icon: '🎬' },
    { id: 'illustration', title: 'Illustration', icon: '🖼️' },
    { id: 'design', title: 'Graphic Design', icon: '📐' },
    { id: 'other', title: 'Other - None of the above types I need', icon: '🔄' }
  ];

  // Purpose options from image 2
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

  // Deadline options from image 3
  const deadlineOptions = [
    { id: '7days', title: '7 Days', date: '2025-06-29' },
    { id: '14days', title: '14 Days', date: '2025-07-09' },
    { id: '30days', title: '30 Days', date: '2025-07-22' },
    { id: 'month_end', title: 'End of This Month', date: '2025-06-30' },
    { id: 'next_month', title: 'End of Next Month', date: '2025-07-31' }
  ];

  // Get display text for deadline selector
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

  // File format options from image 6
  const fileFormats = [
    'JPG', 'PNG', 'PSD', 'AI', 'SVG', 'TIF', 'GIF', 'Other'
  ];

  // Publishing rights options from image 6
  const publishingRights = [
    { id: 'free', title: 'Artist can publish freely' },
    { id: 'requireAgreement', title: 'Require agreement for public posting' },
    { id: 'noPublish', title: 'Cannot be published publicly' }
  ];

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
    
    // Here you would normally send the data to your API
    console.log('Publishing project:', projectData);
    alert('Project posted successfully!');
    router.back();
  };

  const renderProjectTypeSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Project Type</Text>
      
      {/* Auto-selected Post Project */}
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
            placeholderTextColor="#666"
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
            placeholderTextColor="#666"
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
        placeholderTextColor="#666"
        value={projectData.title}
        onChangeText={(text) => setProjectData(prev => ({ ...prev, title: text }))}
      />

      <TextInput
        style={styles.detailsInput}
        placeholder="Please fill in detailed requirements ▼"
        placeholderTextColor="#666"
        value={projectData.detailedRequirements}
        onChangeText={(text) => setProjectData(prev => ({ ...prev, detailedRequirements: text }))}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      {/* Example references */}
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getStepTitle()}</Text>
        <TouchableOpacity style={styles.historyButton}>
          <Text style={styles.historyIcon}>🕐</Text>
          <Text style={styles.historyText}>Load History</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentStep + 1) / 7) * 100}%` }]} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStepContent()}
          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          {currentStep === 6 ? (
            <>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
                <Text style={styles.secondaryButtonText}>Back to Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.primaryButton, !agreedToTerms && styles.disabledButton]}
                onPress={handlePublish}
                disabled={!agreedToTerms}
              >
                <Text style={styles.primaryButtonText}>Confirm Post</Text>
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
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  historyText: {
    fontSize: 14,
    color: '#00A8FF',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1A1A1A',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00A8FF',
    borderRadius: 2,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  
  // Project Type Selection
  typeCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#00A8FF',
    backgroundColor: '#1A2A3A',
  },
  typeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  typeContent: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  typeSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  chevron: {
    fontSize: 20,
    color: '#00A8FF',
    fontWeight: 'bold',
  },
  autoSelectedNote: {
    backgroundColor: '#1A3A1A',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  autoSelectedText: {
    fontSize: 14,
    color: '#4CAF50',
    lineHeight: 20,
  },

  // Category Selection
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  categoryCard: {
    width: (screenWidth - 60) / 2,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    margin: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedCategoryCard: {
    borderColor: '#00A8FF',
    backgroundColor: '#1A2A3A',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  purposeSection: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPurposeSection: {
    borderColor: '#00A8FF',
    backgroundColor: '#1A2A3A',
  },
  purposeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  selectedPurposeTitle: {
    color: '#00A8FF',
  },
  purposeDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    marginBottom: 16,
  },
  purposeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  purposeOption: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectedPurposeOption: {
    backgroundColor: '#00A8FF',
  },
  purposeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  purposeText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  selectedPurposeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Deadline and Budget
  customDateSelector: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCustomDateSelector: {
    borderColor: '#00A8FF',
    backgroundColor: '#1A2A3A',
  },
  customDateText: {
    color: '#666',
    fontSize: 16,
  },
  selectedDateText: {
    color: '#00A8FF',
    fontWeight: 'bold',
  },
  // Date Picker Modal Styles
  datePickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  datePickerButton: {
    fontSize: 16,
    color: '#888',
  },
  confirmButton: {
    color: '#00A8FF',
    fontWeight: 'bold',
  },
  quickSelectTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  deadlineOption: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDeadlineOption: {
    borderColor: '#00A8FF',
    backgroundColor: '#1A2A3A',
  },
  deadlineTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectedDeadlineTitle: {
    color: '#00A8FF',
  },
  deadlineDate: {
    fontSize: 14,
    color: '#888',
  },
  selectedDeadlineDate: {
    color: '#00A8FF',
    fontWeight: 'bold',
  },
  quickSelectTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  deadlineOption: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedDeadlineOption: {
    borderWidth: 2,
    borderColor: '#00A8FF',
  },
  deadlineTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  deadlineDate: {
    fontSize: 14,
    color: '#888',
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  budgetInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    flex: 1,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#FF6B35',
    marginRight: 8,
  },
  budgetField: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 12,
  },
  budgetSeparator: {
    fontSize: 16,
    color: '#FFFFFF',
    marginHorizontal: 12,
  },
  budgetUnit: {
    fontSize: 16,
    color: '#888',
    marginLeft: 8,
  },

  // Requirements Details
  titleInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  detailsInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
    minHeight: 120,
  },
  exampleSection: {
    marginBottom: 20,
  },
  exampleCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exampleIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  helpButton: {
    paddingVertical: 16,
  },
  helpText: {
    fontSize: 14,
    color: '#00A8FF',
    textAlign: 'center',
  },

  // Reference Images
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 20,
  },
  addCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#333',
  },
  addIcon: {
    fontSize: 32,
    color: '#00A8FF',
    marginBottom: 8,
  },
  addText: {
    fontSize: 16,
    color: '#00A8FF',
  },
  imagePreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 4,
  },
  tipCard: {
    backgroundColor: '#1A2A3A',
    borderRadius: 12,
    padding: 16,
  },
  tipIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },

  // Advanced Options
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    marginTop: 20,
  },
  formatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  formatButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedFormatButton: {
    backgroundColor: '#00A8FF',
    borderColor: '#00A8FF',
  },
  formatText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  selectedFormatText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  rightsOption: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedRightsOption: {
    borderWidth: 2,
    borderColor: '#00A8FF',
  },
  rightsText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  checkMark: {
    fontSize: 16,
    color: '#00A8FF',
    fontWeight: 'bold',
  },

  // Review
  reviewCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  reviewCategory: {
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  reviewBudget: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 16,
  },
  reviewContent: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 16,
  },
  reviewSpec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 14,
    color: '#888',
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 2,
    textAlign: 'right',
  },
  workflowDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    marginBottom: 16,
  },
  milestoneContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  milestoneItem: {
    alignItems: 'center',
    flex: 1,
  },
  milestoneCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeMilestoneCircle: {
    backgroundColor: '#00A8FF',
  },
  milestonePercentage: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  milestoneStage: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
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
  checkedCheckbox: {
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
    flex: 1,
  },
  termsLink: {
    color: '#00A8FF',
  },

  // Bottom Buttons
  bottomPadding: {
    height: 20,
  },
  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#00A8FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#00A8FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#333',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PostProjectPage;