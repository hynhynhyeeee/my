import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, StyleSheet, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import SearchHeader from '../../components/SearchHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Message { id: number; text: string; sender: 'user' | 'ai'; timestamp: string; }
interface RecommendedReview { id: number; category: string; procedure: string; hospital: string; similarity: number; reason: string; }

export default function AIConsultantScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([{ id: 1, text: '안녕하세요! 저는 AI 상담원입니다.\n수술을 망설이시는 이유를 말씀해주세요. 당신의 고민을 해결할 수 있는 후기를 찾아드릴게요!', sender: 'ai', timestamp: '09:00' }]);
  const [loading, setLoading] = useState(false);
  const [recommendedReviews, setRecommendedReviews] = useState<RecommendedReview[]>([]);

  const sendMessage = async () => {
    if (message.trim() === '') return;
    const newMessage: Message = { id: messages.length + 1, text: message, sender: 'user', timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setLoading(true);

    setTimeout(() => {
      const concerns = message.includes('자연스럽') ? '자연스러운 결과' : message.includes('붓기') ? '빠른 회복' : '안전한 수술';
      const aiResponse: Message = { id: messages.length + 2, text: `분석 완료! 당신의 고민: "${concerns}"\n\n이런 고민을 가진 분들의 후기를 찾았어요. 아래 후기들을 확인해보세요! ✨`, sender: 'ai', timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiResponse]);
      setRecommendedReviews([
        { id: 1, category: '눈', procedure: '쌍꺼풀 + 앞트임', hospital: 'A성형외과', similarity: 95, reason: `"${concerns}"에 대한 후기가 많아요` },
        { id: 2, category: '눈', procedure: '눈매교정', hospital: 'B클리닉', similarity: 92, reason: '비슷한 고민을 가진 분이 만족했어요' },
      ]);
      setLoading(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchHeader />
      <KeyboardAvoidingView style={styles.keyboardAvoid} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 105 : 95}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Icon name="psychology" size={20} color="#FF6B9D" style={{marginRight: 8}} />
          <Text style={styles.chatHeaderTitle}>AI 상담원</Text>
        </View>
        <ScrollView style={styles.messageList} contentContainerStyle={styles.messageListContent}>
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.messageText, msg.sender === 'user' && styles.userMessageText]}>{msg.text}</Text>
              <Text style={[styles.messageTime, msg.sender === 'user' && styles.userMessageTime]}>{msg.timestamp}</Text>
            </View>
          ))}
          {loading && (<View style={styles.loadingContainer}><ActivityIndicator size="small" color="#333" /><Text style={styles.loadingText}>AI가 분석 중입니다...</Text></View>)}
          {recommendedReviews.length > 0 && (
            <View style={styles.reviewsSection}>
              <Text style={styles.reviewsTitle}>💡 추천 후기</Text>
              {recommendedReviews.map((review) => (
                <TouchableOpacity key={review.id} style={styles.reviewCard} onPress={() => router.push({ pathname: '/reviews/detail', params: { id: review.id } })}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewCategory}>{review.category}</Text>
                    <View style={styles.similarityBadge}><Text style={styles.similarityText}>{review.similarity}%</Text></View>
                  </View>
                  <Text style={styles.reviewProcedure}>{review.procedure}</Text>
                  <Text style={styles.reviewHospital}>{review.hospital}</Text>
                  <Text style={styles.reviewReason}>📌 {review.reason}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="고민을 입력하세요... (예: 자연스럽게 되고 싶어요)" value={message} onChangeText={setMessage} multiline />
          <TouchableOpacity style={[styles.sendButton, loading && styles.sendButtonDisabled]} onPress={sendMessage} disabled={loading}>
            <Text style={styles.sendButtonText}>전송</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  keyboardAvoid: { flex: 1, marginTop: Platform.OS === 'ios' ? 105 : 95 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  backButton: { marginRight: 8 },
  chatHeaderTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  messageList: { flex: 1, backgroundColor: '#f8f9fa' },
  messageListContent: { padding: 16, paddingBottom: 100 },
  messageBubble: { maxWidth: '85%', padding: 12, borderRadius: 16, marginBottom: 12 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#333' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: 'white', borderWidth: 1, borderColor: '#e0e0e0' },
  messageText: { fontSize: 15, color: '#333', lineHeight: 22, marginBottom: 4 },
  userMessageText: { color: 'white' },
  messageTime: { fontSize: 11, color: '#999' },
  userMessageTime: { color: '#ccc' },
  loadingContainer: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#e0e0e0', marginBottom: 12 },
  loadingText: { marginLeft: 8, fontSize: 14, color: '#666' },
  reviewsSection: { marginTop: 16 },
  reviewsTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  reviewCard: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e0e0e0' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reviewCategory: { fontSize: 13, fontWeight: '600', color: '#666' },
  similarityBadge: { backgroundColor: '#333', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  similarityText: { color: 'white', fontSize: 11, fontWeight: '600' },
  reviewProcedure: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  reviewHospital: { fontSize: 14, color: '#666', marginBottom: 8 },
  reviewReason: { fontSize: 13, color: '#333', backgroundColor: '#f8f9fa', padding: 8, borderRadius: 8 },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#e0e0e0', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
  sendButton: { marginLeft: 8, backgroundColor: '#333', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  sendButtonDisabled: { backgroundColor: '#ccc' },
  sendButtonText: { color: 'white', fontSize: 15, fontWeight: '600' },
});