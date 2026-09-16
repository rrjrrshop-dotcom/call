import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Assistant endpoint
  app.post('/api/ai/ask', async (req, res) => {
    const { prompt, simulateError } = req.body;

    // Simulate 503 / UNAVAILABLE if requested for testing
    if (simulateError === '503' || simulateError === 'UNAVAILABLE') {
      return res.status(503).json({
        error: 'UNAVAILABLE',
        status: 503,
        message: '현재 AI 요청이 많습니다. 잠시 후 다시 시도해 주세요.',
      });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Safe fallback if API key is not yet configured
        return res.json({
          reply: `[갤러리예지향 키오스크 도우미]\n문의하신 내용("${prompt}")에 대한 안내입니다.\n- 카드 결제 시: IC칩이 위로 향하게 끝까지 밀어 넣고, 승인 음성이 나올 때까지 카드를 빼지 마세요.\n- 마감 정산 시: 승인 총액에서 취소액을 뺀 순매출과 통장 입금액이 일치하는지 확인하세요.\n직원 도움이 필요하시면 우측 상단 '직원 호출' 버튼을 눌러주세요.`,
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            '당신은 갤러리예지향 매장의 키오스크 결제 안내 및 일일 마감 정산 보조 AI입니다. 고객의 결제 오류 예방법이나 관리자의 정산 오차 확인 질문에 대해 명확하고 정중하게 한국어로 답변하세요.',
        },
      });

      return res.json({ reply: response.text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      const status = error?.status || error?.statusCode;
      const msg = String(error?.message || '');
      const code = String(error?.code || '');

      // Check 503 or UNAVAILABLE
      if (
        status === 503 ||
        code.includes('503') ||
        code.includes('UNAVAILABLE') ||
        msg.includes('503') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('high demand') ||
        msg.includes('overloaded')
      ) {
        return res.status(503).json({
          error: 'UNAVAILABLE',
          status: 503,
          message: '현재 AI 요청이 많습니다. 잠시 후 다시 시도해 주세요.',
        });
      }

      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: error?.message || 'AI 요청 처리 중 오류가 발생했습니다.',
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      try {
        const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
        const host = (req.headers['x-forwarded-host'] as string) || req.get('host') || '';
        const baseUrl = `${proto}://${host}`;
        let html = fs.readFileSync(indexPath, 'utf-8');
        html = html
          .replace(/content="\/og-image\.png"/g, `content="${baseUrl}/og-image.png"`)
          .replace(/content="\/"/g, `content="${baseUrl}${req.originalUrl}"`)
          .replace(/href="\/"/g, `href="${baseUrl}${req.originalUrl}"`);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(html);
      } catch {
        return res.sendFile(indexPath);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
