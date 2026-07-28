import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { INSIGHTS_LIST } from './src/data/insights';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy instantiation or safe initialization of GoogleGenAI
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Smart Expense Parser
app.post('/api/ai/smart-parse-expense', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Missing text parameter' });
      return;
    }

    const ai = getGenAI();
    if (!ai) {
      res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
      return;
    }

    const prompt = `你是一个智能记账助手。请从以下用户描述中解析出所有收支项目，转换为结构化的数据。
描述文本："${text}"

类别选项限定为以下之一：
支出类别：'餐饮', '交通', '购物', '娱乐', '居住', '医疗', '其他'
收入类别：'工资', '兼职', '理财', '其他'

支付方式限定为：'微信', '支付宝', '银行卡', '现金', '其他'`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: '解析出的收支记录列表',
          items: {
            type: Type.OBJECT,
            properties: {
              type: {
                type: Type.STRING,
                description: '支出为 expense, 收入为 income',
              },
              amount: {
                type: Type.NUMBER,
                description: '金额数值，必须为正数',
              },
              category: {
                type: Type.STRING,
                description: '分类名称',
              },
              description: {
                type: Type.STRING,
                description: '具体事由摘要',
              },
              paymentMethod: {
                type: Type.STRING,
                description: '支付方式或收款方式',
              },
            },
            required: ['type', 'amount', 'category', 'description', 'paymentMethod'],
          },
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '[]');
    res.json({ items: parsedJson });
  } catch (error: any) {
    console.error('Error in smart-parse-expense:', error);
    res.status(500).json({ error: error.message || 'AI解析失败' });
  }
});

// AI Diary Reflection
app.post('/api/ai/diary-reflection', async (req, res) => {
  try {
    const { content, mood, weather, title } = req.body;
    const ai = getGenAI();
    if (!ai) {
      res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
      return;
    }

    const prompt = `用户写下了一篇生活日记：
标题：${title || '无标题'}
情绪：${mood || '平静'}
天气：${weather || '晴朗'}
正文：${content}

请以温暖、睿智、充满生活情趣的心灵伴侣的口吻，用2-3句简短精炼的话对这篇日记进行点评复盘，给予情绪共鸣或生活启发。不要说废话。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ reflection: response.text?.trim() || '记录生活每一刻，都是对自我的温温柔润。' });
  } catch (error: any) {
    console.error('Error in diary-reflection:', error);
    res.status(500).json({ error: error.message || 'AI小结生成失败' });
  }
});

// AI Task Auto Breakdown
app.post('/api/ai/task-breakdown', async (req, res) => {
  try {
    const { title, description } = req.body;
    const ai = getGenAI();
    if (!ai) {
      res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
      return;
    }

    const prompt = `请将以下目标任务拆解为3-5个具体的子步骤（Subtasks）：
主任务：${title}
描述：${description || '无'}

请直接输出一个JSON数组，包含简洁可执行的子任务标题。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: '子任务描述',
          },
        },
      },
    });

    const subtasks = JSON.parse(response.text || '[]');
    res.json({ subtasks });
  } catch (error: any) {
    console.error('Error in task-breakdown:', error);
    res.status(500).json({ error: error.message || '任务拆解失败' });
  }
});

// AI Daily Insight
const FALLBACK_INSIGHTS = INSIGHTS_LIST;

app.post('/api/ai/daily-insight', async (req, res) => {
  const { pendingTasksCount, completedTasksCount, todaySpent, mood, refreshSeed } = req.body;
  const seedNum = Number(refreshSeed) || Math.floor(Math.random() * 100);

  try {
    const ai = getGenAI();
    if (!ai) {
      const fallback = FALLBACK_INSIGHTS[seedNum % FALLBACK_INSIGHTS.length];
      res.json(fallback);
      return;
    }

    const prompt = `根据用户今日的数据，请随机生成一句全新独特、富有生活情趣的金句语录和一条温情生活建议（每次生成请务必保持新鲜感与变化，避免与固定话术重复）：
- 未完成任务：${pendingTasksCount}项，已完成任务：${completedTasksCount}项
- 今日消费：¥${todaySpent}
- 今日心态：${mood || '充实'}
- 随机种子序号：${seedNum}

请返回JSON格式：{"quote": "金句语录", "suggestion": "温情建议"}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING },
            suggestion: { type: Type.STRING },
          },
          required: ['quote', 'suggestion'],
        },
      },
    });

    const insight = JSON.parse(response.text || '{}');
    if (insight.quote && insight.suggestion) {
      res.json(insight);
    } else {
      res.json(FALLBACK_INSIGHTS[seedNum % FALLBACK_INSIGHTS.length]);
    }
  } catch (error: any) {
    console.error('Error in daily-insight:', error);
    res.json(FALLBACK_INSIGHTS[seedNum % FALLBACK_INSIGHTS.length]);
  }
});

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
