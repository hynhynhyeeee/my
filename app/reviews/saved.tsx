import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import SearchHeader from '../../components/SearchHeader';
import FloatingAIButton from '../../components/FloatingAIButton';
import { ReviewCard } from '@/components/ReviewCard';
import { getAllReviews, getLikedReviewIds, Review } from '@/services/reviewService';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SavedReviewsScreen() {
  const router = useRouter();
  const [savedReviews, setSavedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 화면 포커스될 때마다 새로고침
  useFocusEffect(
    useCallback(() => {
      loadSavedReviews();
    }, [])
  );

  const loadSavedReviews = async () => {
    try {
      setLoading(true);
      
      const likedIds = await getLikedReviewIds();
      console.log('[Saved] Liked IDs:', likedIds);

      if (!likedIds || likedIds.length === 0) {
        setSavedReviews([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const allReviews = await getAllReviews(1000);
      const myReviews = allReviews.filter(review => {
        return review.id && likedIds.includes(String(review.id));
      });
      
      console.log('[Saved] Display Count:', myReviews.length);
      setSavedReviews(myReviews);

    } catch (error) {
      console.error('[Saved] Load Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSavedReviews();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SearchHeader />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF6B9D" />
          <Text style={styles.loadingText}>보관함을 불러오는 중...</Text>
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitleContainer}>
              <Icon name="bookmark" size={24} color="#FF6B9D" />
              <Text style={styles.headerTitle}>저장한 후기</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>총 {savedReviews.length}개의 후기</Text>
        </View>

        <View style={styles.reviewList}>
          {savedReviews.length > 0 ? (
            savedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="bookmark-border" size={80} color="#ddd" />
              <Text style={styles.emptyText}>아직 저장한 후기가 없습니다.</Text>
              <Text style={styles.emptySubText}>마음에 드는 후기에 하트를 눌러보세요!</Text>
              
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => router.push('/(tabs)/recommended')}
              >
                <Text style={styles.exploreButtonText}>후기 둘러보기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      <FloatingAIButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContent: { flex: 1, marginTop: 0 },
  scrollContentContainer: { paddingBottom: 100 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: '#999' },
  header: { padding: 20, backgroundColor: 'white', marginBottom: 8 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#333' },
  headerSubtitle: { fontSize: 14, color: '#999' },
  reviewList: { padding: 16, gap: 16 },
  emptyState: { padding: 60, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 16 },
  emptySubText: { fontSize: 14, color: '#999', marginTop: 8, marginBottom: 24 },
  exploreButton: { backgroundColor: '#FF6B9D', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  exploreButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});