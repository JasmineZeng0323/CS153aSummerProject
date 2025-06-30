// artist-dashboard.tsx - Artist Central Dashboard
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
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

interface DashboardData {
  overview: {
    todayEarnings: number;
    weeklyEarnings: number;
    monthlyEarnings: number;
    totalEarnings: number;
    pendingPayouts: number;
    availableBalance: number;
  };
  performance: {
    totalGalleries: number;
    activeGalleries: number;
    totalSales: number;
    averageRating: number;
    responseTime: string;
    completionRate: number;
  };
  projects: {
    appliedCount: number;
    selectedCount: number;
    inProgressCount: number;
    completedCount: number;
    pendingApplications: any[];
  };
  galleries: {
    recentGalleries: any[];
    topPerforming: any[];
    lowStock: any[];
  };
  notifications: {
    unreadCount: number;
    recentNotifications: any[];
  };
  todoItems: any[];
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
  badge?: string;
}

const ArtistDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<'today' | 'week' | 'month'>('today');

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load all related data from AsyncStorage
      const [
        galleriesData,
        appliedProjectsData,
        earningsData,
        userInfoData
      ] = await Promise.all([
        AsyncStorage.getItem('myGalleries'),
        AsyncStorage.getItem('appliedProjects'),
        AsyncStorage.getItem('earningsData'),
        AsyncStorage.getItem('userInfo')
      ]);

      // Parse data
      const galleries = galleriesData ? JSON.parse(galleriesData) : [];
      const appliedProjects = appliedProjectsData ? JSON.parse(appliedProjectsData) : [];
      const earnings = earningsData ? JSON.parse(earningsData) : null;
      const userInfo = userInfoData ? JSON.parse(userInfoData) : {};

      // Generate comprehensive dashboard data
      const mockDashboard: DashboardData = {
        overview: {
          todayEarnings: 89,
          weeklyEarnings: 456,
          monthlyEarnings: earnings?.monthlyEarnings || 2847,
          totalEarnings: earnings?.totalEarnings || 12847,
          pendingPayouts: earnings?.pendingPayouts || 1200,
          availableBalance: earnings?.availableBalance || 1647
        },
        performance: {
          totalGalleries: galleries.length,
          activeGalleries: galleries.filter(g => g.status === 'active').length,
          totalSales: galleries.reduce((sum, g) => sum + (g.sold || 0), 0),
          averageRating: 4.9,
          responseTime: '2h',
          completionRate: 98
        },
        projects: {
          appliedCount: appliedProjects.length,
          selectedCount: appliedProjects.filter(p => p.status === 'selected').length,
          inProgressCount: appliedProjects.filter(p => p.status === 'in_progress').length,
          completedCount: appliedProjects.filter(p => p.status === 'completed').length,
          pendingApplications: appliedProjects.filter(p => p.status === 'pending').slice(0, 3)
        },
        galleries: {
          recentGalleries: galleries.slice(0, 3),
          topPerforming: galleries.sort((a, b) => (b.revenue || 0) - (a.revenue || 0)).slice(0, 3),
          lowStock: galleries.filter(g => g.stock !== undefined && g.stock <= 2 && g.stock > 0)
        },
        notifications: {
          unreadCount: 5,
          recentNotifications: [
            {
              id: 1,
              type: 'project_selected',
              title: 'Project Application Accepted!',
              message: 'Your application for "Character Design" was accepted',
              time: '2 hours ago',
              isRead: false
            },
            {
              id: 2,
              type: 'gallery_sale',
              title: 'Gallery Sale',
              message: 'Someone purchased your "Anime Portrait" for $89',
              time: '5 hours ago',
              isRead: false
            },
            {
              id: 3,
              type: 'payout_ready',
              title: 'Payout Available',
              message: '$1,200 is ready for withdrawal',
              time: '1 day ago',
              isRead: true
            }
          ]
        },
        todoItems: [
          {
            id: 1,
            title: 'Complete Character Design draft',
            type: 'project',
            deadline: '2025-07-02',
            priority: 'high'
          },
          {
            id: 2,
            title: 'Respond to commission inquiry',
            type: 'message',
            deadline: '2025-06-30',
            priority: 'medium'
          },
          {
            id: 3,
            title: 'Update gallery stock levels',
            type: 'gallery',
            deadline: 'No deadline',
            priority: 'low'
          }
        ]
      };

      setDashboardData(mockDashboard);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const getQuickActions = (): QuickAction[] => [
    {
      id: 'publish',
      title: 'Publish Gallery',
      icon: '🎨',
      color: Colors.primary,
      onPress: () => router.push('/publish-gallery')
    },
    {
      id: 'projects',
      title: 'Browse Projects',
      icon: '📋',
      color: Colors.secondary,
      onPress: () => router.push('/projects')
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      icon: '📊',
      color: Colors.success,
      onPress: () => router.push('/gallery-analytics')
    },
    {
      id: 'earnings',
      title: 'Earnings',
      icon: '💰',
      color: Colors.warning,
      onPress: () => router.push('/earnings-dashboard'),
      badge: dashboardData?.overview.pendingPayouts ? '$' + (dashboardData.overview.pendingPayouts / 1000).toFixed(1) + 'k' : undefined
    },
    {
      id: 'messages',
      title: 'Messages',
      icon: '💬',
      color: Colors.info,
      onPress: () => router.push('/messages'),
      badge: dashboardData?.notifications.unreadCount ? dashboardData.notifications.unreadCount.toString() : undefined
    },
    {
      id: 'portfolio',
      title: 'My Galleries',
      icon: '🖼️',
      color: Colors.artist,
      onPress: () => router.push('/published-galleries')
    }
  ];

  const renderWelcomeSection = () => (
    <View style={styles.welcomeSection}>
      <View style={styles.welcomeContent}>
        <Text style={styles.welcomeTitle}>Welcome back! 👋</Text>
        <Text style={styles.welcomeSubtitle}>Here's what's happening with your art business</Text>
      </View>
      <TouchableOpacity 
        style={styles.notificationButton}
        onPress={() => router.push('/notifications')}
      >
        <Text style={styles.notificationIcon}>🔔</Text>
        {dashboardData?.notifications.unreadCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>
              {dashboardData.notifications.unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderEarningsOverview = () => {
    if (!dashboardData) return null;

    const currentEarnings = selectedTimeFrame === 'today' ? dashboardData.overview.todayEarnings :
                           selectedTimeFrame === 'week' ? dashboardData.overview.weeklyEarnings :
                           dashboardData.overview.monthlyEarnings;

    const earningsGrowth = selectedTimeFrame === 'today' ? '+12%' :
                          selectedTimeFrame === 'week' ? '+8%' : '+23%';

    return (
      <View style={styles.earningsSection}>
        <View style={styles.earningsSectionHeader}>
          <Text style={styles.sectionTitle}>Earnings Overview</Text>
          <View style={styles.timeFrameSelector}>
            {(['today', 'week', 'month'] as const).map((timeFrame) => (
              <TouchableOpacity
                key={timeFrame}
                style={[
                  styles.timeFrameButton,
                  selectedTimeFrame === timeFrame && styles.activeTimeFrame
                ]}
                onPress={() => setSelectedTimeFrame(timeFrame)}
              >
                <Text style={[
                  styles.timeFrameText,
                  selectedTimeFrame === timeFrame && styles.activeTimeFrameText
                ]}>
                  {timeFrame === 'today' ? 'Today' : timeFrame === 'week' ? 'Week' : 'Month'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.earningsCards}>
          <View style={[styles.earningsCard, styles.primaryEarningsCard]}>
            <Text style={styles.earningsValue}>${currentEarnings.toLocaleString()}</Text>
            <Text style={styles.earningsLabel}>
              {selectedTimeFrame === 'today' ? 'Today' : selectedTimeFrame === 'week' ? 'This Week' : 'This Month'}
            </Text>
            <View style={styles.earningsGrowth}>
              <Text style={styles.growthText}>{earningsGrowth}</Text>
            </View>
          </View>

          <View style={styles.earningsCard}>
            <Text style={styles.earningsValue}>${dashboardData.overview.availableBalance.toLocaleString()}</Text>
            <Text style={styles.earningsLabel}>Available</Text>
            <TouchableOpacity 
              style={styles.withdrawButton}
              onPress={() => router.push('/earnings-dashboard')}
            >
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsSection}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {getQuickActions().map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.quickActionCard, { borderLeftColor: action.color }]}
            onPress={action.onPress}
          >
            <View style={styles.quickActionHeader}>
              <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <Text style={styles.quickActionIconText}>{action.icon}</Text>
              </View>
              {action.badge && (
                <View style={styles.actionBadge}>
                  <Text style={styles.actionBadgeText}>{action.badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.quickActionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPerformanceMetrics = () => {
    if (!dashboardData) return null;

    return (
      <View style={styles.performanceSection}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{dashboardData.performance.totalSales}</Text>
            <Text style={styles.metricLabel}>Total Sales</Text>
            <Text style={styles.metricChange}>+15 this month</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>⭐ {dashboardData.performance.averageRating}</Text>
            <Text style={styles.metricLabel}>Rating</Text>
            <Text style={styles.metricChange}>+0.2 this month</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{dashboardData.performance.responseTime}</Text>
            <Text style={styles.metricLabel}>Avg Response</Text>
            <Text style={styles.metricChange}>-30 min improved</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{dashboardData.performance.completionRate}%</Text>
            <Text style={styles.metricLabel}>Completion</Text>
            <Text style={styles.metricChange}>+2% this month</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderProjectsStatus = () => {
    if (!dashboardData) return null;

    return (
      <View style={styles.projectsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Project Applications</Text>
          <TouchableOpacity 
            style={styles.sectionAction}
            onPress={() => router.push('/applied-projects')}
          >
            <Text style={styles.sectionActionText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.projectsStatusGrid}>
          <View style={styles.projectStatusCard}>
            <Text style={styles.statusNumber}>{dashboardData.projects.pendingApplications.length}</Text>
            <Text style={styles.statusLabel}>Pending</Text>
            <StatusBadge status="pending" size="small" />
          </View>
          
          <View style={styles.projectStatusCard}>
            <Text style={styles.statusNumber}>{dashboardData.projects.selectedCount}</Text>
            <Text style={styles.statusLabel}>Selected</Text>
            <StatusBadge status="active" size="small" />
          </View>
          
          <View style={styles.projectStatusCard}>
            <Text style={styles.statusNumber}>{dashboardData.projects.inProgressCount}</Text>
            <Text style={styles.statusLabel}>In Progress</Text>
            <StatusBadge status="in_progress" size="small" />
          </View>
          
          <View style={styles.projectStatusCard}>
            <Text style={styles.statusNumber}>{dashboardData.projects.completedCount}</Text>
            <Text style={styles.statusLabel}>Completed</Text>
            <StatusBadge status="completed" size="small" />
          </View>
        </View>

        {/* Recent Applications */}
        {dashboardData.projects.pendingApplications.length > 0 && (
          <View style={styles.recentApplications}>
            <Text style={styles.subsectionTitle}>Recent Applications</Text>
            {dashboardData.projects.pendingApplications.map((project) => (
              <TouchableOpacity
                key={project.id}
                style={styles.applicationItem}
                onPress={() => router.push({
                  pathname: '/project-detail',
                  params: { projectId: project.id }
                })}
              >
                <View style={styles.applicationInfo}>
                  <Text style={styles.applicationTitle}>{project.title}</Text>
                  <Text style={styles.applicationMeta}>
                    {project.budget} • Applied {project.appliedAt}
                  </Text>
                </View>
                <StatusBadge status="pending" text="Pending" size="small" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderGalleriesOverview = () => {
    if (!dashboardData) return null;

    return (
      <View style={styles.galleriesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gallery Performance</Text>
          <TouchableOpacity 
            style={styles.sectionAction}
            onPress={() => router.push('/published-galleries')}
          >
            <Text style={styles.sectionActionText}>Manage</Text>
          </TouchableOpacity>
        </View>

        {/* Gallery Stats */}
        <View style={styles.galleryStats}>
          <View style={styles.galleryStatItem}>
            <Text style={styles.galleryStatNumber}>{dashboardData.performance.totalGalleries}</Text>
            <Text style={styles.galleryStatLabel}>Total Galleries</Text>
          </View>
          <View style={styles.galleryStatItem}>
            <Text style={styles.galleryStatNumber}>{dashboardData.performance.activeGalleries}</Text>
            <Text style={styles.galleryStatLabel}>Active</Text>
          </View>
          <View style={styles.galleryStatItem}>
            <Text style={styles.galleryStatNumber}>{dashboardData.galleries.lowStock.length}</Text>
            <Text style={styles.galleryStatLabel}>Low Stock</Text>
          </View>
        </View>

        {/* Top Performing Galleries */}
        {dashboardData.galleries.topPerforming.length > 0 && (
          <View style={styles.topGalleries}>
            <Text style={styles.subsectionTitle}>Top Performing</Text>
            {dashboardData.galleries.topPerforming.slice(0, 2).map((gallery) => (
              <TouchableOpacity
                key={gallery.id}
                style={styles.galleryItem}
                onPress={() => router.push({
                  pathname: '/gallery-detail',
                  params: { galleryId: gallery.id }
                })}
              >
                <Image source={{ uri: gallery.image }} style={styles.galleryThumbnail} />
                <View style={styles.galleryItemInfo}>
                  <Text style={styles.galleryItemTitle}>{gallery.title}</Text>
                  <Text style={styles.galleryItemStats}>
                    ${gallery.price} • {gallery.sold} sold • ${(gallery.revenue || 0).toLocaleString()} revenue
                  </Text>
                </View>
                <Text style={styles.galleryItemChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Low Stock Alert */}
        {dashboardData.galleries.lowStock.length > 0 && (
          <View style={styles.lowStockAlert}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertIcon}>⚠️</Text>
              <Text style={styles.alertTitle}>Low Stock Alert</Text>
            </View>
            <Text style={styles.alertMessage}>
              {dashboardData.galleries.lowStock.length} galleries are running low on stock
            </Text>
            <TouchableOpacity 
              style={styles.alertAction}
              onPress={() => router.push('/published-galleries')}
            >
              <Text style={styles.alertActionText}>Update Stock</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderTodoList = () => {
    if (!dashboardData || dashboardData.todoItems.length === 0) return null;

    return (
      <View style={styles.todoSection}>
        <Text style={styles.sectionTitle}>To-Do List</Text>
        {dashboardData.todoItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.todoItem}>
            <View style={[
              styles.todoPriority,
              { backgroundColor: item.priority === 'high' ? Colors.error : 
                               item.priority === 'medium' ? Colors.warning : Colors.success }
            ]} />
            <View style={styles.todoContent}>
              <Text style={styles.todoTitle}>{item.title}</Text>
              <Text style={styles.todoMeta}>
                {item.type} • {item.deadline}
              </Text>
            </View>
            <TouchableOpacity style={styles.todoCheck}>
              <Text style={styles.todoCheckIcon}>☐</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={AppStyles.container}>
        <Header title="Artist Dashboard" style={AppStyles.header} />
        <LoadingState text="Loading your dashboard..." />
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <View style={AppStyles.container}>
        <Header title="Artist Dashboard" style={AppStyles.header} />
        <EmptyState
          icon="📊"
          title="Dashboard Unavailable"
          description="Unable to load dashboard data. Please try again."
          buttonText="Retry"
          onButtonPress={loadDashboardData}
        />
      </View>
    );
  }

  return (
    <View style={AppStyles.container}>
      <Header 
        title="Artist Dashboard"
        style={AppStyles.header}
        rightElement={
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/artist-analytics')}
          >
            <Text style={styles.headerButtonIcon}>📈</Text>
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
        {/* Welcome Section */}
        {renderWelcomeSection()}

        {/* Earnings Overview */}
        {renderEarningsOverview()}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Performance Metrics */}
        {renderPerformanceMetrics()}

        {/* Projects Status */}
        {renderProjectsStatus()}

        {/* Galleries Overview */}
        {renderGalleriesOverview()}

        {/* Todo List */}
        {renderTodoList()}

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

  // Welcome Section
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
    backgroundColor: Colors.artist,
    marginHorizontal: Layout.spacing.xl,
    marginVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    ...Typography.h5,
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  welcomeSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: Layout.radius.round,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    ...Typography.badge,
    fontSize: 10,
  },

  // Section Common Styles
  sectionTitle: {
    ...Typography.h5,
    marginBottom: Layout.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  sectionAction: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
  },
  sectionActionText: {
    ...Typography.buttonSmall,
    color: Colors.primary,
  },
  subsectionTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.md,
  },

  // Earnings Section
  earningsSection: {
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  earningsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  timeFrameSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.xs,
  },
  timeFrameButton: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.sm,
  },
  activeTimeFrame: {
    backgroundColor: Colors.primary,
  },
  timeFrameText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  activeTimeFrameText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  earningsCards: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  earningsCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    position: 'relative',
  },
  primaryEarningsCard: {
    backgroundColor: Colors.primary,
  },
  earningsValue: {
    ...Typography.h2,
    marginBottom: Layout.spacing.xs,
  },
  earningsLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Layout.spacing.md,
  },
  earningsGrowth: {
    position: 'absolute',
    top: Layout.spacing.md,
    right: Layout.spacing.md,
    backgroundColor: Colors.success,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.sm,
  },
  growthText: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: 'bold',
  },
  withdrawButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
    alignSelf: 'flex-start',
  },
  withdrawButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
  },

  // Quick Actions Section
  quickActionsSection: {
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    borderLeftWidth: 4,
    position: 'relative',
  },
  quickActionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionIconText: {
    fontSize: 20,
  },
  actionBadge: {
    backgroundColor: Colors.error,
    borderRadius: Layout.radius.round,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    minWidth: 20,
    alignItems: 'center',
  },
  actionBadgeText: {
    ...Typography.badge,
    fontSize: 10,
  },
  quickActionTitle: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },

  // Performance Section
  performanceSection: {
    paddingHorizontal: Layout.spacing.xl,
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
    marginBottom: Layout.spacing.xs,
  },
  metricChange: {
    ...Typography.caption,
    color: Colors.success,
  },

  // Projects Section
  projectsSection: {
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  projectsStatusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.lg,
  },
  projectStatusCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    alignItems: 'center',
    marginHorizontal: Layout.spacing.xs,
  },
  statusNumber: {
    ...Typography.h4,
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  statusLabel: {
    ...Typography.caption,
    marginBottom: Layout.spacing.sm,
  },
  recentApplications: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
  },
  applicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  applicationInfo: {
    flex: 1,
  },
  applicationTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Layout.spacing.xs,
  },
  applicationMeta: {
    ...Typography.caption,
    color: Colors.textMuted,
  },

  // Galleries Section
  galleriesSection: {
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  galleryStats: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    justifyContent: 'space-around',
    marginBottom: Layout.spacing.lg,
  },
  galleryStatItem: {
    alignItems: 'center',
  },
  galleryStatNumber: {
    ...Typography.h4,
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  galleryStatLabel: {
    ...Typography.caption,
  },
  topGalleries: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  galleryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  galleryThumbnail: {
    width: 50,
    height: 50,
    borderRadius: Layout.radius.md,
    marginRight: Layout.spacing.md,
  },
  galleryItemInfo: {
    flex: 1,
  },
  galleryItemTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Layout.spacing.xs,
  },
  galleryItemStats: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  galleryItemChevron: {
    fontSize: 18,
    color: Colors.textMuted,
  },
  lowStockAlert: {
    backgroundColor: Colors.warning,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  alertIcon: {
    fontSize: 20,
    marginRight: Layout.spacing.sm,
  },
  alertTitle: {
    ...Typography.body,
    fontWeight: 'bold',
    color: Colors.text,
  },
  alertMessage: {
    ...Typography.bodySmall,
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  alertAction: {
    backgroundColor: Colors.text,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
    alignSelf: 'flex-start',
  },
  alertActionText: {
    ...Typography.buttonSmall,
    color: Colors.warning,
  },

  // Todo Section
  todoSection: {
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  todoItem: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    alignItems: 'center',
  },
  todoPriority: {
    width: 4,
    height: 30,
    borderRadius: Layout.radius.xs,
    marginRight: Layout.spacing.md,
  },
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Layout.spacing.xs,
  },
  todoMeta: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  todoCheck: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoCheckIcon: {
    fontSize: 20,
    color: Colors.textMuted,
  },
});

export default ArtistDashboardPage;