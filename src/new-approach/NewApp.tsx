import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { match } from 'ts-pattern';
import { 
  FormProvider, 
  useFormPayloadAtom, 
  useFormValidateAtom, 
  useStepValidateAtom 
} from './FormContext';
import { UserNameStepUI } from './components/UserNameStepUI';
import { AccountStepUI } from './components/AccountStepUI';
import { Step } from './types';

function FormContent() {
  const [currentStep, setCurrentStep] = useState(Step.UserName);
  
  // Provider에서 생성된 atom들 사용
  const payloadAtom = useFormPayloadAtom();
  const validateAtom = useFormValidateAtom();
  const userNameValidateAtom = useStepValidateAtom('UserName');
  
  const payload = useAtomValue(payloadAtom);
  const isFormValid = useAtomValue(validateAtom);
  const isUserNameValid = useAtomValue(userNameValidateAtom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📤 제출할 데이터:', payload);
    alert(`
      회원가입 완료!
      이름: ${payload.name}
      이메일: ${payload.email}
    `);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        {/* 진행 상태 */}
        <div style={{ marginBottom: '20px' }}>
          <strong>진행 단계: </strong>
          {currentStep === Step.UserName ? '1/2' : '2/2'}
        </div>

        {/* Step 렌더링 - Pattern Matching */}
        {match(currentStep)
          .with(Step.UserName, () => <UserNameStepUI />)
          .with(Step.Account, () => <AccountStepUI />)
          .exhaustive()}

        {/* 네비게이션 버튼 */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          {currentStep === Step.Account && (
            <button 
              type="button" 
              onClick={() => setCurrentStep(Step.UserName)}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ⬅️ 이전
            </button>
          )}
          
          {currentStep === Step.UserName && (
            <button 
              type="button"
              onClick={() => setCurrentStep(Step.Account)}
              disabled={!isUserNameValid}
              style={{ 
                padding: '10px 20px',
                fontSize: '16px',
                opacity: isUserNameValid ? 1 : 0.5,
                cursor: isUserNameValid ? 'pointer' : 'not-allowed'
              }}
            >
              다음 ➡️
            </button>
          )}

          {currentStep === Step.Account && (
            <button 
              type="submit" 
              disabled={!isFormValid}
              style={{ 
                opacity: isFormValid ? 1 : 0.5,
                cursor: isFormValid ? 'pointer' : 'not-allowed',
                backgroundColor: isFormValid ? '#4CAF50' : '#ccc',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              ✅ 회원가입 완료
            </button>
          )}
        </div>

        {/* 디버깅용: 현재 Payload 상태 */}
        <div style={{ 
          marginTop: '30px', 
          padding: '10px', 
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}>
          <strong>📋 현재 데이터 (디버깅용):</strong>
          <pre style={{ fontSize: '12px' }}>
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      </form>
    </div>
  );
}

// 메인 App - Provider로 감싸기
export default function NewApp() {
  // 수정 모드 시뮬레이션
  const isEditMode = true;
  
  // 서버에서 받아온 기존 데이터 (수정 모드)
  const existingData = isEditMode ? {
    name: "홍 길동",
    email: "hong@example.com",
    password: "password123"
  } : undefined;

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>
        {isEditMode ? '📝 회원정보 수정' : '🆕 회원가입'}
      </h1>
      
      <FormProvider initialValue={existingData}>
        <FormContent />
      </FormProvider>
    </div>
  );
}