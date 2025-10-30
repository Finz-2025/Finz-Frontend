import { api } from '@/lib/api';

export type CoachHistoryItemDto = {
  messageId: number;
  sender: 'USER' | 'AI';
  messageType:
    | 'GOAL_SETTING'
    | 'EXPENSE_CONSULT'
    | 'FREE_CHAT'
    | 'EXPENSE_RECORD';
  content: string;
  createdAt: string;
};

// 대화 내역 조회 API
export async function getCoachHistory(userId: number | string) {
  const res = await api.get<CoachHistoryItemDto[]>(
    `/api/coach/history/${userId}`,
  );
  return res.data;
}
