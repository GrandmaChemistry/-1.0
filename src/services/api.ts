import { INSIGHTS_LIST } from '../data/insights';

export interface ParsedExpenseItem {
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description: string;
  paymentMethod: string;
}

export const AiApiService = {
  async parseSmartExpenses(text: string): Promise<ParsedExpenseItem[]> {
    try {
      const res = await fetch('/api/ai/smart-parse-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('解析失败');
      const data = await res.json();
      return data.items || [];
    } catch (e) {
      console.warn('AI smart parse fallback:', e);
      // Fallback simple rule matcher if AI unavailable
      const match = text.match(/(\d+(\.\d+)?)/);
      const amount = match ? parseFloat(match[1]) : 0;
      return [
        {
          type: 'expense',
          amount: amount || 20,
          category: text.includes('吃') || text.includes('饭') || text.includes('喝') ? '餐饮' : '其他',
          description: text,
          paymentMethod: '微信',
        },
      ];
    }
  },

  async getDiaryReflection(title: string, content: string, mood: string, weather: string): Promise<string> {
    try {
      const res = await fetch('/api/ai/diary-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, mood, weather }),
      });
      if (!res.ok) throw new Error('请求失败');
      const data = await res.json();
      return data.reflection || '生活点滴，皆为序章。';
    } catch (e) {
      console.warn('AI diary reflection fallback:', e);
      return '今天也是认真生活的一天，记录下当下的感受，留给未来回味！';
    }
  },

  async generateTaskSubtasks(title: string, description?: string): Promise<string[]> {
    try {
      const res = await fetch('/api/ai/task-breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error('请求失败');
      const data = await res.json();
      return data.subtasks || [];
    } catch (e) {
      console.warn('AI task breakdown fallback:', e);
      return ['明确具体目标', '准备所需工具材料', '执行第一阶段任务', '检查验收结果'];
    }
  },

  async getDailyInsight(
    pendingTasksCount: number,
    completedTasksCount: number,
    todaySpent: number,
    mood?: string,
    refreshSeed?: number
  ): Promise<{ quote: string; suggestion: string }> {
    const seed = refreshSeed ?? Math.floor(Math.random() * 100);
    const FALLBACK_INSIGHTS = INSIGHTS_LIST;

    try {
      const res = await fetch('/api/ai/daily-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pendingTasksCount, completedTasksCount, todaySpent, mood, refreshSeed: seed }),
      });
      if (!res.ok) throw new Error('请求失败');
      const data = await res.json();
      if (data && data.quote) return data;
      return FALLBACK_INSIGHTS[seed % FALLBACK_INSIGHTS.length];
    } catch (e) {
      console.warn('AI daily insight fallback:', e);
      return FALLBACK_INSIGHTS[seed % FALLBACK_INSIGHTS.length];
    }
  },
};
