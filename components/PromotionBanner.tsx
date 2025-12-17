import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

interface Props {
  event: {
    title: string;
    subtitle: string;
    period: string;
    colors: string[];
    icon?: string;
    backgroundImage?: string;
  };
  index: number;
  total: number;
}

export default function PromotionBanner({ event, index, total }: Props) {
  return (
    <LinearGradient
      colors={event.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.banner}
    >
      {/* 배경 이미지 (있을 경우) */}
      {event.backgroundImage && (
        <Image 
          source={{ uri: event.backgroundImage }}
          style={styles.backgroundImage}
          contentFit="cover"
        />
      )}
      
      {/* 페이지 인디케이터 */}
      <View style={styles.pageIndicator}>
        <Text style={styles.pageText}>{index + 1} / {total}</Text>
      </View>
      
      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        <Text style={styles.mainTitle}>{event.title}</Text>
        <Text style={styles.subtitle}>{event.subtitle}</Text>
        <Text style={styles.period}>{event.period}</Text>
      </View>
      
      {/* 장식 아이콘 */}
      {event.icon && (
        <View style={styles.decorIcon}>
          <Icon name={event.icon} size={80} color="rgba(255,255,255,0.2)" />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: width - 40,
    height: 200,
    borderRadius: 16,
    marginRight: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    opacity: 0.8,
  },
  pageIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 24,
    justifyContent: 'center',
    flex: 1,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  period: {
    fontSize: 12,
    color: '#999',
  },
  decorIcon: {
    position: 'absolute',
    bottom: -20,
    right: -20,
  },
});