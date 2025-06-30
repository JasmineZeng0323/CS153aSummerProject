//app/components/forms/FilterModal.tsx
import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../styles/Colors';
import { Layout } from '../styles/Layout';
import { Typography } from '../styles/Typography';

export interface FilterOption {
  id: string;
  title: string;
  icon?: string;
}

export interface FilterSection {
  id: string;
  title: string;
  options: FilterOption[];
  multiSelect?: boolean; // 是否支持多选，默认为单选
}

interface FilterModalProps {
  visible: boolean;
  title?: string;
  sections: FilterSection[];
  selectedFilters: Record<string, string[]>; // sectionId -> selectedOptionIds[]
  onFilterChange: (sectionId: string, optionId: string, isSelected: boolean) => void;
  onReset: () => void;
  onApply: () => void;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  title = 'Filters',
  sections,
  selectedFilters,
  onFilterChange,
  onReset,
  onApply,
  onClose,
}) => {
  const isOptionSelected = (sectionId: string, optionId: string): boolean => {
    return selectedFilters[sectionId]?.includes(optionId) || false;
  };

  const handleOptionPress = (sectionId: string, optionId: string) => {
    const isSelected = isOptionSelected(sectionId, optionId);
    onFilterChange(sectionId, optionId, !isSelected);
  };

  const renderFilterOption = (section: FilterSection, option: FilterOption, index: number) => {
    const isSelected = isOptionSelected(section.id, option.id);
    const isLastInRow = (index + 1) % 4 === 0; // Every 4th item
    
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.gridFilterOption, 
          isSelected && styles.selectedGridFilter,
          isLastInRow && styles.lastInRow // Remove right margin for last item in row
        ]}
        onPress={() => handleOptionPress(section.id, option.id)}
      >
        <View style={styles.gridFilterContent}>
          {option.icon && <Text style={styles.gridFilterIcon}>{option.icon}</Text>}
          <Text style={[styles.gridFilterText, isSelected && styles.selectedGridFilterText]}>
            {option.title}
          </Text>
        </View>
        <View style={[styles.gridCheckbox, isSelected && styles.gridCheckboxSelected]}>
          {isSelected && <Text style={styles.gridCheckmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterSection = (section: FilterSection) => (
    <View key={section.id} style={styles.filterSection}>
      <Text style={styles.filterSectionTitle}>{section.title}</Text>
      <View style={styles.gridContainer}>
        {section.options.map((option, index) => renderFilterOption(section, option, index))}
      </View>
    </View>
  );

  const getTotalSelectedCount = (): number => {
    return Object.values(selectedFilters).reduce(
      (total, filters) => total + filters.length,
      0
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Sections */}
          <ScrollView 
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {sections.map(renderFilterSection)}
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.resetButton} onPress={onReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={onApply}>
              <Text style={styles.applyButtonText}>
                Apply{getTotalSelectedCount() > 0 ? ` (${getTotalSelectedCount()})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    ...Layout.modalOverlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Layout.radius.xl,
    borderTopRightRadius: Layout.radius.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    ...Layout.rowSpaceBetween,
    ...Layout.paddingAll,
    ...Layout.borderBottom,
  },
  modalTitle: {
    ...Typography.h5,
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
    color: Colors.textMuted,
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
  },
  filterSection: {
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.lg,
  },
  filterSectionTitle: {
    ...Typography.h6,
    marginBottom: Layout.spacing.lg,
  },
  
  // Grid Layout Styles - proper 4 columns layout
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  gridFilterOption: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '23.5%', // 4 columns: (100% - 3 gaps) / 4
    minHeight: 48,
    padding: Layout.spacing.sm,
    justifyContent: 'space-between',
    marginRight: '2%', // Gap between items
    marginBottom: Layout.spacing.sm, // Gap between rows
  },
  selectedGridFilter: {
    backgroundColor: Colors.artist,
    borderColor: Colors.primary,
  },
  lastInRow: {
    marginRight: 0, // Remove right margin for last item in each row
  },
  gridFilterContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  gridFilterIcon: {
    fontSize: 16,
    marginBottom: Layout.spacing.xs,
  },
  gridFilterText: {
    ...Typography.caption,
    textAlign: 'center',
    lineHeight: 12,
    fontSize: 10,
  },
  selectedGridFilterText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  gridCheckbox: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridCheckboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  gridCheckmark: {
    color: Colors.text,
    fontSize: 8,
    fontWeight: 'bold',
  },
  
  modalActions: {
    flexDirection: 'row',
    padding: Layout.spacing.xl,
    gap: Layout.spacing.md,
    ...Layout.borderTop,
  },
  resetButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
  },
  resetButtonText: {
    ...Typography.button,
    color: Colors.textMuted,
  },
  applyButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
  },
  applyButtonText: {
    ...Typography.button,
  },
});

export default FilterModal;