import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function SearchHeader() {
  const router = useRouter();

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert('이미지 선택됨', `이미지 분석 기능이 여기에 구현됩니다.`);
    }
  };

  const handleSearch = () => {
    Alert.alert('검색', '검색 기능이 여기에 구현됩니다.');
  };

  return (
    <View style={styles.fixedHeader}>
      <View style={styles.topBanner}>
        <Text style={styles.bannerText}>my!</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="원하는 시술이나 부위를 검색하세요"
              placeholderTextColor="#999"
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={handleSearch} style={styles.searchIconButton}>
              <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
            <Text style={styles.cameraButtonText}>📷</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 40 : 0, // 줄임
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  topBanner: {
    paddingHorizontal: 20,
    paddingVertical: 2, // 줄임
    backgroundColor: 'white',
  },
  bannerText: {
    fontSize: 18, // 줄임
    fontWeight: '700',
    color: '#333',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 8,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: 'white',
    paddingLeft: 12,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 14,
  },
  searchIconButton: {
    padding: 6,
  },
  searchIcon: {
    fontSize: 16,
  },
  cameraButton: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButtonText: {
    fontSize: 16,
  },
});