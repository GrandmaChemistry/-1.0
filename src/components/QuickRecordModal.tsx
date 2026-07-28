import React, { useState } from 'react';
import { Task, DiaryEntry, Transaction, MoodType, WeatherType, Priority } from '../types';
import { AiApiService } from '../services/api';
import { X, Sparkles, Wallet, CheckSquare, BookOpen, Loader2 } from 'lucide-react';

interface QuickRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onAddDiary: (entry: Omit<DiaryEntry, 'id'>) => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const QuickRecordModal: React.FC<QuickRecordModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  onAddDiary,
  onAddTransaction,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'ai_finance' | 'finance' | 'todo' | 'diary'>('ai_finance');

  // AI Smart Expense state
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Manual Transaction state
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('餐饮');
  const [txDesc, setTxDesc] = useState('');
  const [txPayment, setTxPayment] = useState('微信');

  // Task state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('生活');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);

  // Diary state
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryContent, setDiaryContent] = useState('');
  const [diaryMood, setDiaryMood] = useState<MoodType>('happy');
  const [diaryWeather, setDiaryWeather] = useState<WeatherType>('sunny');

  const handleAiSmartExpense = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    setAiError(null);
    try {
      const items = await AiApiService.parseSmartExpenses(aiInput);
      if (items.length === 0) {
        setAiError('未解析出有效的收支数据，请重试');
        return;
      }
      const todayStr = new Date().toISOString().split('T')[0];
      items.forEach((item) => {
        onAddTransaction({
          type: item.type,
          amount: item.amount,
          category: item.category,
          description: item.description,
          date: todayStr,
          paymentMethod: item.paymentMethod,
          tags: ['AI智能解析'],
        });
      });
      setAiInput('');
      onClose();
    } catch (err: any) {
      setAiError(err.message || '解析失败，请检查网络或重新输入');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleManualTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || parseFloat(txAmount) <= 0) return;
    onAddTransaction({
      type: txType,
      amount: parseFloat(txAmount),
      category: txCategory,
      description: txDesc || txCategory,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: txPayment,
      tags: [],
    });
    setTxAmount('');
    setTxDesc('');
    onClose();
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    onAddTask({
      title: taskTitle.trim(),
      category: taskCategory,
      priority: taskPriority,
      dueDate: taskDueDate,
      status: 'pending',
      tags: [],
      subtasks: [],
    });
    setTaskTitle('');
    onClose();
  };

  const handleDiarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryContent.trim()) return;
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    onAddDiary({
      title: diaryTitle.trim() || '随感记事',
      content: diaryContent.trim(),
      date: dateStr,
      mood: diaryMood,
      weather: diaryWeather,
      tags: ['速记'],
      photoUrls: [],
    });
    setDiaryTitle('');
    setDiaryContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF9F6] border border-[#1C1C1C] w-full max-w-lg overflow-hidden shadow-2xl text-[#1C1C1C] max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1C1C1C]/10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C8476]">Quick Action</span>
            <h3 className="text-xl font-serif-title italic font-bold text-[#1C1C1C]">
              快速记录生活
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8C8476] hover:text-[#1C1C1C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Mode Selector */}
        <div className="flex border-b border-[#1C1C1C]/10 bg-[#F2F0EB] p-1.5 gap-1 text-xs font-medium">
          <button
            onClick={() => setMode('ai_finance')}
            className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-all font-semibold ${
              mode === 'ai_finance'
                ? 'bg-[#3B6E58] text-white shadow-xs'
                : 'text-[#8C8476] hover:text-[#3B6E58]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI 智能记账
          </button>
          <button
            onClick={() => setMode('finance')}
            className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-all font-semibold ${
              mode === 'finance'
                ? 'bg-[#3B6E58] text-white shadow-xs'
                : 'text-[#8C8476] hover:text-[#3B6E58]'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            手动记账
          </button>
          <button
            onClick={() => setMode('todo')}
            className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-all font-semibold ${
              mode === 'todo'
                ? 'bg-[#3B6E58] text-white shadow-xs'
                : 'text-[#8C8476] hover:text-[#3B6E58]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            新建待办
          </button>
          <button
            onClick={() => setMode('diary')}
            className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-all font-semibold ${
              mode === 'diary'
                ? 'bg-[#3B6E58] text-white shadow-xs'
                : 'text-[#8C8476] hover:text-[#3B6E58]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            写日记
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Mode 1: AI Smart Expense */}
          {mode === 'ai_finance' && (
            <div className="space-y-4">
              <p className="text-xs text-[#4A4540] font-light leading-relaxed">
                输入一段自然语言描述，AI将自动提取金额、分类、事由与支付方式（例如：“中午和同事吃烤肉花了158元微信支付，打车回家25元”）：
              </p>
              <textarea
                rows={4}
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="在此输入您的开销或收入描述..."
                className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 p-3 text-sm text-[#1C1C1C] placeholder-[#8C8476] focus:outline-none focus:border-[#1C1C1C] transition-colors resize-none"
              />
              {aiError && <p className="text-xs text-rose-600 font-medium">{aiError}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#8C8476] hover:text-[#1C1C1C] transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  disabled={isAiLoading || !aiInput.trim()}
                  onClick={handleAiSmartExpense}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-[10px] uppercase tracking-[0.2em] font-bold disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      AI 智能解析中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      一键解析并生成
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Mode 2: Manual Finance */}
          {mode === 'finance' && (
            <form onSubmit={handleManualTransactionSubmit} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTxType('expense')}
                  className={`flex-1 py-1.5 text-xs font-semibold border ${
                    txType === 'expense'
                      ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                      : 'bg-[#F2F0EB] border-[#1C1C1C]/10 text-[#8C8476]'
                  }`}
                >
                  支出 Expense
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('income')}
                  className={`flex-1 py-1.5 text-xs font-semibold border ${
                    txType === 'income'
                      ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                      : 'bg-[#F2F0EB] border-[#1C1C1C]/10 text-[#8C8476]'
                  }`}
                >
                  收入 Income
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">金额 (¥)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3 py-2 text-sm text-[#1C1C1C] font-mono focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">分类</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  >
                    {txType === 'expense' ? (
                      <>
                        <option value="餐饮">餐饮 Food</option>
                        <option value="交通">交通 Transport</option>
                        <option value="购物">购物 Shopping</option>
                        <option value="娱乐">娱乐 Fun</option>
                        <option value="居住">居住 Housing</option>
                        <option value="医疗">医疗 Medical</option>
                        <option value="其他">其他 Other</option>
                      </>
                    ) : (
                      <>
                        <option value="工资">工资 Salary</option>
                        <option value="兼职">兼职 Side Hustle</option>
                        <option value="理财">理财 Investment</option>
                        <option value="其他">其他 Other</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">备注说明</label>
                <input
                  type="text"
                  placeholder="事由、地点等..."
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1C1C1C]/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#8C8476] hover:text-[#1C1C1C] transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-colors shadow-xs"
                >
                  保存记录
                </button>
              </div>
            </form>
          )}

          {/* Mode 3: Todo */}
          {mode === 'todo' && (
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">待办标题 *</label>
                <input
                  type="text"
                  required
                  placeholder="需要完成什么事项？"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">分类</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-2.5 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  >
                    <option value="生活">生活</option>
                    <option value="工作">工作</option>
                    <option value="学习">学习</option>
                    <option value="健康">健康</option>
                    <option value="兴趣">兴趣</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">优先级</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-2.5 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  >
                    <option value="low">低 Priority</option>
                    <option value="medium">中 Priority</option>
                    <option value="high">高 Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">截止日期</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-2.5 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1C1C1C]/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#8C8476] hover:text-[#1C1C1C] transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-colors shadow-xs"
                >
                  添加待办
                </button>
              </div>
            </form>
          )}

          {/* Mode 4: Diary */}
          {mode === 'diary' && (
            <form onSubmit={handleDiarySubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">日记标题</label>
                <input
                  type="text"
                  placeholder="给今天的小确幸取个名字..."
                  value={diaryTitle}
                  onChange={(e) => setDiaryTitle(e.target.value)}
                  className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3 py-2 text-xs font-serif-title text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">今天的心情</label>
                  <select
                    value={diaryMood}
                    onChange={(e) => setDiaryMood(e.target.value as MoodType)}
                    className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  >
                    <option value="happy">😊 开心 Happy</option>
                    <option value="calm">😌 平静 Calm</option>
                    <option value="excited">🤩 兴奋 Excited</option>
                    <option value="thoughtful">💭 沉思 Thoughtful</option>
                    <option value="sad">😢 低落 Sad</option>
                    <option value="tired">😴 疲惫 Tired</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">天气</label>
                  <select
                    value={diaryWeather}
                    onChange={(e) => setDiaryWeather(e.target.value as WeatherType)}
                    className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  >
                    <option value="sunny">☀️ 晴朗 Sunny</option>
                    <option value="cloudy">⛅ 多云 Cloudy</option>
                    <option value="rainy">🌧️ 雨天 Rainy</option>
                    <option value="windy">🌬️ 大风 Windy</option>
                    <option value="snowy">❄️ 飘雪 Snowy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">日记正文 *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="记录下当下的感受、发生的事情或思考..."
                  value={diaryContent}
                  onChange={(e) => setDiaryContent(e.target.value)}
                  className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 p-3 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] resize-none font-serif-title leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1C1C1C]/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#8C8476] hover:text-[#1C1C1C] transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-colors shadow-xs"
                >
                  发表日记
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
