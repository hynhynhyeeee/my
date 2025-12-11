import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import SearchHeader from '../../components/SearchHeader';

const { width } = Dimensions.get('window');

export default function HospitalBookingScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const hospitalName = params.hospitalName as string;
  const hospitalAddress = params.hospitalAddress as string;
  const hospitalPhone = params.hospitalPhone as string;
  const hospitalId = params.hospitalId;

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // 예약 가능한 날짜 (예시)
  const availableDates = {
    '2024-12-15': { marked: true, dotColor: '#333' },
    '2024-12-16': { marked: true, dotColor: '#333' },
    '2024-12-17': { marked: true, dotColor: '#333' },
    '2024-12-18': { marked: true, dotColor: '#333' },
    '2024-12-19': { marked: true, dotColor: '#333' },
    '2024-12-20': { marked: true, dotColor: '#333' },
  };

  // 예약 가능한 시간대
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
    setSelectedTime(''); // 날짜 바뀌면 시간 초기화
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('알림', '날짜와 시간을 선택해주세요.');
      return;
    }
    Alert.alert(
      '예약 확인',
      `${selectedDate} ${selectedTime}에 예약하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '확인', 
          onPress: () => {
            Alert.alert('예약 완료', '예약이 완료되었습니다.');
            router.back();
          }
        }
      ]
    );
  };

  const handleChat = () => {
    router.push({
      pathname: '/chat/hospital',
      params: {
        hospitalId: hospitalId,
        hospitalName: hospitalName,
      }
    });
  };

  const handleCall = () => {
    Linking.openURL(`tel:${hospitalPhone}`);
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
        {/* 뒤로가기 */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>

        {/* 병원 정보 */}
        <View style={styles.hospitalCard}>
          <Text style={styles.hospitalName}>{hospitalName}</Text>
          <Text style={styles.hospitalAddress}>{hospitalAddress}</Text>
          <Text style={styles.hospitalPhone}>📞 {hospitalPhone}</Text>
        </View>

        {/* 지도 (큰 버전) */}
        <View style={styles.mapCard}>
          <View style={styles.mapLarge}>
            <Text style={styles.mapIcon}>🗺️</Text>
            <Text style={styles.mapText}>병원 위치</Text>
            <Text style={styles.mapSubtext}>{hospitalAddress}</Text>
          </View>
        </View>

        {/* 캘린더 */}
        <View style={styles.calendarCard}>
          <Text style={styles.sectionTitle}>📅 예약 날짜 선택</Text>
          <Calendar
            current={new Date().toISOString().split('T')[0]}
            minDate={new Date().toISOString().split('T')[0]}
            markedDates={{
              ...availableDates,
              [selectedDate]: {
                selected: true,
                selectedColor: '#333',
              }
            }}
            onDayPress={handleDateSelect}
            theme={{
              selectedDayBackgroundColor: '#333',
              todayTextColor: '#333',
              arrowColor: '#333',
              monthTextColor: '#333',
              textMonthFontWeight: 'bold',
            }}
          />
          {selectedDate && (
            <Text style={styles.selectedDateText}>
              선택된 날짜: {selectedDate}
            </Text>
          )}
        </View>

        {/* 시간 선택 */}
        {selectedDate && (
          <View style={styles.timeCard}>
            <Text style={styles.sectionTitle}>⏰ 예약 시간 선택</Text>
            <View style={styles.timeSlotContainer}>
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.timeSlotActive
                  ]}
                  onPress={() => handleTimeSelect(time)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextActive
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 예약 버튼 */}
        {selectedDate && selectedTime && (
          <TouchableOpacity style={styles.bookingButton} onPress={handleBooking}>
            <Text style={styles.bookingButtonText}>
              예약하기 ({selectedDate} {selectedTime})
            </Text>
          </TouchableOpacity>
        )}

        {/* 채팅 & 전화 */}
        <View style={styles.contactCard}>
          <Text style={styles.sectionTitle}>💬 문의하기</Text>
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
              <Text style={styles.chatIcon}>💬</Text>
              <Text style={styles.contactButtonText}>채팅 상담</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <Text style={styles.callIcon}>📞</Text>
              <Text style={styles.contactButtonText}>전화 상담</Text>
            </TouchableOpacity>
          </View>
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
    marginTop: Platform.OS === 'ios' ? 75 : 65,
  },
  scrollContentContainer: {
    paddingBottom: 100,
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  
  // 병원 정보
  hospitalCard: {
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
  hospitalName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
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
  },

  // 지도
  mapCard: {
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
  mapLarge: {
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 13,
    color: '#666',
  },

  // 캘린더
  calendarCard: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  selectedDateText: {
    marginTop: 16,
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },

  // 시간 선택
  timeCard: {
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
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    minWidth: 70,
    alignItems: 'center',
  },
  timeSlotActive: {
    backgroundColor: '#333',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  timeSlotTextActive: {
    color: 'white',
  },

  // 예약 버튼
  bookingButton: {
    backgroundColor: '#333',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
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
  bookingButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },

  // 채팅 & 전화
  contactCard: {
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
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  chatButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  callButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  chatIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  callIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});