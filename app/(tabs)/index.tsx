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
  RefreshControl // 👈 새로고침 기능 추가
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import SearchHeader from '../../components/SearchHeader';
import FloatingAIButton from '../../components/FloatingAIButton';
import { getAllReviews, getLikedReviewIds, checkIsLiked, toggleReviewLike, Review } from '@/services/reviewService';
import { getAiResultsLocally } from '@/services/aiMatching';

const { width } = Dimensions.get('window');

// (이벤트 데이터들은 기존 그대로 유지)
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

export default function HomeScreen() {
  const router = useRouter();
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const eventFlatListRef = useRef(null);
  
  const [recommendedReviews, setRecommendedReviews] = useState<Review[]>([]);
  const [savedReviews, setSavedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // 👈 새로고침 상태 추가

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      // 1. 추천 후기 (10개만 가져오기)
      const allData = await getAllReviews(10);
      setRecommendedReviews(allData.slice(0, 5));

      // 2. 저장한 후기 (🔥 여기가 수정된 부분: 100개 가져와서 내꺼 찾기)
      const likedIds = await getLikedReviewIds();
      if (likedIds.length > 0) {
        // 내 찜 목록이 뒤쪽에 있을 수도 있으니 넉넉히 가져옵니다.
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
      setRefreshing(false); // 로딩 끝
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const handleReviewPress = (reviewId: string | number) => {
    router.push({
      pathname: '/reviews/detail',
      params: { id: reviewId }
    });
  };

  const BeforeAfterReviewCard = ({ review }: { review: Review }) => {
    // 🔥 안전장치: DB 필드명과 앱 변수명 호환성 체크
    const beforeUrl = review.beforeImageUrl || review.before_img;
    const afterUrl = review.afterImageUrl || review.after_img;
    const hospitalName = review.hospitalName || review.hospital_name;
    const procedures = review.procedures;
    
    // URL 보정
    const fixUrl = (url: string) => url ? url.replace('firebasestoragee', 'firebasestorage').replace('..app', '.app') : '';

    if (!beforeUrl || !afterUrl) return null;
    
    return (
      <TouchableOpacity 
        style={styles.beforeAfterCard}
        onPress={() => handleReviewPress(review.id!)}
        activeOpacity={0.9}
      >
        <View style={styles.beforeAfterContainer}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: fixUrl(beforeUrl) }} style={styles.halfImage} resizeMode="cover" />
            <View style={styles.imageLabel}>
              <Text style={styles.imageLabelText}>BEFORE</Text>
            </View>
          </View>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: fixUrl(afterUrl) }} style={styles.halfImage} resizeMode="cover" />
            <View style={styles.imageLabel}>
              <Text style={styles.imageLabelText}>AFTER</Text>
            </View>
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

  // ... (FreeConsultCard, SpecialEventBanner는 기존과 동일)
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
        refreshControl={ // 👇 당겨서 새로고침 연결
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B9D" />
        }
      >
        <SearchHeader />
        
        {/* 추천 후기 */}
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
            {recommendedReviews.map((review) => (
              <BeforeAfterReviewCard key={review.id} review={review} />
            ))}
          </ScrollView>
        </View>

        {/* 첫상담 무료 */}
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

        {/* 특별 이벤트 */}
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

        {/* 👇👇 저장한 후기 (이제 다 뜹니다!) 👇👇 */}
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