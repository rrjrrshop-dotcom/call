import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Bot, 
  Loader2,
  HelpCircle,
  Bug
} from 'lucide-react';

interface Props {
  initialPrompt?: string;
  onClose?: () => void;
}

export const AiAssistant: React.FC<Props> = ({ initialPrompt = '' }) => {
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [lastSubmittedPrompt, setLastSubmittedPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);
  const [isUnavailableError, setIsUnavailableError] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  // Test switch to simulate 503 / UNAVAILABLE
  const [simulate503, setSimulate503] = useState<boolean>(false);

  const executeAiRequest = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    setLoading(true);
    setIsUnavailableError(false);
    setGeneralError(null);
    setResponse(null);
    setLastSubmittedPrompt(trimmed);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          simulateError: simulate503 ? '503' : undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      // Check for 503 or UNAVAILABLE
      if (
        res.status === 503 ||
        data?.error === 'UNAVAILABLE' ||
        data?.status === 503 ||
        (typeof data?.message === 'string' &&
          (data.message.includes('503') || data.message.includes('UNAVAILABLE') || data.message.includes('요청이 많습니다')))
      ) {
        // IMPORTANT: Maintain user input (prompt state is untouched)
        setIsUnavailableError(true);
        return;
      }

      if (!res.ok) {
        setGeneralError(data?.message || '요청 처리 중 문제가 발생했습니다.');
        return;
      }

      setResponse(data.reply || '답변을 생성하지 못했습니다.');
    } catch (err: any) {
      console.error('AI Request failed:', err);
      // If network failure or 503-like message
      const errMsg = String(err?.message || '');
      if (errMsg.includes('503') || errMsg.includes('UNAVAILABLE')) {
        setIsUnavailableError(true);
      } else {
        setGeneralError('네트워크 연결을 확인해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeAiRequest(prompt);
  };

  const handleRetry = () => {
    // Retry with the preserved input
    executeAiRequest(prompt || lastSubmittedPrompt);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 font-serif">
              키오스크 & 마감 AI 도우미
            </h3>
            <p className="text-xs text-stone-500">
              결제 오류 대처법, 고객 안내 문구, 마감 정산 차액 원인을 즉시 상담합니다.
            </p>
          </div>
        </div>

        {/* 503 Test Toggle for verification */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors">
            <input
              type="checkbox"
              id="simulate-503-toggle"
              checked={simulate503}
              onChange={(e) => setSimulate503(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
            />
            <span className="font-medium text-stone-700">503 오류 시뮬레이션 모드</span>
          </label>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>자주 묻는 질문 바로 입력:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            '결제 중 카드를 일찍 뽑아서 오류가 났을 때 대처법',
            '오늘 정산 차액 3만원이 발생했을 때 점검해야 할 항목',
            '삼성페이/애플페이 태그 시 고객에게 건넬 친절한 안내 멘트',
          ].map((quickText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setPrompt(quickText);
                setIsUnavailableError(false);
                setGeneralError(null);
              }}
              className="text-xs bg-stone-50 hover:bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md border border-stone-200 transition-colors text-left"
            >
              {quickText}
            </button>
          ))}
        </div>
      </div>

      {/* Form with Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            id="ai-prompt-input"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="예: 고객이 영수증이 나오기 전에 취소되었다고 합니다. 키오스크에서 승인 여부를 어떻게 확인하나요?"
            className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white resize-none"
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-stone-400">
            오류 발생 시에도 입력하신 내용은 지워지지 않고 유지됩니다.
          </span>

          <button
            type="submit"
            id="ai-submit-button"
            disabled={loading || !prompt.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs sm:text-sm font-medium transition-colors shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI 처리 중...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>AI 질문하기</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* 503 / UNAVAILABLE Error State Handler */}
      {isUnavailableError && (
        <div
          id="ai-503-error-banner"
          className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3 animate-fadeIn"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                현재 AI 요청이 많습니다. 잠시 후 다시 시도해 주세요.
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                입력하신 질문 내용은 안전하게 보관되어 있습니다. 아래 버튼을 눌러 바로 다시 요청할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-7.5">
            <button
              id="ai-retry-button"
              type="button"
              onClick={handleRetry}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>다시 시도하기</span>
            </button>
          </div>
        </div>
      )}

      {/* Other General Error */}
      {generalError && !isUnavailableError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Response Display */}
      {response && !loading && (
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700 pb-2 border-b border-stone-200">
            <span className="flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-amber-700" />
              AI 도우미 답변
            </span>
            <span className="text-[11px] text-stone-400">갤러리예지향 키오스크 모드</span>
          </div>
          <div className="text-sm text-stone-800 whitespace-pre-wrap leading-relaxed">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};
