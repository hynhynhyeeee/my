import { Stack } from 'expo-router';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true, // 👈 [중요] 이게 있어야 스와이프로 뒤로가기가 됩니다.
          gestureDirection: 'horizontal', // 가로 스와이프
          animation: 'slide_from_right', // 자연스러운 슬라이드 애니메이션
        }}
      >
        <Stack.Screen name="language-select" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="reviews" options={{ headerShown: false }} />
        <Stack.Screen name="booking" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
        <Stack.Screen name="consultant" options={{ headerShown: false }} />
      </Stack>
    </LanguageProvider>
  );
}