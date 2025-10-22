import { colors } from '@/theme/colors';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const expenseOn = require('~assets/icons/btn_expense_on.png');
const expenseOff = require('~assets/icons/btn_expense_off.png');
const incomeOn = require('~assets/icons/btn_income_on.png');
const incomeOff = require('~assets/icons/btn_income_off.png');

interface Props {
  active: 'none' | 'expense' | 'income';
  onPressExpense(): void;
  onPressIncome(): void;
}

export default function InOutButtons({
  active,
  onPressExpense,
  onPressIncome,
}: Props) {
  const isExpenseActive = active === 'expense';
  const isIncomeActive = active === 'income';

  // 라벨 컬러도 상태에 맞춰 분기 (둘 다 비활성일 땐 기본 보라)
  const expenseLabelColor = colors.white;
  const incomeLabelColor = isIncomeActive
    ? colors.primaryShadow
    : colors.primary;

  return (
    <View style={s.row}>
      <Pressable onPress={onPressExpense} style={{ flex: 1 }}>
        <ImageBackground
          source={isExpenseActive ? expenseOn : expenseOff}
          style={s.bg}
          imageStyle={s.bgImg}
        >
          <Text style={[s.label, { color: expenseLabelColor }]}>지출 입력</Text>
        </ImageBackground>
      </Pressable>

      <Pressable onPress={onPressIncome} style={{ flex: 1 }}>
        <ImageBackground
          source={isIncomeActive ? incomeOn : incomeOff}
          style={s.bg}
          imageStyle={s.bgImg}
        >
          <Text style={[s.label, { color: incomeLabelColor }]}>수입 입력</Text>
        </ImageBackground>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: moderateScale(9),
    marginTop: moderateVerticalScale(10),
    paddingHorizontal: moderateScale(20),
  },
  bg: {
    height: moderateVerticalScale(47),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImg: {
    resizeMode: 'stretch',
    borderRadius: moderateScale(10),
  },
  label: {
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(15),
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.45,
  },
});
