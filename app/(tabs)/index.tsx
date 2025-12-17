import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  RefreshControl
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import SearchHeader from '../../components/SearchHeader';
import FloatingAIButton from '../../components/FloatingAIButton';
import { getAllReviews, getLikedReviewIds, Review } from '@/services/reviewService';
import { getAiResultsLocally } from '@/services/aiMatching';

const { width } = Dimensions.get('window');

const specialEvents = [
  { id: 1, title: '수험표만 있으면\n최대 49% 할인!', subtitle: '26학년도 수험생 전용 이벤트', period: '2025.10.27 ~ 2026.01.31', colors: ['#FF9A76', '#FF6B9D'], badge: 'HOT', icon: 'school' },
  { id: 2, title: '안녕 연말, 안녕 새해\n최대 49% 할인!', subtitle: '새롭게 다가올 2026년을 준비하세요', period: '2025.12.08 ~ 2026.01.31', colors: ['#FFD8CC', '#FFBFA9'], badge: 'NEW', icon: 'celebration' },
  { id: 3, title: '나에게 딱 맞는\n겨울의 기술', subtitle: '겨울맞이 특별 이벤트', period: '2025.11.01 ~ 2026.02.28', colors: ['#FFB84D', '#FF9933'], badge: 'EVENT', icon: 'ac-unit' },
  { id: 4, title: '고객들이 선택한\n12월 우수병원', subtitle: '오직 고객 후기로만', period: '2025.12.01 ~ 2025.12.31', colors: ['#667EEA', '#764BA2'], badge: 'BEST', icon: 'emoji-events' },
];

const freeConsultEvents = [
  { id: 1, hospitalName: 'A성형외과', hospitalId: 1, procedure: '쌍꺼풀/눈매교정', originalPrice: '2,000,000원', discount: '첫상담 무료', colors: ['#FF6B9D', '#FF8FAB'] },
  { id: 2, hospitalName: 'B클리닉', hospitalId: 2, procedure: '코성형', originalPrice: '3,500,000원', discount: '첫상담 무료', colors: ['#9C27B0', '#BA68C8'] },
  { id: 3, hospitalName: 'C성형외과', hospitalId: 3, procedure: '필러/보톡스', originalPrice: '500,000원', discount: '첫상담 무료', colors: ['#FF9933', '#FFB84D'] },
];

const HOSPITAL_DOCTOR_MAP: { [key: string]: { hospital: string; doctor: string } } = {
  'geunah': { hospital: '그날 성형외과', doctor: '유경한' },
  'nana': { hospital: '나나 성형외과', doctor: '권효정' },
  'nosanghun': { hospital: '노상훈 성형외과', doctor: '김주현' },
  'dress': { hospital: '드레스 성형외과', doctor: '홍수정' },
  'dday': { hospital: '디데이 성형외과의원', doctor: '추성철' },
  'dday_lee': { hospital: '디데이 성형외과의원', doctor: '이주홍' },
  'dm': { hospital: '디엠 성형외과', doctor: '이주홍' },
  'ruby': { hospital: '루비 성형외과', doctor: '이승준' },
  'ruby_hur': { hospital: '루비 성형외과', doctor: '허정우' },
  'luho': { hospital: '루호 성형외과', doctor: '김준영' },
  'luho_park': { hospital: '루호 성형외과', doctor: '박일' },
  'luho_wi': { hospital: '루호 성형외과', doctor: '위성재' },
  'marble': { hospital: '마블 성형외과', doctor: '서용훈' },
  'made': { hospital: '메이드영 성형외과', doctor: '박병찬' },
  'made_jang': { hospital: '메이드영 성형외과', doctor: '장남' },
  'baba': { hospital: '바바 성형외과', doctor: '김상일' },
  'vee': { hospital: '브이 성형외과', doctor: '윤홍상' },
  'sisun': { hospital: '시선 성형외과', doctor: '신재훈' },
  'almond': { hospital: '아몬드 성형외과', doctor: '강승현' },
  'almond_kang': { hospital: '아몬드 성형외과', doctor: '강승호' },
  'almond_kim': { hospital: '아몬드 성형외과', doctor: '김상헌' },
  'id': { hospital: '아이디 성형외과', doctor: '최요안' },
  'eyecontact': { hospital: '아이컨텍 성형외과', doctor: '이석현' },
  'ab': { hospital: '에이비 성형외과', doctor: '김승민' },
  'ab_bae': { hospital: '에이비 성형외과', doctor: '배인호' },
  'atop': { hospital: '에이탑 성형외과', doctor: '손승태' },
  'atop_oh': { hospital: '에이탑 성형외과', doctor: '오화영' },
  'eight': { hospital: '에이트 성형외과', doctor: '박민우' },
  'onair': { hospital: '온에어 성형외과', doctor: '강혜원' },
  'onair_kang': { hospital: '온에어 성형외과', doctor: '강혜원' },
  'ucanbe': { hospital: '유캔비 성형외과', doctor: '권준성' },
  'eunkasoo': { hospital: '은하수 성형외과', doctor: '전희창' },
  'eunkasoo_jun': { hospital: '은하수 성형외과', doctor: '전희창' },
  'jai': { hospital: '차이 성형외과', doctor: '최승호' },
  'clash': { hospital: '클래시 성형외과', doctor: '박성훈' },
  'pop': { hospital: '팝 성형외과', doctor: '류안영' },
  'hannaive': { hospital: '한나이브 성형외과', doctor: '손형빈' },
  'hoolryung': { hospital: '훌륭 성형외과', doctor: '김효동' },
  'hit': { hospital: '히트 성형외과', doctor: '미상' },
};

