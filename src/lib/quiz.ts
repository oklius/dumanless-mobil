export type QuizOption = {
  id: string;
  label: string;
};

export type QuizQuestion = {
  id: string;
  title: string;
  subtitle?: string;
  type: 'single' | 'multi';
  options: QuizOption[];
};

export type QuizAnswers = Record<string, string[]>;

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    title: 'Question 1',
    subtitle: 'Subtitle 1',
    type: 'single',
    options: [
      { id: 'q1o1', label: 'Option 1' },
      { id: 'q1o2', label: 'Option 2' },
      { id: 'q1o3', label: 'Option 3' },
      { id: 'q1o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q2',
    title: 'Question 2',
    subtitle: 'Subtitle 2',
    type: 'multi',
    options: [
      { id: 'q2o1', label: 'Option 1' },
      { id: 'q2o2', label: 'Option 2' },
      { id: 'q2o3', label: 'Option 3' },
      { id: 'q2o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q3',
    title: 'Question 3',
    subtitle: 'Subtitle 3',
    type: 'single',
    options: [
      { id: 'q3o1', label: 'Option 1' },
      { id: 'q3o2', label: 'Option 2' },
      { id: 'q3o3', label: 'Option 3' },
      { id: 'q3o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q4',
    title: 'Question 4',
    subtitle: 'Subtitle 4',
    type: 'multi',
    options: [
      { id: 'q4o1', label: 'Option 1' },
      { id: 'q4o2', label: 'Option 2' },
      { id: 'q4o3', label: 'Option 3' },
      { id: 'q4o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q5',
    title: 'Question 5',
    subtitle: 'Subtitle 5',
    type: 'single',
    options: [
      { id: 'q5o1', label: 'Option 1' },
      { id: 'q5o2', label: 'Option 2' },
      { id: 'q5o3', label: 'Option 3' },
      { id: 'q5o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q6',
    title: 'Question 6',
    subtitle: 'Subtitle 6',
    type: 'multi',
    options: [
      { id: 'q6o1', label: 'Option 1' },
      { id: 'q6o2', label: 'Option 2' },
      { id: 'q6o3', label: 'Option 3' },
      { id: 'q6o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q7',
    title: 'Question 7',
    subtitle: 'Subtitle 7',
    type: 'single',
    options: [
      { id: 'q7o1', label: 'Option 1' },
      { id: 'q7o2', label: 'Option 2' },
      { id: 'q7o3', label: 'Option 3' },
      { id: 'q7o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q8',
    title: 'Question 8',
    subtitle: 'Subtitle 8',
    type: 'multi',
    options: [
      { id: 'q8o1', label: 'Option 1' },
      { id: 'q8o2', label: 'Option 2' },
      { id: 'q8o3', label: 'Option 3' },
      { id: 'q8o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q9',
    title: 'Question 9',
    subtitle: 'Subtitle 9',
    type: 'single',
    options: [
      { id: 'q9o1', label: 'Option 1' },
      { id: 'q9o2', label: 'Option 2' },
      { id: 'q9o3', label: 'Option 3' },
      { id: 'q9o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q10',
    title: 'Question 10',
    subtitle: 'Subtitle 10',
    type: 'multi',
    options: [
      { id: 'q10o1', label: 'Option 1' },
      { id: 'q10o2', label: 'Option 2' },
      { id: 'q10o3', label: 'Option 3' },
      { id: 'q10o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q11',
    title: 'Question 11',
    subtitle: 'Subtitle 11',
    type: 'single',
    options: [
      { id: 'q11o1', label: 'Option 1' },
      { id: 'q11o2', label: 'Option 2' },
      { id: 'q11o3', label: 'Option 3' },
      { id: 'q11o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q12',
    title: 'Question 12',
    subtitle: 'Subtitle 12',
    type: 'multi',
    options: [
      { id: 'q12o1', label: 'Option 1' },
      { id: 'q12o2', label: 'Option 2' },
      { id: 'q12o3', label: 'Option 3' },
      { id: 'q12o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q13',
    title: 'Question 13',
    subtitle: 'Subtitle 13',
    type: 'single',
    options: [
      { id: 'q13o1', label: 'Option 1' },
      { id: 'q13o2', label: 'Option 2' },
      { id: 'q13o3', label: 'Option 3' },
      { id: 'q13o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q14',
    title: 'Question 14',
    subtitle: 'Subtitle 14',
    type: 'multi',
    options: [
      { id: 'q14o1', label: 'Option 1' },
      { id: 'q14o2', label: 'Option 2' },
      { id: 'q14o3', label: 'Option 3' },
      { id: 'q14o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q15',
    title: 'Question 15',
    subtitle: 'Subtitle 15',
    type: 'single',
    options: [
      { id: 'q15o1', label: 'Option 1' },
      { id: 'q15o2', label: 'Option 2' },
      { id: 'q15o3', label: 'Option 3' },
      { id: 'q15o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q16',
    title: 'Question 16',
    subtitle: 'Subtitle 16',
    type: 'multi',
    options: [
      { id: 'q16o1', label: 'Option 1' },
      { id: 'q16o2', label: 'Option 2' },
      { id: 'q16o3', label: 'Option 3' },
      { id: 'q16o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q17',
    title: 'Question 17',
    subtitle: 'Subtitle 17',
    type: 'single',
    options: [
      { id: 'q17o1', label: 'Option 1' },
      { id: 'q17o2', label: 'Option 2' },
      { id: 'q17o3', label: 'Option 3' },
      { id: 'q17o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q18',
    title: 'Question 18',
    subtitle: 'Subtitle 18',
    type: 'multi',
    options: [
      { id: 'q18o1', label: 'Option 1' },
      { id: 'q18o2', label: 'Option 2' },
      { id: 'q18o3', label: 'Option 3' },
      { id: 'q18o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q19',
    title: 'Question 19',
    subtitle: 'Subtitle 19',
    type: 'single',
    options: [
      { id: 'q19o1', label: 'Option 1' },
      { id: 'q19o2', label: 'Option 2' },
      { id: 'q19o3', label: 'Option 3' },
      { id: 'q19o4', label: 'Option 4' },
    ],
  },
  {
    id: 'q20',
    title: 'Question 20',
    subtitle: 'Subtitle 20',
    type: 'multi',
    options: [
      { id: 'q20o1', label: 'Option 1' },
      { id: 'q20o2', label: 'Option 2' },
      { id: 'q20o3', label: 'Option 3' },
      { id: 'q20o4', label: 'Option 4' },
    ],
  },
];
