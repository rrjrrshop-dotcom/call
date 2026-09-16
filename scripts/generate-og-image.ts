import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function createOgImage() {
  const width = 1200;
  const height = 630;
  const inputImagePath = path.join(process.cwd(), 'src/assets/images/kiosk_og_banner_1789543741111.jpg');
  const outputDir = path.join(process.cwd(), 'public');
  const outputPath = path.join(outputDir, 'og-image.png');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Process background photo: resize to 1200x630 cover with subtle vignette
  let bgBuffer: Buffer;
  if (fs.existsSync(inputImagePath)) {
    bgBuffer = await sharp(inputImagePath)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .toBuffer();
  } else {
    // Fallback gradient background
    bgBuffer = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 28, g: 25, b: 23, alpha: 1 } // #1c1917
      }
    }).png().toBuffer();
  }

  // 2. High-DPI SVG graphical overlay with Korean typography, brand badge, cards, and UI accents
  const overlaySvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="0.8">
        <stop offset="0%" stop-color="#1c1917" stop-opacity="0.95"/>
        <stop offset="45%" stop-color="#1c1917" stop-opacity="0.88"/>
        <stop offset="85%" stop-color="#292524" stop-opacity="0.75"/>
        <stop offset="100%" stop-color="#451a03" stop-opacity="0.82"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#292524" stop-opacity="0.92"/>
        <stop offset="100%" stop-color="#1c1917" stop-opacity="0.96"/>
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.5"/>
      </filter>
      <filter id="badgeShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.3"/>
      </filter>
    </defs>

    <!-- Gradient Overlay across full canvas -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

    <!-- Top Accent Bar -->
    <rect x="0" y="0" width="${width}" height="6" fill="url(#goldGrad)" />

    <!-- Left Brand & Content Area -->
    <g transform="translate(80, 75)">
      <!-- Store Brand Tag -->
      <g filter="url(#badgeShadow)">
        <rect x="0" y="0" width="168" height="38" rx="10" fill="#d97706" />
        <text x="18" y="24" font-family="'Pretendard', 'Apple SD Gothic Neo', sans-serif" font-weight="bold" font-size="16" fill="#1c1917">
          갤러리예지향
        </text>
        <rect x="180" y="0" width="160" height="38" rx="10" fill="#292524" stroke="#44403c" stroke-width="1.5" />
        <text x="196" y="24" font-family="'Pretendard', 'Menlo', monospace" font-weight="600" font-size="14" fill="#fcd34d">
          kiosk-help-screen
        </text>
      </g>

      <!-- Main Headline -->
      <text x="0" y="115" font-family="'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" font-weight="800" font-size="52" fill="#ffffff" letter-spacing="-1">
        키오스크 결제 안내 &amp;
      </text>
      <text x="0" y="180" font-family="'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" font-weight="800" font-size="52" fill="#fbbf24" letter-spacing="-1">
        일일 마감 정산 보조 도구
      </text>

      <!-- Subtitle Description -->
      <text x="0" y="240" font-family="'Pretendard', 'Apple SD Gothic Neo', sans-serif" font-weight="500" font-size="22" fill="#d6d3d1">
        결제 실수를 줄이는 직관적 고객 화면과
      </text>
      <text x="0" y="275" font-family="'Pretendard', 'Apple SD Gothic Neo', sans-serif" font-weight="500" font-size="22" fill="#d6d3d1">
        10분 만에 끝내는 나홀로 매장 일일 마감 정산표
      </text>

      <!-- Feature Badges -->
      <g transform="translate(0, 335)">
        <!-- Pill 1 -->
        <g>
          <rect x="0" y="0" width="170" height="42" rx="21" fill="#292524" stroke="#78716c" stroke-width="1"/>
          <circle cx="22" cy="21" r="7" fill="#10b981"/>
          <text x="38" y="27" font-family="'Pretendard', sans-serif" font-weight="600" font-size="15" fill="#f5f5f4">
            3단계 결제 안내
          </text>
        </g>

        <!-- Pill 2 -->
        <g transform="translate(182, 0)">
          <rect x="0" y="0" width="180" height="42" rx="21" fill="#292524" stroke="#78716c" stroke-width="1"/>
          <circle cx="22" cy="21" r="7" fill="#f59e0b"/>
          <text x="38" y="27" font-family="'Pretendard', sans-serif" font-weight="600" font-size="15" fill="#f5f5f4">
            오차 자동 계산 마감
          </text>
        </g>

        <!-- Pill 3 -->
        <g transform="translate(374, 0)">
          <rect x="0" y="0" width="168" height="42" rx="21" fill="#292524" stroke="#78716c" stroke-width="1"/>
          <circle cx="22" cy="21" r="7" fill="#38bdf8"/>
          <text x="38" y="27" font-family="'Pretendard', sans-serif" font-weight="600" font-size="15" fill="#f5f5f4">
            A4 1장 PDF 다운로드
          </text>
        </g>
      </g>

      <!-- Bottom Info -->
      <g transform="translate(0, 425)">
        <text x="0" y="20" font-family="'Pretendard', sans-serif" font-weight="500" font-size="15" fill="#a8a29e">
          단일 파일 배포형 • 로컬 암호화 저장 • 모바일 360px 반응형 지원
        </text>
      </g>
    </g>

    <!-- Right Mockup Visual Card Frame -->
    <g transform="translate(730, 80)" filter="url(#shadow)">
      <!-- Main Outer Device/Card Container -->
      <rect x="0" y="0" width="390" height="470" rx="24" fill="url(#cardGrad)" stroke="#44403c" stroke-width="2"/>
      
      <!-- Device Header Bar -->
      <rect x="0" y="0" width="390" height="48" rx="24" fill="#1c1917"/>
      <rect x="0" y="30" width="390" height="18" fill="#1c1917"/>
      <!-- Status dots -->
      <circle cx="32" cy="24" r="6" fill="#ef4444"/>
      <circle cx="50" cy="24" r="6" fill="#f59e0b"/>
      <circle cx="68" cy="24" r="6" fill="#10b981"/>
      <text x="145" y="29" font-family="'Pretendard', monospace" font-size="12" fill="#78716c" font-weight="600">
        kiosk-guide.preview
      </text>

      <!-- Inner Screen Preview -->
      <g transform="translate(20, 62)">
        <!-- Customer Guide Step Box -->
        <rect x="0" y="0" width="350" height="110" rx="14" fill="#1c1917" stroke="#382d20" stroke-width="1.5"/>
        <rect x="16" y="16" width="30" height="30" rx="8" fill="#f59e0b"/>
        <text x="25" y="37" font-family="'Pretendard', sans-serif" font-weight="bold" font-size="16" fill="#1c1917">1</text>
        <text x="56" y="28" font-family="'Pretendard', sans-serif" font-weight="bold" font-size="16" fill="#ffffff">IC카드 끝까지 삽입</text>
        <text x="56" y="46" font-family="'Pretendard', sans-serif" font-size="12" fill="#a8a29e">금색 IC칩이 앞쪽 위를 향하게</text>
        <rect x="16" y="60" width="318" height="34" rx="8" fill="#292524"/>
        <text x="32" y="82" font-family="'Pretendard', sans-serif" font-weight="600" font-size="13" fill="#38bdf8">💡 삼성페이·애플페이는 패드에 태그</text>

        <!-- Closing Stat Preview Box -->
        <g transform="translate(0, 124)">
          <rect x="0" y="0" width="350" height="146" rx="14" fill="#1c1917" stroke="#44403c" stroke-width="1"/>
          <text x="16" y="28" font-family="'Pretendard', sans-serif" font-weight="bold" font-size="15" fill="#f5f5f4">일일 정산 요약</text>
          
          <g transform="translate(16, 42)">
            <rect x="0" y="0" width="150" height="42" rx="8" fill="#292524"/>
            <text x="12" y="18" font-family="'Pretendard', sans-serif" font-size="11" fill="#a8a29e">카드 승인총액</text>
            <text x="12" y="34" font-family="'Pretendard', monospace" font-weight="bold" font-size="14" fill="#ffffff">₩ 1,280,000</text>
          </g>

          <g transform="translate(184, 42)">
            <rect x="0" y="0" width="150" height="42" rx="8" fill="#292524"/>
            <text x="12" y="18" font-family="'Pretendard', sans-serif" font-size="11" fill="#a8a29e">실제 입금총액</text>
            <text x="12" y="34" font-family="'Pretendard', monospace" font-weight="bold" font-size="14" fill="#ffffff">₩ 1,280,000</text>
          </g>

          <!-- Result Tag -->
          <rect x="16" y="94" width="318" height="38" rx="8" fill="#064e3b" stroke="#059669" stroke-width="1"/>
          <circle cx="36" cy="113" r="8" fill="#10b981"/>
          <text x="54" y="118" font-family="'Pretendard', sans-serif" font-weight="bold" font-size="13" fill="#ecfdf5">
            정산 오차: ₩ 0 (정확히 일치 ✔)
          </text>
        </g>

        <!-- PRD Proposal Pill -->
        <g transform="translate(0, 284)">
          <rect x="0" y="0" width="350" height="80" rx="14" fill="#1c1917" stroke="#44403c" stroke-width="1"/>
          <text x="16" y="28" font-family="'Pretendard', sans-serif" font-weight="bold" font-size="14" fill="#fbbf24">
            📄 바이브코딩 PRD 1페이지 제안 카드
          </text>
          <text x="16" y="52" font-family="'Pretendard', sans-serif" font-size="12" fill="#a8a29e">
            수업 과제 6대 항목 포함 • A4 1장 인쇄 규격
          </text>
        </g>
      </g>
    </g>
  </svg>
  `;

  // 3. Composite background + SVG overlay into 1200x630 PNG
  await sharp(bgBuffer)
    .composite([
      {
        input: Buffer.from(overlaySvg),
        top: 0,
        left: 0
      }
    ])
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(outputPath);

  console.log(`OpenGraph image generated successfully at: ${outputPath}`);
  console.log(`Dimensions: ${width}x${height}`);
}

createOgImage().catch((err) => {
  console.error('Failed to generate OpenGraph image:', err);
  process.exit(1);
});
