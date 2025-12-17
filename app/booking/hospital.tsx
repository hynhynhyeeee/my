import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function BookingScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const hospitalName = params.hospitalName as string;
  const hospitalAddress = params.hospitalAddress as string;
  const hospitalPhone = params.hospitalPhone as string;
  const procedure = params.procedure as string;
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // 예약 가능 시간
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];
  
  // 오늘 날짜
  const today = new Date().toISOString().split('T')[0];
  
  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('알림', '날짜와 시간을 선택해주세요.');
      return;
    }
    
    Alert.alert(
      '예약 확인',
      `${hospitalName}\n${selectedDate} ${selectedTime}\n\n예약을 확정하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '확정', 
          onPress: () => {
            Alert.alert('완료', '예약이 완료되었습니다!');
            router.back();
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <StatusBar barStyle="dark-content" />
      
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상담 예약</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 병원 정보 */}
        <View style={styles.hospitalInfo}>
          <View style={styles.hospitalHeader}>
            <Icon name="local-hospital" size={24} color="#FF6B9D" />
            <View style={styles.hospitalDetails}>
              <Text style={styles.hospitalName}>{hospitalName}</Text>
              {hospitalAddress && (
                <Text style={styles.hospitalAddress}>{hospitalAddress}</Text>
              )}
              {hospitalPhone && (
                <Text style={styles.hospitalPhone}>📞 {hospitalPhone}</Text>
              )}
            </View>
          </View>
          
          {procedure && (
            <View style={styles.procedureBadge}>
              <Text style={styles.procedureText}>상담 시술: {procedure}</Text>
            </View>
          )}
        </View>

        {/* 캘린더 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 날짜 선택</Text>
          <Calendar
            minDate={today}
            onDayPress={handleDateSelect}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: '#FF6B9D',
              }
            }}
            theme={{
              selectedDayBackgroundColor: '#FF6B9D',
              todayTextColor: '#FF6B9D',
              arrowColor: '#FF6B9D',
              monthTextColor: '#333',
              textMonthFontWeight: 'bold',
              textDayFontSize: 14,
              textMonthFontSize: 16,
            }}
          />
        </View>

        {/* 시간 선택 */}
        {selectedDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🕐 시간 선택</Text>
            <View style={styles.timeGrid}>
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.timeSlotSelected
                  ]}
                  onPress={() => handleTimeSelect(time)}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.timeSlotTextSelected
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 예약 정보 요약 */}
        {selectedDate && selectedTime && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>📋 예약 정보</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>병원:</Text>
              <Text style={styles.summaryValue}>{hospitalName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>시술:</Text>
              <Text style={styles.summaryValue}>{procedure || '상담'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>날짜:</Text>
              <Text style={styles.summaryValue}>{selectedDate}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>시간:</Text>
              <Text style={styles.summaryValue}>{selectedTime}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 예약 확정 버튼 */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!selectedDate || !selectedTime) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!selectedDate || !selectedTime}
        >
          <Icon name="event-available" size={24} color="white" />
          <Text style={styles.submitButtonText}>예약 확정하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  hospitalInfo: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 8,
  },
  hospitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hospitalDetails: {
    marginLeft: 12,
    flex: 1,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  hospitalAddress: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  hospitalPhone: {
    fontSize: 13,
    color: '#666',
  },
  procedureBadge: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  procedureText: {
    fontSize: 14,
    color: '#FF6B9D',
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    minWidth: 80,
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  timeSlotTextSelected: {
    color: 'white',
  },
  summarySection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#999',
    width: 60,
  },
  summaryValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF6B9D',
    paddingVertical: 16,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});