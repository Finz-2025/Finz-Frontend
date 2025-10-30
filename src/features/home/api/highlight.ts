import { api } from '@/lib/api';

type HighlightItemAPI = { title: string; value_text: string };

interface HighlightAPIResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    category_highlight: HighlightItemAPI;
    tag_highlight: HighlightItemAPI;
    recommend_spend: HighlightItemAPI;
  };
}

export type WeeklyHighlightRow = {
  icon: any; // RN Image source
  label: string; // 좌측 라벨
  value: string; // 우측 값
};

const thumbsUp = require('~assets/icons/highlight_thumbs_up.png');
const thumbsDown = require('~assets/icons/highlight_thumbs_down.png');
const smile = require('~assets/icons/highlight_smile.png');

// 값 텍스트를 보고 아이콘을 간단히 추론 (감소=👍, 증가=👎)
const pickTrendIcon = (valueText: string) => {
  const v = valueText ?? '';
  const neg = /-|감소|줄었|절약|↓/; // 지출이 줄어들면 good
  const pos = /\+|증가|늘었|↑/; // 지출이 늘면 bad
  if (neg.test(v)) return thumbsUp;
  if (pos.test(v)) return thumbsDown;
  return thumbsUp; // 모호하면 기본 👍
};

/** 서버 응답을 WeeklyHighlights rows 형태로 변환 */
function normalizeToRows(
  d: HighlightAPIResponse['data'],
): WeeklyHighlightRow[] {
  return [
    {
      icon: pickTrendIcon(d.category_highlight?.value_text),
      label: d.category_highlight?.title ?? '카테고리',
      value: d.category_highlight?.value_text ?? '-',
    },
    {
      icon: pickTrendIcon(d.tag_highlight?.value_text),
      label: d.tag_highlight?.title ?? '태그',
      value: d.tag_highlight?.value_text ?? '-',
    },
    {
      icon: smile,
      label: d.recommend_spend?.title ?? '오늘 권장 지출',
      value: d.recommend_spend?.value_text ?? '-',
    },
  ];
}

/** 이번주 하이라이트 fetch + 표준화 */
export async function fetchWeeklyHighlight({
  userId = 1,
}: { userId?: number } = {}): Promise<WeeklyHighlightRow[]> {
  const res = await api.get<HighlightAPIResponse>('/api/home/highlight', {
    params: { user_id: userId },
  });
  const data = res.data?.data;
  if (!data) return [];
  return normalizeToRows(data);
}
