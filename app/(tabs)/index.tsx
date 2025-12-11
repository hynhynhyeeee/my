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
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
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

  const handleSearch = () => {
    Alert.alert('검색', '검색 기능이 여기에 구현됩니다.');
  };

  const selectCategory = (category: string) => {
    router.push({
      pathname: '/reviews/category',
      params: { category }
    });
  };

  const selectEvent = (eventId: number) => {
    Alert.alert('이벤트 선택', `이벤트 ${eventId}번을 선택하셨습니다.`);
  };

  const toggleHeart = (reviewId: number) => {
    Alert.alert('하트', `후기 ${reviewId}번 저장/취소`);
  };

  const viewReview = (reviewId: number) => {
    router.push({
      pathname: '/reviews/detail',
      params: { id: reviewId }
    });
  };

  const goToRecommended = () => {
    router.push('/reviews/recommended');
  };

  const goToSaved = () => {
    router.push('/reviews/saved');
  };

  const categories = [
    { icon: '👁️', name: '눈' },
    { icon: '👃', name: '코' },
    { icon: '👄', name: '입술' },
    { icon: '🦴', name: '윤곽' },
    { icon: '🌟', name: '피부' },
    { icon: '⚡', name: '레이저' },
    { icon: '💝', name: '가슴' },
    { icon: '🦷', name: '치아' },
    { icon: '⬆️', name: '리프팅' },
    { icon: '💉', name: '필러' },
    { icon: '💧', name: '보톡스' },
    { icon: '➕', name: '기타' },
  ];

  const adBanners = [
    { id: 1, title: '🎉 첫 상담 무료 이벤트', subtitle: '지금 바로 병원 상담을 받아보세요!', colors: ['#ffecd2', '#fcb69f'] },
    { id: 2, title: '💝 친구 추천 특별 할인', subtitle: '친구와 함께하면 더 저렴해요!', colors: ['#a8edea', '#fed6e3'] },
    { id: 3, title: '⭐ 후기 작성 포인트 적립', subtitle: '솔직한 후기로 포인트를 받으세요!', colors: ['#fbc2eb', '#a6c1ee'] },
  ];

  const events = [
    { id: 1, icon: '🎁', title: '신규 회원 할인', date: '~12/31' },
    { id: 2, icon: '💝', title: '친구 추천 이벤트', date: '~01/15' },
    { id: 3, icon: '⭐', title: '후기 작성 혜택', date: '상시 진행' },
    { id: 4, icon: '🌸', title: '봄맞이 특가', date: '~03/31' },
    { id: 5, icon: '💎', title: 'VIP 멤버십', date: '상시 모집' },
    { id: 6, icon: '🎊', title: '생일 축하 쿠폰', date: '생일 당월' },
  ];

  const recommendedReviews = [
    { 
      id: 1, 
      category: '눈', 
      similarity: 95, 
      hospital: 'A성형외과',
      procedure: '쌍꺼풀 + 앞트임',
      likes: 1247
    },
    { 
      id: 2, 
      category: '눈', 
      similarity: 92, 
      hospital: 'B클리닉',
      procedure: '눈매교정 + 쌍꺼풀',
      likes: 856
    },
    { 
      id: 3, 
      category: '코', 
      similarity: 89, 
      hospital: 'C성형외과',
      procedure: '코끝성형 + 콧대',
      likes: 623
    },
  ];

  const savedReviews = [
    { 
      id: 101, 
      category: '눈', 
      hospital: 'D성형외과',
      procedure: '쌍꺼풀',
      savedDate: '2일 전',
      likes: 2341
    },
    { 
      id: 102, 
      category: '눈', 
      hospital: 'E클리닉',
      procedure: '앞트임',
      savedDate: '5일 전',
      likes: 1523
    },
    { 
      id: 103, 
      category: '코', 
      hospital: 'F성형외과',
      procedure: '코끝성형',
      savedDate: '1주 전',
      likes: 987
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 고정 헤더 */}
      <View style={styles.fixedHeader}>
        <View style={styles.topBanner}>
          <Text style={styles.bannerText}>my!</Text>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="원하는 시술이나 부위를 검색하세요"
                placeholderTextColor="#999"
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity onPress={handleSearch} style={styles.searchIconButton}>
                <Text style={styles.searchIcon}>🔍</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
              <Text style={styles.cameraButtonText}>📷</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollableContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>시술 카테고리</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categorySlider}
          >
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
          </ScrollView>
        </View>

        <View style={styles.adBannerSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            contentContainerStyle={styles.adBannerSlider}
          >
            {adBanners.map((banner) => (
              <LinearGradient
                key={banner.id}
                colors={banner.colors as [string, string]}
                style={styles.adBanner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.adTitle}>{banner.title}</Text>
                <Text style={styles.adSubtitle}>{banner.subtitle}</Text>
              </LinearGradient>
            ))}
          </ScrollView>
        </View>

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

        <View style={styles.recommendSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ 당신이 좋아할 만한 후기</Text>
            <TouchableOpacity onPress={goToRecommended}>
              <Text style={styles.viewAllText}>전체보기 →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>저장한 후기와 유사한 스타일</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            contentContainerStyle={styles.reviewSlider}
          >
            {recommendedReviews.map((review) => (
              <TouchableOpacity
                key={review.id}
                style={styles.reviewPairContainer}
                onPress={() => viewReview(review.id)}
                activeOpacity={0.9}
              >
                <View style={styles.reviewPair}>
                  <View style={styles.reviewImageContainer}>
                    <View style={styles.reviewImagePlaceholder}>
                      <Text style={styles.placeholderText}>BEFORE</Text>
                    </View>
                    <View style={styles.reviewBadge}>
                      <Text style={styles.badgeText}>유사도 {review.similarity}%</Text>
                    </View>
                  </View>
                  
                  <View style={styles.reviewImageContainer}>
                    <View style={[styles.reviewImagePlaceholder, styles.afterImage]}>
                      <Text style={styles.placeholderText}>AFTER</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.reviewInfo}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewCategory}>{review.category}</Text>
                    <TouchableOpacity onPress={() => toggleHeart(review.id)}>
                      <Text style={styles.heartIcon}>🤍</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.reviewProcedure}>{review.procedure}</Text>
                  <Text style={styles.reviewHospital}>{review.hospital}</Text>
                  <Text style={styles.reviewLikes}>❤️ {review.likes}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.savedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💾 저장한 후기</Text>
            <TouchableOpacity onPress={goToSaved}>
              <Text style={styles.viewAllText}>전체보기 →</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.savedSlider}
          >
            {savedReviews.map((review) => (
              <TouchableOpacity
                key={review.id}
                style={styles.savedReviewCard}
                onPress={() => viewReview(review.id)}
                activeOpacity={0.8}
              >
                <View style={styles.savedReviewPair}>
                  <View style={styles.savedImageSmall}>
                    <Text style={styles.savedImageText}>B</Text>
                  </View>
                  <View style={[styles.savedImageSmall, styles.savedAfter]}>
                    <Text style={styles.savedImageText}>A</Text>
                  </View>
                </View>
                <View style={styles.savedReviewInfo}>
                  <Text style={styles.savedCategory}>{review.category}</Text>
                  <Text style={styles.savedProcedure} numberOfLines={1}>{review.procedure}</Text>
                  <Text style={styles.savedHospital} numberOfLines={1}>{review.hospital}</Text>
                  <View style={styles.savedFooter}>
                    <Text style={styles.savedDate}>{review.savedDate}</Text>
                    <Text style={styles.savedLikes}>❤️ {review.likes}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    padding: 10,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingLeft: 20,
    backgroundColor: 'white',
  },
  bannerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 1,
  },
  searchSection: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: 'white',
    paddingLeft: 16,
  },
  searchInput: {
    flex: 1,
    padding: 14,
    fontSize: 15,
  },
  searchIconButton: {
    padding: 10,
  },
  searchIcon: {
    fontSize: 20,
  },
  cameraButton: {
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButtonText: {
    fontSize: 22,
  },
  scrollableContent: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 160 : 140,
  },
  scrollContent: {
    paddingBottom: 100, // 하단 탭바 공간
  },
  categorySection: {
    marginBottom: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
    paddingHorizontal: 16,
  },
  categorySlider: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryItem: {
    width: 80,
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
    fontSize: 32,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  adBannerSection: {
    marginBottom: 24,
  },
  adBannerSlider: {
    gap: 0,
  },
  adBanner: {
    width: width,
    paddingHorizontal: 16,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 32,
  },
  eventSlider: {
    paddingHorizontal: 16,
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
  recommendSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#999',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  reviewSlider: {
    paddingHorizontal: 16,
    gap: 16,
  },
  reviewPairContainer: {
    width: width - 32,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
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
  reviewPair: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  reviewImageContainer: {
    flex: 1,
    position: 'relative',
  },
  reviewImagePlaceholder: {
    width: '100%',
    aspectRatio: 0.75,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  afterImage: {
    backgroundColor: '#e8f5e9',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  reviewBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  reviewInfo: {
    padding: 16,
    paddingTop: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  heartIcon: {
    fontSize: 20,
  },
  reviewProcedure: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reviewHospital: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  reviewLikes: {
    fontSize: 13,
    color: '#999',
  },
  savedSection: {
    marginBottom: 32,
  },
  savedSlider: {
    paddingHorizontal: 16,
    gap: 12,
  },
  savedReviewCard: {
    width: 140,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
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
  savedReviewPair: {
    flexDirection: 'row',
    gap: 4,
    padding: 8,
  },
  savedImageSmall: {
    flex: 1,
    aspectRatio: 0.7,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedAfter: {
    backgroundColor: '#e8f5e9',
  },
  savedImageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  savedReviewInfo: {
    padding: 12,
    paddingTop: 4,
  },
  savedCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  savedProcedure: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  savedHospital: {
    fontSize: 11,
    color: '#666',
    marginBottom: 6,
  },
  savedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedDate: {
    fontSize: 10,
    color: '#999',
  },
  savedLikes: {
    fontSize: 10,
    color: '#999',
  },
});