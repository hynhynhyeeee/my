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

export default function EventsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const selectedEventId = params.selectedEventId ? parseInt(params.selectedEventId as string) : null;

  const events = [
    {
      id: 1,
      hospitalName: 'A성형외과',
      hospitalId: 1,
      procedure: '쌍꺼풀/눈매교정',
      discount: '첫상담 무료 + 10% 할인',
      originalPrice: '150만원',
      salePrice: '135만원',
      badge: 'HOT',
      colors: ['#FF6B9D', '#FF8FAB'],
    },
    {
      id: 2,
      hospitalName: 'B클리닉',
      hospitalId: 2,
      procedure: '필러/보톡스',
      discount: '첫상담 무료',
      originalPrice: '80만원',
      salePrice: '80만원',
      badge: 'NEW',
      colors: ['#9C27B0', '#BA68C8'],
    },
    {
      id: 3,
      hospitalName: 'C성형외과',
      hospitalId: 3,
      procedure: '코성형',
      discount: '첫상담 무료 + 15% 할인',
      originalPrice: '400만원',
      salePrice: '340만원',
      badge: 'BEST',
      colors: ['#667eea', '#764ba2'],
    },
  ];

  // 선택된 이벤트를 맨 위로 정렬
  const sortedEvents = selectedEventId
    ? [
        ...events.filter(e => e.id === selectedEventId),
        ...events.filter(e => e.id !== selectedEventId),
      ]
    : events;

  const handleEventPress = (event: any) => {
    router.push({
      pathname: '/reviews/event-detail',
      params: {
        eventId: event.id,
        hospitalId: event.hospitalId,
        hospitalName: event.hospitalName,
        procedure: event.procedure,
        discount: event.discount,
        originalPrice: event.originalPrice,
        salePrice: event.salePrice,
      }
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Icon name="local-offer" size={28} color="#FF6B9D" />
          <Text style={styles.title}>첫상담 무료 이벤트</Text>
        </View>

        <View style={styles.eventsList}>
          {sortedEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[styles.eventCard, { backgroundColor: event.colors[0] }]}
              onPress={() => handleEventPress(event)}
              activeOpacity={0.9}
            >
              <View style={styles.eventBadge}>
                <Text style={styles.eventBadgeText}>{event.badge}</Text>
              </View>

              <Text style={styles.hospitalName}>{event.hospitalName}</Text>
              <Text style={styles.procedure}>{event.procedure}</Text>
              <Text style={styles.discount}>{event.discount}</Text>

              <View style={styles.priceContainer}>
                <Text style={styles.originalPrice}>{event.originalPrice}</Text>
                <Icon name="arrow-forward" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.salePrice}>{event.salePrice}</Text>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>자세히 보기</Text>
                <Icon name="chevron-right" size={20} color="white" />
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
  backButton: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  eventsList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  eventCard: {
    padding: 20,
    borderRadius: 16,
    position: 'relative',
    minHeight: 180,
  },
  eventBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  eventBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  hospitalName: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  procedure: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 8,
  },
  discount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  originalPrice: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textDecorationLine: 'line-through',
  },
  salePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});