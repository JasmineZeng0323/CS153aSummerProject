
import { ViewStyle } from 'react-native';
import { Colors } from './Colors';

export const Layout = {
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Border Radius
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    round: 50,
  },
  
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  } as ViewStyle,
  
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  } as ViewStyle,
  
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  } as ViewStyle,
  
  // Card Styles
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  } as ViewStyle,
  
  cardSmall: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
  } as ViewStyle,
  
  cardLarge: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
  } as ViewStyle,
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  } as ViewStyle,
  
  headerSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  } as ViewStyle,
  
  // Button Styles
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  buttonSmall: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  buttonLarge: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  // Row and Column Layouts
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  
  column: {
    flexDirection: 'column',
  } as ViewStyle,
  
  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  
  // Input Styles
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    fontSize: 16,
  } as ViewStyle,
  
  inputSmall: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    fontSize: 14,
  } as ViewStyle,
  
  // Badge and Tag Styles
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  // Avatar Styles
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  } as ViewStyle,
  
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  } as ViewStyle,
  
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
  } as ViewStyle,
  
  avatarXLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
  } as ViewStyle,
  
  // List Styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  } as ViewStyle,
  
  listItemLast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  } as ViewStyle,
  
  // Shadow Styles
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  } as ViewStyle,
  
  shadowSmall: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  } as ViewStyle,
  
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  } as ViewStyle,
  
  // Overlay Styles
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay,
  } as ViewStyle,
  
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  
  // Border Styles
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  } as ViewStyle,
  
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  } as ViewStyle,
  
  borderAll: {
    borderWidth: 1,
    borderColor: Colors.border,
  } as ViewStyle,
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  } as ViewStyle,
  
  dividerThick: {
    height: 2,
    backgroundColor: Colors.border,
    marginVertical: 12,
  } as ViewStyle,
  
  // Common Paddings
  paddingHorizontal: {
    paddingHorizontal: 20,
  } as ViewStyle,
  
  paddingVertical: {
    paddingVertical: 16,
  } as ViewStyle,
  
  paddingAll: {
    padding: 16,
  } as ViewStyle,
  
  // Margin shortcuts
  marginBottom: {
    marginBottom: 16,
  } as ViewStyle,
  
  marginTop: {
    marginTop: 16,
  } as ViewStyle,
  
  marginHorizontal: {
    marginHorizontal: 20,
  } as ViewStyle,
} as const;

export type LayoutKey = keyof typeof Layout;