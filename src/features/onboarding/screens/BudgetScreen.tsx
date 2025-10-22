import { useNavigation } from '@react-navigation/native';
import { saveProfile } from '@/services/profile';
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
  const { form, patch, reset } = useOnboardingStore();
  const nav = useNavigation<any>();
  const valid = validators.budget(form);

  const displayName = form.nickname?.trim().length
    ? form.nickname.trim()
    : '사용자';
  const title = `${displayName}님의\n한 달 목표 예산을\n알려주세요`;

  const formatCurrency = (n: number | null) =>
    n == null ? '' : n.toLocaleString('ko-KR');
  const valueStr = formatCurrency(form.budget ?? null);

  const handleChange = (t: string) => {
    const onlyDigits = t.replace(/[^\d]/g, '');
    patch({ budget: onlyDigits === '' ? null : Number(onlyDigits) });
  };

  const handleConfirm = async () => {
    if (!valid) return;

    await saveProfile({
      id: `u_${Date.now()}`, // 임시 ID 생성
      name: form.nickname.trim(), // Profile.name 에 매핑
      ageGroup: form.ageGroup,
      job: form.job,
      budget: form.budget,
    });

    reset();

    nav.reset({
      index: 0,
      routes: [{ name: 'WelcomeSplash' }],
    });
  };

  return (
    <OnboardLayout
      title={title}
      confirmDisabled={!valid}
      onConfirm={handleConfirm}
      progressIndex={3}
      onBack={() => nav.goBack()}
    >
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
  inputWrap: { position: 'relative' },
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
