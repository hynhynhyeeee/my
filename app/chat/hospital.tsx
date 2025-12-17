import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, StatusBar
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { sendMessage, subscribeToChat, Message } from '@/services/chatService';

export default function HospitalChatScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Params (Detail에서 넘겨준 값들)
  const chatId = params.chatId as string;
  const hospitalName = params.hospitalName as string || '병원';
  const doctorName = params.doctorName as string || '상담원';

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = subscribeToChat(chatId, (msgs) => {
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    // 병원명과 의사명도 같이 저장
    await sendMessage(chatId, text, hospitalName, doctorName);
  };

  const goToHospitalDetail = () => {
    router.push({
      pathname: '/reviews/hospital',
      params: { hospitalName: hospitalName }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.headerContent} onPress={goToHospitalDetail}>
          <Text style={styles.headerTitle}>{hospitalName}</Text>
          <View style={styles.headerSubInfo}>
            <View style={styles.onlineBadge} />
            <Text style={styles.headerSubtitle}>{doctorName} • 상담 가능</Text>
            <Icon name="chevron-right" size={16} color="#999" />
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === 'user' ? styles.myMessage : styles.otherMessage]}>
            <Text style={[styles.messageText, item.sender === 'user' ? styles.myMessageText : styles.otherMessageText]}>
              {item.text}
            </Text>
            <Text style={styles.timeText}>{item.timestamp}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}><Icon name="add" size={24} color="#999" /></TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="메시지를 입력하세요"
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity 
            style={[styles.sendButton, inputText.trim().length > 0 && styles.sendButtonActive]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Icon name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 60 : 20, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
  backButton: { padding: 8, marginRight: 8 },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  headerSubInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  headerSubtitle: { fontSize: 12, color: '#666', marginRight: 4 },
  onlineBadge: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4CAF50', marginRight: 6 },
  listContent: { padding: 16, paddingBottom: 20 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 10 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#FF6B9D', borderBottomRightRadius: 4 },
  otherMessage: { alignSelf: 'flex-start', backgroundColor: 'white', borderTopLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 22 },
  myMessageText: { color: 'white' },
  otherMessageText: { color: '#333' },
  timeText: { fontSize: 10, color: 'rgba(0,0,0,0.5)', marginTop: 4, alignSelf: 'flex-end' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#eee' },
  attachButton: { padding: 8 },
  input: { flex: 1, backgroundColor: '#f8f9fa', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, marginHorizontal: 8, fontSize: 15 },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  sendButtonActive: { backgroundColor: '#FF6B9D' },
});