import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const ChatPage = () => {
  const params = useLocalSearchParams();
  const { chatId, chatName, chatAvatar, isOnline } = params;
  
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([
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
    },
    {
      id: 8,
      text: 'Usually takes me 1-2 weeks depending on complexity. I can start next Monday if you\'re ready to proceed! 😊',
      time: '10:50',
      isSender: false,
      type: 'text'
    },
    {
      id: 9,
      text: 'Excellent! Let\'s move forward. Should I send the deposit now?',
      time: '10:52',
      isSender: true,
      type: 'text'
    },
    {
      id: 10,
      text: 'Yes! I\'ll send you the contract and payment details. Looking forward to creating something amazing for you! ✨',
      time: '10:55',
      isSender: false,
      type: 'text'
    }
  ]);

  // Common emojis for quick access
  const commonEmojis = ['😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎨', '✨', '🔥', '💯', '😍', '🤔', '👏', '🙏'];

  const sendMessage = (messageText = message, messageType = 'text', imageUrl = null, fileName = null) => {
    if (messageText.trim() || messageType !== 'text') {
      const newMessage = {
        id: messages.length + 1,
        text: messageText || (messageType === 'image' ? 'Image' : 'File'),
        time: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        isSender: true,
        type: messageType,
        imageUrl: imageUrl,
        fileName: fileName
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiPress = (emoji) => {
    setMessage(message + emoji);
    setShowEmojiPicker(false);
  };

  const handleImagePress = async () => {
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        console.log('Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        sendMessage(file.name, 'file', null, file.name);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleAvatarPress = () => {
    // Navigate to artist profile
    router.push({
      pathname: '/artist-detail',
      params: {
        artistId: chatId,
        artistName: chatName,
        artistAvatar: chatAvatar
      }
    });
  };

  const renderMessage = (msg) => {
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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
            <Text style={styles.headerStatus}>
              {isOnline === 'true' ? 'Online' : 'Last seen recently'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <ScrollView 
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          ref={(ref) => {
            if (ref) {
              ref.scrollToEnd({ animated: true });
            }
          }}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Emoji Picker Modal */}
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

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputArea}>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor="#666"
              multiline
              maxLength={1000}
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
            style={[styles.sendButton, message.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
            onPress={() => sendMessage()}
            disabled={!message.trim()}
          >
            <Text style={styles.sendIcon}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerStatus: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  senderMessage: {
    justifyContent: 'flex-end',
  },
  receiverMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  avatarPlaceholder: {
    width: 40,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    marginHorizontal: 4,
  },
  senderBubble: {
    backgroundColor: '#00A8FF',
    borderBottomRightRadius: 4,
  },
  receiverBubble: {
    backgroundColor: '#1A1A1A',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  senderText: {
    color: '#FFFFFF',
  },
  receiverText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  senderTime: {
    color: '#FFFFFF',
    alignSelf: 'flex-end',
  },
  receiverTime: {
    color: '#AAA',
    alignSelf: 'flex-start',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  fileIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  fileName: {
    fontSize: 14,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    backgroundColor: '#0A0A0A',
  },
  inputArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  messageInput: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    minHeight: 22,
    textAlignVertical: 'top',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  actionIcon: {
    fontSize: 18,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#00A8FF',
  },
  sendButtonInactive: {
    backgroundColor: '#333',
  },
  sendIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Emoji Picker Styles
  emojiModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  emojiPicker: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    maxHeight: 300,
  },
  emojiPickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
  },
  emoji: {
    fontSize: 24,
  },
});

export default ChatPage;