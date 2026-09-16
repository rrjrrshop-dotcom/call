import React, { useState, useEffect } from 'react';
import { DailyClosingRecord } from '../types';
import { 
  Calculator, 
  Download, 
  Save, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  FileSpreadsheet, 
  RotateCcw,
  Calendar,
  Printer
} from 'lucide-react';

const STORAGE_KEY = 'yeojihyang_kiosk_closing_records';

const SAMPLE_INITIAL_DATA: DailyClosingRecord[] = [
  {
    id: 'sample-1',
    date: '2026-09-15',
    approvedAmount: 940000,
    cancelledAmount: 40000,
    netAmount: 900000,
    actualAmount: 900000,
    diffAmount: 0,
    orderCount: 45,
    memo: '오후 도자기 전시 티켓 취소 1건 정상 재승인',
    createdAt: new Date('2026-09-15T21:00:00').toISOString(),
  },
  {
    id: 'sample-2',
    date: '2026-09-14',
    approvedAmount: 680000,
    cancelledAmount: 0,
    netAmount: 680000,
    actualAmount: 680000,
    diffAmount: 0,
    orderCount: 32,
    memo: '정상 마감 완료',
    createdAt: new Date('2026-09-14T20:30:00').toISOString(),
  },
];

export const ClosingReportView: React.FC = () => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Form State
  const [date, setDate] = useState<string>(todayStr);
  const [approvedAmount, setApprovedAmount] = useState<number | ''>(850000);
  const [cancelledAmount, setCancelledAmount] = useState<number | ''>(30000);
  const [actualAmount, setActualAmount] = useState<number | ''>(820000);
  const [orderCount, setOrderCount] = useState<number | ''>(38);
  const [memo, setMemo] = useState<string>('키오스크 카드 미승인 1건 현장 취소 후 재결제');

  // Stored Records
  const [records, setRecords] = useState<DailyClosingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_INITIAL_DATA;
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [records]);

  // Derived Calculations
  const validApproved = typeof approvedAmount === 'number' ? approvedAmount : 0;
  const validCancelled = typeof cancelledAmount === 'number' ? cancelledAmount : 0;
  const validActual = typeof actualAmount === 'number' ? actualAmount : 0;
  const validOrderCount = typeof orderCount === 'number' ? orderCount : 0;

  const netAmount = validApproved - validCancelled;
  const diffAmount = validActual - netAmount;

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      alert('마감 날짜를 선택해주세요.');
      return;
    }

    const newRecord: DailyClosingRecord = {
      id: Date.now().toString(),
      date,
      approvedAmount: validApproved,
      cancelledAmount: validCancelled,
      netAmount,
      actualAmount: validActual,
      diffAmount,
      orderCount: validOrderCount,
      memo: memo.trim(),
      createdAt: new Date().toISOString(),
    };

    // Replace if date exists, or prepend
    setRecords((prev) => {
      const filtered = prev.filter((r) => r.date !== date);
      return [newRecord, ...filtered];
    });

    showNotification(`${date} 마감 정산표가 성공적으로 저장되었습니다.`);
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('정말 이 마감 기록을 삭제하시겠습니까?')) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      showNotification('마감 기록이 삭제되었습니다.');
    }
  };

  const handleLoadRecord = (record: DailyClosingRecord) => {
    setDate(record.date);
    setApprovedAmount(record.approvedAmount);
    setCancelledAmount(record.cancelledAmount);
    setActualAmount(record.actualAmount);
    setOrderCount(record.orderCount);
    setMemo(record.memo);
    showNotification(`${record.date} 데이터를 불러왔습니다.`);
  };

  const handleExportCSV = () => {
    if (records.length === 0) {
      alert('내보낼 마감 데이터가 없습니다.');
      return;
    }

    const headers = [
      '마감일자',
      '키오스크승인총액',
      '취소및환불액',
      '순매출액',
      '실제입금액',
      '정산차액',
      '주문건수',
      '메모'
    ];

    const rows = records.map((r) => [
      r.date,
      r.approvedAmount,
      r.cancelledAmount,
      r.netAmount,
      r.actualAmount,
      r.diffAmount,
      r.orderCount,
      `"${(r.memo || '').replace(/"/g, '""')}"`
    ]);

    // Prepend UTF-8 BOM so Excel opens Korean text cleanly
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `갤러리예지향_키오스크정산마감표_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('CSV 엑셀 파일이 다운로드되었습니다.');
  };

  const handlePrint = () => {
    try {
      showNotification('인쇄 대화상자가 열렸습니다. 대상에서 "PDF로 저장"을 선택할 수 있습니다.');
      window.print();
    } catch (e) {
      console.error('Print error:', e);
    }
  };

  // Aggregated totals
  const totalNet = records.reduce((acc, cur) => acc + cur.netAmount, 0);
  const totalOrders = records.reduce((acc, cur) => acc + cur.orderCount, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 px-4 py-3 rounded-xl shadow-lg border border-stone-700 flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">
            <span>갤러리예지향 매장 운영</span>
            <span>•</span>
            <span className="text-amber-700">마감 정산 보조 도구</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mt-1 font-serif">
            일일 키오스크 마감 정산표
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            키오스크 마감 영수증과 포스/통장 실입금액을 대조하여 차액과 누락 건을 1초 만에 확인합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="export-csv-button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>CSV 엑셀 다운로드</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>인쇄</span>
          </button>
        </div>
      </div>

      {/* Main Input Form and Realtime Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-600" />
              오늘 마감 데이터 입력
            </h3>
            <span className="text-xs text-stone-400">오프라인 브라우저 자동 저장</span>
          </div>

          <form onSubmit={handleSaveRecord} className="space-y-4">
            {/* Date & Order Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  마감 일자
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  오늘 결제 건수 (건)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="예: 38"
                  value={orderCount}
                  onChange={(e) => setOrderCount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Approved Amount */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ① 키오스크 정상 승인 총액 (원)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                placeholder="키오스크 마감 영수증 승인 합계"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white font-mono"
              />
            </div>

            {/* Cancelled Amount */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ② 결제 취소 / 오류 환불액 (원)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                placeholder="취소 영수증 합계"
                value={cancelledAmount}
                onChange={(e) => setCancelledAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white font-mono"
              />
            </div>

            {/* Actual Amount */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ③ 실제 포스/카드사 입금 예정액 (원)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                placeholder="실제 정산 내역 기준"
                value={actualAmount}
                onChange={(e) => setActualAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white font-mono"
              />
            </div>

            {/* Memo */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                특이사항 및 마감 메모
              </label>
              <input
                type="text"
                placeholder="예: 카드 단말기 오류 1건 현장 취소 후 수기 결제 처리"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              id="save-record-button"
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>오늘 마감표 저장하기</span>
            </button>
          </form>
        </div>

        {/* Right: Realtime Settlement Card */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-stone-900 text-stone-100 p-6 rounded-2xl shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <span className="text-xs font-semibold tracking-wider text-amber-400">정산 계산 결과</span>
              <span className="text-xs font-mono text-stone-400">{date}</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-400">키오스크 승인총액</span>
                <span className="font-mono text-stone-200">+{validApproved.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-400">취소/환불 차감</span>
                <span className="font-mono text-rose-400">-{validCancelled.toLocaleString()}원</span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="text-sm font-semibold text-stone-300">순 매출액 (Net)</span>
                <span className="text-lg font-bold font-mono text-white">
                  {netAmount.toLocaleString()}원
                </span>
              </div>

              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-stone-400">실제 포스/입금액</span>
                <span className="font-mono text-stone-200">{validActual.toLocaleString()}원</span>
              </div>
            </div>

            {/* Difference / Error Banner */}
            <div className={`mt-6 p-4 rounded-xl border ${
              diffAmount === 0 
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200' 
                : diffAmount < 0 
                ? 'bg-rose-950/70 border-rose-500/50 text-rose-200'
                : 'bg-amber-950/70 border-amber-500/50 text-amber-200'
            }`}>
              <div className="flex items-center gap-2 text-xs font-semibold mb-1">
                {diffAmount === 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
                <span>
                  {diffAmount === 0 ? '정산 일치 (정상 마감)' : diffAmount < 0 ? '과소 입금 (차액 발생)' : '과대 입금 (확인 필요)'}
                </span>
              </div>
              <div className="text-xl font-bold font-mono">
                차액: {diffAmount > 0 ? `+${diffAmount.toLocaleString()}` : `${diffAmount.toLocaleString()}`}원
              </div>
              <p className="text-xs mt-1 text-stone-300">
                {diffAmount === 0 
                  ? '키오스크 승인 내역과 실제 입금 예정액이 완벽히 일치합니다.'
                  : '취소 영수증 누락이나 미승인 승인 건이 있는지 다시 한번 점검하세요.'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-800 text-xs text-stone-400 flex items-center justify-between">
            <span>오늘 주문 건수: <strong className="text-stone-200">{validOrderCount}건</strong></span>
            <span>평균 객단가: <strong className="text-stone-200">{validOrderCount > 0 ? Math.round(netAmount / validOrderCount).toLocaleString() : 0}원</strong></span>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              최근 마감 내역 기록
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              총 {records.length}개 일자 저장됨 • 누적 순매출: {totalNet.toLocaleString()}원 ({totalOrders}건)
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>전체 내역 엑셀 파일 내보내기</span>
          </button>
        </div>

        {records.length === 0 ? (
          <div className="text-center py-10 text-stone-400 text-xs">
            저장된 마감 기록이 없습니다. 위에서 오늘 마감 데이터를 입력해주세요.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-stone-700 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">마감일자</th>
                  <th className="py-2.5 px-3 text-right">승인총액</th>
                  <th className="py-2.5 px-3 text-right">취소액</th>
                  <th className="py-2.5 px-3 text-right">순매출</th>
                  <th className="py-2.5 px-3 text-right">정산차액</th>
                  <th className="py-2.5 px-3">건수</th>
                  <th className="py-2.5 px-3">메모</th>
                  <th className="py-2.5 px-3 text-center">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-stone-900 font-mono whitespace-nowrap">
                      {r.date}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-stone-700">
                      {r.approvedAmount.toLocaleString()}원
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-rose-600">
                      {r.cancelledAmount > 0 ? `-${r.cancelledAmount.toLocaleString()}원` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">
                      {r.netAmount.toLocaleString()}원
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        r.diffAmount === 0 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-rose-50 text-rose-700 font-bold'
                      }`}>
                        {r.diffAmount === 0 ? '0원' : `${r.diffAmount > 0 ? '+' : ''}${r.diffAmount.toLocaleString()}원`}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600">
                      {r.orderCount}건
                    </td>
                    <td className="py-2.5 px-3 text-stone-500 max-w-xs truncate" title={r.memo}>
                      {r.memo || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          title="이 데이터 폼에 불러오기"
                          onClick={() => handleLoadRecord(r)}
                          className="p-1 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="삭제"
                          onClick={() => handleDeleteRecord(r.id)}
                          className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
