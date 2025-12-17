import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import SearchHeader from '../../components/SearchHeader';
import FloatingAIButton from '../../components/FloatingAIButton';

export default function ReviewsIndexScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchHeader />
      
      <View style={styles.content}>
        <Text style={styles.title}>후기</Text>
        <Text style={styles.subtitle}>이 페이지는 사용되지 않습니다</Text>
      </View>

      <FloatingAIButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 105 : 95,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
});