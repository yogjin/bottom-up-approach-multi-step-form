import { atom, useAtom } from 'jotai';
import { Account } from './types';

export const accountAtom = atom<Account>({
  email: '',
  password: '',
});

// 2. 서버 형식에 맞게 변환 (이미 맞으니 그대로)
export const accountSerializeAtom = atom((get) => {
  const { email, password } = get(accountAtom);
  return { email, password };
});

// 3. 제출 버튼 활성화 조건
export const accountValidateAtom = atom((get) => {
  const { email, password } = get(accountAtom);
  return email.includes('@') && password.length >= 8;
});

const AccountStep = () => {
  const [value, setValue] = useAtom(accountAtom);

  return (
    <div>
      <h2>2단계: 계정 정보</h2>
      <input
        value={value.email}
        onChange={(e) => setValue({ ...value, email: e.target.value })}
        placeholder="이메일 (@ 포함)"
        type="email"
      />
      <input
        value={value.password}
        onChange={(e) => setValue({ ...value, password: e.target.value })}
        placeholder="비밀번호 (8자 이상)"
        type="password"
      />
    </div>
  );
};

export default AccountStep;
