import { Task, DiaryEntry, Transaction, Budget, UserProfile, Habit, Wish, Inspiration } from '../types';

const STORAGE_KEYS = {
  TASKS: 'lifelog_tasks_v1',
  DIARY: 'lifelog_diary_v1',
  TRANSACTIONS: 'lifelog_transactions_v1',
  BUDGET: 'lifelog_budget_v1',
  PROFILE: 'lifelog_profile_v1',
  HABITS: 'lifelog_habits_v1',
  WISHES: 'lifelog_wishes_v1',
  INSPIRATIONS: 'lifelog_inspirations_v1',
};

const INITIAL_PROFILE: UserProfile = {
  name: '林静安 (Lin)',
  title: '温润生活家 · 时光记录者',
  motto: '有度的生活，从容的内心。不急不躁，记录平凡日常里的微光。',
  joinDate: '2024-03-15',
  sleepGoal: '23:00',
  readingGoalMinutes: 30,
  defaultPaymentMethod: '微信',
  primaryMoodPreference: 'calm',
};

// Helper for relative date string YYYY-MM-DD
function getFormattedDate(offsetDays: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

function getFormattedDateTime(offsetDays: number = 0, hours: number = 10, minutes: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hours, minutes, 0, 0);
  const dateStr = d.toISOString().split('T')[0];
  const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  return `${dateStr} ${timeStr}`;
}

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: '完成周度生活总结与理财规划',
    description: '整理本周的账单与日记随想，核对月度预算使用率。',
    category: '生活',
    priority: 'high',
    dueDate: getFormattedDate(0),
    status: 'pending',
    createdAt: getFormattedDate(-1),
    tags: ['周复盘', '理财'],
    subtasks: [
      { id: 'sub-1', title: '导出本周账单', completed: true },
      { id: 'sub-2', title: '制定下周餐饮预算', completed: false },
      { id: 'sub-3', title: '撰写周日记小结', completed: false },
    ],
  },
  {
    id: 'task-2',
    title: '预约周末公园有氧跑步',
    description: '保持健康生活习惯，跑步5公里并记录运动心情。',
    category: '健康',
    priority: 'medium',
    dueDate: getFormattedDate(2),
    status: 'pending',
    createdAt: getFormattedDate(0),
    tags: ['运动', '户外'],
    subtasks: [
      { id: 'sub-4', title: '准备运动服装与水壶', completed: false },
      { id: 'sub-5', title: '设定跑步路线', completed: false },
    ],
  },
  {
    id: 'task-3',
    title: '阅读《深度工作》第3章并记录心得',
    description: '每天阅读30分钟，在日记模块写下核心摘录。',
    category: '学习',
    priority: 'medium',
    dueDate: getFormattedDate(1),
    status: 'completed',
    createdAt: getFormattedDate(-2),
    completedAt: getFormattedDate(0),
    tags: ['阅读', '自我提升'],
    subtasks: [
      { id: 'sub-6', title: '完成第3章阅读', completed: true },
      { id: 'sub-7', title: '记录笔记至日记', completed: true },
    ],
  },
  {
    id: 'task-4',
    title: '整理房间书桌与归类单据',
    description: '保持干净整洁的书房环境。',
    category: '生活',
    priority: 'low',
    dueDate: getFormattedDate(3),
    status: 'pending',
    createdAt: getFormattedDate(0),
    tags: ['家务'],
    subtasks: [],
  },
];

