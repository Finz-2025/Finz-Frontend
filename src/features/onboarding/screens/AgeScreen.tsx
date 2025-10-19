import { useNavigation } from '@react-navigation/native';
import ChoiceButton from '../components/ChoiceButton';
import { useOnboardingStore } from '../state/useOnboardingStore';
import { validators } from '../model/validators';
import OnboardLayout from '../components/OnboardLayout';

const options = [
  { key: '10s', label: '10대' },
  { key: '20s', label: '20대' },
  { key: '30s', label: '30대' },
  { key: '40plus', label: '40대 이상' },
] as const;

export default function AgeScreen() {
  const { form, patch } = useOnboardingStore();
  const nav = useNavigation<any>();
  const valid = validators.ageGroup(form);

  return (
    <OnboardLayout
      title={'연령대는\n어떻게 되시나요?'}
      confirmDisabled={!valid}
      onConfirm={() => nav.navigate('Job')}
      progressIndex={1}
      onBack={() => nav.goBack()}
    >
      {options.map(o => (
        <ChoiceButton
          key={o.key}
          label={o.label}
          selected={form.ageGroup === o.key}
          onPress={() => patch({ ageGroup: o.key })}
        />
      ))}
    </OnboardLayout>
  );
}
