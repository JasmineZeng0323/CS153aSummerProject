/**
 * Not been used. Want to create a universe date picker but failed to show all dates
 * there are sun --- sat, but dates shows 1---6, 7 wraps to sun again. 
 */
//app/components/forms/DatePickerModal.tsx

import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../styles/Colors';
import { Layout } from '../styles/Layout';
import { Typography } from '../styles/Typography';

const { width: screenWidth } = Dimensions.get('window');

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  selectedDate?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  title?: string;
  showToday?: boolean;
  highlightToday?: boolean;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onDateSelect,
  selectedDate,
  minDate,
  maxDate,
  title = 'Select Date',
  showToday = true,
  highlightToday = true
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(selectedDate || null);

  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
      setInternalSelectedDate(selectedDate);
    }
  }, [selectedDate]);

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

  // Check if a date is disabled
  const isDateDisabled = (day: number | null) => {
    if (!day) return true;
    
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    
    return false;
  };

  // Check if date is today
  const isToday = (day: number | null) => {
    if (!day || !highlightToday) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Check if date is selected
  const isSelected = (day: number | null) => {
    if (!day || !internalSelectedDate) return false;
    return (
      day === internalSelectedDate.getDate() &&
      currentDate.getMonth() === internalSelectedDate.getMonth() &&
      currentDate.getFullYear() === internalSelectedDate.getFullYear()
    );
  };

  // Navigate to previous/next month
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Handle date selection
  const handleDatePress = (day: number | null) => {
    if (!day || isDateDisabled(day)) return;
    
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setInternalSelectedDate(selectedDate);
  };

  // Handle confirm selection
  const handleConfirm = () => {
    if (internalSelectedDate) {
      onDateSelect(internalSelectedDate);
      onClose();
    }
  };

  // Handle today button
  const handleTodayPress = () => {
    const today = new Date();
    setCurrentDate(today);
    setInternalSelectedDate(today);
  };

  // Get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long' });
  };

  // Check if today button should be disabled
  const isTodayDisabled = () => {
    const today = new Date();
    if (minDate && today < minDate) return true;
    if (maxDate && today > maxDate) return true;
    return false;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Header with Month Navigation */}
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
            </View>
            
            <TouchableOpacity 
              style={styles.monthNavButton}
              onPress={() => navigateMonth(1)}
            >
              <Text style={styles.monthNavIcon}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Week Days Header */}
          <View style={styles.weekHeader}>
            {weekDays.map((day) => (
              <View key={day} style={styles.weekDay}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {getCalendarData().map((day, index) => {
              const disabled = isDateDisabled(day);
              const todayDate = isToday(day);
              const selected = isSelected(day);
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    todayDate && styles.todayDay,
                    selected && styles.selectedDay,
                    disabled && styles.disabledDay
                  ]}
                  onPress={() => handleDatePress(day)}
                  disabled={disabled}
                >
                  {day && (
                    <Text style={[
                      styles.dayNumber,
                      todayDate && styles.todayText,
                      selected && styles.selectedText,
                      disabled && styles.disabledText
                    ]}>
                      {day}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {showToday && (
              <TouchableOpacity 
                style={[
                  styles.todayButton,
                  isTodayDisabled() && styles.disabledButton
                ]}
                onPress={handleTodayPress}
                disabled={isTodayDisabled()}
              >
                <Text style={[
                  styles.todayButtonText,
                  isTodayDisabled() && styles.disabledButtonText
                ]}>
                  Today
                </Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.confirmButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.confirmButton,
                  !internalSelectedDate && styles.disabledButton
                ]}
                onPress={handleConfirm}
                disabled={!internalSelectedDate}
              >
                <Text style={[
                  styles.confirmButtonText,
                  !internalSelectedDate && styles.disabledButtonText
                ]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Selected Date Display */}
          {internalSelectedDate && (
            <View style={styles.selectedDateDisplay}>
              <Text style={styles.selectedDateText}>
                Selected: {internalSelectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.lg,
    width: Math.min(screenWidth - 40, 400),
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    ...Typography.h6,
    color: Colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Calendar Header
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
  },
  monthNavButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
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
    ...Typography.h5,
    color: Colors.text,
  },

  // Week Header
  weekHeader: {
    flexDirection: 'row',
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

  // Calendar Grid
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  calendarDay: {
    width: (Math.min(screenWidth - 40, 400) - Layout.spacing.xl * 2) / 7,
    height: 44, // 减小高度从 48 到 44
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3, // 减小间距从 Layout.spacing.xs (4) 到 3
    borderRadius: Layout.radius.sm,
  },
  todayDay: {
    backgroundColor: Colors.primary,
  },
  selectedDay: {
    backgroundColor: Colors.secondary,
  },
  disabledDay: {
    opacity: 0.3,
  },
  dayNumber: {
    fontSize: 14, // 缩小字体从 Typography.body (16px) 到 14px
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
  disabledText: {
    color: Colors.textDisabled,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingBottom: Layout.spacing.lg,
  },
  todayButton: {
    backgroundColor: Colors.card,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
  },
  todayButtonText: {
    ...Typography.buttonSmall,
    color: Colors.primary,
  },
  confirmButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.card,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
    marginRight: Layout.spacing.sm,
  },
  cancelButtonText: {
    ...Typography.buttonSmall,
    color: Colors.textMuted,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
  },
  confirmButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
  },
  disabledButton: {
    backgroundColor: Colors.card,
    opacity: 0.5,
  },
  disabledButtonText: {
    color: Colors.textDisabled,
  },

  // Selected Date Display
  selectedDateDisplay: {
    backgroundColor: Colors.card,
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
    padding: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
  },
  selectedDateText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default DatePickerModal;