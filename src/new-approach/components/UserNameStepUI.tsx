import { useAtom } from 'jotai';
import { useStepAtom } from '../FormContext';
import type { UserName } from '../types';

export function UserNameStepUI() {
  const valueAtom = useStepAtom('UserName');
  const [value, setValue] = useAtom(valueAtom);

  return (
    <div>
      <h2>1단계: 이름 입력</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          value={value.lastName}
          onChange={(e) =>
            setValue((prev) => ({
              ...prev,
              lastName: e.target.value,
            }))
          }
          placeholder="성 (예: 홍)"
          style={{
            padding: '8px',
            fontSize: '16px',
            width: '200px',
          }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          value={value.firstName}
          onChange={(e) =>
            setValue((prev) => ({
              ...prev,
              firstName: e.target.value,
            }))
          }
          placeholder="이름 (예: 길동)"
          style={{
            padding: '8px',
            fontSize: '16px',
            width: '200px',
          }}
        />
      </div>
      {(value.firstName || value.lastName) && (
        <p style={{ color: '#666' }}>
          입력된 이름: {value.firstName} {value.lastName}
        </p>
      )}
    </div>
  );
}
