import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import FloatingAIButton from '../../components/FloatingAIButton';
import { View } from 'react-native';

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
          },
          tabBarActiveTintColor: '#333',
          tabBarInactiveTintColor: '#999',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('home'),
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
          }}
        />
        <Tabs.Screen
          name="category"
          options={{
            title: t('procedures'),
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📝</Text>,
          }}
        />
        <Tabs.Screen
          name="recommended"
          options={{
            title: t('recommended'),
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>✨</Text>,
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: t('saved'),
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💾</Text>,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t('profile'),
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
          }}
        />
      </Tabs>
      
      {/* 플로팅 AI 버튼 */}
      <FloatingAIButton />
    </View>
  );
}