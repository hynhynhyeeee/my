import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import SearchHeader from '../../components/SearchHeader';
import TranslateButton from '../../components/TranslateButton';
import FloatingAIButton from '../../components/FloatingAIButton';

const { width } = Dimensions.get('window');

export default function ReviewDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const reviewId = params.id;

  const [reviewText, setReviewText] = useState('20대 중반 여성입니다. 자연스러운 인아웃 라인을 원했고, 눈매교정도 함께 받았어요. 결과에 매우 만족합니다!');
  const [hospitalName, setHospitalName] = useState('A성형외과');
  const [hospitalAddress, setHospitalAddress] = useState('서울시 강남구 역삼동 123-45');
  const [procedure, setProcedure] = useState('쌍꺼풀 + 앞트임');
  const [hashtags, setHashtags] = useState(['자연스러운', '인아웃', '앞트임', '눈매교정']);

  const review = {
    id: reviewId,
    category: '눈',
    hospitalId: 1,
    doctor: '김지수',
    likes: 2341,
    views: 15234,
    similarity: 95,
    date: '2024.11.15',
    hospitalInfo: {
      phone: '02-1234-5678',
    },
  };

  const handleTranslate = (translatedText: string, language: string) => {
    setReviewText(translatedText);
    
    // 더미 번역 (실제로는 API 사용)
    if (language === 'en') {
      setHospitalName('A Plastic Surgery');
      setHospitalAddress('123-45 Yeoksam-dong, Gangnam-gu, Seoul');
      setProcedure('Double Eyelid + Epicanthoplasty');
      setHashtags(['Natural', 'In-out', 'Epicanthoplasty', 'Eye Correction']);
    } else if (language === 'zh') {
      setHospitalName('A整形外科');
      setHospitalAddress('首尔市江南区驿三洞123-45');
      setProcedure('双眼皮 + 开眼角');
      setHashtags(['自然', '内外双', '开眼角', '眼型矫正']);
    } else if (language === 'ja') {
      setHospitalName('A美容外科');
      setHospitalAddress('ソウル市江南区駅三洞123-45');
      setProcedure('二重まぶた + 目頭切開');
      setHashtags(['自然な', 'インアウト', '目頭切開', '目つき矯正']);
    } else {
      setHospitalName('A성형외과');
      setHospitalAddress('서울시 강남구 역삼동 123-45');
      setProcedure('쌍꺼풀 + 앞트임');
      setHashtags(['자연스러운', '인아웃', '앞트임', '눈매교정']);
    }
  };

  const goToDoctorReviews = () => {
    router.push({
      pathname: '/reviews/doctor',
      params: { 
        doctorName: review.doctor,
        hospitalName: hospitalName,
      }
    });
  };

  const goToHospitalInfo = () => {
    router.push({
      pathname: '/reviews/hospital',
      params: { 
        hospitalId: review.hospitalId,
        hospitalName: hospitalName,
      }
    });
  };

  const goToBooking = () => {
    router.push({
      pathname: '/booking/hospital',
      params: {
        hospitalId: review.hospitalId,
        hospitalName: hospitalName,
        hospitalAddress: hospitalAddress,
        hospitalPhone: review.hospitalInfo.phone,
      }
    });
  };

  const toggleHeart = () => {
    console.log('Toggle heart');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchHeader />

      <ScrollView 
        style={styles.scrollContent} 
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>

        {/* 배너 1: 사진 + 시술정보 + 후기 */}
        <View style={styles.mainCard}>
          <View style={styles.imageSection}>
            <View style={styles.imagePair}>
              <View style={styles.imageContainer}>
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imageLabel}>BEFORE</Text>
                </View>
              </View>
              <View style={styles.imageContainer}>
                <View style={[styles.imagePlaceholder, styles.afterImage]}>
                  <Text style={styles.imageLabel}>AFTER</Text>
                </View>
              </View>
            </View>

            <View style={styles.similarityBadge}>
              <Text style={styles.similarityText}>유사도 {review.similarity}%</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <View>
                <Text style={styles.categoryText}>{review.category}</Text>
                <Text style={styles.procedureText}>{procedure}</Text>
              </View>
              <TouchableOpacity onPress={toggleHeart}>
                <Text style={styles.heartIcon}>🤍</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              <Text style={styles.statText}>❤️ {review.likes}</Text>
              <Text style={styles.statText}>👁️ {review.views}</Text>
              <Text style={styles.dateText}>{review.date}</Text>
            </View>
          </View>

          <View style={styles.reviewSection}>
            {/* 번역 버튼 */}
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewLabel}>후기</Text>
              <TranslateButton 
                originalText={reviewText} 
                onTranslate={handleTranslate}
              />
            </View>
            
            <Text style={styles.reviewText}>{reviewText}</Text>
            
            <View style={styles.hashtagContainer}>
              {hashtags.map((tag, index) => (
                <Text key={index} style={styles.hashtag}>#{tag}</Text>
              ))}
            </View>
          </View>
        </View>
        {review.similarity >= 90 && (
          <View style={styles.aiRecommendBadge}>
            <Text style={styles.aiRecommendText}>AI 추천!</Text>
          </View>
        )}

        {/* 배너 2: 병원정보 + 지도 + 원장 */}
        <View style={styles.hospitalCard}>
          <TouchableOpacity onPress={goToHospitalInfo} style={styles.hospitalSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🏥 병원 정보</Text>
              <Text style={styles.arrowText}>→</Text>
            </View>
            <Text style={styles.hospitalName}>{hospitalName}</Text>
            <Text style={styles.hospitalAddress}>{hospitalAddress}</Text>
            <Text style={styles.hospitalPhone}>📞 {review.hospitalInfo.phone}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToBooking} style={styles.mapSection}>
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapIcon}>🗺️</Text>
              <Text style={styles.mapText}>지도 보기 • 예약하기</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={goToDoctorReviews} style={styles.doctorSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>👨‍⚕️ 담당 원장</Text>
              <Text style={styles.arrowText}>→</Text>
            </View>
            <View style={styles.doctorInfo}>
              <View style={styles.doctorAvatar}>
                <Text style={styles.doctorAvatarText}>👨‍⚕️</Text>
              </View>
              <View style={styles.doctorDetails}>
                <Text style={styles.doctorName}>{review.doctor} 원장</Text>
                <Text style={styles.doctorSubtext}>다른 후기 보기</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 플로팅 AI 버튼 */}
      <FloatingAIButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 75 : 65,
  },
  scrollContentContainer: {
    paddingBottom: 100,
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  mainCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imageSection: {
    padding: 12,
    position: 'relative',
  },
  imagePair: {
    flexDirection: 'row',
    gap: 12,
  },
  imageContainer: {
    flex: 1,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 0.75,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  afterImage: {
    backgroundColor: '#e8f5e9',
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  similarityBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  aiRecommendBadge: {
  position: 'absolute',
  top: 50,
  left: 20,
  backgroundColor: '#FF69B4',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 12,
  zIndex: 10,
},
aiRecommendText: {
  color: 'white',
  fontSize: 11,
  fontWeight: '600',
},
  similarityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    padding: 20,
    paddingTop: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  procedureText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  heartIcon: {
    fontSize: 28,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  dateText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 'auto',
  },
  reviewSection: {
    padding: 20,
    paddingTop: 0,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reviewText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtag: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  hospitalCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  hospitalSection: {
    padding: 20,
  },
  mapSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  mapText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
  },
  doctorSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  arrowText: {
    fontSize: 20,
    color: '#333',
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  hospitalAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  hospitalPhone: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  doctorAvatarText: {
    fontSize: 24,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  doctorSubtext: {
    fontSize: 13,
    color: '#666',
  },
});