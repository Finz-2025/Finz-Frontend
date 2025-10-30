import { useEffect, useRef, useState } from 'react';
import { useCoachStore } from '../state/useCoachStore';
import {
  FlatList,
  Image,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '@/theme/colors';
import SearchBar from '../components/SearchBar';
import ChatList from '../components/ChatList';
import QuickActionsBar from '../components/QuickActionsBar';
import AttachReceiptModal from '../components/AttachReceiptModal';
import {
  moderateScale,
  moderateVerticalScale,
} from 'react-native-size-matters';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/app/navigation/MainNavigator';
import BottomTabBar from '@/features/commons/components/BottomTabBar';

const bulbIcon = require('~assets/icons/bulb_icon.png');
const imageIcon = require('~assets/icons/image_icon.png');
const inactiveSend = require('~assets/icons/send_inactive.png');
const activeSend = require('~assets/icons/send_active.png');

export default function CoachScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const {
    items,
    query,
    setQuery,
    hits,
    setHits,
    hitIndex,
    nextHit,
    prevHit,
    isActionsOpen,
    toggleActions,
    loadInitial,
    currentMode,
    isModeLoading,
    exitMode,
    enterGoalMode,
    enterExpenseMode,
    sendToCoach,
    isSending,
  } = useCoachStore();

  useEffect(() => {
    loadInitial(1);
  }, [loadInitial]);

  const [input, setInput] = useState('');
  const [showAttach, setShowAttach] = useState(false);
  const listRef = useRef<FlatList>(null);

  const handleSend = () => {
    const msg = input.trim();
    if (!msg) return;
    sendToCoach(1, msg);
    setInput('');
  };

  // 키보드 표시 상태
  const [kbVisible, setKbVisible] = useState(false);
  useEffect(() => {
    const showEvt =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const s = Keyboard.addListener(showEvt, () => setKbVisible(true));
    const h = Keyboard.addListener(hideEvt, () => setKbVisible(false));
    return () => {
      s.remove();
      h.remove();
    };
  }, []);

  // === 모드 뱃지 컴포넌트 ===
  const ModeBadge = () => {
    if (currentMode === 'FREE_CHAT') return null;
    const label =
      currentMode === 'GOAL_SETTING' ? '목표 추천 모드' : '지출 상담 모드';
    const exitLabel =
      currentMode === 'GOAL_SETTING'
        ? '목표 추천 모드 종료하기'
        : '지출 상담 모드 종료하기';
    return (
      <View style={s.modeWrap}>
        <Text style={s.modeText}>{label}</Text>
        <Pressable
          style={s.modeExitBtn}
          onPress={exitMode}
          disabled={isModeLoading || isSending}
        >
          <Text style={s.modeExitText}>{exitLabel}</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={s.view}>
      <View style={s.titleArea}>
        <Text style={s.title}>FiNZ's 코치</Text>
      </View>
      <View style={s.chatArea}>
        <SearchBar
          items={items}
          query={query}
          setQuery={setQuery}
          setHits={setHits}
          onPrev={prevHit}
          onNext={nextHit}
          hitsCount={hits.length}
          currentIndex={hitIndex}
        />

        {/* 현재 모드 표시 + 종료 */}
        <ModeBadge />

        <ChatList
          items={items}
          hits={hits}
          currentHit={hitIndex}
          onReadyIndexRef={r => (listRef.current = r?.current as any)}
        />

        <View style={s.inputArea}>
          <QuickActionsBar
            open={isActionsOpen}
            onToggle={() => toggleActions()}
            // 모드 전환 + AI 응답 선발송
            onPick={t => {
              if (t === 'goal') {
                enterGoalMode(1);
              } else {
                enterExpenseMode(1);
              }
            }}
          />

          <View style={s.inputRow}>
            <View style={s.iconArea}>
              <Pressable onPress={() => toggleActions(true)}>
                <Image source={bulbIcon} style={s.iconBtn} />
              </Pressable>
              <Pressable onPress={() => setShowAttach(true)}>
                <Image source={imageIcon} style={s.iconBtn} />
              </Pressable>
            </View>

            <TextInput
              style={s.input}
              value={input}
              onChangeText={setInput}
              placeholder={
                currentMode === 'FREE_CHAT'
                  ? '메시지 입력'
                  : currentMode === 'GOAL_SETTING'
                  ? '목표 추천에 대해 물어보세요'
                  : '지출 상담에 대해 물어보세요'
              }
              placeholderTextColor={colors.grayShadow}
              onSubmitEditing={handleSend}
              editable={!isSending && !isModeLoading}
            />

            {input.trim() ? (
              <Pressable
                onPress={handleSend}
                disabled={isSending || isModeLoading}
              >
                <Image source={activeSend} style={s.sendBtn} />
              </Pressable>
            ) : (
              <Image source={inactiveSend} style={s.sendBtn} />
            )}
          </View>

          {/* 선택: 모드 로딩/전송 상태 간단 표기 */}
          {(isModeLoading || isSending) && (
            <Text style={{ color: colors.grayShadow, marginTop: 6 }}>
              {isModeLoading ? '모드 초기화 중…' : '전송 중…'}
            </Text>
          )}
        </View>
      </View>

      <AttachReceiptModal
        open={showAttach}
        onClose={() => setShowAttach(false)}
      />

      {!kbVisible && (
        <BottomTabBar
          active="coach"
          onPressCoach={() => navigation.navigate('Coach')}
          onPressHome={() => navigation.navigate('Home')}
          onPressGoals={() => navigation.navigate('Goals')}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  view: { flex: 1, backgroundColor: colors.white },
  titleArea: {
    paddingTop:
      Platform.OS === 'ios'
        ? moderateVerticalScale(40)
        : moderateVerticalScale(20),
    marginBottom: moderateVerticalScale(10),
    borderBottomWidth: 0.5,
    borderBottomColor: colors.primary,
    boxShadow: '0 1px 2px 0 #7E4AB8',
  },
  title: {
    marginLeft: moderateScale(20),
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(20),
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: moderateVerticalScale(6),
  },
  chatArea: {
    height: Platform.OS === 'ios' ? '78.5%' : '80%',
    marginHorizontal: moderateScale(20),
    marginBottom: moderateVerticalScale(11),
    borderRadius: moderateScale(10),
    backgroundColor: colors.lightPrimary,
  },
  modeWrap: {
    marginHorizontal: moderateScale(13),
    marginTop: moderateVerticalScale(8),
    marginBottom: moderateVerticalScale(4),
    paddingVertical: moderateVerticalScale(6),
    paddingHorizontal: moderateScale(10),
    backgroundColor: '#EFE7FF',
    borderRadius: moderateScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: moderateScale(8),
  },
  modeText: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(12),
    fontWeight: FONT_WEIGHT.semibold,
  },
  modeExitBtn: {
    paddingVertical: moderateVerticalScale(5),
    paddingHorizontal: moderateScale(8),
    backgroundColor: colors.white,
    borderRadius: moderateScale(999),
    borderWidth: 0.5,
    borderColor: colors.primary,
  },
  modeExitText: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(11),
    fontWeight: FONT_WEIGHT.medium,
  },
  inputArea: {
    marginVertical: moderateVerticalScale(10),
    marginHorizontal: moderateScale(13),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateVerticalScale(10),
    borderRadius: moderateScale(10),
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  iconArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(5),
    marginRight: moderateScale(10),
  },
  iconBtn: { width: moderateScale(20), height: moderateVerticalScale(20) },
  input: {
    flex: 1,
    color: colors.darkText,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(12),
    fontWeight: FONT_WEIGHT.regular,
  },
  sendBtn: {
    marginLeft: moderateScale(12),
    width: moderateScale(20),
    height: moderateVerticalScale(20),
  },
});
