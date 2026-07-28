import React from 'react';
import { Task, DiaryEntry, Transaction, Budget } from '../types';
import { APP_IMAGES } from '../data/assets';
import { BarChart3, CheckCircle2, Smile, Award, Zap } from 'lucide-react';
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AnalyticsViewProps {
  tasks: Task[];
  diary: DiaryEntry[];
  transactions: Transaction[];
  budget: Budget;
}

const MOOD_COLORS: Record<string, string> = {
  happy: '#f59e0b',
  calm: '#10b981',
  excited: '#a855f7',
  thoughtful: '#3b82f6',
  sad: '#64748b',
  tired: '#6366f1',
};

const MOOD_LABELS: Record<string, string> = {
  happy: '😊 愉悦',
  calm: '😌 平静',
  excited: '🤩 兴奋',
  thoughtful: '💭 沉思',
  sad: '😢 低落',
  tired: '😴 疲惫',
};

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  tasks,
  diary,
  transactions,
}) => {
  // Task Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Mood Frequency
  const moodCounts: Record<string, number> = {};
  diary.forEach((d) => {
    moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;
  });

  const moodPieData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: MOOD_LABELS[mood] || mood,
    value: count,
    color: MOOD_COLORS[mood] || '#9ca3af',
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#F2F0EB] border border-[#1C1C1C]/10 p-6 sm:p-8">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C8476] mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Multidimensional Analytics</span>
          </div>
          <h2 className="text-3xl font-serif-title italic font-bold text-[#1C1C1C]">
            生活数据洞察
          </h2>
          <p className="text-xs text-[#4A4540] mt-1 font-light leading-relaxed">
            复盘近期习惯、心态分布与生活节奏，洞察从容有度的人生。
          </p>
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 bg-[#FDFCFB] px-4 py-2 border border-[#1C1C1C]/10 text-xs shadow-xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-[#8C8476] font-medium">生活质感指数：</span>
              <span className="text-[#1C1C1C] font-bold font-serif-title italic">92 分 (极佳)</span>
            </div>
          </div>
        </div>

        {/* Cozy Illustration Card */}
        <div className="relative group overflow-hidden border border-[#1C1C1C]/15 bg-[#FAF9F6] p-1.5 shadow-sm shrink-0 w-full md:w-60">
          <img
            src={APP_IMAGES.analyticsBanner}
            alt="Cozy Analytics Illustration"
            referrerPolicy="no-referrer"
            className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="p-2 text-center bg-[#FAF9F6] border-t border-[#1C1C1C]/10">
            <p className="text-[11px] font-serif-title italic text-[#1C1C1C]">📊 洞察律动 · 有度从容</p>
          </div>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-6 space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-[#8C8476]">
            <span>待办执行率</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-serif-title italic font-bold text-[#1C1C1C]">{completionRate}%</p>
          <p className="text-[11px] text-[#8C8476] font-mono">
            已完成 {completedTasks} / 共 {totalTasks} 项待办
          </p>
        </div>

        <div className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-6 space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-[#8C8476]">
            <span>情绪丰富度</span>
            <Smile className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-serif-title italic font-bold text-[#1C1C1C]">{diary.length} 篇手记</p>
          <p className="text-[11px] text-[#8C8476]">主导情绪：{moodPieData[0]?.name || '平稳平静'}</p>
        </div>

        <div className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-6 space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-[#8C8476]">
            <span>记录总笔数</span>
            <Zap className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-3xl font-serif-title italic font-bold text-[#1C1C1C]">{transactions.length} 笔账单</p>
          <p className="text-[11px] text-[#8C8476]">收支记录持续追踪中</p>
        </div>
      </div>

      {/* Mood Spectrum Pie Chart */}
      <div className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#1C1C1C] flex items-center gap-2">
          <Smile className="w-4 h-4 text-[#1C1C1C]" />
          日记心态与情绪分布图谱
        </h3>

        {moodPieData.length === 0 ? (
          <p className="text-center text-xs text-[#8C8476] py-8 font-serif-title italic">No mood entries recorded yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moodPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {moodPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FAF9F6',
                      borderColor: '#1C1C1C',
                      color: '#1C1C1C',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {moodPieData.map((item) => (
                <div
                  key={item.name}
                  className="bg-[#FAF9F6] p-3 border border-[#1C1C1C]/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-medium text-[#1C1C1C]">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-[#1C1C1C]">{item.value} 篇</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
