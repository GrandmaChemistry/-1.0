import React, { useState } from 'react';
import { UserProfile, Task, DiaryEntry, Transaction } from '../types';
import { APP_IMAGES } from '../data/assets';
import {
  X,
  User,
  Edit3,
  Check,
  Calendar,
  Heart,
  Moon,
  Book,
  CreditCard,
  Smile,
  Upload,
  SmilePlus,
  Settings,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  tasks: Task[];
  diary: DiaryEntry[];
  transactions: Transaction[];
  onOpenSettings?: () => void;
}

// Cute Pet Preset Avatars (Cats, Dogs & Cute Animals)
const PET_PRESET_AVATARS = [
  {
    id: 'pet-1',
    label: '元气橘猫',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'pet-2',
    label: '萌趣小狗',
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'pet-3',
    label: '治愈柴犬',
    url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'pet-4',
    label: '优雅蓝猫',
    url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'pet-5',
    label: '快乐柯基',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'pet-6',
    label: '酷酷墨镜猫',
    url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'pet-7',
    label: '软萌布偶猫',
    url: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'pet-8',
    label: '憨厚小法斗',
    url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=200',
  },
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  tasks,
  diary,
  transactions,
  onOpenSettings,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  if (!isOpen) return null;

  // Real-time statistics
  const diaryCount = diary.length;
  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
  const txCount = transactions.length;

  // Calculate join days
  const joinDateObj = new Date(profile.joinDate || '2024-03-15');
  const now = new Date();
  const daysActive = Math.max(1, Math.floor((now.getTime() - joinDateObj.getTime()) / (1000 * 3600 * 24)));

  // Total word count estimation
  const totalWords = diary.reduce((acc, curr) => acc + (curr.content ? curr.content.length : 0), 0);

  const handleStartEdit = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleSelectPresetAvatar = (url: string) => {
    setFormData((prev) => ({ ...prev, avatarUrl: url }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = () => {
    if (customAvatarUrl.trim()) {
      setFormData((prev) => ({ ...prev, avatarUrl: customAvatarUrl.trim() }));
      setCustomAvatarUrl('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF9F6] border border-[#1C1C1C] w-full max-w-lg p-6 sm:p-8 shadow-2xl text-[#1C1C1C] space-y-6 max-h-[90vh] overflow-y-auto rounded-none">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#1C1C1C]/10 pb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-serif-title italic font-bold">个人中心 (Personal Center)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8C8476] hover:text-[#1C1C1C] hover:bg-[#F2F0EB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="bg-[#F2F0EB] border border-[#1C1C1C]/15 p-5 relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar Box */}
              <div className="relative shrink-0">
                <img
                  src={profile.avatarUrl || APP_IMAGES.userAvatar}
                  alt="User Avatar"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#1C1C1C]/30 shadow-xs bg-white"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#FAF9F6]"></span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-[#1C1C1C]">{profile.name}</h4>
                  <span className="px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider text-[#3B6E58] bg-[#FAF9F6] border-[#3B6E58]/30">
                    {profile.title}
                  </span>
                </div>
                <div className="text-xs text-[#8C8476] space-y-0.5 mt-1">
                  <p className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#8C8476]" />
                    <span>记录始于 {profile.joinDate}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-500" />
                    <span>已同行 {daysActive} 天</span>
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => (isEditing ? setIsEditing(false) : handleStartEdit())}
              className="px-3 py-1.5 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs self-end sm:self-center shrink-0"
            >
              {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Edit3 className="w-3.5 h-3.5 text-amber-200" />}
              <span>{isEditing ? '取消修改' : '编辑资料'}</span>
            </button>
          </div>

          {/* Motto Box (View Mode) */}
          {!isEditing && (
            <div className="bg-[#FAF9F6] p-3 border border-[#1C1C1C]/10 text-xs italic font-serif-title text-[#4A4540]">
              <p>“{profile.motto}”</p>
            </div>
          )}

          {/* Edit Profile Form with Integrated Pet Avatar Picker */}
          {isEditing && (
            <form onSubmit={handleSave} className="space-y-4 pt-3 border-t border-[#1C1C1C]/10 text-xs">
              {/* Integrated Avatar Selection Section */}
              <div className="bg-[#FAF9F6] p-3.5 border border-[#1C1C1C]/15 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1C1C1C] flex items-center gap-1.5">
                    <SmilePlus className="w-4 h-4 text-amber-600" />
                    <span>更换头像 (萌宠动物预设 / 本地上传)</span>
                  </label>
                  <span className="text-[10px] text-[#8C8476]">实时预览已选头像</span>
                </div>

                <div className="flex items-center gap-3 pb-1 border-b border-[#1C1C1C]/10">
                  <img
                    src={formData.avatarUrl || APP_IMAGES.userAvatar}
                    alt="Current Selected Avatar"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-600 shadow-xs bg-white"
                  />
                  <div className="text-[11px] text-[#4A4540]">
                    <p className="font-bold text-[#1C1C1C]">萌宠动物头像库 (猫咪与狗狗)</p>
                    <p className="text-[10px] text-[#8C8476]">选择喜欢的萌宠预设，或上传你自己的专属图片</p>
                  </div>
                </div>

                {/* Pet Presets Grid */}
                <div>
                  <p className="text-[10px] font-bold text-[#8C8476] mb-1.5">萌宠预设库 (点击选择):</p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {PET_PRESET_AVATARS.map((avatar) => (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => handleSelectPresetAvatar(avatar.url)}
                        className={`relative p-0.5 border transition-all rounded-full overflow-hidden bg-white ${
                          formData.avatarUrl === avatar.url
                            ? 'border-amber-600 ring-2 ring-amber-500/40 scale-105'
                            : 'border-gray-200 hover:border-[#1C1C1C]'
                        }`}
                        title={avatar.label}
                      >
                        <img
                          src={avatar.url}
                          alt={avatar.label}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload or Custom Image URL */}
                <div className="pt-2 border-t border-[#1C1C1C]/10 flex flex-col sm:flex-row gap-2 items-center">
                  <label className="w-full sm:w-auto px-3 py-1.5 bg-[#F2F0EB] hover:bg-[#E8E5DF] border border-[#1C1C1C]/20 cursor-pointer font-bold flex items-center justify-center gap-1.5 shrink-0 text-xs">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>上传本地图片</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>

                  <div className="flex-1 w-full flex items-center gap-1">
                    <input
                      type="url"
                      placeholder="或粘贴网络图片 URL 地址..."
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                      className="w-full bg-white border border-[#1C1C1C]/20 px-2.5 py-1 text-xs focus:outline-none focus:border-[#1C1C1C]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-3 py-1 bg-[#1C1C1C] text-white hover:bg-[#3D3A37] text-xs font-bold shrink-0"
                    >
                      使用
                    </button>
                  </div>
                </div>
              </div>

              {/* Other Edit Fields */}
              <div>
                <label className="block text-[11px] font-bold text-[#1C1C1C] mb-1">昵称 (Name)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#1C1C1C]/20 px-3 py-1.5 font-medium text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1C1C1C] mb-1">称号头衔 (Title)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#1C1C1C]/20 px-3 py-1.5 font-medium text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1C1C1C] mb-1">个性座右铭 (Motto)</label>
                <textarea
                  value={formData.motto}
                  onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                  rows={2}
                  className="w-full bg-[#FAF9F6] border border-[#1C1C1C]/20 px-3 py-1.5 font-medium text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#1C1C1C] mb-1">早睡目标时间</label>
                  <input
                    type="text"
                    value={formData.sleepGoal}
                    onChange={(e) => setFormData({ ...formData, sleepGoal: e.target.value })}
                    className="w-full bg-[#FAF9F6] border border-[#1C1C1C]/20 px-2.5 py-1.5 font-mono text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#1C1C1C] mb-1">每日阅读分钟</label>
                  <input
                    type="number"
                    value={formData.readingGoalMinutes}
                    onChange={(e) => setFormData({ ...formData, readingGoalMinutes: Number(e.target.value) })}
                    className="w-full bg-[#FAF9F6] border border-[#1C1C1C]/20 px-2.5 py-1.5 font-mono text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 bg-[#FAF9F6] hover:bg-[#E8E5DF] border border-[#1C1C1C]/20 font-bold text-xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#3B6E58] text-white hover:bg-[#2E5846] font-bold text-xs shadow-xs transition-colors"
                >
                  保存个人信息
                </button>
              </div>
            </form>
          )}
        </div>

        {/* System Settings Entry in Personal Center */}
        {onOpenSettings && (
          <div className="bg-[#F2F0EB] p-4 border border-[#1C1C1C]/15 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#FAF9F6] border border-[#1C1C1C]/10 text-[#1C1C1C]">
                <Settings className="w-4 h-4 text-[#3B6E58]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1C1C1C]">系统设置与数据备份</h4>
                <p className="text-[10px] text-[#8C8476]">管理预算、数据导出恢复与偏好设置</p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#3D3A37] text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
            >
              <span>前往设置</span>
            </button>
          </div>
        )}

        {/* Life Habits & Preferences */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <h4 className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">习惯与生活节奏</h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-[#F2F0EB] p-3 border border-[#1C1C1C]/10 space-y-1">
              <div className="flex items-center gap-1 text-[10px] text-[#8C8476]">
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
                <span>早睡习惯</span>
              </div>
              <p className="font-bold text-[#1C1C1C] font-mono">{profile.sleepGoal}</p>
            </div>

            <div className="bg-[#F2F0EB] p-3 border border-[#1C1C1C]/10 space-y-1">
              <div className="flex items-center gap-1 text-[10px] text-[#8C8476]">
                <Book className="w-3.5 h-3.5 text-amber-600" />
                <span>每日阅读</span>
              </div>
              <p className="font-bold text-[#1C1C1C] font-mono">{profile.readingGoalMinutes} 分钟</p>
            </div>

            <div className="bg-[#F2F0EB] p-3 border border-[#1C1C1C]/10 space-y-1">
              <div className="flex items-center gap-1 text-[10px] text-[#8C8476]">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>常用支付</span>
              </div>
              <p className="font-bold text-[#1C1C1C]">{profile.defaultPaymentMethod}</p>
            </div>

            <div className="bg-[#F2F0EB] p-3 border border-[#1C1C1C]/10 space-y-1">
              <div className="flex items-center gap-1 text-[10px] text-[#8C8476]">
                <Smile className="w-3.5 h-3.5 text-sky-500" />
                <span>累积文字</span>
              </div>
              <p className="font-bold text-[#1C1C1C] font-mono">≈ {totalWords} 字</p>
            </div>
          </div>
        </div>

        {/* Bottom Close */}
        <div className="pt-2 border-t border-[#1C1C1C]/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#3B6E58] text-white hover:bg-[#2E5846] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            关闭个人中心
          </button>
        </div>
      </div>
    </div>
  );
};

