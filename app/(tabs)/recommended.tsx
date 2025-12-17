import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, StatusBar, Text, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import SearchHeader from '../../components/SearchHeader';
import FloatingAIButton from '../../components/FloatingAIButton';
import { ReviewCard } from '@/components/ReviewCard';
import { getAllReviews, Review } from '@/services/reviewService';
import { saveAiResultsLocally } from '@/services/aiMatching';

export default function RecommendedScreen() {
  const params = useLocalSearchParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setReviews([]); 
    loadReviews();
  }, [params.aiResults]); 

  const loadReviews = async () => {
    setLoading(true);
    try {
      if (params.aiResults) {
        const aiMatches = JSON.parse(params.aiResults as string);
        await saveAiResultsLocally(aiMatches);

        const convertedReviews = aiMatches
          .filter((match: any) => match.before_url && match.after_url)
          .map((match: any, index: number) => ({
            id: `ai_${index}`,
            hospitalName: match.hospital,
            beforeUrl: match.before_url,
            afterUrl: match.after_url,
            similarity: match.similarity,
            procedures: match.label,
            likeCount: Math.floor(Math.random() * 50) + 10,
            viewCount: Math.floor(Math.random() * 500) + 100,
          }));
        
        convertedReviews.sort((a: any, b: any) => b.similarity - a.similarity);
        setReviews(convertedReviews);
      } else {
        const data = await getAllReviews(100);
        setReviews(data);
      }
    } catch (error) {
      console.error('[Recommended] Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReviews();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SearchHeader />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF6B9D" />
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchHeader />
      
      {params.aiResults && (
        <View style={styles.header}>
          <Text style={styles.headerText}>AI 맞춤 추천 결과</Text>
          <Text style={styles.headerSubtext}>유사도가 높은 순서대로 표시됩니다</Text>
        </View>
      )}
      
      <FlatList
        data={reviews}
        keyExtractor={(item, index) => String(item.id || index)}
        renderItem={({ item }) => <ReviewCard review={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B9D" />
        }
      />
      
      <FloatingAIButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: '#666' },
  header: { backgroundColor: '#FF6B9D', padding: 16, alignItems: 'center' },
  headerText: { color: 'white', fontSize: 18, fontWeight: '700' },
  headerSubtext: { color: 'white', fontSize: 12, marginTop: 4, opacity: 0.9 },
  list: { padding: 16, paddingBottom: 100 },
});