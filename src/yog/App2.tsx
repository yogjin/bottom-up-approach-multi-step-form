import { useState } from 'react';
import { Step } from './types';
import { formPayloadAtom, formValidateAtom } from './formAtoms';
import { useAtomValue } from 'jotai';
import { userNameValidateAtom } from './UserNameStep';
import UserNameStep from './UserNameStep';
import AccountStep from './AccountStep';
import { match } from 'ts-pattern';

const App2 = () => {
  const [currentStep, setCurrentStep] = useState(Step.UserName);
  const payload = useAtomValue(formPayloadAtom);
  const isUserNameValid = useAtomValue(userNameValidateAtom);
  const isFormValid = useAtomValue(formValidateAtom);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>단계: {currentStep === Step.UserName ? '1/2' : '2/2'}</div>

      {match(currentStep)
        .with(Step.UserName, () => <UserNameStep />)
        .with(Step.Account, () => <AccountStep />)
        .exhaustive()}

      <div style={{ marginTop: '20px' }}>
        {currentStep === Step.Account && (
          <button type="button" onClick={() => setCurrentStep(Step.UserName)}>
            이전
          </button>
        )}

        {currentStep === Step.UserName && (
          <button
            type="button"
            onClick={() => setCurrentStep(Step.Account)}
            disabled={!isUserNameValid}
            title={!isUserNameValid ? '성과 이름을 모두 입력하세요' : ''}
          >
            다음
          </button>
        )}

        {currentStep === Step.Account && (
          <button
            type="submit"
            disabled={!isFormValid}
            title={!isFormValid ? '모든 정보를 올바르게 입력하세요' : ''}
          >
            회원가입 완료
          </button>
        )}
      </div>

      {/* 디버깅용: 현재 데이터 상태 */}
      <pre style={{ marginTop: '20px', fontSize: '12px' }}>{JSON.stringify(payload, null, 2)}</pre>
    </form>
  );
};

export default App2;
