// components/AnalysisCard.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface AnalysisData {
  // 쌍꺼풀
  foldType: string;          // inline, outline, parallel
  foldThickness: number;     // px
  foldThicknessLevel: string; // thin, normal, thick
  
  // 짝눈
  isAsymmetric: boolean;     // 짝눈 여부
  leftThickness: number;     // 왼쪽 두께
  rightThickness: number;    // 오른쪽 두께
  asymmetryPercent: number;  // 차이 퍼센트
  
  // 눈 비율
  eyeLength: number;         // 눈 가로 길이
  eyeLengthLevel: string;    // short, normal, long
  eyeHeight: number;         // 눈 세로 높이
  eyeHeightLevel: string;    // low, normal, high
  
  // 미간
  interEyeDistance: number;  // 미간 거리
  interEyeRatio: string;     // narrow, normal, wide
  
  // 눈꼬리
  eyeCornerAngle: number;    // 눈꼬리 각도
  eyeCornerLevel: string;    // down, parallel, up
  
  // 추천
  recommendations: {
    surgery: string;         // 수술 이름
    reason: string;          // 이유
    priority: number;        // 우선순위 (1-3)
  }[];
  
  confidence: number;        // 0.0 ~ 1.0
}

interface Props {
  userPhoto: string;
  analysis: AnalysisData;
  onClose: () => void;
}

