// earnings-dashboard.tsx - Artist Earnings Dashboard
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
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

interface EarningsData {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayouts: number;
  availableBalance: number;
  thisMonthGrowth: number;
  recentTransactions: Transaction[];
  monthlyData: MonthlyEarning[];
  payoutHistory: PayoutRecord[];
}

interface Transaction {
  id: string;
  type: 'sale' | 'commission' | 'payout' | 'refund';
  amount: number;
  source: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

interface MonthlyEarning {
  month: string;
  earnings: number;
  sales: number;
  commissions: number;
}

interface PayoutRecord {
  id: string;
  amount: number;
  date: string;
  method: string;
  status: 'completed' | 'pending' | 'processing';
  transactionId: string;
}

const EarningsDashboardPage = () => {
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'payouts'>('overview');

  useFocusEffect(
    useCallback(() => {
      loadEarningsData();
    }, [])
  );

  const loadEarningsData = async () => {
    try {
      setIsLoading(true);
      
      // Load from storage or use mock data
      const earningsDataStorage = await AsyncStorage.getItem('earningsData');
      if (earningsDataStorage) {
        setEarningsData(JSON.parse(earningsDataStorage));
      } else {
        // Mock earnings data
        const mockData: EarningsData = {
          totalEarnings: 12847,
          monthlyEarnings: 2847,
          pendingPayouts: 1200,
          availableBalance: 1647,
          thisMonthGrowth: 23.5,
          recentTransactions: [
            {
              id: '1',
              type: 'sale',
              amount: 89,
              source: 'Anime Portrait Gallery',
              date: '2025-06-23',
              status: 'completed',
              description: 'Gallery sale - Anime Style Portrait'
            },
            {
              id: '2',
              type: 'commission',
              amount: 156,
              source: 'Character Design Project',
              date: '2025-06-22',
              status: 'completed',
              description: 'Commission project payment'
            },
            {
              id: '3',
              type: 'sale',
              amount: 45,
              source: 'Chibi Character Pack',
              date: '2025-06-21',
              status: 'completed',
              description: 'Gallery sale - Q-Version Character'
            },
            {
              id: '4',
              type: 'payout',
              amount: -800,
              source: 'Bank Transfer',
              date: '2025-06-20',
              status: 'completed',
              description: 'Payout to bank account'
            },
            {
              id: '5',
              type: 'commission',
              amount: 200,
              source: 'Logo Design Project',
              date: '2025-06-19',
              status: 'pending',
              description: 'Project milestone payment'
            }
          ],
          monthlyData: [
            { month: 'Jan', earnings: 1800, sales: 12, commissions: 3 },
            { month: 'Feb', earnings: 2200, sales: 15, commissions: 4 },
            { month: 'Mar', earnings: 1950, sales: 13, commissions: 2 },
            { month: 'Apr', earnings: 2600, sales: 18, commissions: 5 },
            { month: 'May', earnings: 2300, sales: 16, commissions: 3 },
            { month: 'Jun', earnings: 2847, sales: 19, commissions: 6 }
          ],
          payoutHistory: [
            {
              id: '1',
              amount: 800,
              date: '2025-06-20',
              method: 'Bank Transfer',
              status: 'completed',
              transactionId: 'TXN_001234'
            },
            {
              id: '2',
              amount: 1200,
              date: '2025-06-15',
              method: 'PayPal',
              status: 'completed',
              transactionId: 'TXN_001233'
            },
            {
              id: '3',
              amount: 600,
              date: '2025-06-10',
              method: 'Bank Transfer',
              status: 'completed',
              transactionId: 'TXN_001232'
            }
          ]
        };
        
        setEarningsData(mockData);
        await AsyncStorage.setItem('earningsData', JSON.stringify(mockData));
      }
    } catch (error) {
      console.error('Error loading earnings data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadEarningsData();
    setIsRefreshing(false);
  };

  const handleRequestPayout = () => {
    router.push('/request-payout');
  };

  const renderOverviewTab = () => {
    if (!earningsData) return null;

    return (
      <View style={styles.tabContent}>
        {/* Main Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.primaryCard]}>
            <Text style={styles.statValue}>${earningsData.totalEarnings.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${earningsData.monthlyEarnings.toLocaleString()}</Text>
            <Text style={styles.statLabel}>This Month</Text>
            <View style={styles.growthBadge}>
              <Text style={styles.growthText}>+{earningsData.thisMonthGrowth}%</Text>
            </View>
          </View>
        </View>

        {/* Balance Cards */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceValue}>${earningsData.availableBalance.toLocaleString()}</Text>
            <TouchableOpacity 
              style={styles.payoutButton}
              onPress={handleRequestPayout}
            >
              <Text style={styles.payoutButtonText}>Request Payout</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Pending Payouts</Text>
            <Text style={styles.balanceValue}>${earningsData.pendingPayouts.toLocaleString()}</Text>
            <StatusBadge status="pending" text="Processing" size="small" />
          </View>
        </View>

        {/* Monthly Chart Placeholder */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Monthly Earnings</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartText}>📊</Text>
              <Text style={styles.chartSubtext}>Monthly earnings chart</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <Text style={styles.sectionTitle}>This Month Summary</Text>
          <View style={styles.statsRow}>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>
                {earningsData.monthlyData[earningsData.monthlyData.length - 1]?.sales || 0}
              </Text>
              <Text style={styles.quickStatLabel}>Gallery Sales</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>
                {earningsData.monthlyData[earningsData.monthlyData.length - 1]?.commissions || 0}
              </Text>
              <Text style={styles.quickStatLabel}>Commissions</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>15%</Text>
              <Text style={styles.quickStatLabel}>Platform Fee</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderTransactionsTab = () => {
    if (!earningsData) return null;

    return (
      <View style={styles.tabContent}>
        <View style={styles.transactionsList}>
          {earningsData.recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Text style={styles.transactionIconText}>
                  {transaction.type === 'sale' ? '💰' : 
                   transaction.type === 'commission' ? '🎨' : 
                   transaction.type === 'payout' ? '📤' : '↩️'}
                </Text>
              </View>
              
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{transaction.source}</Text>
                <Text style={styles.transactionDesc}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              
              <View style={styles.transactionRight}>
                <Text style={[
                  styles.transactionAmount,
                  transaction.amount < 0 ? styles.negativeAmount : styles.positiveAmount
                ]}>
                  {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount)}
                </Text>
                <StatusBadge 
                  status={transaction.status as any}
                  text={transaction.status}
                  size="small"
                />
              </View>
            </View>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => router.push('/earnings-history')}
        >
          <Text style={styles.viewAllText}>View All Transactions</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPayoutsTab = () => {
    if (!earningsData) return null;

    return (
      <View style={styles.tabContent}>
        <View style={styles.payoutsList}>
          {earningsData.payoutHistory.map((payout) => (
            <View key={payout.id} style={styles.payoutItem}>
              <View style={styles.payoutDetails}>
                <Text style={styles.payoutAmount}>${payout.amount.toLocaleString()}</Text>
                <Text style={styles.payoutMethod}>{payout.method}</Text>
                <Text style={styles.payoutDate}>{payout.date}</Text>
                <Text style={styles.payoutId}>ID: {payout.transactionId}</Text>
              </View>
              
              <StatusBadge 
                status={payout.status as any}
                text={payout.status}
                size="small"
              />
            </View>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.requestPayoutButton}
          onPress={handleRequestPayout}
        >
          <Text style={styles.requestPayoutText}>Request New Payout</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'transactions':
        return renderTransactionsTab();
      case 'payouts':
        return renderPayoutsTab();
      default:
        return renderOverviewTab();
    }
  };

  if (isLoading) {
    return (
      <View style={AppStyles.container}>
        <Header title="Earnings Dashboard" style={AppStyles.header} />
        <LoadingState text="Loading earnings data..." />
      </View>
    );
  }

  return (
    <View style={AppStyles.container}>
      <Header 
        title="Earnings Dashboard"
        style={AppStyles.header}
        rightElement={
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/earnings-settings')}
          >
            <Text style={styles.headerButtonIcon}>⚙️</Text>
          </TouchableOpacity>
        }
      />

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'transactions', label: 'Transactions' },
          { key: 'payouts', label: 'Payouts' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.activeTabButton]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={[styles.tabButtonText, activeTab === tab.key && styles.activeTabButtonText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
        {renderTabContent()}
        <View style={styles.bottomPadding} />
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

  // Tab Navigation
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: Layout.spacing.xl,
    marginVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.xs,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    borderRadius: Layout.radius.sm,
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
  },
  tabButtonText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  activeTabButtonText: {
    color: Colors.text,
  },

  // Tab Content
  tabContent: {
    paddingHorizontal: Layout.spacing.xl,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.lg,
    gap: Layout.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    position: 'relative',
  },
  primaryCard: {
    backgroundColor: Colors.primary,
  },
  statValue: {
    ...Typography.h2,
    marginBottom: Layout.spacing.xs,
  },
  statLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  growthBadge: {
    position: 'absolute',
    top: Layout.spacing.md,
    right: Layout.spacing.md,
    backgroundColor: Colors.success,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.xs,
  },
  growthText: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: 'bold',
  },

  // Balance Section
  balanceSection: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.lg,
    gap: Layout.spacing.md,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    alignItems: 'center',
  },
  balanceLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Layout.spacing.xs,
  },
  balanceValue: {
    ...Typography.h4,
    marginBottom: Layout.spacing.md,
  },
  payoutButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
  },
  payoutButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
  },

  // Chart Section
  chartSection: {
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.md,
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
  },
  chartText: {
    fontSize: 48,
    marginBottom: Layout.spacing.sm,
  },
  chartSubtext: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },

  // Quick Stats
  quickStats: {
    marginBottom: Layout.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    ...Typography.h4,
    marginBottom: Layout.spacing.xs,
  },
  quickStatLabel: {
    ...Typography.caption,
    textAlign: 'center',
  },

  // Transactions List
  transactionsList: {
    marginBottom: Layout.spacing.lg,
  },
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  transactionIconText: {
    fontSize: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: Layout.spacing.xs,
  },
  transactionDesc: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Layout.spacing.xs,
  },
  transactionDate: {
    ...Typography.caption,
    color: Colors.textDisabled,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    ...Typography.body,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.xs,
  },
  positiveAmount: {
    color: Colors.success,
  },
  negativeAmount: {
    color: Colors.error,
  },

  // Payouts List
  payoutsList: {
    marginBottom: Layout.spacing.lg,
  },
  payoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  payoutDetails: {
    flex: 1,
  },
  payoutAmount: {
    ...Typography.h6,
    marginBottom: Layout.spacing.xs,
  },
  payoutMethod: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Layout.spacing.xs,
  },
  payoutDate: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Layout.spacing.xs,
  },
  payoutId: {
    ...Typography.caption,
    color: Colors.textDisabled,
  },

  // Action Buttons
  viewAllButton: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  viewAllText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  requestPayoutButton: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.lg,
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  requestPayoutText: {
    ...Typography.button,
    color: Colors.text,
  },

  bottomPadding: {
    height: 100,
  },
});

export default EarningsDashboardPage;