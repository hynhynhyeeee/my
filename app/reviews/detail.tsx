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
  
  // 좋아요 상태
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const hospitalLocation = {
    latitude: 37.4979,
    longitude: 127.0276,
    address: '서울시 강남구 역삼동 123-45',
  };

  useEffect(() => {
    loadReview();
  }, []);

  const fixUrl = (url: string): string => {
    if (!url) return '';
    return url.replace('firebasestoragee.app', 'firebasestorage.app').replace('..app', '.app');
  };

  const loadReview = async () => {
    try {
      const reviewId = String(params.id || '');
      if (reviewId) checkIsLiked(reviewId).then(setIsLiked);

      let reviewData: any = null;

      if (params.id && !String(params.id).startsWith('ai_')) {
        const data = await getReviewById(params.id as string);
        if (data) reviewData = { ...data, id: data.id };
      } 
      
      if (!reviewData && (params.beforeUrl || params.id)) {
        reviewData = {
          id: String(params.id || ''),
          beforeImageUrl: params.beforeUrl,
          afterImageUrl: params.afterUrl,
          hospitalName: params.hospitalName,
          doctorName: params.doctorName,
          procedures: params.procedures,
          cost: params.cost,
          review_text: params.summary,
          doctor_total_reviews: Math.floor(Math.random() * 100),
          hospital_total_reviews: Math.floor(Math.random() * 500),
          doctor_best_keywords: '절개 눈매교정,앞트임,자연유착',
          hospital_best_keywords: '눈 재수술,코 수술,리프팅',
        };
      }

      if (reviewData) {
        const normalized = {
          id: reviewData.id,
          beforeUrl: fixUrl(reviewData.before_img || reviewData.beforeImageUrl),
          afterUrl: fixUrl(reviewData.after_img || reviewData.afterImageUrl),
          hospitalName: reviewData.hospital_name || reviewData.hospitalName || '병원 정보 없음',
          doctorName: reviewData.doctor_name || '대표원장',
          procedures: reviewData.procedures || '',
          cost: reviewData.cost || '가격 정보 없음',
          specialty: reviewData.doctor_badge || '',
          originalReview: reviewData.review_text || reviewData.review_summary || '',
          surgeryDate: reviewData.surgery_date || '',
          doctorStyle: reviewData.doctor_style || '',
          naturalScore: reviewData.doctor_natural_pct,
          gorgeousScore: reviewData.doctor_fancy_pct,
          doctorKeywords: reviewData.doctor_best_keywords || '절개,눈매교정,트임', 
          hospitalKeywords: reviewData.hospital_best_keywords || '눈성형,재수술,코성형',
          totalReviewsDoctor: reviewData.doctor_total_reviews || 0,
          totalReviewsHospital: reviewData.hospital_total_reviews || 0,
          likeCount: Number(reviewData.likeCount || 0),
          viewCount: Number(reviewData.viewCount || 0),
        };

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
            <Image source={{ uri: review.beforeUrl }} style={styles.img} resizeMode="cover" />
            <View style={styles.label}><Text style={styles.labelText}>BEFORE</Text></View>
          </View>
          <View style={styles.halfImage}>
            <Image source={{ uri: review.afterUrl }} style={styles.img} resizeMode="cover" />
            <View style={[styles.label, {backgroundColor:'#4CAF50'}]}><Text style={styles.labelText}>AFTER</Text></View>
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

        {/* 5. 의사 프로필 카드 (Best Top 3 포함) */}
        <TouchableOpacity 
          style={styles.profileCard}
          onPress={() => router.push({ pathname: '/reviews/doctor', params: { doctorName: review.doctorName, hospitalName: review.hospitalName } })}
        >
          <View style={styles.cardTop}>
            {/* 🟦 의사 아이콘 (Person) */}
            <View style={styles.doctorIconBg}>
                <Icon name="person" size={30} color="#667eea" />
            </View>
            <View style={{flex:1, marginLeft: 12}}>
              <Text style={styles.cardName}>{review.doctorName} 원장</Text>
              <Text style={styles.cardSub}>총 {review.totalReviewsDoctor}개의 후기 보유</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </View>
          
          {/* 🏆 Best Keywords (의사) -> Icon: emoji-events */}
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

        {/* 6. 병원 프로필 카드 (통계 포함) */}
        <TouchableOpacity 
          style={styles.profileCard}
          onPress={() => router.push({ pathname: '/reviews/hospital', params: { hospitalName: review.hospitalName } })}
        >
          <View style={styles.cardTop}>
            {/* 🏥 병원 아이콘 (Local Hospital) */}
            <View style={styles.hospitalIconBg}>
                <Icon name="local-hospital" size={26} color="white" />
            </View>
            <View style={{flex:1, marginLeft: 12}}>
              <Text style={styles.cardName}>{review.hospitalName}</Text>
              <Text style={styles.cardSub}>이 병원 후기 {review.totalReviewsHospital}개</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </View>

          {/* 📊 병원 통계 -> Icon: bar-chart */}
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS==='ios'?60:20, paddingBottom: 16, borderBottomWidth: 1, borderColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  iconBtn: { padding: 4 },
  
  imageContainer: { flexDirection: 'row', height: 250, padding: 16, gap: 8 },
  halfImage: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  img: { width: '100%', height: '100%', backgroundColor: '#eee' },
  label: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  labelText: { color: 'white', fontSize: 11, fontWeight: 'bold' },

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
  
  // 아이콘 배경 스타일
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