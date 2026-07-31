import React from 'react';
import { ActiveTab, UserProfile } from '../types';
import { APP_IMAGES } from '../data/assets';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Wallet,
  Sparkles,
  PlusCircle,
  Settings,
  User,
} from 'lucide-react';

interface HeaderProps {
  profile?: UserProfile;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickRecord: () => void;
  onOpenSettings: () => void;
  onOpenUserProfile: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeTab,
  setActiveTab,
  onOpenQuickRecord,
  onOpenSettings,
  onOpenUserProfile,
  searchQuery,
  setSearchQuery,
}) => {
  const tabs = [
    { id: 'overview', label: '今日概览', icon: LayoutDashboard, color: 'text-amber-600' },
    { id: 'diary', label: '生活日记', icon: BookOpen, color: 'text-emerald-600' },
    { id: 'todo', label: '待办事项', icon: CheckSquare, color: 'text-sky-600' },
    { id: 'finance', label: '记账账本', icon: Wallet, color: 'text-rose-600' },
    { id: 'hub', label: '生活灵感', icon: Sparkles, color: 'text-indigo-600' },
  ] as const;

  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#1C1C1C]/10 text-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 overflow-hidden shadow-xs border border-[#1C1C1C]/10 bg-[#FAF9F6] shrink-0">
              <img
                src={APP_IMAGES.appLogo}
                alt="生活随记 Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <h1 className="text-lg sm:text-xl font-serif-title italic font-bold tracking-tight text-[#1C1C1C]">
                  生活随记
                </h1>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C8476] hidden md:inline">
                  The Life Ledger
                </span>
              </div>
              <p className="text-[11px] text-[#8C8476] hidden lg:block font-light">
                Quiet Reflections • Priority Tasks • Daily Ledger
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F2F0EB] p-1 rounded-none border border-[#1C1C1C]/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#3B6E58] text-[#FAF9F6] shadow-xs font-semibold'
                      : 'text-[#4A4540] hover:text-[#3B6E58] hover:bg-[#FAF9F6]/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-200' : tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="relative hidden lg:block w-40">
              <input
                type="text"
                placeholder="搜索全书..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F2F0EB] border border-[#1C1C1C]/10 text-xs text-[#1C1C1C] placeholder-[#8C8476] px-3 py-1.5 focus:outline-none focus:border-[#1C1C1C] transition-colors"
              />
            </div>

            <button
              onClick={onOpenQuickRecord}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-[10px] uppercase tracking-wider font-bold transition-colors min-h-[34px] shadow-xs shrink-0"
              title="快速记录"
            >
              <PlusCircle className="w-3.5 h-3.5 shrink-0" />
              <span>速记</span>
            </button>

            {/* Explicit Settings Button */}
            <button
              onClick={onOpenSettings}
              title="设置与数据备份"
              className="flex items-center gap-1 px-2 py-1.5 text-[#1C1C1C] bg-[#F2F0EB] hover:bg-[#FAF9F6] border border-[#1C1C1C]/10 transition-colors min-h-[34px] shrink-0 text-xs font-medium"
            >
              <Settings className="w-3.5 h-3.5 text-[#4A4540]" />
              <span className="text-[11px] font-semibold">设置</span>
            </button>

            {/* Explicit Personal Center / User Profile Button */}
            <button
              onClick={onOpenUserProfile}
              title="个人中心"
              className="flex items-center gap-1.5 px-2 py-1 bg-[#F2F0EB] hover:bg-[#FAF9F6] border border-[#1C1C1C]/10 transition-colors min-h-[34px] shrink-0 group cursor-pointer"
            >
              <img
                src={profile?.avatarUrl || APP_IMAGES.userAvatar}
                alt="User Avatar"
                referrerPolicy="no-referrer"
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-[#1C1C1C]/20 group-hover:border-[#1C1C1C] transition-colors"
              />
              <span className="text-[11px] font-semibold text-[#1C1C1C]">我的</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile App Fixed Bottom Navigation Bar */}
      <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-lg border-t border-[#1C1C1C]/15 px-1 py-1.5 flex items-center justify-around shadow-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-0.5 gap-0.5 text-[10px] font-medium transition-all ${
                isActive
                  ? 'text-[#3B6E58] font-bold'
                  : 'text-[#8C8476] hover:text-[#3B6E58]'
              }`}
            >
              <div className={`p-1 transition-transform ${isActive ? 'bg-[#3B6E58] text-white rounded-xs' : ''}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="leading-none text-[9px]">{tab.label}</span>
            </button>
          );
        })}

        {/* Mobile Bottom Navigation: 个人中心 (我的) */}
        <button
          onClick={onOpenUserProfile}
          className="flex-1 flex flex-col items-center justify-center py-0.5 gap-0.5 text-[10px] font-medium text-[#8C8476] hover:text-[#3B6E58] transition-all"
        >
          <div className="p-1">
            <User className="w-3.5 h-3.5 text-[#3B6E58]" />
          </div>
          <span className="leading-none text-[9px]">我的</span>
        </button>
      </nav>
    </header>
  );
};

