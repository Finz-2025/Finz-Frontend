import { create } from 'zustand';
import type {
  ChatItem,
  SearchHit,
  CalendarHitMap,
  ChatMessage,
} from '../model/types';
import { MOCK_ITEMS } from '../model/mockChats';

const makeDateHeader = (date: string): ChatItem => ({
  type: 'date',
  id: `d-${date}`,
  date,
});
const makeMsg = (p: Omit<ChatMessage, 'id'>): ChatItem => ({
  type: 'message',
  id: `${p.date}-${p.time}-${p.sender}-${Math.random().toString(36).slice(2)}`,
  message: { id: Math.random().toString(36).slice(2), ...p },
});
const ts = (date: string, time: string) =>
  new Date(`${date}T${time}:00`).getTime();

// 오래된→최신(아래)으로 정규화
function normalizeAsc(items: ChatItem[]): ChatItem[] {
  const byDate = new Map<string, ChatMessage[]>();
  for (const it of items) {
    if (it.type === 'message') {
      const d = it.message.date;
      if (!byDate.has(d)) byDate.set(d, []);
      byDate.get(d)!.push(it.message);
    } else {
      if (!byDate.has(it.date)) byDate.set(it.date, []);
    }
  }
  // 날짜 오름차순, 같은 날짜 안에서는 시간 오름차순
  const dates = Array.from(byDate.keys()).sort((a, b) => a.localeCompare(b));
  const out: ChatItem[] = [];
  for (const d of dates) {
    out.push(makeDateHeader(d));
    const ms = (byDate.get(d) || []).sort(
      (a, b) => ts(a.date, a.time) - ts(b.date, b.time),
    );
    for (const m of ms) out.push(makeMsg({ ...m }));
  }
  return out;
}

type State = {
  items: ChatItem[];
  query: string;
  hits: SearchHit[];
  hitIndex: number; // 현재 선택된 검색 결과 인덱스
  calendarHits: CalendarHitMap;
  isActionsOpen: boolean;
};

type Actions = {
  setQuery(q: string): void;
  setHits(h: SearchHit[], byDateCount: CalendarHitMap): void;
  nextHit(): void;
  prevHit(): void;
  jumpToHit(i: number): void;
  toggleActions(open?: boolean): void;

  // 사용자가 보낸 메시지/코치 응답을 리스트에 반영
  addMessage(
    sender: 'user' | 'coach',
    text: string,
    date: string,
    time: string,
  ): void;
};

export const useCoachStore = create<State & Actions>((set, get) => ({
  items: normalizeAsc(MOCK_ITEMS),
  query: '',
  hits: [],
  hitIndex: 0,
  calendarHits: {},
  isActionsOpen: true,

  setQuery: q => set({ query: q }),
  setHits: (h, map) =>
    set({ hits: h, hitIndex: h.length ? 0 : 0, calendarHits: map }),
  nextHit: () => {
    const { hits, hitIndex } = get();
    if (!hits.length) return;
    set({ hitIndex: (hitIndex + 1) % hits.length });
  },
  prevHit: () => {
    const { hits, hitIndex } = get();
    if (!hits.length) return;
    set({ hitIndex: (hitIndex - 1 + hits.length) % hits.length });
  },
  jumpToHit: i => set({ hitIndex: i }),
  toggleActions: open =>
    set(s => ({
      isActionsOpen: typeof open === 'boolean' ? open : !s.isActionsOpen,
    })),

  // 메시지 추가 후 항상 오래된→최신(아래) 순으로 정렬
  addMessage: (sender, text, date, time) =>
    set(s => {
      const next = [
        ...s.items,
        makeDateHeader(date),
        makeMsg({ sender, text, date, time }),
      ];
      return { items: normalizeAsc(next) };
    }),
}));
