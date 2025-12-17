import { db } from '../firebaseConfig';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'hospital';
  createdAt: any;
  timestamp: string;
}

/**
 * 📨 메시지 전송
 */
export const sendMessage = async (
  chatId: string, 
  text: string, 
  hospitalName: string, 
  doctorName: string
) => {
  // 🚨 방어 코드: ID가 없으면 실행 중지
  if (!chatId) {
    console.error('❌ [ChatService] Error: chatId is undefined or empty');
    return; 
  }

  try {
    // 1️⃣ 메시지 저장
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text: text,
      sender: 'user',
      createdAt: serverTimestamp(),
    });

    // 2️⃣ 채팅방 메타데이터 업데이트 (목록 표시용)
    await setDoc(doc(db, 'chats', chatId), {
      chatId: chatId,
      hospitalName: hospitalName || '알 수 없는 병원',
      doctorName: doctorName || '상담원',
      lastMessage: text,
      lastMessageTime: serverTimestamp(),
      unread: 0,
      isPinned: false // 기본값
    }, { merge: true }); // merge: true로 기존 데이터(고정 여부 등) 유지

    console.log(`✅ Message sent to [${chatId}]`);
  } catch (error) {
    console.error('❌ [ChatService] Send Failed:', error);
    throw error; // UI에서 알 수 있게 에러 다시 던짐
  }
};

/**
 * 👂 실시간 채팅 구독
 */
export const subscribeToChat = (chatId: string, onUpdate: (msgs: Message[]) => void) => {
  if (!chatId) return () => {}; // ID 없으면 빈 해제함수 반환

  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => {
      const data = doc.data();
      let timeString = '';
      if (data.createdAt) {
        const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date();
        timeString = date.toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }

      return {
        id: doc.id,
        text: data.text,
        sender: data.sender,
        createdAt: data.createdAt,
        timestamp: timeString || '전송 중...',
      } as Message;
    });
    
    onUpdate(messages);
  });

  return unsubscribe;
};

/**
 * 📌 채팅방 고정/해제
 */
export const toggleChatPin = async (chatId: string) => {
  try {
    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);
    
    if (chatSnap.exists()) {
      const currentStatus = chatSnap.data().isPinned || false;
      await updateDoc(chatRef, { isPinned: !currentStatus });
    }
  } catch (error) {
    console.error('[Chat] Pin Error:', error);
  }
};

/**
 * 🗑️ 채팅방 삭제
 */
export const leaveChatRoom = async (chatId: string) => {
  try {
    await deleteDoc(doc(db, 'chats', chatId));
  } catch (error) {
    console.error('[Chat] Leave Error:', error);
  }
};