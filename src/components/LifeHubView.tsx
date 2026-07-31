import React, { useState } from 'react';
import { Habit, Wish, Inspiration, DiaryEntry } from '../types';
import { APP_IMAGES } from '../data/assets';
import {
  Flame,
  Sparkles,
  Compass,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Heart,
  Quote,
  Shuffle,
  Calendar,
  Tag,
  Star,
  Check,
  Award,
  BookOpen,
} from 'lucide-react';

interface LifeHubViewProps {
  habits: Habit[];
  wishes: Wish[];
  inspirations: Inspiration[];
  diaryEntries: DiaryEntry[];
  onUpdateHabits: (habits: Habit[]) => void;
  onUpdateWishes: (wishes: Wish[]) => void;
  onUpdateInspirations: (inspirations: Inspiration[]) => void;
}

export const LifeHubView: React.FC<LifeHubViewProps> = ({
  habits,
  wishes,
  inspirations,
  diaryEntries,
  onUpdateHabits,
  onUpdateWishes,
  onUpdateInspirations,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'habits' | 'wishes' | 'capsule'>('habits');

  // Today's date YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // --- HABIT ACTIONS ---
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('💧');
  const [newHabitCategory, setNewHabitCategory] = useState('健康');
  const [newHabitTarget, setNewHabitTarget] = useState(7);

  const toggleHabitToday = (habitId: string) => {
    const updated = habits.map((h) => {
      if (h.id !== habitId) return h;
      const isCompletedToday = h.completedDates.includes(todayStr);
      let newDates: string[];
      if (isCompletedToday) {
        newDates = h.completedDates.filter((d) => d !== todayStr);
      } else {
        newDates = [...h.completedDates, todayStr];
      }
      return { ...h, completedDates: newDates };
    });
    onUpdateHabits(updated);
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      title: newHabitTitle.trim(),
      icon: newHabitIcon || '✨',
      category: newHabitCategory,
      targetDaysPerWeek: newHabitTarget,
      completedDates: [],
      createdAt: todayStr,
    };
    onUpdateHabits([newHabit, ...habits]);
    setNewHabitTitle('');
    setShowAddHabit(false);
  };

  const deleteHabit = (id: string) => {
    onUpdateHabits(habits.filter((h) => h.id !== id));
  };

  // --- WISH ACTIONS ---
  const [showAddWish, setShowAddWish] = useState(false);
  const [wishCategoryFilter, setWishCategoryFilter] = useState<string>('全部');
  const [newWishTitle, setNewWishTitle] = useState('');
  const [newWishCategory, setNewWishCategory] = useState<'旅行' | '学习' | '体验' | '心愿物' | '其他'>('旅行');
  const [newWishNote, setNewWishNote] = useState('');
  const [newWishTargetDate, setNewWishTargetDate] = useState('');

  const toggleWishAchieved = (wishId: string) => {
    const updated = wishes.map((w) => {
      if (w.id !== wishId) return w;
      const isAchieved = w.status === 'achieved';
      return {
        ...w,
        status: (isAchieved ? 'planning' : 'achieved') as 'planning' | 'achieved',
        achievedDate: isAchieved ? undefined : todayStr,
      };
    });
    onUpdateWishes(updated);
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishTitle.trim()) return;
    const newWish: Wish = {
      id: `wish-${Date.now()}`,
      title: newWishTitle.trim(),
      category: newWishCategory,
      status: 'planning',
      note: newWishNote.trim() || undefined,
      targetDate: newWishTargetDate || undefined,
      createdAt: todayStr,
    };
    onUpdateWishes([newWish, ...wishes]);
    setNewWishTitle('');
    setNewWishNote('');
    setNewWishTargetDate('');
    setShowAddWish(false);
  };

  const deleteWish = (id: string) => {
    onUpdateWishes(wishes.filter((w) => w.id !== id));
  };

  // --- TIME CAPSULE & INSPIRATION ---
  const [showAddInsp, setShowAddInsp] = useState(false);
  const [newInspContent, setNewInspContent] = useState('');
  const [newInspSource, setNewInspSource] = useState('');
  const [newInspTag, setNewInspTag] = useState('生活');

  const [capsuleItem, setCapsuleItem] = useState<DiaryEntry | null>(
    diaryEntries.length > 0 ? diaryEntries[Math.floor(Math.random() * diaryEntries.length)] : null
  );

  const drawCapsule = () => {
    if (diaryEntries.length === 0) return;
    const randomIndex = Math.floor(Math.random() * diaryEntries.length);
    setCapsuleItem(diaryEntries[randomIndex]);
  };

  const handleAddInsp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInspContent.trim()) return;
    const newInsp: Inspiration = {
      id: `insp-${Date.now()}`,
      content: newInspContent.trim(),
      source: newInspSource.trim() || undefined,
      tags: [newInspTag],
      createdAt: todayStr,
    };
    onUpdateInspirations([newInsp, ...inspirations]);
    setNewInspContent('');
    setNewInspSource('');
    setShowAddInsp(false);
  };

  const deleteInsp = (id: string) => {
    onUpdateInspirations(inspirations.filter((i) => i.id !== id));
  };

  // Filtered wishes
  const filteredWishes = wishes.filter(
    (w) => wishCategoryFilter === '全部' || w.category === wishCategoryFilter
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#F2F0EB] border border-[#1C1C1C]/10 p-5 sm:p-8 shadow-xs">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C8476] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#3B6E58]" />
            <span>Habits, Wishes & Moments</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-title italic font-bold text-[#1C1C1C]">
            生活灵感与时光打卡
          </h2>
          <p className="text-xs text-[#4A4540] font-light leading-relaxed">
            培养微小的微习惯、收集人生愿望图景、随时抽取昔日时光胶囊与闪念高光。
          </p>
        </div>

        {/* Cozy Illustration Card */}
        <div className="relative group overflow-hidden border border-[#1C1C1C]/15 bg-[#FAF9F6] p-1.5 shadow-sm shrink-0 w-full md:w-60">
          <img
            src={APP_IMAGES.lifehubBanner}
            alt="生活灵感与时光打卡"
            referrerPolicy="no-referrer"
            className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="p-2 text-center bg-[#FAF9F6] border-t border-[#1C1C1C]/10">
            <p className="text-[11px] font-serif-title italic text-[#1C1C1C]">🌿 收集生活里的微光</p>
          </div>
        </div>
      </div>

        {/* SubTab Navigation */}
        <div className="flex flex-wrap gap-2 pt-6 border-t border-[#1C1C1C]/10 mt-6">
          <button
            onClick={() => setActiveSubTab('habits')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium transition-colors ${
              activeSubTab === 'habits'
                ? 'bg-[#3B6E58] text-white shadow-xs font-semibold'
                : 'bg-[#F2F0EB] text-[#4A4540] hover:text-[#3B6E58] border border-[#1C1C1C]/10'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>日常习惯打卡 ({habits.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('wishes')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium transition-colors ${
              activeSubTab === 'wishes'
                ? 'bg-[#3B6E58] text-white shadow-xs font-semibold'
                : 'bg-[#F2F0EB] text-[#4A4540] hover:text-[#3B6E58] border border-[#1C1C1C]/10'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>人生愿望清单 ({wishes.filter((w) => w.status === 'planning').length} 计划中)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('capsule')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium transition-colors ${
              activeSubTab === 'capsule'
                ? 'bg-[#3B6E58] text-white shadow-xs font-semibold'
                : 'bg-[#F2F0EB] text-[#4A4540] hover:text-[#3B6E58] border border-[#1C1C1C]/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>时光胶囊 & 灵感口袋</span>
          </button>
        </div>

      {/* SECTION 1: HABITS */}
      {activeSubTab === 'habits' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-serif font-bold text-[#1C1C1C] flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                坚持微习惯，让改变悄然发生
              </h3>
              <p className="text-xs text-[#8C8476] mt-0.5">今天打卡记录，打造秩序感的生活节奏</p>
            </div>
            <button
              onClick={() => setShowAddHabit(!showAddHabit)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-xs font-medium transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新建习惯</span>
            </button>
          </div>

          {/* Add Habit Form */}
          {showAddHabit && (
            <form
              onSubmit={handleAddHabit}
              className="bg-[#FDFCFB] border border-[#1C1C1C]/15 p-5 space-y-4 animate-in slide-in-from-top-2 duration-200"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">添加新习惯</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] text-[#8C8476]">习惯名称</label>
                  <input
                    type="text"
                    required
                    placeholder="例如：每日晨读20分钟、晨起饮水..."
                    value={newHabitTitle}
                    onChange={(e) => setNewHabitTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#1C1C1C]/10 focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8C8476]">图标 (Emoji)</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={newHabitIcon}
                    onChange={(e) => setNewHabitIcon(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#1C1C1C]/10 focus:outline-none focus:border-[#1C1C1C] text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8C8476]">分类</label>
                  <select
                    value={newHabitCategory}
                    onChange={(e) => setNewHabitCategory(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#1C1C1C]/10 focus:outline-none focus:border-[#1C1C1C]"
                  >
                    <option value="健康">健康</option>
                    <option value="学习">学习</option>
                    <option value="作息">作息</option>
                    <option value="运动">运动</option>
                    <option value="心态">心态</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8C8476]">每周目标天数 ({newHabitTarget} 天)</label>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    value={newHabitTarget}
                    onChange={(e) => setNewHabitTarget(parseInt(e.target.value))}
                    className="w-full accent-[#1C1C1C] cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddHabit(false)}
                  className="px-3 py-1.5 text-xs text-[#8C8476] hover:text-[#1C1C1C]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-xs font-medium"
                >
                  保存习惯
                </button>
              </div>
            </form>
          )}

          {/* Habit Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit) => {
              const isCompletedToday = habit.completedDates.includes(todayStr);
              const streak = habit.completedDates.length;

              return (
                <div
                  key={habit.id}
                  className={`p-5 border transition-all ${
                    isCompletedToday
                      ? 'bg-[#FAF9F6] border-[#1C1C1C]/20 shadow-xs'
                      : 'bg-[#FDFCFB] border-[#1C1C1C]/10 hover:border-[#1C1C1C]/25'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FAF9F6] border border-[#1C1C1C]/10 flex items-center justify-center text-lg shrink-0">
                        {habit.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1C1C1C] flex items-center gap-2">
                          <span>{habit.title}</span>
                          <span className="text-[10px] font-normal px-1.5 py-0.5 bg-[#1C1C1C]/5 text-[#8C8476]">
                            {habit.category}
                          </span>
                        </h4>
                        <p className="text-[11px] text-[#8C8476] mt-0.5">
                          目标：每周 {habit.targetDaysPerWeek} 天 · 已累计打卡 {streak} 天
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      title="删除习惯"
                      className="p-1 text-[#8C8476] hover:text-[#1C1C1C] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Today check-in button */}
                  <div className="mt-4 pt-3 border-t border-[#1C1C1C]/5 flex items-center justify-between">
                    <span className="text-[11px] text-[#4A4540]">今日完成状态：</span>
                    <button
                      onClick={() => toggleHabitToday(habit.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors ${
                        isCompletedToday
                          ? 'bg-emerald-800 text-white border-emerald-900'
                          : 'bg-[#FAF9F6] text-[#1C1C1C] border-[#1C1C1C]/20 hover:border-[#1C1C1C]'
                      }`}
                    >
                      {isCompletedToday ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                          <span>今日已打卡</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-[#8C8476]" />
                          <span>点击完成打卡</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: WISHES (BUCKET LIST) */}
      {activeSubTab === 'wishes' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-serif font-bold text-[#1C1C1C] flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-600" />
                人生愿望与长远期待清单
              </h3>
              <p className="text-xs text-[#8C8476] mt-0.5">记录想去的地方、想体验的微梦想与人生目标</p>
            </div>
            <button
              onClick={() => setShowAddWish(!showAddWish)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-xs font-medium transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加心愿</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {['全部', '旅行', '学习', '体验', '心愿', '其他'].map((cat) => (
              <button
                key={cat}
                onClick={() => setWishCategoryFilter(cat)}
                className={`px-3 py-1 text-xs transition-colors ${
                  wishCategoryFilter === cat
                    ? 'bg-[#3B6E58] text-white font-medium shadow-xs'
                    : 'bg-[#F2F0EB] text-[#4A4540] hover:text-[#3B6E58] border border-[#1C1C1C]/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Add Wish Form */}
          {showAddWish && (
            <form
              onSubmit={handleAddWish}
              className="bg-[#FDFCFB] border border-[#1C1C1C]/15 p-5 space-y-4 animate-in slide-in-from-top-2 duration-200"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">记录新心愿</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] text-[#8C8476]">心愿内容</label>
                  <input
                    type="text"
                    required
                    placeholder="例如：漫步洱海看蓝调天空、去极地看极光..."
                    value={newWishTitle}
                    onChange={(e) => setNewWishTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#1C1C1C]/10 focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8C8476]">分类</label>
                  <select
                    value={newWishCategory}
                    onChange={(e) => setNewWishCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#1C1C1C]/10 focus:outline-none focus:border-[#1C1C1C]"
                  >
                    <option value="旅行">旅行</option>
                    <option value="学习">学习</option>
                    <option value="体验">体验</option>
                    <option value="心愿">心愿</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8C8476]">期望实现时间 (可选)</label>
                  <input
                    type="date"
                    value={newWishTargetDate}
                    onChange={(e) => setNewWishTargetDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#1C1C1C]/10 focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8C8476]">灵感备注 / 细节想法</label>
                  <input
                    type="text"
                    placeholder="例如：期待住进带露台的小民宿..."
                    value={newWishNote}
                    onChange={(e) => setNewWishNote(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#1C1C1C]/10 focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWish(false)}
                  className="px-3 py-1.5 text-xs text-[#8C8476] hover:text-[#1C1C1C]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-xs font-medium"
                >
                  添加到愿望清单
                </button>
              </div>
            </form>
          )}

          {/* Wish Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWishes.map((wish) => {
              const isAchieved = wish.status === 'achieved';
              return (
                <div
                  key={wish.id}
                  className={`p-5 border transition-all ${
                    isAchieved
                      ? 'bg-[#FAF9F6] border-[#1C1C1C]/10 opacity-80'
                      : 'bg-[#FDFCFB] border-[#1C1C1C]/15 hover:border-[#1C1C1C]/30 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleWishAchieved(wish.id)}
                        className="mt-0.5 shrink-0"
                        title={isAchieved ? '标记为计划中' : '标记为已实现'}
                      >
                        {isAchieved ? (
                          <CheckCircle2 className="w-5 h-5 text-sky-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#8C8476] hover:text-[#1C1C1C]" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-[#1C1C1C]/5 text-[#8C8476]">
                            {wish.category}
                          </span>
                          {isAchieved && (
                            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 border border-sky-200">
                              已达成 🎉
                            </span>
                          )}
                        </div>

                        <h4
                          className={`text-sm font-bold mt-1.5 ${
                            isAchieved ? 'line-through text-[#8C8476]' : 'text-[#1C1C1C]'
                          }`}
                        >
                          {wish.title}
                        </h4>

                        {wish.note && (
                          <p className="text-xs text-[#4A4540] mt-1 font-light leading-relaxed">
                            {wish.note}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-[10px] text-[#8C8476] mt-2 font-mono">
                          {wish.targetDate && <span>目标日期: {wish.targetDate}</span>}
                          {wish.achievedDate && <span>实现于: {wish.achievedDate}</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteWish(wish.id)}
                      className="p-1 text-[#8C8476] hover:text-[#1C1C1C] transition-colors"
                      title="删除愿望"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: TIME CAPSULE & INSPIRATION */}
      {activeSubTab === 'capsule' && (
        <div className="space-y-8">
          {/* Time Capsule Random Memory Draw */}
          <div className="bg-[#FAF9F6] border border-[#1C1C1C]/15 p-6 md:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <h3 className="text-base font-serif font-bold text-[#1C1C1C]">时光胶囊</h3>
                  <p className="text-xs text-[#8C8476] font-light">随机回忆抽屉</p>
                </div>
              </div>
              <button
                onClick={drawCapsule}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-xs font-medium transition-colors shadow-xs"
              >
                <Shuffle className="w-3.5 h-3.5 text-emerald-300" />
                <span>开启下一粒</span>
              </button>
            </div>

            {capsuleItem ? (
              <div className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-5 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-xs text-[#8C8476] font-mono">
                  <span>📅 {capsuleItem.date}</span>
                  <span>📍 {capsuleItem.location || '未知地点'}</span>
                </div>
                <h4 className="text-base font-bold text-[#1C1C1C] font-serif">{capsuleItem.title}</h4>
                <p className="text-xs text-[#4A4540] leading-relaxed whitespace-pre-line font-light">
                  {capsuleItem.content}
                </p>
                {capsuleItem.aiReflection && (
                  <div className="pt-3 border-t border-[#1C1C1C]/10 text-xs text-[#8C8476] italic">
                    💡 岁月回响：{capsuleItem.aiReflection}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-[#8C8476]">暂无日记回忆胶囊，去日记模块写下一篇吧！</div>
            )}
          </div>

          {/* Inspiration Pocket */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-[#1C1C1C] flex items-center gap-2">
                  <Quote className="w-4 h-4 text-amber-600" />
                  闪念与灵感金句口袋
                </h3>
                <p className="text-xs text-[#8C8476] mt-0.5">收集触动心灵的句子、感悟与灵感碎碎念</p>
              </div>
              <button
                onClick={() => setShowAddInsp(!showAddInsp)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-xs font-medium transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>录入金句</span>
              </button>
            </div>

            {showAddInsp && (
              <form
                onSubmit={handleAddInsp}
                className="bg-[#FDFCFB] border border-[#1C1C1C]/15 p-5 space-y-3 animate-in slide-in-from-top-2 duration-200"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">添加灵感摘录</h4>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8C8476]">句子 / 闪念内容</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="写下触动你的文字..."
                    value={newInspContent}
                    onChange={(e) => setNewInspContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#1C1C1C]/10 focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#8C8476]">出处 / 来源 (可选)</label>
                    <input
                      type="text"
                      placeholder="例如：《书名》/ 闪念笔记"
                      value={newInspSource}
                      onChange={(e) => setNewInspSource(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#1C1C1C]/10 focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#8C8476]">标签</label>
                    <input
                      type="text"
                      value={newInspTag}
                      onChange={(e) => setNewInspTag(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#1C1C1C]/10 focus:outline-none focus:border-[#1C1C1C]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddInsp(false)}
                    className="px-3 py-1.5 text-xs text-[#8C8476] hover:text-[#1C1C1C]"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-xs font-medium"
                  >
                    保存灵感
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {inspirations.map((insp) => (
                <div
                  key={insp.id}
                  className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-5 space-y-3 hover:border-[#1C1C1C]/25 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <Quote className="w-4 h-4 text-amber-500 opacity-60" />
                    <p className="text-xs text-[#1C1C1C] leading-relaxed font-serif font-medium">
                      “{insp.content}”
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1C1C1C]/5 flex items-center justify-between text-[10px] text-[#8C8476]">
                    <span>{insp.source || '未名出处'}</span>
                    <button
                      onClick={() => deleteInsp(insp.id)}
                      className="hover:text-[#1C1C1C] transition-colors"
                      title="删除灵感"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
