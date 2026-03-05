import React from 'react';
import { View, StyleSheet } from 'react-native';

interface BrandLogoProps {
  size?: number;
  color?: string;
}

// Weighing scale (tarazu) logo matching the BharatBazaar brand
export const BrandLogo = ({ size = 80, color = '#FFFFFF' }: BrandLogoProps) => {
  const scale = size / 80;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Center pole */}
      <View
        style={[
          styles.pole,
          {
            width: 3 * scale,
            height: 44 * scale,
            backgroundColor: color,
            top: 8 * scale,
          },
        ]}
      />
      {/* Triangle top */}
      <View
        style={[
          styles.triangleContainer,
          { top: 4 * scale },
        ]}
      >
        <View
          style={[
            styles.triangle,
            {
              borderLeftWidth: 8 * scale,
              borderRightWidth: 8 * scale,
              borderBottomWidth: 10 * scale,
              borderBottomColor: color,
            },
          ]}
        />
      </View>
      {/* Horizontal beam */}
      <View
        style={[
          styles.beam,
          {
            width: 50 * scale,
            height: 3 * scale,
            backgroundColor: color,
            top: 16 * scale,
            opacity: 0.9,
          },
        ]}
      />
      {/* Left arm */}
      <View
        style={[
          styles.arm,
          {
            width: 2 * scale,
            height: 16 * scale,
            backgroundColor: color,
            top: 16 * scale,
            left: 15 * scale,
            transform: [{ rotate: '-10deg' }],
            opacity: 0.8,
          },
        ]}
      />
      {/* Right arm */}
      <View
        style={[
          styles.arm,
          {
            width: 2 * scale,
            height: 16 * scale,
            backgroundColor: color,
            top: 16 * scale,
            right: 15 * scale,
            transform: [{ rotate: '10deg' }],
            opacity: 0.8,
          },
        ]}
      />
      {/* Left pan */}
      <View
        style={[
          styles.pan,
          {
            width: 22 * scale,
            height: 5 * scale,
            borderRadius: 8 * scale,
            backgroundColor: color,
            top: 32 * scale,
            left: 6 * scale,
            opacity: 0.7,
          },
        ]}
      />
      {/* Right pan */}
      <View
        style={[
          styles.pan,
          {
            width: 22 * scale,
            height: 5 * scale,
            borderRadius: 8 * scale,
            backgroundColor: color,
            top: 32 * scale,
            right: 6 * scale,
            opacity: 0.7,
          },
        ]}
      />
      {/* Base */}
      <View
        style={[
          styles.base,
          {
            width: 20 * scale,
            height: 4 * scale,
            borderRadius: 2 * scale,
            backgroundColor: color,
            bottom: 18 * scale,
            opacity: 0.5,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pole: {
    position: 'absolute',
    alignSelf: 'center',
  },
  triangleContainer: {
    position: 'absolute',
    alignSelf: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  beam: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 2,
  },
  arm: {
    position: 'absolute',
  },
  pan: {
    position: 'absolute',
  },
  base: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
