export interface User {
  id: string;
  name: string;
  mobile: string;
  operator: 'ROBI' | 'AIRTEL';
  role: 'USER' | 'ADMIN';
  isSubscribed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface Subject {
  id: string;
  nameEn: string;
  nameBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
  icon?: string;
  color?: string;
  chapters?: Chapter[];
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  nameEn: string;
  nameBn: string;
  order: number;
  sections?: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  chapterId: string;
  nameEn: string;
  nameBn: string;
  order: number;
  questionCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  sectionId: string;
  textEn: string;
  textBn: string;
  optionAEn: string;
  optionABn: string;
  optionBEn: string;
  optionBBn: string;
  optionCEn: string;
  optionCBn: string;
  optionDEn: string;
  optionDBn: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  marks: number;
  explanationEn?: string;
  explanationBn?: string;
}

export interface QuizSession {
  id: string;
  userId: string;
  sectionId: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  score: number;
  totalMarks: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizAnswer {
  id: string;
  sessionId: string;
  questionId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  marksAwarded: number;
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  correctOption?: 'A' | 'B' | 'C' | 'D'; // Sent only if subscribed and answered
  explanationEn?: string;
  explanationBn?: string;
  marksAwarded: number;
}

export interface QuizResult {
  session: QuizSession;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  percentage: number;
  isRestricted?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStatus {
  isSubscribed: boolean;
  subscription?: Subscription;
}

export interface OtpResponse {
  referenceId: string;
  message: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  subscription?: Subscription;
}

export interface DailyScore {
  id: string;
  userId: string;
  date: string;
  totalScore: number;
  quizzesTaken: number;
}

export interface AdminStats {
  totalUsers: number;
  activeSubscribers: number;
  totalQuestions: number;
  totalRevenue: number;
  smsSentToday: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
