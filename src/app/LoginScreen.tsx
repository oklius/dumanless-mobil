import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş yap</Text>
      <Text style={styles.subtitle}>Bu alan yakında. Şimdilik sadece arayüz.</Text>
      <View style={styles.form}>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>E-posta</Text>
          <TextInput
            style={styles.input}
            placeholder="ornek@mail.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>Şifre</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            secureTextEntry
          />
        </View>
        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.primaryButtonText}>Devam</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xxxl,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.subtitle,
    color: colors.muted,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
    backgroundColor: colors.panel,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    shadowColor: 'rgba(15, 17, 12, 0.08)',
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  inputBlock: {
    gap: spacing.sm,
  },
  inputLabel: {
    fontSize: typography.label,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.option,
    color: colors.text,
    backgroundColor: colors.panel,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
