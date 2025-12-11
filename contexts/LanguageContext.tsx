import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'ko' | 'en' | 'zh' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateText: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 기존 translations 객체는 그대로...
const translations: Record<Language, Record<string, string>> = {
  ko: {
    'home': '홈',
    'procedures': '시술후기',
    'recommended': '추천',
    'saved': '보관함',
    'profile': '내 프로필',
    
    'category.eyes': '눈',
    'category.nose': '코',
    'category.lips': '입술',
    'category.contour': '윤곽',
    'category.skin': '피부',
    'category.laser': '레이저',
    'category.breast': '가슴',
    'category.teeth': '치아',
    'category.lifting': '리프팅',
    'category.filler': '필러',
    'category.botox': '보톡스',
    'category.etc': '기타',
    'category.all': '전체',
    
    'filter.likes': '찜 많은순',
    'filter.views': '조회수순',
    'filter.similarity': '유사도순',
    
    'search.placeholder': '원하는 시술이나 부위를 검색하세요',
    'similarity': '유사도',
    'back': '뒤로',
    'viewAll': '전체보기',
    'hospital': '병원',
    'address': '주소',
    'phone': '전화번호',
    
    'reviews.saved': '저장한 후기',
    'reviews.recommended': '당신이 좋아할 만한 후기',
    'reviews.recommendedSubtitle': '저장한 후기와 유사한 스타일',
    'reviews.total': '총',
    'reviews.count': '개의 후기',
    
    'booking.selectDate': '예약 날짜 선택',
    'booking.selectTime': '예약 시간 선택',
    'booking.book': '예약하기',
    'booking.chat': '채팅 상담',
    'booking.call': '전화 상담',
    'booking.inquiry': '문의하기',
    
    'ai.consultant': 'AI 상담원',
    'ai.greeting': '안녕하세요! 저는 AI 상담원입니다. 🤖\n수술을 망설이시는 이유를 말씀해주세요.',
  },
  en: {
    'home': 'Home',
    'procedures': 'Reviews',
    'recommended': 'For You',
    'saved': 'Saved',
    'profile': 'Profile',
    
    'category.eyes': 'Eyes',
    'category.nose': 'Nose',
    'category.lips': 'Lips',
    'category.contour': 'Contour',
    'category.skin': 'Skin',
    'category.laser': 'Laser',
    'category.breast': 'Breast',
    'category.teeth': 'Teeth',
    'category.lifting': 'Lifting',
    'category.filler': 'Filler',
    'category.botox': 'Botox',
    'category.etc': 'Other',
    'category.all': 'All',
    
    'filter.likes': 'Most Liked',
    'filter.views': 'Most Viewed',
    'filter.similarity': 'Similarity',
    
    'search.placeholder': 'Search procedures or areas',
    'similarity': 'Similarity',
    'back': 'Back',
    'viewAll': 'View All',
    'hospital': 'Hospital',
    'address': 'Address',
    'phone': 'Phone',
    
    'reviews.saved': 'Saved Reviews',
    'reviews.recommended': 'Recommended for You',
    'reviews.recommendedSubtitle': 'Similar to your saved reviews',
    'reviews.total': 'Total',
    'reviews.count': 'reviews',
    
    'booking.selectDate': 'Select Date',
    'booking.selectTime': 'Select Time',
    'booking.book': 'Book Now',
    'booking.chat': 'Chat',
    'booking.call': 'Call',
    'booking.inquiry': 'Contact',
    
    'ai.consultant': 'AI Consultant',
    'ai.greeting': 'Hello! I am an AI consultant. 🤖\nPlease tell me why you are hesitating.',
  },
  zh: {
    'home': '主页',
    'procedures': '手术评价',
    'recommended': '推荐',
    'saved': '收藏',
    'profile': '个人资料',
    
    'category.eyes': '眼睛',
    'category.nose': '鼻子',
    'category.lips': '嘴唇',
    'category.contour': '轮廓',
    'category.skin': '皮肤',
    'category.laser': '激光',
    'category.breast': '胸部',
    'category.teeth': '牙齿',
    'category.lifting': '提升',
    'category.filler': '填充',
    'category.botox': '肉毒',
    'category.etc': '其他',
    'category.all': '全部',
    
    'filter.likes': '最多喜欢',
    'filter.views': '最多查看',
    'filter.similarity': '相似度',
    
    'search.placeholder': '搜索手术或部位',
    'similarity': '相似度',
    'back': '返回',
    'viewAll': '查看全部',
    'hospital': '医院',
    'address': '地址',
    'phone': '电话',
    
    'reviews.saved': '收藏的评价',
    'reviews.recommended': '为您推荐',
    'reviews.recommendedSubtitle': '与您收藏的评价相似',
    'reviews.total': '共',
    'reviews.count': '条评价',
    
    'booking.selectDate': '选择日期',
    'booking.selectTime': '选择时间',
    'booking.book': '预约',
    'booking.chat': '聊天',
    'booking.call': '电话',
    'booking.inquiry': '咨询',
    
    'ai.consultant': 'AI顾问',
    'ai.greeting': '您好！我是AI顾问。🤖\n请告诉我您为什么犹豫。',
  },
  ja: {
    'home': 'ホーム',
    'procedures': 'レビュー',
    'recommended': 'おすすめ',
    'saved': '保存済み',
    'profile': 'プロフィール',
    
    'category.eyes': '目',
    'category.nose': '鼻',
    'category.lips': '唇',
    'category.contour': '輪郭',
    'category.skin': '肌',
    'category.laser': 'レーザー',
    'category.breast': '胸',
    'category.teeth': '歯',
    'category.lifting': 'リフティング',
    'category.filler': 'フィラー',
    'category.botox': 'ボトックス',
    'category.etc': 'その他',
    'category.all': 'すべて',
    
    'filter.likes': 'いいね順',
    'filter.views': '閲覧順',
    'filter.similarity': '類似度順',
    
    'search.placeholder': '施術や部位を検索',
    'similarity': '類似度',
    'back': '戻る',
    'viewAll': 'すべて見る',
    'hospital': '病院',
    'address': '住所',
    'phone': '電話',
    
    'reviews.saved': '保存したレビュー',
    'reviews.recommended': 'おすすめ',
    'reviews.recommendedSubtitle': '保存したレビューと類似',
    'reviews.total': '合計',
    'reviews.count': '件',
    
    'booking.selectDate': '日付を選択',
    'booking.selectTime': '時間を選択',
    'booking.book': '予約する',
    'booking.chat': 'チャット',
    'booking.call': '電話',
    'booking.inquiry': 'お問い合わせ',
    
    'ai.consultant': 'AIコンサルタント',
    'ai.greeting': 'こんにちは！私はAIコンサルタントです。🤖\n躊躇している理由を教えてください。',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ko');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // 실시간 번역 함수 (더미 - 실제로는 API 호출)
  const translateText = async (text: string): Promise<string> => {
    if (language === 'ko') return text;

    // 간단한 더미 번역 (실제로는 Google Translate API 사용)
    const dummyTranslations: Record<Language, Record<string, string>> = {
      ko: {},
      en: {
        'A성형외과': 'A Plastic Surgery',
        'B클리닉': 'B Clinic',
        'C성형외과': 'C Plastic Surgery',
        '서울시 강남구 역삼동 123-45': '123-45 Yeoksam-dong, Gangnam-gu, Seoul',
        '쌍꺼풀 + 앞트임': 'Double Eyelid + Epicanthoplasty',
        '눈매교정': 'Eye Correction',
        '코끝성형': 'Nose Tip Surgery',
        '자연스러운': 'Natural',
        '인아웃': 'In-out',
        '앞트임': 'Epicanthoplasty',
      },
      zh: {
        'A성형외과': 'A整形外科',
        'B클리닉': 'B诊所',
        'C성형외과': 'C整形外科',
        '서울시 강남구 역삼동 123-45': '首尔市江南区驿三洞123-45',
        '쌍꺼풀 + 앞트임': '双眼皮 + 开眼角',
        '눈매교정': '眼型矫正',
        '코끝성형': '鼻尖整形',
        '자연스러운': '自然',
        '인아웃': '内外双',
        '앞트임': '开眼角',
      },
      ja: {
        'A성형외과': 'A美容外科',
        'B클리닉': 'Bクリニック',
        'C성형외과': 'C美容外科',
        '서울시 강남구 역삼동 123-45': 'ソウル市江南区駅三洞123-45',
        '쌍꺼풀 + 앞트임': '二重まぶた + 目頭切開',
        '눈매교정': '目つき矯正',
        '코끝성형': '鼻先整形',
        '자연스러운': '自然な',
        '인아웃': 'インアウト',
        '앞트임': '目頭切開',
      },
    };

    return dummyTranslations[language][text] || text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateText }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}