/**
 * 
 * Todo: change the calender with the date picker in the component 
 */

import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
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

// Unified container style with proper header spacing
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

interface Commission {
  id: number;
  title: string;
  artist: string;
  artistAvatar: string;
  price: number;
  status: 'completed' | 'in_progress' | 'pending_review';
  progress: number;
  type: 'project' | 'gallery';
}

const CommissionCalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [commissionData, setCommissionData] = useState<Record<string, Commission[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCommissionData();
  }, []);

  const loadCommissionData = async () => {
    try {
      // Mock commission data with deadlines
      const mockData: Record<string, Commission[]> = {
        '2025-06-11': [
          {
            id: 1,
            title: 'Live2D Animation Commission',
            artist: 'Alice Chen',
            artistAvatar: 'https://i.pravatar.cc/40?img=1',
            price: 450,
            status: 'in_progress',
            progress: 20,
            type: 'project'
          }
        ],
        '2025-06-30': [
          {
            id: 2,
            title: 'Character Design Set',
            artist: 'Marco Rodriguez',
            artistAvatar: 'https://i.pravatar.cc/40?img=2',
            price: 320,
            status: 'in_progress',
            progress: 65,
            type: 'gallery'
          },
          {
            id: 3,
            title: 'Fantasy Portrait Commission',
            artist: 'Sakura Tanaka',
            artistAvatar: 'https://i.pravatar.cc/40?img=3',
            price: 180,
            status: 'pending_review',
            progress: 90,
            type: 'project'
          },
          {
            id: 4,
            title: 'Anime Style Illustration',
            artist: 'David Kim',
            artistAvatar: 'https://i.pravatar.cc/40?img=4',
            price: 250,
            status: 'in_progress',
            progress: 40,
            type: 'gallery'
          }
        ],
        '2025-07-10': [
          {
            id: 5,
            title: 'Logo Design Project',
            artist: 'Emma Thompson',
            artistAvatar: 'https://i.pravatar.cc/40?img=5',
            price: 150,
            status: 'in_progress',
            progress: 75,
            type: 'project'
          }
        ],
        '2025-07-12': [
          {
            id: 6,
            title: 'Concept Art Commission',
            artist: 'Alex Petrov',
            artistAvatar: 'https://i.pravatar.cc/40?img=6',
            price: 380,
            status: 'in_progress',
            progress: 30,
            type: 'gallery'
          }
        ]
      };

      setCommissionData(mockData);
    } catch (error) {
      console.error('Error loading commission data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get calendar data for current month 
  const getCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // Get commissions for a specific date
  const getCommissionsForDate = (day: number | null): Commission[] => {
    if (!day) return [];
    
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return commissionData[dateStr] || [];
  };

  // Check if date is today
  const isToday = (day: number | null): boolean => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Check if date is selected
  const isSelected = (day: number | null): boolean => {
    return selectedDate === day;
  };

  // Navigate to previous/next month
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  // Handle date selection
  const handleDatePress = (day: number | null) => {
    if (!day) return;
    setSelectedDate(day);
  };

  // Handle commission item press
  const handleCommissionPress = (commission: Commission) => {
    if (commission.type === 'gallery') {
      router.push({
        pathname: '/order-detail',
        params: {
          orderId: commission.id,
          title: commission.title,
          artistName: commission.artist,
          status: commission.status
        }
      });
    } else {
      router.push({
        pathname: '/project-detail',
        params: {
          projectId: commission.id,
          title: commission.title
        }
      });
    }
  };

  // Get month name
  const getMonthName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long' });
  };

  // Get total commissions for current month
  const getTotalCommissions = (): number => {
    let total = 0;
    Object.keys(commissionData).forEach(dateStr => {
      const date = new Date(dateStr);
      if (date.getMonth() === currentDate.getMonth() && 
          date.getFullYear() === currentDate.getFullYear()) {
        total += commissionData[dateStr].length;
      }
    });
    return total;
  };

  // Render calendar header with navigation
  const renderCalendarHeader = () => (
    <View style={styles.calendarHeader}>
      <TouchableOpacity 
        style={styles.monthNavButton}
        onPress={() => navigateMonth(-1)}
      >
        <Text style={styles.monthNavIcon}>‹</Text>
      </TouchableOpacity>
      
      <View style={styles.monthInfo}>
        <Text style={styles.monthTitle}>
          {getMonthName(currentDate)} {currentDate.getFullYear()}
        </Text>
        <Text style={styles.monthSubtitle}>
          This month has {getTotalCommissions()} collaborations
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.monthNavButton}
        onPress={() => navigateMonth(1)}
      >
        <Text style={styles.monthNavIcon}>›</Text>
      </TouchableOpacity>
    </View>
  );

  // Render week days header
  const renderWeekHeader = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <View style={styles.weekHeader}>
        {weekDays.map((day) => (
          <View key={day} style={styles.weekDay}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Render calendar grid (using DatePickerModal style)
  const renderCalendarGrid = () => (
    <View style={styles.calendarGrid}>
      {getCalendarData().map((day, index) => {
        const commissions = getCommissionsForDate(day);
        const hasCommissions = commissions.length > 0;
        
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.calendarDay,
              isToday(day) && styles.todayDay,
              isSelected(day) && styles.selectedDay,
              hasCommissions && styles.hasCommissionsDay
            ]}
            onPress={() => handleDatePress(day)}
            disabled={!day}
          >
            {day && (
              <>
                <Text style={[
                  styles.dayNumber,
                  isToday(day) && styles.todayText,
                  isSelected(day) && styles.selectedText
                ]}>
                  {day}
                </Text>
                {hasCommissions && (
                  <View style={styles.commissionIndicator}>
                    <Text style={styles.commissionCount}>
                      {commissions.length}
                    </Text>
                  </View>
                )}
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // Render commission card
  const renderCommissionCard = (commission: Commission) => (
    <TouchableOpacity
      key={commission.id}
      style={styles.commissionCard}
      onPress={() => handleCommissionPress(commission)}
    >
      <View style={styles.commissionHeader}>
        <Image 
          source={{ uri: commission.artistAvatar }} 
          style={styles.artistAvatar} 
        />
        <View style={styles.commissionInfo}>
          <Text style={styles.artistName}>{commission.artist}</Text>
          <View style={styles.commissionBadge}>
            <Text style={styles.commissionBadgeText}>
              {commission.type === 'gallery' ? 'Gallery Order' : 'Project'}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.commissionTitle}>{commission.title}</Text>
      
      <View style={styles.commissionMeta}>
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>
            🔄 In Progress {commission.progress}%
          </Text>
          <Text style={styles.priceText}>${commission.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render selected date details
  const renderSelectedDateDetails = () => {
    if (!selectedDate) return null;

    const commissions = getCommissionsForDate(selectedDate);
    
    return (
      <View style={styles.selectedDateSection}>
        <Text style={styles.selectedDateTitle}>
          {currentDate.getFullYear()}-{String(currentDate.getMonth() + 1).padStart(2, '0')}-{String(selectedDate).padStart(2, '0')} 
          {' '}That day has {commissions.length} collaborations
        </Text>
        
        {commissions.length > 0 ? (
          commissions.map(renderCommissionCard)
        ) : (
          <EmptyState
            icon="📅"
            title="No Commissions"
            description="No commissions scheduled for this date."
            size="small"
          />
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={AppStyles.container}>
        <Header 
          title="Commission Calendar" 
          showBackButton={true}
        />
        <LoadingState text="Loading calendar..." />
      </View>
    );
  }

  return (
    <View style={AppStyles.container}>
      {/* Header */}
      <Header 
        title="Commission Calendar" 
        showBackButton={true}
        style={AppStyles.header}
        rightElement={
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => setSelectedDate(new Date().getDate())}
          >
            <Text style={styles.searchText}>Search</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar Header with Month Navigation */}
        {renderCalendarHeader()}

        {/* Week Days Header */}
        {renderWeekHeader()}

        {/* Calendar Grid */}
        {renderCalendarGrid()}

        {/* Selected Date Details */}
        {renderSelectedDateDetails()}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },

  // Search button
  searchButton: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  searchText: {
    ...Typography.buttonSmall,
    color: Colors.primary,
  },

  // Calendar Header (similar to DatePickerModal)
  calendarHeader: {
    ...Layout.rowSpaceBetween,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.xl,
  },
  monthNavButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.surface,
    ...Layout.columnCenter,
  },
  monthNavIcon: {
    fontSize: 24,
    color: Colors.text,
  },
  monthInfo: {
    alignItems: 'center',
    flex: 1,
  },
  monthTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  monthSubtitle: {
    ...Typography.bodySmallMuted,
  },

  // Week Header (same as DatePickerModal)
  weekHeader: {
    ...Layout.row,
    paddingHorizontal: Layout.spacing.xl,
    paddingBottom: Layout.spacing.md,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
  },

  // Calendar Grid (adapted from DatePickerModal)
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  calendarDay: {
    width: (screenWidth - Layout.spacing.xl * 2) / 7,
    height: 60,
    ...Layout.columnCenter,
    position: 'relative',
    marginBottom: Layout.spacing.sm,
    borderRadius: Layout.radius.sm,
  },
  todayDay: {
    backgroundColor: Colors.primary,
  },
  selectedDay: {
    backgroundColor: Colors.secondary,
  },
  hasCommissionsDay: {
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  dayNumber: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '500',
  },
  todayText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  selectedText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  commissionIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: Colors.secondary,
    borderRadius: Layout.radius.round,
    minWidth: 16,
    height: 16,
    ...Layout.columnCenter,
  },
  commissionCount: {
    ...Typography.badge,
    fontSize: 10,
  },

  // Selected Date Section
  selectedDateSection: {
    marginTop: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.xl,
  },
  selectedDateTitle: {
    ...Typography.h6,
    color: Colors.text,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  
  // Commission Card
  commissionCard: {
    ...Layout.card,
    marginBottom: Layout.spacing.md,
  },
  commissionHeader: {
    ...Layout.row,
    marginBottom: Layout.spacing.md,
  },
  artistAvatar: {
    ...Layout.avatar,
    marginRight: Layout.spacing.md,
  },
  commissionInfo: {
    flex: 1,
  },
  artistName: {
    ...Typography.h6,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  commissionBadge: {
    backgroundColor: Colors.card,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: Layout.radius.md,
    alignSelf: 'flex-start',
  },
  commissionBadgeText: {
    ...Typography.badge,
    fontSize: 10,
    color: Colors.text,
  },
  commissionTitle: {
    ...Typography.bodyMuted,
    marginBottom: Layout.spacing.md,
    lineHeight: 20,
  },
  commissionMeta: {
    ...Layout.rowSpaceBetween,
  },
  progressSection: {
    flex: 1,
  },
  progressLabel: {
    ...Typography.caption,
    color: Colors.warning,
    marginBottom: Layout.spacing.xs,
  },
  priceText: {
    ...Typography.price,
  },

  bottomPadding: {
    height: Layout.spacing.xxxl,
  },
});

export default CommissionCalendarPage;