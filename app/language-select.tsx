import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSelectScreen() {
  const router = useRouter();
  const { setLanguage } = useLanguage();

  const languages = [
    { code: 'ko' as const, flag: '🇰🇷', name: '한국어', nameEng: 'Korean' },
    { code: 'en' as const, flag: '🇺🇸', name: 'English', nameEng: 'English' },
    { code: 'zh' as const, flag: '🇨🇳', name: '中文', nameEng: 'Chinese' },
    { code: 'ja' as const, flag: '🇯🇵', name: '日本語', nameEng: 'Japanese' },
  ];

  const handleSelect = (langCode: 'ko' | 'en' | 'zh' | 'ja') => {
    setLanguage(langCode);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Select Language</Text>
        <Text style={styles.subtitle}>언어를 선택하세요</Text>

        <View style={styles.languageList}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.languageButton}
              onPress={() => handleSelect(lang.code)}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <View style={styles.languageInfo}>
                <Text style={styles.languageName}>{lang.name}</Text>
                <Text style={styles.languageNameEng}>{lang.nameEng}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  languageList: {
    gap: 12,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  flag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  languageNameEng: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    fontSize: 24,
    color: '#333',
  },
});