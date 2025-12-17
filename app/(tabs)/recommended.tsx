import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import SearchHeader from '../../components/SearchHeader';
import FloatingAIButton from '../../components/FloatingAIButton';
import { ReviewCard } from '@/components/ReviewCard';
import { getAllReviews, Review } from '@/services/reviewService';

export default function RecommendedScreen() {
  const params = useLocalSearchParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  console.log('🔄 params 변경됨, 다시 로드');
  loadReviews();
  }, [params.aiResults]);

  const loadReviews = async () => {
  setLoading(true);
  try {
    if (params.aiResults) {
      console.log('📦 받은 params.aiResults:', params.aiResults);
      const aiMatches = JSON.parse(params.aiResults as string);
      console.log('🤖 파싱된 aiMatches:', aiMatches.length, '개');
      console.log('🔍 첫 번째 매치:', aiMatches[0]); // 데이터 구조 확인
      
      const convertedReviews = aiMatches
        .filter((match: any) => match.before_url && match.after_url)
        .map((match: any, index: number) => ({
          id: `ai_${index}`,
          hospital_name: match.hospital,
          before_img: match.before_url,
          after_img: match.after_url,
          similarity: match.similarity,
          procedures: match.label,
        }));
      
      console.log('✅ 변환된 리뷰:', convertedReviews.length, '개');
      console.log('📸 첫 번째 리뷰:', convertedReviews[0]);
      
      convertedReviews.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
      setReviews(convertedReviews);
    } else {
      console.log('⚠️ aiResults 없음, 전체 후기 로드');
      const data = await getAllReviews(100);
      setReviews(data);
    }
  } catch (error) {
    console.error('❌ 로드 실패:', error);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B9D" />
        <Text style={styles.loadingText}>후기를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchHeader />
      
      {params.aiResults && reviews.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.headerText}>
            AI가 찾은 유사한 눈 {reviews.length}개
          </Text>
          <Text style={styles.headerSubtext}>
            유사도 40% 이상만 표시됩니다
          </Text>
        </View>
      )}
      
      <FlatList
        data={reviews}
        keyExtractor={(item, index) => `review-${item.id || index}`}
        renderItem={({ item }) => <ReviewCard review={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>후기가 없습니다</Text>
          </View>
        }
      />
      
      <FloatingAIButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  header: {
    backgroundColor: '#FF6B9D',
    padding: 16,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtext: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
  },
  list: {
    padding: 16,
  },
});