import React, { useState } from 'react';
import { DiaryEntry, MoodType, WeatherType } from '../types';
import { APP_IMAGES } from '../data/assets';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Calendar,
  MapPin,
  Tag,
  Image as ImageIcon,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  Wind,
  X,
  Pencil,
} from 'lucide-react';

interface DiaryViewProps {
  diary: DiaryEntry[];
  onAddDiary: (entry: Omit<DiaryEntry, 'id'>) => void;
  onUpdateDiary: (entry: DiaryEntry) => void;
  onDeleteDiary: (diaryId: string) => void;
}

const PRESET_PHOTOS = [
  { label: '🐱 喵咪小憩', url: APP_IMAGES.diaryCover },
  { label: '惬意咖啡馆', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80' },
  { label: '雨后绿植', url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80' },
  { label: '阳光书桌', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80' },
  { label: '晚霞天空', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { label: '森林步道', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80' },
];

export const DiaryView: React.FC<DiaryViewProps> = ({
  diary,
  onAddDiary,
  onUpdateDiary,
  onDeleteDiary,
}) => {
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editor Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiaryId, setEditingDiaryId] = useState<string | null>(null);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [entryMood, setEntryMood] = useState<MoodType>('happy');
  const [entryWeather, setEntryWeather] = useState<WeatherType>('sunny');
  const [entryLocation, setEntryLocation] = useState('');
  const [entryTagsStr, setEntryTagsStr] = useState('');
  const [entryPhotos, setEntryPhotos] = useState<string[]>([]);
  const [customPhotoInput, setCustomPhotoInput] = useState('');
  const [aiReflectionText, setAiReflectionText] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // AI Reflection generation state per entry item
  const [generatingForId, setGeneratingForId] = useState<string | null>(null);

  const moodOptions = [
    { id: 'all', label: '全部心情' },
    { id: 'happy', label: '😊 愉悦' },
    { id: 'calm', label: '😌 平静' },
    { id: 'excited', label: '🤩 兴奋' },
    { id: 'thoughtful', label: '💭 沉思' },
    { id: 'sad', label: '😢 低落' },
    { id: 'tired', label: '😴 疲惫' },
  ];

  const filteredDiary = diary.filter((entry) => {
    const matchesMood = selectedMood === 'all' || entry.mood === selectedMood;
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesMood && matchesSearch;
  });

  const getWeatherIcon = (weather: WeatherType) => {
    switch (weather) {
      case 'sunny':
        return <Sun className="w-3.5 h-3.5 text-amber-400" />;
      case 'cloudy':
        return <Cloud className="w-3.5 h-3.5 text-stone-400" />;
      case 'rainy':
        return <CloudRain className="w-3.5 h-3.5 text-blue-400" />;
      case 'snowy':
        return <Snowflake className="w-3.5 h-3.5 text-cyan-300" />;
      case 'windy':
        return <Wind className="w-3.5 h-3.5 text-teal-400" />;
    }
  };

  const getWeatherLabel = (weather: WeatherType) => {
    switch (weather) {
      case 'sunny':
        return '晴朗';
      case 'cloudy':
        return '多云';
      case 'rainy':
        return '雨天';
      case 'snowy':
        return '飘雪';
      case 'windy':
        return '微风';
    }
  };

  const getMoodEmoji = (mood: MoodType) => {
    switch (mood) {
      case 'happy':
        return '😊';
      case 'calm':
        return '😌';
      case 'excited':
        return '🤩';
      case 'thoughtful':
        return '💭';
      case 'sad':
        return '😢';
      case 'tired':
        return '😴';
      default:
        return '✨';
    }
  };

  const handleOpenCreateModal = () => {
    setEditingDiaryId(null);
    setEntryTitle('');
    setEntryContent('');
    setEntryMood('happy');
    setEntryWeather('sunny');
    setEntryLocation('');
    setEntryTagsStr('');
    setEntryPhotos([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (entry: DiaryEntry) => {
    setEditingDiaryId(entry.id);
    setEntryTitle(entry.title);
    setEntryContent(entry.content);
    setEntryMood(entry.mood);
    setEntryWeather(entry.weather);
    setEntryLocation(entry.location || '');
    setEntryTagsStr(entry.tags ? entry.tags.join(', ') : '');
    setEntryPhotos(entry.photoUrls || []);
    setIsModalOpen(true);
  };

  const handleSaveDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryContent.trim()) return;

    const tags = entryTagsStr
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingDiaryId) {
      const existing = diary.find((d) => d.id === editingDiaryId);
      if (existing) {
        onUpdateDiary({
          ...existing,
          title: entryTitle.trim() || '日常碎碎念',
          content: entryContent.trim(),
          mood: entryMood,
          weather: entryWeather,
          tags,
          photoUrls: entryPhotos,
          location: entryLocation.trim() || undefined,
        });
      }
    } else {
      const now = new Date();
      const dateStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(
        2,
        '0'
      )}:${String(now.getMinutes()).padStart(2, '0')}`;

      onAddDiary({
        title: entryTitle.trim() || '日常碎碎念',
        content: entryContent.trim(),
        date: dateStr,
        mood: entryMood,
        weather: entryWeather,
        tags,
        photoUrls: entryPhotos,
        location: entryLocation.trim() || undefined,
      });
    }

    setEditingDiaryId(null);
    setEntryTitle('');
    setEntryContent('');
    setEntryLocation('');
    setEntryTagsStr('');
    setEntryPhotos([]);
    setIsModalOpen(false);
  };

  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEntryPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#F2F0EB] border border-[#1C1C1C]/10 p-6 sm:p-8">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C8476] mb-1">
            <BookOpen className="w-3.5 h-3.5 text-[#1C1C1C]" />
            <span>Journal Collection</span>
          </div>
          <h2 className="text-3xl font-serif-title italic font-bold text-[#1C1C1C]">
            生活日记馆
          </h2>
          <p className="text-xs text-[#4A4540] mt-1 font-light leading-relaxed">
            记录情绪轨迹，捕捉生活瞬间。让文字与温暖定格时光。
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4 text-emerald-200" />
              <span>撰写新日记</span>
            </button>
          </div>
        </div>

        {/* Cute Diary Cover Card */}
        <div className="relative group overflow-hidden border border-[#1C1C1C]/15 bg-[#FAF9F6] p-1.5 shadow-sm shrink-0 w-full md:w-64">
          <img
            src={APP_IMAGES.diaryCover}
            alt="Cozy Cat Diary Illustration"
            referrerPolicy="no-referrer"
            className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="p-2 text-center bg-[#FAF9F6] border-t border-[#1C1C1C]/10">
            <p className="text-[11px] font-serif-title italic text-[#1C1C1C]">🐾 温暖有温度的岁月留痕</p>
          </div>
        </div>
      </div>

      {/* Mood Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#FDFCFB] border border-[#1C1C1C]/10 p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {moodOptions.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMood(m.id)}
              className={`px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                selectedMood === m.id
                  ? 'bg-[#3B6E58] text-white shadow-xs font-semibold'
                  : 'text-[#4A4540] hover:text-[#3B6E58] bg-[#F2F0EB] border border-[#1C1C1C]/10'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 md:w-64">
          <Search className="w-3.5 h-3.5 text-[#8C8476] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="搜索日记正文或标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F2F0EB] border border-[#1C1C1C]/10 text-xs text-[#1C1C1C] placeholder-[#8C8476] pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#1C1C1C]"
          />
        </div>
      </div>

      {/* Diary Timeline Entries */}
      {filteredDiary.length === 0 ? (
        <div className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-12 text-center text-[#8C8476]">
          <p className="text-sm font-serif-title italic">No journal entries found</p>
          <p className="text-xs text-[#8C8476] mt-1 font-light">记录当下的想法与故事，点击“撰写新日记”吧！</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredDiary.map((entry) => {
            return (
              <article
                key={entry.id}
                className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-6 sm:p-8 hover:border-[#1C1C1C]/30 transition-all space-y-4"
              >
                {/* Meta Header - Title, Date & Time on the SAME LINE */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1C1C1C]/10">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl font-serif-title italic font-bold text-[#1C1C1C]">{entry.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#8C8476] font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[#1C1C1C]" />
                      <span>{entry.date}</span>
                    </div>

                    <span className="px-2 py-0.5 text-xs font-medium bg-[#F2F0EB] border border-[#1C1C1C]/10 text-[#1C1C1C]" title={`天气: ${getWeatherLabel(entry.weather)}`}>
                      {getWeatherIcon(entry.weather)}
                    </span>

                    <span className="px-2 py-0.5 text-xs font-medium bg-[#FAF9F6] border border-[#1C1C1C]/10 text-[#1C1C1C]" title={`心情: ${entry.mood}`}>
                      {getMoodEmoji(entry.mood)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {entry.location && (
                      <span className="flex items-center gap-1 text-xs text-[#8C8476] bg-[#F2F0EB] px-2.5 py-0.5 border border-[#1C1C1C]/10">
                        <MapPin className="w-3 h-3 text-[#1C1C1C]" />
                        {entry.location}
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenEditModal(entry)}
                      title="编辑日记"
                      className="p-1 text-[#8C8476] hover:text-[#3B6E58] transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteDiary(entry.id)}
                      title="删除日记"
                      className="p-1 text-[#8C8476] hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <p className="text-sm text-[#4A4540] leading-relaxed whitespace-pre-wrap font-light">
                    {entry.content}
                  </p>
                </div>

                {/* Photo Grid */}
                {entry.photoUrls && entry.photoUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                    {entry.photoUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-4/3 overflow-hidden border border-[#1C1C1C]/10 bg-[#F2F0EB] group"
                      >
                        <img
                          src={url}
                          alt="Diary photo"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 text-[11px] text-[#8C8476] bg-[#F2F0EB] px-2.5 py-0.5 border border-[#1C1C1C]/10"
                      >
                        <Tag className="w-3 h-3 text-[#1C1C1C]" />
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAF9F6] border border-[#1C1C1C] w-full max-w-2xl p-6 sm:p-8 shadow-2xl text-[#1C1C1C] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#1C1C1C]/10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C8476]">Journal Entry</span>
                <h3 className="text-xl font-serif-title italic font-bold">
                  {editingDiaryId ? '编辑日记' : '撰写新日记'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#8C8476] hover:text-[#1C1C1C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDiary} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">标题</label>
                <input
                  type="text"
                  placeholder="给今天的小确幸取个标题..."
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3.5 py-2 text-sm text-[#1C1C1C] placeholder-[#8C8476] focus:outline-none focus:border-[#1C1C1C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">心态心情</label>
                  <select
                    value={entryMood}
                    onChange={(e) => setEntryMood(e.target.value as MoodType)}
                    className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  >
                    <option value="happy">😊 愉悦 Happy</option>
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
                    value={entryWeather}
                    onChange={(e) => setEntryWeather(e.target.value as WeatherType)}
                    className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  >
                    <option value="sunny">☀️ 晴朗 Sunny</option>
                    <option value="cloudy">⛅ 多云 Cloudy</option>
                    <option value="rainy">🌧️ 雨天 Rainy</option>
                    <option value="snowy">❄️ 飘雪 Snowy</option>
                    <option value="windy">🌬️ 大风 Windy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">地点 (选填)</label>
                  <input
                    type="text"
                    placeholder="如: 阳光咖啡馆"
                    value={entryLocation}
                    onChange={(e) => setEntryLocation(e.target.value)}
                    className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">日记正文 *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="记录下今天发生的事、触动心灵的瞬间或对未到来的期待..."
                  value={entryContent}
                  onChange={(e) => setEntryContent(e.target.value)}
                  className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 p-3.5 text-sm text-[#1C1C1C] placeholder-[#8C8476] focus:outline-none focus:border-[#1C1C1C] resize-none leading-relaxed font-serif-title italic"
                />
              </div>

              {/* Photo selection */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">插图相片</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {PRESET_PHOTOS.map((preset, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => {
                        if (!entryPhotos.includes(preset.url)) {
                          setEntryPhotos([...entryPhotos, preset.url]);
                        }
                      }}
                      className="text-xs px-2.5 py-1 bg-[#F2F0EB] hover:bg-[#FDFCFB] border border-[#1C1C1C]/10 text-[#1C1C1C] flex items-center gap-1"
                    >
                      <ImageIcon className="w-3 h-3 text-[#1C1C1C]" />
                      <span>+ {preset.label}</span>
                    </button>
                  ))}
                </div>

                {/* Upload or URL */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="或粘贴图片 URL 地址..."
                    value={customPhotoInput}
                    onChange={(e) => setCustomPhotoInput(e.target.value)}
                    className="flex-1 bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3 py-1.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customPhotoInput.trim()) {
                        setEntryPhotos([...entryPhotos, customPhotoInput.trim()]);
                        setCustomPhotoInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-[#F2F0EB] border border-[#1C1C1C]/10 text-[#1C1C1C] text-xs font-bold"
                  >
                    添加 URL
                  </button>
                  <label className="px-3 py-1.5 bg-[#F2F0EB] border border-[#1C1C1C]/10 text-[#1C1C1C] text-xs font-bold cursor-pointer flex items-center gap-1">
                    <span>上传图片</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Selected Photo Thumbnails */}
                {entryPhotos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {entryPhotos.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 overflow-hidden border border-[#1C1C1C]/20 group"
                      >
                        <img
                          src={url}
                          alt="thumb"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setEntryPhotos(entryPhotos.filter((_, i) => i !== idx))}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-[#1C1C1C] text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">标签 (逗号分割)</label>
                <input
                  type="text"
                  placeholder="如: 咖啡, 阅读, 雨后"
                  value={entryTagsStr}
                  onChange={(e) => setEntryTagsStr(e.target.value)}
                  className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1C1C1C]/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#8C8476] hover:text-[#1C1C1C]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-all shadow-xs"
                >
                  {editingDiaryId ? '保存修改' : '发布日记'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
