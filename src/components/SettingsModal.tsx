import React, { useRef, useState } from 'react';
import { StorageService } from '../services/storage';
import { Budget } from '../types';
import {
  exportFullArchiveToMarkdown,
  exportAllDiariesToMarkdown,
  exportTodosToMarkdown,
  exportFinanceToMarkdown,
} from '../utils/markdownExport';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  Settings,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BookOpen,
  CheckSquare,
  Wallet,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: Budget;
  onUpdateBudget: (budget: Budget) => void;
  onRefreshData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  budget,
  onUpdateBudget,
  onRefreshData,
}) => {
  if (!isOpen) return null;

  const [monthlyLimitInput, setMonthlyLimitInput] = useState(
    budget.monthlyLimit.toString()
  );
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportData = () => {
    const jsonStr = StorageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifelog_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage({ text: '数据已成功导出为 JSON 备份文件', type: 'success' });
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importAllData(content);
        if (success) {
          onRefreshData();
          setStatusMessage({ text: '备份数据导入成功！数据已更新', type: 'success' });
        } else {
          setStatusMessage({ text: '数据导入失败，请确保 JSON 格式合法', type: 'error' });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('确认恢复为初始演示示例数据吗？当前新增加的数据将被覆盖。')) {
      StorageService.resetToDefault();
      onRefreshData();
      setStatusMessage({ text: '已恢复初始示例数据', type: 'success' });
    }
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(monthlyLimitInput);
    if (val > 0) {
      onUpdateBudget({ ...budget, monthlyLimit: val });
      setStatusMessage({ text: '月度预算限额修改成功', type: 'success' });
    }
  };

  const handleExportMarkdownFull = () => {
    const tasks = StorageService.getTasks();
    const diary = StorageService.getDiary();
    const transactions = StorageService.getTransactions();
    exportFullArchiveToMarkdown({ tasks, diary, transactions, budget });
    setStatusMessage({ text: '已导出全量生活档案为 Markdown (.md)', type: 'success' });
  };

  const handleExportMarkdownDiary = () => {
    const diary = StorageService.getDiary();
    exportAllDiariesToMarkdown(diary);
    setStatusMessage({ text: '已导出生活日记为 Markdown (.md)', type: 'success' });
  };

  const handleExportMarkdownTodos = () => {
    const tasks = StorageService.getTasks();
    exportTodosToMarkdown(tasks);
    setStatusMessage({ text: '已导出待办事项为 Markdown (.md)', type: 'success' });
  };

  const handleExportMarkdownFinance = () => {
    const transactions = StorageService.getTransactions();
    exportFinanceToMarkdown(transactions, budget);
    setStatusMessage({ text: '已导出理财账本为 Markdown (.md)', type: 'success' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FAF9F6] border border-[#1C1C1C] w-full max-w-md p-6 sm:p-8 shadow-2xl text-[#1C1C1C] space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]/10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C8476]">Preferences & Backup</span>
            <h3 className="text-xl font-serif-title italic font-bold text-[#1C1C1C]">
              设置与数据备份
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8C8476] hover:text-[#1C1C1C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div
            className={`p-3 text-xs flex items-center gap-2 border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Budget Setting Section */}
        <form onSubmit={handleSaveBudget} className="space-y-3 pt-1">
          <h4 className="text-xs font-bold text-[#1C1C1C] flex items-center gap-1.5 uppercase tracking-wider">
            <Database className="w-3.5 h-3.5 text-[#1C1C1C]" />
            月度理财预算目标
          </h4>
          <div className="flex gap-2">
            <input
              type="number"
              value={monthlyLimitInput}
              onChange={(e) => setMonthlyLimitInput(e.target.value)}
              className="flex-1 bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3.5 py-2 text-xs font-mono text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#1C1C1C] hover:bg-[#3D3A37] text-white text-[10px] uppercase tracking-wider font-bold transition-colors shrink-0"
            >
              更新预算
            </button>
          </div>
        </form>

        {/* Markdown Export Section */}
        <div className="space-y-3 pt-4 border-t border-[#1C1C1C]/10">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <h4 className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">Markdown 文档导出</h4>
          </div>
          <p className="text-xs text-[#4A4540] font-light leading-relaxed">
            将您的生活随记、任务清单与财务账本导出为格式优美的 Markdown 文档，方便导入 Notion、Obsidian 或个人知识库保存。
          </p>

          <div className="space-y-2">
            <button
              onClick={handleExportMarkdownFull}
              className="w-full px-3.5 py-2.5 bg-[#1C1C1C] hover:bg-[#3D3A37] text-white text-xs font-bold flex items-center justify-between transition-colors shadow-xs"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-300" />
                <span>导出全量生活档案 (.md)</span>
              </div>
              <span className="text-[10px] text-amber-300 font-mono font-normal">包含了日记+待办+账单</span>
            </button>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={handleExportMarkdownDiary}
                className="px-2.5 py-2 bg-[#F2F0EB] hover:bg-[#E8E5DF] border border-[#1C1C1C]/10 text-[11px] font-medium text-[#1C1C1C] flex items-center justify-center gap-1.5 transition-colors"
                title="导出日记汇编"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>日记汇编</span>
              </button>

              <button
                onClick={handleExportMarkdownTodos}
                className="px-2.5 py-2 bg-[#F2F0EB] hover:bg-[#E8E5DF] border border-[#1C1C1C]/10 text-[11px] font-medium text-[#1C1C1C] flex items-center justify-center gap-1.5 transition-colors"
                title="导出待办清单"
              >
                <CheckSquare className="w-3.5 h-3.5 text-sky-600" />
                <span>待办清单</span>
              </button>

              <button
                onClick={handleExportMarkdownFinance}
                className="px-2.5 py-2 bg-[#F2F0EB] hover:bg-[#E8E5DF] border border-[#1C1C1C]/10 text-[11px] font-medium text-[#1C1C1C] flex items-center justify-center gap-1.5 transition-colors"
                title="导出财务账本"
              >
                <Wallet className="w-3.5 h-3.5 text-rose-600" />
                <span>理财账本</span>
              </button>
            </div>
          </div>
        </div>

        {/* Export & Import Data Section */}
        <div className="space-y-3 pt-4 border-t border-[#1C1C1C]/10">
          <h4 className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">本地数据安全与备份</h4>
          <p className="text-xs text-[#4A4540] font-light leading-relaxed">
            您的数据默认安全存储于浏览器本地。您可以随时导出全量 JSON 备份或导入文件恢复。
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExportData}
              className="px-3.5 py-2.5 bg-[#F2F0EB] hover:bg-[#E8E5DF] border border-[#1C1C1C]/10 text-xs font-medium text-[#1C1C1C] flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-[#1C1C1C]" />
              <span>导出 JSON 备份</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2.5 bg-[#F2F0EB] hover:bg-[#E8E5DF] border border-[#1C1C1C]/10 text-xs font-medium text-[#1C1C1C] flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4 text-[#1C1C1C]" />
              <span>导入备份恢复</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>
        </div>

        {/* Reset Demo Data Section */}
        <div className="pt-4 border-t border-[#1C1C1C]/10 space-y-2">
          <button
            onClick={handleResetData}
            className="w-full px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置恢复为示例演示数据</span>
          </button>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#1C1C1C]/10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-[#1C1C1C] hover:bg-[#3D3A37] text-white text-[10px] uppercase tracking-[0.2em] font-bold"
          >
            完成关闭
          </button>
        </div>
      </div>
    </div>
  );
};
