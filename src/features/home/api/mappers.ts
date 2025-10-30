import type { ExpenseRecord, PaymentMethod } from '@/features/home/model/types';

// ===== 카테고리: 한글 ↔ 내부(enum: 'food'|'cafe'|'daily'|'transport'|'housing'|'saving'|'etc')
const KO_TO_INTERNAL: Record<string, ExpenseRecord['category']> = {
  음식: 'food',
  카페: 'cafe',
  쇼핑: 'etc', // 스키마에 없으므로 etc로
  교통: 'transport',
  주거: 'housing',
  문화생활: 'etc', // 스키마에 없으므로 etc로
  기타: 'etc',
};

const INTERNAL_TO_KO: Record<ExpenseRecord['category'], string> = {
  food: '음식',
  cafe: '카페',
  daily: '생활', // 필요 시 화면 표기용으로 사용
  transport: '교통',
  housing: '주거',
  saving: '저축',
  etc: '기타',
};

export const koCategoryToInternal = (ko?: string): ExpenseRecord['category'] =>
  KO_TO_INTERNAL[(ko ?? '').trim()] ?? 'etc';

export const internalCategoryToKo = (v: ExpenseRecord['category']): string =>
  INTERNAL_TO_KO[v] ?? '기타';

// ===== 결제수단: 한글 ↔ 내부(enum: 'card'|'cash'|'account')
export type MethodKo = '카드' | '현금' | '계좌이체';

export const koMethodToInternal = (ko?: string): PaymentMethod | undefined => {
  const v = (ko ?? '').trim().toLowerCase();
  if (['카드', '신용카드', '체크카드', 'card'].includes(v)) return 'card';
  if (['현금', 'cash'].includes(v)) return 'cash';
  if (['계좌', '계좌이체', '이체', 'account', 'bank', 'transfer'].includes(v))
    return 'account';
  return undefined;
};

export const internalMethodToKo = (v?: PaymentMethod): MethodKo | undefined => {
  if (!v) return undefined;
  if (v === 'card') return '카드';
  if (v === 'cash') return '현금';
  if (v === 'account') return '계좌이체';
  return undefined;
};

// ===== 태그
export const stripHash = (t?: string) => (t ? t.replace(/^#/, '') : '');
