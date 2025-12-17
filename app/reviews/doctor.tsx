import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import SearchHeader from '../../components/SearchHeader';
import { ReviewCard } from '@/components/ReviewCard';
import { getReviewsByDoctor } from '@/services/reviewService';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function DoctorDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const doctorName = params.doctorName as string;
  const hospitalName = params.hospitalName as string;
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await getReviewsByDoctor(doctorName, 100);
      console.log('👨‍⚕️', doctorName, '후기:', data.length, '개');
      setReviews(data);
    } catch (error) {
      console.error('❌ 의사 후기 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

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
        showsVerticalScrollIndicator={false}
      >
        {/* 뒤로가기 */}
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* 의사 정보 */}
        <View style={styles.doctorSection}>
          <View style={styles.doctorHeader}>
            <View style={styles.doctorAvatar}>
              <Icon name="person" size={40} color="white" />
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctorName}</Text>
              {hospitalName && (
                <Text style={styles.hospitalName}>{hospitalName}</Text>
              )}
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{reviews.length}</Text>
                  <Text style={styles.statLabel}>후기</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 병원 페이지로 이동 */}
          {hospitalName && (
            <TouchableOpacity
              style={styles.hospitalButton}
              onPress={() => router.push({
                pathname: '/reviews/hospital',
                params: { hospitalName }
              })}
            >
              <Icon name="local-hospital" size={20} color="#FF6B9D" />
              <Text style={styles.hospitalButtonText}>
                {hospitalName} 전체 후기 보기
              </Text>
              <Icon name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* 후기 목록 */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>
            {doctorName} 원장님의 후기 ({reviews.length})
          </Text>
          
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="rate-review" size={60} color="#ddd" />
              <Text style={styles.emptyText}>
                아직 {doctorName} 원장님의 후기가 없습니다
              </Text>
            </View>
          )}
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
    marginTop: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 105 : 95,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  backButton: {
    padding: 16,
  },
  doctorSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 8,
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  doctorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorInfo: {
    marginLeft: 16,
    flex: 1,
  },
  doctorName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  hospitalName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B9D',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  hospitalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#FFF0F5',
    borderRadius: 12,
  },
  hospitalButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  reviewsSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
});