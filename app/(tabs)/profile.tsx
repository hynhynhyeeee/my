import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Switch,
  Platform,
  StatusBar,
  Alert,
  RefreshControl // 👈 추가
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker'; 

import { Swipeable, GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { toggleChatPin, leaveChatRoom } from '@/services/chatService';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function ProfileScreen() {
  const router = useRouter();
  
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/women/44.jpg');
  const [userName, setUserName] = useState('박현서'); 
  
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const swipeableRefs = useRef(new Map());
  const [refreshing, setRefreshing] = useState(false); // 👈 상태

  useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('lastMessageTime', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedRooms = rooms.sort((a: any, b: any) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1));
      setChatRooms(sortedRooms);
    });
    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // 1초 뒤에 새로고침 완료 처리 (실시간이라 굳이 다시 불러올 필욘 없지만 UX상 필요)
    setTimeout(() => setRefreshing(false), 1000);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 부족', '사진을 바꾸려면 앨범 접근 권한이 필요합니다.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleChatPress = (chat: any) => {
    router.push({
      pathname: '/chat/hospital',
      params: { 
        chatId: chat.id,
        hospitalName: chat.hospitalName,
        doctorName: chat.doctorName
      }
    });
  };

  const handleHospitalPress = (hospitalName: string) => {
    router.push({ pathname: '/reviews/hospital', params: { hospitalName } });
  };

  const handlePinAction = async (chat: any) => {
    swipeableRefs.current.get(chat.id)?.close();
    await toggleChatPin(chat.id);
  };

  const handleLeaveAction = (chat: any) => {
    swipeableRefs.current.get(chat.id)?.close();
    Alert.alert('나가기', '채팅방을 나가시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '나가기', style: 'destructive', onPress: async () => await leaveChatRoom(chat.id) }
    ]);
  };

  const renderLeftActions = (p: any, d: any, c: any) => (
    <TouchableOpacity onPress={() => handlePinAction(c)}>
      <View style={[styles.swipeAction, styles.leftAction]}>
        <Icon name="push-pin" size={24} color="white" />
        <Text style={styles.actionText}>{c.isPinned ? '해제' : '고정'}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRightActions = (p: any, d: any, c: any) => (
    <TouchableOpacity onPress={() => handleLeaveAction(c)}>
      <View style={[styles.swipeAction, styles.rightAction]}>
        <Icon name="delete-outline" size={24} color="white" />
        <Text style={styles.actionText}>나가기</Text>
      </View>
    </TouchableOpacity>
  );

  const formatTime = (ts: any) => ts?.toDate ? ts.toDate().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>마이페이지</Text>
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
              <View style={styles.profileImageWrapper}>
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
                <View style={styles.editBadge}>
                  <Icon name="camera-alt" size={14} color="white" />
                </View>
              </View>
            </TouchableOpacity>

            <Text style={styles.userName}>{userName} 님</Text>
            <Text style={styles.userEmail}>hyunseo.park@example.com</Text>
          </View>
        </View>

        <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B9D" />
            }
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>내 상담 채팅</Text>
            {chatRooms.length > 0 ? (
              chatRooms.map((chat) => (
                <Swipeable
                  key={chat.id}
                  ref={(ref) => ref && swipeableRefs.current.set(chat.id, ref)}
                  renderLeftActions={(p, d) => renderLeftActions(p, d, chat)}
                  renderRightActions={(p, d) => renderRightActions(p, d, chat)}
                  overshootLeft={false}
                  overshootRight={false}
                >
                  <TouchableOpacity
                    style={[styles.chatItem, chat.isPinned && styles.pinnedChatItem]}
                    onPress={() => handleChatPress(chat)}
                    activeOpacity={0.7}
                  >
                    <TouchableOpacity style={styles.chatIcon} onPress={() => handleHospitalPress(chat.hospitalName)}>
                      <Icon name="local-hospital" size={24} color="#FF6B9D" />
                      {chat.unread > 0 && <View style={styles.unreadDot} />}
                    </TouchableOpacity>

                    <View style={styles.chatInfo}>
                      <View style={styles.chatHeader}>
                        <Text style={styles.chatHospitalName}>
                          {chat.hospitalName} 
                          {chat.doctorName && <Text style={{fontSize:13, fontWeight:'normal', color:'#666'}}>  {chat.doctorName}</Text>}
                          {chat.isPinned && <Icon name="push-pin" size={12} color="#FF6B9D" style={{marginLeft: 4}} />}
                        </Text>
                        <Text style={styles.chatTime}>{formatTime(chat.lastMessageTime)}</Text>
                      </View>
                      <Text style={styles.chatMessage} numberOfLines={1}>
                        {chat.lastMessage || '대화가 시작되었습니다.'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              ))
            ) : (
              <View style={styles.emptyState}><Text style={styles.emptyText}>진행 중인 상담이 없습니다.</Text></View>
            )}
          </View>
          
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem}><View style={styles.menuLeft}><Icon name="notifications-none" size={24} color="#333" /><Text style={styles.menuText}>알림 설정</Text></View><Switch trackColor={{ false: "#767577", true: "#FF6B9D" }} value={true} /></TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}><View style={styles.menuLeft}><Icon name="lock-outline" size={24} color="#333" /><Text style={styles.menuText}>개인정보 처리방침</Text></View><Icon name="chevron-right" size={24} color="#ccc" /></TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}><View style={styles.menuLeft}><Icon name="headset-mic" size={24} color="#333" /><Text style={styles.menuText}>고객센터</Text></View><Icon name="chevron-right" size={24} color="#ccc" /></TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}><View style={styles.menuLeft}><Icon name="logout" size={24} color="#FF5252" /><Text style={[styles.menuText, { color: '#FF5252' }]}>로그아웃</Text></View></TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: 'white', padding: 20, paddingTop: 60, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', position: 'absolute', top: 60, color: '#333' },
  profileSection: { marginTop: 40, alignItems: 'center' },
  profileImageWrapper: { position: 'relative', marginBottom: 12 },
  profileImage: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#eee' },
  editBadge: { position: 'absolute', right: 0, bottom: 0, backgroundColor: '#FF6B9D', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#999' },
  content: { flex: 1 },
  section: { marginTop: 12, backgroundColor: 'white' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', padding: 20, paddingBottom: 10 },
  chatItem: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  pinnedChatItem: { backgroundColor: '#FFF5F8' },
  chatIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF0F5', justifyContent: 'center', alignItems: 'center', marginRight: 12, position: 'relative' },
  unreadDot: { position: 'absolute', top: 2, right: 2, width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF5252', borderWidth: 1.5, borderColor: 'white' },
  chatInfo: { flex: 1 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  chatHospitalName: { fontSize: 15, fontWeight: '600', color: '#333' },
  chatTime: { fontSize: 12, color: '#999' },
  chatMessage: { fontSize: 14, color: '#666' },
  swipeAction: { justifyContent: 'center', alignItems: 'center', width: 80, height: '100%' },
  leftAction: { backgroundColor: '#FF6B9D' },
  rightAction: { backgroundColor: '#FF5252' },
  actionText: { color: 'white', fontSize: 12, fontWeight: '600', marginTop: 4 },
  emptyState: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#999' },
  menuSection: { marginTop: 12, backgroundColor: 'white', padding: 20, marginBottom: 40 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuText: { fontSize: 16, color: '#333' },
});