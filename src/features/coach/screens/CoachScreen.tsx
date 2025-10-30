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
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/app/navigation/MainNavigator';
import BottomTabBar from '@/features/commons/components/BottomTabBar';

const bulbIcon = require('~assets/icons/bulb_icon.png');
const imageIcon = require('~assets/icons/image_icon.png');
const inactiveSend = require('~assets/icons/send_inactive.png');
const activeSend = require('~assets/icons/send_active.png');

type CoachRoute = RouteProp<MainStackParamList, 'Coach'>;

export default function CoachScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<CoachRoute>();

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
    addMessage,
    loadInitial,
  } = useCoachStore();

  useEffect(() => {
    loadInitial(1); // /api/coach/history/1
  }, [loadInitial]);

  // (데모) 코치 자동 응답 생성
  const makeCoachReply = (raw?: any) => {
    if (!raw) return '지출을 기록했어요. 이번 주 예산 안에서 잘 관리 중이에요!';
    const { amount = 0, category } = raw;
    if (category === 'cafe')
      return '카페 지출이 늘고 있어요. 이번 주는 1회로 제한해볼까요?';
    if (amount >= 20000)
      return '이번 지출은 금액이 조금 커요. 주간 예산을 다시 점검해볼까요?';
    return '좋아요! 작은 지출도 꾸준히 기록하면 습관이 됩니다.';
  };

  useEffect(() => {
    const ap = route.params?.autoPost;
    if (!ap) return;

    // 1) 사용자가 보낸 메시지 먼저 추가
    addMessage('user', ap.text, ap.date, ap.time);

    // 2) 코치 자동 응답 예약
    const replyTimer = setTimeout(() => {
      const reply = makeCoachReply(ap.raw);
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');

      addMessage('coach', reply, ap.date, `${hh}:${mm}`);

      // 3) 응답까지 보낸 '뒤에' 파라미터 초기화
      navigation.setParams({ autoPost: undefined } as any);
    }, 250);

    // 4) 언마운트 때만 정리
    return () => clearTimeout(replyTimer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.autoPost, addMessage]);

  const [input, setInput] = useState('');
  const [showAttach, setShowAttach] = useState(false);
  const listRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    console.log('send:', input);
    setInput('');
  };

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
            onPick={t => {
              setInput(
                t === 'goal'
                  ? '나의 소비 패턴을 기반으로 목표를 추천해줘'
                  : '나의 소비 패턴에 대해 어떻게 생각해?',
              );
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
              placeholder="메시지 입력"
              placeholderTextColor={colors.grayShadow}
              onSubmitEditing={handleSend}
            />
            {input.trim() ? (
              <Pressable onPress={handleSend}>
                <Image source={activeSend} style={s.sendBtn} />
              </Pressable>
            ) : (
              <Image source={inactiveSend} style={s.sendBtn} />
            )}
          </View>
        </View>
      </View>

      <AttachReceiptModal
        open={showAttach}
        onClose={() => setShowAttach(false)}
      />

      {/* 고정 하단바 */}
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
  view: {
    flex: 1,
    backgroundColor: colors.white,
  },
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
  iconBtn: {
    width: moderateScale(20),
    height: moderateVerticalScale(20),
  },
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
