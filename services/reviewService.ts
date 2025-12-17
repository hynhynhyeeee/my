import { db } from '../firebaseConfig';
import { 
  collection, 
  query, 
  getDocs, 
  limit,
  doc,
  getDoc,
  updateDoc,
  increment
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Review {
  id?: string;
  hospitalName?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  likeCount?: number;
  viewCount?: number;
  
  // 엑셀/기타 필드 호환
  hospital_name?: string;
  doctor_name?: string;
  procedures?: string;
  cost?: string;
  before_img?: string;
  after_img?: string;
  review_summary?: string;
  review_text?: string;
  surgery_date?: string;
  doctor_style?: string;
  doctor_natural_pct?: number;
  doctor_fancy_pct?: number;
  doctor_best_keywords?: string;
  hospital_best_keywords?: string;
  doctor_total_reviews?: number;
  hospital_total_reviews?: number;
  similarity?: number;
}

// ... getAllReviews, getReviewById, 병원/의사 검색 함수 등은 그대로 두셔도 됩니다 ...
// (혹시 몰라 getAllReviews만 다시 적어드립니다)

export const getAllReviews = async (limitCount = 500): Promise<Review[]> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, limit(limitCount));
    const snapshot = await getDocs(q);
    const reviews: Review[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      if ((data.beforeImageUrl && data.afterImageUrl) || (data.before_img && data.after_img)) {
        reviews.push({ id: doc.id, ...data } as Review);
      }
    });
    return reviews;
  } catch (error) {
    console.error('후기 가져오기 실패:', error);
    return [];
  }
};

export const getReviewById = async (reviewId: string): Promise<Review | null> => {
  try {
    const docRef = doc(db, 'reviews', reviewId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Review;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getReviewsByHospital = async (hospitalName: string, limitCount = 50): Promise<Review[]> => {
  try {
    const allReviews = await getAllReviews(500);
    return allReviews.filter(r => (r.hospitalName === hospitalName || r.hospital_name === hospitalName)).slice(0, limitCount);
  } catch (e) { return []; }
};

export const getReviewsByDoctor = async (doctorName: string, limitCount = 50): Promise<Review[]> => {
  try {
    const allReviews = await getAllReviews(500);
    return allReviews.filter(r => r.doctor_name === doctorName).slice(0, limitCount);
  } catch (e) { return []; }
};

// 👇👇 여기가 핵심 수정 부분입니다 👇👇

/**
 * 💖 좋아요 토글 (내부 저장소 + Firestore 카운트 업데이트)
 */
export const toggleReviewLike = async (reviewId: string | number): Promise<boolean> => {
  try {
    // 🚨 안전 장치: ID가 없으면 중단
    if (!reviewId) {
      console.error('❌ toggleReviewLike: reviewId가 없습니다.');
      return false;
    }

    // 🚨 안전 장치: 무조건 문자열로 변환
    const safeId = String(reviewId);
    const STORAGE_KEY = 'user_liked_reviews';
    
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    let savedIds: string[] = saved ? JSON.parse(saved) : [];
    
    const isLiked = savedIds.includes(safeId);
    let newIsLiked = false;

    if (isLiked) {
      savedIds = savedIds.filter(id => id !== safeId);
      newIsLiked = false;
    } else {
      savedIds.push(safeId);
      newIsLiked = true;
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));

    // AI 결과(가짜 데이터)가 아닐 때만 서버 카운트 업데이트
    if (!safeId.startsWith('ai_')) {
      const reviewRef = doc(db, 'reviews', safeId);
      await updateDoc(reviewRef, {
        likeCount: increment(newIsLiked ? 1 : -1)
      });
    }

    return newIsLiked;
  } catch (error) {
    console.error('❌ 좋아요 토글 실패:', error);
    return false;
  }
};

/**
 * 🧐 내가 이 글을 좋아했는지 확인
 */
export const checkIsLiked = async (reviewId: string | number): Promise<boolean> => {
  try {
    if (!reviewId) return false;
    const safeId = String(reviewId); // 안전 변환
    const saved = await AsyncStorage.getItem('user_liked_reviews');
    const savedIds = saved ? JSON.parse(saved) : [];
    return savedIds.includes(safeId);
  } catch (error) {
    return false;
  }
};

/**
 * 📂 내가 좋아요한 후기 ID 목록 가져오기
 */
export const getLikedReviewIds = async (): Promise<string[]> => {
  try {
    const saved = await AsyncStorage.getItem('user_liked_reviews');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
};