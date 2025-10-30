import { MainStackParamList } from '@/app/navigation/MainNavigator';
import BottomTabBar, {
  useTabBarHeight,
} from '@/features/commons/components/BottomTabBar';
import WeeklyHighlights from '@/features/commons/components/WeeklyHighlights';
import { colors } from '@/theme/colors';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const icEdit = require('~assets/icons/ic_edit_purple.png');
const icDelete = require('~assets/icons/ic_delete_pink.png');

type ActiveGoal = {
  id: string;
  dday: number;
  title: string;
  amount: number;
  type: string;
  progress: number;
};

type DoneGoal = {
  id: string;
  title: string;
  amount: number;
  period: { start: string; end: string };
  progress: 100;
};

const ACTIVE_GOALS: ActiveGoal[] = [
  {
    id: 'g1',
    dday: 100,
    title: '파리 여행',
    amount: 4000000,
    type: '월 1,000,000원 페이스',
    progress: 34,
  },
  {
    id: 'g2',
    dday: 50,
    title: '모으기',
    amount: 500000,
    type: '통장 모으기',
    progress: 20,
  },
  {
    id: 'g3',
    dday: 50,
    title: '모으기',
    amount: 500000,
    type: '통장 모으기',
    progress: 20,
  },
];

const DONE_GOALS: DoneGoal[] = [
  {
    id: 'd1',
    title: '맥북',
    amount: 1800000,
    period: { start: '2025.01.20', end: '2025.04.20' },
    progress: 100,
  },
  {
    id: 'd2',
    title: '맥북',
    amount: 1800000,
    period: { start: '2025.01.20', end: '2025.04.20' },
    progress: 100,
  },
  {
    id: 'd3',
    title: '맥북',
    amount: 1800000,
    period: { start: '2025.01.20', end: '2025.04.20' },
    progress: 100,
  },
];

export default function GoalsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const TAB_H = useTabBarHeight();

  const activeKeyExtractor = (item: ActiveGoal) => item.id;
  const doneKeyExtractor = (item: DoneGoal) => item.id;

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <ScrollView
        style={s.content}
        contentContainerStyle={{
          paddingTop:
            Platform.OS === 'ios'
              ? moderateVerticalScale(28)
              : moderateVerticalScale(18),
          paddingBottom: TAB_H + moderateVerticalScale(12),
        }}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        {/* 상단: 이번주 하이라이트 */}
        <View style={s.blockPad}>
          <WeeklyHighlights />
        </View>

        {/* 내 목표 + 추가 버튼 */}
        <View style={s.myGoalHeader}>
          <Text style={s.sectionTitle}>내 목표</Text>
          <Pressable
            style={s.addBtn}
            onPress={() => {
              /* TODO: 목표 추가 모달 띄우기 */
            }}
          >
            <Text style={s.addBtnText}>목표 추가하기</Text>
          </Pressable>
        </View>

        {/* 메인 */}
        <View style={s.sectionWrap}>
          {/* 진행 중 */}
          <View style={s.goalSection}>
            <Text style={s.goalSectionTitle}>진행 중</Text>

            <FlatList
              data={ACTIVE_GOALS}
              keyExtractor={activeKeyExtractor}
              ItemSeparatorComponent={() => <View style={s.rowDivider} />}
              renderItem={({ item }) => <ActiveGoalRow goal={item} />}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              style={{ flexGrow: 0 }}
            />
          </View>

          {/* 완료 */}
          <View style={s.goalSection}>
            <Text style={s.goalSectionTitle}>완료</Text>

            <FlatList
              data={DONE_GOALS}
              keyExtractor={doneKeyExtractor}
              ItemSeparatorComponent={() => <View style={s.rowDivider} />}
              renderItem={({ item }) => <DoneGoalRow goal={item} />}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              style={{ flexGrow: 0 }}
            />
          </View>
        </View>
      </ScrollView>

      <BottomTabBar
        active="goals"
        onPressCoach={() => navigation.navigate('Coach')}
        onPressHome={() => navigation.navigate('Home')}
        onPressGoals={() => navigation.navigate('Goals')}
      />
    </View>
  );
}

function ProgressBadge({ value }: { value: number }) {
  return (
    <View style={s.progressBadge}>
      <Text style={s.progressBadgeText}>{`${value}%`}</Text>
    </View>
  );
}

function IconButton({
  source,
  onPress,
}: {
  source: any;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={10}>
      <Image source={source} style={s.icon} resizeMode="contain" />
    </Pressable>
  );
}

