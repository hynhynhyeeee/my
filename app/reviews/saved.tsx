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

export default function SavedReviewsScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('likes');

  const reviews = [
    {
      id: 101,
      category: '눈',
      hospital: 'D성형외과',
      procedure: '쌍꺼풀',
      likes: 2341,
      views: 15234,
      similarity: 95,
    },
    {
      id: 102,
      category: '눈',
      hospital: 'E클리닉',
      procedure: '앞트임',
      likes: 1523,
      views: 10234,
      similarity: 92,
    },
    {
      id: 103,
      category: '코',
      hospital: 'F성형외과',
      procedure: '코끝성형',
      likes: 987,
      views: 7654,
      similarity: 88,
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
        {/* 뒤로가기 제거 */}
        
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>💾 저장한 후기</Text>
          <Text style={styles.headerSubtitle}>총 {reviews.length}개의 후기</Text>
        </View>

        {/* 정렬 필터 */}
        <View style={styles.sortFilterSection}>
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
          <TouchableOpacity
            style={[styles.sortButton, selectedFilter === 'similarity' && styles.sortButtonActive]}
            onPress={() => setSelectedFilter('similarity')}
          >
            <Text style={[styles.sortButtonText, selectedFilter === 'similarity' && styles.sortButtonTextActive]}>
              유사도순
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
              
              {/* 유사도 배지 - 왼쪽 고정 */}
              <View style={styles.similarityBadge}>
                <Text style={styles.similarityBadgeText}>유사도 {review.similarity}%</Text>
              </View>
              
              <View style={styles.reviewCardInfo}>
                <View style={styles.reviewCardHeader}>
                  <Text style={styles.reviewCardCategory}>{review.category}</Text>
                  <TouchableOpacity onPress={() => toggleHeart(review.id)}>
                    <Text style={styles.heartIcon}>❤️</Text>
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
    paddingBottom: 100,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 8,
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
    position: 'relative',
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