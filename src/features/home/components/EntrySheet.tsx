import { colors } from '@/theme/colors';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';
import DateTimePicker, {
  AndroidNativeProps,
} from '@react-native-community/datetimepicker';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Mode = 'expense' | 'income';

export type EntrySheetRef = {
  isDirty: () => boolean;
  tryClose: () => void;
};

export type SavedEntry = {
  type: 'expense' | 'income';
  date: string;
  title: string;
  amount: number;
  method?: 'card' | 'cash' | 'transfer' | null;
  category?: string | null;
  tags: string[];
  memo?: string;
};

interface Props {
  mode: Mode;
  selectedDate?: string;
  onSaved?(entry: SavedEntry): void;
  onRequestClose?(dirty: boolean): void;
}

// 아이콘 PNG
const ICONS = {
  categories: {
    food: require('~assets/icons/cat_food.png'),
    cafe: require('~assets/icons/cat_cafe.png'),
    daily: require('~assets/icons/cat_daily.png'),
    transport: require('~assets/icons/cat_transport.png'),
    housing: require('~assets/icons/cat_housing.png'),
    saving: require('~assets/icons/cat_saving.png'),
  },
  categoriesSelected: {
    food: require('~assets/icons/cat_food_sel.png'),
    cafe: require('~assets/icons/cat_cafe_sel.png'),
    daily: require('~assets/icons/cat_daily_sel.png'),
    transport: require('~assets/icons/cat_transport_sel.png'),
    housing: require('~assets/icons/cat_housing_sel.png'),
    saving: require('~assets/icons/cat_saving_sel.png'),
  },
  submit: {
    on: require('~assets/icons/btn_submit_on.png'),
    off: require('~assets/icons/btn_submit_off.png'),
  },
  date: require('~assets/icons/ic_calendar.png'),
};

// 태그
const DEFAULT_EXPENSE_TAGS = [
  '#계획',
  '#친구',
  '#즉흥',
  '#건강',
  '#야식',
  '#루틴',
  '#배달',
  '#할인',
  '#학식',
];
const DEFAULT_INCOME_TAGS = ['#용돈', '#월급', '#알바', '#판매'];

