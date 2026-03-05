import React, { useEffect, useRef } from 'react';
import { View, Animated, ViewStyle } from 'react-native';

interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  duration?: number;
  style?: ViewStyle;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  staggerDelay = 100,
  duration = 400,
  style,
}) => {
  const animations = useRef(
    children.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const staggerAnimations = animations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration,
        delay: index * staggerDelay,
        useNativeDriver: true,
      })
    );

    Animated.parallel(staggerAnimations).start();
  }, []);

  return (
    <View style={style}>
      {React.Children.map(children, (child, index) => {
        const opacity = animations[index] || new Animated.Value(1);
        const translateY = opacity.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        });

        return (
          <Animated.View
            style={{
              opacity,
              transform: [{ translateY }],
            }}
          >
            {child}
          </Animated.View>
        );
      })}
    </View>
  );
};
