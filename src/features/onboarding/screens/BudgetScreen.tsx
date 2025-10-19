import { useNavigation } from '@react-navigation/native';
import { useOnboardingStore } from '../state/useOnboardingStore';
import { validators } from '../model/validators';
import OnboardLayout from '../components/OnboardLayout';
import { StyleSheet, Text, View } from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
} from 'react-native-size-matters';
import { FONT_FAMILY, FONT_WEIGHT } from '../../../theme/typography';
import { colors } from '../../../theme/colors';
import RoundedTextInput from '../components/RoundedTextInput';

export default function BudgetScreen() {
  const { form, patch } = useOnboardingStore();
  const nav = useNavigation<any>();

  const displayName = form.nickname?.trim().length
    ? form.nickname.trim()
    : '사용자';
  const title = `${displayName}님의\n한 달 목표 예산을\n알려주세요`;

  const valid = validators.budget(form);

  // 숫자를 1,234,567 형태로 포맷
  const formatCurrency = (n: number | null) =>
    n == null ? '' : n.toLocaleString('ko-KR');

  // 입력창에 보여줄 문자열 (스토어엔 숫자만 보관)
  const valueStr = formatCurrency(form.budget ?? null);

  // 입력 시: 콤마 제거 → 숫자만 저장
  const handleChange = (t: string) => {
    const onlyDigits = t.replace(/[^\d]/g, '');
    patch({ budget: onlyDigits === '' ? null : Number(onlyDigits) });
  };

  return (
    <OnboardLayout
      title={title}
      confirmDisabled={!valid}
      onConfirm={() => nav.navigate('WelcomeSplash')}
      progressIndex={3}
      onBack={() => nav.goBack()}
    >
      {/* 입력칸 + 오른쪽 (원) 단위 오버레이 */}
      <View style={styles.inputWrap}>
        <RoundedTextInput
          placeholder="금액 입력"
          keyboardType="number-pad"
          value={valueStr}
          onChangeText={handleChange}
          helper="0원 이상의 금액을 입력해 주세요"
          isCurrencyInput
        />
        <Text style={styles.unit}>원</Text>
      </View>
    </OnboardLayout>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    position: 'relative',
  },
  unit: {
    position: 'absolute',
    right: moderateScale(20),
    top: moderateVerticalScale(20),
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHT.semibold,
    fontSize: moderateScale(20),
    color: colors.primary,
  },
});
