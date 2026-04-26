/**
 * Grad — typed wrapper around expo-linear-gradient's LinearGradient.
 * Accepts `borderRadius` (and corner variants) directly as a prop,
 * merging them into the style so TypeScript is satisfied everywhere.
 */
import React from 'react';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface GradProps extends LinearGradientProps {
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
}

export default function Grad({
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  style,
  ...rest
}: GradProps) {
  const radiusStyle: ViewStyle = {};
  if (borderRadius !== undefined) radiusStyle.borderRadius = borderRadius;
  if (borderTopLeftRadius !== undefined) radiusStyle.borderTopLeftRadius = borderTopLeftRadius;
  if (borderTopRightRadius !== undefined) radiusStyle.borderTopRightRadius = borderTopRightRadius;
  if (borderBottomLeftRadius !== undefined) radiusStyle.borderBottomLeftRadius = borderBottomLeftRadius;
  if (borderBottomRightRadius !== undefined) radiusStyle.borderBottomRightRadius = borderBottomRightRadius;

  return (
    <LinearGradient
      style={[style as StyleProp<ViewStyle>, radiusStyle]}
      {...rest}
    />
  );
}
