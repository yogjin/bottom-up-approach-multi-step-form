import { useAtom } from 'jotai';
import { useStepAtom } from '../FormContext';
import type { Account } from '../types';

export function AccountStepUI() {
  const valueAtom = useStepAtom('Account');
  const [value, setValue] = useAtom(valueAtom);

  const isEmailValid = value.email.includes('@');
  const isPasswordValid = value.password.length >= 8;

  return (
    <div>
      <h2>2단계: 계정 정보</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          value={value.email}
          onChange={(e) =>
            setValue((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
          placeholder="이메일 (@ 포함)"
          type="email"
          style={{
            padding: '8px',
            fontSize: '16px',
            width: '200px',
          }}
        />
        {value.email && !isEmailValid && (
          <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
            유효한 이메일을 입력하세요
          </div>
        )}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          value={value.password}
          onChange={(e) =>
            setValue((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          placeholder="비밀번호 (8자 이상)"
          type="password"
          style={{
            padding: '8px',
            fontSize: '16px',
            width: '200px',
          }}
        />
        {value.password && !isPasswordValid && (
          <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
            8자 이상 입력하세요
          </div>
        )}
      </div>
    </div>
  );
}
