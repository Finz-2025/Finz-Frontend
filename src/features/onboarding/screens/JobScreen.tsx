import { useNavigation } from '@react-navigation/native';
import { useOnboardingStore } from '../state/useOnboardingStore';
import { validators } from '../model/validators';
import OnboardLayout from '../components/OnboardLayout';
import { View } from 'react-native';
import ChoiceButton from '../components/ChoiceButton';

const options = [
  { key: 'student', label: '학생' },
  { key: 'worker', label: '직장인' },
  { key: 'freelancer', label: '프리랜서' },
  { key: 'other', label: '기타' },
] as const;

export default function JobScreen() {
  const { form, patch } = useOnboardingStore();
  const nav = useNavigation<any>();
  const valid = validators.job(form);

  const displayName = form.nickname?.trim().length
    ? form.nickname.trim()
    : '사용자';
  const title = `${displayName}님의\n직업을 알려주세요`;

  return (
    <OnboardLayout
      title={title}
      confirmDisabled={!valid}
      onConfirm={() => nav.navigate('Budget')}
      progressIndex={2}
      onBack={() => nav.goBack()}
    >
      {/* 버튼 리스트 */}
      <View>
        {options.map(o => (
          <ChoiceButton
            key={o.key}
            label={o.label}
            selected={form.job === o.key}
            onPress={() => patch({ job: o.key })}
          />
        ))}
      </View>
    </OnboardLayout>
  );
}
