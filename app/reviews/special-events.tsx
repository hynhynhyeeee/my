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

export default function SpecialEventsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const selectedEventId = params.selectedEventId ? parseInt(params.selectedEventId as string) : null;

  const events = [
    {
      id: 1,
      icon: 'card-giftcard',
      title: '신규회원 웰컴 쿠폰',
      discount: '최대 50만원',
      description: '첫 예약시 즉시 사용 가능',
      badge: 'NEW',
      colors: ['#667eea', '#764ba2'],
    },
    {
      id: 2,
      icon: 'flash-on',
      title: '한정 특가 SALE',
      discount: '20~30% OFF',
      description: '쌍꺼풀/코성형 특별 할인',
      badge: 'HOT',
      colors: ['#f093fb', '#f5576c'],
    },
    {
      id: 3,
      icon: 'favorite',
      title: '후기 작성 이벤트',
      discount: '5,000P 적립',
      description: '다음 시술시 현금처럼 사용',
      badge: 'EVENT',
      colors: ['#4facfe', '#00f2fe'],
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
      pathname: '/reviews/special-event-detail',
      params: {
        eventId: event.id,
        icon: event.icon,
        title: event.title,
        discount: event.discount,
        description: event.description,
        badge: event.badge,
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
          <Icon name="stars" size={28} color="#FF6B9D" />
          <Text style={styles.title}>특별 이벤트</Text>
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

              <Icon name={event.icon} size={80} color="white" style={styles.eventIcon} />
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDescription}>{event.description}</Text>
              <Text style={styles.eventDiscount}>{event.discount}</Text>

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
    padding: 32,
    borderRadius: 20,
    position: 'relative',
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
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
  eventIcon: {
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  eventDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    textAlign: 'center',
  },
  eventDiscount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});