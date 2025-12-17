import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import SearchHeader from '../../components/SearchHeader';
import { ReviewCard } from '@/components/ReviewCard';
import { getAllReviews, Review } from '@/services/reviewService';
import Icon from 'react-native-vector-icons/MaterialIcons';

type FilterType = 'likes' | 'views' | 'similarity';

export default function CategoryReviewScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const initialCategory = (params.category as string) || '눈';
  
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('likes');
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { icon: 'visibility', name: '눈' },
    { icon: 'face', name: '코' },
    { icon: 'mood', name: '입술' },
    { icon: 'face-retouching-natural', name: '윤곽' },
    { icon: 'spa', name: '피부' },
    { icon: 'flash-on', name: '레이저' },
    { icon: 'favorite', name: '가슴' },
    { icon: 'local-hospital', name: '치아' },
    { icon: 'trending-up', name: '리프팅' },
    { icon: 'colorize', name: '필러' },
    { icon: 'water-drop', name: '보톡스' },
    { icon: 'add-circle', name: '기타' },
  ];

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await getAllReviews(500);
      console.log('📂 카테고리 화면:', data.length, '개 후기');
      setAllReviews(data);
    } catch (error) {
      console.error('❌ 카테고리 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = allReviews.filter(review => {
    const procedures = review.procedures || '';
    if (selectedCategory === '눈') {
      return procedures.includes('눈') || 
             procedures.includes('쌍') || 
             procedures.includes('트임') ||
             procedures.includes('안검');
    }
    if (selectedCategory === '코') {
      return procedures.includes('코');
    }
    if (selectedCategory === '입술') {
      return procedures.includes('입술');
    }
    return procedures.includes(selectedCategory);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (selectedFilter === 'likes') {
      return (b.likeCount || 0) - (a.likeCount || 0);
    }
    if (selectedFilter === 'views') {
      return (b.viewCount || 0) - (a.viewCount || 0);
    }
    return (b.similarity || 0) - (a.similarity || 0);
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SearchHeader />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF6B9D" />
          <Text style={styles.loadingText}>후기를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchHeader />

      <ScrollView 
        style={styles.scrollContent} 
        contentContainerStyle={styles.scrollContentContainer} 
        showsVerticalScrollIndicator={false}
      >
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
                  cat.name === selectedCategory && styles.categoryFilterItemActive
                ]} 
                onPress={() => setSelectedCategory(cat.name)}
              >
                <Icon 
                  name={cat.icon} 
                  size={18} 
                  color={cat.name === selectedCategory ? 'white' : '#666'} 
                />
                <Text 
                  style={[
                    styles.categoryFilterText, 
                    cat.name === selectedCategory && styles.categoryFilterTextActive
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
            style={[
              styles.sortButton, 
              selectedFilter === 'likes' && styles.sortButtonActive
            ]} 
            onPress={() => setSelectedFilter('likes')}
          >
            <Text 
              style={[
                styles.sortButtonText, 
                selectedFilter === 'likes' && styles.sortButtonTextActive
              ]}
            >
              찜 많은순
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.sortButton, 
              selectedFilter === 'views' && styles.sortButtonActive
            ]} 
            onPress={() => setSelectedFilter('views')}
          >
            <Text 
              style={[
                styles.sortButtonText, 
                selectedFilter === 'views' && styles.sortButtonTextActive
              ]}
            >
              조회수순
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.sortButton, 
              selectedFilter === 'similarity' && styles.sortButtonActive
            ]} 
            onPress={() => setSelectedFilter('similarity')}
          >
            <Text 
              style={[
                styles.sortButtonText, 
                selectedFilter === 'similarity' && styles.sortButtonTextActive
              ]}
            >
              유사도순
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reviewList}>
          {sortedReviews.length > 0 ? (
            sortedReviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                아직 {selectedCategory} 후기가 없습니다
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContent: { flex: 1 },
  scrollContentContainer: { paddingBottom: 100 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  categoryFilterSection: { 
    paddingVertical: 16, 
    backgroundColor: 'white', 
    marginBottom: 8 
  },
  categoryFilter: { paddingHorizontal: 16, gap: 8 },
  categoryFilterItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    backgroundColor: '#f0f0f0', 
    gap: 6 
  },
  categoryFilterItemActive: { backgroundColor: '#FF6B9D' },
  categoryFilterText: { fontSize: 14, fontWeight: '500', color: '#666' },
  categoryFilterTextActive: { color: 'white' },
  sortFilterSection: { 
    flexDirection: 'row', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    gap: 8, 
    backgroundColor: 'white', 
    marginBottom: 8 
  },
  sortButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 16, 
    backgroundColor: '#f0f0f0' 
  },
  sortButtonActive: { backgroundColor: '#FF6B9D' },
  sortButtonText: { fontSize: 13, fontWeight: '500', color: '#666' },
  sortButtonTextActive: { color: 'white' },
  reviewList: { padding: 16 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#999' },
});