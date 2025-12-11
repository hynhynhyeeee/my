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

const { width } = Dimensions.get('window');

type FilterType = 'similarity' | 'likes' | 'views';

export default function DoctorReviewsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const doctorName = params.doctorName as string;
  const hospitalName = params.hospitalName as string;
  
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('similarity');
  const [isFavorited, setIsFavorited] = useState(false);

  // 의사 정보
  const doctorInfo = {
    name: doctorName,
    hospital: hospitalName,
    totalReviews: 523,
    favoriteCount: 1247, // 즐겨찾기 개수
    oneLiner: '자연스러운 라인 전문, 섬세한 디자인', // 키워드 기반 한줄평
    topKeywords: ['자연스러운', '섬세한', '친절한', '꼼꼼한'],
  };

  const reviews = [
    {
      id: 1,
      category: '눈',
      hospital: hospitalName,
      procedure: '쌍꺼풀 + 앞트임',
      likes: 2341,
      views: 15234,
      similarity: 95,
    },
    {
      id: 2,
      category: '눈',
      hospital: hospitalName,
      procedure: '눈매교정',
      likes: 1876,
      views: 12456,
      similarity: 92,
    },
  ];

  const sortedReviews = [...reviews].sort((a, b) => {
    if (selectedFilter === 'similarity') return b.similarity - a.similarity;
    if (selectedFilter === 'likes') return b.likes - a.likes;
    return b.views - a.views;
  });

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const toggleHeart = (reviewId: number) => {
    console.log('Toggle heart:', reviewId);
  };

  const viewReview = (reviewId: number) => {
    router.push({
      pathname: '/reviews/detail',
      params: { id: reviewId }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchHeader />

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>

        {/* 의사 프로필 */}
        <View style={styles.doctorProfile}>
          <View style={styles.doctorHeader}>
            <View style={styles.doctorAvatar}>
              <Text style={styles.doctorAvatarText}>👨‍⚕️</Text>
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctorInfo.name} 원장</Text>
              <Text style={styles.doctorHospital}>{doctorInfo.hospital}</Text>
              <Text style={styles.doctorReviewCount}>후기 {doctorInfo.totalReviews}건</Text>
            </View>
            
            {/* 즐겨찾기 버튼 */}
            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
              <Text style={styles.favoriteIcon}>{isFavorited ? '⭐' : '☆'}</Text>
              <Text style={styles.favoriteCount}>{doctorInfo.favoriteCount + (isFavorited ? 1 : 0)}</Text>
            </TouchableOpacity>
          </View>

          {/* 한줄평 */}
          <View style={styles.oneLinerSection}>
            <Text style={styles.oneLinerText}>"{doctorInfo.oneLiner}"</Text>
          </View>

          {/* 키워드 */}
          <View style={styles.keywordSection}>
            {doctorInfo.topKeywords.map((keyword, index) => (
              <View key={index} style={styles.keywordTag}>
                <Text style={styles.keywordText}>#{keyword}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 정렬 필터 */}
        <View style={styles.sortFilterSection}>
          <TouchableOpacity
            style={[styles.sortButton, selectedFilter === 'similarity' && styles.sortButtonActive]}
            onPress={() => setSelectedFilter('similarity')}
          >
            <Text style={[styles.sortButtonText, selectedFilter === 'similarity' && styles.sortButtonTextActive]}>
              나와 비슷한 눈
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, selectedFilter === 'likes' && styles.sortButtonActive]}
            onPress={() => setSelectedFilter('likes')}
          >
            <Text style={[styles.sortButtonText, selectedFilter === 'likes' && styles.sortButtonTextActive]}>
              하트 많은순
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, selectedFilter === 'views' && styles.sortButtonActive]}
            onPress={() => setSelectedFilter('views')}
          >
            <Text style={[styles.sortButtonText, selectedFilter === 'views' && styles.sortButtonTextActive]}>
              조회수순
            </Text>
          </TouchableOpacity>
        </View>

        {/* 후기 리스트 */}
        <View style={styles.reviewList}>
          {sortedReviews.map((review) => (
            <TouchableOpacity 
              key={review.id} 
              style={styles.reviewCard} 
              activeOpacity={0.9}
              onPress={() => viewReview(review.id)}
            >
              <View style={styles.reviewImages}>
                <View style={styles.reviewImageHalf}>
                  <Text style={styles.reviewImageLabel}>BEFORE</Text>
                </View>
                <View style={[styles.reviewImageHalf, styles.reviewImageAfter]}>
                  <Text style={styles.reviewImageLabel}>AFTER</Text>
                </View>
              </View>
              <View style={styles.similarityBadge}>
                <Text style={styles.similarityBadgeText}>유사도 {review.similarity}%</Text>
              </View>
              <View style={styles.reviewCardInfo}>
                <View style={styles.reviewCardHeader}>
                  <Text style={styles.reviewCardCategory}>{review.category}</Text>
                  <TouchableOpacity onPress={(e) => {
                    e.stopPropagation();
                    toggleHeart(review.id);
                  }}>
                    <Text style={styles.heartIcon}>🤍</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.reviewCardProcedure}>{review.procedure}</Text>
                <View style={styles.reviewCardStats}>
                  <Text style={styles.reviewCardStat}>❤️ {review.likes}</Text>
                  <Text style={styles.reviewCardStat}>👁️ {review.views}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    marginTop: Platform.OS === 'ios' ? 100 : 90,
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
  doctorProfile: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 20,
    borderRadius: 16,
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
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  doctorAvatarText: {
    fontSize: 30,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  doctorHospital: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  doctorReviewCount: {
    fontSize: 12,
    color: '#999',
  },
  favoriteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  favoriteIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  favoriteCount: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  oneLinerSection: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
  },
  oneLinerText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  keywordSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  keywordText: {
    fontSize: 13,
    color: '#666',
  },
  sortFilterSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  sortButtonActive: {
    backgroundColor: '#333',
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  sortButtonTextActive: {
    color: 'white',
  },
  reviewList: {
    padding: 16,
    gap: 16,
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  reviewImages: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  reviewImageHalf: {
    flex: 1,
    aspectRatio: 0.75,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewImageAfter: {
    backgroundColor: '#e8f5e9',
  },
  reviewImageLabel: {
    fontSize: 14,
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
    borderRadius: 16,
    zIndex: 10,
  },
  similarityBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  reviewCardInfo: {
    padding: 16,
    paddingTop: 8,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewCardCategory: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  heartIcon: {
    fontSize: 20,
  },
  reviewCardProcedure: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  reviewCardStats: {
    flexDirection: 'row',
    gap: 12,
  },
  reviewCardStat: {
    fontSize: 13,
    color: '#999',
  },
});