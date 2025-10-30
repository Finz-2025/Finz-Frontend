import { api } from '@/lib/api';

// === 공통 타입 ===
export type MessageType =
  | 'FREE_CHAT'
  | 'GOAL_SETTING'
  | 'EXPENSE_CONSULT'
  | 'EXPENSE_RECORD';

export type CoachHistoryItemDto = {
  messageId: number;
  sender: 'USER' | 'AI';
  messageType: MessageType;
  content: string;
  createdAt: string;
};

// === 조회 ===
export async function getCoachHistory(userId: number | string) {
  const res = await api.get<CoachHistoryItemDto[]>(
    `/api/coach/history/${userId}`,
  );
  return res.data;
}

// === 기본 메시지 전송 ===
// POST /api/coach/message/:userId
export async function postCoachMessage(
  userId: number | string,
  body: { message: string; messageType?: MessageType }, // 기본 FREE_CHAT
) {
  const res = await api.post<{ message: string; messageType: MessageType }>(
    `/api/coach/message/${userId}`,
    { message: body.message, messageType: body.messageType ?? 'FREE_CHAT' },
  );
  return res.data;
}

// === 목표 상담 시작 ===
// POST /api/coach/goal-consult/:userId
export async function getGoalConsult(userId: number | string) {
  const res = await api.post<{
    status: number;
    success: boolean;
    message: string;
    data: { message: string; messageType: 'GOAL_SETTING' };
  }>(`/api/coach/goal-consult/${userId}`);
  return res.data.data; // { message, messageType }
}

// === 지출 상담 시작 ===
// POST /api/coach/expense-consult/:userId
export async function getExpenseConsult(userId: number | string) {
  const res = await api.post<{
    status: number;
    success: boolean;
    message: string;
    data: { message: string; messageType: 'EXPENSE_CONSULT' };
  }>(`/api/coach/expense-consult/${userId}`);
  return res.data.data; // { message, messageType }
}