const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
const onlyDigits = (s: string) => s.replace(/[^0-9]/g, '');
const formatComma = (s: string) => s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const EntrySheet = forwardRef<EntrySheetRef, Props>(function EntrySheet(
  { mode, selectedDate, onSaved, onRequestClose },
  ref,
) {
  const slide = useRef(new Animated.Value(0)).current;

  // 제목
  const [title, setTitle] = useState('');

  // 날짜
  const parseKey = (key: string) => {
    const [y, m, d] = key.split('-').map(n => parseInt(n, 10));
    return new Date(y, m - 1, d); // 로컬 기준으로 안전
  };
  const [date, setDate] = useState<string>(
    () => selectedDate ?? toKey(new Date()),
  );
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(parseKey(date));

  // 금액
  const [amountRaw, setAmountRaw] = useState<string>('');
  const amountFormatted = useMemo(
    () => (amountRaw ? formatComma(amountRaw) : ''),
    [amountRaw],
  );

  // 카테고리/수단
  const [category, setCategory] = useState<string | null>(null);
  const [method, setMethod] = useState<'card' | 'cash' | 'transfer' | null>(
    null,
  );

  // 태그
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [editTags, setEditTags] = useState(false);
  const [removedTags, setRemovedTags] = useState<string[]>([]);
  const TAGS = useMemo(
    () =>
      (mode === 'expense'
        ? [...DEFAULT_EXPENSE_TAGS, ...customTags]
        : [...DEFAULT_INCOME_TAGS, ...customTags]
      ).filter(t => !removedTags.includes(t)),
    [mode, customTags, removedTags],
  );
  // 삭제 핸들러
  const deleteTag = (t: string) => {
    if (customTags.includes(t)) {
      setCustomTags(prev => prev.filter(x => x !== t)); // 커스텀은 완전 삭제
    } else {
      setRemovedTags(prev => (prev.includes(t) ? prev : [...prev, t])); // 기본 태그는 숨김
    }
    setTags(prev => prev.filter(x => x !== t)); // 선택 해제
  };

  // 메모
  const [memo, setMemo] = useState('');
  const MEMO_MAX = 120;

  // 직접 입력 모달
  const [tagModal, setTagModal] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
      setTempDate(parseKey(selectedDate));
    }
  }, [selectedDate]);

  useEffect(() => {
    Animated.timing(slide, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [slide]);

  const ui = useMemo(
    () =>
      mode === 'expense'
        ? {
            title: '지출 입력',
            tagTitle: '#지출태그',
            submit: '등록',
            requireMethod: true,
            requireCategory: true,
          }
        : {
            title: '수입 입력',
            tagTitle: '#수입태그',
            submit: '등록',
            requireMethod: false,
            requireCategory: false,
          },
    [mode],
  );

  const amt = Number(amountRaw || '0');
  const isValid =
    Boolean(date) &&
    amt > 0 &&
    (!ui.requireCategory || Boolean(category)) &&
    (!ui.requireMethod || Boolean(method));

  // 현재 입력이 비어있지 않은지(= 수정됨) 판단
  const isDirty = useMemo(() => {
    const hasAmount = !!amountRaw && Number(amountRaw) > 0;
    const hasTitle = title.trim().length > 0;
    const hasCat = !!category;
    const hasMethod = !!method;
    const hasTags =
      tags.length > 0 || customTags.length > 0 || removedTags.length > 0;
    const hasMemo = memo.trim().length > 0;
    const dateChanged = selectedDate ? selectedDate !== date : false;
    return (
      hasAmount ||
      hasTitle ||
      hasCat ||
      hasMethod ||
      hasTags ||
      hasMemo ||
      dateChanged
    );
  }, [
    amountRaw,
    title,
    category,
    method,
    tags,
    customTags,
    removedTags,
    memo,
    date,
    selectedDate,
  ]);

  // handlers
  const onPressDate = () => {
    setTempDate(parseKey(date));
    setShowPicker(true);
  };
  const onChangeDate: AndroidNativeProps['onChange'] = (event, selected) => {
    if (Platform.OS === 'android') {
      // 시스템 모달 사용: 여기서 닫기 제어
      if (event?.type === 'set' && selected) {
        // 확인 눌렀을 때
        setTempDate(selected);
        setDate(toKey(selected));
      }
      // 'set'이든 'dismissed'든 모달은 닫는다
      setShowPicker(false);
      return;
    }

    // iOS 인라인: 선택만 임시 반영, 확정은 커스텀 버튼에서
    if (selected) setTempDate(selected);
  };
  const onConfirmDate = () => {
    setDate(toKey(tempDate));
    setShowPicker(false);
  };
  const onCancelDate = () => setShowPicker(false);

  const onAmountChange = (text: string) => setAmountRaw(onlyDigits(text));
  const toggleCategory = (key: string) =>
    setCategory(prev => (prev === key ? null : key));
  const toggleMethod = (key: 'card' | 'cash' | 'transfer') =>
    setMethod(prev => (prev === key ? null : key));
  const toggleTag = (t: string) =>
    setTags(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t],
    );

  const openAddTag = () => {
    setTagInput('');
    setTagModal(true);
  };
  const addTag = () => {
    let t = tagInput.trim();
    if (!t) return;
    if (!t.startsWith('#')) t = `#${t}`;
    if (!customTags.includes(t)) setCustomTags(prev => [...prev, t]);
    setTagModal(false);
  };

  const handleRequestClose = () => {
    if (onRequestClose) onRequestClose(isDirty);
  };

  useImperativeHandle(ref, () => ({
    isDirty: () => isDirty,
    tryClose: handleRequestClose,
  }));

  const handleSubmit = () => {
    if (!isValid) return;
    const saved: SavedEntry = {
      type: mode,
      date,
      title: title.trim() || (mode === 'expense' ? '지출' : '수입'),
      amount: amt,
      method,
      category,
      tags,
      memo: memo?.trim() || '',
    };
    onSaved?.(saved);
  };

  const translateY = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [moderateVerticalScale(40), 0],
  });

  return (
    <Animated.View style={[styles.wrap, { transform: [{ translateY }] }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>{ui.title}</Text>
        <Pressable hitSlop={12} onPress={handleRequestClose}>
          <Text style={styles.closeTxt}>×</Text>
        </Pressable>
      </View>

      {/* 날짜 피커 */}
      {showPicker && (
        <View style={styles.pickerContainer}>
          <View style={styles.pickerInner}>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
              onChange={onChangeDate}
              maximumDate={new Date(2100, 11, 31)}
              minimumDate={new Date(2000, 0, 1)}
              locale={Platform.OS === 'ios' ? 'ko-KR' : undefined}
              style={
                Platform.OS === 'android'
                  ? { transform: [{ scale: 0.92 }] }
                  : undefined
              }
            />
          </View>

          {/* iOS 인라인일 때만 커스텀 버튼 */}
          {Platform.OS === 'ios' && (
            <View style={styles.pickerActions}>
              <Pressable onPress={onCancelDate} style={styles.pickerBtn}>
                <Text style={styles.pickerBtnTxt}>취소</Text>
              </Pressable>
              <Pressable
                onPress={onConfirmDate}
                style={[styles.pickerBtn, styles.pickerBtnPrimary]}
              >
                <Text style={[styles.pickerBtnTxt, { color: colors.white }]}>
                  확인
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      {/* 스크롤 콘텐츠 */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingBottom:
            mode === 'income'
              ? moderateVerticalScale(28)
              : moderateVerticalScale(16), // 수입모드: 버튼 더 아래
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* 날짜 + 금액 */}
        <View style={styles.rowGap}>
          {/* 날짜 필드 */}
          <Pressable onPress={onPressDate} style={styles.dateBox}>
            <Image source={ICONS.date} style={styles.dateIcon} />
            <Text style={styles.dateText}>{date}</Text>
          </Pressable>

          {/* 금액 입력 */}
          <View>
            <Text style={styles.inputLabel}>금액</Text>
            <View style={styles.amountBox}>
              <TextInput
                placeholder="금액 입력"
                keyboardType="number-pad"
                value={amountFormatted}
                onChangeText={onAmountChange}
                style={styles.amountInput}
                placeholderTextColor={colors.grayShadow}
              />
              <Text style={styles.unit}>원</Text>
            </View>
          </View>
        </View>

        {/* 제목 입력 */}
        <View style={styles.titleGroup}>
          <Text style={styles.inputLabel}>제목</Text>
          <View style={styles.amountBox}>
            <TextInput
              placeholder="제목 입력"
              value={title}
              onChangeText={setTitle}
              style={styles.amountInput}
              placeholderTextColor={colors.grayShadow}
              returnKeyType="done"
              maxLength={40}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* (지출 전용) 카테고리 */}
        {ui.requireCategory && (
          <>
            {/* 라벨 라인 + 기타 텍스트 버튼 */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>카테고리</Text>
              <Pressable onPress={() => toggleCategory('etc')}>
                <Text
                  style={[
                    styles.sectionLabel,
                    {
                      backgroundColor: colors.white,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 999,
                    },
                    category === 'etc' && {
                      borderWidth: 1,
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  기타
                </Text>
              </Pressable>
            </View>

            <View style={styles.catRow}>
              {(
                [
                  ['food', '식사'],
                  ['cafe', '카페'],
                  ['daily', '생필품'],
                  ['transport', '교통'],
                  ['housing', '주거'],
                  ['saving', '저축'],
                ] as const
              ).map(([key]) => {
                const active = category === key;

                return (
                  <Pressable key={key} onPress={() => toggleCategory(key)}>
                    <Image
                      source={
                        active
                          ? ICONS.categoriesSelected[key]
                          : ICONS.categories[key]
                      }
                      style={styles.catImg}
                    />
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {/* 태그 */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>{ui.tagTitle}</Text>
          {mode === 'expense' && (
            <Pressable onPress={() => setEditTags(v => !v)}>
              <Text
                style={[
                  styles.sectionLabel,
                  { backgroundColor: 'transparent' },
                ]}
              >
                {editTags ? '완료' : '편집'}
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.tagRow}>
          {TAGS.map(t => {
            const active = tags.includes(t);
            return (
              <View key={t} style={styles.tagWrap}>
                <Pressable
                  style={[styles.tagChip, active && styles.tagChipSelected]}
                  onPress={() => toggleTag(t)}
                >
                  <Text
                    style={[styles.tagTxt, active && styles.tagTxtSelected]}
                  >
                    {t}
                  </Text>
                </Pressable>

                {editTags && (
                  <Pressable onPress={() => deleteTag(t)} style={styles.tagDel}>
                    <Text style={styles.tagDelTxt}>×</Text>
                  </Pressable>
                )}
              </View>
            );
          })}
          <Pressable
            style={[styles.tagAdd, styles.tagAddSmall]}
            onPress={openAddTag}
          >
            <Text style={styles.tagAddText}>+ 직접 입력</Text>
          </Pressable>
        </View>

        {/* 메모 */}
        <Text
          style={[
            styles.sectionLabel,
            { marginTop: moderateVerticalScale(16) },
          ]}
        >
          메모
        </Text>
        <View style={styles.memoBox}>
          <TextInput
            multiline
            value={memo}
            onChangeText={setMemo}
            placeholder={'기억해야 할 내용이 있나요?'}
            placeholderTextColor={colors.grayShadow}
            style={styles.memoInput}
            maxLength={MEMO_MAX}
          />
          <Text style={styles.memoCount}>
            {memo.length}/{MEMO_MAX}
          </Text>
        </View>

        {/* (지출 전용) 결제 수단 */}
        {ui.requireMethod && (
          <>
            <Text
              style={[
                styles.sectionLabel,
                { marginTop: moderateVerticalScale(16) },
              ]}
            >
              결제 수단
            </Text>
            <View style={styles.payRow}>
              {(
                [
                  ['card', '카드'],
                  ['cash', '현금'],
                  ['transfer', '계좌이체'],
                ] as const
              ).map(([key, label]) => {
                const active = method === key;
                return (
                  <Pressable
                    key={key}
                    style={[styles.payBtn, active && styles.payBtnActive]}
                    onPress={() => toggleMethod(key as any)}
                  >
                    <Text style={styles.payTxt}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {/* 등록 버튼 */}
        <Pressable
          onPress={handleSubmit}
          disabled={!isValid}
          style={styles.submitArea}
        >
          <ImageBackground
            source={isValid ? ICONS.submit.on : ICONS.submit.off}
            style={styles.submitBg}
            imageStyle={styles.submitBgImg}
          >
            <Text style={styles.submitTxt}>{ui.submit}</Text>
          </ImageBackground>
        </Pressable>
      </ScrollView>

      {/* 태그 추가 모달 (오버레이) */}
      {tagModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>태그 추가하기</Text>
              <Pressable onPress={() => setTagModal(false)} hitSlop={10}>
                <Text style={styles.modalClose}>×</Text>
              </Pressable>
            </View>

            <View style={styles.modalInputWrap}>
              <TextInput
                placeholder="태그 입력"
                value={tagInput}
                onChangeText={setTagInput}
                style={styles.modalInput}
                placeholderTextColor={colors.grayShadow}
              />
              <View style={styles.modalUnderline} />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setTagModal(false)}
                style={styles.modalBtn}
              >
                <Text style={styles.modalBtnTxt}>취소</Text>
              </Pressable>
              <Pressable
                onPress={addTag}
                style={[styles.modalBtn, styles.modalBtnPrimary]}
              >
                <Text style={[styles.modalBtnTxt, { color: colors.white }]}>
                  추가
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </Animated.View>
  );
});

export default EntrySheet;

const R = (n: number) => moderateScale(n);

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    marginTop: moderateVerticalScale(13),
    marginHorizontal: R(20),
    paddingVertical: moderateVerticalScale(12),
    paddingHorizontal: R(12),
    borderRadius: R(10),
    backgroundColor: colors.lightPrimary,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateVerticalScale(10),
  },
  title: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: R(15),
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.45,
  },
  closeTxt: { fontSize: R(24), color: colors.primary, lineHeight: R(24) },
  scroll: { paddingHorizontal: R(20) },

  // compact picker
  pickerContainer: {
    marginBottom: moderateVerticalScale(8),
  },
  pickerInner: {
    backgroundColor: colors.white,
    borderRadius: R(10),
    overflow: 'hidden',
    paddingVertical: Platform.OS === 'ios' ? 0 : moderateVerticalScale(2),
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: R(8),
    marginTop: moderateVerticalScale(8),
  },
  pickerBtn: {
    paddingHorizontal: R(10),
    paddingVertical: moderateVerticalScale(6),
    borderRadius: R(8),
    backgroundColor: '#ECE3FF',
  },
  pickerBtnPrimary: { backgroundColor: colors.primary },
  pickerBtnTxt: { color: colors.primary, fontWeight: FONT_WEIGHT.bold },

  rowGap: { gap: moderateVerticalScale(12) },

  // 제목 섹션
  titleGroup: {
    marginTop: moderateVerticalScale(12),
  },

  // 날짜
  dateBox: {
    height: moderateVerticalScale(40),
    borderRadius: R(10),
    backgroundColor: colors.white,
    paddingHorizontal: R(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateIcon: {
    width: R(18),
    height: R(18),
    marginRight: R(8),
    tintColor: colors.primary,
  },
  dateText: {
    flex: 1,
    marginLeft: R(6),
    fontFamily: FONT_FAMILY,
    fontSize: R(15),
    color: colors.darkText,
  },
  dateChoose: { color: colors.primary, fontWeight: FONT_WEIGHT.semibold },

  inputLabel: {
    color: colors.mediumPrimary,
    fontFamily: FONT_FAMILY,
    fontSize: R(12),
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: moderateVerticalScale(6),
  },
  amountBox: {
    height: moderateVerticalScale(40),
    borderRadius: R(10),
    backgroundColor: colors.white,
    paddingHorizontal: R(14),
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    fontFamily: FONT_FAMILY,
    fontSize: R(16),
    color: colors.darkText,
  },
  unit: {
    marginLeft: R(6),
    color: colors.primary,
    fontWeight: FONT_WEIGHT.semibold,
  },

  sectionHeaderRow: {
    marginTop: moderateVerticalScale(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontFamily: FONT_FAMILY,
    fontSize: R(12),
    color: colors.mediumPrimary,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // 카테고리
  catRow: {
    marginTop: moderateVerticalScale(6),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: R(7),
    justifyContent: 'space-between',
  },
  catImg: {
    width: R(40),
    height: moderateVerticalScale(40),
    resizeMode: 'contain',
  },

  // 태그
  tagRow: {
    marginTop: moderateVerticalScale(8),
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: moderateVerticalScale(6),
    columnGap: R(10),
  },
  tagWrap: { position: 'relative' },
  tagChip: {
    height: moderateVerticalScale(30),
    paddingHorizontal: R(7),
    borderRadius: R(999),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagChipSelected: { backgroundColor: colors.white },
  tagTxt: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: R(12),
    fontWeight: FONT_WEIGHT.bold,
  },
  tagTxtSelected: { color: colors.primary },

  tagDel: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: R(16),
    height: R(16),
    borderRadius: R(8),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagDelTxt: { color: colors.white, fontSize: R(12), lineHeight: R(12) },

  tagAdd: {
    backgroundColor: colors.primary,
    borderRadius: R(10),
    paddingHorizontal: R(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagAddSmall: { height: moderateVerticalScale(20), alignSelf: 'center' },
  tagAddText: {
    color: colors.white,
    fontFamily: FONT_FAMILY,
    fontSize: R(10),
    fontWeight: FONT_WEIGHT.bold,
  },

  // 메모
  memoBox: {
    marginTop: moderateVerticalScale(6),
    borderRadius: R(10),
    backgroundColor: colors.white,
    minHeight: moderateVerticalScale(120),
    paddingHorizontal: R(11),
    paddingVertical: moderateVerticalScale(9),
    position: 'relative',
  },
  memoInput: {
    textAlignVertical: 'top',
    fontFamily: FONT_FAMILY,
    color: colors.darkText,
    fontSize: moderateScale(12),
    minHeight: moderateVerticalScale(90),
  },
  memoCount: {
    position: 'absolute',
    right: R(10),
    bottom: R(8),
    color: colors.mediumPrimary,
    fontSize: R(10),
  },

  // 결제 수단
  payRow: {
    marginTop: moderateVerticalScale(6),
    justifyContent: 'center',
    flexDirection: 'row',
    gap: R(9),
  },
  payBtn: {
    width: R(85),
    height: moderateVerticalScale(30),
    borderRadius: R(10),
    backgroundColor: colors.mediumPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: R(9),
  },
  payBtnActive: {
    backgroundColor: colors.primaryShadow,
  },
  payTxt: {
    color: colors.white,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(12),
    fontWeight: FONT_WEIGHT.bold,
  },

  // 등록 버튼
  submitArea: {
    marginTop: moderateVerticalScale(9),
    alignSelf: 'center',
  },
  submitBg: {
    width: R(80),
    height: moderateVerticalScale(30),
    borderRadius: R(10),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBgImg: { resizeMode: 'stretch' },
  submitTxt: {
    color: colors.white,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(14),
    fontWeight: FONT_WEIGHT.bold,
  },

  // 태그 추가 모달
  modalOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '86%',
    borderRadius: R(18),
    backgroundColor: colors.white,
    paddingVertical: moderateVerticalScale(16),
    paddingHorizontal: R(16),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: R(18),
    fontWeight: FONT_WEIGHT.bold,
  },
  modalClose: { color: colors.primary, fontSize: R(22), lineHeight: R(22) },
  modalInputWrap: {
    marginTop: moderateVerticalScale(30),
    marginHorizontal: R(8),
    alignItems: 'center',
  },
  modalInput: {
    width: '96%',
    fontSize: R(16),
    textAlign: 'center',
    color: colors.darkText,
    paddingVertical: moderateVerticalScale(6),
  },
  modalUnderline: {
    width: '96%',
    height: 2,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: colors.primary,
  },
  modalActions: {
    marginTop: moderateVerticalScale(18),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: R(10),
  },
  modalBtn: {
    paddingHorizontal: R(12),
    paddingVertical: moderateVerticalScale(8),
    borderRadius: R(8),
    backgroundColor: '#EEE6FF',
  },
  modalBtnPrimary: { backgroundColor: colors.primary },
  modalBtnTxt: { color: colors.primary, fontWeight: FONT_WEIGHT.bold },
});
