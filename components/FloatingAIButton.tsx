import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FloatingAIButton() {
  const router = useRouter();
  const pan = useRef(new Animated.ValueXY({ x: SCREEN_WIDTH - 80, y: SCREEN_HEIGHT - 250 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();

        const finalX = gesture.moveX < SCREEN_WIDTH / 2 ? 20 : SCREEN_WIDTH - 80;
        
        Animated.spring(pan, {
          toValue: { x: finalX, y: pan.y._value },
          useNativeDriver: false,
          tension: 40,
          friction: 7,
        }).start();
      },
    })
  ).current;

  const handlePress = () => {
    router.push('/consultant/ai');
  };

  return (
    <Animated.View
      style={[
        styles.floatingButton,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.9}>
        <Text style={styles.icon}>🤖</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    zIndex: 9999,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    fontSize: 28,
  },
});