import React, { useState } from 'react';
import { Task, Priority } from '../types';
import { APP_IMAGES } from '../data/assets';
import {
  Plus,
  Calendar,
  Trash2,
  Tag,
  Search,
  CheckSquare,
  Pencil,
} from 'lucide-react';

interface TodoViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
}

export const TodoView: React.FC<TodoViewProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  // Add/Edit Task Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCategory, setTaskCategory] = useState('生活');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskTagsStr, setTaskTagsStr] = useState('');

  const categories = ['全部', '生活', '工作', '学习', '健康', '兴趣'];

  const filteredTasks = tasks.filter((t) => {
    const matchesCategory = selectedCategory === '全部' || t.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all'
        ? true
        : selectedStatus === 'pending'
        ? t.status !== 'completed'
        : t.status === 'completed';
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleOpenCreateTask = () => {
    setEditingTaskId(null);
    setTaskTitle('');
    setTaskDesc('');
    setTaskCategory('生活');
    setTaskPriority('medium');
    setTaskDueDate(new Date().toISOString().split('T')[0]);
    setTaskTagsStr('');
    setIsModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setTaskDesc(task.description || '');
    setTaskCategory(task.category);
    setTaskPriority(task.priority);
    setTaskDueDate(task.dueDate || new Date().toISOString().split('T')[0]);
    setTaskTagsStr(task.tags ? task.tags.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    const tags = taskTagsStr
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingTaskId) {
      const existing = tasks.find((t) => t.id === editingTaskId);
      if (existing) {
        onUpdateTask({
          ...existing,
          title: taskTitle.trim(),
          description: taskDesc.trim(),
          category: taskCategory,
          priority: taskPriority,
          dueDate: taskDueDate,
          tags,
        });
      }
    } else {
      onAddTask({
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        category: taskCategory,
        priority: taskPriority,
        dueDate: taskDueDate,
        status: 'pending',
        tags,
        subtasks: [],
      });
    }

    setEditingTaskId(null);
    setTaskTitle('');
    setTaskDesc('');
    setTaskTagsStr('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#F2F0EB] border border-[#1C1C1C]/10 p-6 sm:p-8">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C8476] mb-1">
            <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
            <span>Task Management Ledger</span>
          </div>
          <h2 className="text-3xl font-serif-title italic font-bold text-[#1C1C1C]">
            待办事项清单
          </h2>
          <p className="text-xs text-[#4A4540] mt-1 font-light leading-relaxed">
            高效管理个人目标，记录并完成每一个日常事项。一步一个脚印，从容拥抱从心生活。
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenCreateTask}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4 text-amber-200" />
              <span>新建待办事项</span>
            </button>
          </div>
        </div>

        {/* Cozy Illustration Card */}
        <div className="relative group overflow-hidden border border-[#1C1C1C]/15 bg-[#FAF9F6] p-1.5 shadow-sm shrink-0 w-full md:w-60">
          <img
            src={APP_IMAGES.todoBanner}
            alt="Cozy Todo Illustration"
            referrerPolicy="no-referrer"
            className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="p-2 text-center bg-[#FAF9F6] border-t border-[#1C1C1C]/10">
            <p className="text-[11px] font-serif-title italic text-[#1C1C1C]">📋 有条不紊 · 轻松高效</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#FDFCFB] border border-[#1C1C1C]/10 p-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#3B6E58] text-white shadow-xs font-semibold'
                  : 'text-[#4A4540] hover:text-[#3B6E58] bg-[#F2F0EB] border border-[#1C1C1C]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter & Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 text-[#8C8476] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="搜索任务..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F2F0EB] border border-[#1C1C1C]/10 text-xs text-[#1C1C1C] placeholder-[#8C8476] pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#1C1C1C]"
            />
          </div>

          <div className="flex bg-[#F2F0EB] p-1 border border-[#1C1C1C]/10 text-xs shrink-0">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 transition-colors ${
                selectedStatus === 'all' ? 'bg-[#3B6E58] text-white font-semibold' : 'text-[#8C8476] hover:text-[#1C1C1C]'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-3 py-1 transition-colors ${
                selectedStatus === 'pending' ? 'bg-[#3B6E58] text-white font-semibold' : 'text-[#8C8476] hover:text-[#1C1C1C]'
              }`}
            >
              进行中
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-3 py-1 transition-colors ${
                selectedStatus === 'completed' ? 'bg-[#3B6E58] text-white font-semibold' : 'text-[#8C8476] hover:text-[#1C1C1C]'
              }`}
            >
              已完成
            </button>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-12 text-center text-[#8C8476]">
          <p className="text-sm font-serif-title italic">No matching tasks found</p>
          <p className="text-xs text-[#8C8476] mt-1 font-light">点击右上角“新建待办事项”开启规划吧！</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`bg-[#FDFCFB] border p-5 sm:p-6 transition-all ${
                  isCompleted
                    ? 'border-[#1C1C1C]/5 opacity-60'
                    : 'border-[#1C1C1C]/10 hover:border-[#1C1C1C]/30'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Task Checkbox & Main Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-1 w-4 h-4 border border-[#1C1C1C] flex items-center justify-center shrink-0 hover:bg-[#1C1C1C] transition-colors"
                    >
                      {isCompleted && <div className="w-2.5 h-2.5 bg-[#1C1C1C]" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-base font-medium ${
                            isCompleted ? 'line-through text-[#8C8476]' : 'text-[#1C1C1C]'
                          }`}
                        >
                          {task.title}
                        </h3>

                        {/* Priority Badge */}
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#F2F0EB] text-[#1C1C1C] border border-[#1C1C1C]/10">
                          {task.priority === 'high'
                            ? 'High'
                            : task.priority === 'medium'
                            ? 'Medium'
                            : 'Low'}
                        </span>

                        {/* Category Badge */}
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#FAF9F6] text-[#8C8476] border border-[#1C1C1C]/10">
                          {task.category}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-[#4A4540] mt-1.5 leading-relaxed font-light">
                          {task.description}
                        </p>
                      )}

                      {/* Tags & Due Date */}
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-[#8C8476]">
                        {task.dueDate && (
                          <div className="flex items-center gap-1 font-mono text-[11px]">
                            <Calendar className="w-3.5 h-3.5 text-[#1C1C1C]" />
                            <span>{task.dueDate}</span>
                          </div>
                        )}

                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 text-[10px] text-[#4A4540] bg-[#F2F0EB] px-2 py-0.5 border border-[#1C1C1C]/10"
                          >
                            <Tag className="w-3 h-3 text-[#1C1C1C]" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEditTask(task)}
                      title="编辑任务"
                      className="p-1.5 text-[#8C8476] hover:text-[#3B6E58] transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      title="删除任务"
                      className="p-1.5 text-[#8C8476] hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAF9F6] border border-[#1C1C1C] w-full max-w-lg p-6 sm:p-8 shadow-2xl text-[#1C1C1C]">
            <div className="border-b border-[#1C1C1C]/10 pb-3 mb-6">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C8476]">Task Ledger</span>
              <h3 className="text-xl font-serif-title italic font-bold">
                {editingTaskId ? '编辑待办事项' : '新建待办事项'}
              </h3>
            </div>
            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">任务名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="需要完成的目标事项..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3 py-2 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">详细描述</label>
                <textarea
                  rows={3}
                  placeholder="添加任务背景、要求或备注..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 p-3 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] resize-none"
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
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
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

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">标签 (逗号分割)</label>
                <input
                  type="text"
                  placeholder="如: 阅读, 计划, 周总结"
                  value={taskTagsStr}
                  onChange={(e) => setTaskTagsStr(e.target.value)}
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
                  {editingTaskId ? '保存修改' : '确定创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
