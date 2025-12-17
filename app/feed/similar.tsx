// app/feed/similar.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchHeader from '../../components/SearchHeader';

// 임시 데이터 (나중에 AI 서버로 교체)
const MOCK_REVIEWS = [
  {
    id: '1',
    similarity: 95,
    image: 'https://via.placeholder.com/400',
    hospitalName: 'A성형외과',
    procedure: '쌍꺼풀',
    likes: 2341,
    views: 15234,
    foldThickness: 15.3,
    foldType: 'inline',
  },
  {
    id: '2',
    similarity: 92,
    image: 'https://via.placeholder.com/400',
    hospitalName: 'B클리닉',
    procedure: '눈매교정',
    likes: 1876,
    views: 12456,
    foldThickness: 14.8,
    foldType: 'inline',
  },
  {
    id: '3',
    similarity: 88,
    image: 'https://via.placeholder.com/400',
    hospitalName: 'C성형외과',
    procedure: '앞트임',
    likes: 1543,
    views: 9876,
    foldThickness: 16.2,
    foldType: 'outline',
  },
];

export default function SimilarFeedScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('similar');
  const [reviews] = useState(MOCK_REVIEWS);

  const handleReviewPress = (id: string) => {
    router.push({
      pathname: '/reviews/detail',
      params: { id }
    });
  };

  const goToAIMatching = () => {
    router.push('/ai-matching');
  };

  const getFoldTypeName = (type: string) => {
    const names: any = {
      'inline': '인라인',
      'outline': '아웃라인',
      'parallel': '평행',
    };
    return names[type] || '알 수 없음';
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}만`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}천`;
    return num.toString();
  };

  // 후기 카드
  const renderReview = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleReviewPress(item.id)}
    >
      {/* 유사도 배지 */}
      {activeTab === 'similar' && (
        <View style={styles.badge}>
          <Icon name="auto-awesome" size={14} color="white" />
          <Text style={styles.badgeText}>{item.similarity}% 유사</Text>
        </View>
      )}

      {/* 이미지 */}
      <Image source={{ uri: item.image }} style={styles.image} />

      {/* 정보 */}
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.hospital}>{item.hospitalName}</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.procedure}</Text>
          </View>
        </View>

        {/* 쌍꺼풀 정보 */}
        {activeTab === 'similar' && (
          <View style={styles.geometric}>
            <View style={styles.geoRow}>
              <Icon name="straighten" size={14} color="#666" />
              <Text style={styles.geoText}>
                쌍꺼풀: {item.foldThickness}px
              </Text>
            </View>
            <View style={styles.geoRow}>
              <Icon name="category" size={14} color="#666" />
              <Text style={styles.geoText}>
                {getFoldTypeName(item.foldType)}
              </Text>
            </View>
          </View>
        )}

        {/* 통계 */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Icon name="favorite" size={16} color="#FF6B9D" />
            <Text style={styles.statText}>{formatNumber(item.likes)}</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="visibility" size={16} color="#999" />
            <Text style={styles.statText}>{formatNumber(item.views)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // 빈 화면
  const EmptyView = () => (
    <View style={styles.empty}>
      <Icon name="face-retouching-natural" size={80} color="#ddd" />
      <Text style={styles.emptyTitle}>내 얼굴 사진을 찍어보세요</Text>
      <Text style={styles.emptySubtitle}>
        AI가 나와 비슷한 후기를 찾아드려요
      </Text>
      <TouchableOpacity style={styles.aiButton} onPress={goToAIMatching}>
        <Icon name="photo-camera" size={20} color="white" />
        <Text style={styles.aiButtonText}>사진 촬영하기</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchHeader />

      {/* 탭 */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'similar' && styles.tabActive]}
          onPress={() => setActiveTab('similar')}
        >
          <Icon 
            name="auto-awesome" 
            size={20} 
            color={activeTab === 'similar' ? '#FF6B9D' : '#999'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'similar' && styles.tabTextActive
          ]}>
            나와 유사
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Icon 
            name="grid-view" 
            size={20} 
            color={activeTab === 'all' ? '#FF6B9D' : '#999'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'all' && styles.tabTextActive
          ]}>
            전체
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'popular' && styles.tabActive]}
          onPress={() => setActiveTab('popular')}
        >
          <Icon 
            name="trending-up" 
            size={20} 
            color={activeTab === 'popular' ? '#FF6B9D' : '#999'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'popular' && styles.tabTextActive
          ]}>
            인기
          </Text>
        </TouchableOpacity>
      </View>

      {/* 리스트 */}
      <FlatList
        data={activeTab === 'similar' ? reviews : []}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={EmptyView}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },

  // 탭
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: Platform.OS === 'ios' ? 105 : 95,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: '#FF6B9D' },
  tabText: { fontSize: 15, fontWeight: '600', color: '#999' },
  tabTextActive: { color: '#FF6B9D' },

  // 리스트
  list: { padding: 16, paddingBottom: 80 },

  // 카드
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: 'white' },
  image: { width: '100%', aspectRatio: 1, backgroundColor: '#f0f0f0' },
  info: { padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hospital: { fontSize: 16, fontWeight: '600', color: '#333' },
  tag: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: { fontSize: 12, fontWeight: '600', color: '#FF6B9D' },

  // 쌍꺼풀 정보
  geometric: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  geoRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  geoText: { fontSize: 13, color: '#666' },

  // 통계
  stats: { flexDirection: 'row', gap: 16 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 14, color: '#666' },

  // 빈 화면
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    marginBottom: 24,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  aiButtonText: { fontSize: 15, fontWeight: '600', color: 'white' },
});