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
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import SearchHeader from '../../components/SearchHeader';
import { ReviewCard } from '@/components/ReviewCard';
import { getReviewsByHospital } from '@/services/reviewService';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HospitalDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const hospitalName = params.hospitalName as string;
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 임시 병원 정보 (나중에 Firestore에서 가져오기)
  const hospitalInfo = {
    name: hospitalName,
    address: '서울시 강남구 역삼동 123-45',
    phone: '02-1234-5678',
    latitude: 37.4979,
    longitude: 127.0276,
    openHours: '평일 09:00-18:00',
    specialties: ['눈', '코', '윤곽'],
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await getReviewsByHospital(hospitalName, 100);
      console.log('🏥', hospitalName, '후기:', data.length, '개');
      setReviews(data);
    } catch (error) {
      console.error('❌ 병원 후기 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    Linking.openURL(`tel:${hospitalInfo.phone}`);
  };

  const handleChat = () => {
    router.push({
      pathname: '/chat/hospital',
      params: { hospitalName }
    });
  };

  const handleBooking = () => {
    router.push({
      pathname: '/booking/hospital',
      params: { 
        hospitalName,
        hospitalAddress: hospitalInfo.address,
        hospitalPhone: hospitalInfo.phone,
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SearchHeader />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF6B9D" />
          <Text style={styles.loadingText}>병원 정보를 불러오는 중...</Text>
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

        {/* 병원 정보 */}
        <View style={styles.infoSection}>
          <View style={styles.hospitalHeader}>
            <Icon name="local-hospital" size={32} color="#FF6B9D" />
            <View style={styles.hospitalInfo}>
              <Text style={styles.hospitalName}>{hospitalInfo.name}</Text>
              <Text style={styles.hospitalAddress}>{hospitalInfo.address}</Text>
            </View>
          </View>

          {/* 전문 분야 */}
          <View style={styles.specialtiesRow}>
            {hospitalInfo.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyBadge}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>

          {/* 영업 시간 */}
          <View style={styles.infoRow}>
            <Icon name="access-time" size={20} color="#666" />
            <Text style={styles.infoText}>{hospitalInfo.openHours}</Text>
          </View>

          {/* 액션 버튼 */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleCall}
            >
              <Icon name="phone" size={24} color="#FF6B9D" />
              <Text style={styles.actionButtonText}>전화</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleChat}
            >
              <Icon name="chat-bubble-outline" size={24} color="#FF6B9D" />
              <Text style={styles.actionButtonText}>채팅</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={handleBooking}
            >
              <Icon name="event" size={24} color="white" />
              <Text style={[styles.actionButtonText, { color: 'white' }]}>
                예약
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 지도 */}
        <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>위치</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: hospitalInfo.latitude,
              longitude: hospitalInfo.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: hospitalInfo.latitude,
                longitude: hospitalInfo.longitude,
              }}
              title={hospitalInfo.name}
              description={hospitalInfo.address}
            />
          </MapView>
          <Text style={styles.addressText}>{hospitalInfo.address}</Text>
        </View>

        {/* 후기 목록 */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>
            이 병원의 후기 ({reviews.length})
          </Text>
          
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="rate-review" size={60} color="#ddd" />
              <Text style={styles.emptyText}>아직 후기가 없습니다</Text>
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
    marginTop: Platform.OS === 'ios' ? 0:0
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
  infoSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 8,
  },
  hospitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hospitalInfo: {
    marginLeft: 12,
    flex: 1,
  },
  hospitalName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  hospitalAddress: {
    fontSize: 14,
    color: '#666',
  },
  specialtiesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  specialtyBadge: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialtyText: {
    fontSize: 13,
    color: '#FF6B9D',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B9D',
  },
  actionButtonPrimary: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  mapSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  map: {
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  reviewsSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 80,
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});