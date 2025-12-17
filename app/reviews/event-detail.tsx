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
import SearchHeader from '../../components/SearchHeader';
import TranslateButton from '../../components/TranslateButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getReviewById } from '@/services/reviewService';

export default function ReviewDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState<any>(null);
  const [reviewText, setReviewText] = useState('');

  const hospitalLocation = {
    latitude: 37.4979,
    longitude: 127.0276,
    address: '서울시 강남구 역삼동 123-45',
  };

  useEffect(() => {
    console.log('📖 상세 페이지 로드:', params.id);
    loadReview();
  }, []);

  const loadReview = async () => {
    try {
      if (params.beforeUrl && params.afterUrl) {
        console.log('✅ params에서 데이터 로드');
        const reviewData = {
          id: params.id,
          beforeUrl: params.beforeUrl,
          afterUrl: params.afterUrl,
          hospitalName: params.hospitalName,
          doctorName: params.doctorName,
          procedures: params.procedures,
          cost: params.cost,
          summary: params.summary,
        };
        setReview(reviewData);
        setReviewText(reviewData.summary || '');
      } else if (params.id) {
        console.log('🔍 Firestore에서 데이터 로드');
        const data = await getReviewById(params.id as string);
        
        if (data) {
          console.log('📦 Firestore 데이터:', {
            review_text: data.review_text ? '있음' : '없음',
            review_summary: data.review_summary ? '있음' : '없음',
          });
          
          const reviewData = {
            id: data.id,
            beforeUrl: data.before_img || data.beforeImageUrl,
            afterUrl: data.after_img || data.afterImageUrl,
            hospitalName: data.hospital_name || data.hospitalName,
            doctorName: data.doctor_name,
            procedures: data.procedures,
            cost: data.cost,
            specialty: data.doctor_badge,
            originalReview: data.review_text || data.review_summary,  // 후기 원문 없으면 자동 한줄평
            surgeryDate: data.surgery_date,
            doctorStyle: data.doctor_style,
            naturalScore: data.doctor_natural_pct,
            gorgeousScore: data.doctor_fancy_pct,
            doctorKeywords: data.doctor_best_keywords,
            hospitalKeywords: data.hospital_best_keywords,
            totalReviewsDoctor: data.doctor_total_reviews,
            totalReviewsHospital: data.hospital_total_reviews,
            likeCount: data.likeCount || 0,
            viewCount: data.viewCount || 0,
          };
          
          setReview(reviewData);
          setReviewText(reviewData.originalReview || '후기 내용이 없습니다.');
          
          console.log('📝 후기 텍스트:', reviewData.originalReview);
        }
      }
    } catch (error) {
      console.error('❌ 후기 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = (translatedText: string, language: string) => {
    setReviewText(translatedText);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#FF6B9D" />
        <Text style={styles.loadingText}>후기를 불러오는 중...</Text>
      </View>
    );
  }

  if (!review) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <Icon name="error-outline" size={60} color="#999" />
        <Text style={styles.errorText}>후기를 찾을 수 없습니다</Text>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backBtnText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const parseKeywords = (keywordsStr: string) => {
    if (!keywordsStr) return [];
    return keywordsStr.split(',').map(k => k.trim()).slice(0, 5);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>후기 상세</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false}
      >
        {/* 이미지 */}
        <View style={styles.imageSection}>
          {review.beforeUrl && review.afterUrl ? (
            <View style={styles.imageRow}>
              <View style={styles.imageWrapper}>
                <Image 
                  source={{ uri: review.beforeUrl }} 
                  style={styles.img} 
                  resizeMode="cover"
                />
                <View style={styles.imageLabel}>
                  <Text style={styles.imageLabelText}>BEFORE</Text>
                </View>
              </View>
              <View style={styles.imageWrapper}>
                <Image 
                  source={{ uri: review.afterUrl }} 
                  style={styles.img} 
                  resizeMode="cover"
                />
                <View style={[styles.imageLabel, { backgroundColor: '#4CAF50' }]}>
                  <Text style={styles.imageLabelText}>AFTER</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.noImageBox}>
              <Icon name="image-not-supported" size={60} color="#ddd" />
              <Text style={styles.noImageText}>이미지가 없습니다</Text>
            </View>
          )}
        </View>

        {/* 정보 */}
        <View style={styles.infoSection}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              {review.procedures && (
                <Text style={styles.category}>{review.procedures}</Text>
              )}
              <Text style={styles.hospitalName}>{review.hospitalName}</Text>
              {review.doctorName && (
                <View style={styles.doctorRow}>
                  <Text style={styles.doctorName}>• {review.doctorName}</Text>
                  {review.specialty && (
                    <View style={styles.specialtyBadge}>
                      <Icon name="verified" size={14} color="#FF6B9D" />
                      <Text style={styles.specialtyText}>{review.specialty}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
            <TouchableOpacity>
              <Icon name="favorite-border" size={28} color="#FF6B9D" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statsLeft}>
              {review.likeCount !== undefined && (
                <>
                  <Icon name="favorite" size={16} color="#FF6B9D" />
                  <Text style={styles.statText}>{review.likeCount}</Text>
                </>
              )}
              {review.viewCount !== undefined && (
                <>
                  <Icon name="visibility" size={16} color="#999" style={{ marginLeft: 12 }} />
                  <Text style={styles.statText}>{review.viewCount}</Text>
                </>
              )}
            </View>
            {review.surgeryDate && (
              <Text style={styles.dateText}>{review.surgeryDate}</Text>
            )}
          </View>

          <View style={styles.divider} />

          {review.cost && review.cost !== '가격 정보 없음' && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>비용:</Text>
              <Text style={[styles.infoValue, { color: '#FF6B9D', fontWeight: '700' }]}>
                {review.cost}
              </Text>
            </View>
          )}

          {(review.doctorStyle || review.naturalScore !== undefined || review.gorgeousScore !== undefined) && (
            <View style={styles.styleSection}>
              <Text style={styles.styleSectionTitle}>👨‍⚕️ 의사 스타일</Text>
              {review.doctorStyle && (
                <View style={styles.styleRow}>
                  <View style={[
                    styles.styleBadge,
                    { backgroundColor: review.doctorStyle === '자연주의' ? '#E8F5E9' : '#FFF0F5' }
                  ]}>
                    <Text style={[
                      styles.styleBadgeText,
                      { color: review.doctorStyle === '자연주의' ? '#2E7D32' : '#FF6B9D' }
                    ]}>
                      {review.doctorStyle}
                    </Text>
                  </View>
                </View>
              )}
              {review.naturalScore !== undefined && review.naturalScore > 0 && (
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>자연스러움</Text>
                  <View style={styles.scoreBar}>
                    <View style={[styles.scoreBarFill, { width: `${review.naturalScore}%`, backgroundColor: '#4CAF50' }]} />
                  </View>
                  <Text style={styles.scoreText}>{review.naturalScore}%</Text>
                </View>
              )}
              {review.gorgeousScore !== undefined && review.gorgeousScore > 0 && (
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>화려함</Text>
                  <View style={styles.scoreBar}>
                    <View style={[styles.scoreBarFill, { width: `${review.gorgeousScore}%`, backgroundColor: '#FF6B9D' }]} />
                  </View>
                  <Text style={styles.scoreText}>{review.gorgeousScore}%</Text>
                </View>
              )}
              {review.totalReviewsDoctor && (
                <View style={styles.styleRow}>
                  <Text style={styles.totalReviewsText}>
                    이 원장님의 후기 {review.totalReviewsDoctor}건
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.divider} />

          {/* 후기 원문 */}
          <View style={{ marginTop: 16 }}>
            <View style={styles.reviewHeader}>
              <Text style={styles.sectionTitle}>후기</Text>
              <TranslateButton 
                originalText={reviewText} 
                onTranslate={handleTranslate}
              />
            </View>
            <Text style={styles.content}>{reviewText}</Text>
          </View>
        </View>

        <View style={styles.dividerLarge} />

        {/* 병원 카드 */}
        {review.hospitalName && (
          <TouchableOpacity 
            style={styles.linkCard}
            onPress={() => router.push({
              pathname: '/reviews/hospital',
              params: { hospitalName: review.hospitalName }
            })}
          >
            <View style={styles.cardHeader}>
              <Icon name="local-hospital" size={24} color="#FF6B9D" />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{review.hospitalName}</Text>
                {review.totalReviewsHospital && (
                  <Text style={styles.cardSubtitle}>
                    총 {review.totalReviewsHospital}개의 후기
                  </Text>
                )}
              </View>
              <Icon name="chevron-right" size={24} color="#999" />
            </View>
            <Text style={styles.cardDesc}>이 병원의 다른 후기 보기</Text>
          </TouchableOpacity>
        )}

        {/* 지도 */}
        <View style={styles.mapSection}>
          <Text style={styles.mapTitle}>병원 위치</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: hospitalLocation.latitude,
              longitude: hospitalLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: hospitalLocation.latitude,
                longitude: hospitalLocation.longitude,
              }}
              title={review.hospitalName}
              description={hospitalLocation.address}
            />
          </MapView>
          <Text style={styles.addressText}>{hospitalLocation.address}</Text>
        </View>

        {/* 의사 카드 */}
        {review.doctorName && (
          <TouchableOpacity 
            style={styles.linkCard}
            onPress={() => router.push({
              pathname: '/reviews/doctor',
              params: { 
                doctorName: review.doctorName,
                hospitalName: review.hospitalName 
              }
            })}
          >
            <View style={styles.cardHeader}>
              <Icon name="person" size={24} color="#667eea" />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{review.doctorName}</Text>
                {review.totalReviewsDoctor && (
                  <Text style={styles.cardSubtitle}>
                    총 {review.totalReviewsDoctor}개의 후기
                  </Text>
                )}
              </View>
              <Icon name="chevron-right" size={24} color="#999" />
            </View>
            <Text style={styles.cardDesc}>원장님의 다른 후기 모아보기</Text>
          </TouchableOpacity>
        )}

        {/* 베스트 키워드 (의사 카드 밑으로 이동!) */}
        {(review.doctorKeywords || review.hospitalKeywords) && (
          <View style={styles.keywordsContainer}>
            {review.doctorKeywords && (
              <View style={styles.keywordsSection}>
                <Text style={styles.keywordTitle}>이 원장님의 베스트 키워드</Text>
                <View style={styles.keywordsList}>
                  {parseKeywords(review.doctorKeywords).map((keyword, index) => (
                    <View key={index} style={styles.keywordBadge}>
                      <Text style={styles.keywordText}>{keyword}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {review.hospitalKeywords && (
              <View style={styles.keywordsSection}>
                <Text style={styles.keywordTitle}>이 병원의 베스트 키워드</Text>
                <View style={styles.keywordsList}>
                  {parseKeywords(review.hospitalKeywords).map((keyword, index) => (
                    <View key={index} style={[styles.keywordBadge, { backgroundColor: '#E3F2FD' }]}>
                      <Text style={[styles.keywordText, { color: '#1976D2' }]}>{keyword}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => router.push('/chat/hospital')}
        >
          <Icon name="chat-bubble-outline" size={20} color="#333" />
          <Text style={styles.chatButtonText}>문의하기</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bookingButton}
          onPress={() => router.push({
            pathname: '/booking/hospital',
            params: { 
              hospitalName: review.hospitalName,
              procedure: review.procedures
            }
          })}
        >
          <Text style={styles.bookingButtonText}>상담 예약하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  errorText: { marginTop: 16, fontSize: 16, color: '#999', marginBottom: 24 },
  backBtn: { backgroundColor: '#FF6B9D', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  backBtnText: { color: 'white', fontSize: 15, fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 60 : 20, paddingBottom: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  imageSection: { paddingHorizontal: 16, paddingTop: 16 },
  imageRow: { flexDirection: 'row', height: 250, borderRadius: 12, overflow: 'hidden', gap: 8 },
  imageWrapper: { flex: 1, position: 'relative' },
  img: { width: '100%', height: '100%', backgroundColor: '#f0f0f0' },
  imageLabel: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  imageLabelText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  noImageBox: { height: 250, backgroundColor: '#f5f5f5', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  noImageText: { marginTop: 12, fontSize: 14, color: '#999' },
  infoSection: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  category: { fontSize: 13, color: '#666', fontWeight: '600', marginBottom: 6 },
  hospitalName: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  doctorRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  doctorName: { fontSize: 15, color: '#666' },
  specialtyBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF0F5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  specialtyText: { fontSize: 11, color: '#FF6B9D', fontWeight: '600' },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  statsLeft: { flexDirection: 'row', alignItems: 'center' },
  statText: { fontSize: 14, color: '#666', marginLeft: 4 },
  dateText: { fontSize: 13, color: '#999', fontWeight: '400' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 16 },
  dividerLarge: { height: 8, backgroundColor: '#f8f9fa' },
  infoRow: { flexDirection: 'row', marginBottom: 12 },
  infoLabel: { fontSize: 14, color: '#999', width: 70 },
  infoValue: { flex: 1, fontSize: 14, color: '#333', fontWeight: '500' },
  styleSection: { backgroundColor: '#F8F9FA', padding: 16, borderRadius: 12, marginTop: 16 },
  styleSectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  styleRow: { marginBottom: 10 },
  styleBadge: { alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  styleBadgeText: { fontSize: 14, fontWeight: '700' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  scoreLabel: { fontSize: 13, color: '#666', width: 90 },
  scoreBar: { flex: 1, height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden', marginRight: 8 },
  scoreBarFill: { height: '100%', borderRadius: 4 },
  scoreText: { fontSize: 12, color: '#666', fontWeight: '600', width: 40 },
  totalReviewsText: { fontSize: 12, color: '#999', textAlign: 'center' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  content: { fontSize: 15, lineHeight: 24, color: '#333' },
  linkCard: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: 'white' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  cardSubtitle: { fontSize: 12, color: '#999' },
  cardDesc: { fontSize: 13, color: '#999', paddingLeft: 36 },
  mapSection: { backgroundColor: 'white', padding: 20, marginBottom: 0 },
  mapTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  map: { height: 200, borderRadius: 12, marginBottom: 12 },
  addressText: { fontSize: 14, color: '#666', textAlign: 'center' },
  keywordsContainer: { backgroundColor: 'white', padding: 20 },
  keywordsSection: { marginBottom: 16 },
  keywordTitle: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 12 },
  keywordsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  keywordBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  keywordText: { fontSize: 12, color: '#2E7D32', fontWeight: '600' },
  bottomBar: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: 'white' },
  chatButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginRight: 10, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#ddd' },
  chatButtonText: { fontWeight: '600', color: '#333' },
  bookingButton: { flex: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF6B9D', borderRadius: 12, paddingVertical: 14 },
  bookingButtonText: { fontWeight: 'bold', color: 'white', fontSize: 16 },
});