export default function AnalysisCard({ userPhoto, analysis, onClose }: Props) {
  // 쌍꺼풀 타입 한글
  const getFoldTypeName = (type: string): string => {
    const names: { [key: string]: string } = {
      'inline': '인라인',
      'outline': '아웃라인',
      'parallel': '평행',
      'unknown': '알 수 없음',
    };
    return names[type] || '알 수 없음';
  };

  // 두께 레벨 한글
  const getThicknessName = (level: string): string => {
    const names: { [key: string]: string } = {
      'thin': '얇음',
      'normal': '보통',
      'thick': '두꺼움',
    };
    return names[level] || '보통';
  };

  // 미간 한글
  const getInterEyeName = (ratio: string): string => {
    const names: { [key: string]: string } = {
      'narrow': '좁음',
      'normal': '보통',
      'wide': '넓음',
    };
    return names[ratio] || '보통';
  };

  // 눈 길이 한글
  const getLengthName = (level: string): string => {
    const names: { [key: string]: string } = {
      'short': '짧음',
      'normal': '보통',
      'long': '김',
    };
    return names[level] || '보통';
  };

  // 눈 높이 한글
  const getHeightName = (level: string): string => {
    const names: { [key: string]: string } = {
      'low': '낮음',
      'normal': '보통',
      'high': '높음',
    };
    return names[level] || '보통';
  };

  // 눈꼬리 한글
  const getCornerName = (level: string): string => {
    const names: { [key: string]: string } = {
      'down': '처짐',
      'parallel': '평행',
      'up': '올라감',
    };
    return names[level] || '평행';
  };

  // 우선순위 색상
  const getPriorityColor = (priority: number): string => {
    if (priority === 1) return '#FF6B9D'; // 높음
    if (priority === 2) return '#FFA726'; // 중간
    return '#66BB6A'; // 낮음
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* 닫기 버튼 */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={24} color="#999" />
        </TouchableOpacity>

        <ScrollView 
          horizontal={false} 
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          <View style={styles.content}>
            {/* 상단: 사진 + 기본 정보 */}
            <View style={styles.topSection}>
              {/* 원본 사진 */}
              <Image source={{ uri: userPhoto }} style={styles.photo} />

              {/* 기본 정보 */}
              <View style={styles.basicInfo}>
                <Text style={styles.title}>👁️ 당신의 눈 분석</Text>
                
                {/* 신뢰도 표시 */}
                <View style={styles.confidenceBar}>
                  <Text style={styles.confidenceLabel}>분석 정확도</Text>
                  <View style={styles.barBackground}>
                    <View 
                      style={[
                        styles.barFill, 
                        { width: `${analysis.confidence * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.confidenceText}>
                    {(analysis.confidence * 100).toFixed(0)}%
                  </Text>
                </View>
              </View>
            </View>

            {/* 구분선 */}
            <View style={styles.divider} />

            {/* 상세 분석 */}
            <View style={styles.detailsSection}>
              {/* 1. 쌍꺼풀 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔹 쌍꺼풀</Text>
                
                <View style={styles.infoRow}>
                  <Icon name="visibility" size={18} color="#FF6B9D" />
                  <Text style={styles.infoLabel}>라인:</Text>
                  <Text style={styles.infoValue}>
                    {getFoldTypeName(analysis.foldType)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Icon name="straighten" size={18} color="#FF6B9D" />
                  <Text style={styles.infoLabel}>두께:</Text>
                  <Text style={styles.infoValue}>
                    {analysis.foldThickness.toFixed(1)}px (
                    {getThicknessName(analysis.foldThicknessLevel)})
                  </Text>
                </View>
              </View>

              {/* 2. 짝눈 */}
              {analysis.isAsymmetric && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>⚠️ 짝눈</Text>
                  
                  <View style={styles.asymmetryBox}>
                    <View style={styles.asymmetryRow}>
                      <Text style={styles.asymmetryLabel}>왼쪽:</Text>
                      <Text style={styles.asymmetryValue}>
                        {analysis.leftThickness.toFixed(1)}px
                      </Text>
                    </View>
                    <View style={styles.asymmetryRow}>
                      <Text style={styles.asymmetryLabel}>오른쪽:</Text>
                      <Text style={styles.asymmetryValue}>
                        {analysis.rightThickness.toFixed(1)}px
                      </Text>
                    </View>
                    <View style={styles.asymmetryRow}>
                      <Text style={styles.asymmetryLabel}>차이:</Text>
                      <Text style={[styles.asymmetryValue, styles.highlight]}>
                        {analysis.asymmetryPercent.toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.warningText}>
                    양쪽 두께 차이가 있어요. 쌍꺼풀 재수술을 고려해보세요.
                  </Text>
                </View>
              )}

              {/* 3. 눈 크기 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔹 눈 크기</Text>
                
                <View style={styles.infoRow}>
                  <Icon name="arrow-forward" size={18} color="#FF6B9D" />
                  <Text style={styles.infoLabel}>가로 길이:</Text>
                  <Text style={styles.infoValue}>
                    {analysis.eyeLength.toFixed(1)}px (
                    {getLengthName(analysis.eyeLengthLevel)})
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Icon name="height" size={18} color="#FF6B9D" />
                  <Text style={styles.infoLabel}>세로 높이:</Text>
                  <Text style={styles.infoValue}>
                    {analysis.eyeHeight.toFixed(1)}px (
                    {getHeightName(analysis.eyeHeightLevel)})
                  </Text>
                </View>
              </View>

              {/* 4. 미간 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔹 미간</Text>
                
                <View style={styles.infoRow}>
                  <Icon name="unfold-more" size={18} color="#FF6B9D" />
                  <Text style={styles.infoLabel}>너비:</Text>
                  <Text style={styles.infoValue}>
                    {analysis.interEyeDistance.toFixed(1)}px (
                    {getInterEyeName(analysis.interEyeRatio)})
                  </Text>
                </View>
              </View>

              {/* 5. 눈꼬리 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔹 눈꼬리</Text>
                
                <View style={styles.infoRow}>
                  <Icon name="show-chart" size={18} color="#FF6B9D" />
                  <Text style={styles.infoLabel}>각도:</Text>
                  <Text style={styles.infoValue}>
                    {analysis.eyeCornerAngle.toFixed(1)}° (
                    {getCornerName(analysis.eyeCornerLevel)})
                  </Text>
                </View>
              </View>
            </View>

            {/* 구분선 */}
            <View style={styles.divider} />

            {/* 추천 수술 */}
            {analysis.recommendations.length > 0 && (
              <View style={styles.recommendationsSection}>
                <Text style={styles.recTitle}>💡 추천 시술</Text>
                <Text style={styles.recSubtitle}>
                  당신의 눈에 맞는 시술을 추천해드려요
                </Text>

                {analysis.recommendations
                  .sort((a, b) => a.priority - b.priority)
                  .map((rec, index) => (
                    <View key={index} style={styles.recCard}>
                      <View style={styles.recHeader}>
                        <View style={[
                          styles.priorityBadge,
                          { backgroundColor: getPriorityColor(rec.priority) }
                        ]}>
                          <Text style={styles.priorityText}>
                            {rec.priority === 1 ? '높음' : rec.priority === 2 ? '중간' : '낮음'}
                          </Text>
                        </View>
                        <Text style={styles.recSurgery}>{rec.surgery}</Text>
                      </View>
                      <Text style={styles.recReason}>{rec.reason}</Text>
                    </View>
                  ))}
              </View>
            )}

            {/* 경고 (정확도 낮을 때) */}
            {analysis.confidence < 0.5 && (
              <View style={styles.warningBox}>
                <Icon name="warning" size={20} color="#FF9800" />
                <Text style={styles.warningBoxText}>
                  분석 정확도가 낮습니다. 눈이 잘 보이는 정면 사진을 다시 촬영해주세요.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    maxHeight: 500,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  scrollView: {
    padding: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 100,
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  content: {
    paddingRight: 30,
  },

  // 상단
  topSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  basicInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  confidenceBar: {
    gap: 6,
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#999',
  },
  barBackground: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'right',
  },

  // 구분선
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },

  // 상세 분석
  detailsSection: {
    gap: 16,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    minWidth: 80,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },

  // 짝눈
  asymmetryBox: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  asymmetryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  asymmetryLabel: {
    fontSize: 14,
    color: '#666',
  },
  asymmetryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  highlight: {
    color: '#FF6B9D',
  },
  warningText: {
    fontSize: 12,
    color: '#F57C00',
    fontStyle: 'italic',
    marginTop: 4,
  },

  // 추천
  recommendationsSection: {
    gap: 12,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  recSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: -6,
    marginBottom: 4,
  },
  recCard: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B9D',
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
  },
  recSurgery: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  recReason: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },

  // 경고
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    padding: 14,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
  },
  warningBoxText: {
    flex: 1,
    fontSize: 13,
    color: '#F57C00',
    lineHeight: 18,
  },
});