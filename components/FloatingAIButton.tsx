import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function FloatingAIButton() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/consultant/ai');
  };

  return (
    <TouchableOpacity 
      style={styles.floatingButton}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Icon name="psychology" size={28} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B9D',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});