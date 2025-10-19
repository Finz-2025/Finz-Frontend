import OnboardLayout from '../components/OnboardLayout';
import RoundedTextInput from '../components/RoundedTextInput';
import { useOnboardingStore } from '../state/useOnboardingStore';
import { validators } from '../model/validators';
import { useNavigation } from '@react-navigation/native';

export default function NicknameScreen() {
  const { form, patch } = useOnboardingStore();
  const nav = useNavigation<any>();
  const valid = validators.nickname(form);

  return (
    <OnboardLayout
      title={'FiNZ에\n오신 것을 환영합니다!\n어떻게 불러드릴까요?'}
      confirmDisabled={!valid}
      onConfirm={() => nav.navigate('Age')}
      progressIndex={0}
    >
      <RoundedTextInput
        placeholder="이름 입력"
        value={form.nickname}
        onChangeText={t => patch({ nickname: t })}
        helper="이름은 2~16자 이내로 입력해 주세요"
      />
    </OnboardLayout>
  );
}
