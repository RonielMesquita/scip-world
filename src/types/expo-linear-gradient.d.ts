// Augment expo-linear-gradient to accept borderRadius as a style convenience prop.
// LinearGradientProps extends ViewProps which supports all ViewStyle properties via style,
// but we pass borderRadius directly for brevity — add it here to satisfy TypeScript.
import 'expo-linear-gradient';

declare module 'expo-linear-gradient' {
  interface LinearGradientProps {
    borderRadius?: number;
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;
  }
}
