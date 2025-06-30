// gallery-analytics.tsx - Artist Gallery Analytics Dashboard
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Import components
import EmptyState from './components/common/EmptyState';
import Header from './components/common/Header';
import LoadingState from './components/common/LoadingState';
import StatusBadge from './components/common/StatusBadge';
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

const { width: screenWidth } = Dimensions.get('window');

interface GalleryAnalytics {
  galleryId: number;
  title: string;
  image: string;
  totalViews: number;
  totalLikes: number;
  totalSales: number;
  totalRevenue: number;
  conversionRate: number;
  averageRating: number;
  timeData: {
    period: string;
    views: number;
    likes: number;
    sales: number;
    revenue: number;
  }[];
  trafficSources: {
    source: string;
    views: number;
    percentage: number;
  }[];
  topPerformingTags: string[];
  demographics: {
    ageGroups: { range: string; percentage: number }[];
    locations: { country: string; percentage: number }[];
  };
}

interface PublishedGallery {
  id: number;
  title: string;
  image: string;
  views: number;
  likes: number;
  sold: number;
  revenue: number;
  status: string;
}

const GalleryAnalyticsPage = () => {
  const params = useLocalSearchParams();
  const specificGalleryId = params.galleryId ? parseInt(params.galleryId as string) : null;
  
  const [analytics, setAnalytics] = useState<GalleryAnalytics | null>(null);
  const [galleries, setGalleries] = useState<PublishedGallery[]>([]);
  const [selectedGalleryId, setSelectedGalleryId] = useState<number | null>(specificGalleryId);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '3m' | 'all'>('30d');

  useFocusEffect(
    useCallback(() => {
      loadAnalyticsData();
    }, [selectedGalleryId, timeFilter])
  );

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // Load galleries list first
      const galleriesData = await AsyncStorage.getItem('myGalleries');
      let galleriesList: PublishedGallery[] = [];
      
      if (galleriesData) {
        galleriesList = JSON.parse(galleriesData);
        setGalleries(galleriesList);
      } else {
        // Mock galleries data
        galleriesList = [
          {
            id: 1,
            title: 'Anime Style Portrait',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
            views: 245,
            likes: 32,
            sold: 13,
            revenue: 1157,
            status: 'active'
          },
          {
            id: 2,
            title: 'Character Design Set',
            image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
            views: 189,
            likes: 28,
            sold: 8,
            revenue: 1248,
            status: 'active'
          },
          {
            id: 3,
            title: 'Fantasy Portrait Collection',
            image: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=200&h=200&fit=crop',
            views: 432,
            likes: 67,
            sold: 25,
            revenue: 3000,
            status: 'sold_out'
          }
        ];
        setGalleries(galleriesList);
      }

      // Load or generate analytics data
      if (selectedGalleryId) {
        const analyticsData = await loadSpecificGalleryAnalytics(selectedGalleryId, galleriesList);
        setAnalytics(analyticsData);
      } else {
        const overallAnalytics = await loadOverallAnalytics(galleriesList);
        setAnalytics(overallAnalytics);
      }
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSpecificGalleryAnalytics = async (galleryId: number, galleriesList: PublishedGallery[]): Promise<GalleryAnalytics> => {
    const gallery = galleriesList.find(g => g.id === galleryId);
    if (!gallery) throw new Error('Gallery not found');

    // Mock specific gallery analytics
    return {
      galleryId: gallery.id,
      title: gallery.title,
      image: gallery.image,
      totalViews: gallery.views,
      totalLikes: gallery.likes,
      totalSales: gallery.sold,
      totalRevenue: gallery.revenue,
      conversionRate: gallery.views > 0 ? (gallery.sold / gallery.views) * 100 : 0,
      averageRating: 4.7,
      timeData: generateTimeData(timeFilter),
      trafficSources: [
        { source: 'Gallery Browse', views: Math.floor(gallery.views * 0.4), percentage: 40 },
        { source: 'Artist Profile', views: Math.floor(gallery.views * 0.25), percentage: 25 },
        { source: 'Search Results', views: Math.floor(gallery.views * 0.20), percentage: 20 },
        { source: 'Social Media', views: Math.floor(gallery.views * 0.10), percentage: 10 },
        { source: 'Direct Link', views: Math.floor(gallery.views * 0.05), percentage: 5 }
      ],
      topPerformingTags: ['anime', 'portrait', 'digital art', 'commission'],
      demographics: {
        ageGroups: [
          { range: '18-24', percentage: 35 },
          { range: '25-34', percentage: 40 },
          { range: '35-44', percentage: 20 },
          { range: '45+', percentage: 5 }
        ],
        locations: [
          { country: 'United States', percentage: 45 },
          { country: 'Japan', percentage: 20 },
          { country: 'United Kingdom', percentage: 15 },
          { country: 'Canada', percentage: 10 },
          { country: 'Others', percentage: 10 }
        ]
      }
    };
  };

  const loadOverallAnalytics = async (galleriesList: PublishedGallery[]): Promise<GalleryAnalytics> => {
    const totalViews = galleriesList.reduce((sum, g) => sum + g.views, 0);
    const totalLikes = galleriesList.reduce((sum, g) => sum + g.likes, 0);
    const totalSales = galleriesList.reduce((sum, g) => sum + g.sold, 0);
    const totalRevenue = galleriesList.reduce((sum, g) => sum + g.revenue, 0);

    return {
      galleryId: 0, // 0 indicates overall analytics
      title: 'All Galleries Overview',
      image: '',
      totalViews,
      totalLikes,
      totalSales,
      totalRevenue,
      conversionRate: totalViews > 0 ? (totalSales / totalViews) * 100 : 0,
      averageRating: 4.8,
      timeData: generateTimeData(timeFilter, true),
      trafficSources: [
        { source: 'Gallery Browse', views: Math.floor(totalViews * 0.35), percentage: 35 },
        { source: 'Artist Profile', views: Math.floor(totalViews * 0.30), percentage: 30 },
        { source: 'Search Results', views: Math.floor(totalViews * 0.20), percentage: 20 },
        { source: 'Social Media', views: Math.floor(totalViews * 0.10), percentage: 10 },
        { source: 'Direct Link', views: Math.floor(totalViews * 0.05), percentage: 5 }
      ],
      topPerformingTags: ['anime', 'character design', 'portrait', 'digital art', 'fantasy'],
      demographics: {
        ageGroups: [
          { range: '18-24', percentage: 32 },
          { range: '25-34', percentage: 38 },
          { range: '35-44', percentage: 22 },
          { range: '45+', percentage: 8 }
        ],
        locations: [
          { country: 'United States', percentage: 42 },
          { country: 'Japan', percentage: 18 },
          { country: 'United Kingdom', percentage: 12 },
          { country: 'Canada', percentage: 15 },
          { country: 'Others', percentage: 13 }
        ]
      }
    };
  };

  const generateTimeData = (period: string, isOverall = false) => {
    const periods = {
      '7d': 7,
      '30d': 30,
      '3m': 90,
      'all': 365
    };
    
    const days = periods[period] || 30;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate mock data with some variance
      const baseViews = isOverall ? Math.floor(Math.random() * 50 + 20) : Math.floor(Math.random() * 20 + 5);
      const baseLikes = Math.floor(baseViews * 0.15);
      const baseSales = Math.floor(baseViews * 0.05);
      const baseRevenue = baseSales * (Math.random() * 100 + 50);
      
      data.push({
        period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: baseViews,
        likes: baseLikes,
        sales: baseSales,
        revenue: Math.floor(baseRevenue)
      });
    }
    
    return data;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAnalyticsData();
    setIsRefreshing(false);
  };

  const handleGallerySelect = (galleryId: number | null) => {
    setSelectedGalleryId(galleryId);
  };

  const renderGallerySelector = () => {
    if (specificGalleryId) return null; // Don't show selector if came from specific gallery

    return (
      <View style={styles.gallerySelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.gallerySelectorItem,
              selectedGalleryId === null && styles.selectedGalleryItem
            ]}
            onPress={() => handleGallerySelect(null)}
          >
            <View style={styles.overallIcon}>
              <Text style={styles.overallIconText}>📊</Text>
            </View>
            <Text style={[
              styles.gallerySelectorText,
              selectedGalleryId === null && styles.selectedGalleryText
            ]}>
              All Galleries
            </Text>
          </TouchableOpacity>

          {galleries.map((gallery) => (
            <TouchableOpacity
              key={gallery.id}
              style={[
                styles.gallerySelectorItem,
                selectedGalleryId === gallery.id && styles.selectedGalleryItem
              ]}
              onPress={() => handleGallerySelect(gallery.id)}
            >
              <Image source={{ uri: gallery.image }} style={styles.gallerySelectorImage} />
              <Text style={[
                styles.gallerySelectorText,
                selectedGalleryId === gallery.id && styles.selectedGalleryText
              ]} numberOfLines={2}>
                {gallery.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderTimeFilter = () => {
    const filters = [
      { key: '7d', label: '7 Days' },
      { key: '30d', label: '30 Days' },
      { key: '3m', label: '3 Months' },
      { key: 'all', label: 'All Time' }
    ];

    return (
      <View style={styles.timeFilter}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.timeFilterButton,
              timeFilter === filter.key && styles.activeTimeFilter
            ]}
            onPress={() => setTimeFilter(filter.key as any)}
          >
            <Text style={[
              styles.timeFilterText,
              timeFilter === filter.key && styles.activeTimeFilterText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSummaryStats = () => {
    if (!analytics) return null;

    return (
      <View style={styles.summaryStats}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{analytics.totalViews.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Views</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{analytics.totalLikes.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Likes</Text>
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{analytics.totalSales.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>${analytics.totalRevenue.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPerformanceMetrics = () => {
    if (!analytics) return null;

    return (
      <View style={styles.performanceSection}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{analytics.conversionRate.toFixed(2)}%</Text>
            <Text style={styles.metricLabel}>Conversion Rate</Text>
            <Text style={styles.metricSubtext}>Views to Sales</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>⭐ {analytics.averageRating}</Text>
            <Text style={styles.metricLabel}>Avg Rating</Text>
            <Text style={styles.metricSubtext}>Customer Reviews</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{analytics.totalLikes > 0 ? ((analytics.totalLikes / analytics.totalViews) * 100).toFixed(1) : '0'}%</Text>
            <Text style={styles.metricLabel}>Like Rate</Text>
            <Text style={styles.metricSubtext}>Views to Likes</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>${analytics.totalSales > 0 ? (analytics.totalRevenue / analytics.totalSales).toFixed(0) : '0'}</Text>
            <Text style={styles.metricLabel}>Avg Order</Text>
            <Text style={styles.metricSubtext}>Revenue per Sale</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderChartsSection = () => {
    if (!analytics) return null;

    return (
      <View style={styles.chartsSection}>
        <Text style={styles.sectionTitle}>Performance Over Time</Text>
        
        {/* Chart Placeholder */}
        <View style={styles.chartContainer}>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartIcon}>📈</Text>
            <Text style={styles.chartTitle}>Views & Sales Trend</Text>
            <Text style={styles.chartSubtext}>
              Showing {timeFilter === '7d' ? '7 days' : timeFilter === '30d' ? '30 days' : timeFilter === '3m' ? '3 months' : 'all time'} data
            </Text>
            
            {/* Mock chart data visualization */}
            <View style={styles.mockChartData}>
              <Text style={styles.chartDataText}>
                📊 Peak views: {Math.max(...analytics.timeData.map(d => d.views))} ({analytics.timeData.find(d => d.views === Math.max(...analytics.timeData.map(d => d.views)))?.period})
              </Text>
              <Text style={styles.chartDataText}>
                💰 Best sales day: {Math.max(...analytics.timeData.map(d => d.sales))} sales
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderTrafficSources = () => {
    if (!analytics) return null;

    return (
      <View style={styles.trafficSection}>
        <Text style={styles.sectionTitle}>Traffic Sources</Text>
        
        <View style={styles.trafficList}>
          {analytics.trafficSources.map((source, index) => (
            <View key={index} style={styles.trafficItem}>
              <View style={styles.trafficInfo}>
                <Text style={styles.trafficSource}>{source.source}</Text>
                <Text style={styles.trafficViews}>{source.views.toLocaleString()} views</Text>
              </View>
              <View style={styles.trafficPercentage}>
                <Text style={styles.percentageText}>{source.percentage}%</Text>
              </View>
              <View style={styles.trafficBar}>
                <View 
                  style={[
                    styles.trafficBarFill,
                    { width: `${source.percentage}%` }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderDemographics = () => {
    if (!analytics) return null;

    return (
      <View style={styles.demographicsSection}>
        <Text style={styles.sectionTitle}>Audience Demographics</Text>
        
        <View style={styles.demographicsGrid}>
          {/* Age Groups */}
          <View style={styles.demographicCard}>
            <Text style={styles.demographicTitle}>Age Groups</Text>
            {analytics.demographics.ageGroups.map((group, index) => (
              <View key={index} style={styles.demographicItem}>
                <Text style={styles.demographicLabel}>{group.range}</Text>
                <Text style={styles.demographicValue}>{group.percentage}%</Text>
              </View>
            ))}
          </View>
          
          {/* Locations */}
          <View style={styles.demographicCard}>
            <Text style={styles.demographicTitle}>Top Locations</Text>
            {analytics.demographics.locations.map((location, index) => (
              <View key={index} style={styles.demographicItem}>
                <Text style={styles.demographicLabel}>{location.country}</Text>
                <Text style={styles.demographicValue}>{location.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderTopPerformingTags = () => {
    if (!analytics) return null;

    return (
      <View style={styles.tagsSection}>
        <Text style={styles.sectionTitle}>Top Performing Tags</Text>
        <View style={styles.tagsList}>
          {analytics.topPerformingTags.map((tag, index) => (
            <View key={index} style={styles.tagItem}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={AppStyles.container}>
        <Header title="Gallery Analytics" style={AppStyles.header} />
        <LoadingState text="Loading analytics..." />
      </View>
    );
  }

  if (!analytics) {
    return (
      <View style={AppStyles.container}>
        <Header title="Gallery Analytics" style={AppStyles.header} />
        <EmptyState
          icon="📊"
          title="No Analytics Data"
          description="Unable to load analytics data. Please try again."
          buttonText="Refresh"
          onButtonPress={loadAnalyticsData}
        />
      </View>
    );
  }

  return (
    <View style={AppStyles.container}>
      <Header 
        title={selectedGalleryId ? analytics.title : "Gallery Analytics"}
        style={AppStyles.header}
        rightElement={
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/published-galleries')}
          >
            <Text style={styles.headerButtonIcon}>🖼️</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Gallery Selector */}
        {renderGallerySelector()}

        {/* Time Filter */}
        {renderTimeFilter()}

        {/* Summary Stats */}
        {renderSummaryStats()}

        {/* Performance Metrics */}
        {renderPerformanceMetrics()}

        {/* Charts Section */}
        {renderChartsSection()}

        {/* Traffic Sources */}
        {renderTrafficSources()}

        {/* Demographics */}
        {renderDemographics()}

        {/* Top Performing Tags */}
        {renderTopPerformingTags()}

        <View style={GlobalStyles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },

  // Header Button
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonIcon: {
    fontSize: 18,
  },

  // Gallery Selector
  gallerySelector: {
    paddingVertical: Layout.spacing.lg,
    paddingLeft: Layout.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  gallerySelectorItem: {
    alignItems: 'center',
    marginRight: Layout.spacing.lg,
    padding: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedGalleryItem: {
    borderColor: Colors.primary,
    backgroundColor: Colors.artist,
  },
  gallerySelectorImage: {
    width: 50,
    height: 50,
    borderRadius: Layout.radius.md,
    marginBottom: Layout.spacing.sm,
  },
  overallIcon: {
    width: 50,
    height: 50,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  overallIconText: {
    fontSize: 24,
  },
  gallerySelectorText: {
    ...Typography.caption,
    textAlign: 'center',
  },
  selectedGalleryText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },

  // Time Filter
  timeFilter: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
    justifyContent: 'space-around',
  },
  timeFilterButton: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeTimeFilter: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeFilterText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  activeTimeFilterText: {
    color: Colors.text,
    fontWeight: 'bold',
  },

  // Summary Stats
  summaryStats: {
    backgroundColor: Colors.surface,
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    textAlign: 'center',
  },

  // Performance Section
  performanceSection: {
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    ...Typography.h5,
    marginBottom: Layout.spacing.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  metricValue: {
    ...Typography.h3,
    color: Colors.secondary,
    marginBottom: Layout.spacing.xs,
  },
  metricLabel: {
    ...Typography.bodySmall,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.xs,
  },
  metricSubtext: {
    ...Typography.caption,
    textAlign: 'center',
  },

  // Charts Section
  chartsSection: {
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  chartContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    height: 200,
  },
  chartPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  chartIcon: {
    fontSize: 48,
    marginBottom: Layout.spacing.md,
  },
  chartTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.sm,
  },
  chartSubtext: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  mockChartData: {
    alignItems: 'center',
  },
  chartDataText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Layout.spacing.xs,
  },

  // Traffic Section
  trafficSection: {
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  trafficList: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
  },
  trafficItem: {
    marginBottom: Layout.spacing.lg,
  },
  trafficInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  trafficSource: {
    ...Typography.body,
    fontWeight: '600',
  },
  trafficViews: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  trafficPercentage: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  percentageText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  trafficBar: {
    height: 6,
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.xs,
    overflow: 'hidden',
  },
  trafficBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Layout.radius.xs,
  },

  // Demographics Section
  demographicsSection: {
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  demographicsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  demographicCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
  },
  demographicTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  demographicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  demographicLabel: {
    ...Typography.bodySmall,
  },
  demographicValue: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: 'bold',
  },

  // Tags Section
  tagsSection: {
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.xl,
    marginRight: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  tagText: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: 'bold',
  },
});

export default GalleryAnalyticsPage;