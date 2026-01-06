import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import Button from '../components/Button';
import { quizQuestions } from '../lib/quiz';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizResult'>;

export default function QuizResultScreen({ navigation, route }: Props) {
  const { answers } = route.params;
  const answeredCount = quizQuestions.filter((question) => (answers[question.id] ?? []).length > 0).length;
  const totalSelections = Object.values(answers).reduce((sum, selected) => sum + selected.length, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Summary</Text>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>Questions answered: {answeredCount}</Text>
        <Text style={styles.summaryText}>Total selections: {totalSelections}</Text>
      </View>
      <Button title="Continue" onPress={() => navigation.navigate('Paywall')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    backgroundColor: '#f9fafb',
  },
  summaryText: {
    fontSize: 16,
    color: '#111827',
  },
});
