export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string; // e.g. '工作', '学习', '生活', '健康', '兴趣'
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  tags: string[];
  subtasks: SubTask[];
}

export type MoodType = 'happy' | 'calm' | 'excited' | 'thoughtful' | 'sad' | 'tired' | 'anxious';
export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD HH:mm
  mood: MoodType;
  weather: WeatherType;
  tags: string[];
  photoUrls: string[];
  aiReflection?: string;
  location?: string;
}

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string; // e.g., '餐饮', '交通', '购物', '娱乐', '居住', '医疗', '工资', '兼职', '理财', '其他'
  description: string;
  date: string; // YYYY-MM-DD
  paymentMethod: string; // '微信', '支付宝', '银行卡', '现金', '其他'
  tags: string[];
}

export interface Budget {
  monthlyLimit: number;
  categoryLimits?: Record<string, number>;
}

export type ActiveTab = 'overview' | 'todo' | 'diary' | 'finance' | 'hub';

export interface Habit {
  id: string;
  title: string;
  icon: string; // emoji e.g. "💧", "📚", "🏃‍♂️", "🌙"
  category: string;
  targetDaysPerWeek: number;
  completedDates: string[]; // ['YYYY-MM-DD']
  createdAt: string;
}

export interface Wish {
  id: string;
  title: string;
  category: '旅行' | '学习' | '体验' | '心愿物' | '其他';
  status: 'planning' | 'achieved';
  targetDate?: string;
  achievedDate?: string;
  note?: string;
  createdAt: string;
}

export interface Inspiration {
  id: string;
  content: string;
  source?: string;
  tags: string[];
  createdAt: string;
}

export interface UserProfile {
  name: string;
  title: string;
  motto: string;
  avatarUrl?: string;
  joinDate: string;
  sleepGoal: string;
  readingGoalMinutes: number;
  defaultPaymentMethod: string;
  primaryMoodPreference: MoodType;
}