function ActiveGoalRow({ goal }: { goal: ActiveGoal }) {
  return (
    <View style={s.row}>
      {/* 좌측 영역 */}
      <View style={s.leftSide}>
        {/* D-day */}
        <Text style={s.dday}>{`D - ${goal.dday}`}</Text>

        {/* 세로 구분선 */}
        <View style={s.vDivider} />

        {/* 제목/금액/유형 */}
        <View style={s.rowMiddle}>
          <View style={s.rowTitleLine}>
            <Text>{goal.title}</Text>
            <View style={s.titleDivider} />
            <Text>{goal.amount.toLocaleString()}원</Text>
          </View>
          <Text style={s.rowSub}>{goal.type}</Text>
        </View>
      </View>

      {/* 진행률 뱃지 */}
      <View style={s.rightSide}>
        <ProgressBadge value={goal.progress} />

        {/* 편집/삭제 */}
        <View style={s.iconBtn}>
          <IconButton source={icEdit} onPress={() => {}} />
          <IconButton source={icDelete} onPress={() => {}} />
        </View>
      </View>
    </View>
  );
}

function DoneGoalRow({ goal }: { goal: DoneGoal }) {
  return (
    <View style={s.row}>
      {/* 제목/금액/기간 */}
      <View style={[s.rowMiddle, { flex: 1 }]}>
        <View style={s.rowTitleLine}>
          <Text>{goal.title}</Text>
          <View style={s.titleDivider} />
          <Text>{goal.amount.toLocaleString()}원</Text>
        </View>
        <Text
          style={s.rowSub}
        >{`${goal.period.start} - ${goal.period.end}`}</Text>
      </View>

      <View style={s.rightSide}>
        {/* 진행률 뱃지 */}
        <ProgressBadge value={goal.progress} />

        {/* 삭제 */}
        <IconButton source={icDelete} onPress={() => {}} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    marginHorizontal: moderateScale(20),
  },
  blockPad: {
    marginVertical: moderateVerticalScale(20),
  },
  myGoalHeader: {
    gap: moderateVerticalScale(8),
    marginBottom: moderateVerticalScale(17),
  },
  sectionTitle: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(15),
    fontWeight: FONT_WEIGHT.semibold,
  },
  addBtn: {
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: colors.mediumPrimary,
    backgroundColor: colors.white,
    boxShadow: `0 -3px 3px 0 ${colors.primary} inset`,
    height: moderateVerticalScale(47),
    justifyContent: 'center',
  },
  addBtnText: {
    color: colors.mediumPrimary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(15),
    fontWeight: FONT_WEIGHT.semibold,
    textAlign: 'center',
  },
  sectionWrap: {
    flex: 1,
    gap: moderateVerticalScale(7),
    marginBottom: moderateVerticalScale(14),
  },
  goalSection: {
    height: moderateVerticalScale(230),
    borderRadius: moderateScale(10),
    backgroundColor: colors.lightPrimary,
    paddingVertical: moderateVerticalScale(14),
    paddingHorizontal: moderateScale(16),
  },
  goalSectionTitle: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(15),
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: moderateVerticalScale(14),
  },
  rowDivider: {
    marginVertical: moderateVerticalScale(5),
    height: 0.5,
    backgroundColor: colors.mediumPrimary,
  },

  progressBadge: {
    height: moderateVerticalScale(19),
    borderRadius: moderateScale(10),
    backgroundColor: colors.white,
    paddingHorizontal: moderateScale(7),
    justifyContent: 'center',
    textAlign: 'center',
  },
  progressBadgeText: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(12),
    fontWeight: FONT_WEIGHT.semibold,
  },

  icon: {
    width: moderateScale(15),
    height: moderateVerticalScale(15),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: moderateScale(11),
  },
  dday: {
    marginLeft: moderateScale(3),
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(15),
    fontWeight: FONT_WEIGHT.semibold,
  },
  vDivider: {
    width: 1,
    height: moderateVerticalScale(40),
    backgroundColor: colors.primary,
  },
  rowMiddle: {
    marginVertical: moderateVerticalScale(11),
    gap: moderateVerticalScale(6),
  },
  rowTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    color: colors.darkText,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(12),
    fontWeight: FONT_WEIGHT.semibold,
  },
  titleDivider: {
    width: 0.5,
    height: moderateVerticalScale(15),
    backgroundColor: colors.darkText,
  },
  rowSub: {
    color: colors.grayShadow,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(10),
    fontWeight: FONT_WEIGHT.medium,
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(9),
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(3),
  },
});
