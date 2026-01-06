import { useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { colors } from '../theme/colors';

type RemoteIllustrationProps = {
  uri: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  context?: string;
};

export default function RemoteIllustration({
  uri,
  width = 128,
  height = 128,
  borderRadius = 16,
  context,
}: RemoteIllustrationProps) {
  const [hasError, setHasError] = useState(false);
  const isSvg = useMemo(() => uri.toLowerCase().endsWith('.svg'), [uri]);

  if (hasError) {
    return (
      <View
        style={[
          styles.placeholder,
          { width, height, borderRadius },
        ]}
      />
    );
  }

  if (isSvg) {
    return (
      <SvgUri
        uri={uri}
        width={width}
        height={height}
        onError={() => {
          setHasError(true);
          console.warn(`Failed to load SVG${context ? ` (${context})` : ''}: ${uri}`);
        }}
      />
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ width, height, borderRadius }}
      resizeMode="contain"
      onError={() => {
        setHasError(true);
        console.warn(`Failed to load image${context ? ` (${context})` : ''}: ${uri}`);
      }}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.progressTrack,
    borderColor: colors.border,
    borderWidth: 1,
  },
});
