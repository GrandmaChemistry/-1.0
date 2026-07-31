import React, { useState, useEffect } from 'react';
import { Task, DiaryEntry, Transaction, Budget, ActiveTab, UserProfile, Habit, Wish, Inspiration } from './types';
import { StorageService } from './services/storage';
import { Header } from './components/Header';
import { QuickRecordModal } from './components/QuickRecordModal';
import { OverviewView } from './components/OverviewView';
import { TodoView } from './components/TodoView';
import { DiaryView } from './components/DiaryView';
import { FinanceView } from './components/FinanceView';
import { LifeHubView } from './components/LifeHubView';
import { SettingsModal } from './components/SettingsModal';
import { UserProfileModal } from './components/UserProfileModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Main persistent state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<Budget>({ monthlyLimit: 3500 });
  const [habits, setHabits] = useState<Habit[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    name: '林静安 (Lin)',
    title: '温润生活家 · 时光记录者',
    motto: '有度的生活，从容的内心。不急不躁，记录平凡日常里的微光。',
    joinDate: '2024-03-15',
    sleepGoal: '23:00',
    readingGoalMinutes: 30,
    defaultPaymentMethod: '微信',
    primaryMoodPreference: 'calm',
  });

  // Modal states
  const [isQuickRecordOpen, setIsQuickRecordOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  // Load state on mount
  const refreshAllData = () => {
    setTasks(StorageService.getTasks());
    setDiary(StorageService.getDiary());
    setTransactions(StorageService.getTransactions());
    setBudget(StorageService.getBudget());
    setProfile(StorageService.getUserProfile());
    setHabits(StorageService.getHabits());
    setWishes(StorageService.getWishes());
    setInspirations(StorageService.getInspirations());
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
    StorageService.saveUserProfile(updated);
  };

  // Handlers for Tasks
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const updated = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const isNowCompleted = t.status !== 'completed';
        return {
          ...t,
          status: isNowCompleted ? ('completed' as const) : ('pending' as const),
          completedAt: isNowCompleted ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  // Handlers for Diary
  const handleAddDiary = (newEntryData: Omit<DiaryEntry, 'id'>) => {
    const newEntry: DiaryEntry = {
      ...newEntryData,
      id: `diary-${Date.now()}`,
    };
    const updated = [newEntry, ...diary];
    setDiary(updated);
    StorageService.saveDiary(updated);
  };

  const handleUpdateDiary = (updatedEntry: DiaryEntry) => {
    const updated = diary.map((d) => (d.id === updatedEntry.id ? updatedEntry : d));
    setDiary(updated);
    StorageService.saveDiary(updated);
  };

  const handleDeleteDiary = (diaryId: string) => {
    const updated = diary.filter((d) => d.id !== diaryId);
    setDiary(updated);
    StorageService.saveDiary(updated);
  };

  // Handlers for Transactions
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}`,
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    StorageService.saveTransactions(updated);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    const updated = transactions.filter((t) => t.id !== transactionId);
    setTransactions(updated);
    StorageService.saveTransactions(updated);
  };

  const handleUpdateBudget = (newBudget: Budget) => {
    setBudget(newBudget);
    StorageService.saveBudget(newBudget);
  };

  const handleUpdateHabits = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    StorageService.saveHabits(updatedHabits);
  };

  const handleUpdateWishes = (updatedWishes: Wish[]) => {
    setWishes(updatedWishes);
    StorageService.saveWishes(updatedWishes);
  };

  const handleUpdateInspirations = (updatedInspirations: Inspiration[]) => {
    setInspirations(updatedInspirations);
    StorageService.saveInspirations(updatedInspirations);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1C1C] flex flex-col font-sans antialiased selection:bg-[#1C1C1C] selection:text-white">
      {/* Top Header */}
      <Header
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickRecord={() => setIsQuickRecordOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenUserProfile={() => setIsUserProfileOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-20 md:pb-8">
        {activeTab === 'overview' && (
          <OverviewView
            tasks={tasks}
            diary={diary}
            transactions={transactions}
            budget={budget}
            onToggleTask={handleToggleTask}
            setActiveTab={setActiveTab}
            onOpenQuickRecord={() => setIsQuickRecordOpen(true)}
          />
        )}

        {activeTab === 'todo' && (
          <TodoView
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
          />
        )}

        {activeTab === 'diary' && (
          <DiaryView
            diary={diary}
            onAddDiary={handleAddDiary}
            onUpdateDiary={handleUpdateDiary}
            onDeleteDiary={handleDeleteDiary}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceView
            transactions={transactions}
            budget={budget}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onUpdateBudget={handleUpdateBudget}
          />
        )}

        {activeTab === 'hub' && (
          <LifeHubView
            habits={habits}
            wishes={wishes}
            inspirations={inspirations}
            diaryEntries={diary}
            onUpdateHabits={handleUpdateHabits}
            onUpdateWishes={handleUpdateWishes}
            onUpdateInspirations={handleUpdateInspirations}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1C1C1C]/10 bg-[#F2F0EB] py-6 text-center text-xs text-[#8C8476] mb-14 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1C1C1C]"></span>
            <p className="font-serif-title italic text-[#1C1C1C] text-sm">
              The Life Ledger — 生活随记
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#8C8476] uppercase tracking-wider">
            <span>Local Storage</span>
            <span>•</span>
            <span>Gemini AI Engine</span>
            <span>•</span>
            <span>{new Date().getFullYear()} Edition</span>
          </div>
        </div>
      </footer>

      {/* Unified Quick Record Modal */}
      <QuickRecordModal
        isOpen={isQuickRecordOpen}
        onClose={() => setIsQuickRecordOpen(false)}
        onAddTask={handleAddTask}
        onAddDiary={handleAddDiary}
        onAddTransaction={handleAddTransaction}
      />

      {/* Settings & Data Backup Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        budget={budget}
        onUpdateBudget={handleUpdateBudget}
        onRefreshData={refreshAllData}
      />

      {/* Dedicated Personal Center Modal */}
      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        tasks={tasks}
        diary={diary}
        transactions={transactions}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
    </div>
  );
}
