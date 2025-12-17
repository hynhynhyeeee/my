import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Review, checkIsLiked, toggleReviewLike } from '../services/reviewService';

interface Props {
  review: Review;
  onPress?: () => void;
  onToggleLike?: (id: string, newStatus: boolean) => void;
}

export const ReviewCard: React.FC<Props> = ({ review, onPress, onToggleLike }) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(review.likeCount || 0);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (review.id) {
      checkIsLiked(String(review.id)).then(setIsLiked);
    }
  }, [review.id]);

  const handleToggle = async () => {
    if (!review.id) return;
    
    const newStatus = !isLiked;
    setIsLiked(newStatus);
    setLikes(prev => newStatus ? prev + 1 : prev - 1);

    if (onToggleLike) {
      onToggleLike(String(review.id), newStatus);
    }

    await toggleReviewLike(String(review.id));
  };

  // 🔥 Firebase URL 완벽 처리 (한글, 슬래시 등)
  const fixFirebaseUrl = (url: string) => {
    if (!url) return '';
    if (!url.includes('/o/')) return url;

    try {
      const parts = url.split('/o/');
      const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/beauty-inside-665c4.firebasestorage.app/o/';
      
      let pathWithQuery = parts[1];
      let filePath = pathWithQuery;
      let queryParams = '';
      
      if (pathWithQuery.includes('?')) {
        const queryParts = pathWithQuery.split('?');
        filePath = queryParts[0];
        queryParams = '?' + queryParts[1];
      }

      const encodedPath = encodeURIComponent(decodeURIComponent(filePath));
      return `${baseUrl}${encodedPath}${queryParams}`;
      
    } catch (e) {
      console.log('❌ URL 인코딩 실패:', e);
      return url;
    }
  };

  const beforeUrl = fixFirebaseUrl(review.beforeImageUrl || review.before_img || (review as any).beforeUrl || (review as any).before_url || '');
  const afterUrl = fixFirebaseUrl(review.afterImageUrl || review.after_img || (review as any).afterUrl || (review as any).after_url || '');

  console.log('🖼️ ReviewCard 렌더링:', {
    id: review.id,
    beforeUrl: beforeUrl ? '있음' : '없음',
    afterUrl: afterUrl ? '있음' : '없음'
  });

  // URL이 없거나 숨김 상태면 렌더링 안 함
  if (isHidden || !beforeUrl || !afterUrl) {
    console.log('❌ 카드 숨김:', review.id);
    return null;
  }

  const handlePress = () => {
    if (onPress) onPress();
    else {
      const isAi = String(review.id).startsWith('ai_');
      router.push({
        pathname: '/reviews/detail',
        params: { id: isAi ? '' : review.id, ...review } as any
      });
    }
  };

  // 이미지 로드 실패 시 카드 숨김
  const handleImageError = (label: string) => {
    console.log(`🗑️ ${label} 이미지 로드 실패 -> 카드 숨김:`, review.id);
    setIsHidden(true);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Image 
            source={{ uri: beforeUrl }} 
            style={styles.image} 
            resizeMode="cover"
            onError={() => handleImageError('Before')}
            onLoad={() => console.log('✅ Before 이미지 로드 성공:', review.id)}
          />
          <View style={styles.labelBadge}>
            <Text style={styles.labelText}>BEFORE</Text>
          </View>
        </View>
        
        <View style={styles.imageWrapper}>
          <Image 
            source={{ uri: afterUrl }} 
            style={styles.image} 
            resizeMode="cover"
            onError={() => handleImageError('After')}
            onLoad={() => console.log('✅ After 이미지 로드 성공:', review.id)}
          />
          <View style={[styles.labelBadge, { backgroundColor: '#4CAF50' }]}>
            <Text style={styles.labelText}>AFTER</Text>
          </View>
          
          {review.similarity !== undefined && review.similarity > 0 && (
            <View style={styles.similarityBadge}>
              <Icon name="auto-awesome" size={12} color="#FF6B9D" />
              <Text style={styles.similarityText}>{Math.round(review.similarity * 100)}%</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoHeader}>
          <View style={styles.textContainer}>
            <Text style={styles.hospitalName}>
              {review.hospitalName || review.hospital_name || '병원명 없음'}
            </Text>
            <Text style={styles.procedures} numberOfLines={1}>
              {review.procedures || '시술 정보 없음'}
            </Text>
          </View>

          <TouchableOpacity style={styles.heartButton} onPress={handleToggle}>
            <Icon 
              name={isLiked ? "favorite" : "favorite-border"} 
              size={26} 
              color="#FF6B9D" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Icon name="favorite" size={14} color="#FF6B9D" />
            <Text style={styles.statText}>{likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="visibility" size={14} color="#999" />
            <Text style={styles.statText}>{review.viewCount || 0}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4 
      },
      android: { elevation: 3 }
    })
  },
  imageContainer: { 
    flexDirection: 'row', 
    height: 180 
  },
  imageWrapper: { 
    flex: 1, 
    position: 'relative', 
    backgroundColor: '#f0f0f0' 
  },
  image: { 
    width: '100%', 
    height: '100%' 
  },
  labelBadge: { 
    position: 'absolute', 
    top: 8, 
    left: 8, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4 
  },
  labelText: { 
    color: 'white', 
    fontSize: 11, 
    fontWeight: '700' 
  },
  similarityBadge: { 
    position: 'absolute', 
    top: 8, 
    right: 8, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  similarityText: { 
    fontSize: 11, 
    fontWeight: '700', 
    color: '#FF6B9D' 
  },
  infoContainer: { 
    padding: 14 
  },
  infoHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start' 
  },
  textContainer: { 
    flex: 1, 
    marginRight: 8 
  },
  hospitalName: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#333', 
    marginBottom: 4 
  },
  procedures: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 8 
  },
  heartButton: { 
    padding: 4 
  },
  statsRow: { 
    flexDirection: 'row', 
    gap: 12 
  },
  statItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4 
  },
  statText: { 
    fontSize: 13, 
    color: '#999' 
  },
});