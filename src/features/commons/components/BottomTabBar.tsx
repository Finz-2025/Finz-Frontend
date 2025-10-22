import React from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import { colors } from '@/theme/colors';

type TabKey = 'coach' | 'home' | 'goals';

interface Props {
  active: TabKey;
  onPressCoach?: () => void;
  onPressHome?: () => void;
  onPressGoals?: () => void;
}

const icons = {
  coach: {
    active: require('~assets/icons/coach_active.png'),
    inactive: require('~assets/icons/coach_inactive.png'),
  },
  home: {
    active: require('~assets/icons/home_active.png'),
    inactive: require('~assets/icons/home_inactive.png'),
  },
  goals: {
    active: require('~assets/icons/goals_active.png'),
    inactive: require('~assets/icons/goals_inactive.png'),
  },
};

const BAR_HEIGHT = moderateVerticalScale(80);
export function useTabBarHeight() {
  return BAR_HEIGHT;
}

export default function BottomTabBar({
  active,
  onPressCoach,
  onPressHome,
  onPressGoals,
}: Props) {
  const getIcon = (key: TabKey) =>
    active === key ? icons[key].active : icons[key].inactive;

  return (
    <View pointerEvents="box-none" style={s.host}>
      <View style={s.bar}>
        <TouchableOpacity
          style={s.btn}
          onPress={onPressCoach}
          activeOpacity={0.8}
        >
          <Image
            source={getIcon('coach')}
            style={s.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={s.btn}
          onPress={onPressHome}
          activeOpacity={0.8}
        >
          <Image source={getIcon('home')} style={s.icon} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity
          style={s.btn}
          onPress={onPressGoals}
          activeOpacity={0.8}
        >
          <Image
            source={getIcon('goals')}
            style={s.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  bar: {
    minHeight: BAR_HEIGHT,
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',

    shadowColor: colors.gray,
    shadowOpacity: 0.7,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: -2 },

    ...Platform.select({
      android: {
        elevation: 3,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(217,217,217,0.70)',
      },
    }),
  },
  btn: {
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateVerticalScale(15),
    paddingBottom: moderateVerticalScale(35),
  },
  icon: {
    width: moderateScale(30),
    height: moderateScale(30),
  },
});
