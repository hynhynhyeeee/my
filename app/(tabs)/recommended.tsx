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
import FloatingAIButton from '../../components/FloatingAIButton';

const { width } = Dimensions.get('window');

type FilterType = 'similarity' | 'likes' | 'views';

export default function RecommendedScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('similarity');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const categories = [
    { icon: '📋', name: '전체' },
    { icon: '👁️', name: '눈' },
    { icon: '👃', name: '코' },
    { icon: '👄', name: '입술' },
    { icon: '🦴', name: '윤곽' },
    { icon: '🌟', name: '피부' },
    { icon: '⚡', name: '레이저' },
    { icon: '💝', name: '가슴' },
    { icon: '🦷', name: '치아' },
    { icon: '⬆️', name: '리프팅' },
    { icon: '💉', name: '필러' },
    { icon: '💧', name: '보톡스' },
    { icon: '➕', name: '기타' },
  ];

  const allReviews = [
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
      procedure: '눈매교정',
      likes: 1876,
      views: 12456,
      similarity: 92,
    },
    {
      id: 3,
      category: '코',
      hospital: 'C성형외과',
      procedure: '코끝성형',
      likes: 1523,
      views: 9876,
      similarity: 89,
    },
    {
      id: 4,
      category: '입술',
      hospital: 'D클리닉',
      procedure: '입술필러',
      likes: 1234,
      views: 7654,
      similarity: 85,
    },
  ];

  const filteredReviews = selectedCategory === '전체' 
    ? allReviews 
    : allReviews.filter(r => r.category === selectedCategory);

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (selectedFilter === 'similarity') return b.similarity - a.similarity;
    if (selectedFilter === 'likes') return b.likes - a.likes;
    return b.views - a.views;
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

      <ScrollView 
        style={styles.scrollContent} 
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>✨ 당신이 좋아할 만한 후기</Text>
          <Text style={styles.headerSubtitle}>저장한 후기와 유사한 스타일</Text>
        </View>

        <View style={styles.categoryFilterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryFilter}
          >
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryFilterItem,
                  cat.name === selectedCategory && styles.categoryFilterItemActive,
                ]}
                onPress={() => setSelectedCategory(cat.name)}
              >
                <Text style={styles.categoryFilterIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryFilterText,
                    cat.name === selectedCategory && styles.categoryFilterTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

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
              {review.similarity >= 90 && (
                <View style={styles.aiRecommendBadge}>
                  <Text style={styles.aiRecommendText}>AI 추천!</Text>
                </View>
              )}
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
  categoryFilterSection: {
    paddingVertical: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryFilterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    gap: 6,
  },
  categoryFilterItemActive: {
    backgroundColor: '#333',
  },
  categoryFilterIcon: {
    fontSize: 18,
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryFilterTextActive: {
    color: 'white',
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
  similarityBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#4A90E2',
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
  aiRecommendBadge: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#FF69B4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 10,
  },
  aiRecommendText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
});