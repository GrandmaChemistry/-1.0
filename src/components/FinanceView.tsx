import React, { useState } from 'react';
import { Transaction, Budget, TransactionType } from '../types';
import { APP_IMAGES } from '../data/assets';
import {
  Wallet,
  Plus,
  TrendingDown,
  TrendingUp,
  Search,
  Trash2,
  PieChart as PieChartIcon,
  CreditCard,
  Tag,
  AlertCircle,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface FinanceViewProps {
  transactions: Transaction[];
  budget: Budget;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (transactionId: string) => void;
  onUpdateBudget: (budget: Budget) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  餐饮: '#f59e0b', // amber
  交通: '#3b82f6', // blue
  购物: '#ec4899', // pink
  娱乐: '#8b5cf6', // purple
  居住: '#10b981', // emerald
  医疗: '#ef4444', // red
  工资: '#10b981',
  兼职: '#06b6d4',
  其他: '#6b7280',
};

export const FinanceView: React.FC<FinanceViewProps> = ({
  transactions,
  budget,
  onAddTransaction,
  onDeleteTransaction,
  onUpdateBudget,
}) => {
  const [currentMonth, setCurrentMonth] = useState<string>(
    new Date().toISOString().substring(0, 7)
  );

  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Manual Add Transaction
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txType, setTxType] = useState<TransactionType>('expense');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('餐饮');
  const [txDesc, setTxDesc] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txPayment, setTxPayment] = useState('微信');
  const [txTagsStr, setTxTagsStr] = useState('');

  // Budget Edit Modal State
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [newBudgetLimit, setNewBudgetLimit] = useState(budget.monthlyLimit.toString());

  // Calculations for current selected month
  const monthTransactions = transactions.filter((tx) => tx.date.startsWith(currentMonth));

  const totalExpense = monthTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalIncome = monthTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netSurplus = totalIncome - totalExpense;

  const budgetUsagePercent = Math.min(
    100,
    Math.round((totalExpense / (budget.monthlyLimit || 3500)) * 100)
  );

  // Category Expense Aggregation for Pie Chart
  const expenseByCategory: Record<string, number> = {};
  monthTransactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + tx.amount;
    });

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  // Filtered List
  const filteredTransactions = monthTransactions.filter((tx) => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesCategory = filterCategory === '全部' || tx.category === filterCategory;
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || parseFloat(txAmount) <= 0) return;

    const tags = txTagsStr
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    onAddTransaction({
      type: txType,
      amount: parseFloat(txAmount),
      category: txCategory,
      description: txDesc.trim() || txCategory,
      date: txDate,
      paymentMethod: txPayment,
      tags,
    });

    setTxAmount('');
    setTxDesc('');
    setTxTagsStr('');
    setIsModalOpen(false);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newBudgetLimit);
    if (val > 0) {
      onUpdateBudget({ ...budget, monthlyLimit: val });
    }
    setIsBudgetModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#F2F0EB] border border-[#1C1C1C]/10 p-5 sm:p-8">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C8476] mb-1">
            <Wallet className="w-3.5 h-3.5 text-[#1C1C1C]" />
            <span>Financial General Ledger</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-title italic font-bold text-[#1C1C1C]">
            理财账本
          </h2>
          <p className="text-xs text-[#4A4540] mt-1 font-light leading-relaxed">
            记录日常收支，精准把控月度预算，清晰掌握资金流向。积少成多，享受理智生活。
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
            {/* Month Picker */}
            <input
              type="month"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              className="bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3 py-2 text-xs font-semibold text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] min-h-[38px]"
            />

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-colors shrink-0 min-h-[38px] shadow-xs"
            >
              <Plus className="w-4 h-4 text-rose-200" />
              <span>记一笔</span>
            </button>
          </div>
        </div>

        {/* Cute Piggy Bank Card */}
        <div className="relative group overflow-hidden border border-[#1C1C1C]/15 bg-[#FAF9F6] p-1.5 shadow-sm shrink-0 w-full md:w-60">
          <img
            src={APP_IMAGES.financeBanner}
            alt="Cozy Piggy Bank Illustration"
            referrerPolicy="no-referrer"
            className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="p-2 text-center bg-[#FAF9F6] border-t border-[#1C1C1C]/10">
            <p className="text-[11px] font-serif-title italic text-[#1C1C1C]">🐷 细水长流 · 理性从容</p>
          </div>
        </div>
      </div>

      {/* Monthly Financial Overview & Budget Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Expense Card */}
        <div className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-4 sm:p-6 space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-[#8C8476]">
            <span>当月总支出</span>
            <TrendingDown className="w-3.5 h-3.5 text-[#1C1C1C]" />
          </div>
          <p className="text-xl sm:text-3xl font-serif-title italic font-bold text-[#1C1C1C]">¥{totalExpense.toFixed(2)}</p>
          <p className="text-[10px] sm:text-[11px] text-[#8C8476] font-mono">{monthTransactions.filter(t => t.type==='expense').length} 笔消费</p>
        </div>

        {/* Total Income Card */}
        <div className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-4 sm:p-6 space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-[#8C8476]">
            <span>当月总收入</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#1C1C1C]" />
          </div>
          <p className="text-xl sm:text-3xl font-serif-title italic font-bold text-[#1C1C1C]">¥{totalIncome.toFixed(2)}</p>
          <p className="text-[10px] sm:text-[11px] text-[#8C8476] font-mono">{monthTransactions.filter(t => t.type==='income').length} 笔入账</p>
        </div>

        {/* Net Surplus Card */}
        <div className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-4 sm:p-6 space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-[#8C8476]">
            <span>结余净额</span>
            <Wallet className="w-3.5 h-3.5 text-[#1C1C1C]" />
          </div>
          <p className="text-xl sm:text-3xl font-serif-title italic font-bold text-[#1C1C1C]">
            ¥{netSurplus.toFixed(2)}
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#8C8476]">
            {netSurplus >= 0 ? '财务健康' : '已超出收入'}
          </p>
        </div>

        {/* Budget Progress Card */}
        <div className="bg-[#FDFCFB] border border-[#1C1C1C]/10 p-4 sm:p-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C8476]">月度预算</span>
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="text-[#1C1C1C] hover:underline text-[11px] font-bold"
            >
              修改
            </button>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm sm:text-lg font-bold text-[#1C1C1C] font-mono">
              ¥{totalExpense.toFixed(0)}/{budget.monthlyLimit}
            </span>
            <span className="text-xs font-bold font-mono text-[#1C1C1C]">
              {budgetUsagePercent}%
            </span>
          </div>

          <div className="w-full bg-[#F2F0EB] h-1.5 overflow-hidden">
            <div
              className="h-full bg-[#1C1C1C] transition-all duration-500"
              style={{ width: `${budgetUsagePercent}%` }}
            />
          </div>

          {budgetUsagePercent >= 90 && (
            <p className="text-[10px] text-rose-700 font-semibold flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              <span>注意超支风险</span>
            </p>
          )}
        </div>
      </div>

      {/* Category Breakdown Charts & Transaction Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 cols: Expense Pie Chart */}
        <div className="lg:col-span-5 bg-[#FDFCFB] border border-[#1C1C1C]/10 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#1C1C1C] flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-[#1C1C1C]" />
              支出分类占比 (当月)
            </h3>
          </div>

          {pieData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-[#8C8476] font-serif-title italic">
              No expenses recorded this month
            </div>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[entry.name] || '#8C8476'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FAF9F6',
                      borderColor: '#1C1C1C',
                      color: '#1C1C1C',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`¥${val}`, '金额']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-3 pt-2 text-xs border-t border-[#1C1C1C]/10">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5"
                  style={{ backgroundColor: CATEGORY_COLORS[item.name] || '#8C8476' }}
                />
                <span className="text-[#1C1C1C] font-medium">{item.name}</span>
                <span className="text-[#8C8476] font-mono">¥{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 7 cols: Transactions List */}
        <div className="lg:col-span-7 bg-[#FDFCFB] border border-[#1C1C1C]/10 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1C1C1C]/10">
            <div className="flex items-center gap-2">
              <div className="flex bg-[#F2F0EB] p-1 border border-[#1C1C1C]/10 text-xs">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 transition-colors ${
                    filterType === 'all' ? 'bg-[#3B6E58] text-white font-semibold' : 'text-[#8C8476] hover:text-[#1C1C1C]'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setFilterType('expense')}
                  className={`px-3 py-1 transition-colors ${
                    filterType === 'expense'
                      ? 'bg-[#3B6E58] text-white font-semibold'
                      : 'text-[#8C8476] hover:text-[#1C1C1C]'
                  }`}
                >
                  支出
                </button>
                <button
                  onClick={() => setFilterType('income')}
                  className={`px-3 py-1 transition-colors ${
                    filterType === 'income'
                      ? 'bg-[#3B6E58] text-white font-semibold'
                      : 'text-[#8C8476] hover:text-[#1C1C1C]'
                  }`}
                >
                  收入
                </button>
              </div>
            </div>

            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-[#8C8476] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="搜索账单描述..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F2F0EB] border border-[#1C1C1C]/10 pl-8 pr-3 py-1.5 text-xs text-[#1C1C1C] placeholder-[#8C8476] focus:outline-none focus:border-[#1C1C1C]"
              />
            </div>
          </div>

          {/* Transaction items */}
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-[#8C8476] text-xs font-serif-title italic">
              No transactions found for this month
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3.5 bg-[#FAF9F6] border border-[#1C1C1C]/10 hover:border-[#1C1C1C]/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 border border-[#1C1C1C]/20 bg-[#F2F0EB] flex items-center justify-center text-xs font-bold text-[#1C1C1C]">
                      {tx.category.substring(0, 2)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#1C1C1C]">
                          {tx.description}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-[#F2F0EB] text-[#8C8476] border border-[#1C1C1C]/10 uppercase tracking-wider">
                          {tx.paymentMethod}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8C8476] font-mono mt-0.5">{tx.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold font-mono text-[#1C1C1C]">
                      {tx.type === 'expense' ? '-' : '+'}¥{tx.amount.toFixed(2)}
                    </span>

                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      title="删除记录"
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 text-[#8C8476] hover:text-[#1C1C1C] transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Manual Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF9F6] border border-[#1C1C1C] w-full max-w-md p-6 sm:p-8 shadow-2xl text-[#1C1C1C] max-h-[90vh] overflow-y-auto">
            <div className="border-b border-[#1C1C1C]/10 pb-3 mb-6">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C8476]">New Transaction</span>
              <h3 className="text-xl font-serif-title italic font-bold">记录一笔收支</h3>
            </div>
            <form onSubmit={handleSaveTransaction} className="space-y-4">
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
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">金额 (¥) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3 py-2 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] font-mono"
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
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">事由与备注</label>
                <input
                  type="text"
                  placeholder="购买物品、餐饮店名等..."
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">日期</label>
                  <input
                    type="date"
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-2.5 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">支付方式</label>
                  <select
                    value={txPayment}
                    onChange={(e) => setTxPayment(e.target.value)}
                    className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-2.5 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C]"
                  >
                    <option value="微信">微信支付</option>
                    <option value="支付宝">支付宝</option>
                    <option value="银行卡">银行卡</option>
                    <option value="现金">现金</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">标签 (逗号分割)</label>
                <input
                  type="text"
                  placeholder="如: 超市, 打折, 兼职"
                  value={txTagsStr}
                  onChange={(e) => setTxTagsStr(e.target.value)}
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
                  保存账单
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Budget Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF9F6] border border-[#1C1C1C] w-full max-w-sm p-6 sm:p-8 shadow-2xl text-[#1C1C1C] max-h-[90vh] overflow-y-auto">
            <div className="border-b border-[#1C1C1C]/10 pb-3 mb-4">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C8476]">Budget Goal</span>
              <h3 className="text-xl font-serif-title italic font-bold">设定月度预算目标</h3>
            </div>
            <p className="text-xs text-[#4A4540] mb-4 font-light leading-relaxed">
              设定每月总消费限额，帮助您合理节制花销，达成理财规划。
            </p>
            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8476] mb-1">月度预算限额 (¥)</label>
                <input
                  type="number"
                  required
                  value={newBudgetLimit}
                  onChange={(e) => setNewBudgetLimit(e.target.value)}
                  className="w-full bg-[#FDFCFB] border border-[#1C1C1C]/20 px-3.5 py-2.5 text-sm font-bold text-[#1C1C1C] focus:outline-none focus:border-[#1C1C1C] font-mono"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#1C1C1C]/10">
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#8C8476] hover:text-[#1C1C1C]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#3B6E58] hover:bg-[#2E5846] text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-all shadow-xs"
                >
                  保存更新
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
