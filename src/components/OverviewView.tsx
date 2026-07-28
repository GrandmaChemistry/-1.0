import React, { useState, useEffect } from 'react';
import { Task, DiaryEntry, Transaction, Budget, ActiveTab } from '../types';
import { AiApiService } from '../services/api';
import { INSIGHTS_LIST } from '../data/insights';
import { APP_IMAGES } from '../data/assets';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Wallet,
  BookOpen,
  ArrowUpRight,
  Smile,
  Plus,
  RefreshCw,
  Sun,
  Flame,
  CalendarDays,
} from 'lucide-react';

interface OverviewViewProps {
  tasks: Task[];
  diary: DiaryEntry[];
  transactions: Transaction[];
  budget: Budget;
  onToggleTask: (taskId: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickRecord: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  tasks,
  diary,
  transactions,
  budget,
  onToggleTask,
  setActiveTab,
  onOpenQuickRecord,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // AI Daily Insight
  const [insight, setInsight] = useState<{ quote: string; suggestion: string }>({
    quote: '每一个认真生活的日子，都值得被温柔记录。',
    suggestion: '保持工作与休息的平衡，今天也要对生活微笑。',
  });
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  // Today's stats calculation
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const todayCompletedTasksCount = tasks.filter(
    (t) => t.completedAt && t.completedAt.startsWith(todayStr)
  ).length;

  const todayTransactions = transactions.filter((tx) => tx.date === todayStr);
  const todaySpent = todayTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const todayIncome = todayTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const todayDiaries = diary.filter((d) => d.date.startsWith(todayStr));
  const latestMood = todayDiaries.length > 0 ? todayDiaries[0].mood : diary[0]?.mood || 'happy';

  // Monthly spent
  const currentMonthPrefix = todayStr.substring(0, 7);
  const monthSpent = transactions
    .filter((tx) => tx.date.startsWith(currentMonthPrefix) && tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const budgetUsagePercent = Math.min(
    100,
    Math.round((monthSpent / (budget.monthlyLimit || 3500)) * 100)
  );

  const fetchAiInsight = async () => {
    setIsLoadingInsight(true);
    const nextSeed = refreshCount + 1;
    setRefreshCount(nextSeed);

    const fallbacks = INSIGHTS_LIST;

    try {
      const res = await AiApiService.getDailyInsight(
        pendingTasks.length,
        todayCompletedTasksCount,
        todaySpent,
        latestMood,
        nextSeed
      );
      // Ensure quote updates even if duplicate returned
      if (!res || res.quote === insight.quote) {
        setInsight(fallbacks[nextSeed % fallbacks.length]);
      } else {
        setInsight(res);
      }
    } catch (e) {
      console.error(e);
      setInsight(fallbacks[nextSeed % fallbacks.length]);
    } finally {
      setIsLoadingInsight(false);
    }
  };

  useEffect(() => {
    fetchAiInsight();
  }, []);

  // Format Date in Chinese
  const dateObj = new Date();
  const dateFormatted = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const dayOfWeek = weekDays[dateObj.getDay()];

  const getMoodBadge = (mood: string) => {
    switch (mood) {
      case 'happy':
        return { label: '😊 愉悦', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' };
      case 'calm':
        return { label: '😌 平静', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' };
      case 'excited':
        return { label: '🤩 兴奋', color: 'bg-purple-500/10 text-purple-300 border-purple-500/20' };
      case 'thoughtful':
        return { label: '💭 沉思', color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' };
      case 'sad':
        return { label: '😢 低落', color: 'bg-slate-500/10 text-slate-300 border-slate-500/20' };
      default:
        return { label: '✨ 充实', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Editorial Hero Header Banner */}
      <div className="relative overflow-hidden bg-[#F2F0EB] border border-[#1C1C1C]/10 p-6 sm:p-10 shadow-xs">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C8476]">
              {/* Mobile View (stacked in 2 lines) */}
              <div className="sm:hidden flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5 text-[#1C1C1C]" />
                  <span>{dateFormatted}</span>
                </div>
                <div className="flex items-center gap-2 text-[#1C1C1C] text-[11px] font-bold">
                  <span>{dayOfWeek}</span>
                  <span className="text-[#8C8476]">•</span>
                  <Sun className="w-3.5 h-3.5 text-[#1C1C1C]" />
                  <span className="text-[#8C8476]">晴朗 26°C</span>
                </div>
              </div>

              {/* Tablet & Desktop View (all in 1 single line) */}
              <div className="hidden sm:flex items-center gap-2.5 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-[#1C1C1C]" />
                  <span className="text-[#8C8476]">{dateFormatted}</span>
                </div>
                <span className="text-[#8C8476]">•</span>
                <span className="text-[#1C1C1C] font-bold">{dayOfWeek}</span>
                <span className="text-[#8C8476]">•</span>
                <div className="flex items-center gap-1 text-[#8C8476]">
                  <Sun className="w-3.5 h-3.5 text-[#1C1C1C]" />
                  <span>晴朗 26°C</span>
                </div>
              </div>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif-title italic text-[#1C1C1C] leading-tight tracking-tight">
              Quiet Reflections <br />
              <span className="text-2xl sm:text-3xl not-italic font-sans font-bold text-[#1C1C1C]/90">
                开启美好的一天
              </span>
            </h2>
            <p className="text-[#4A4540] text-xs sm:text-sm max-w-xl font-light leading-relaxed">
              生活随记为您持续打理今天的事项、情绪图谱与日常收支账本，让每一刻都有迹可循。
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenQuickRecord}
                className="px-6 py-3 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-colors inline-flex items-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>快速记录</span>
              </button>
            </div>
          </div>

          {/* Cozy Illustration Card */}
          <div className="lg:col-span-5 relative group overflow-hidden border border-[#1C1C1C]/15 bg-[#FAF9F6] p-2 shadow-sm">
            <img
              src={APP_IMAGES.heroBanner}
              alt="Cozy Morning Desk Illustration"
              referrerPolicy="no-referrer"
              className="w-full h-44 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-3 left-3 right-3 bg-[#FAF9F6]/90 backdrop-blur-xs px-3 py-1.5 border border-[#1C1C1C]/10 text-[10px] text-[#4A4540] font-serif-title italic flex items-center justify-between">
              <span>☕ 晨光与清茶 · 享受当下</span>
              <span className="not-italic text-[#8C8476]">Life Ledger</span>
            </div>
          </div>
        </div>

        {/* AI Daily Quote Box */}
        <div className="mt-8 pt-6 border-t border-[#1C1C1C]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FAF9F6] p-5 border border-[#1C1C1C]/10">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#3B6E58] text-[#FAF9F6] shrink-0 mt-0.5 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <p className="text-base font-serif-title italic text-[#1C1C1C]">“{insight.quote}”</p>
              <p className="text-xs text-[#8C8476] mt-1 font-light">💡 伴侣建议：{insight.suggestion}</p>
            </div>
          </div>
          <button
            onClick={fetchAiInsight}
            disabled={isLoadingInsight}
            title="重新生成AI感悟"
            className="self-end sm:self-center px-3 py-1.5 text-[#1C1C1C] hover:bg-[#F2F0EB] border border-[#1C1C1C]/20 transition-colors text-[10px] uppercase tracking-wider flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${isLoadingInsight ? 'animate-spin' : ''}`} />
            <span>换一句</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Priority Tasks */}
        <div className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#1C1C1C]/10 pb-3">
            <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#1C1C1C] flex items-center gap-2">
              <span className="w-3 h-[1px] bg-[#1C1C1C]"></span>
              Priority Tasks
            </h3>
            <button
              onClick={() => setActiveTab('todo')}
              className="text-xs text-[#8C8476] hover:text-[#1C1C1C] flex items-center gap-1 transition-colors"
            >
              <span>全部</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-serif-title italic font-bold text-[#1C1C1C]">{pendingTasks.length}</span>
              <span className="text-xs text-[#8C8476] ml-2">项待处理</span>
            </div>
            <span className="text-xs text-[#4A4540] font-medium">
              今日完成 {todayCompletedTasksCount} 项
            </span>
          </div>

          <div className="w-full bg-[#F2F0EB] h-1.5 overflow-hidden">
            <div
              className="bg-[#1C1C1C] h-full transition-all duration-500"
              style={{
                width: `${
                  tasks.length > 0
                    ? Math.round(
                        (tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100
                      )
                    : 0
                }%`,
              }}
            />
          </div>

          <p className="text-xs text-[#8C8476] line-clamp-1 italic font-serif-title">
            Focus: {pendingTasks[0]?.title || '暂无待办，保持专注'}
          </p>
        </div>

        {/* Card 2: Daily Ledger */}
        <div className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#1C1C1C]/10 pb-3">
            <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#1C1C1C] flex items-center gap-2">
              <span className="w-3 h-[1px] bg-[#1C1C1C]"></span>
              Daily Ledger
            </h3>
            <button
              onClick={() => setActiveTab('finance')}
              className="text-xs text-[#8C8476] hover:text-[#1C1C1C] flex items-center gap-1 transition-colors"
            >
              <span>理财</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-[#8C8476] mr-1 uppercase">Today</span>
              <span className="text-3xl font-serif-title italic font-bold text-[#1C1C1C]">¥{todaySpent.toFixed(2)}</span>
            </div>
            {todayIncome > 0 && (
              <span className="text-xs text-[#1C1C1C] font-semibold">
                +收入 ¥{todayIncome.toFixed(2)}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-[#8C8476]">
              <span>月度预算 ({budgetUsagePercent}%)</span>
              <span className="font-mono">¥{monthSpent.toFixed(0)} / ¥{budget.monthlyLimit}</span>
            </div>
            <div className="w-full bg-[#F2F0EB] h-1.5 overflow-hidden">
              <div
                className="h-full bg-[#1C1C1C] transition-all duration-500"
                style={{ width: `${budgetUsagePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Journal & Mood */}
        <div className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#1C1C1C]/10 pb-3">
            <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#1C1C1C] flex items-center gap-2">
              <span className="w-3 h-[1px] bg-[#1C1C1C]"></span>
              Quiet Reflections
            </h3>
            <button
              onClick={() => setActiveTab('diary')}
              className="text-xs text-[#8C8476] hover:text-[#1C1C1C] flex items-center gap-1 transition-colors"
            >
              <span>撰写</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-serif-title italic font-bold text-[#1C1C1C]">{diary.length}</span>
              <span className="text-xs text-[#8C8476] ml-2">篇日记</span>
            </div>
            <span className="px-3 py-1 bg-[#F2F0EB] border border-[#1C1C1C]/10 text-xs font-medium text-[#1C1C1C]">
              {getMoodBadge(latestMood).label}
            </span>
          </div>

          <p className="text-xs text-[#4A4540] line-clamp-2 leading-relaxed font-light">
            最近手记：{diary[0]?.title ? `《${diary[0].title}》 — ${diary[0].content}` : '今天还没有写日记，记录当下的心境。'}
          </p>
        </div>
      </div>

      {/* Main Grid: Pending Tasks vs Journal Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Pending Tasks Editorial List */}
        <div className="lg:col-span-7 bg-[#FDFCFB] border border-[#1C1C1C]/10 p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1C1C1C]/10 pb-4">
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-[#1C1C1C] flex items-center gap-3">
              <span className="w-4 h-[1px] bg-[#1C1C1C]"></span>
              Priority Action Items
            </h3>
            <button
              onClick={() => setActiveTab('todo')}
              className="text-xs text-[#8C8476] hover:text-[#1C1C1C] underline font-medium"
            >
              待办清单 →
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="py-12 text-center text-[#8C8476] text-xs font-light">
              所有待办任务均已圆满完成，享受惬意的余暇。
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between pb-4 border-b border-[#1C1C1C]/5 last:border-0 group"
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 w-4 h-4 border border-[#1C1C1C] flex items-center justify-center shrink-0 hover:bg-[#1C1C1C] transition-colors"
                    >
                      {task.status === 'completed' && <div className="w-2 h-2 bg-[#1C1C1C]" />}
                    </button>
                    <div>
                      <p className="text-sm font-medium text-[#1C1C1C] group-hover:underline">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-[#8C8476] mt-1 line-clamp-1 font-light">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C8476] bg-[#F2F0EB] px-2 py-0.5 border border-[#1C1C1C]/10">
                      {task.category || 'Personal'}
                    </span>
                    {task.dueDate && (
                      <span className="text-[#8C8476] text-[11px] font-mono">{task.dueDate}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 5 cols: Journal & Ledger Feed */}
        <div className="lg:col-span-5 space-y-6">
          {/* Latest Journal Entry */}
          <div className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C1C1C]/10 pb-3">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-[#1C1C1C] flex items-center gap-2">
                <span className="w-3 h-[1px] bg-[#1C1C1C]"></span>
                Journal Feature
              </h3>
              <button
                onClick={() => setActiveTab('diary')}
                className="text-xs text-[#8C8476] hover:text-[#1C1C1C]"
              >
                日记馆 →
              </button>
            </div>

            {diary.length > 0 ? (
              <article className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-[#8C8476] font-semibold">
                  {diary[0].date}
                </p>
                <h4 className="text-lg font-serif-title italic font-bold text-[#1C1C1C]">{diary[0].title}</h4>
                <p className="text-xs text-[#4A4540] line-clamp-4 leading-relaxed font-light">
                  {diary[0].content}
                </p>
                {diary[0].aiReflection && (
                  <div className="pt-3 border-t border-[#1C1C1C]/10">
                    <p className="text-[10px] uppercase tracking-wider text-[#8C8476] font-bold mb-1">AI Reflection</p>
                    <p className="text-xs text-[#1C1C1C] italic font-serif-title">“{diary[0].aiReflection}”</p>
                  </div>
                )}
              </article>
            ) : (
              <p className="text-xs text-[#8C8476] py-6 text-center">暂无日记手记</p>
            )}
          </div>

          {/* Today Expense Feed */}
          <div className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C1C1C]/10 pb-3">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-[#1C1C1C] flex items-center gap-2">
                <span className="w-3 h-[1px] bg-[#1C1C1C]"></span>
                Recent Transactions
              </h3>
              <button
                onClick={() => setActiveTab('finance')}
                className="text-xs text-[#8C8476] hover:text-[#1C1C1C]"
              >
                明细 →
              </button>
            </div>

            <div className="space-y-3">
              {transactions.slice(0, 3).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b border-[#1C1C1C]/5 pb-2 last:border-0"
                >
                  <div>
                    <p className="text-xs font-bold text-[#1C1C1C] uppercase tracking-tight">{tx.description}</p>
                    <p className="text-[10px] font-serif-title italic text-[#8C8476]">{tx.category} • {tx.paymentMethod}</p>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#1C1C1C]">
                    {tx.type === 'expense' ? '-' : '+'}¥{tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
