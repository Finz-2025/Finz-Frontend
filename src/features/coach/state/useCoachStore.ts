import { create } from 'zustand';
import type {
  ChatItem,
  SearchHit,
  CalendarHitMap,
  ChatMessage,
} from '../model/types';
import { MOCK_ITEMS } from '../model/mockChats';
import { splitUtcIsoToLocal, nowLocalDateTime } from '../utils/datetime';
import {
  getCoachHistory,
  postCoachMessage,
  getGoalConsult,
  getExpenseConsult,
  type MessageType,
} from '../api/coach';

// ===== 내부 빌더 =====
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

// 오래된→최신(아래)
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

// ===== 모드 타입 =====
export type ChatMode = 'FREE_CHAT' | 'GOAL_SETTING' | 'EXPENSE_CONSULT';

type State = {
  items: ChatItem[];
  query: string;
  hits: SearchHit[];
  hitIndex: number;
  calendarHits: CalendarHitMap;
  isActionsOpen: boolean;

  // 로딩/전송
  isLoading: boolean;
  isSending: boolean;
  isSyncing: boolean;
  error?: string;

  // 현재 채팅 모드
  currentMode: ChatMode;
  // 모드 전환 중(첫 AI 응답 가져오는 중)
  isModeLoading: boolean;
};

type Actions = {
  setQuery(q: string): void;
  setHits(h: SearchHit[], byDateCount: CalendarHitMap): void;
  nextHit(): void;
  prevHit(): void;
  jumpToHit(i: number): void;
  toggleActions(open?: boolean): void;

  addMessage(
    sender: 'user' | 'coach',
    text: string,
    date: string,
    time: string,
  ): void;

  // 초기 로드
  loadInitial(userId: number | string): Promise<void>;

  refreshHistory(userId: number | string): Promise<void>;

  // === 새로 추가: 모드 제어 ===
  enterGoalMode(userId: number | string): Promise<void>;
  enterExpenseMode(userId: number | string): Promise<void>;
  exitMode(): void;

  // === 전송 ===
  sendToCoach(userId: number | string, message: string): Promise<void>; // 현재 모드에 맞춰 전송
};

export const useCoachStore = create<State & Actions>((set, get) => ({
  items: normalizeAsc(MOCK_ITEMS), // 실제만 쓰려면 [] 시작
  query: '',
  hits: [],
  hitIndex: 0,
  calendarHits: {},
  isActionsOpen: true,

  isLoading: false,
  isSending: false,
  isSyncing: false,
  error: undefined,

  currentMode: 'FREE_CHAT',
  isModeLoading: false,

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

  addMessage: (sender, text, date, time) =>
    set(s => {
      const next = [
        ...s.items,
        makeDateHeader(date),
        makeMsg({ sender, text, date, time }),
      ];
      return { items: normalizeAsc(next) };
    }),

  // === 초기 로드 ===
  loadInitial: async userId => {
    set({ isLoading: true, error: undefined });
    try {
      const list = await getCoachHistory(userId);
      const sorted = [...list].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      const mapped: ChatItem[] = [];
      for (const m of sorted) {
        const { date, time } = splitUtcIsoToLocal(m.createdAt);
        const sender = m.sender === 'USER' ? 'user' : 'coach';
        mapped.push(makeDateHeader(date));
        mapped.push(makeMsg({ sender, text: m.content, date, time }));
      }
      set({ items: normalizeAsc(mapped), isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e?.message ?? '대화 로드 실패' });
    }
  },

  // 서버 기록으로 재동기화(응답 받은 뒤 항상 호출)
  refreshHistory: async userId => {
    set({ isSyncing: true });
    try {
      const list = await getCoachHistory(userId);
      const sorted = [...list].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      const mapped: ChatItem[] = [];
      for (const m of sorted) {
        const { date, time } = splitUtcIsoToLocal(m.createdAt);
        const sender = m.sender === 'USER' ? 'user' : 'coach';
        mapped.push(makeDateHeader(date));
        mapped.push(makeMsg({ sender, text: m.content, date, time }));
      }
      set({ items: normalizeAsc(mapped), isSyncing: false });
    } catch (e: any) {
      // 동기화 실패해도 기존 화면 유지
      set({ isSyncing: false, error: e?.message ?? '대화 동기화 실패' });
    }
  },

  // === 모드 전환: 목표 상담 ===
  enterGoalMode: async userId => {
    if (get().isModeLoading) return;
    set({ isModeLoading: true, isActionsOpen: false, error: undefined });
    try {
      const { messageType } = await getGoalConsult(userId);
      set({ currentMode: messageType, isModeLoading: false });
      await get().refreshHistory(userId);
    } catch (e: any) {
      const t = nowLocalDateTime();
      get().addMessage(
        'coach',
        '목표 상담 모드 진입에 실패했어요. 다시 시도해 주세요.',
        t.date,
        t.time,
      );
      set({ isModeLoading: false, error: e?.message ?? '목표 상담 시작 실패' });
    }
  },

  // === 모드 전환: 지출 상담 ===
  enterExpenseMode: async userId => {
    if (get().isModeLoading) return;
    set({ isModeLoading: true, isActionsOpen: false, error: undefined });
    try {
      const { messageType } = await getExpenseConsult(userId);
      set({ currentMode: messageType, isModeLoading: false });
      await get().refreshHistory(userId);
    } catch (e: any) {
      const t = nowLocalDateTime();
      get().addMessage(
        'coach',
        '지출 상담 모드 진입에 실패했어요. 다시 시도해 주세요.',
        t.date,
        t.time,
      );
      set({ isModeLoading: false, error: e?.message ?? '지출 상담 시작 실패' });
    }
  },

  // === 모드 종료 → 자유대화로 복귀 ===
  exitMode: () => set({ currentMode: 'FREE_CHAT' }),

  // === 전송(현재 모드에 맞춰 타입 자동 지정) ===
  sendToCoach: async (userId, message) => {
    if (get().isSending || !message.trim()) return;
    set({ isSending: true, error: undefined });

    // 1) 사용자 메시지 낙관 반영
    const t1 = nowLocalDateTime();
    get().addMessage('user', message.trim(), t1.date, t1.time);

    // 2) 현재 모드 → messageType 결정
    const mode: ChatMode = get().currentMode;
    const messageType: MessageType =
      mode === 'GOAL_SETTING'
        ? 'GOAL_SETTING'
        : mode === 'EXPENSE_CONSULT'
        ? 'EXPENSE_CONSULT'
        : 'FREE_CHAT';

    try {
      await postCoachMessage(userId, { message, messageType });
      // 서버 기준 정합 반영(코치 답변 포함)
      await get().refreshHistory(userId);
      set({ isSending: false });
    } catch (e: any) {
      const tErr = nowLocalDateTime();
      get().addMessage(
        'coach',
        '메시지 전송에 실패했어요. 네트워크 상태 확인 후 다시 시도해 주세요.',
        tErr.date,
        tErr.time,
      );
      set({ isSending: false, error: e?.message ?? '메시지 전송 실패' });
    }
  },
}));
