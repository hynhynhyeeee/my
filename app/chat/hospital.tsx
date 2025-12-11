import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import SearchHeader from '../../components/SearchHeader';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'hospital';
  timestamp: string;
}

export default function HospitalChatScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const hospitalName = params.hospitalName as string;
  const hospitalId = params.hospitalId;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `안녕하세요! ${hospitalName}입니다. 무엇을 도와드릴까요?`,
      sender: 'hospital',
      timestamp: '09:00',
    }
  ]);

  const sendMessage = () => {
    if (message.trim() === '') return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // 자동 응답 (시뮬레이션)
    setTimeout(() => {
      const autoReply: Message = {
        id: messages.length + 2,
        text: '문의 주셔서 감사합니다. 곧 상담사가 연결됩니다.',
        sender: 'hospital',
        timestamp: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchHeader />

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 75 : 65}
      >
        {/* 헤더 */}
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← </Text>
          </TouchableOpacity>
          <Text style={styles.chatHeaderTitle}>{hospitalName}</Text>
        </View>

        {/* 메시지 목록 */}
        <ScrollView 
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
        >
          {messages.map((msg) => (
            <View 
              key={msg.id} 
              style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userBubble : styles.hospitalBubble
              ]}
            >
              <Text style={[
                styles.messageText,
                msg.sender === 'user' && styles.userMessageText
              ]}>
                {msg.text}
              </Text>
              <Text style={[
                styles.messageTime,
                msg.sender === 'user' && styles.userMessageTime
              ]}>
                {msg.timestamp}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* 입력창 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="메시지를 입력하세요..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>전송</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoid: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 75 : 65,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: '#333',
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  messageList: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  messageListContent: {
    padding: 16,
    paddingBottom: 100,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#333',
  },
  hospitalBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
  },
  messageText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  userMessageText: {
    color: 'white',
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
  },
  userMessageTime: {
    color: '#ccc',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});