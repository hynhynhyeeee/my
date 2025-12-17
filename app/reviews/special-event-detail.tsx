import React from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import SearchHeader from '../../components/SearchHeader';
import FloatingAIButton from '../../components/FloatingAIButton';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

export default function SpecialEventDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // 특별 이벤트 정보
  const eventInfo = {
    id: params.eventId,
    emoji: params.emoji || '🎁',
    title: params.title || '특별 이벤트',
    subtitle: params.subtitle || '',
    discount: params.discount || '',
    description: params.description || '',
    badge: params.badge || 'EVENT',
    colors: ['#667eea', '#764ba2'],
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* 이벤트 메인 배너 */}
        <View style={[styles.eventBanner, { backgroundColor: eventInfo.colors[0] }]}>
          <View style={styles.eventBadge}>
            <Text style={styles.eventBadgeText}>{eventInfo.badge}</Text>
          </View>
          
          <Text style={styles.bannerEmoji}>{eventInfo.emoji}</Text>
          <Text style={styles.bannerTitle}>{eventInfo.title}</Text>
          <Text style={styles.bannerSubtitle}>{eventInfo.subtitle}</Text>
          <Text style={styles.bannerDiscount}>{eventInfo.discount}</Text>
        </View>

        {/* 이벤트 상세 정보 */}
        <View style={styles.detailCard}>
          <View style={styles.sectionHeader}>
            <Icon name="info" size={20} color="#FF6B9D" />
            <Text style={styles.sectionTitle}>이벤트 안내</Text>
          </View>
          
          <Text style={styles.detailDescription}>{eventInfo.description}</Text>
          
          <View style={styles.detailList}>
            <View style={styles.detailItem}>
              <Icon name="check-circle" size={16} color="#FF6B9D" />
              <Text style={styles.detailText}>신규 회원 가입시 자동 지급</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="check-circle" size={16} color="#FF6B9D" />
              <Text style={styles.detailText}>첫 시술 예약시 즉시 사용 가능</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="check-circle" size={16} color="#FF6B9D" />
              <Text style={styles.detailText}>타 쿠폰과 중복 사용 불가</Text>
            </View>
          </View>
        </View>

        {/* 유의사항 */}
        <View style={styles.noticeCard}>
          <View style={styles.sectionHeader}>
            <Icon name="warning" size={20} color="#FF9800" />
            <Text style={styles.sectionTitle}>유의사항</Text>
          </View>
          <Text style={styles.noticeText}>• 본 이벤트는 당사 사정에 따라 조기 종료될 수 있습니다.</Text>
          <Text style={styles.noticeText}>• 쿠폰은 발급일로부터 30일간 유효합니다.</Text>
          <Text style={styles.noticeText}>• 일부 병원은 이벤트 대상에서 제외될 수 있습니다.</Text>
        </View>

        {/* CTA 버튼 */}
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => router.push('/reviews/category')}
        >
          <Text style={styles.ctaButtonText}>후기 둘러보기</Text>
          <Icon name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
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
  backButton: {
    padding: 16,
  },
  eventBanner: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    position: 'relative',
  },
  eventBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  eventBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bannerEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    textAlign: 'center',
  },
  bannerDiscount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  detailDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailList: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  noticeCard: {
    backgroundColor: '#FFF9E6',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  noticeText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF6B9D',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 18,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});