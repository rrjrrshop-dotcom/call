import React, { useState } from 'react';
import { CreditCard, Smartphone, AlertTriangle, BellRing, CheckCircle2, RefreshCw, HelpCircle } from 'lucide-react';

interface Props {
  onOpenClosing: () => void;
}

export const CustomerGuideView: React.FC<Props> = ({ onOpenClosing }) => {
  const [calledStaff, setCalledStaff] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedTip, setSelectedTip] = useState<string | null>(null);

  const handleCallStaff = () => {
    setCalledStaff(true);
    setTimeout(() => {
      setCalledStaff(false);
    }, 4000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Brand Header */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium mb-3">
              <span>갤러리예지향</span>
              <span className="text-stone-400">•</span>
              <span>키오스크 결제 도우미</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif tracking-tight text-white font-bold">
              결제 전 3초만 확인해주세요
            </h2>
            <p className="text-stone-300 text-sm mt-1">
              카드를 끝까지 넣고 영수증이 출력될 때까지 기다려주시면 결제 오류가 발생하지 않습니다.
            </p>
          </div>

          <button
            id="staff-call-button"
            onClick={handleCallStaff}
            className={`shrink-0 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all shadow-sm ${
              calledStaff
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold active:scale-95'
            }`}
          >
            <BellRing className="w-4 h-4" />
            <span>{calledStaff ? '직원에게 호출 전달됨' : '직원 호출하기'}</span>
          </button>
        </div>

        {calledStaff && (
          <div className="mt-4 p-3 bg-emerald-900/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>카운터 직원이 곧 안내를 도와드리러 방문합니다. 잠시만 기다려 주세요.</span>
          </div>
        )}
      </div>

      {/* 3 Step Visual Guide */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            쉬운 결제 3단계 가이드
          </h3>
          <span className="text-xs text-stone-500">순서대로 따라해보세요</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Step 1 */}
          <div
            onClick={() => setActiveStep(1)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeStep === 1
                ? 'border-amber-600 bg-amber-50/50 shadow-sm ring-1 ring-amber-600'
                : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-900 text-white">STEP 1</span>
              <span className="text-xl">🎟️</span>
            </div>
            <div className="font-semibold text-stone-900 text-sm">작품·티켓 선택</div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              화면에서 관람 티켓 또는 도록/아트상품을 고른 후 [결제하기]를 누릅니다.
            </p>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => setActiveStep(2)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeStep === 2
                ? 'border-amber-600 bg-amber-50/50 shadow-sm ring-1 ring-amber-600'
                : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-600 text-white">STEP 2</span>
              <span className="text-xl">💳</span>
            </div>
            <div className="font-semibold text-stone-900 text-sm">카드 IC칩 삽입</div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              금색 IC칩이 <strong>하늘을 향하도록</strong> 하단 투입구 끝까지 꾹 밀어 넣습니다.
            </p>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => setActiveStep(3)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeStep === 3
                ? 'border-amber-600 bg-amber-50/50 shadow-sm ring-1 ring-amber-600'
                : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-900 text-white">STEP 3</span>
              <span className="text-xl">🧾</span>
            </div>
            <div className="font-semibold text-stone-900 text-sm">영수증 & 카드 회수</div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              '띵동' 승인 완료음이 울린 뒤 카드를 뽑고, 하단 배출구에서 티켓을 수령하세요.
            </p>
          </div>
        </div>
      </div>

      {/* Top Mistakes Prevention (자주 일어나는 실수 방지 3선) */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          가장 자주 발생하는 결제 실수 방지 팁
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div 
            onClick={() => setSelectedTip(selectedTip === 'card' ? null : 'card')}
            className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:border-stone-300 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-100 text-red-700 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-stone-900">카드를 너무 일찍 뽑지 마세요</div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  결제 처리 중 카드를 빼면 중복 결제나 미승인 오류가 발생합니다. '카드를 뽑아주세요' 음성 메시지 이후 제거해주세요.
                </p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setSelectedTip(selectedTip === 'pay' ? null : 'pay')}
            className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:border-stone-300 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-100 text-sky-700 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-stone-900">삼성페이 / 애플페이 태그 위치</div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  스마트폰 뒷면 상단부를 키오스크 우측 결제 패드에 1~2초간 가만히 대고 계시면 바로 인식됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Special Inquiries */}
        <div className="p-3.5 bg-stone-100 rounded-xl flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-stone-500" />
            <span>문화누리카드, 분할결제, 주차 등록은 카운터에서 도와드립니다.</span>
          </div>
          <button 
            onClick={handleCallStaff}
            className="text-amber-800 font-semibold hover:underline shrink-0 ml-2"
          >
            문의하기 &rarr;
          </button>
        </div>
      </div>

      {/* Admin shortcut indicator */}
      <div className="text-center pt-2">
        <button
          onClick={onOpenClosing}
          className="text-xs text-stone-400 hover:text-stone-700 underline transition-colors"
        >
          [매장 관리자용 일일 마감 정산표 열기]
        </button>
      </div>
    </div>
  );
};
