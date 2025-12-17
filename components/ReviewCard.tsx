import React, { useState, useEffect } from 'react';
// 👇 [수정됨] 여기에 'Platform'이 반드시 있어야 합니다!
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

  const fixUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('firebasestorage')) {
        return url.replace('firebasestoragee.app', 'firebasestorage.app').replace('..app', '.app');
    }
    return url;
  };

  const beforeUrl = fixUrl(review.beforeImageUrl || review.before_img || (review as any).beforeUrl);
  const afterUrl = fixUrl(review.afterImageUrl || review.after_img || (review as any).afterUrl);

  if (!beforeUrl || !afterUrl) return null;

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

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: beforeUrl }} style={styles.image} resizeMode="cover" />
          <View style={styles.labelBadge}><Text style={styles.labelText}>BEFORE</Text></View>
        </View>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: afterUrl }} style={styles.image} resizeMode="cover" />
          <View style={[styles.labelBadge, { backgroundColor: '#4CAF50' }]}><Text style={styles.labelText}>AFTER</Text></View>
          
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
    // 👇 에러가 났던 부분 (이제 위에서 import 했으니 정상 작동합니다)
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 }
    })
  },
  imageContainer: { flexDirection: 'row', height: 180 },
  imageWrapper: { flex: 1, position: 'relative', backgroundColor: '#f0f0f0' },
  image: { width: '100%', height: '100%' },
  labelBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  labelText: { color: 'white', fontSize: 11, fontWeight: '700' },
  similarityBadge: { position: 'absolute', top: 8, right: 8, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  similarityText: { fontSize: 11, fontWeight: '700', color: '#FF6B9D' },
  infoContainer: { padding: 14 },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  textContainer: { flex: 1, marginRight: 8 },
  hospitalName: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 4 },
  procedures: { fontSize: 14, color: '#666', marginBottom: 8 },
  heartButton: { padding: 4 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 13, color: '#999' },
});