import { Task, DiaryEntry, Transaction, Budget } from '../types';

export function downloadMarkdownFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const MOOD_MAP: Record<string, { label: string; emoji: string }> = {
  happy: { label: '开心愉快', emoji: '😊' },
  calm: { label: '平静从容', emoji: '🌿' },
  thoughtful: { label: '沉思灵感', emoji: '💡' },
  energetic: { label: '活力满满', emoji: '⚡' },
  tired: { label: '稍微疲惫', emoji: '☕' },
};

const WEATHER_MAP: Record<string, { label: string; emoji: string }> = {
  sunny: { label: '晴朗', emoji: '☀️' },
  cloudy: { label: '多云', emoji: '⛅' },
  rainy: { label: '雨天', emoji: '🌧️' },
  windy: { label: '微风', emoji: '🍃' },
  snowy: { label: '雪', emoji: '❄️' },
};

const PRIORITY_MAP: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

/**
 * 导出单篇日记为 Markdown
 */
export function exportSingleDiaryToMarkdown(diary: DiaryEntry) {
  const moodInfo = MOOD_MAP[diary.mood] || { label: diary.mood, emoji: '📝' };
  const weatherInfo = WEATHER_MAP[diary.weather] || { label: diary.weather, emoji: '🌤️' };
  const tagsStr = diary.tags && diary.tags.length > 0
    ? diary.tags.map(t => `#${t}`).join(' ')
    : '无';

  let md = `# ${diary.title}\n\n`;
  md += `- **记录时间**: ${diary.date}\n`;
  md += `- **心情状态**: ${moodInfo.emoji} ${moodInfo.label}\n`;
  md += `- **天气环境**: ${weatherInfo.emoji} ${weatherInfo.label}\n`;
  md += `- **相关标签**: ${tagsStr}\n\n`;
  md += `---\n\n`;
  md += `## 日记正文\n\n${diary.content}\n\n`;

  if (diary.aiReflection) {
    md += `---\n\n> **🤖 AI 情绪与灵感伴读**:\n> ${diary.aiReflection.replace(/\n/g, '\n> ')}\n\n`;
  }

  if (diary.photoUrls && diary.photoUrls.length > 0) {
    md += `---\n\n### 📷 关联配图\n\n`;
    diary.photoUrls.forEach((url, i) => {
      md += `![配图 ${i + 1}](${url})\n\n`;
    });
  }

  md += `---\n*导出自 Life Ledger 生活随记 · ${new Date().toLocaleDateString()}*\n`;

  const cleanTitle = diary.title.replace(/[\\/:*?"<>|]/g, '_').slice(0, 20);
  const dateShort = diary.date.split(' ')[0] || 'journal';
  downloadMarkdownFile(`日记_${dateShort}_${cleanTitle}.md`, md);
}

/**
 * 导出所有日记为 Markdown 汇编
 */
export function exportAllDiariesToMarkdown(diaries: DiaryEntry[]) {
  const sorted = [...diaries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let md = `# 📖 生活日记汇编 (Life Journals Collection)\n\n`;
  md += `> **导出时间**: ${new Date().toLocaleString('zh-CN')}\n`;
  md += `> **日记总数**: 共 ${diaries.length} 篇\n\n`;
  md += `---\n\n## 📝 目录索引\n\n`;

  sorted.forEach((item, index) => {
    const moodInfo = MOOD_MAP[item.mood] || { emoji: '📝' };
    md += `${index + 1}. [${item.date.split(' ')[0]}] ${moodInfo.emoji} ${item.title}\n`;
  });

  md += `\n---\n\n## 📖 正文内容\n\n`;

  sorted.forEach((item, index) => {
    const moodInfo = MOOD_MAP[item.mood] || { label: item.mood, emoji: '📝' };
    const weatherInfo = WEATHER_MAP[item.weather] || { label: item.weather, emoji: '🌤️' };
    const tagsStr = item.tags && item.tags.length > 0 ? item.tags.map(t => `#${t}`).join(' ') : '无';

    md += `### ${index + 1}. ${item.title}\n\n`;
    md += `- **时间**: ${item.date} | **心情**: ${moodInfo.emoji} ${moodInfo.label} | **天气**: ${weatherInfo.emoji} ${weatherInfo.label}\n`;
    md += `- **标签**: ${tagsStr}\n\n`;
    md += `${item.content}\n\n`;

    if (item.aiReflection) {
      md += `> **🤖 AI 伴读**: ${item.aiReflection}\n\n`;
    }

    md += `---\n\n`;
  });

  md += `*导出自 Life Ledger 生活随记*\n`;
  const dateStr = new Date().toISOString().split('T')[0];
  downloadMarkdownFile(`Life_Journals_${dateStr}.md`, md);
}

/**
 * 导出待办事项为 Markdown
 */
export function exportTodosToMarkdown(tasks: Task[]) {
  const pending = tasks.filter(t => t.status === 'pending');
  const completed = tasks.filter(t => t.status === 'completed');
  const completionRate = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;

  let md = `# 📋 待办事项清单 (Tasks & Goal Ledger)\n\n`;
  md += `> **导出时间**: ${new Date().toLocaleString('zh-CN')}\n`;
  md += `> **总体进度**: 已完成 ${completed.length}/${tasks.length} 项 (${completionRate}%)\n\n`;
  md += `---\n\n`;

  md += `## ⏳ 进行中事项 (${pending.length})\n\n`;
  if (pending.length === 0) {
    md += `*暂无待完成事项，太棒了！*\n\n`;
  } else {
    pending.forEach(t => {
      const priorityStr = PRIORITY_MAP[t.priority] || t.priority;
      md += `- [ ] **${t.title}** \`[优先级: ${priorityStr}]\` \`[分类: ${t.category}]\`\n`;
      if (t.dueDate) md += `  - 📅 截止日期: ${t.dueDate}\n`;
      if (t.description) md += `  - 📝 描述: ${t.description}\n`;
      if (t.tags && t.tags.length > 0) md += `  - 🏷️ 标签: ${t.tags.map(tag => `#${tag}`).join(' ')}\n`;
      if (t.subtasks && t.subtasks.length > 0) {
        md += `  - **子任务**:\n`;
        t.subtasks.forEach(st => {
          md += `    - [${st.completed ? 'x' : ' '}] ${st.title}\n`;
        });
      }
      md += `\n`;
    });
  }

  md += `## ✅ 已完成事项 (${completed.length})\n\n`;
  if (completed.length === 0) {
    md += `*暂无已完成记录*\n\n`;
  } else {
    completed.forEach(t => {
      md += `- [x] **${t.title}** \`[分类: ${t.category}]\`${t.completedAt ? ` *(完成于 ${t.completedAt})*` : ''}\n`;
      if (t.description) md += `  - 📝 ${t.description}\n`;
    });
  }

  md += `\n---\n*导出自 Life Ledger 生活随记*\n`;
  const dateStr = new Date().toISOString().split('T')[0];
  downloadMarkdownFile(`Tasks_Ledger_${dateStr}.md`, md);
}

/**
 * 导出财务账本为 Markdown
 */
export function exportFinanceToMarkdown(transactions: Transaction[], budget: Budget, currentMonth?: string) {
  const filtered = currentMonth
    ? transactions.filter(t => t.date.startsWith(currentMonth))
    : transactions;

  const totalExpense = filtered
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalIncome = filtered
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpense;

  let md = `# 💰 财务收支账本 (Financial Ledger)\n\n`;
  md += `> **导出时间**: ${new Date().toLocaleString('zh-CN')}\n`;
  if (currentMonth) {
    md += `> **筛选月份**: ${currentMonth}\n`;
  }
  md += `> **月度预算限额**: ¥${budget.monthlyLimit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}\n\n`;
  md += `---\n\n`;

  md += `## 📊 收支汇总\n\n`;
  md += `| 汇总指标 | 金额 |状态 |\n`;
  md += `| --- | --- | --- |\n`;
  md += `| **总支出** | -¥${totalExpense.toFixed(2)} | ${totalExpense > budget.monthlyLimit ? '⚠️ 超出预算' : '🟢 预算内'} |\n`;
  md += `| **总收入** | +¥${totalIncome.toFixed(2)} | 📈 资金流入 |\n`;
  md += `| **净结余** | ${netBalance >= 0 ? '+' : ''}¥${netBalance.toFixed(2)} | ${netBalance >= 0 ? '盈余' : '赤字'} |\n\n`;

  md += `---\n\n## 📝 收支明细列表 (${filtered.length} 笔)\n\n`;
  md += `| 日期 | 类型 | 分类 | 摘要/说明 | 金额 | 账户方式 |\n`;
  md += `| --- | --- | --- | --- | --- | --- |\n`;

  const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  sorted.forEach(t => {
    const typeLabel = t.type === 'expense' ? '🔴 支出' : '🟢 收入';
    const sign = t.type === 'expense' ? '-' : '+';
    md += `| ${t.date} | ${typeLabel} | ${t.category} | ${t.description || '-'} | ${sign}¥${t.amount.toFixed(2)} | ${t.paymentMethod || '-'} |\n`;
  });

  md += `\n---\n*导出自 Life Ledger 生活随记*\n`;
  const dateStr = currentMonth || new Date().toISOString().split('T')[0];
  downloadMarkdownFile(`Finance_Ledger_${dateStr}.md`, md);
}

/**
 * 导出全量生活档案为综合 Markdown 文档
 */
export function exportFullArchiveToMarkdown(data: {
  tasks: Task[];
  diary: DiaryEntry[];
  transactions: Transaction[];
  budget: Budget;
}) {
  const { tasks, diary, transactions, budget } = data;
  const dateStr = new Date().toISOString().split('T')[0];

  let md = `# 📔 Life Ledger 全量生活档案 (Master Archive)\n\n`;
  md += `> **生成时间**: ${new Date().toLocaleString('zh-CN')}\n`;
  md += `> **数据概览**: ${diary.length} 篇日记 | ${tasks.length} 项待办 | ${transactions.length} 笔账单\n\n`;
  md += `---\n\n`;

  md += `## 🌟 总体数据统计\n\n`;
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const taskRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0);

  md += `- **日记积累**: ${diary.length} 篇手记\n`;
  md += `- **任务达成**: ${completedTasks.length}/${tasks.length} 项 (${taskRate}% 完成率)\n`;
  md += `- **月度预算**: ¥${budget.monthlyLimit.toFixed(2)}\n`;
  md += `- **累计支出**: ¥${totalExpense.toFixed(2)}\n`;
  md += `- **累计收入**: ¥${totalIncome.toFixed(2)}\n\n`;

  md += `---\n\n## 📖 第一部分：生活日记 (${diary.length} 篇)\n\n`;
  diary.forEach((d, i) => {
    const moodInfo = MOOD_MAP[d.mood] || { emoji: '📝', label: d.mood };
    md += `### ${i + 1}. ${d.title} (${d.date})\n\n`;
    md += `*心情*: ${moodInfo.emoji} ${moodInfo.label} | *标签*: ${(d.tags || []).join(', ')}\n\n`;
    md += `${d.content}\n\n`;
    if (d.aiReflection) md += `> **AI 伴读**: ${d.aiReflection}\n\n`;
  });

  md += `---\n\n## 📋 第二部分：待办事项 (${tasks.length} 项)\n\n`;
  tasks.forEach(t => {
    const mark = t.status === 'completed' ? 'x' : ' ';
    md += `- [${mark}] **${t.title}** (分类: ${t.category}${t.dueDate ? ` | 截止: ${t.dueDate}` : ''})\n`;
    if (t.description) md += `  - ${t.description}\n`;
  });

  md += `\n---\n\n## 💰 第三部分：财务收支记录 (${transactions.length} 笔)\n\n`;
  md += `| 日期 | 类型 | 分类 | 详情 | 金额 |\n`;
  md += `| --- | --- | --- | --- | --- |\n`;
  transactions.forEach(t => {
    const sign = t.type === 'expense' ? '-' : '+';
    md += `| ${t.date} | ${t.type === 'expense' ? '支出' : '收入'} | ${t.category} | ${t.description || '-'} | ${sign}¥${t.amount.toFixed(2)} |\n`;
  });

  md += `\n---\n*Life Ledger 生活随记 全量备份文档 · ${dateStr}*\n`;

  downloadMarkdownFile(`Life_Ledger_Master_Archive_${dateStr}.md`, md);
}
