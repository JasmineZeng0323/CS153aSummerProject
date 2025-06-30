//chat.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Colors } from './components/styles/Colors';
import { GlobalStyles } from './components/styles/GlobalStyles';
import { Layout } from './components/styles/Layout';
import { Typography } from './components/styles/Typography';

interface Message {
  id: number;
  text: string;
  time: string;
  isSender: boolean;
  type: 'text' | 'image' | 'file';
  imageUrl?: string;
  fileName?: string;
}

const ChatPage = () => {
  const params = useLocalSearchParams();
  const { chatId, chatName, chatAvatar, isOnline } = params;
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Default messages
  const defaultMessages: Message[] = [
    {
      id: 1,
      text: 'Hi there! I saw your portfolio and I\'m really interested in commissioning you for a character design.',
      time: '10:30',
      isSender: true,
      type: 'text'
    },
    {
      id: 2,
      text: 'Hello! Thank you for reaching out. I\'d love to work on your project. What kind of character are you looking for?',
      time: '10:32',
      isSender: false,
      type: 'text'
    },
    {
      id: 3,
      text: 'I need an anime-style character portrait. Something like a fantasy mage with detailed clothing and magical elements.',
      time: '10:35',
      isSender: true,
      type: 'text'
    },
    {
      id: 4,
      text: 'Here are some reference images I found:',
      time: '10:36',
      isSender: true,
      type: 'text'
    },
    {
      id: 5,
      text: 'Reference Image',
      time: '10:36',
      isSender: true,
      type: 'image',
      imageUrl: 'https://picsum.photos/seed/ref1/300/400'
    },
    {
      id: 6,
      text: 'Perfect! I love working with fantasy characters. Based on your description and reference, my rate would be $200 for a full character portrait with detailed background.',
      time: '10:45',
      isSender: false,
      type: 'text'
    },
    {
      id: 7,
      text: 'That sounds great! What\'s your typical timeline for this type of work?',
      time: '10:47',
      isSender: true,
      type: 'text'
    }
  ];

  const commonEmojis = ['😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎨', '✨', '🔥', '💯', '😍', '🤔', '👏', '🙏'];

  useEffect(() => {
    // Load messages from storage when component mounts
    loadMessages();
  }, []);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (!isLoading) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isLoading]);

  const getStorageKey = () => `chat_messages_${chatId}`;

  const loadMessages = async () => {
    try {
      const storageKey = getStorageKey();
      const storedMessages = await AsyncStorage.getItem(storageKey);
      
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        setMessages(parsedMessages);
      } else {
        // If no stored messages, use default messages
        setMessages(defaultMessages);
        // Save default messages to storage
        await AsyncStorage.setItem(storageKey, JSON.stringify(defaultMessages));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // Fallback to default messages
      setMessages(defaultMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMessages = async (newMessages: Message[]) => {
    try {
      const storageKey = getStorageKey();
      await AsyncStorage.setItem(storageKey, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const sendMessage = async (messageText = message, messageType: 'text' | 'image' | 'file' = 'text', imageUrl?: string, fileName?: string) => {
    if (messageText.trim() || messageType !== 'text') {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageText || (messageType === 'image' ? 'Image' : 'File'),
        time: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        isSender: true,
        type: messageType,
        imageUrl,
        fileName
      };
      
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      
      // Save messages to storage
      await saveMessages(updatedMessages);
      
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiPress = (emoji: string) => {
    setMessage(message + emoji);
    setShowEmojiPicker(false);
  };

  const handleImagePress = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        console.log('Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        sendMessage('', 'image', imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleAttachmentPress = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        sendMessage(file.name, 'file', undefined, file.name);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleAvatarPress = () => {
    router.push({
      pathname: '/artist-detail',
      params: {
        artistId: chatId,
        artistName: chatName,
        artistAvatar: chatAvatar
      }
    });
  };

  // Render custom header
  const renderCustomHeader = () => (
    <View style={styles.customHeader}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.headerCenter} onPress={handleAvatarPress}>
        <Image 
          source={{ uri: chatAvatar as string || `https://picsum.photos/seed/user${chatId}/40/40` }} 
          style={styles.headerAvatar} 
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chatName || 'Artist Name'}</Text>
          <Text style={[
            styles.headerStatus,
            { color: isOnline === 'true' ? Colors.online : Colors.textMuted }
          ]}>
            {isOnline === 'true' ? 'Online' : 'Last seen recently'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Removed more button */}
      <View style={styles.headerSpacer} />
    </View>
  );

  // Render message
  const renderMessage = (msg: Message) => {
    return (
      <View key={msg.id} style={[
        styles.messageContainer,
        msg.isSender ? styles.senderMessage : styles.receiverMessage
      ]}>
        {!msg.isSender && (
          <TouchableOpacity onPress={handleAvatarPress}>
            <Image 
              source={{ uri: chatAvatar as string || `https://picsum.photos/seed/user${chatId}/40/40` }} 
              style={styles.messageAvatar} 
            />
          </TouchableOpacity>
        )}
        
        <View style={[
          styles.messageBubble,
          msg.isSender ? styles.senderBubble : styles.receiverBubble
        ]}>
          {msg.type === 'image' ? (
            <View>
              <Image source={{ uri: msg.imageUrl }} style={styles.messageImage} />
              {msg.text !== 'Image' && (
                <Text style={[
                  styles.messageText,
                  msg.isSender ? styles.senderText : styles.receiverText
                ]}>
                  {msg.text}
                </Text>
              )}
            </View>
          ) : msg.type === 'file' ? (
            <View style={styles.fileContainer}>
              <Text style={styles.fileIcon}>📎</Text>
              <Text style={[
                styles.fileName,
                msg.isSender ? styles.senderText : styles.receiverText
              ]}>
                {msg.fileName || msg.text}
              </Text>
            </View>
          ) : (
            <Text style={[
              styles.messageText,
              msg.isSender ? styles.senderText : styles.receiverText
            ]}>
              {msg.text}
            </Text>
          )}
          
          <Text style={[
            styles.messageTime,
            msg.isSender ? styles.senderTime : styles.receiverTime
          ]}>
            {msg.time}
          </Text>
        </View>

        {msg.isSender && <View style={styles.avatarPlaceholder} />}
      </View>
    );
  };

  // Render emoji picker
  const renderEmojiPicker = () => (
    <Modal
      visible={showEmojiPicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowEmojiPicker(false)}
    >
      <TouchableOpacity 
        style={styles.emojiModalOverlay}
        onPress={() => setShowEmojiPicker(false)}
      >
        <View style={styles.emojiPicker}>
          <Text style={styles.emojiPickerTitle}>Choose an emoji</Text>
          <View style={styles.emojiGrid}>
            {commonEmojis.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                style={styles.emojiButton}
                onPress={() => handleEmojiPress(emoji)}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Render input area
  const renderInputArea = () => (
    <View style={styles.inputContainer}>
      <View style={styles.inputArea}>
        <TextInput
          style={styles.messageInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={1000}
          blurOnSubmit={false}
          onSubmitEditing={() => {
            if (message.trim()) {
              sendMessage();
            }
          }}
        />
        
        <View style={styles.inputActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setShowEmojiPicker(true)}
          >
            <Text style={styles.actionIcon}>😊</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleImagePress}>
            <Text style={styles.actionIcon}>📷</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleAttachmentPress}>
            <Text style={styles.actionIcon}>📎</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.sendButton, 
          message.trim() ? styles.sendButtonActive : styles.sendButtonInactive
        ]}
        onPress={() => {
          if (message.trim()) {
            sendMessage();
            dismissKeyboard();
          }
        }}
        disabled={!message.trim()}
      >
        <Text style={styles.sendIcon}>→</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={GlobalStyles.container}>
      {/* Custom header */}
      {renderCustomHeader()}

      {/* Chat content */}
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.chatContainer}>
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map(renderMessage)}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>

      {/* Input area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {renderInputArea()}
      </KeyboardAvoidingView>

      {/* Emoji picker */}
      {renderEmojiPicker()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Custom header
  customHeader: {
    ...Layout.rowSpaceBetween,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    ...Layout.borderBottom,
  },
  backButton: {
    width: 40,
    height: 40,
    ...Layout.columnCenter,
  },
  backIcon: {
    ...Typography.h4,
    color: Colors.text,
  },
  headerCenter: {
    flex: 1,
    ...Layout.row,
    marginLeft: Layout.spacing.sm,
  },
  headerAvatar: {
    ...Layout.avatar,
    marginRight: Layout.spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    ...Typography.h6,
    color: Colors.text,
  },
  headerStatus: {
    ...Typography.caption,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40, // Same width as back button for balance
  },

  // Chat container
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
  },
  messagesContent: {
    paddingVertical: Layout.spacing.sm,
    flexGrow: 1,
  },

  // Message styles
  messageContainer: {
    ...Layout.row,
    marginVertical: Layout.spacing.xs,
    alignItems: 'flex-end',
  },
  senderMessage: {
    justifyContent: 'flex-end',
  },
  receiverMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    ...Layout.avatarSmall,
    marginRight: Layout.spacing.sm,
    marginBottom: Layout.spacing.xs,
  },
  avatarPlaceholder: {
    width: 40,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: 18,
    marginHorizontal: Layout.spacing.xs,
  },
  senderBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: Layout.spacing.xs,
  },
  receiverBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: Layout.spacing.xs,
  },
  messageText: {
    ...Typography.body,
    lineHeight: 22,
  },
  senderText: {
    color: Colors.text,
  },
  receiverText: {
    color: Colors.text,
  },
  messageTime: {
    ...Typography.caption,
    marginTop: Layout.spacing.xs,
    opacity: 0.7,
  },
  senderTime: {
    color: Colors.text,
    alignSelf: 'flex-end',
  },
  receiverTime: {
    color: Colors.textMuted,
    alignSelf: 'flex-start',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: Layout.radius.md,
    marginBottom: Layout.spacing.sm,
  },
  fileContainer: {
    ...Layout.row,
    paddingVertical: Layout.spacing.sm,
  },
  fileIcon: {
    fontSize: 20,
    marginRight: Layout.spacing.sm,
  },
  fileName: {
    ...Typography.bodySmall,
    flex: 1,
  },

  // Input area
  inputContainer: {
    ...Layout.row,
    alignItems: 'flex-end',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    ...Layout.borderTop,
    backgroundColor: Colors.background,
  },
  inputArea: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.xl,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    marginRight: Layout.spacing.sm,
    maxHeight: 100,
  },
  messageInput: {
    ...Typography.body,
    color: Colors.text,
    minHeight: 22,
    textAlignVertical: 'top',
  },
  inputActions: {
    ...Layout.row,
    marginTop: Layout.spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    ...Layout.columnCenter,
    marginRight: Layout.spacing.sm,
  },
  actionIcon: {
    fontSize: 18,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.radius.xl,
    ...Layout.columnCenter,
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: Colors.card,
  },
  sendIcon: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: 'bold',
  },

  // Emoji picker
  emojiModalOverlay: {
    ...Layout.modalOverlay,
    justifyContent: 'flex-end',
  },
  emojiPicker: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Layout.radius.xl,
    borderTopRightRadius: Layout.radius.xl,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.xl,
    maxHeight: 300,
  },
  emojiPickerTitle: {
    ...Typography.h5,
    color: Colors.text,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emojiButton: {
    width: '18%',
    aspectRatio: 1,
    ...Layout.columnCenter,
    marginBottom: Layout.spacing.md,
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.card,
  },
  emoji: {
    fontSize: 24,
  },
});

export default ChatPage;