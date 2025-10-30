import React, { useState, memo } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';
import type { DailyRecord, ExpenseRecord } from '../model/types';
import { colors } from '@/theme/colors';

const chevronDown = require('~assets/icons/ic_chevron_down.png');
const chevronUp = require('~assets/icons/ic_chevron_up.png');

// ==== 아이콘 매핑 ====
const catIcons: Record<NonNullable<ExpenseRecord['category']>, any> = {
  food: require('~assets/icons/cat_food.png'),
  cafe: require('~assets/icons/cat_cafe.png'),
  daily: require('~assets/icons/cat_daily.png'),
  transport: require('~assets/icons/cat_transport.png'),
  housing: require('~assets/icons/cat_housing.png'),
  saving: require('~assets/icons/cat_saving.png'),
  etc: require('~assets/icons/cat_etc.png'),
};
const methodIcons: Record<NonNullable<ExpenseRecord['method']>, any> = {
  card: require('~assets/icons/method_card.png'),
  cash: require('~assets/icons/method_cash.png'),
  account: require('~assets/icons/method_account.png'),
};
const incomeIcon = require('~assets/icons/income_coin.png');
const editIcon = require('~assets/icons/ic_edit_purple.png');
const deleteIcon = require('~assets/icons/ic_delete_pink.png');

// 구분선 컴포넌트
const Separator = memo(() => <View style={s.sep} />);

// 태그 리스트
const Tags = memo(({ tags, color }: { tags: string[]; color: string }) => {
  if (!tags?.length) return null;
  return (
    <View style={s.tagWrap}>
      {tags.map(t => (
        <View key={t} style={[s.tag, { borderColor: color }]}>
          <Text style={[s.tagText, { color }]}>{`#${t}`}</Text>
        </View>
      ))}
    </View>
  );
});

// 좌측 아이콘
const LeftIcon = memo(({ item }: { item: DailyRecord }) => {
  if (item.type === 'income') {
    return <Image source={incomeIcon} style={s.leftIcon} />;
  }
  const e = item as ExpenseRecord;
  return <Image source={catIcons[e.category]} style={s.leftIcon} />;
});

// 결제수단 아이콘
const MethodIcon = memo(({ item }: { item: DailyRecord }) => {
  if (item.type !== 'expense') return null;
  const e = item as ExpenseRecord;
  if (!e.method) return null; // ← 결제수단이 없으면 아이콘 숨김
  return <Image source={methodIcons[e.method]} style={s.methodIcon} />;
});

const Row = memo(({ item }: { item: DailyRecord }) => {
  const [open, setOpen] = useState(false);
  const tagColor = colors.primary;

  return (
    <View>
      {/* 한 줄 레이아웃 */}
      <View style={s.rowOneLine}>
        <LeftIcon item={item} />

        <Text style={s.name} numberOfLines={1}>
          {item.title}
        </Text>

        {/* 지출일 때만 결제수단 아이콘 (텍스트는 숨김) */}
        <MethodIcon item={item} />

        <View style={{ flex: 1 }} />

        <Text style={s.amount}>{item.amount.toLocaleString()}원</Text>

        {(!!item.memo || (item.tags?.length ?? 0) > 0) && (
          <Pressable
            onPress={() => setOpen(v => !v)}
            style={s.actionBtn}
            hitSlop={8}
          >
            <Image
              source={open ? chevronUp : chevronDown}
              style={s.actionIcon}
            />
          </Pressable>
        )}

        <Pressable onPress={() => {}} style={s.actionBtn} hitSlop={8}>
          <Image source={editIcon} style={s.actionIcon} />
        </Pressable>
        <Pressable onPress={() => {}} style={s.actionBtn} hitSlop={8}>
          <Image source={deleteIcon} style={s.actionIcon} />
        </Pressable>
      </View>

      {/* 아코디언 콘텐츠 */}
      {open && (
        <View style={s.accordionBox}>
          <Tags tags={item.tags ?? []} color={tagColor} />
          {!!item.memo && (
            <View style={s.memoBox}>
              <Text style={s.memoText}>{item.memo}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
});

export default function DailyDetailList({
  date,
  items,
}: {
  date: string;
  items: DailyRecord[];
}) {
  return (
    <View style={s.card}>
      <Text style={s.title}>{date.replaceAll('-', '.')}</Text>
      <FlatList
        data={items}
        keyExtractor={i => i.id}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => <Row item={item} />}
        style={s.list}
        showsVerticalScrollIndicator
        nestedScrollEnabled
        contentContainerStyle={[
          { paddingBottom: moderateVerticalScale(8) },
          items.length === 0 && { flex: 1, justifyContent: 'center' },
        ]}
        ListEmptyComponent={
          <View style={s.emptyWrap}>
            <Text style={s.emptyTitle}>아직 기록이 없어요!</Text>
          </View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    height: moderateVerticalScale(160),
    backgroundColor: '#F4EFFF',
    borderRadius: moderateScale(10),
    paddingVertical: moderateVerticalScale(12),
    paddingHorizontal: moderateScale(16),
    overflow: 'hidden',
  },
  list: {
    flex: 1,
  },
  title: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(18),
    fontWeight: FONT_WEIGHT.extrabold,
    textAlign: 'center',
    marginBottom: moderateVerticalScale(6),
  },
  sep: { height: 1, backgroundColor: 'rgba(124,91,211,0.18)' },

  rowOneLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateVerticalScale(10),
  },
  leftIcon: {
    width: moderateScale(26),
    height: moderateScale(26),
    resizeMode: 'contain',
    marginRight: moderateScale(8),
  },
  name: {
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(14),
    fontWeight: FONT_WEIGHT.semibold,
    color: '#2F3B49',
    maxWidth: '42%',
  },
  amount: {
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(14),
    fontWeight: FONT_WEIGHT.bold,
    marginHorizontal: moderateScale(8),
    color: '#2F3B49',
  },
  actionBtn: {
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateVerticalScale(2),
  },
  actionIcon: {
    width: moderateScale(18),
    height: moderateScale(18),
    resizeMode: 'contain',
  },
  methodIcon: {
    width: moderateScale(18),
    height: moderateScale(18),
    resizeMode: 'contain',
    marginLeft: moderateScale(6),
  },

  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: moderateScale(6) },
  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  tagText: { fontFamily: FONT_FAMILY, fontSize: moderateScale(11) },

  accordionBox: {
    paddingLeft: moderateScale(34),
    paddingBottom: moderateVerticalScale(6),
    gap: moderateVerticalScale(6),
  },
  memoBox: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    marginRight: moderateScale(8),
  },
  memoText: {
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(12),
    color: '#404855',
  },

  emptyWrap: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(14),
    fontWeight: FONT_WEIGHT.light,
    color: colors.darkText,
    marginBottom: moderateVerticalScale(4),
  },
});