const PROCEDURE_MAP: { [key: string]: string } = {
  'mono': '쌍꺼풀 (매몰)',
  'inline': '쌍꺼풀 (인라인)',
  'outline': '쌍꺼풀 (아웃라인)',
  'incision': '쌍꺼풀 (절개)',
  'natural': '자연유착',
  'partial': '부분절개',
};

const extractFolderName = (url: string): string => {
  const match = url.match(/reviews\/([^\/]+)\//);
  return match ? match[1] : '';
};

const getHospitalDoctorInfo = (folderName: string) => {
  return HOSPITAL_DOCTOR_MAP[folderName] || {
    hospital: folderName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    doctor: '대표원장'
  };
};

const formatProcedure = (label: string): string => {
  return PROCEDURE_MAP[label] || label;
};

export default function HomeScreen() {
  const router = useRouter();
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const eventFlatListRef = useRef(null);
  
  const [recommendedReviews, setRecommendedReviews] = useState<Review[]>([]);
  const [savedReviews, setSavedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const aiResults = await getAiResultsLocally();
      
      if (aiResults && aiResults.length > 0) {
        console.log('✅ AI 매칭 결과 사용:', aiResults.length, '개');
        
        const aiReviews = aiResults
          .filter((match: any) => match.before_url && match.after_url)
          .map((match: any, index: number) => {
            const folderName = extractFolderName(match.before_url);
            const info = getHospitalDoctorInfo(folderName);
            
            return {
              id: `ai_${index}`,
              before_img: match.before_url,
              after_img: match.after_url,
              hospital_name: info.hospital,
              doctor_name: info.doctor,
              procedures: formatProcedure(match.label),
              similarity: match.similarity,
              likeCount: 0,
              viewCount: 0,
            };
          });
        
        aiReviews.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
        setRecommendedReviews(aiReviews.slice(0, 10));
      } else {
        console.log('⚠️ AI 결과 없음, 기본 후기 표시');
        const defaultReviews = await getAllReviews(10);
        setRecommendedReviews(defaultReviews);
      }

      const likedIds = await getLikedReviewIds();
      if (likedIds.length > 0) {
        const ampleData = await getAllReviews(100);
        const mySaved = ampleData.filter(r => r.id && likedIds.includes(String(r.id)));
        setSavedReviews(mySaved);
      } else {
        setSavedReviews([]);
      }
    } catch (error) {
      console.error('[Home] Load Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const fixFirebaseUrl = (url: string) => {
    if (!url) return '';
    if (!url.includes('/o/')) return url;

    try {
      const parts = url.split('/o/');
      const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/beauty-inside-665c4.firebasestorage.app/o/';
      
      let pathWithQuery = parts[1];
      let filePath = pathWithQuery;
      let queryParams = '';
      
      if (pathWithQuery.includes('?')) {
        const queryParts = pathWithQuery.split('?');
        filePath = queryParts[0];
        queryParams = '?' + queryParts[1];
      }

      const encodedPath = encodeURIComponent(decodeURIComponent(filePath));
      return `${baseUrl}${encodedPath}${queryParams}`;
      
    } catch (e) {
      return url;
    }
  };

  // 🔥 핵심 수정!
  const handleReviewPress = (reviewId: string | number) => {
    const review = recommendedReviews.find(r => r.id === reviewId) || 
                   savedReviews.find(r => r.id === reviewId);
    
    if (!review) {
      router.push({
        pathname: '/reviews/detail',
        params: { id: String(reviewId) }
      });
      return;
    }
    
    const beforeUrl = fixFirebaseUrl(review.beforeImageUrl || review.before_img || '');
    const afterUrl = fixFirebaseUrl(review.afterImageUrl || review.after_img || '');
    
    console.log('🔗 상세 페이지로 이동:', {
      id: review.id,
      hospital: review.hospitalName || review.hospital_name,
    });
    
    router.push({
      pathname: '/reviews/detail',
      params: {
        id: String(review.id || ''),
        beforeUrl: beforeUrl,
        afterUrl: afterUrl,
        hospitalName: review.hospitalName || review.hospital_name || '',
        doctorName: review.doctor_name || '',
        procedures: review.procedures || '',
        cost: review.cost || '',
        specialty: (review as any).doctor_badge || '',
        surgeryDate: (review as any).surgery_date || '',
        doctorStyle: (review as any).doctor_style || '',
        naturalScore: String((review as any).doctor_natural_pct || 0),
        gorgeousScore: String((review as any).doctor_fancy_pct || 0),
        doctorKeywords: (review as any).doctor_best_keywords || '',
        hospitalKeywords: (review as any).hospital_best_keywords || '',
        totalReviewsDoctor: String((review as any).doctor_total_reviews || 0),
        totalReviewsHospital: String((review as any).hospital_total_reviews || 0),
        originalReview: (review as any).review_text || '',
        summary: (review as any).review_summary || '',
        likeCount: String(review.likeCount || 0),
        viewCount: String(review.viewCount || 0),
        similarity: String(review.similarity || 0),
      }
    });
  };

  const BeforeAfterReviewCard = ({ review }: { review: Review }) => {
    const beforeUrl = review.beforeImageUrl || review.before_img;
    const afterUrl = review.afterImageUrl || review.after_img;
    const hospitalName = review.hospitalName || review.hospital_name;
    const procedures = review.procedures;

    if (!beforeUrl || !afterUrl) return null;
    
    return (
      <TouchableOpacity 
        style={styles.beforeAfterCard}
        onPress={() => handleReviewPress(review.id!)}
        activeOpacity={0.9}
      >
        <View style={styles.beforeAfterContainer}>
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: fixFirebaseUrl(beforeUrl) }} 
              style={styles.halfImage} 
              resizeMode="cover"
            />
            <View style={styles.imageLabel}>
              <Text style={styles.imageLabelText}>BEFORE</Text>
            </View>
          </View>
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: fixFirebaseUrl(afterUrl) }} 
              style={styles.halfImage} 
              resizeMode="cover"
            />
            <View style={styles.imageLabel}>
              <Text style={styles.imageLabelText}>AFTER</Text>
            </View>
            
            {review.similarity !== undefined && review.similarity > 0 && (
              <View style={styles.similarityBadgeOnImage}>
                <Icon name="auto-awesome" size={12} color="#FF6B9D" />
                <Text style={styles.similarityBadgeTextOnImage}>
                  {Math.round(review.similarity * 100)}%
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.reviewInfo}>
          <Text style={styles.hospitalName} numberOfLines={1}>{hospitalName || '병원명 없음'}</Text>
          {procedures && (
            <Text style={styles.procedureText} numberOfLines={1}>{procedures}</Text>
          )}
          {review.likeCount !== undefined && (
            <View style={styles.reviewFooter}>
              <View style={styles.statItem}>
                <Icon name="favorite" size={14} color="#FF6B9D" />
                <Text style={styles.statText}>{review.likeCount}</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="visibility" size={14} color="#999" />
                <Text style={styles.statText}>{review.viewCount}</Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const FreeConsultCard = ({ event }: any) => (
    <TouchableOpacity style={styles.consultCard} onPress={() => router.push({ pathname: '/reviews/events', params: { selectedEventId: event.id } })} activeOpacity={0.9}>
      <LinearGradient colors={event.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.consultGradient}>
        <View style={styles.consultBadge}><Icon name="local-offer" size={14} color="white" /><Text style={styles.consultBadgeText}>첫상담 무료</Text></View>
        <View style={styles.consultContent}>
          <Icon name="local-hospital" size={40} color="white" style={{ opacity: 0.3, position: 'absolute', right: 10, top: 10 }} />
          <Text style={styles.consultHospital}>{event.hospitalName}</Text>
          <Text style={styles.consultProcedure}>{event.procedure}</Text>
          <View style={styles.consultPriceRow}>
            <Text style={styles.consultOriginalPrice}>{event.originalPrice}</Text>
            <Icon name="arrow-forward" size={16} color="white" />
            <Text style={styles.consultDiscount}>{event.discount}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const SpecialEventBanner = ({ event, index }: any) => (
    <TouchableOpacity style={styles.specialBanner} onPress={() => router.push({ pathname: '/reviews/special-events', params: { selectedEventId: event.id } })} activeOpacity={0.9}>
      <LinearGradient colors={event.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.specialGradient}>
        <View style={styles.pageIndicator}><Text style={styles.pageText}>{index + 1} / {specialEvents.length}</Text></View>
        <View style={styles.specialBadge}><Text style={styles.specialBadgeText}>{event.badge}</Text></View>
        <View style={styles.specialContent}>
          <Text style={styles.specialTitle}>{event.title}</Text>
          <Text style={styles.specialSubtitle}>{event.subtitle}</Text>
          <Text style={styles.specialPeriod}>{event.period}</Text>
        </View>
        <View style={styles.specialIcon}><Icon name={event.icon} size={120} color="rgba(255, 255, 255, 0.15)" /></View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const onEventViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setActiveEventIndex(viewableItems[0].index || 0);
  }).current;

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SearchHeader />
        <View style={styles.loadingContainer}>
          <Text>로딩 중...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B9D" />
        }
      >
        <SearchHeader />
        
        {recommendedReviews.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="auto-awesome" size={20} color="#FF6B9D" />
              <Text style={styles.sectionTitle}>당신이 좋아할 만한 후기</Text>
              <TouchableOpacity style={styles.seeAllButton} onPress={() => router.push('/(tabs)/recommended')}>
                <Text style={styles.seeAllText}>전체보기</Text>
                <Icon name="chevron-right" size={16} color="#999" />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {recommendedReviews.map((review, index) => (
                <BeforeAfterReviewCard key={review.id || index} review={review} />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="card-giftcard" size={20} color="#FF6B9D" />
            <Text style={styles.sectionTitle}>첫상담 무료 이벤트</Text>
            <TouchableOpacity style={styles.seeAllButton} onPress={() => router.push('/reviews/events')}>
              <Text style={styles.seeAllText}>모든 이벤트 보기</Text>
              <Icon name="chevron-right" size={16} color="#999" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {freeConsultEvents.map((event) => (
              <FreeConsultCard key={event.id} event={event} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="stars" size={20} color="#FF6B9D" />
            <Text style={styles.sectionTitle}>특별 이벤트</Text>
          </View>
          <FlatList
            ref={eventFlatListRef}
            data={specialEvents}
            renderItem={({ item, index }) => <SpecialEventBanner event={item} index={index} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={width - 40 + 10}
            decelerationRate="fast"
            onViewableItemsChanged={onEventViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            contentContainerStyle={styles.bannerContainer}
          />
          <View style={styles.indicatorContainer}>
            {specialEvents.map((_, index) => (
              <View key={index} style={[styles.indicator, activeEventIndex === index && styles.indicatorActive]} />
            ))}
          </View>
        </View>

        {savedReviews.length > 0 && (
          <View style={[styles.section, { marginBottom: 30 }]}>
            <View style={styles.sectionHeader}>
              <Icon name="bookmark" size={20} color="#FF6B9D" />
              <Text style={styles.sectionTitle}>내가 저장한 후기</Text>
              <TouchableOpacity style={styles.seeAllButton} onPress={() => router.push('/(tabs)/saved')}>
                <Text style={styles.seeAllText}>전체보기</Text>
                <Icon name="chevron-right" size={16} color="#999" />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {savedReviews.map((review) => (
                <BeforeAfterReviewCard key={review.id} review={review} />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
      <FloatingAIButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  section: { marginBottom: 24, backgroundColor: 'white', paddingVertical: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginLeft: 8, flex: 1 },
  seeAllButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seeAllText: { fontSize: 13, color: '#999' },
  horizontalScroll: { paddingLeft: 20 },
  beforeAfterCard: { width: 280, backgroundColor: 'white', borderRadius: 16, marginRight: 16, overflow: 'hidden', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }) },
  beforeAfterContainer: { flexDirection: 'row', gap: 8, padding: 12 },
  imageWrapper: { flex: 1, position: 'relative' },
  halfImage: { width: '100%', aspectRatio: 0.75, borderRadius: 12, backgroundColor: '#f0f0f0' },
  imageLabel: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  imageLabelText: { color: 'white', fontSize: 10, fontWeight: '600' },
  similarityBadgeOnImage: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  similarityBadgeTextOnImage: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6B9D',
  },
  reviewInfo: { padding: 16, paddingTop: 8 },
  hospitalName: { fontSize: 14, color: '#666', marginBottom: 4 },
  procedureText: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  reviewFooter: { flexDirection: 'row', gap: 12 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 13, color: '#999' },
  consultCard: { width: 220, marginRight: 16, borderRadius: 16, overflow: 'hidden', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8 }, android: { elevation: 5 } }) },
  consultGradient: { padding: 20, height: 180, position: 'relative' },
  consultBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255, 255, 255, 0.3)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 12 },
  consultBadgeText: { fontSize: 11, fontWeight: '600', color: 'white' },
  consultContent: { flex: 1, justifyContent: 'flex-end' },
  consultHospital: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 6, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  consultProcedure: { fontSize: 14, color: 'rgba(255,255,255,0.95)', marginBottom: 12, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  consultPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  consultOriginalPrice: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textDecorationLine: 'line-through' },
  consultDiscount: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  bannerContainer: { paddingHorizontal: 20 },
  specialBanner: { width: width - 40, height: 200, borderRadius: 16, marginRight: 10, overflow: 'hidden' },
  specialGradient: { flex: 1, position: 'relative' },
  pageIndicator: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0, 0, 0, 0.25)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, zIndex: 10 },
  pageText: { color: 'white', fontSize: 12, fontWeight: '600' },
  specialBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(255, 255, 255, 0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)', zIndex: 10 },
  specialBadgeText: { color: 'white', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  specialContent: { position: 'absolute', left: 24, bottom: 24, right: 80, zIndex: 5 },
  specialTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 8, lineHeight: 30, textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  specialSubtitle: { fontSize: 13, color: 'rgba(255, 255, 255, 0.95)', marginBottom: 8, textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  specialPeriod: { fontSize: 11, color: 'rgba(255, 255, 255, 0.85)', textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  specialIcon: { position: 'absolute', bottom: -30, right: -30, zIndex: 1 },
  indicatorContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  indicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ddd', marginHorizontal: 4 },
  indicatorActive: { width: 24, backgroundColor: '#FF6B9D' },
});