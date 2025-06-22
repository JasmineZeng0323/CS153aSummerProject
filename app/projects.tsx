import React, { useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const ProjectsPage = () => {
  const [activeTab, setActiveTab] = useState('Projects');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    verified: false,
    unclaimed: false,
    character: false
  });

  // Mock data for projects
  const projectItems = [
    {
      id: 1,
      title: 'Long-term OC Project!',
      description: 'Free OC contract work, any style accepted! Please specify clearly...',
      budget: '$200-500',
      deadline: '2025-12-31',
      clientName: 'Anonymous Client',
      clientAvatar: 'https://i.pravatar.cc/60?img=1',
      isVerified: true,
      isHighQuality: true,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
      tags: ['Real Name Verified', 'High Quality']
    },
    {
      id: 2,
      title: 'This is a long-term dream project',
      description: 'Any business type is welcome! Illustration business must have samples...',
      budget: '$52-52k',
      deadline: '2025-12-31',
      clientName: 'Dream Seeker',
      clientAvatar: 'https://i.pravatar.cc/60?img=2',
      isVerified: true,
      isHighQuality: true,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
      tags: ['Real Name Verified', 'High Quality']
    },
    {
      id: 3,
      title: 'Anything goes!',
      description: 'Any business type accepted 🍺＞∪＜🍺 Please specify art style clearly...',
      budget: '$50-200',
      deadline: '2025-08-31',
      clientName: 'Art Lover',
      clientAvatar: 'https://i.pravatar.cc/60?img=3',
      isVerified: false,
      isHighQuality: false,
      image: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=200&h=200&fit=crop',
      tags: []
    },
    {
      id: 4,
      title: '💜 Birthday invitation from a fox 💜',
      description: '💜 Want to prepare a birthday gift in advance 💜 Thank you for every...',
      budget: '$52-10k',
      deadline: '2026-04-30',
      clientName: 'Fox Birthday',
      clientAvatar: 'https://i.pravatar.cc/60?img=4',
      isVerified: true,
      isHighQuality: true,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
      tags: ['Real Name Verified', 'High Quality']
    }
  ];

  const toggleFilter = (filterKey: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Projects</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Verification Status</Text>
            <TouchableOpacity
              style={[styles.filterOption, selectedFilters.verified && styles.selectedFilter]}
              onPress={() => toggleFilter('verified')}
            >
              <View style={styles.filterOptionLeft}>
                <Text style={styles.filterIcon}>🏢</Text>
                <Text style={styles.filterText}>Verified Clients Only</Text>
              </View>
              <View style={[styles.checkbox, selectedFilters.verified && styles.checkboxSelected]} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Project Status</Text>
            <TouchableOpacity
              style={[styles.filterOption, selectedFilters.unclaimed && styles.selectedFilter]}
              onPress={() => toggleFilter('unclaimed')}
            >
              <View style={styles.filterOptionLeft}>
                <Text style={styles.filterIcon}>✅</Text>
                <Text style={styles.filterText}>Unclaimed Only</Text>
              </View>
              <View style={[styles.checkbox, selectedFilters.unclaimed && styles.checkboxSelected]} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Content Type</Text>
            <TouchableOpacity
              style={[styles.filterOption, selectedFilters.character && styles.selectedFilter]}
              onPress={() => toggleFilter('character')}
            >
              <View style={styles.filterOptionLeft}>
                <Text style={styles.filterIcon}>👤</Text>
                <Text style={styles.filterText}>Character Design</Text>
              </View>
              <View style={[styles.checkbox, selectedFilters.character && styles.checkboxSelected]} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => setSelectedFilters({ verified: false, unclaimed: false, character: false })}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderProjectItem = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <View style={styles.projectInfo}>
          <Text style={styles.projectTitle}>{item.title}</Text>
          <Text style={styles.projectDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          {/* Tags */}
          {item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.projectDetails}>
            <Text style={styles.budget}>{item.budget}</Text>
            <Text style={styles.deadline}>{item.deadline} Deadline</Text>
          </View>
        </View>
        
        <View style={styles.projectImageContainer}>
          <Image source={{ uri: item.image }} style={styles.projectImage} />
          <View style={styles.projectActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📋</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTabs}>
          <TouchableOpacity
            style={[styles.headerTab, activeTab === 'Gallery' && styles.activeHeaderTab]}
            onPress={() => setActiveTab('Gallery')}
          >
            <Text style={[styles.headerTabText, activeTab === 'Gallery' && styles.activeHeaderTabText]}>
              Gallery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerTab, activeTab === 'Projects' && styles.activeHeaderTab]}
            onPress={() => setActiveTab('Projects')}
          >
            <Text style={[styles.headerTabText, activeTab === 'Projects' && styles.activeHeaderTabText]}>
              Projects
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.betaTab}>
            <Text style={styles.betaText}>Character</Text>
            <View style={styles.betaBadge}>
              <Text style={styles.betaBadgeText}>Beta</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilters.verified && styles.activeFilterButton]}
          onPress={() => toggleFilter('verified')}
        >
          <Text style={styles.filterIcon}>🏢</Text>
          <Text style={[styles.filterButtonText, selectedFilters.verified && styles.activeFilterText]}>
            Verified Only
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, selectedFilters.unclaimed && styles.activeFilterButton]}
          onPress={() => toggleFilter('unclaimed')}
        >
          <Text style={styles.filterIcon}>✅</Text>
          <Text style={[styles.filterButtonText, selectedFilters.unclaimed && styles.activeFilterText]}>
            Unclaimed Only
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, selectedFilters.character && styles.activeFilterButton]}
          onPress={() => toggleFilter('character')}
        >
          <Text style={styles.filterIcon}>👤</Text>
          <Text style={[styles.filterButtonText, selectedFilters.character && styles.activeFilterText]}>
            Character
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.moreFiltersButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterIcon}>🔽</Text>
        </TouchableOpacity>
      </View>

      {/* Projects List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.projectsList}>
          {projectItems.map((item) => renderProjectItem(item))}
        </View>
        <View style={styles.bottomPadding} />
      </ScrollView>

      <FilterModal />
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTabs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  activeHeaderTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00A8FF',
  },
  headerTabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
  },
  activeHeaderTabText: {
    color: '#FFFFFF',
  },
  betaTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  betaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    marginRight: 8,
  },
  betaBadge: {
    backgroundColor: '#00A8FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  betaBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00A8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#1A1A1A',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchPlaceholder: {
    color: '#666',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#00A8FF',
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  moreFiltersButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  projectsList: {
    paddingHorizontal: 24,
  },
  projectCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  projectHeader: {
    flexDirection: 'row',
  },
  projectInfo: {
    flex: 1,
    marginRight: 16,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#00A8FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  projectDetails: {
    flexDirection: 'column',
  },
  budget: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  deadline: {
    fontSize: 14,
    color: '#888',
  },
  projectImageContainer: {
    position: 'relative',
  },
  projectImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  projectActions: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
  },
  bottomPadding: {
    height: 100,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0A0A0A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    fontSize: 20,
    color: '#888',
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    marginBottom: 8,
  },
  selectedFilter: {
    backgroundColor: '#2A2A3A',
  },
  filterOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filterText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#666',
  },
  checkboxSelected: {
    backgroundColor: '#00A8FF',
    borderColor: '#00A8FF',
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#00A8FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProjectsPage;