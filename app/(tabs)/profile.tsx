import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import SearchHeader from '../../components/SearchHeader';

export default function ProfileScreen() {
  const router = useRouter();

  const chatList = [
    {
      id: 1,
      hospitalId: 1,
      hospitalName: 'A성형외과',
      lastMessage: '문의 주셔서 감사합니다.',
      timestamp: '10분 전',
      unread: 2,
    },
    {
      id: 2,
      hospitalId: 2,
      hospitalName: 'B클리닉',
      lastMessage: '상담 가능 시간은...',
      timestamp: '1시간 전',
      unread: 0,
    },
  ];

  const goToChat = (hospitalId: number, hospitalName: string) => {
    router.push({
      pathname: '/chat/hospital',
      params: {
        hospitalId: hospitalId,
        hospitalName: hospitalName,
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchHeader />
      
      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>👤 내 프로필</Text>
        </View>

        {/* 채팅 목록 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 채팅 목록</Text>
          {chatList.map((chat) => (
            <TouchableOpacity 
              key={chat.id} 
              style={styles.chatItem}
              onPress={() => goToChat(chat.hospitalId, chat.hospitalName)}
            >
              <View style={styles.chatAvatar}>
                <Text style={styles.chatAvatarText}>🏥</Text>
              </View>
              <View style={styles.chatInfo}>
                <Text style={styles.chatHospitalName}>{chat.hospitalName}</Text>
                <Text style={styles.chatLastMessage}>{chat.lastMessage}</Text>
              </View>
              <View style={styles.chatMeta}>
                <Text style={styles.chatTimestamp}>{chat.timestamp}</Text>
                {chat.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{chat.unread}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 75 : 65,
  },
  scrollContentContainer: {
    paddingBottom: 100,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chatAvatarText: {
    fontSize: 24,
  },
  chatInfo: {
    flex: 1,
  },
  chatHospitalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#666',
  },
  chatMeta: {
    alignItems: 'flex-end',
  },
  chatTimestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#333',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
});