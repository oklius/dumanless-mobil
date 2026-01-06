export type QuizSubmitPayload = {
  email: string;
  first_name: string;
  last_name: string;
  answers: Record<string, string | string[]>;
  tipsOptIn?: boolean;
};

export async function submitQuiz(payload: QuizSubmitPayload): Promise<string> {
  try {
    const baseUrl = process.env.EXPO_PUBLIC_WEB_BASE_URL;
    if (!baseUrl) {
      throw new Error('Missing EXPO_PUBLIC_WEB_BASE_URL');
    }

    const response = await fetch(`${baseUrl}/api/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);
    const submissionId = typeof data?.id === 'string' ? data.id : '';

    if (!response.ok || !submissionId) {
      throw new Error('Invalid quiz submission response');
    }

    return submissionId;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Quiz submission failed');
  }
}
