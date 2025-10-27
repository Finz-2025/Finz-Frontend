export type Sender = 'user' | 'coach';

export type ChatMessage = {
  id: string;
  date: string;
  time: string;
  sender: Sender;
  text: string;
};

export type ChatItem =
  | { type: 'date'; id: string; date: string }
  | { type: 'message'; id: string; message: ChatMessage };

export type SearchHit = {
  itemIndex: number;
  messageId: string;
  ranges: Array<{ start: number; end: number }>;
};

export type CalendarHitMap = Record<string, number>;
