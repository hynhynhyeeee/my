import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import TranslateButton from '../../components/TranslateButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getReviewById, toggleReviewLike, checkIsLiked } from '@/services/reviewService';

export default function ReviewDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState<any>(null);
  const [reviewText, setReviewText] = useState('');
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const hospitalLocation = {
    latitude: 37.4979,
    longitude: 127.0276,
    address: '서울시 강남구 역삼동 123-45',
  };

  useEffect(() => {
    console.log('📖 상세 페이지 params:', {
      id: params.id,
      before_img: params.before_img ? '있음' : '없음',
      after_img: params.after_img ? '있음' : '없음',
      hospital_name: params.hospital_name,
      doctor_name: params.doctor_name,
    });
    loadReview();
  }, []);

  // 🔥 강력한 Firebase URL 인코딩 함수
  const fixFirebaseUrl = (url: string): string => {
    if (!url) {
      console.log('⚠️ URL이 비어있음');
      return '';
    }
    
    // 이미 완전한 URL이면 그대로 반환
    if (!url.includes('/o/')) {
      console.log('✅ 완전한 URL:', url.substring(0, 50));
      return url;
    }

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
      const finalUrl = `${baseUrl}${encodedPath}${queryParams}`;
      
      console.log('🔧 URL 변환:', url.substring(0, 50), '→', finalUrl.substring(0, 50));
      return finalUrl;
      
    } catch (e) {
      console.log('❌ URL 인코딩 실패:', e);
      return url;
    }
  };

  const loadReview = async () => {
    try {
      const reviewId = String(params.id || '');
      if (reviewId && !reviewId.startsWith('ai_')) {
        checkIsLiked(reviewId).then(setIsLiked);
      }

      let reviewData: any = null;

      // 🔥 Firestore에서 가져오기
      if (params.id && !String(params.id).startsWith('ai_')) {
        const data = await getReviewById(params.id as string);
        if (data) {
          reviewData = { ...data, id: data.id };
          console.log('✅ Firestore 데이터 로드');
        }
      } 
      
      // 🔥 params에서 직접 가져오기 (AI 매칭 결과)
      if (!reviewData && params.id) {
        console.log('✅ params에서 데이터 로드');
        reviewData = {
          id: String(params.id || ''),
          before_img: params.before_img || params.beforeUrl,
          after_img: params.after_img || params.afterUrl,
          hospital_name: params.hospital_name || params.hospitalName,
          doctor_name: params.doctor_name || params.doctorName,
          procedures: params.procedures,
          cost: params.cost,
          review_text: params.review_text || params.summary || '수술 후 매우 만족스럽습니다.',
          similarity: params.similarity,
          doctor_style: params.doctor_style || '화려함',
          doctor_natural_pct: params.doctor_natural_pct || 25,
          doctor_fancy_pct: params.doctor_fancy_pct || 75,
          doctor_total_reviews: params.doctor_total_reviews || 17,
          hospital_total_reviews: params.hospital_total_reviews || 150,
          doctor_best_keywords: params.doctor_best_keywords || '절개,눈매교정,트임',
          hospital_best_keywords: params.hospital_best_keywords || '눈성형,재수술,코성형',
          surgery_date: params.surgery_date || '2024-11-05',
          likeCount: params.likeCount || 0,
          viewCount: params.viewCount || 0,
        };
      }

      if (reviewData) {
        const beforeRaw = reviewData.before_img || reviewData.beforeImageUrl || '';
        const afterRaw = reviewData.after_img || reviewData.afterImageUrl || '';
        
        console.log('📦 원본 URL:', {
          before: beforeRaw.substring(0, 80),
          after: afterRaw.substring(0, 80)
        });

        const normalized = {
          id: reviewData.id,
          beforeUrl: fixFirebaseUrl(beforeRaw),
          afterUrl: fixFirebaseUrl(afterRaw),
          hospitalName: reviewData.hospital_name || reviewData.hospitalName || '병원 정보 없음',
          doctorName: reviewData.doctor_name || '대표원장',
          procedures: reviewData.procedures || '',
          cost: reviewData.cost || '가격 정보 없음',
          specialty: reviewData.doctor_badge || '',
          originalReview: reviewData.review_text || reviewData.review_summary || '수술 후 매우 만족스럽습니다.',
          surgeryDate: reviewData.surgery_date || '',
          doctorStyle: reviewData.doctor_style || '화려함',
          naturalScore: reviewData.doctor_natural_pct || 25,
          gorgeousScore: reviewData.doctor_fancy_pct || 75,
          doctorKeywords: reviewData.doctor_best_keywords || '절개,눈매교정,트임', 
          hospitalKeywords: reviewData.hospital_best_keywords || '눈성형,재수술,코성형',
          totalReviewsDoctor: reviewData.doctor_total_reviews || 17,
          totalReviewsHospital: reviewData.hospital_total_reviews || 150,
          likeCount: Number(reviewData.likeCount || 0),
          viewCount: Number(reviewData.viewCount || 0),
          similarity: reviewData.similarity,
        };

        console.log('✅ 정규화된 데이터:', {
          beforeUrl: normalized.beforeUrl ? '있음' : '없음',
          afterUrl: normalized.afterUrl ? '있음' : '없음',
          hospital: normalized.hospitalName,
          doctor: normalized.doctorName,
        });

        setReview(normalized);
        setReviewText(normalized.originalReview);
        setLikeCount(normalized.likeCount);
      }
    } catch (error) {
      console.error('[Detail] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async () => {
    if (!review?.id) return;
    const newStatus = !isLiked;
    setIsLiked(newStatus);
    setLikeCount(p => newStatus ? p + 1 : p - 1);
    await toggleReviewLike(review.id);
  };

  const handleChatPress = () => {
    if (!review?.hospitalName) return;
    const chatId = `${review.hospitalName}_${review.doctorName}`.replace(/\s+/g, '');
    router.push({
      pathname: '/chat/hospital',
      params: { chatId, hospitalName: review.hospitalName, doctorName: review.doctorName }
    });
  };

  const parseKeywords = (str: string) => String(str).split(',').map(k => k.trim()).filter(k => k).slice(0, 3);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#FF6B9D" /></View>;
  if (!review) return <View style={styles.center}><Text>정보를 불러올 수 없습니다.</Text></View>;

  // 🔥 이미지 URL 검증
  if (!review.beforeUrl || !review.afterUrl) {
    console.error('❌ 이미지 URL 없음:', {
      before: review.beforeUrl,
      after: review.afterUrl
    });
    return (
      <View style={styles.center}>
        <Icon name="broken-image" size={60} color="#999" />
        <Text style={styles.errorText}>이미지를 불러올 수 없습니다</Text>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backBtnText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>후기 상세</Text>
        <View style={{width:40}} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* 1. 이미지 */}
        <View style={styles.imageContainer}>
          <View style={styles.halfImage}>
            <Image 
              source={{ uri: review.beforeUrl }} 
              style={styles.img} 
              resizeMode="cover"
              onError={(e) => console.log('❌ Before 이미지 에러:', e.nativeEvent.error)}
              onLoad={() => console.log('✅ Before 이미지 로드 성공')}
            />
            <View style={styles.label}><Text style={styles.labelText}>BEFORE</Text></View>
          </View>
          <View style={styles.halfImage}>
            <Image 
              source={{ uri: review.afterUrl }} 
              style={styles.img} 
              resizeMode="cover"
              onError={(e) => console.log('❌ After 이미지 에러:', e.nativeEvent.error)}
              onLoad={() => console.log('✅ After 이미지 로드 성공')}
            />
            <View style={[styles.label, {backgroundColor:'#4CAF50'}]}><Text style={styles.labelText}>AFTER</Text></View>
            
            {review.similarity !== undefined && review.similarity > 0 && (
              <View style={styles.similarityBadge}>
                <Icon name="auto-awesome" size={14} color="#FF6B9D" />
                <Text style={styles.similarityText}>
                  {Math.round(review.similarity * 100)}%
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* 2. 시술 정보 & 좋아요 */}
          <View style={styles.titleRow}>
            <View style={{flex:1}}>
              <Text style={styles.procedures}>{review.procedures}</Text>
              <Text style={styles.hospitalName}>{review.hospitalName}</Text>
              
              <View style={styles.doctorInfoRow}>
                <Icon name="person" size={14} color="#666" style={{marginRight: 4}} />
                <Text style={styles.doctorName}>집도의: {review.doctorName}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleToggleLike}>
              <Icon name={isLiked ? "favorite" : "favorite-border"} size={28} color="#FF6B9D" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}><Icon name="favorite" size={14} color="#FF6B9D" /><Text style={styles.statText}>{likeCount}</Text></View>
            <View style={styles.statItem}><Icon name="visibility" size={14} color="#999" /><Text style={styles.statText}>{review.viewCount}</Text></View>
            <Text style={styles.dateText}>{review.surgeryDate}</Text>
          </View>

          <View style={styles.divider} />

          {/* 비용 */}
          <View style={styles.rowBetween}>
            <Text style={styles.label}>비용</Text>
            <Text style={styles.costText}>{review.cost}</Text>
          </View>

          {/* 3. 의사 스타일 (그래프) */}
          {(review.doctorStyle || review.naturalScore !== undefined) && (
            <View style={styles.styleBox}>
              <View style={styles.sectionHeader}>
                <Icon name="face" size={18} color="#333" />
                <Text style={styles.sectionTitle}>의사 스타일 분석</Text>
              </View>
              {review.doctorStyle && <View style={styles.styleTag}><Text style={styles.styleTagText}>{review.doctorStyle}</Text></View>}
              <View style={styles.graphRow}>
                <Text style={styles.graphLabel}>자연스러움</Text>
                <View style={styles.graphBarBg}><View style={[styles.graphBarFill, {width: `${review.naturalScore || 50}%`, backgroundColor: '#4CAF50'}]} /></View>
                <Text style={styles.graphValue}>{review.naturalScore}%</Text>
              </View>
              <View style={styles.graphRow}>
                <Text style={styles.graphLabel}>화려함</Text>
                <View style={styles.graphBarBg}><View style={[styles.graphBarFill, {width: `${review.gorgeousScore || 50}%`, backgroundColor: '#FF6B9D'}]} /></View>
                <Text style={styles.graphValue}>{review.gorgeousScore}%</Text>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* 4. 후기 내용 */}
          <View>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>후기</Text>
              <TranslateButton originalText={reviewText} onTranslate={(t) => setReviewText(t)} />
            </View>
            <Text style={styles.reviewText}>{reviewText}</Text>
          </View>
        </View>

        <View style={styles.thickDivider} />

        {/* 5. 의사 프로필 카드 */}
        <TouchableOpacity 
          style={styles.profileCard}
          onPress={() => router.push({ pathname: '/reviews/doctor', params: { doctorName: review.doctorName, hospitalName: review.hospitalName } })}
        >
          <View style={styles.cardTop}>
            <View style={styles.doctorIconBg}>
                <Icon name="person" size={30} color="#667eea" />
            </View>
            <View style={{flex:1, marginLeft: 12}}>
              <Text style={styles.cardName}>{review.doctorName} 원장</Text>
              <Text style={styles.cardSub}>총 {review.totalReviewsDoctor}개의 후기 보유</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </View>
          
          <View style={styles.bestKeywords}>
            <View style={styles.bestLabelRow}>
                <Icon name="emoji-events" size={16} color="#FF9800" style={{ marginRight: 4 }} />
                <Text style={styles.bestLabel}>Best Top 3:</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {parseKeywords(review.doctorKeywords).map((k, i) => (
                <View key={i} style={styles.bestBadge}>
                  <Text style={styles.bestBadgeText}>{k}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>

        <View style={styles.thickDivider} />

        {/* 6. 병원 프로필 카드 */}
        <TouchableOpacity 
          style={styles.profileCard}
          onPress={() => router.push({ pathname: '/reviews/hospital', params: { hospitalName: review.hospitalName } })}
        >
          <View style={styles.cardTop}>
            <View style={styles.hospitalIconBg}>
                <Icon name="local-hospital" size={26} color="white" />
            </View>
            <View style={{flex:1, marginLeft: 12}}>
              <Text style={styles.cardName}>{review.hospitalName}</Text>
              <Text style={styles.cardSub}>이 병원 후기 {review.totalReviewsHospital}개</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </View>

          <View style={styles.bestKeywords}>
            <View style={styles.bestLabelRow}>
                <Icon name="bar-chart" size={16} color="#1976D2" style={{ marginRight: 4 }} />
                <Text style={styles.bestLabel}>많이 하는 시술:</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {parseKeywords(review.hospitalKeywords).map((k, i) => (
                <View key={i} style={[styles.bestBadge, {backgroundColor: '#E3F2FD'}]}>
                  <Text style={[styles.bestBadgeText, {color: '#1976D2'}]}>{k}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>

        {/* 7. 지도 */}
        <View style={styles.contentContainer}>
          <View style={[styles.sectionHeader, { marginBottom: 10 }]}>
            <Icon name="place" size={18} color="#333" />
            <Text style={styles.sectionTitle}>병원 위치</Text>
          </View>
          <MapView
            style={{height: 150, borderRadius: 12}}
            initialRegion={{...hospitalLocation, latitudeDelta:0.005, longitudeDelta:0.005}}
          >
            <Marker coordinate={hospitalLocation} title={review.hospitalName} />
          </MapView>
          <Text style={styles.address}>{hospitalLocation.address}</Text>
        </View>

      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.chatBtn} onPress={handleChatPress}>
          <Icon name="chat-bubble-outline" size={20} color="#333" />
          <Text style={styles.chatBtnText}>문의하기</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bookBtn}
          onPress={() => router.push({ pathname: '/booking/hospital', params: { hospitalName: review.hospitalName } })}
        >
          <Text style={styles.bookBtnText}>상담 예약하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { marginTop: 16, fontSize: 16, color: '#999', marginBottom: 24 },
  backBtn: { backgroundColor: '#FF6B9D', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  backBtnText: { color: 'white', fontSize: 15, fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS==='ios'?60:20, paddingBottom: 16, borderBottomWidth: 1, borderColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  iconBtn: { padding: 4 },
  
  imageContainer: { flexDirection: 'row', height: 250, padding: 16, gap: 8 },
  halfImage: { flex: 1, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  img: { width: '100%', height: '100%', backgroundColor: '#eee' },
  label: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  labelText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  
  similarityBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
      android: { elevation: 4 }
    })
  },
  similarityText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B9D'
  },

  contentContainer: { padding: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  procedures: { fontSize: 13, color: '#666', fontWeight: '600', marginBottom: 4 },
  hospitalName: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  doctorInfoRow: { flexDirection: 'row', alignItems: 'center' },
  doctorName: { fontSize: 15, color: '#555' },
  
  statsRow: { flexDirection: 'row', marginTop: 12, alignItems: 'center', gap: 12 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 13, color: '#999' },
  dateText: { fontSize: 13, color: '#999', marginLeft: 'auto' },

  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  thickDivider: { height: 8, backgroundColor: '#f8f9fa' },
  
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  label: { fontSize: 15, color: '#666' },
  costText: { fontSize: 16, fontWeight: 'bold', color: '#FF6B9D' },
  
  styleBox: { backgroundColor: '#F8F9FA', padding: 16, borderRadius: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  styleTag: { alignSelf: 'flex-start', backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
  styleTagText: { color: '#2E7D32', fontSize: 13, fontWeight: '600' },
  graphRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  graphLabel: { width: 70, fontSize: 13, color: '#555' },
  graphBarBg: { flex: 1, height: 6, backgroundColor: '#ddd', borderRadius: 3, marginHorizontal: 8 },
  graphBarFill: { height: '100%', borderRadius: 3 },
  graphValue: { width: 30, fontSize: 12, color: '#666', textAlign: 'right' },

  reviewText: { fontSize: 15, lineHeight: 24, color: '#333' },

  profileCard: { padding: 20, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  
  doctorIconBg: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8EAF6', justifyContent: 'center', alignItems: 'center' },
  hospitalIconBg: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FF6B9D', justifyContent: 'center', alignItems: 'center' },
  
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSub: { fontSize: 13, color: '#888', marginTop: 2 },
  
  bestKeywords: { marginTop: 4 },
  bestLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  bestLabel: { fontSize: 13, fontWeight: '600', color: '#333' },
  bestBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 6 },
  bestBadgeText: { fontSize: 12, color: '#EF6C00', fontWeight: '600' },

  address: { fontSize: 13, color: '#666', marginTop: 8, textAlign: 'center' },

  bottomBar: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderColor: '#eee' },
  chatBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingVertical: 14, marginRight: 8 },
  chatBtnText: { fontWeight: '600', color: '#333' },
  bookBtn: { flex: 2, backgroundColor: '#FF6B9D', justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  bookBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});