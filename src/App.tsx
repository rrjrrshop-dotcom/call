import React, { useState } from 'react';
import { ViewMode } from './types';
import { CustomerGuideView } from './components/CustomerGuideView';
import { ClosingReportView } from './components/ClosingReportView';
import { PrdDocView } from './components/PrdDocView';
import { AiAssistant } from './components/AiAssistant';
import { UserGuideModal } from './components/UserGuideModal';
import { 
  CreditCard, 
  Calculator, 
  FileText, 
  Smartphone, 
  Monitor, 
  Store,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewMode>('customer');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans">
      {/* Top Global Bar */}
      <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold font-serif tracking-tight text-white">
                  갤러리예지향
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-amber-300 font-mono font-medium">
                  kiosk-help-screen
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                결제 실수를 줄이는 키오스크 안내 및 일일 마감 보조 도구
              </p>
            </div>
          </div>

          {/* Action Buttons: Guide + Device Frame Toggle */}
          <div className="flex items-center gap-2">
            {/* '이용 안내' Button */}
            <button
              id="global-guide-button"
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer shadow-sm active:scale-95"
              title="초보자 이용 안내 및 6단계 순서 보기"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>이용 안내</span>
            </button>

            <button
              id="mobile-preview-toggle"
              onClick={() => setIsMobileFrame(!isMobileFrame)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isMobileFrame 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
              title="모바일 360px 프레임으로 미리보기"
            >
              {isMobileFrame ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isMobileFrame ? '모바일(360px) 해제' : '모바일(360px) 보기'}</span>
              <span className="sm:hidden">{isMobileFrame ? '360px ON' : '360px OFF'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-2 border-t border-stone-800/80 overflow-x-auto py-1">
          <button
            id="tab-customer-guide"
            onClick={() => setActiveTab('customer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'customer'
                ? 'bg-white text-stone-900 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span>고객 결제 안내 화면</span>
          </button>

          <button
            id="tab-closing-report"
            onClick={() => setActiveTab('closing')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'closing'
                ? 'bg-white text-stone-900 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Calculator className="w-4 h-4 text-amber-600" />
            <span>일일 마감 정산표</span>
          </button>

          <button
            id="tab-prd-doc"
            onClick={() => setActiveTab('prd')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'prd'
                ? 'bg-white text-stone-900 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>수업 PRD 기획안 (①~⑥)</span>
          </button>

          <button
            id="tab-ai-assistant"
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-white text-stone-900 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI 도우미</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-6 px-4 sm:px-6">
        {isMobileFrame ? (
          <div className="flex flex-col items-center justify-center">
            <div className="text-xs text-stone-500 font-mono mb-2 flex items-center gap-2">
              <span>📱 모바일 360px 뷰포트 시뮬레이션</span>
              <span>•</span>
              <span>키오스크 거치대 및 스마트폰 환경</span>
            </div>
            <div className="w-[360px] min-h-[640px] bg-stone-50 border-4 border-stone-800 rounded-[28px] shadow-2xl p-4 overflow-y-auto">
              {activeTab === 'customer' && (
                <CustomerGuideView onOpenClosing={() => setActiveTab('closing')} />
              )}
              {activeTab === 'closing' && <ClosingReportView />}
              {activeTab === 'prd' && <PrdDocView onOpenGuide={() => setIsGuideOpen(true)} />}
              {activeTab === 'ai' && <AiAssistant />}
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {activeTab === 'customer' && (
              <CustomerGuideView onOpenClosing={() => setActiveTab('closing')} />
            )}
            {activeTab === 'closing' && <ClosingReportView />}
            {activeTab === 'prd' && <PrdDocView onOpenGuide={() => setIsGuideOpen(true)} />}
            {activeTab === 'ai' && <AiAssistant />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>갤러리예지향 • 키오스크 결제 안내 및 마감 보조 도구 (kiosk-help-screen)</span>
          <span className="text-stone-400">정적 단일 파일 배포형 • localStorage 기반 로컬 암호화 저장</span>
        </div>
      </footer>

      {/* Beginner User Guide Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onNavigateToPrd={() => setActiveTab('prd')}
      />
    </div>
  );
}
