import { OnboardingForm, StepKey } from './types';

export const validators: Record<StepKey, (f: OnboardingForm) => boolean> = {
  nickname: f =>
    f.nickname.trim().length >= 2 && f.nickname.trim().length <= 16,
  ageGroup: f => !!f.ageGroup,
  job: f => !!f.job,
  budget: f => typeof f.budget === 'number' && f.budget >= 0,
};
