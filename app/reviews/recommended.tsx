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
import { useRouter } from 'expo-router';
import SearchHeader from '../../components/SearchHeader';

const { width } = Dimensions.get('window');

type FilterType = 'likes' | 'views' | 'similarity';

export default function RecommendedReviewsScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('similarity');

  const reviews = [
    {
      id: 1,
      category: '눈',
      hospital: 'A성형외과',
      procedure: '쌍꺼풀 + 앞트임',
      likes: 2341,
      views: 15234,
      similarity: 95,
    },
    {
      id: 2,
      category: '눈',
      hospital: 'B클리닉',
      procedure: '눈매교정 + 쌍꺼풀',
      likes: 1876,
      views: 12456,
      similarity: 92,
    },
    {
      id: 3,
      category: '코',
      hospital: 'C성형외과',
      procedure: '코끝성형 + 콧대',
      likes: 1523,
      views: 9876,
      similarity: 89,
    },
    {
      id: 4,
      category: '눈',
      hospital: 'D클리닉',
      procedure: '앞트임 + 밑트임',
      likes: 1234,
      views: 8765,
      similarity: 87,
    },
    {
      id: 5,
      category: '입술',
      hospital: 'E성형외과',
      procedure: '입술필러',
      likes: 987,
      views: 6543,
      similarity: 84,
    },
  ];

  const sortedReviews = [...reviews].sort((a, b) => {
    if (selectedFilter === 'likes') return b.likes - a.likes;
    if (selectedFilter === 'views') return b.views - a.views;
    return b.similarity - a.similarity;
  });

  const toggleHeart = (reviewId: number) => {
    console.log('Toggle heart:', reviewId);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SearchHeader />

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← 뒤로</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>✨ 나를 위한 추천</Text>
          <Text style={styles.headerSubtitle}>저장한 후기와 유사한 스타일을 추천해드려요</Text>
        </View>

        {/* 정렬 필터 */}
        <View style={styles.sortFilterSection}>
          <TouchableOpacity
            style={[styles.sortButton, selectedFilter === 'similarity' && styles.sortButtonActive]}
            onPress={() => setSelectedFilter('similarity')}
          >
            <Text style={[styles.sortButtonText, selectedFilter === 'similarity' && styles.sortButtonTextActive]}>
              유사도순
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, selectedFilter === 'likes' && styles.sortButtonActive]}
            onPress={() => setSelectedFilter('likes')}
          >
            <Text style={[styles.sortButtonText, selectedFilter === 'likes' && styles.sortButtonTextActive]}>
              찜 많은순
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
            <TouchableOpacity key={review.id} style={styles.reviewCard} activeOpacity={0.9}>
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
                  <TouchableOpacity onPress={() => toggleHeart(review.id)}>
                    <Text style={styles.heartIcon}>🤍</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.reviewCardProcedure}>{review.procedure}</Text>
                <Text style={styles.reviewCardHospital}>{review.hospital}</Text>
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
    marginTop: Platform.OS === 'ios' ? 100:90,
  },
  scrollContentContainer: {
    paddingBottom: 80,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
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
    backgroundColor: '#667eea',
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
    marginBottom: 0,  // 간격 없애기
    paddingBottom: 16,
    borderBottomWidth: 1,  // 선 추가
    borderBottomColor: '#e0e0e0',  // 연한 회색 선
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
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 10,
  },
  similarityBadgeText: {
    color: 'white',
    fontSize: 12,
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
    color: '#667eea',
  },
  heartIcon: {
    fontSize: 20,
  },
  reviewCardProcedure: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reviewCardHospital: {
    fontSize: 14,
    color: '#666',
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