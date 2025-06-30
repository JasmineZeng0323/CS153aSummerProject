//app/components/styles/GlobalStyles.ts
import { StyleSheet } from 'react-native';
import { Colors } from './Colors';
import { Layout } from './Layout';
import { Typography } from './Typography';

export const GlobalStyles = StyleSheet.create({
  // Base Container Styles
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 0,
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 0,
  },
  
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Common Header Styles
  header: {
    ...Layout.header,
    paddingTop: 50,
    backgroundColor: Colors.background,
  },
  
  headerTitle: {
    ...Typography.h5,
    color: Colors.text,
  },
  
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  backIcon: {
    fontSize: 24,
    color: Colors.text,
  },
  
  // Button Styles
  primaryButton: {
    ...Layout.button,
    backgroundColor: Colors.primary,
  },
  
  primaryButtonText: {
    ...Typography.button,
    color: Colors.text,
  },
  
  secondaryButton: {
    ...Layout.button,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  
  secondaryButtonText: {
    ...Typography.button,
    color: Colors.text,
  },
  
  disabledButton: {
    ...Layout.button,
    backgroundColor: Colors.card,
  },
  
  disabledButtonText: {
    ...Typography.button,
    color: Colors.textDisabled,
  },
  
  // Card Styles
  card: {
    ...Layout.card,
    ...Layout.marginBottom,
  },
  
  cardHeader: {
    ...Layout.rowSpaceBetween,
    marginBottom: Layout.spacing.md,
  },
  
  cardTitle: {
    ...Typography.h6,
  },
  
  cardContent: {
    marginBottom: Layout.spacing.sm,
  },
  
  // Input Styles
  input: {
    ...Layout.input,
    ...Typography.body,
  },
  
  inputFocused: {
    borderColor: Colors.primary,
  },
  
  inputError: {
    borderColor: Colors.error,
  },
  
  inputLabel: {
    ...Typography.label,
    marginBottom: Layout.spacing.sm,
  },
  
  // Text Styles
  title: Typography.h4,
  subtitle: Typography.bodyMuted,
  body: Typography.body,
  caption: Typography.caption,
  
  // Badge Styles
  badge: {
    ...Layout.badge,
    backgroundColor: Colors.primary,
  },
  
  badgeText: {
    ...Typography.badge,
    color: Colors.text,
  },
  
  statusBadge: {
    ...Layout.badge,
    backgroundColor: Colors.success,
  },
  
  warningBadge: {
    ...Layout.badge,
    backgroundColor: Colors.warning,
  },
  
  errorBadge: {
    ...Layout.badge,
    backgroundColor: Colors.error,
  },
  
  // Avatar Styles
  avatar: Layout.avatar,
  avatarLarge: Layout.avatarLarge,
  
  // List Item Styles
  listItem: {
    ...Layout.listItem,
    backgroundColor: Colors.surface,
  },
  
  listItemContent: {
    flex: 1,
    marginLeft: Layout.spacing.md,
  },
  
  listItemTitle: Typography.body,
  listItemSubtitle: Typography.bodySmallMuted,
  
  // Loading State
  loadingContainer: {
    ...Layout.columnCenter,
    flex: 1,
    padding: Layout.spacing.xl,
  },
  
  loadingText: {
    ...Typography.bodyMuted,
    marginTop: Layout.spacing.md,
  },
  
  // Empty State
  emptyContainer: {
    ...Layout.columnCenter,
    flex: 1,
    padding: Layout.spacing.xxxl,
  },
  
  emptyIcon: {
    fontSize: 64,
    marginBottom: Layout.spacing.lg,
  },
  
  emptyTitle: {
    ...Typography.h5,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  
  emptyText: {
    ...Typography.bodyMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Layout.spacing.xl,
  },
  
  // Modal Styles
  modalOverlay: Layout.modalOverlay,
  
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.lg,
    margin: Layout.spacing.xl,
    maxHeight: '80%',
  },
  
  modalHeader: {
    ...Layout.rowSpaceBetween,
    ...Layout.paddingAll,
    ...Layout.borderBottom,
  },
  
  modalTitle: Typography.h6,
  
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    ...Layout.borderBottom,
  },
  
  tab: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  
  tabText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  
  activeTabText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  
  // Filter Styles
  filterContainer: {
    flexDirection: 'row',
    ...Layout.paddingHorizontal,
    marginBottom: Layout.spacing.lg,
    flexWrap: 'wrap',
  },
  
  filterButton: {
    ...Layout.buttonSmall,
    backgroundColor: Colors.surface,
    marginRight: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  
  activeFilterButton: {
    backgroundColor: Colors.primary,
  },
  
  filterButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
  },
  
  // Progress Bar
  progressBar: {
    height: 4,
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.xs,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Layout.radius.xs,
  },
  
  // Rating Stars
  ratingContainer: {
    ...Layout.row,
    alignItems: 'center',
  },
  
  ratingStar: {
    fontSize: 16,
    color: Colors.rating,
    marginRight: 2,
  },
  
  ratingText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginLeft: Layout.spacing.sm,
  },
  
  // Artist/Gallery Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...Layout.paddingHorizontal,
  },
  
  gridItem: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: Layout.spacing.lg,
  },
  
  // Action Bar
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    paddingVertical: Layout.spacing.md,
    ...Layout.borderTop,
  },
  
  actionButton: {
    alignItems: 'center',
    padding: Layout.spacing.sm,
  },
  
  actionIcon: {
    fontSize: 20,
    marginBottom: Layout.spacing.xs,
    color: Colors.textMuted,
  },
  
  actionText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  
  // Utility Classes
  flex1: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  flexColumn: { flexDirection: 'column' },
  alignCenter: { alignItems: 'center' },
  justifyCenter: { justifyContent: 'center' },
  textCenter: { textAlign: 'center' },
  
  // Common Spacing
  marginBottomSmall: { marginBottom: Layout.spacing.sm },
  marginBottomMedium: { marginBottom: Layout.spacing.md },
  marginBottomLarge: { marginBottom: Layout.spacing.lg },
  
  paddingHorizontalSmall: { paddingHorizontal: Layout.spacing.sm },
  paddingHorizontalMedium: { paddingHorizontal: Layout.spacing.md },
  paddingHorizontalLarge: { paddingHorizontal: Layout.spacing.lg },
  
  // Bottom padding for scroll views
  bottomPadding: { height: 100 },
});

export default GlobalStyles;