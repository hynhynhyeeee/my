import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from 'react-native';

interface TranslateButtonProps {
  originalText: string;
  onTranslate?: (translatedText: string, language: string) => void;
}

export default function TranslateButton({ originalText, onTranslate }: TranslateButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ko');

  const languages = [
    { code: 'ko', flag: '🇰🇷', name: '한국어' },
    { code: 'en', flag: '🇺🇸', name: 'English' },
    { code: 'zh', flag: '🇨🇳', name: '中文' },
    { code: 'ja', flag: '🇯🇵', name: '日本語' },
  ];

  // 실제로는 Google Translate API나 Papago API 사용
  const translateText = async (targetLang: string) => {
    // 더미 번역 (실제 구현 시 API 호출)
    const translations: { [key: string]: string } = {
      'en': 'This is a translation test.',
      'zh': '这是翻译测试。',
      'ja': 'これは翻訳テストです。',
      'ko': originalText,
    };

    const translated = translations[targetLang] || originalText;
    
    if (onTranslate) {
      onTranslate(translated, targetLang);
    }
    
    setSelectedLanguage(targetLang);
    setShowModal(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
        <Text style={styles.buttonText}>🌐 번역</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>언어 선택</Text>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  selectedLanguage === lang.code && styles.languageItemActive
                ]}
                onPress={() => translateText(lang.code)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text style={[
                  styles.languageName,
                  selectedLanguage === lang.code && styles.languageNameActive
                ]}>
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  languageItemActive: {
    backgroundColor: '#333',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  languageNameActive: {
    color: 'white',
  },
});