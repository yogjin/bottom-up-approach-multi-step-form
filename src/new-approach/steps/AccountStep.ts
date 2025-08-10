import { atom } from 'jotai';
import type { Account, FormPayload } from '../types';

export function createAccountStep(initialValue?: FormPayload) {
  // 초기값 설정 (이미 서버 형식과 동일)
  const initial: Account = {
    email: initialValue?.email || '',
    password: initialValue?.password || ''
  };
  
  const valueAtom = atom<Account>(initial);
  
  const serializeAtom = atom((get) => {
    const { email, password } = get(valueAtom);
    return { email, password };
  });
  
  const validateAtom = atom((get) => {
    const { email, password } = get(valueAtom);
    return email.includes('@') && password.length >= 8;
  });
  
  return { 
    valueAtom, 
    serializeAtom, 
    validateAtom 
  };
}