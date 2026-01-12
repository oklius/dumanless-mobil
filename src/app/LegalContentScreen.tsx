import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

import Screen from '../components/Screen';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type LegalContentKey = 'privacy' | 'terms' | 'refund';

type RouteParams = {
  LegalContent: { title: string; contentKey: LegalContentKey };
};

const CONTENT_MAP: Record<LegalContentKey, number> = {
  privacy: require('../content/legal/privacy-policy.tr.md'),
  terms: require('../content/legal/terms.tr.md'),
  refund: require('../content/legal/refund-policy.tr.md'),
};

export default function LegalContentScreen() {
  const route = useRoute<RouteProp<RouteParams, 'LegalContent'>>();
  const { contentKey } = route.params;
  const [markdown, setMarkdown] = useState('');
  const [loadError, setLoadError] = useState(false);

  const assetModule = useMemo(() => CONTENT_MAP[contentKey] ?? CONTENT_MAP.privacy, [contentKey]);

  useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      try {
        const asset = Asset.fromModule(assetModule);
        await asset.downloadAsync();
        const uri = asset.localUri ?? asset.uri;
        const content = await FileSystem.readAsStringAsync(uri);
        if (isMounted) setMarkdown(content);
      } catch (error) {
        if (isMounted) setLoadError(true);
      }
    };

    loadContent();
    return () => {
      isMounted = false;
    };
  }, [assetModule]);

  const handleLinkPress = (url: string) => {
    if (!url || typeof url !== 'string' || !/^(https?:|mailto:)/.test(url)) {
      return false;
    }
    Linking.openURL(url).catch(() => {
      Alert.alert('Bağlantı açılamadı. Lütfen tekrar dene.');
    });
    return false;
  };

  return (
    <Screen contentStyle={styles.content}>
      {loadError ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateText}>İçerik yüklenemedi.</Text>
        </View>
      ) : markdown ? (
        <Markdown style={markdownStyles} onLinkPress={handleLinkPress}>
          {markdown}
        </Markdown>
      ) : (
        <View style={styles.stateBox}>
          <Text style={styles.stateText}>Yükleniyor...</Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  stateBox: {
    paddingVertical: spacing.lg,
  },
  stateText: {
    color: colors.muted,
    fontSize: typography.body,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 24,
  },
  heading1: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  heading2: {
    fontSize: typography.optionLarge,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  heading3: {
    fontSize: typography.option,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  paragraph: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  bullet_list: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  list_item: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  bullet_list_icon: {
    marginRight: spacing.sm,
    color: colors.text,
  },
  link: {
    color: colors.accent,
    fontWeight: '700',
  },
});