const INITIAL_DIARY: DiaryEntry[] = [
  {
    id: 'diary-1',
    title: '阳光明媚的午后，微风与咖啡香',
    content: `今天天气非常晴朗，阳光透过窗户洒在桌面上。下午去社区角落新开的手冲咖啡馆坐了两个小时，点了一杯埃塞俄比亚浅焙咖啡，口感带着淡淡的柑橘香。

在这段时间里静下心来读完了书中的章节，顺便把最近琐碎的想法整理了一下。生活不需要时刻处于高压紧绷状态，适当给大脑留白，才能发现隐藏在身边的美好小细节。`,
    date: getFormattedDateTime(0, 14, 30),
    mood: 'happy',
    weather: 'sunny',
    tags: ['咖啡时光', '阅读', '惬意'],
    photoUrls: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    ],
    aiReflection: '字里行间洋溢着沉静与美好。懂得在忙碌中寻得一丝留白，是生活质感的重要体现。继续保持这份对微小的感悟力吧！',
    location: '阳光角手冲咖啡',
  },
  {
    id: 'diary-2',
    title: '雨天的沉思与清爽的夜雨声',
    content: `傍晚下了一场小雨，空气变得非常清新，泥土的芳香夹杂着清凉的风。

晚饭后窝在沙发上看了一部纪录片，雨滴敲打窗檐的声音让人格外安心。完成了本周的记账和计划整理，心里很踏实。`,
    date: getFormattedDateTime(-2, 21, 15),
    mood: 'calm',
    weather: 'rainy',
    tags: ['雨夜', '纪录片', '思考'],
    photoUrls: [
      'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    ],
    aiReflection: '雨声是天然的白噪音，帮助你理清心绪。踏实与规律的节奏会带给生活长久的掌控感。',
    location: '温馨家里',
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'expense',
    amount: 38,
    category: '餐饮',
    description: '手冲咖啡与黑森林蛋糕',
    date: getFormattedDate(0),
    paymentMethod: '微信',
    tags: ['咖啡馆', '下午茶'],
  },
  {
    id: 'tx-2',
    type: 'expense',
    amount: 168,
    category: '餐饮',
    description: '与朋友聚餐日式烧肉',
    date: getFormattedDate(0),
    paymentMethod: '支付宝',
    tags: ['聚餐', '周末'],
  },
  {
    id: 'tx-3',
    type: 'expense',
    amount: 45,
    category: '交通',
    description: '网约车出行',
    date: getFormattedDate(-1),
    paymentMethod: '微信',
    tags: ['打车'],
  },
  {
    id: 'tx-4',
    type: 'expense',
    amount: 129,
    category: '生活',
    description: '超市购买一周水果与牛奶',
    date: getFormattedDate(-2),
    paymentMethod: '银行卡',
    tags: ['超市', '食材'],
  },
  {
    id: 'tx-5',
    type: 'income',
    amount: 8500,
    category: '工资',
    description: '月度基本薪酬发放',
    date: getFormattedDate(-5),
    paymentMethod: '银行卡',
    tags: ['月薪'],
  },
  {
    id: 'tx-6',
    type: 'income',
    amount: 600,
    category: '兼职',
    description: '稿件设计稿稿酬',
    date: getFormattedDate(-3),
    paymentMethod: '支付宝',
    tags: ['副业'],
  },
];

const INITIAL_BUDGET: Budget = {
  monthlyLimit: 3500,
  categoryLimits: {
    餐饮: 1500,
    交通: 400,
    购物: 800,
    娱乐: 500,
    居住: 300,
  },
};

const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: '晨起温水 500ml',
    icon: '💧',
    category: '健康',
    targetDaysPerWeek: 7,
    completedDates: [getFormattedDate(0), getFormattedDate(-1), getFormattedDate(-2)],
    createdAt: getFormattedDate(-10),
  },
  {
    id: 'habit-2',
    title: '每日精读 20 分钟',
    icon: '📚',
    category: '学习',
    targetDaysPerWeek: 5,
    completedDates: [getFormattedDate(0), getFormattedDate(-1)],
    createdAt: getFormattedDate(-10),
  },
  {
    id: 'habit-3',
    title: '23:00 前关灯静心',
    icon: '🌙',
    category: '作息',
    targetDaysPerWeek: 7,
    completedDates: [getFormattedDate(-1)],
    createdAt: getFormattedDate(-7),
  },
  {
    id: 'habit-4',
    title: '户外慢跑 3 公里',
    icon: '🏃‍♂️',
    category: '运动',
    targetDaysPerWeek: 3,
    completedDates: [getFormattedDate(-2)],
    createdAt: getFormattedDate(-14),
  },
];

const INITIAL_WISHES: Wish[] = [
  {
    id: 'wish-1',
    title: '漫步大理洱海，骑行环湖一整天',
    category: '旅行',
    status: 'planning',
    targetDate: '2026-10-01',
    note: '希望在大理清晨和黄昏拍下蓝调天空，入住一家带海景小露台的民宿。',
    createdAt: getFormattedDate(-30),
  },
  {
    id: 'wish-2',
    title: '学会弹唱一首乌克丽丽曲目《City of Stars》',
    category: '体验',
    status: 'planning',
    note: '每周练习2小时，在惬意的周末露营时弹给朋友们听。',
    createdAt: getFormattedDate(-20),
  },
  {
    id: 'wish-3',
    title: '布置专属静心书桌角落',
    category: '心愿',
    status: 'achieved',
    achievedDate: getFormattedDate(-5),
    note: '购买了温润实木书桌与柔光护眼台灯，配上绿植后非常有氛围感。',
    createdAt: getFormattedDate(-45),
  },
  {
    id: 'wish-4',
    title: '整理出版个人微随笔集《温润的时光》',
    category: '学习',
    status: 'planning',
    note: '整理这几年的生活日记与思考，制作成精美的小量印制书籍。',
    createdAt: getFormattedDate(-60),
  },
];

