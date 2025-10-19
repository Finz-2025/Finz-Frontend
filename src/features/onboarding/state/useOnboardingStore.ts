import { create } from 'zustand';
import { OnboardingForm, StepKey } from '../model/types';

type State = {
  step: StepKey;
  form: OnboardingForm;
};
type Actions = {
  setStep: (s: StepKey) => void;
  patch: (partial: Partial<OnboardingForm>) => void;
  reset: () => void;
};

export const useOnboardingStore = create<State & Actions>(set => ({
  step: 'nickname',
  form: { nickname: '', ageGroup: '', job: '', budget: null },
  setStep: s => set({ step: s }),
  patch: partial => set(st => ({ form: { ...st.form, ...partial } })),
  reset: () =>
    set({
      step: 'nickname',
      form: { nickname: '', ageGroup: '', job: '', budget: null },
    }),
}));
