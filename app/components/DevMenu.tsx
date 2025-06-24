import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DevMenu = () => {
  const [visible, setVisible] = useState(false);

  if (!__DEV__) return null; // 只在开发模式显示

  const resetActions = [
    {
      title: 'Clear Login Status',
      action: async () => {
        await AsyncStorage.removeItem('isLoggedIn');
        await AsyncStorage.removeItem('userInfo');
        Alert.alert('Success', 'Login status cleared!');
      }
    },
    {
      title: 'Clear All AsyncStorage',
      action: async () => {
        await AsyncStorage.clear();
        Alert.alert('Success', 'All data cleared!');
      }
    },
    {
      title: 'Skip Login Check',
      action: async () => {
        await AsyncStorage.setItem('devSkipLogin', 'true');
        Alert.alert('Success', 'Login check disabled!');
      }
    }
  ];

  return (
    <>
      <TouchableOpacity
        style={styles.devButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.devButtonText}>🛠️</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Developer Menu</Text>
            
            {resetActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionButton}
                onPress={() => {
                  setVisible(false);
                  Alert.alert(
                    'Confirm',
                    `Are you sure you want to ${action.title.toLowerCase()}?`,
                    [
                      { text: 'Cancel' },
                      { text: 'Confirm', onPress: action.action }
                    ]
                  );
                }}
              >
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.actionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  devButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  devButtonText: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#FF5722',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333333',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DevMenu;