import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // 👇👇 탭바 높이 및 스타일 수정 (터치 영역 확대)
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 95 : 75, // 높이를 확 키웠습니다 (기본값보다 약 1.5배)
          paddingBottom: Platform.OS === 'ios' ? 30 : 12, // 아이콘 위치 조정
          paddingTop: 10,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          elevation: 0, // 안드로이드 그림자 제거 (깔끔하게)
          shadowOpacity: 0, // iOS 그림자 제거
        },
        tabBarActiveTintColor: '#FF6B9D',
        tabBarInactiveTintColor: '#C4C4C4',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -4, // 텍스트와 아이콘 간격 좁힘
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <Icon name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: '카테고리',
          tabBarIcon: ({ color }) => <Icon name="grid-view" size={26} color={color} />,
        }}
      />
      
      {/* ❌ explore 탭은 여기서 코드를 지웠습니다! 
         (app/(tabs)/explore.tsx 파일도 같이 삭제해주세요)
      */}

      <Tabs.Screen
        name="recommended"
        options={{
          title: 'AI 추천',
          tabBarIcon: ({ color, focused }) => (
            // 가운데 강조된 버튼 스타일
            <View style={{
              marginTop: -20, // 위로 톡 튀어나오게
              backgroundColor: focused ? '#FF6B9D' : 'white',
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: focused ? 0 : 1,
              borderColor: '#eee',
              ...Platform.select({
                ios: { shadowColor: '#FF6B9D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
                android: { elevation: 5 }
              })
            }}>
              <Icon name="auto-awesome" size={30} color={focused ? 'white' : '#FF6B9D'} />
            </View>
          ),
          tabBarLabel: () => null, // 라벨 숨김 (아이콘만 강조)
        }}
      />
      
      <Tabs.Screen
        name="saved"
        options={{
          title: '저장',
          tabBarIcon: ({ color }) => <Icon name="bookmark" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '마이',
          tabBarIcon: ({ color }) => <Icon name="person" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}