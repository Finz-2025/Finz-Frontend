import type { ChatItem, ChatMessage } from './types';

const d = (date: string) => ({ type: 'date' as const, id: `d-${date}`, date });

const m = (p: Omit<ChatMessage, 'id'>): ChatItem => ({
  type: 'message',
  id: `${p.date}-${p.time}-${p.sender}-${Math.random().toString(36).slice(2)}`,
  message: { id: Math.random().toString(36).slice(2), ...p },
});

export const MOCK_ITEMS: ChatItem[] = [
  d('2025-10-04'),
  m({
    date: '2025-10-04',
    time: '12:40',
    sender: 'user',
    text: '맛나제과 3,500원 카드',
  }),
  m({
    date: '2025-10-04',
    time: '12:41',
    sender: 'coach',
    text: '기분 전환엔 간식이지! 이번주 예산 안에서 적당히 소비 중이야. 오늘 남은 금액은 5,000원이야.',
  }),
  d('2025-10-03'),
  m({
    date: '2025-10-03',
    time: '18:20',
    sender: 'user',
    text: '지하철 1,400원 교통',
  }),
  m({
    date: '2025-10-03',
    time: '18:21',
    sender: 'coach',
    text: '출퇴근 교통비가 늘었어. 내일은 도보 이동 한번 시도해볼까?',
  }),
  d('2025-10-02'),
  m({
    date: '2025-10-02',
    time: '09:10',
    sender: 'coach',
    text: '이번 주 목표: 카페 지출 1회로 제한하기. 할 수 있어!',
  }),
  m({
    date: '2025-10-02',
    time: '09:12',
    sender: 'user',
    text: '목표 추천 고마워!',
  }),
];
