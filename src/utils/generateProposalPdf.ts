import { jsPDF } from 'jspdf';

/**
 * Renders the Gallery Yeojihyang Proposal Card onto an offscreen canvas
 * using standard 2D Canvas primitives and pure HEX colors.
 * This completely avoids HTML/CSS parser issues (such as Tailwind v4 oklch colors)
 * and iframe sandbox restrictions.
 */
export function renderProposalCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  // High-resolution A4 portrait at ~200 DPI (1654 x 2338)
  canvas.width = 1654;
  canvas.height = 2338;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const fontSans = '-apple-system, BlinkMacSystemFont, "Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
  const fontMono = '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace';

  // Helper functions
  const drawRoundRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number,
    fillColor?: string,
    strokeColor?: string,
    lineWidth: number = 1
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawWrappedText = (
    text: string,
    x: number,
    startY: number,
    maxWidth: number,
    lineHeight: number,
    color: string,
    font: string
  ): number => {
    ctx.fillStyle = color;
    ctx.font = font;
    const words = text.split(' ');
    let line = '';
    let currentY = startY;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = words[i] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  };

  const contentX = 70;
  const contentWidth = 1514;

  // ================= 1. HEADER =================
  // Badge
  drawRoundRect(contentX, 60, 270, 36, 8, '#fef3c7', '#fde68a', 1.5);
  ctx.fillStyle = '#92400e';
  ctx.font = `bold 18px ${fontSans}`;
  ctx.fillText('바이브코딩 한 페이지 제안 카드', contentX + 16, 85);

  // Title
  ctx.fillStyle = '#1c1917';
  ctx.font = `bold 32px ${fontSans}`;
  ctx.fillText('갤러리예지향 • 키오스크 안내 화면 (kiosk-help-screen)', contentX, 135);

  // Header Right Meta
  ctx.fillStyle = '#57534e';
  ctx.font = `19px ${fontSans}`;
  ctx.textAlign = 'right';
  ctx.fillText('대상: 매장 대표님 1인 또는 직원 1~2명', contentX + contentWidth, 90);
  ctx.fillText('출시형태: 정적 HTML 1파일 (Vercel 배포)', contentX + contentWidth, 125);
  ctx.textAlign = 'left';

  // Divider
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(contentX, 160);
  ctx.lineTo(contentX + contentWidth, 160);
  ctx.stroke();

  // ================= 2. ROW 1: Concept (Left) & v2 (Right) =================
  const colGap = 24;
  const colWidth = (contentWidth - colGap) / 2; // ~745px
  const row1Y = 185;
  const row1H = 280;

  // Left Card: Concept
  drawRoundRect(contentX, row1Y, colWidth, row1H, 12, '#ffffff', '#d6d3d1', 1.5);
  drawRoundRect(contentX + 16, row1Y + 16, colWidth - 32, 40, 6, '#fef3c7');
  ctx.fillStyle = '#92400e';
  ctx.font = `bold 20px ${fontSans}`;
  ctx.fillText('① 한 줄 컨셉 재진술 (12~16자, 명사구)', contentX + 28, row1Y + 43);

  // Big Quote Box
  drawRoundRect(contentX + 16, row1Y + 70, colWidth - 32, 90, 8, '#f5f5f4', '#e7e5e4', 1);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(contentX + 16, row1Y + 70, 8, 90); // Left accent bar
  ctx.fillStyle = '#1c1917';
  ctx.font = `bold 27px ${fontSans}`;
  ctx.fillText('“결제 실수를 줄이는 키오스크 안내 도구”', contentX + 42, row1Y + 125);

  ctx.fillStyle = '#78716c';
  ctx.font = `18px ${fontSans}`;
  ctx.fillText('목적: 결제 오류 사전 방지 및 마감 정산 시간 단축 (공백 제외 16자)', contentX + 20, row1Y + 205);
  ctx.fillText('효과: 손님 혼선 최소화, 혼자/소수 인원의 매장 마감 업무 10분 단축', contentX + 20, row1Y + 240);

  // Right Card: v2 Features
  const rightColX = contentX + colWidth + colGap;
  drawRoundRect(rightColX, row1Y, colWidth, row1H, 12, '#ffffff', '#d6d3d1', 1.5);
  drawRoundRect(rightColX + 16, row1Y + 16, colWidth - 32, 40, 6, '#fef3c7');
  ctx.fillStyle = '#92400e';
  ctx.font = `bold 20px ${fontSans}`;
  ctx.fillText('③ ‘v2 이후’로 미루는 기능 (1단어 이유)', rightColX + 28, row1Y + 43);

  const v2Items = [
    { title: '1. 주·월간 매출 추이 비교 및 그래프 시각화', reason: '우선순위' },
    { title: '2. POS/VAN사 키오스크 API 실시간 자동 연동', reason: '연동복잡도' },
    { title: '3. 직원별 교대 근무 정산 및 권한 분리 로그인', reason: '범위초과' },
  ];

  v2Items.forEach((item, idx) => {
    const itemY = row1Y + 70 + idx * 64;
    drawRoundRect(rightColX + 16, itemY, colWidth - 32, 54, 8, '#f8fafc', '#e2e8f0', 1);
    ctx.fillStyle = '#1e293b';
    ctx.font = `bold 19px ${fontSans}`;
    ctx.fillText(item.title, rightColX + 28, itemY + 34);

    // Tag
    drawRoundRect(rightColX + colWidth - 140, itemY + 12, 110, 30, 6, '#e2e8f0');
    ctx.fillStyle = '#475569';
    ctx.font = `bold 16px ${fontSans}`;
    ctx.textAlign = 'center';
    ctx.fillText(item.reason, rightColX + colWidth - 85, itemY + 33);
    ctx.textAlign = 'left';
  });

  // ================= 3. ROW 2: MVP Features (Full Width) =================
  const row2Y = 485;
  const row2H = 345;
  drawRoundRect(contentX, row2Y, contentWidth, row2H, 12, '#ffffff', '#d6d3d1', 1.5);
  drawRoundRect(contentX + 16, row2Y + 16, contentWidth - 32, 40, 6, '#fef3c7');
  ctx.fillStyle = '#92400e';
  ctx.font = `bold 21px ${fontSans}`;
  ctx.fillText('② 1주 안에 만들 MVP 기능 3개 (각 1줄)', contentX + 28, row2Y + 43);

  const mvpList = [
    {
      num: '1',
      name: '[키오스크 결제 안내 가이드]',
      desc: 'IC카드 삽입 방향, 모바일페이 접촉 위치, 영수증 수령을 직관적으로 보여주어 고객의 결제 오류를 사전에 예방하는 3단계 비주얼 화면',
    },
    {
      num: '2',
      name: '[일일 결제/정산 간편 마감표]',
      desc: '키오스크 승인총액과 취소액, 실제 통장/포스 입금액을 입력하면 실매출(승인-취소)과 차액(오차)을 즉시 자동 계산해 주는 마감표',
    },
    {
      num: '3',
      name: '[정산 내역 저장 및 CSV 다운로드]',
      desc: '입력한 일별 마감 데이터를 브라우저(localStorage)에 안전 보관하고 엑셀 파일(CSV)로 1초 만에 내려받는 기능',
    },
  ];

  mvpList.forEach((mvp, idx) => {
    const itemY = row2Y + 70 + idx * 85;
    drawRoundRect(contentX + 16, itemY, contentWidth - 32, 75, 8, '#f8fafc', '#e2e8f0', 1);

    // Number Badge
    drawRoundRect(contentX + 28, itemY + 14, 34, 34, 6, '#b45309');
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 20px ${fontSans}`;
    ctx.textAlign = 'center';
    ctx.fillText(mvp.num, contentX + 45, itemY + 38);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#0f172a';
    ctx.font = `bold 20px ${fontSans}`;
    ctx.fillText(mvp.name, contentX + 75, itemY + 38);

    ctx.fillStyle = '#475569';
    ctx.font = `18px ${fontSans}`;
    ctx.fillText(mvp.desc, contentX + 75, itemY + 63);
  });

  // ================= 4. ROW 3: Wireframe (Left) & File Structure (Right) =================
  const row3Y = 850;
  const row3H = 500;

  // Left: Wireframe
  drawRoundRect(contentX, row3Y, colWidth, row3H, 12, '#ffffff', '#d6d3d1', 1.5);
  drawRoundRect(contentX + 16, row3Y + 16, colWidth - 32, 40, 6, '#fef3c7');
  ctx.fillStyle = '#92400e';
  ctx.font = `bold 20px ${fontSans}`;
  ctx.fillText('④ 첫 화면 텍스트 와이어프레임 (모바일 360px)', contentX + 28, row3Y + 43);

  // Terminal box
  drawRoundRect(contentX + 16, row3Y + 70, colWidth - 32, 410, 8, '#1c1917');
  ctx.fillStyle = '#fef08a';
  ctx.font = `17px ${fontMono}`;
  const wireLines = [
    '[ 갤러리예지향 키오스크 도우미 ]',
    '[안내 모드 | 마감 정산 모드]',
    '--------------------------------------------------',
    '■ [결제 안내] 1.작품선택 > 2.카드삽입 > 3.영수증',
    '■ [자주 묻는 질문] 취소/교환, 주차 등록, 모바일페이',
    '--------------------------------------------------',
    '■ [오늘 마감] 2026-09-16 (화)',
    '■ 키오스크 승인: [    0]원 | 취소: [   0]원',
    '■ 실제 포스/입금: [    0]원 -> [차액: 0원]',
    '--------------------------------------------------',
    '[ 마감표 저장 ]        [ CSV 엑셀 다운로드 ]',
  ];
  wireLines.forEach((wLine, idx) => {
    ctx.fillText(wLine, contentX + 34, row3Y + 105 + idx * 34);
  });

  // Right: File Structure
  drawRoundRect(rightColX, row3Y, colWidth, row3H, 12, '#ffffff', '#d6d3d1', 1.5);
  drawRoundRect(rightColX + 16, row3Y + 16, colWidth - 32, 40, 6, '#fef3c7');
  ctx.fillStyle = '#92400e';
  ctx.font = `bold 20px ${fontSans}`;
  ctx.fillText('⑤ 파일 구조 (HTML 1파일 배포 형태)', rightColX + 28, row3Y + 43);

  // File tree box
  drawRoundRect(rightColX + 16, row3Y + 70, colWidth - 32, 170, 8, '#f1f5f9', '#cbd5e1', 1);
  ctx.fillStyle = '#0f172a';
  ctx.font = `bold 18px ${fontMono}`;
  ctx.fillText('kiosk-help-screen/', rightColX + 34, row3Y + 105);
  ctx.font = `17px ${fontMono}`;
  ctx.fillText('├── index.html   # UI, Tailwind CSS, JS 내장 (Vercel 배포)', rightColX + 34, row3Y + 145);
  ctx.fillText('└── README.md    # 기획서, 데이터 규격, 매뉴얼', rightColX + 34, row3Y + 185);

  // Reason Box
  drawRoundRect(rightColX + 16, row3Y + 260, colWidth - 32, 220, 8, '#f8fafc', '#e2e8f0', 1);
  ctx.fillStyle = '#0f172a';
  ctx.font = `bold 19px ${fontSans}`;
  ctx.fillText('💡 정적 HTML 1파일 선정 이유:', rightColX + 34, row3Y + 295);

  const reasons = [
    '• 서버나 복잡한 설치 없이 매장 태블릿 브라우저에서 즉시 실행',
    '• Vercel 또는 GitHub Pages에 드래그 한 번으로 10초 만에 무료 배포',
    '• 통신 장애 시에도 카운터 로컬(localStorage)에서 100% 정상 작동',
    '• 소수 매장 인원이 관리하기 가장 가볍고 고장 없는 최적의 형태',
  ];
  reasons.forEach((r, idx) => {
    ctx.fillStyle = '#334155';
    ctx.font = `18px ${fontSans}`;
    ctx.fillText(r, rightColX + 34, row3Y + 340 + idx * 36);
  });

  // ================= 5. ROW 4: Decisions (Full Width) =================
  const row4Y = 1370;
  const row4H = 370;
  drawRoundRect(contentX, row4Y, contentWidth, row4H, 12, '#ffffff', '#d6d3d1', 1.5);
  drawRoundRect(contentX + 16, row4Y + 16, contentWidth - 32, 40, 6, '#fef3c7');
  ctx.fillStyle = '#92400e';
  ctx.font = `bold 21px ${fontSans}`;
  ctx.fillText('⑥ 결정이 필요한 빈칸 3개 (진짜 결정 질문)', contentX + 28, row4Y + 43);

  const decisions = [
    {
      q: '1. [화면 접근 분리]: 매장 방문 고객용 ‘결제 안내 가이드’와 직원용 ‘마감 정산표’ 분리 정책',
      desc: '손님이 마감 데이터를 보지 못하도록 관리자 PIN 비밀번호를 설정할 것인가, 단순 탭 버튼으로 자유롭게 오갈 것인가?',
    },
    {
      q: '2. [마감 데이터 집계 단위]: 일일 마감 입력 데이터의 상세도 수준',
      desc: '키오스크 영수증 하단의 총합계 3개 금액(승인/취소/실입금)만 넣을 것인가, 상품별(도록/입장권 등) 건별 세부 내역도 기록할 것인가?',
    },
    {
      q: '3. [데이터 보관 환경]: 멀티 디바이스 및 클라우드 동기화 필요 여부',
      desc: '매장 카운터 전용 기기 1대의 브라우저(localStorage)로 충분한가, 사장님 스마트폰과 실시간 동기화를 위해 구글 시트를 연동할 것인가?',
    },
  ];

  decisions.forEach((dec, idx) => {
    const itemY = row4Y + 70 + idx * 95;
    drawRoundRect(contentX + 16, itemY, contentWidth - 32, 85, 8, '#f8fafc', '#e2e8f0', 1);

    ctx.fillStyle = '#0f172a';
    ctx.font = `bold 20px ${fontSans}`;
    ctx.fillText(dec.q, contentX + 34, itemY + 35);

    ctx.fillStyle = '#475569';
    ctx.font = `18px ${fontSans}`;
    ctx.fillText(dec.desc, contentX + 34, itemY + 65);
  });

  // ================= 6. ROW 5: Self Check (Full Width) =================
  const row5Y = 1760;
  const row5H = 260;
  drawRoundRect(contentX, row5Y, contentWidth, row5H, 12, '#fef3c7', '#fde68a', 2);

  ctx.fillStyle = '#78350f';
  ctx.font = `bold 22px ${fontSans}`;
  ctx.fillText('✔ [자체 점검 결과]', contentX + 28, row5Y + 45);

  const checkColW = (contentWidth - 60) / 2;
  const checks = [
    { title: 'MVP 3개가 모두 1주 안에 가능한가: 예', desc: '외부 API 연동 없이 프론트엔드 계산 및 로컬 저장으로 1주 내 개발 가능' },
    { title: '입력·출력 데이터 예시 명시: 예', desc: '승인액 850,000원, 취소 30,000원, 실입금 820,000원 -> 순매출 820,000원 및 CSV 출력' },
    { title: '‘v2’ 블록 분리 및 이유 명시: 예', desc: '우선순위, 연동복잡도, 범위초과 등 1단어 이유와 함께 3가지 기능 명확히 분리' },
    { title: '진짜 결정이 필요한 빈칸 질문인가: 예', desc: '화면 접근 보안, 데이터 스키마 단위, 기기 동기화 등 아키텍처 핵심 결정 질문' },
  ];

  checks.forEach((chk, idx) => {
    const isCol2 = idx % 2 === 1;
    const isRow2 = idx >= 2;
    const chkX = contentX + 28 + (isCol2 ? checkColW + 20 : 0);
    const chkY = row5Y + 80 + (isRow2 ? 80 : 0);

    drawRoundRect(chkX, chkY, checkColW, 70, 8, '#ffffff', '#fcd34d', 1);

    // Green checkmark icon
    ctx.fillStyle = '#059669';
    ctx.font = `bold 22px ${fontSans}`;
    ctx.fillText('✔', chkX + 16, chkY + 34);

    ctx.fillStyle = '#78350f';
    ctx.font = `bold 19px ${fontSans}`;
    ctx.fillText(chk.title, chkX + 46, chkY + 34);

    ctx.fillStyle = '#92400e';
    ctx.font = `16px ${fontSans}`;
    ctx.fillText(chk.desc, chkX + 46, chkY + 58);
  });

  // Footer branding
  ctx.fillStyle = '#78716c';
  ctx.font = `16px ${fontSans}`;
  ctx.textAlign = 'center';
  ctx.fillText(
    '갤러리예지향 • kiosk-help-screen | 한 페이지 PRD 제안 카드 (A4 규격 단독 파일)',
    contentX + contentWidth / 2,
    2290
  );

  return canvas;
}

/**
 * Generates and downloads the A4 Single Page PDF
 */
export async function downloadProposalPdf(): Promise<void> {
  const canvas = renderProposalCanvas();
  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;

  // Add the high-resolution rendered image onto exact A4 portrait dimensions
  pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
  pdf.save('갤러리예지향_키오스크안내_한페이지제안카드.pdf');
}

/**
 * Opens a clean standalone printable window in a top-level tab
 * (bypasses iframe sandbox print restrictions completely)
 */
export function openPrintableWindow(htmlContent: string): void {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const blobUrl = URL.createObjectURL(blob);

  // Try window.open first
  const newWin = window.open(blobUrl, '_blank');
  if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
    // If popup blocked, create link and click
    const a = document.createElement('a');
    a.href = blobUrl;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
