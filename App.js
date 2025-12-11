import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function App() {
  const scrollViewRef = useRef(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert('이미지 선택됨', `이미지 분석 기능이 여기에 구현됩니다.`);
    }
  };

  const selectCategory = (category) => {
    Alert.alert('카테고리 선택', `${category} 카테고리를 선택하셨습니다.`);
  };

  const selectEvent = (eventId) => {
    Alert.alert('이벤트 선택', `이벤트 ${eventId}번을 선택하셨습니다.`);
  };

  const categories = [
    { icon: '👁️', name: '눈' },
    { icon: '👃', name: '코' },
    { icon: '👄', name: '입술' },
    { icon: '🦴', name: '윤곽' },
    { icon: '✨', name: '주름' },
    { icon: '⬆️', name: '리프팅' },
    { icon: '💉', name: '필러' },
    { icon: '💧', name: '보톡스' },
    { icon: '⚡', name: '레이저' },
    { icon: '🌟', name: '피부' },
    { icon: '💪', name: '지방' },
    { icon: '👗', name: '체형' },
    { icon: '💝', name: '가슴' },
    { icon: '💇', name: '탈모' },
    { icon: '🦷', name: '치아' },
    { icon: '➕', name: '기타' },
  ];

  const events = [
    { id: 1, icon: '🎁', title: '신규 회원 할인', date: '~12/31' },
    { id: 2, icon: '💝', title: '친구 추천 이벤트', date: '~01/15' },
    { id: 3, icon: '⭐', title: '후기 작성 혜택', date: '상시 진행' },
    { id: 4, icon: '🌸', title: '봄맞이 특가', date: '~03/31' },
    { id: 5, icon: '💎', title: 'VIP 멤버십', date: '상시 모집' },
    { id: 6, icon: '🎊', title: '생일 축하 쿠폰', date: '생일 당월' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 고정 헤더 */}
      <View style={styles.fixedHeader}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.topBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.bannerText}>my!</Text>
        </LinearGradient>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="원하는 시술이나 부위를 검색하세요"
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.searchButton} onPress={pickImage}>
              <Text style={styles.searchButtonText}>📷</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 스크롤 가능한 컨텐츠 */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollableContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 시술 카테고리 */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>시술 카테고리</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryItem}
                onPress={() => selectCategory(category.name)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 광고 배너 */}
        <LinearGradient
          colors={['#ffecd2', '#fcb69f']}
          style={styles.adBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.adTitle}>🎉 첫 상담 무료 이벤트</Text>
          <Text style={styles.adSubtitle}>지금 바로 병원 상담을 받아보세요!</Text>
        </LinearGradient>

        {/* 특별 이벤트 */}
        <View style={styles.eventSection}>
          <Text style={styles.sectionTitle}>특별 이벤트</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventSlider}
          >
            {events.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => selectEvent(event.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#a8edea', '#fed6e3']}
                  style={styles.eventImage}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.eventImageIcon}>{event.icon}</Text>
                </LinearGradient>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>{event.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 인기 후기 */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewTitle}>인기 후기</Text>
          <Text style={styles.reviewText}>
            여기에는 인기 후기들이 표시됩니다.{'\n'}
            스크롤을 내려도 상단 검색창은 고정됩니다.
          </Text>
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
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  topBanner: {
    padding: 20,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
  },
  bannerText: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 1,
  },
  searchSection: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    padding: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    fontSize: 15,
    backgroundColor: 'white',
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#667eea',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: 24,
  },
  scrollableContent: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 165 : 155,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  categorySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryItem: {
    width: (width - 32 - 30) / 4,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  adBanner: {
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  adTitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  adSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  eventSection: {
    marginBottom: 24,
  },
  eventSlider: {
    paddingVertical: 4,
    gap: 12,
  },
  eventCard: {
    width: (width - 32) / 3 - 8,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  eventImage: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventImageIcon: {
    fontSize: 32,
  },
  eventInfo: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 11,
    color: '#999',
  },
  reviewSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    minHeight: 300,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  reviewText: {
    color: '#666',
    lineHeight: 24,
  },
});