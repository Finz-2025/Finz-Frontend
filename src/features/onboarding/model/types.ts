export type StepKey = 'nickname' | 'ageGroup' | 'job' | 'budget';

export interface OnboardingForm {
  nickname: string;
  ageGroup: '10s' | '20s' | '30s' | '40plus' | '';
  job: 'student' | 'worker' | 'freelancer' | 'other' | '';
  budget: number | null;
}
