import { create } from 'zustand';
import type { ChatItem, SearchHit, CalendarHitMap } from '../model/types';
import { MOCK_ITEMS } from '../model/mockChats';

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
};

export const useCoachStore = create<State & Actions>((set, get) => ({
  items: MOCK_ITEMS,
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
}));
