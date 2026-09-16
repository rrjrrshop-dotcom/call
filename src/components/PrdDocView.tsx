import React, { useState } from 'react';
import { Copy, Check, Printer, FileText, CheckCircle2, Download, Loader2, ExternalLink, HelpCircle } from 'lucide-react';
import { downloadProposalPdf, openPrintableWindow } from '../utils/generateProposalPdf';

interface Props {
  onOpenGuide?: () => void;
}

export const PrdDocView: React.FC<Props> = ({ onOpenGuide }) => {
  const [copied, setCopied] = useState(false);
  const [printStatus, setPrintStatus] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const prdFullText = `[수업 참가 기업 정보]
- 기업명: 갤러리예지향
- 도구 이름: 키오스크 안내 화면
- 폴더·레포명: kiosk-help-screen

[원하는 출력 — 순서대로]
① 한 줄 컨셉 재진술 (12~16자, 명사구)
결제 실수를 줄이는 키오스크 안내 도구 (16자)

② 1주 안에 만들 MVP 기능 3개 (각 1줄)
1. [키오스크 결제 안내 가이드]: IC카드 삽입 및 모바일페이 결제 순서를 직관적으로 보여주어 고객의 결제 오류를 예방하는 3단계 비주얼 화면
2. [일일 결제/정산 마감표]: 키오스크 승인총액과 취소액, 실제 입금액을 입력하면 실매출과 차액(오차)을 즉시 자동 계산해 주는 마감표
3. [정산 내역 저장 및 CSV 다운로드]: 입력한 일별 마감 데이터를 브라우저(localStorage)에 보관하고 엑셀 파일(CSV)로 내려받는 기능

③ ‘v2 이후’로 미루는 기능 2~3개 (각 1줄, 이유 1단어)
1. 주간·월간 매출 추이 비교 및 그래프 시각화 (이유: 우선순위)
2. POS/VAN사 키오스크 결제 API 실시간 자동 연동 (이유: 연동복잡도)
3. 직원별 교대 근무 정산 및 권한 분리 로그인 (이유: 범위초과)

④ 첫 화면 텍스트 와이어프레임 (모바일 360px, 10줄 이내)
[ 갤러리예지향 키오스크 도우미 ]
[안내 모드 | 마감 정산 모드]
--------------------------------
■ [결제 안내] 1.작품선택 > 2.카드삽입 > 3.영수증
■ [자주 묻는 질문] 취소/교환, 주차 등록, 모바일페이
--------------------------------
■ [오늘 마감] 2026-09-16 (화)
■ 키오스크 승인: [    0]원 | 취소: [   0]원
■ 실제 포스/입금: [    0]원 -> [차액: 0원]
--------------------------------
[ 마감표 저장 ]  [ CSV 엑셀 다운로드 ]

⑤ 파일 구조 (HTML 1파일이면 그대로 명시, 분리 필요 시 이유와 함께)
kiosk-help-screen/
├── index.html       # HTML 1파일에 UI, 스타일(Tailwind CSS), 마감 로직(JS)을 내장하여 단독 브라우저 실행 및 Vercel 배포 가능
└── README.md        # 첫 커밋 필수 문서 (프로젝트 개요, PRD, 데이터 규격)
* 이유: 서버나 번들러 없이 파일 하나로 즉시 실행할 수 있어 매장 카운터 태블릿에 바로 띄울 수 있고, Vercel 정적 호스팅에 손쉽게 배포할 수 있기 때문입니다.

⑥ 결정이 필요한 빈칸 3개 (각 1줄 질문, 단순 디자인 취향 말고 진짜 결정)
1. [화면 접근 분리]: 매장 방문 고객이 직접 보는 '결제 안내 가이드'와 사장/직원용 '마감 정산표' 화면을 관리자 PIN 번호로 분리할 것인가, 버튼 하나로 자유롭게 오갈 것인가?
2. [마감 데이터 집계 단위]: 일일 마감 입력 시 키오스크 영수증 하단 '일일 총합계 3가지(승인총액/취소총액/입금액)'만 입력할 것인가, 건별 품목(티켓/도록 등)도 기록할 것인가?
3. [데이터 보관 기기]: 정산 데이터를 매장 카운터 전용 기기 1대(브라우저 캐시)에만 보관할 것인가, 사장님 스마트폰에서도 동기화하여 볼 수 있도록 구글 시트/클라우드로 내보낼 것인가?

[자체 점검]
- MVP 3개가 모두 1주 안에 가능한가: 예 (안내 UI, 브라우저 마감 계산식, localStorage 및 CSV 저장은 외부 의존성 없이 1주 내 개발 가능)
- 입력·출력 데이터 예시가 한 줄 이상 들어 있는가: 예 (입력: 키오스크 승인액 850,000원, 취소 30,000원, 실입금 820,000원 / 출력: 순매출 820,000원, 차액 0원 일치, CSV 파일 생성)
- ‘v2’ 블록이 별도로 정리되어 있는가: 예 (③ 섹션에 3가지 기능과 1단어 이유 명확히 기술 완료)
- 빈칸 질문이 진짜 결정이 필요한 것인가: 예 (화면 보안 정책, 데이터 단위 설계, 멀티 디바이스 동기화 여부 등 아키텍처 핵심 결정)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(prdFullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePrintableHtml = () => {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>갤러리예지향 - 키오스크 안내 화면 한 페이지 제안 카드</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", sans-serif;
      color: #1c1917;
      background: #ffffff;
      line-height: 1.35;
      font-size: 11px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page-container {
      width: 100%;
      max-width: 190mm;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #78350f;
      padding-bottom: 6px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .title {
      font-size: 16px;
      font-weight: 700;
      color: #1c1917;
    }
    .badge {
      font-size: 10px;
      background: #fef3c7;
      color: #92400e;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
    .meta {
      font-size: 9.5px;
      color: #57534e;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-bottom: 6px;
    }
    .card {
      border: 1px solid #d6d3d1;
      border-radius: 6px;
      padding: 6px 8px;
      background: #ffffff;
      break-inside: avoid;
    }
    .card-title {
      font-size: 10.5px;
      font-weight: 700;
      color: #92400e;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .concept-box {
      font-size: 13px;
      font-weight: 700;
      color: #1c1917;
      padding: 6px 8px;
      background: #f5f5f4;
      border-radius: 4px;
      border-left: 3px solid #b45309;
      margin-bottom: 4px;
    }
    .concept-sub {
      font-size: 9.5px;
      color: #78716c;
    }
    ul, ol {
      padding-left: 14px;
      margin: 0;
    }
    li {
      margin-bottom: 3px;
      font-size: 10px;
    }
    li:last-child {
      margin-bottom: 0;
    }
    .reason-tag {
      display: inline-block;
      font-size: 9px;
      background: #e7e5e4;
      color: #44403c;
      padding: 1px 4px;
      border-radius: 3px;
      font-weight: 600;
      margin-left: 4px;
    }
    .wireframe-box {
      font-family: monospace;
      font-size: 8.5px;
      background: #292524;
      color: #fef08a;
      padding: 6px;
      border-radius: 4px;
      white-space: pre-wrap;
      line-height: 1.25;
    }
    .checklist-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px;
      background: #fef3c7;
      border: 1px solid #fde68a;
      border-radius: 6px;
      padding: 6px 8px;
      margin-top: 6px;
    }
    .check-item {
      font-size: 9.5px;
      color: #78350f;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .check-icon {
      color: #059669;
      font-weight: bold;
    }
    @media print {
      body { margin: 0; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <!-- Header -->
    <div class="header">
      <div>
        <span class="badge">바이브코딩 한 페이지 제안 카드</span>
        <h1 class="title" style="margin-top: 2px;">갤러리예지향 • 키오스크 안내 화면 (kiosk-help-screen)</h1>
      </div>
      <div class="meta" style="text-align: right;">
        <div>대상: 갤러리예지향 대표님 및 소수 직원</div>
        <div>출시형태: 정적 HTML 1파일 (Vercel 배포)</div>
      </div>
    </div>

    <!-- Row 1: Concept & v2 Features -->
    <div class="grid-2">
      <div class="card">
        <div class="card-title">① 한 줄 컨셉 재진술 (12~16자, 명사구)</div>
        <div class="concept-box">“결제 실수를 줄이는 키오스크 안내 도구”</div>
        <div class="concept-sub">목적: 결제 오류 사전 방지 및 마감 정산 시간 단축 (16자)</div>
      </div>

      <div class="card">
        <div class="card-title">③ ‘v2 이후’로 미루는 기능 (1단어 이유)</div>
        <ul>
          <li>주·월간 매출 추이 비교 및 그래프 시각화 <span class="reason-tag">우선순위</span></li>
          <li>POS/VAN사 키오스크 API 실시간 자동 연동 <span class="reason-tag">연동복잡도</span></li>
          <li>직원별 교대 근무 정산 및 권한 분리 로그인 <span class="reason-tag">범위초과</span></li>
        </ul>
      </div>
    </div>

    <!-- Row 2: MVP Features -->
    <div class="card" style="margin-bottom: 6px;">
      <div class="card-title">② 1주 안에 만들 MVP 기능 3개 (각 1줄)</div>
      <ul>
        <li><strong>1. [키오스크 결제 안내 가이드]</strong>: IC카드 삽입 방향, 모바일페이 접촉 위치, 영수증 수령을 직관적으로 보여주어 결제 오류를 사전에 예방하는 3단계 비주얼 화면</li>
        <li><strong>2. [일일 결제/정산 간편 마감표]</strong>: 키오스크 승인총액과 취소액, 실제 통장/포스 입금액을 입력하면 순매출과 차액(오차)을 즉시 자동 계산해 주는 마감표</li>
        <li><strong>3. [정산 내역 저장 및 CSV 다운로드]</strong>: 입력한 일별 마감 데이터를 브라우저(localStorage)에 안전 보관하고 엑셀 파일(CSV)로 1초 만에 내려받는 기능</li>
      </ul>
    </div>

    <!-- Row 3: Wireframe & File Structure -->
    <div class="grid-2">
      <div class="card">
        <div class="card-title">④ 첫 화면 텍스트 와이어프레임 (모바일 360px)</div>
        <div class="wireframe-box">[ 갤러리예지향 키오스크 도우미 ]
[안내 모드 | 마감 정산 모드]
--------------------------------
■ [결제 안내] 1.작품선택 > 2.카드삽입 > 3.영수증
■ [자주 묻는 질문] 취소/교환, 주차 등록, 모바일페이
--------------------------------
■ [오늘 마감] 2026-09-16 (화)
■ 키오스크 승인: [    0]원 | 취소: [   0]원
■ 실제 포스/입금: [    0]원 -> [차액: 0원]
--------------------------------
[ 마감표 저장 ]  [ CSV 엑셀 다운로드 ]</div>
      </div>

      <div class="card">
        <div class="card-title">⑤ 파일 구조 (HTML 1파일 배포 형태)</div>
        <div style="font-family: monospace; font-size: 9px; background: #f5f5f4; padding: 4px 6px; border-radius: 4px; margin-bottom: 4px;">
kiosk-help-screen/
├── index.html   # UI, Tailwind CSS, JS 내장
└── README.md    # 기획서, 데이터 규격, 매뉴얼
        </div>
        <div style="font-size: 9.5px; color: #44403c; line-height: 1.3;">
          <strong>선정 이유:</strong> 서버나 번들러 없이 파일 하나로 매장 태블릿에서 즉시 구동되며, Vercel/GitHub Pages에 드래그 한 번으로 10초 만에 무료 배포할 수 있기 때문입니다.
        </div>
      </div>
    </div>

    <!-- Row 4: Decisions -->
    <div class="card" style="margin-bottom: 6px;">
      <div class="card-title">⑥ 결정이 필요한 빈칸 3개 (진짜 결정 질문)</div>
      <ol>
        <li><strong>화면 접근 분리:</strong> 고객용 결제 안내 가이드와 관리자용 마감 정산표를 PIN 비밀번호로 잠글 것인가, 버튼으로 자유롭게 오갈 것인가?</li>
        <li><strong>마감 데이터 단위:</strong> 일일 마감 입력 시 키오스크 영수증 하단 총합계 3개 금액만 넣을 것인가, 판매 상품별 세부 내역도 기록할 것인가?</li>
        <li><strong>데이터 보관 환경:</strong> 매장 카운터 태블릿 1대의 브라우저(localStorage)로 충분한가, 사장님 스마트폰과 구글 시트 연동이 필요한가?</li>
      </ol>
    </div>

    <!-- Footer: Self Check -->
    <div class="checklist-grid">
      <div class="check-item"><span class="check-icon">✔</span><strong>MVP 3개 1주 완성:</strong> 외부 API 없이 순수 프론트엔드로 1주 내 완성</div>
      <div class="check-item"><span class="check-icon">✔</span><strong>입출력 데이터 예시:</strong> 승인 85만, 취소 3만, 실입금 82만, 차액 0원, CSV 출력</div>
      <div class="check-item"><span class="check-icon">✔</span><strong>‘v2’ 블록 분리:</strong> 3가지 기능과 1단어 이유(우선순위, 연동복잡도, 범위초과) 명시</div>
      <div class="check-item"><span class="check-icon">✔</span><strong>진짜 결정 질문:</strong> 화면 보안 정책, 데이터 스키마 단위, 기기 동기화 핵심 결정</div>
    </div>
  </div>

  <div class="no-print" style="margin-top: 16px; padding: 12px; background: #f5f5f4; border: 1px dashed #a8a29e; border-radius: 8px; text-align: center; font-size: 11px; color: #57534e;">
    🖨️ <strong>인쇄 안내:</strong> 인쇄 창에서 대상 프린터 또는 <strong>"PDF로 저장"</strong>을 선택하세요. (용지: A4 / 여백: 기본)
    <div style="margin-top: 8px;">
      <button onclick="window.print()" style="background: #b45309; color: #ffffff; border: 0; padding: 6px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px;">지금 인쇄하기 (Ctrl+P)</button>
    </div>
  </div>
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        try { window.print(); } catch(e) {}
      }, 400);
    });
  </script>
</body>
</html>`;
  };

  const handlePrintPdf = async () => {
    setIsExportingPdf(true);
    setPrintStatus('A4 1장 규격의 제안 카드를 PDF로 렌더링하고 다운로드합니다...');

    try {
      // 1. Direct High-Resolution 2D Vector Canvas + jsPDF Download
      // Bypasses all DOM CSS parser/oklch bugs and iframe restrictions
      await downloadProposalPdf();
      setPrintStatus('✔ A4 1장 제안 카드 PDF 다운로드가 완료되었습니다!');
    } catch (err) {
      console.error('PDF export error:', err);
      // Fallback: standalone HTML download
      handleDownloadHtml();
      setPrintStatus('HTML 파일로 저장되었습니다. 브라우저에서 열어 인쇄할 수 있습니다.');
    } finally {
      setIsExportingPdf(false);
      setTimeout(() => setPrintStatus(null), 6000);
    }
  };

  const handleOpenPrintWindow = () => {
    try {
      openPrintableWindow(generatePrintableHtml());
      setPrintStatus('새 창에서 A4 인쇄 대화상자가 열렸습니다.');
      setTimeout(() => setPrintStatus(null), 5000);
    } catch (e) {
      console.error('Open print window error:', e);
      handlePrintPdf();
    }
  };

  const handleDownloadHtml = () => {
    const html = generatePrintableHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '갤러리예지향_키오스크안내_한페이지제안카드.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast Notification */}
      {printStatus && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 text-stone-100 px-4 py-3 rounded-xl shadow-2xl border border-stone-700 flex items-center gap-3 text-xs sm:text-sm animate-fadeIn max-w-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1">{printStatus}</span>
          <button
            onClick={handleOpenPrintWindow}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
          >
            새 창 인쇄
          </button>
        </div>
      )}

      {/* Top Banner (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">
            <span>수업 참가 기업: 갤러리예지향</span>
            <span>•</span>
            <span className="text-amber-700">바이브코딩 PRD 기획서</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mt-1 font-serif">
            키오스크 안내 화면 기획 & 제안 카드
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            수업 과제 양식에 맞춘 6가지 출력 항목과 자체 점검 결과입니다.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* User Guide Button */}
          {onOpenGuide && (
            <button
              id="prd-user-guide-button"
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer"
              title="초보자를 위한 6단계 이용 순서 안내"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>이용 안내</span>
            </button>
          )}

          {/* Keep Copy Content Button */}
          <button
            id="copy-prd-button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs sm:text-sm font-medium transition-colors shadow-sm cursor-pointer"
            title="텍스트 전체 복사하기"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '복사 완료' : '내용 복사'}</span>
          </button>

          {/* Working Print / PDF Button: Direct A4 1-Page PDF Download */}
          <button
            id="print-pdf-button"
            onClick={handlePrintPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-75 text-stone-950 text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
            title="완성된 제안 카드만 A4 1장으로 PDF 다운로드합니다"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                <span>PDF 생성 중...</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4" />
                <span>인쇄 / PDF</span>
              </>
            )}
          </button>

          {/* Direct Print in New Window */}
          <button
            id="open-print-window-button"
            onClick={handleOpenPrintWindow}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer"
            title="새 탭에서 깨끗한 A4 인쇄 대화상자를 엽니다 (브라우저 인쇄)"
          >
            <ExternalLink className="w-4 h-4 text-amber-700" />
            <span>새 창 인쇄</span>
          </button>

          {/* Standalone HTML Download */}
          <button
            id="download-html-button"
            onClick={handleDownloadHtml}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-medium transition-colors cursor-pointer"
            title="A4 규격 단독 HTML 파일로 보관"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HTML 저장</span>
          </button>
        </div>
      </div>

      {/* The Completed Proposal Card (Target for A4 Print) */}
      <div id="printable-proposal-card" className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
        {/* Card Header for Print */}
        <div className="pb-3 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="inline-block text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mb-1">
              바이브코딩 한 페이지 제안 카드
            </span>
            <h3 className="text-xl font-bold text-stone-900 font-serif">
              갤러리예지향 • 키오스크 안내 화면 (kiosk-help-screen)
            </h3>
          </div>
          <div className="text-xs text-stone-500 text-left sm:text-right">
            <div>대상: 매장 대표님 1인 또는 직원 1~2명</div>
            <div>배포: 정적 HTML 1파일 (Vercel 배포)</div>
          </div>
        </div>

        {/* 1 & 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-page-fit">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div className="text-xs font-bold text-amber-700 mb-1">① 한 줄 컨셉 재진술 (12~16자, 명사구)</div>
            <div className="text-base font-bold text-stone-900 mt-1 p-2.5 bg-white rounded-lg border border-stone-200 border-l-4 border-l-amber-600">
              “결제 실수를 줄이는 키오스크 안내 도구”
            </div>
            <p className="text-xs text-stone-500 mt-1.5">
              공백 제외 16자 명사구 형태로 목적과 도구의 본질을 명확히 전달합니다.
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div className="text-xs font-bold text-amber-700 mb-1">③ ‘v2 이후’로 미루는 기능 (1단어 이유)</div>
            <ul className="mt-1.5 space-y-1.5 text-xs text-stone-800">
              <li className="p-1.5 bg-white rounded border border-stone-200 flex justify-between items-center">
                <span>• 주·월간 매출 추이 비교 및 그래프</span>
                <span className="font-bold text-stone-600 px-1.5 py-0.5 bg-stone-100 rounded text-[11px]">우선순위</span>
              </li>
              <li className="p-1.5 bg-white rounded border border-stone-200 flex justify-between items-center">
                <span>• POS/VAN사 키오스크 API 실시간 연동</span>
                <span className="font-bold text-stone-600 px-1.5 py-0.5 bg-stone-100 rounded text-[11px]">연동복잡도</span>
              </li>
              <li className="p-1.5 bg-white rounded border border-stone-200 flex justify-between items-center">
                <span>• 직원별 교대 근무 정산 및 권한 로그인</span>
                <span className="font-bold text-stone-600 px-1.5 py-0.5 bg-stone-100 rounded text-[11px]">범위초과</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 2: MVP Features */}
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 print-page-fit">
          <div className="text-xs font-bold text-amber-700 mb-2">② 1주 안에 만들 MVP 기능 3개 (각 1줄)</div>
          <div className="space-y-1.5 text-xs text-stone-800">
            <div className="p-2.5 bg-white rounded-lg border border-stone-200">
              <strong className="text-stone-900">1. 키오스크 결제 안내 가이드:</strong> IC카드 삽입 방향, 모바일페이 접촉 위치, 영수증 수령을 직관적으로 안내하여 결제 오류를 사전에 예방하는 3단계 비주얼 화면
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-stone-200">
              <strong className="text-stone-900">2. 일일 결제/정산 간편 마감표:</strong> 키오스크 승인총액과 취소액, 실제 통장/포스 입금액을 입력하면 순매출과 차액(오차)을 즉시 자동 계산하는 마감표
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-stone-200">
              <strong className="text-stone-900">3. 정산 내역 로컬 저장 및 CSV 다운로드:</strong> 일별 마감 데이터를 브라우저(localStorage)에 보관하고 엑셀 파일(CSV)로 단 1초 만에 내려받는 기능
            </div>
          </div>
        </div>

        {/* 4 & 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-page-fit">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div className="text-xs font-bold text-amber-700 mb-1">④ 첫 화면 텍스트 와이어프레임 (모바일 360px, 10줄 이내)</div>
            <pre className="mt-1.5 p-2.5 bg-stone-900 text-amber-300 font-mono text-[11px] rounded-lg overflow-x-auto leading-relaxed">
{`[ 갤러리예지향 키오스크 도우미 ]
[안내 모드 | 마감 정산 모드]
--------------------------------
■ [결제 안내] 1.작품선택 > 2.카드삽입 > 3.영수증
■ [자주 묻는 질문] 취소/교환, 주차 등록, 모바일페이
--------------------------------
■ [오늘 마감] 2026-09-16 (화)
■ 키오스크 승인: [    0]원 | 취소: [   0]원
■ 실제 포스/입금: [    0]원 -> [차액: 0원]
--------------------------------
[ 마감표 저장 ]  [ CSV 엑셀 다운로드 ]`}
            </pre>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-amber-700 mb-1">⑤ 파일 구조 (HTML 1파일 및 분리 이유)</div>
              <pre className="mt-1.5 p-2 bg-white border border-stone-200 font-mono text-[11px] rounded-lg text-stone-800">
{`kiosk-help-screen/
├── index.html   # UI, Tailwind CSS, JS 내장
└── README.md    # 기획서, 데이터 규격, 매뉴얼`}
              </pre>
            </div>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              <strong>선정 이유:</strong> 서버나 번들러 없이 파일 하나로 매장 태블릿에서 즉시 구동 가능하며, Vercel 정적 호스팅에 드래그 한 번으로 10초 만에 무료 배포할 수 있기 때문입니다.
            </p>
          </div>
        </div>

        {/* 6: Decisions needed */}
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 print-page-fit">
          <div className="text-xs font-bold text-amber-700 mb-1.5">⑥ 결정이 필요한 빈칸 3개 (진짜 결정 질문)</div>
          <ol className="space-y-1.5 text-xs text-stone-800 list-decimal list-inside">
            <li className="p-2 bg-white rounded-lg border border-stone-200">
              <strong>화면 접근 분리 여부:</strong> 고객용 '결제 안내 화면'과 사장님용 '마감 정산표'를 관리자 PIN 번호로 분리할 것인가, 상단 탭으로 자유롭게 전환할 것인가?
            </li>
            <li className="p-2 bg-white rounded-lg border border-stone-200">
              <strong>마감 입력 데이터 단위:</strong> 일일 마감 입력 시 키오스크 영수증 하단의 일일 총합계 3개 금액만 넣을 것인가, 상품별/건별 수기 입력도 필요한가?
            </li>
            <li className="p-2 bg-white rounded-lg border border-stone-200">
              <strong>데이터 보관 기기 환경:</strong> 매장 카운터 태블릿 1대의 브라우저(localStorage)로 충분한가, 사장님 스마트폰과 구글 드라이브/시트 동기화가 필요한가?
            </li>
          </ol>
        </div>

        {/* Self-check block */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 print-page-fit">
          <div className="text-xs font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-700" />
            [자체 점검 결과]
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✔</span>
              <span><strong>MVP 3개 1주 완성:</strong> 외부 API 없이 100% 프론트엔드로 구현 가능</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✔</span>
              <span><strong>입출력 데이터 예시:</strong> 승인액, 취소액, 순매출, 차액 예시 명시 완료</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✔</span>
              <span><strong>‘v2’ 블록 분리:</strong> 3가지 기능과 1단어 이유로 별도 정리 완료</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✔</span>
              <span><strong>빈칸 질문 진정성:</strong> 보안/데이터 스키마/동기화에 직결된 핵심 결정 질문</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Quick Action Bar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600 bg-white p-4 rounded-xl border border-stone-200 shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <Printer className="w-4 h-4 text-amber-600 shrink-0" />
          <span>위 제안 카드는 여백과 줄 바꿈이 <strong>A4 용지 1장</strong>에 정확히 맞추어져 있습니다.</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>이용 안내</span>
            </button>
          )}
          <button
            onClick={handlePrintPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>A4 PDF 즉시 다운로드</span>
          </button>
          <button
            onClick={handleOpenPrintWindow}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
            <span>새 창에서 인쇄</span>
          </button>
        </div>
      </div>
    </div>
  );
};