const INITIAL_INSPIRATIONS: Inspiration[] = [
  {
    id: 'insp-1',
    content: '有度的生活，从容的内心。不急不躁，记录平凡日常里的微光。',
    source: '《生活座右铭》',
    tags: ['处世', '心境'],
    createdAt: getFormattedDate(-15),
  },
  {
    id: 'insp-2',
    content: '把时间分给睡眠，分给书籍，分给运动，分给花草树木和对世界的喜爱。',
    source: '生活摘录',
    tags: ['治愈', '留白'],
    createdAt: getFormattedDate(-10),
  },
  {
    id: 'insp-3',
    content: '生活不是等待暴风雨过去，而是学会在雨中翩翩起舞。',
    source: '名言口袋',
    tags: ['励志', '心态'],
    createdAt: getFormattedDate(-5),
  },
];

export const StorageService = {
  getTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_TASKS;
    }
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getDiary(): DiaryEntry[] {
    const data = localStorage.getItem(STORAGE_KEYS.DIARY);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(INITIAL_DIARY));
      return INITIAL_DIARY;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_DIARY;
    }
  },

  saveDiary(entries: DiaryEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(entries));
  },

  getTransactions(): Transaction[] {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  },

  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getBudget(): Budget {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(INITIAL_BUDGET));
      return INITIAL_BUDGET;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_BUDGET;
    }
  },

  saveBudget(budget: Budget): void {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  },

  getUserProfile(): UserProfile {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
      return INITIAL_PROFILE;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_PROFILE;
    }
  },

  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getHabits(): Habit[] {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(INITIAL_HABITS));
      return INITIAL_HABITS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_HABITS;
    }
  },

  saveHabits(habits: Habit[]): void {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  },

  getWishes(): Wish[] {
    const data = localStorage.getItem(STORAGE_KEYS.WISHES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(INITIAL_WISHES));
      return INITIAL_WISHES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_WISHES;
    }
  },

  saveWishes(wishes: Wish[]): void {
    localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(wishes));
  },

  getInspirations(): Inspiration[] {
    const data = localStorage.getItem(STORAGE_KEYS.INSPIRATIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.INSPIRATIONS, JSON.stringify(INITIAL_INSPIRATIONS));
      return INITIAL_INSPIRATIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_INSPIRATIONS;
    }
  },

  saveInspirations(inspirations: Inspiration[]): void {
    localStorage.setItem(STORAGE_KEYS.INSPIRATIONS, JSON.stringify(inspirations));
  },

  exportAllData(): string {
    const payload = {
      tasks: this.getTasks(),
      diary: this.getDiary(),
      transactions: this.getTransactions(),
      budget: this.getBudget(),
      profile: this.getUserProfile(),
      habits: this.getHabits(),
      wishes: this.getWishes(),
      inspirations: this.getInspirations(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(payload, null, 2);
  },

  importAllData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.tasks) this.saveTasks(parsed.tasks);
      if (parsed.diary) this.saveDiary(parsed.diary);
      if (parsed.transactions) this.saveTransactions(parsed.transactions);
      if (parsed.budget) this.saveBudget(parsed.budget);
      if (parsed.profile) this.saveUserProfile(parsed.profile);
      if (parsed.habits) this.saveHabits(parsed.habits);
      if (parsed.wishes) this.saveWishes(parsed.wishes);
      if (parsed.inspirations) this.saveInspirations(parsed.inspirations);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  resetToDefault(): void {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(INITIAL_DIARY));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(INITIAL_BUDGET));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(INITIAL_HABITS));
    localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(INITIAL_WISHES));
    localStorage.setItem(STORAGE_KEYS.INSPIRATIONS, JSON.stringify(INITIAL_INSPIRATIONS));
  },
};
