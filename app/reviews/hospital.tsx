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
import { LinearGradient } from 'expo-linear-gradient';
import SearchHeader from '../../components/SearchHeader';

const { width } = Dimensions.get('window');

export default function HospitalDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const hospitalName = params.hospitalName as string;
  const hospitalId = params.hospitalId;

  // 더미 데이터
  const hospital = {
    id: hospitalId,
    name: hospitalName,
    address: '서울시 강남구 역삼동 123-45',
    phone: '02-1234-5678',
    description: '20년 전통의 성형외과 전문 병원입니다.',
    
    // 대표 시술 (후기 많은 순)
    topProcedures: [
      { name: '눈 재수술', count: 234 },
      { name: '앞트임', count: 187 },
      { name: '밑트임', count: 142 },
    ],
    
    // 원장 목록
    doctors: [
      { id: 1, name: '김지수', specialty: '눈성형', experience: '15년', reviewCount: 523 },
      { id: 2, name: '이민호', specialty: '코성형', experience: '12년', reviewCount: 412 },
      { id: 3, name: '박서연', specialty: '윤곽', experience: '10년', reviewCount: 289 },
    ],
    
    // 이벤트 배너
    events: [
      { id: 1, title: '쌍꺼풀 특가 이벤트', discount: '30%', endDate: '~12/31' },
      { id: 2, title: '앞트임 + 밑트임 패키지', discount: '20%', endDate: '~01/15' },
    ],
  };

  const goToDoctorReviews = (doctorName: string) => {
    router.push({
      pathname: '/reviews/doctor',
      params: { 
        doctorName: doctorName,
        hospitalName: hospital.name,
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchHeader />

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        {/* 뒤로가기 */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>

        {/* 병원 기본 정보 */}
        <View style={styles.hospitalCard}>
          <Text style={styles.hospitalName}>{hospital.name}</Text>
          <Text style={styles.hospitalAddress}>{hospital.address}</Text>
          <Text style={styles.hospitalPhone}>📞 {hospital.phone}</Text>
          
          {/* 대표 시술 */}
          <View style={styles.topProceduresSection}>
            <Text style={styles.sectionSubtitle}>대표 시술</Text>
            <View style={styles.procedureTagsContainer}>
              {hospital.topProcedures.map((proc, index) => (
                <View key={index} style={styles.procedureTag}>
                  <Text style={styles.procedureTagText}>{proc.name}</Text>
                  <Text style={styles.procedureCount}>{proc.count}건</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.hospitalDescription}>{hospital.description}</Text>
        </View>

        {/* 이벤트 배너 */}
        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>🎉 진행중인 이벤트</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventSlider}
          >
            {hospital.events.map((event) => (
              <LinearGradient
                key={event.id}
                colors={['#ffecd2', '#fcb69f']}
                style={styles.eventBanner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDiscount}>{event.discount} 할인</Text>
                <Text style={styles.eventDate}>{event.endDate}</Text>
              </LinearGradient>
            ))}
          </ScrollView>
        </View>

        {/* 원장 목록 */}
        <View style={styles.doctorsSection}>
          <Text style={styles.sectionTitle}>👨‍⚕️ 원장 목록</Text>
          {hospital.doctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={styles.doctorItem}
              onPress={() => goToDoctorReviews(doctor.name)}
            >
              <View style={styles.doctorAvatar}>
                <Text style={styles.doctorAvatarText}>👨‍⚕️</Text>
              </View>
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.name} 원장</Text>
                <Text style={styles.doctorSpecialty}>{doctor.specialty} 전문 · 경력 {doctor.experience}</Text>
                <Text style={styles.doctorReviews}>후기 {doctor.reviewCount}건</Text>
              </View>
              <Text style={styles.arrowText}>→</Text>
            </TouchableOpacity>
          ))}
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
    marginTop: Platform.OS === 'ios' ? 100 : 90,
  },
  scrollContentContainer: {
    paddingBottom: 80,
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  
  // 병원 정보 카드
  hospitalCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
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
  hospitalName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  hospitalAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  hospitalPhone: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 20,
  },
  topProceduresSection: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  procedureTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  procedureTag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  procedureTagText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  procedureCount: {
    fontSize: 12,
    color: '#999',
  },
  hospitalDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  
  // 이벤트 섹션
  eventsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  eventSlider: {
    paddingHorizontal: 16,
    gap: 12,
  },
  eventBanner: {
    width: width - 80,
    padding: 20,
    borderRadius: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  eventDiscount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 13,
    color: '#666',
  },
  
  // 원장 목록
  doctorsSection: {
    paddingHorizontal: 16,
  },
  doctorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
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
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  doctorAvatarText: {
    fontSize: 30,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  doctorReviews: {
    fontSize: 12,
    color: '#999',
  },
  arrowText: {
    fontSize: 20,
    color: '#333',
  },
});