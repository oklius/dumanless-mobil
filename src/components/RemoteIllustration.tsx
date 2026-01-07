import { useEffect, useMemo, useState } from 'react';
import { Image, ImageResizeMode, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { colors } from '../theme/colors';
import { resolveAssetUri } from '../lib/resolveAssetUri';

type RemoteIllustrationProps = {
  uri?: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
};

// Render remote raster/SVG assets directly from the web (no bundling), falling back to a subtle placeholder on errors.
export default function RemoteIllustration({
  uri: rawUri,
  width = 160,
  height = 160,
  borderRadius = 16,
  style,
  resizeMode = 'contain',
}: RemoteIllustrationProps) {
  const [hasError, setHasError] = useState(false);
  const [isSvg, setIsSvg] = useState(false);
  const resolvedUri = useMemo(() => resolveAssetUri(rawUri ?? ''), [rawUri]);

  useEffect(() => {
    setHasError(false);
    if (!resolvedUri) return;
    if (resolvedUri.toLowerCase().includes('.svg')) {
      setIsSvg(true);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    fetch(resolvedUri, { method: 'HEAD', signal: controller.signal })
      .then((res) => {
        if (cancelled) return;
        const contentType = res.headers.get('content-type') ?? '';
        if (contentType.includes('svg')) {
          setIsSvg(true);
        } else {
          setIsSvg(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsSvg(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [resolvedUri]);

  if (!resolvedUri || hasError) {
    return <View style={[styles.placeholder, { width, height, borderRadius }, style]} />;
  }

  if (isSvg) {
    return (
      <View
        style={[styles.svgWrapper, { width, height, borderRadius }, style]}
        accessible
        accessibilityRole="image"
      >
        <SvgUri
          uri={resolvedUri}
          width="100%"
          height="100%"
          onError={() => {
            setHasError(true);
            console.warn(`Failed to load SVG: ${resolvedUri}`);
          }}
        />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: resolvedUri }}
      style={[{ width, height, borderRadius }, style]}
      resizeMode={resizeMode}
      onError={() => {
        setHasError(true);
        console.warn(`Failed to load image: ${resolvedUri}`);
      }}
    />
  );
}

const styles = StyleSheet.create({
  svgWrapper: {
    overflow: 'hidden',
  },
  placeholder: {
    backgroundColor: colors.progressTrack,
    borderColor: colors.border,
    borderWidth: 1,
  },
});
