import { createUserNameStep } from './UserNameStep';
import { createAccountStep } from './AccountStep';

// 모든 Step의 create 함수 모음
export const stepCreators = {
  UserName: createUserNameStep,
  Account: createAccountStep,
  // 새 Step 추가 시 여기만 추가
} as const;

export type StepId = keyof typeof stepCreators;