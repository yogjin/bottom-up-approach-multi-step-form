import { atom } from 'jotai';
import type { UserName, FormPayload } from '../types';

export function createUserNameStep(initialValue?: FormPayload) {
  // 초기값 deserialize (서버 형식 → Step 형식)
  const initial: UserName = (() => {
    if (initialValue?.name) {
      const [firstName = '', lastName = ''] = initialValue.name.split(' ');
      return { firstName, lastName };
    }
    return { firstName: '', lastName: '' };
  })();

  // Step의 상태
  const valueAtom = atom<UserName>(initial);

  // Step 값 → 서버 형식 변환
  const serializeAtom = atom((get) => {
    const { firstName, lastName } = get(valueAtom);
    return {
      name: `${firstName} ${lastName}`.trim(),
    };
  });

  // 유효성 검사
  const validateAtom = atom((get) => {
    const { firstName, lastName } = get(valueAtom);
    return firstName.length > 0 && lastName.length > 0;
  });

  return {
    valueAtom,
    serializeAtom,
    validateAtom,
  };
}
