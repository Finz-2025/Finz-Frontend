import { useEffect, useState } from 'react';
import { CalendarHitMap, ChatItem, SearchHit } from '../model/types';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { moderateVerticalScale } from 'react-native-size-matters';
import { moderateScale } from '@/theme/scale';
import { colors } from '@/theme/colors';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';

const searchIcon = require('~assets/icons/search_icon.png');
const chevUp = require('~assets/icons/chev_up.png');
const chevDown = require('~assets/icons/chev_down.png');

type Props = {
  items: ChatItem[];
  query: string;
  setQuery(q: string): void;
  setHits(h: SearchHit[], map: CalendarHitMap): void;
  onPrev(): void;
  onNext(): void;
  hitsCount: number;
  currentIndex: number;
};

const findAll = (text: string, q: string) => {
  if (!q) return [];
  const ranges: Array<{ start: number; end: number }> = [];
  const lower = text.toLowerCase();
  const key = q.toLowerCase();
  let i = 0;
  while ((i = lower.indexOf(key, i)) !== -1) {
    ranges.push({ start: i, end: i + key.length });
    i += key.length;
  }
  return ranges;
};

export default function SearchBar(p: Props) {
  const [internal, setInternal] = useState(p.query);
  const [focused, setFocused] = useState(false);

  const { items, setQuery, setHits, query, hitsCount } = p;

  const runSearch = (q: string) => {
    const key = q.trim();
    if (!key) {
      if (query !== '' || hitsCount > 0) {
        setQuery('');
        setHits([], {});
      }
      return;
    }

    const hits: SearchHit[] = [];
    const byDate: CalendarHitMap = {};
    items.forEach((it, idx) => {
      if (it.type !== 'message') return;
      const ranges = findAll(it.message.text, key);
      if (ranges.length) {
        hits.push({ itemIndex: idx, messageId: it.message.id, ranges });
        byDate[it.message.date] =
          (byDate[it.message.date] ?? 0) + ranges.length;
      }
    });

    if (query !== key || hitsCount !== hits.length) {
      setQuery(key);
      setHits(hits, byDate);
    }
  };

  // 검색어가 비워지면 하이라이트/결과 초기화
  useEffect(() => {
    if (internal.trim() === '') {
      if (query !== '' || hitsCount > 0) {
        setQuery('');
        setHits([], {});
      }
    }
  }, [internal, query, hitsCount, setQuery, setHits]);

  return (
    <View style={[s.wrap, focused ? s.wrapFocused : s.wrapDefault]}>
      <Image source={searchIcon} style={s.searchIcon} />
      <TextInput
        value={internal}
        onChangeText={t => setInternal(t)}
        onSubmitEditing={() => runSearch(internal)}
        placeholder="대화 내용 검색하기"
        placeholderTextColor={colors.grayShadow}
        style={s.input}
        returnKeyType="search"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <View style={s.tools}>
        <Pressable onPress={p.onPrev}>
          <Image source={chevUp} style={s.tool} />
        </Pressable>
        <Pressable onPress={p.onNext}>
          <Image source={chevDown} style={s.tool} />
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginTop: moderateVerticalScale(10),
    marginHorizontal: moderateScale(15),
    paddingHorizontal: moderateScale(13),
    height: moderateVerticalScale(35),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: moderateScale(20),
    backgroundColor: colors.white,
  },
  wrapDefault: {
    borderColor: colors.mediumPrimary,
  },
  wrapFocused: {
    borderColor: colors.primary,
  },
  searchIcon: {
    width: moderateScale(20),
    height: moderateVerticalScale(20),
    marginRight: moderateScale(9),
  },
  input: {
    flex: 1,
    color: colors.darkText,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(12),
    fontWeight: FONT_WEIGHT.semibold,
  },
  tools: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(3),
  },
  tool: {
    width: moderateScale(20),
    height: moderateVerticalScale(20),
  },
});
