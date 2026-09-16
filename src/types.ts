export interface DailyClosingRecord {
  id: string;
  date: string; // YYYY-MM-DD
  approvedAmount: number; // 키오스크 정상 승인 총액
  cancelledAmount: number; // 결제 취소 및 오류 환불액
  netAmount: number; // 순매출 (승인 - 취소)
  actualAmount: number; // 실제 포스/통장 입금액
  diffAmount: number; // 차액 (실제입금 - 순매출)
  orderCount: number; // 결제 건수
  memo: string; // 메모 (예: 카드 재승인 1건)
  createdAt: string;
}

export type ViewMode = 'customer' | 'closing' | 'prd' | 'ai';
