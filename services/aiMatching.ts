import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AI 눈 사진 유사도 분석 서비스
 * GPU 서버: http://210.125.91.93:8001
 */

const AI_SERVER_URL = 'http://210.125.91.93:8001';

export interface AIMatch {
  hospital: string;
  before_url: string;
  after_url: string;
  similarity: number;
  label: string;
  aspect_ratio: number;
}

export interface AIResponse {
  success: boolean;
  count: number;
  matches: AIMatch[];
}

/**
 * 눈 사진을 AI 서버로 전송하여 유사한 후기 찾기
 */
export const analyzeEyePhoto = async (imageUri: string): Promise<AIMatch[]> => {
  try {
    console.log('🤖 AI 분석 시작:', imageUri);

    const formData = new FormData();
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    
    formData.append('photo', {
      uri: imageUri,
      name: `eye_photo.${fileType}`,
      type: `image/${fileType}`,
    } as any);

    console.log('📤 AI 서버로 전송 중...');

    const response = await fetch(`${AI_SERVER_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`AI 서버 응답 오류: ${response.status}`);
    }

    const data: AIResponse = await response.json();
    console.log('✅ AI 분석 완료:', data.count, '개 결과');

    return data.matches || [];
  } catch (error) {
    console.error('❌ AI 분석 실패:', error);
    throw error;
  }
};

/**
 * AI 서버 상태 확인
 */
export const checkAIServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${AI_SERVER_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) return false;
    const data = await response.json();
    console.log('🟢 AI 서버 상태:', data.status);
    return data.status === 'healthy';
  } catch (error) {
    console.error('🔴 AI 서버 연결 실패:', error);
    return false;
  }
};

export const convertAIMatchesToReviews = (matches: AIMatch[]) => {
  return matches.map((match, index) => ({
    id: `ai_${index + 1}`,
    hospital_name: match.hospital,
    before_img: match.before_url,
    after_img: match.after_img,
    similarity: match.similarity,
    procedures: match.label,
  }));
};

// 👇👇 [새로 추가된 저장 기능] 👇👇

/**
 * 💾 AI 분석 결과를 로컬에 저장 (홈 화면 표시용)
 */
export const saveAiResultsLocally = async (matches: any[]) => {
  try {
    await AsyncStorage.setItem('latest_ai_results', JSON.stringify(matches));
    console.log('✅ AI 결과 로컬 저장 완료');
  } catch (error) {
    console.error('❌ AI 결과 저장 실패:', error);
  }
};

/**
 * 📂 저장된 AI 결과 불러오기
 */
export const getAiResultsLocally = async () => {
  try {
    const data = await AsyncStorage.getItem('latest_ai_results');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('❌ AI 결과 로드 실패:', error);
    return null;
  }
};