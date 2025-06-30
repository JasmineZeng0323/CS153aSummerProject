# 🎨 ArtCommission Platform

<div align="center">

![ArtCommission Platform](https://www.portraitflip.com/wp-content/uploads/2023/09/What-Are-Art-Commissions-3-1.jpg)

*A comprehensive dual-role marketplace connecting artists and clients for commissioned artwork*

[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

## 📱 Project Overview

ArtCommission Platform is a sophisticated **dual-role marketplace** built with React Native and Expo. The app seamlessly connects artists and clients through an intuitive interface that supports both **Artist Mode** and **Client Mode**, enabling users to switch roles dynamically based on their needs.

<div align="center">

### 📱 Main Application Pages

<table>
<tr>
<td align="center" width="25%">
<strong>Homepage Gallery</strong><br>
<img src="assets\images\home.jpg" alt="Gallery" width="200" style="margin: 0;"/>
</td>
<td align="center" width="25%">
<strong>Artist Discovery</strong><br>
<img src="assets\images\page2.jpg" alt="Artists" width="200" style="margin: 0;"/>
</td>
<td align="center" width="25%">
<strong>Messages System</strong><br>
<img src="assets\images\page3.jpg" alt="Messages" width="200" style="margin: 0;"/>
</td>
<td align="center" width="25%">
<strong>Profile Management</strong><br>
<img src="assets\images\profile.jpg" alt="Profile" width="200" style="margin: 0;"/>
</td>
</tr>
</table>

### 🔄 Artist Mode Switching & Profile Comparison

<table>
<tr>
<td align="center" width="33%">
<strong>Mode Switching Interface</strong><br>
<img src="assets\images\switchmode.jpg" alt="Mode Switch" width="250"/>
</td>
<td align="center" width="33%">
<strong>Artist Profile</strong><br>
<img src="assets\images\artistprofile.jpg" alt="Artist Profile" width="250"/>
</td>
<td align="center" width="33%">
<strong>Client Profile</strong><br>
<img src="assets\images\profile.jpg" alt="Client Profile" width="250"/>
</td>
</tr>
</table>

### 📝 Publishing System & Workflow Comparison

<table>
<tr>
<td align="center" width="33%">
<strong>Dual Publishing Options</strong><br>
<img src="assets\images\post.png" alt="Publishing Options" width="250"/>
</td>
<td align="center" width="33%">
<strong>Artist Gallery Publishing</strong><br>
<img src="assets\images\gallerypost.jpg" alt="Gallery Publishing" width="250"/>
</td>
<td align="center" width="33%">
<strong>Client Project Posting</strong><br>
<img src="assets\images\projectpost.jpg" alt="Project Posting" width="250"/>
</td>
</tr>
</table>

</div>

## ✨ Core Features Implementation

### 🏠 **Dynamic Homepage with Swipe Navigation**
- **Gallery Tab**: Card-based layout with artist profiles and artwork pricing ($157, $488)
- **Projects Tab**: Commission marketplace with real-time project status tracking
- **24H Express Filter**: Quick access to fast turnaround services with lightning icon
- **Smart Search Integration**: Unified search across galleries, artists, and projects
- **Category Filters**: Recommended, New, Pre-order tabs with visual indicators

### 🎨 **Comprehensive Artist Discovery**
- **Artist Directory**: Verified profiles with "Price List" and "Extended Queue" status badges
- **Portfolio Browse**: Artists like "CuiHuaForgetWhy" and "KingchickenShine" with 5-star ratings
- **Advanced Filtering**: Multi-dimensional filters (Available, Extended Queue, Has Price List, Art Style)
- **Real-time Availability**: Live status indicators with review counts (3 Reviews, 55 Reviews)
- **Dual Tab System**: Artists tab for profiles, Portfolio tab for artwork browsing

### 📋 **Professional Project & Gallery Publishing**
- **Dual Publishing System**: 
  - **Artists**: "Publish Gallery" to upload artwork for sale
  - **Clients**: "Post Project" to commission custom artwork
- **Multi-step Wizard**: Progress-tracked creation process with step indicators
- **Rich Media Support**: High-quality artwork uploads with category classification
- **Flexible Pricing**: Budget ranges ($52-22k) with detailed specifications
- **Publishing Terms**: Clear ownership rights and commission fee structure (10%)

### 💬 **Advanced Messaging System**
- **Conversation Categorization**: All (10), Unread (2), Online filters with badges
- **Real-time Status**: Online indicators and message timestamps (2m ago, 15m ago)
- **Commission Tracking**: Messages from artists like "Alice Chen", "Marco Rodriguez"
- **Smart Filtering**: Commission-related conversations with project context
- **Professional Communication**: Support for draft reviews and milestone discussions

### 👤 **Dynamic Profile Management with Mode Switching**
- **Seamless Mode Transition**: "Switch to Artist" button with visual mode indicators
- **Artist Mode Features**:
  - Artist Mode Active banner with PRO badge
  - Performance metrics: 98% completion rate, 2h avg response, ⭐ 4.9 rating
  - Applied Projects (3), Published Galleries (4), Monthly earnings ($2,847)
  - Specialized dashboard with "View Dashboard" button
- **Client Mode Features**:
  - My Drafts (574), Following Artists (308), Gallery Collection (96)
  - Gallery Orders tracking with purchase history (4 orders purchased)
  - Pending Reviews (1) and Project Collaborations (3 projects in progress)
- **Verification System**: "Verified Artist • Since 6/24/2025" with green checkmark badges

### 🔐 **Flexible Authentication System**
- **Dual Login Methods**: Email verification or username/password
- **User Verification**: Platform verification with artist status tracking
- **Profile Analytics**: Detailed statistics for both artist and client activities
- **Session Management**: Persistent login with user preference storage

## 🛠 Technology Stack & Dependencies

### **Core Framework**
```bash
# Essential Expo and React Native
expo@~51.0.0
react@18.2.0
react-native@0.74.0

# Navigation & Routing
expo-router@~3.5.0
react-native-gesture-handler@~2.16.1
react-native-reanimated@~3.10.1
```

### **Authentication & Storage**
```bash
# Local Data Management
@react-native-async-storage/async-storage@1.23.1

# Biometric Authentication
expo-local-authentication@~14.0.0
```

### **Media & File Handling**
```bash
# Image and Document Management
expo-image-picker@~15.0.0
expo-document-picker@~12.0.0
expo-camera@~15.0.0

# Date & Time Management
@react-native-community/datetimepicker@latest
```

### **Quick Installation**
```bash
# Clone and setup
git clone [your-repository-url]
cd artcommission-platform

# Install dependencies
npm install
expo install

# Start development
npx expo start
```

## 📱 Application Architecture

### **File-based Routing Structure**
```
app/
├── 🔐 Authentication Flow
│   ├── index.tsx               # Smart auth checker with loading states
│   └── login.tsx              # Dual-mode login (email/username)
│
├── 🏠 Core Application Pages
│   ├── homepage.tsx           # Swipeable Gallery/Projects tabs
│   ├── artists.tsx            # Artist discovery with portfolio browse
│   ├── projects.tsx           # Project marketplace with filters
│   └── messages.tsx           # Advanced messaging with categorization
│
├── 📝 Project & Commission Management
│   ├── post-project.tsx       # 7-step project creation wizard
│   ├── applied-projects.tsx   # Project application tracking
│   ├── commission-calendar.tsx # Artist availability management
│   └── add-payment-method.tsx # Payment setup
│
├── 🎨 Gallery & Artwork
│   ├── gallery-detail.tsx     # Gallery item details
│   ├── gallery-collection.tsx # User's gallery collection
│   └── artwork-detail.tsx     # Individual artwork viewing
│
├── 👤 User Management & Profile
│   ├── profile.tsx            # Dynamic mode-switching profile
│   ├── edit-profile.tsx       # Profile customization
│   ├── artist-detail.tsx      # Artist profile viewing
│   ├── artist-verification.tsx # Verification process
│   ├── following-artists.tsx  # Artist following management
│   └── blocked-users.tsx      # User blocking management
│
├── 💬 Communication
│   ├── chat.tsx              # Individual chat interface
│   └── messages.tsx          # Message inbox with filtering
│
├── 💰 Payment & Billing
│   ├── billing.tsx           # Billing management
│   └── change-password.tsx   # Security settings
│
└── 📱 Navigation
    └── _layout.tsx           # Root layout with navigation stack
```

### **Component Architecture**
```
components/
├── 🔄 common/                 # Reusable UI Components
│   ├── ArtistCard.tsx         # Artist profile display cards
│   ├── GalleryCard.tsx        # Artwork preview cards
│   ├── ProjectCard.tsx        # Commission project cards
│   ├── SearchComponent.tsx    # Universal search interface
│   ├── Header.tsx             # Navigation headers
│   ├── StatusBadge.tsx        # Status indicators
│   ├── EmptyState.tsx         # Empty state displays
│   └── LoadingState.tsx       # Loading indicators
│
├── 📋 forms/                  # Form Components
│   ├── FilterModal.tsx        # Advanced filtering interface
│   └── DatePickerModal.tsx    # Date selection modal
│
├── 🎨 styles/                 # Design System
│   ├── Colors.ts              # Color palette definitions
│   ├── Typography.ts          # Text styling standards
│   ├── Layout.ts              # Spacing & layout constants
│   └── GlobalStyles.ts        # Shared styling utilities
│
├── 📱 BottomNavigation.tsx    # Tab navigation
└── 🔧 utils/
    └── BiometricAuth.ts       # Authentication utilities
```
> **Note**: All files are organized in a flat structure within the `app/` 
directory using Expo Router's file-based routing system. The categorization 
above is for documentation purposes to show the logical grouping of related features.

## 🎯 Key Features Implementation

### **Advanced Mode Switching System**
```typescript
// Real-world mode switching interface as shown in screenshots
const ModeSwitchModal = () => (
  <Modal visible={showModeSwitch}>
    <View style={styles.modeSwitchModal}>
      {/* Client Mode Option */}
      <TouchableOpacity style={styles.modeOption}>
        <Text>🛒</Text>
        <View>
          <Text>Client Mode</Text>
          <Text>Browse artists, commission artwork, and manage your orders</Text>
        </View>
      </TouchableOpacity>

      {/* Artist Mode Option with Active State */}
      <TouchableOpacity style={[styles.modeOption, styles.activeModeOption]}>
        <Text>🎨</Text>
        <View>
          <Text>Artist Mode</Text>
          <Text>Manage commissions, upload artwork, and track earnings</Text>
        </View>
        <Text>✓</Text> {/* Active indicator */}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.switchButton}>
        <Text>Switch to Client Mode</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);
```

### **Dynamic Publishing System**
```typescript
// Dual publishing options based on user mode
const AddButtonModal = () => (
  <Modal visible={showAddModal}>
    <View style={styles.addModalContent}>
      {isArtistMode ? (
        // Artist Mode: Publish Gallery + Post Project options
        <>
          <TouchableOpacity onPress={() => router.push('/publish-gallery')}>
            <Text>🖼️ Publish Gallery</Text>
            <Text>Upload your artwork to sell</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/post-project')}>
            <Text>📋 Post Project</Text>
            <Text>Create a project as a client</Text>
          </TouchableOpacity>
        </>
      ) : (
        // Client Mode: Primarily Post Project
        <TouchableOpacity onPress={() => router.push('/post-project')}>
          <Text>📋 Post Project</Text>
          <Text>Commission custom artwork</Text>
        </TouchableOpacity>
      )}
    </View>
  </Modal>
);
```

### **Gallery Publishing Flow**
```typescript
// Multi-step gallery publishing with progress tracking
const PublishGalleryFlow = () => (
  <View style={styles.publishFlow}>
    {/* Progress Indicator: ✓ ✓ ✓ 4 */}
    <ProgressSteps currentStep={4} totalSteps={4} />
    
    <GalleryCard
      title="skdkdm"
      price="$94"
      category="Full Body"
      delivery="Custom Timeline"
      stock={10}
      image={artworkImage}
    />
    
    <PublishingTerms>
      <Text>• You retain full ownership of your artwork</Text>
      <Text>• Commission fees: 10% of each sale</Text>
      <Text>• Payments processed within 24-48 hours</Text>
      <Text>• You can modify or remove listings anytime</Text>
    </PublishingTerms>
    
    <Button title="Publish Gallery" />
  </View>
);
```

## 🚀 Development Status

### ✅ **Completed Core Features**
- [x] **Authentication System**: Email verification + username/password login (`index.tsx`, `login.tsx`)
- [x] **Homepage**: Swipeable gallery/projects interface with search (`homepage.tsx`)
- [x] **Artist Discovery**: Artist directory with portfolio browsing (`artists.tsx`, `artist-detail.tsx`)
- [x] **Project Management**: Project creation and application tracking (`post-project.tsx`, `applied-projects.tsx`)
- [x] **Messaging System**: Real-time chat with conversation management (`messages.tsx`, `chat.tsx`)
- [x] **Profile Management**: Dynamic mode switching with verification (`profile.tsx`, `edit-profile.tsx`)
- [x] **Gallery System**: Artwork viewing and collection management (`gallery-detail.tsx`, `gallery-collection.tsx`)
- [x] **Commission Calendar**: Artist availability scheduling (`commission-calendar.tsx`)
- [x] **Payment Setup**: Payment method configuration (`add-payment-method.tsx`, `billing.tsx`)
- [x] **Social Features**: Artist following and user management (`following-artists.tsx`, `blocked-users.tsx`)
- [x] **Security**: Password management and user verification (`change-password.tsx`, `artist-verification.tsx`)
- [x] **Artist Dashboard**: Manage Artist Info and Protfolio (`artist-dashboard.tsx`)
- [x]  **Advanced Analytics**: Performance metrics and insights  (`gallery-analytics.tsx`)

### 📋 **Future Enhancements**
- [ ] **Push Notifications**: Real-time project updates and messages
- [ ] **Push Notifications**: Real-time updates and alerts
- [ ] **File Management**: Enhanced document and media handling
- [ ] **Commission Workflow**: Advanced project milestone tracking
- [ ] **project/gallery workspace**
- [ ] **Social Features**: Artist following and community features
- [ ] **AI Recommendations**: Smart artist/project matching

## 🎨 Design System

### **Color Palette**
```typescript
// Consistent color usage across the app
export const Colors = {
  primary: '#007AFF',      // Primary actions and highlights
  secondary: '#5856D6',    // Secondary elements
  artist: '#E3F2FD',      // Artist mode background
  verified: '#4CAF50',     // Verification badges
  success: '#34C759',      // Success states
  error: '#FF3B30',        // Error states
  // ... more colors
};
```

### **Typography System**
```typescript
// Standardized text styling
export const Typography = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 28, fontWeight: 'bold' },
  h3: { fontSize: 24, fontWeight: 'bold' },
  body: { fontSize: 16, lineHeight: 24 },
  caption: { fontSize: 12, opacity: 0.7 },
  // ... more styles
};
```

### **Layout Constants**
```typescript
// Consistent spacing and layout
export const Layout = {
  spacing: {
    xs: 4, sm: 8, md: 12, lg: 16,
    xl: 20, xxl: 24, xxxl: 32
  },
  radius: {
    xs: 4, sm: 6, md: 8, lg: 12,
    xl: 16, xxl: 24, round: 50
  }
};
```

## 📊 Performance Optimizations

### **Efficient Data Management**
- **AsyncStorage Integration**: Persistent user data and preferences
- **Image Optimization**: Automatic compression for media uploads
- **Lazy Loading**: Optimized rendering for large datasets
- **Gesture Optimization**: Native driver animations for smooth interactions

### **Memory Management**
- **Component Memoization**: Prevent unnecessary re-renders
- **Image Caching**: Efficient media handling
- **State Optimization**: Minimal state updates and efficient data structures

## 🔧 Development Guidelines

### **Getting Started**
```bash
# Development server
expo start

# Platform-specific testing
expo start --ios      # iOS simulator
expo start --android  # Android emulator
expo start --web      # Web browser testing
```

### **Code Structure Standards**
```typescript
// Consistent component structure
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from './components/styles/Colors';

export default function ComponentName() {
  // Component logic
  return (
    <View style={styles.container}>
      {/* Component content */}
    </View>
  );
}

const styles = StyleSheet.create({
  // Consistent styling
});
```


