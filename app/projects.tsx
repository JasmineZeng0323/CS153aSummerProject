import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Import your component library
import ProjectCard from './components/common/ProjectCard';
import StatusBadge from './components/common/StatusBadge';
import FilterModal, { FilterSection } from './components/forms/FilterModal';
import { Colors } from './components/styles/Colors';
import GlobalStyles from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

const ProjectsPage = () => {
  const [activeTab, setActiveTab] = useState('Projects');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    contentType: [],
    budgetRange: [],
    clientStatus: [],
    projectStatus: []
  });

  // Mock data for projects with recruiting status
  const allProjectItems = [
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
      tags: ['Real Name Verified', 'High Quality'],
      contentType: 'character',
      budgetRange: '100-500',
      isClaimed: false,
      isUrgent: false,
      isRecruiting: true // 招募中
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
      tags: ['Real Name Verified', 'High Quality'],
      contentType: 'illustration',
      budgetRange: 'over5000',
      isClaimed: false,
      isUrgent: false,
      isRecruiting: true // 招募中
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
      tags: [],
      contentType: 'portrait',
      budgetRange: 'under100',
      isClaimed: true,
      isUrgent: true,
      isRecruiting: false // 招募关闭 - 不会显示在列表中
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
      tags: ['Real Name Verified', 'High Quality'],
      contentType: 'character',
      budgetRange: '1000-5000',
      isClaimed: false,
      isUrgent: false,
      isRecruiting: true // 招募中
    },
    {
      id: 5,
      title: 'Game Character Design',
      description: 'Looking for talented artist to create game characters...',
      budget: '$800-1200',
      deadline: '2025-09-15',
      clientName: 'GameDev Studio',
      clientAvatar: 'https://i.pravatar.cc/60?img=5',
      isVerified: true,
      isHighQuality: true,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop',
      tags: ['Real Name Verified', 'High Quality'],
      contentType: 'gameArt',
      budgetRange: '500-1000',
      isClaimed: false,
      isUrgent: true,
      isRecruiting: true // 招募中
    },
    {
      id: 6,
      title: 'Logo Design for Startup',
      description: 'Modern logo design needed for tech startup company...',
      budget: '$150-300',
      deadline: '2025-07-20',
      clientName: 'StartupCo',
      clientAvatar: 'https://i.pravatar.cc/60?img=6',
      isVerified: false,
      isHighQuality: false,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
      tags: [],
      contentType: 'logo',
      budgetRange: '100-500',
      isClaimed: true,
      isUrgent: false,
      isRecruiting: false // 招募关闭 - 不会显示在列表中
    }
  ];

  // Practical filter sections for FilterModal
  const filterSections: FilterSection[] = [
    {
      id: 'contentType',
      title: 'Project Type',
      multiSelect: true,
      options: [
        { id: 'character', title: 'Character', icon: '👤' },
        { id: 'portrait', title: 'Portrait', icon: '🖼️' },
        { id: 'illustration', title: 'Illustration', icon: '🎨' },
        { id: 'logo', title: 'Logo Design', icon: '🔷' },
        { id: 'gameArt', title: 'Game Art', icon: '🎮' },
        { id: 'animation', title: 'Animation', icon: '🎬' },
        { id: 'concept', title: 'Concept Art', icon: '💭' },
        { id: 'commercial', title: 'Commercial', icon: '💼' }
      ]
    },
    {
      id: 'budgetRange',
      title: 'Budget Range',
      multiSelect: false,
      options: [
        { id: 'under100', title: 'Under $100', icon: '💰' },
        { id: '100-500', title: '$100 - $500', icon: '💰' },
        { id: '500-1000', title: '$500 - $1K', icon: '💰' },
        { id: '1000-5000', title: '$1K - $5K', icon: '💰' },
        { id: 'over5000', title: 'Over $5K', icon: '💰' }
      ]
    },
    {
      id: 'clientStatus',
      title: 'Client Status',
      multiSelect: true,
      options: [
        { id: 'verified', title: 'Verified Only', icon: '✅' },
        { id: 'highQuality', title: 'High Quality', icon: '⭐' },
        { id: 'newClient', title: 'New Client', icon: '🆕' },
        { id: 'returningClient', title: 'Returning', icon: '🔄' }
      ]
    },
    {
      id: 'projectStatus',
      title: 'Project Status',
      multiSelect: true,
      options: [
        { id: 'unclaimed', title: 'Available', icon: '🟢' },
        { id: 'urgent', title: 'Urgent', icon: '🔴' },
        { id: 'featured', title: 'Featured', icon: '⭐' },
        { id: 'expiringSoon', title: 'Expiring Soon', icon: '⏰' }
      ]
    }
  ];

  // Quick filter state management - add character filter
  const [quickFilters, setQuickFilters] = useState({
    verified: false,
    unclaimed: false,
    character: false // Add character filter
  });

  const toggleQuickFilter = (filterKey: string) => {
    console.log(`Toggling filter: ${filterKey}`); // Debug log
    setQuickFilters(prev => {
      const newState = {
        ...prev,
        [filterKey]: !prev[filterKey]
      };
      console.log('New filter state:', newState); // Debug log
      return newState;
    });
  };

  // Filter function to apply all filters including recruiting status
  const getFilteredProjects = () => {
    let filtered = allProjectItems;

    // 🎯 首先过滤掉招募关闭的项目 - 这是关键！
    filtered = filtered.filter(project => project.isRecruiting === true);

    // Apply quick filters
    if (quickFilters.verified) {
      filtered = filtered.filter(project => project.isVerified);
    }
    
    if (quickFilters.unclaimed) {
      filtered = filtered.filter(project => !project.isClaimed);
    }
    
    if (quickFilters.character) {
      filtered = filtered.filter(project => project.contentType === 'character');
    }

    // Apply modal filters
    if (selectedFilters.contentType && selectedFilters.contentType.length > 0) {
      filtered = filtered.filter(project => 
        selectedFilters.contentType.includes(project.contentType)
      );
    }

    if (selectedFilters.budgetRange && selectedFilters.budgetRange.length > 0) {
      filtered = filtered.filter(project => 
        selectedFilters.budgetRange.includes(project.budgetRange)
      );
    }

    if (selectedFilters.clientStatus && selectedFilters.clientStatus.length > 0) {
      filtered = filtered.filter(project => {
        if (selectedFilters.clientStatus.includes('verified') && !project.isVerified) return false;
        if (selectedFilters.clientStatus.includes('highQuality') && !project.isHighQuality) return false;
        return true;
      });
    }

    if (selectedFilters.projectStatus && selectedFilters.projectStatus.length > 0) {
      filtered = filtered.filter(project => {
        if (selectedFilters.projectStatus.includes('unclaimed') && project.isClaimed) return false;
        if (selectedFilters.projectStatus.includes('urgent') && !project.isUrgent) return false;
        return true;
      });
    }

    return filtered;
  };

  // Filter handlers for FilterModal
  const handleFilterChange = (sectionId: string, optionId: string, isSelected: boolean) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (sectionId === 'budgetRange') {
        // Single select for budget
        newFilters[sectionId] = isSelected ? [optionId] : [];
      } else {
        // Multi-select for other filters
        if (!newFilters[sectionId]) newFilters[sectionId] = [];
        
        if (isSelected) {
          newFilters[sectionId].push(optionId);
        } else {
          newFilters[sectionId] = newFilters[sectionId].filter(id => id !== optionId);
        }
      }
      
      return newFilters;
    });
  };

  const handleFilterReset = () => {
    setSelectedFilters({
      contentType: [],
      budgetRange: [],
      clientStatus: [],
      projectStatus: []
    });
    setQuickFilters({
      verified: false,
      unclaimed: false,
      character: false
    });
  };

  const handleFilterApply = () => {
    setShowFilterModal(false);
    
    // Update quick filters based on modal selections
    setQuickFilters({
      verified: selectedFilters.clientStatus?.includes('verified') || false,
      unclaimed: selectedFilters.projectStatus?.includes('unclaimed') || false,
      character: selectedFilters.contentType?.includes('character') || false
    });
  };

  const handleProjectPress = (project: any) => {
    // 导航到项目详情页，传递招募状态
    router.push({
      pathname: '/project-detail',
      params: {
        projectId: project.id,
        title: project.title,
        category: project.contentType,
        deadline: project.deadline,
        budget: project.budget,
        status: 'active',
        applicantCount: Math.floor(Math.random() * 10) + 1,
        invitedCount: Math.floor(Math.random() * 3),
        selectedArtistCount: 0,
        description: project.description,
        isRecruiting: project.isRecruiting
      }
    });
  };

  const handleProjectAction = (projectId: number) => {
    console.log('Project action:', projectId);
    // Handle project action (bookmark, etc.)
  };

  // 获取过滤后的项目数量用于调试
  const filteredProjects = getFilteredProjects();
  const recruitingProjectsCount = allProjectItems.filter(p => p.isRecruiting).length;
  const totalProjectsCount = allProjectItems.length;

  return (
    <View style={GlobalStyles.container}>
      {/* Header - 与其他页面保持完全一致的布局 */}
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
            <StatusBadge status="active" text="Beta" size="small" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/post-project')}
        >
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

      {/* 显示招募状态信息（开发调试用，可以删除） */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          Showing {filteredProjects.length} projects (Recruiting: {recruitingProjectsCount}/{totalProjectsCount})
        </Text>
      </View>

      {/* Filter Buttons - Final layout with proper text handling */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, quickFilters.verified && styles.activeFilterButton]}
          onPress={() => toggleQuickFilter('verified')}
        >
          <Text style={styles.filterIcon}>🏢</Text>
          <Text 
            style={[styles.filterButtonText, quickFilters.verified && styles.activeFilterText]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
          >
            Verified
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, quickFilters.unclaimed && styles.activeFilterButton]}
          onPress={() => toggleQuickFilter('unclaimed')}
        >
          <Text style={styles.filterIcon}>✅</Text>
          <Text 
            style={[styles.filterButtonText, quickFilters.unclaimed && styles.activeFilterText]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
          >
            Unclaimed
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, quickFilters.character && styles.activeFilterButton]}
          onPress={() => toggleQuickFilter('character')}
        >
          <Text style={styles.filterIcon}>👤</Text>
          <Text 
            style={[styles.filterButtonText, quickFilters.character && styles.activeFilterText]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
          >
            Character
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.moreFiltersButton,
            (Object.values(selectedFilters).some(arr => arr.length > 0)) && styles.activeFilterButton
          ]}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.moreFiltersIcon}>🔽</Text>
        </TouchableOpacity>
      </View>

      {/* Projects List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.projectsList}>
          {filteredProjects.map((item) => (
            <ProjectCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              budget={item.budget}
              deadline={item.deadline}
              clientName={item.clientName}
              clientAvatar={item.clientAvatar}
              isVerified={item.isVerified}
              isHighQuality={item.isHighQuality}
              image={item.image}
              tags={item.tags}
              onPress={handleProjectPress}
              onActionPress={handleProjectAction}
            />
          ))}
          
          {/* 如果没有招募中的项目，显示提示 */}
          {filteredProjects.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No projects available</Text>
              <Text style={styles.emptyDescription}>
                No projects are currently recruiting. Check back later for new opportunities!
              </Text>
            </View>
          )}
        </View>
        <View style={GlobalStyles.bottomPadding} />
      </ScrollView>

      <FilterModal
        visible={showFilterModal}
        title="Filter Projects"
        sections={filterSections}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
        onApply={handleFilterApply}
        onClose={() => setShowFilterModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Header - 与其他页面保持完全一致
  header: {
    ...Layout.rowSpaceBetween,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xxl,
    paddingTop: 50, // 🎯 关键！与其他页面一致的状态栏高度
    paddingBottom: Layout.spacing.lg,
  },
  headerTabs: {
    ...Layout.row,
    alignItems: 'center',
  },
  headerTab: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    marginRight: Layout.spacing.sm,
  },
  activeHeaderTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  headerTabText: {
    ...Typography.bodyLarge,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  activeHeaderTabText: {
    color: Colors.text,
  },
  betaTab: {
    ...Layout.row,
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    gap: Layout.spacing.sm,
  },
  betaText: {
    ...Typography.bodyLarge,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    ...Typography.h3,
    color: Colors.text,
    fontWeight: 'bold',
  },

  // Search Bar
  searchContainer: {
    ...Layout.paddingHorizontal,
    marginBottom: Layout.spacing.lg,
  },
  searchBar: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.xxl,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    ...Layout.row,
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Layout.spacing.md,
  },
  searchPlaceholder: {
    ...Typography.body,
    color: Colors.textDisabled,
  },

  // Debug Info (可以删除)
  debugInfo: {
    backgroundColor: Colors.surface,
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
    padding: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
  },
  debugText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  // Filter Buttons - Final fix for text wrapping and selection
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: Layout.spacing.xl,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '22%', // Fixed width to prevent overlap
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterIcon: {
    fontSize: 11,
    marginRight: 2,
  },
  filterButtonText: {
    fontSize: 10,
    color: Colors.text,
    fontWeight: '500',
    textAlign: 'center',
    numberOfLines: 1,
  },
  activeFilterText: {
    fontWeight: 'bold',
    color: Colors.text,
  },
  moreFiltersButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '10%',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  moreFiltersIcon: {
    fontSize: 12,
    color: Colors.text,
  },

  // Content
  content: {
    flex: 1,
  },
  projectsList: {
    ...Layout.paddingHorizontal,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Layout.spacing.lg,
  },
  emptyTitle: {
    ...Typography.h4,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  emptyDescription: {
    ...Typography.bodyMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Layout.spacing.xl,
  },
});

export default ProjectsPage;