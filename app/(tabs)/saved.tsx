import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ReviewCard } from '@/components/ReviewCard';
import { getAllReviews, getLikedReviewIds, Review } from '@/services/reviewService';
import SearchHeader from '@/components/SearchHeader';

export default function SavedScreen() {
  const router = useRouter();
  const [savedReviews, setSavedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔄 화면에 들어올 때마다 데이터 로드
  useFocusEffect(
    useCallback(() => {
      loadSavedReviews();
    }, [])
  );

  const loadSavedReviews = async () => {
    try {
      // 1. 내가 좋아요한 ID 목록 가져오기
      const likedIds = await getLikedReviewIds();
      
      if (likedIds.length === 0) {
        setSavedReviews([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // 2. 전체 리뷰 가져오기 (충분한 수량 확보)
      const allReviews = await getAllReviews(100); 

      // 3. 좋아요한 ID와 일치하는 리뷰만 골라내기
      const mySaved = allReviews.filter(review => 
        review.id && likedIds.includes(String(review.id))
      );

      setSavedReviews(mySaved);
    } catch (error) {
      console.error('[Saved] Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🔄 당겨서 새로고침
  const onRefresh = () => {
    setRefreshing(true);
    loadSavedReviews();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B9D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchHeader />
      
      <View style={styles.header}>
        <Text style={styles.title}>내가 찜한 후기</Text>
        <Text style={styles.count}>{savedReviews.length}개</Text>
      </View>

      {savedReviews.length > 0 ? (
        <FlatList
          data={savedReviews}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ReviewCard review={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B9D" />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 저장한 후기가 없어요.</Text>
          <Text style={styles.emptySubText}>마음에 드는 후기에 하트를 눌러보세요!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  count: { fontSize: 16, fontWeight: '600', color: '#FF6B9D' },
  listContent: { padding: 16, paddingBottom: 100 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
  emptyText: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptySubText: { fontSize: 14, color: '#999' },
});