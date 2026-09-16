import React, { useEffect } from 'react';
import { 
  X, 
  HelpCircle, 
  Image as ImageIcon, 
  Target, 
  PenTool, 
  Sparkles, 
  Copy, 
  Printer, 
  ArrowRight, 
  CheckCircle2, 
  FileText
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPrd?: () => void;
}

export const UserGuideModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onNavigateToPrd,
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: '이미지 선택',
      shortTitle: '1. 이미지 선택',
      icon: ImageIcon,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      badgeColor: 'bg-blue-600 text-white',
      borderColor: 'border-blue-200',
      desc: '매장 키오스크 결제 화면, 안내판, 또는 참고할 매장 사진을 준비하거나 선택합니다.',
      tip: '손님이 결제할 때 자주 헤매는 카드 삽입구나 영수증 배출구 사진이 있으면 좋습니다.',
    },
    {
      step: 2,
      title: '목적 입력',
      shortTitle: '2. 목적 입력',
      icon: Target,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      badgeColor: 'bg-amber-600 text-white',
      borderColor: 'border-amber-200',
      desc: '“결제 오류 줄이기”, “마감 정산 10분 단축”처럼 만들고자 하는 핵심 목적을 1줄로 적습니다.',
      tip: '어려운 전문 용어 없이, 매장에서 가장 시급하게 해결하고 싶은 점 하나만 적어도 충분합니다.',
    },
    {
      step: 3,
      title: '문체 선택',
      shortTitle: '3. 문체 선택',
      icon: PenTool,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      badgeColor: 'bg-purple-600 text-white',
      borderColor: 'border-purple-200',
      desc: '읽는 대상에 맞춰 어조를 선택합니다. (손님용: 친절 안내형 / 보고용: 직관 요약형)',
      tip: '키오스크 부착용은 큰 글씨의 친절체, 과제 및 기획서 제출용은 정돈된 개조식을 추천합니다.',
    },
    {
      step: 4,
      title: '제안문 만들기',
      shortTitle: '4. 제안문 만들기',
      icon: Sparkles,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      badgeColor: 'bg-amber-600 text-white',
      borderColor: 'border-amber-200',
      desc: '‘제안문 만들기’ 버튼을 누르면 1주 MVP, 컨셉, 와이어프레임이 포함된 제안 카드가 자동 구성됩니다.',
      tip: '수업 과제 양식인 ①한 줄 컨셉부터 ⑥결정 질문까지 6가지 항목이 한 장으로 정리됩니다.',
    },
    {
      step: 5,
      title: '내용 복사',
      shortTitle: '5. 내용 복사',
      icon: Copy,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      badgeColor: 'bg-emerald-600 text-white',
      borderColor: 'border-emerald-200',
      desc: '상단의 [내용 복사] 버튼을 누르면 완성된 텍스트 전체가 클립보드에 1초 만에 복사됩니다.',
      tip: '과제 제출 게시판, 단체 카톡방, 노션 또는 보고서 파일에 Ctrl+V로 바로 붙여넣기 하세요.',
    },
    {
      step: 6,
      title: '인쇄/PDF 저장',
      shortTitle: '6. 인쇄/PDF 저장',
      icon: Printer,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      badgeColor: 'bg-rose-600 text-white',
      borderColor: 'border-rose-200',
      desc: '[인쇄/PDF] 버튼을 누르면 A4 딱 1장에 맞춘 제안 카드 파일이 즉시 다운로드됩니다.',
      tip: '줄 바꿈이나 여백 걱정 없이 깨끗한 A4 규격으로 출력하거나 이메일로 첨부할 수 있습니다.',
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
    >
      <div 
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-stone-900 text-stone-100 flex items-start justify-between gap-3 border-b border-stone-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                  초보자 가이드
                </span>
                <span className="text-xs text-stone-400 font-mono">6단계 순서 안내</span>
              </div>
              <h2 id="guide-modal-title" className="text-lg sm:text-xl font-bold font-serif text-white mt-1">
                키오스크 제안 도구 초보자 이용 안내
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
                처음 오셨나요? 아래 <strong>6단계 순서</strong>대로 따라 하시면 3분 만에 제안서와 인쇄물을 완성할 수 있습니다.
              </p>
            </div>
          </div>

          <button
            id="guide-modal-close-button"
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-stone-800 transition-colors shrink-0 cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Flow Breadcrumb Bar */}
        <div className="bg-amber-50/70 border-b border-amber-200/60 px-4 py-2.5 overflow-x-auto text-[11px] sm:text-xs font-semibold text-amber-950 flex items-center gap-1.5 whitespace-nowrap">
          <span>빠른 순서:</span>
          {steps.map((item, idx) => (
            <React.Fragment key={item.step}>
              <span className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-stone-800 shadow-2xs">
                {item.shortTitle}
              </span>
              {idx < steps.length - 1 && (
                <ArrowRight className="w-3 h-3 text-amber-600 shrink-0 inline" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Scrollable Body: The 6 Steps */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1 bg-stone-50/50">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className={`p-4 rounded-xl bg-white border ${item.borderColor} shadow-2xs hover:shadow-sm transition-shadow flex items-start gap-3 sm:gap-4`}
              >
                {/* Number + Icon */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className={`w-8 h-8 rounded-full ${item.badgeColor} flex items-center justify-center text-xs font-bold shadow-2xs`}>
                    {item.step}
                  </div>
                  <div className={`w-9 h-9 rounded-lg ${item.bgColor} ${item.iconColor} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-stone-900">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-snug">
                    {item.desc}
                  </p>

                  <div className="mt-2 p-2 rounded-lg bg-stone-50 border border-stone-200/70 text-[11px] sm:text-xs text-stone-600 flex items-start gap-1.5">
                    <span className="font-bold text-amber-800 shrink-0">💡 꿀팁:</span>
                    <span>{item.tip}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>모든 기능은 무료이며, 작성 데이터는 내 브라우저에 안전 보관됩니다.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onNavigateToPrd && (
              <button
                id="guide-modal-go-prd-button"
                onClick={() => {
                  onClose();
                  onNavigateToPrd();
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm transition-colors shadow-sm cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>제안 카드 바로가기</span>
              </button>
            )}
            <button
              id="guide-modal-confirm-button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              확인 (닫기)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
