import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import EmptyState from './components/common/EmptyState';
import Header from './components/common/Header';
import LoadingState from './components/common/LoadingState';
import { Colors } from './components/styles/Colors';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

// Unified container style
const AppStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 0,
  },
  header: {
    paddingTop: 50, // Status bar height
  },
};

const { width: screenWidth } = Dimensions.get('window');

interface Draft {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  thumbnail: string;
  tags: string[];
  isShared: boolean;
  downloadCount: number;
  fileCount?: number;
}

const MyDraftsPage = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      // Simulate loading drafts from cloud storage
      const mockDrafts: Draft[] = [
        {
          id: 1,
          name: 'Character Design v3.psd',
          type: 'PSD File',
          size: '24.5 MB',
          lastModified: '2025-06-20',
          thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
          tags: ['Character', 'Original'],
          isShared: false,
          downloadCount: 0
        },
        {
          id: 2,
          name: 'Portrait Sketch.png',
          type: 'PNG File',
          size: '8.2 MB',
          lastModified: '2025-06-18',
          thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
          tags: ['Portrait', 'Sketch'],
          isShared: true,
          downloadCount: 15
        },
        {
          id: 3,
          name: 'Fantasy Landscape.jpg',
          type: 'JPG File',
          size: '12.8 MB',
          lastModified: '2025-06-15',
          thumbnail: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=200&h=200&fit=crop',
          tags: ['Landscape', 'Fantasy'],
          isShared: false,
          downloadCount: 0
        },
        {
          id: 4,
          name: 'Anime Style Collection',
          type: 'Folder',
          size: '156.2 MB',
          lastModified: '2025-06-12',
          thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
          tags: ['Anime', 'Collection'],
          isShared: true,
          downloadCount: 47,
          fileCount: 12
        },
        {
          id: 5,
          name: 'Commission Draft 001.ai',
          type: 'AI File',
          size: '32.1 MB',
          lastModified: '2025-06-10',
          thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop',
          tags: ['Commission', 'Vector'],
          isShared: false,
          downloadCount: 0
        }
      ];

      setDrafts(mockDrafts);
    } catch (error) {
      console.error('Error loading drafts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDrafts();
    setRefreshing(false);
  };

  const handleDraftPress = (draft: Draft) => {
    setSelectedDraft(draft);
    setShowPreviewModal(true);
  };

  const handleDownload = (draft: Draft) => {
    Alert.alert(
      'Download Draft',
      `Download "${draft.name}" to your device?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Download', 
          onPress: () => {
            console.log('Downloading:', draft.name);
            Alert.alert('Download Started', `${draft.name} is being downloaded...`);
          }
        }
      ]
    );
  };

  const handleShare = (draft: Draft) => {
    Alert.alert(
      'Share Draft',
      `Share "${draft.name}" with others?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Share', 
          onPress: () => {
            console.log('Sharing:', draft.name);
            Alert.alert('Share Link Created', 'Draft link copied to clipboard!');
          }
        }
      ]
    );
  };

  const handleDelete = (draft: Draft) => {
    Alert.alert(
      'Delete Draft',
      `Are you sure you want to delete "${draft.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setDrafts(prev => prev.filter(d => d.id !== draft.id));
            setShowPreviewModal(false);
            Alert.alert('Deleted', 'Draft has been deleted.');
          }
        }
      ]
    );
  };

  const getSortedDrafts = (): Draft[] => {
    const sortedDrafts = [...drafts];
    switch (sortBy) {
      case 'name':
        return sortedDrafts.sort((a, b) => a.name.localeCompare(b.name));
      case 'size':
        return sortedDrafts.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
      case 'date':
      default:
        return sortedDrafts.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    }
  };

  const getFileIcon = (type: string): string => {
    if (type === 'Folder') return '📁';
    if (type.includes('PSD')) return '🎨';
    if (type.includes('AI')) return '✏️';
    if (type.includes('PNG') || type.includes('JPG')) return '🖼️';
    return '📄';
  };

  const getTotalSize = (): string => {
    const totalMB = drafts.reduce((total, draft) => {
      return total + parseFloat(draft.size.replace(' MB', ''));
    }, 0);
    return totalMB > 1024 ? `${(totalMB / 1024).toFixed(1)} GB` : `${totalMB.toFixed(1)} MB`;
  };

  // Render storage info
  const renderStorageInfo = () => (
    <View style={styles.storageInfo}>
      <View style={styles.storageStats}>
        <Text style={styles.storageTitle}>Cloud Storage</Text>
        <Text style={styles.storageUsage}>{getTotalSize()} used • {drafts.length} items</Text>
      </View>
      <TouchableOpacity style={styles.manageButton}>
        <Text style={styles.manageButtonText}>Manage</Text>
      </TouchableOpacity>
    </View>
  );

  // Render sort options
  const renderSortOptions = () => (
    <View style={styles.sortContainer}>
      <Text style={styles.sortLabel}>Sort by:</Text>
      {(['date', 'name', 'size'] as const).map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.sortButton, sortBy === option && styles.activeSortButton]}
          onPress={() => setSortBy(option)}
        >
          <Text style={[styles.sortButtonText, sortBy === option && styles.activeSortButtonText]}>
            {option === 'date' ? 'Date' : option === 'name' ? 'Name' : 'Size'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Render draft item
  const renderDraft = (draft: Draft) => (
    <TouchableOpacity 
      key={draft.id} 
      style={styles.draftItem}
      onPress={() => handleDraftPress(draft)}
    >
      <View style={styles.draftThumbnail}>
        <Image source={{ uri: draft.thumbnail }} style={styles.thumbnailImage} />
        <View style={styles.fileTypeOverlay}>
          <Text style={styles.fileIcon}>{getFileIcon(draft.type)}</Text>
        </View>
        {draft.isShared && (
          <View style={styles.sharedBadge}>
            <Text style={styles.sharedIcon}>🔗</Text>
          </View>
        )}
      </View>
      
      <View style={styles.draftInfo}>
        <Text style={styles.draftName} numberOfLines={2}>{draft.name}</Text>
        <Text style={styles.draftType}>{draft.type}</Text>
        <View style={styles.draftMeta}>
          <Text style={styles.draftSize}>{draft.size}</Text>
          <Text style={styles.draftDate}>{draft.lastModified}</Text>
        </View>
        
        {draft.tags && (
          <View style={styles.tagsContainer}>
            {draft.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        
        {draft.downloadCount > 0 && (
          <Text style={styles.downloadCount}>📥 {draft.downloadCount} downloads</Text>
        )}
        
        {draft.fileCount && (
          <Text style={styles.fileCount}>📂 {draft.fileCount} files</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render preview modal
  const renderPreviewModal = () => (
    <Modal
      visible={showPreviewModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowPreviewModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.previewModal}>
          {selectedDraft && (
            <>
              <View style={styles.previewHeader}>
                <Text style={styles.previewTitle}>{selectedDraft.name}</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowPreviewModal(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.previewContent}>
                <Image 
                  source={{ uri: selectedDraft.thumbnail }} 
                  style={styles.previewImage} 
                  resizeMode="contain"
                />
                
                <View style={styles.previewDetails}>
                  <Text style={styles.previewDetailText}>Type: {selectedDraft.type}</Text>
                  <Text style={styles.previewDetailText}>Size: {selectedDraft.size}</Text>
                  <Text style={styles.previewDetailText}>Modified: {selectedDraft.lastModified}</Text>
                  {selectedDraft.downloadCount > 0 && (
                    <Text style={styles.previewDetailText}>Downloads: {selectedDraft.downloadCount}</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.previewActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDownload(selectedDraft)}
                >
                  <Text style={styles.actionButtonText}>📥 Download</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleShare(selectedDraft)}
                >
                  <Text style={styles.actionButtonText}>🔗 Share</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(selectedDraft)}
                >
                  <Text style={[styles.actionButtonText, styles.deleteButtonText]}>🗑️ Delete</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  // Render empty state
  const renderEmptyState = () => (
    <EmptyState
      icon="☁️"
      title="No drafts yet"
      description="Your artwork drafts will appear here when you upload them to cloud storage."
      buttonText="Upload First Draft"
      onButtonPress={() => console.log('Upload draft')}
    />
  );

  if (isLoading) {
    return (
      <View style={AppStyles.container}>
        <Header 
          title="My Drafts" 
          showBackButton={true}
          style={AppStyles.header}
          rightElement={
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadIcon}>☁️</Text>
            </TouchableOpacity>
          }
        />
        <LoadingState text="Loading your drafts..." />
      </View>
    );
  }

  return (
    <View style={AppStyles.container}>
      {/* Header */}
      <Header 
        title="My Drafts" 
        showBackButton={true}
        style={AppStyles.header}
        rightElement={
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadIcon}>☁️</Text>
          </TouchableOpacity>
        }
      />

      {/* Storage Info */}
      {renderStorageInfo()}

      {/* Sort Options */}
      {renderSortOptions()}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {drafts.length > 0 ? (
          <View style={styles.draftsList}>
            {getSortedDrafts().map((draft) => renderDraft(draft))}
          </View>
        ) : (
          renderEmptyState()
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {renderPreviewModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  // Upload button
  uploadButton: {
    width: 40,
    height: 40,
    ...Layout.columnCenter,
  },
  uploadIcon: {
    fontSize: 20,
  },
  
  // Storage Info
  storageInfo: {
    ...Layout.rowSpaceBetween,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
    backgroundColor: Colors.surface,
    marginHorizontal: Layout.spacing.xl,
    marginVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
  },
  storageStats: {
    flex: 1,
  },
  storageTitle: {
    ...Typography.h6,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  storageUsage: {
    ...Typography.bodySmallMuted,
  },
  manageButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.xl,
  },
  manageButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
  },
  
  // Sort Options
  sortContainer: {
    ...Layout.row,
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  sortLabel: {
    ...Typography.bodySmallMuted,
    marginRight: Layout.spacing.lg,
  },
  sortButton: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.surface,
    marginRight: Layout.spacing.sm,
  },
  activeSortButton: {
    backgroundColor: Colors.primary,
  },
  sortButtonText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  activeSortButtonText: {
    color: Colors.text,
    fontWeight: 'bold',
  },

  // Content
  content: {
    flex: 1,
  },
  draftsList: {
    paddingHorizontal: Layout.spacing.xl,
  },
  
  // Draft Item
  draftItem: {
    ...Layout.card,
    ...Layout.row,
    marginBottom: Layout.spacing.md,
  },
  draftThumbnail: {
    position: 'relative',
    marginRight: Layout.spacing.lg,
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    borderRadius: Layout.radius.sm,
  },
  fileTypeOverlay: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: Colors.blackTransparent,
    borderRadius: Layout.radius.md,
    padding: 4,
  },
  fileIcon: {
    fontSize: 16,
  },
  sharedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.primary,
    borderRadius: Layout.radius.md,
    padding: 4,
  },
  sharedIcon: {
    fontSize: 12,
  },
  draftInfo: {
    flex: 1,
  },
  draftName: {
    ...Typography.h6,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
    lineHeight: 20,
  },
  draftType: {
    ...Typography.caption,
    color: Colors.primary,
    marginBottom: Layout.spacing.sm,
  },
  draftMeta: {
    ...Layout.rowSpaceBetween,
    marginBottom: Layout.spacing.sm,
  },
  draftSize: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  draftDate: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Layout.spacing.sm,
  },
  tag: {
    backgroundColor: Colors.card,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: Layout.radius.sm,
    marginRight: Layout.spacing.sm,
    marginBottom: Layout.spacing.xs,
  },
  tagText: {
    ...Typography.badge,
    fontSize: 10,
  },
  downloadCount: {
    ...Typography.caption,
    color: Colors.success,
    marginBottom: 2,
  },
  fileCount: {
    ...Typography.caption,
    color: Colors.warning,
  },

  // Modal
  modalOverlay: {
    ...Layout.modalOverlay,
  },
  previewModal: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.lg,
    width: screenWidth * 0.9,
    maxHeight: '80%',
  },
  previewHeader: {
    ...Layout.rowSpaceBetween,
    padding: Layout.spacing.xl,
    ...Layout.borderBottom,
  },
  previewTitle: {
    ...Typography.h5,
    color: Colors.text,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.card,
    ...Layout.columnCenter,
  },
  closeButtonText: {
    ...Typography.h6,
    color: Colors.text,
  },
  previewContent: {
    padding: Layout.spacing.xl,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: Layout.radius.md,
    marginBottom: Layout.spacing.lg,
  },
  previewDetails: {
    marginBottom: Layout.spacing.lg,
  },
  previewDetailText: {
    ...Typography.bodySmallMuted,
    marginBottom: Layout.spacing.xs,
  },
  previewActions: {
    ...Layout.row,
    padding: Layout.spacing.xl,
    ...Layout.borderTop,
    gap: Layout.spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.sm,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: Colors.error,
  },
  actionButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
  },
  deleteButtonText: {
    color: Colors.text,
  },

  bottomPadding: {
    height: Layout.spacing.xxxl,
  },
});

export default MyDraftsPage;