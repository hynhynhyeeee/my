import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { analyzeEyePhoto } from '@/services/aiMatching';

export default function SearchHeader() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    if (searchText.trim()) {
      console.log('🔍 검색:', searchText);
      router.push({
        pathname: '/reviews/index',
        params: { query: searchText },
      });
    }
  };

  const handleCameraPress = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,

        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      console.log('📸 이미지 선택됨:', result.assets[0].uri);

      Alert.alert('분석 중', 'AI가 유사한 눈을 찾고 있습니다...');

      const matches = await analyzeEyePhoto(result.assets[0].uri);

      console.log('✅ AI 분석 완료:', matches.length, '개');

      router.push({
        pathname: '/(tabs)/recommended',
        params: {
          aiResults: JSON.stringify(matches.slice(0, 100)),
        },
      });
    } catch (error) {
      console.error('❌ AI 분석 실패:', error);
      Alert.alert('오류', 'AI 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Beauty Inside</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="병원, 시술, 의사 검색..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Icon name="close" size={20} color="#999" />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.cameraButton} onPress={handleCameraPress}>
          <Icon name="photo-camera" size={20} color="#FF6B9D" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B9D',
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  cameraButton: {
    marginLeft: 8,
    padding: 4,
  },
});