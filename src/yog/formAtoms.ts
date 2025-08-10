import { atom } from 'jotai';
import { accountSerializeAtom, accountValidateAtom } from './AccountStep';
import { userNameSerializeAtom, userNameValidateAtom } from './UserNameStep';

export const formPayloadAtom = atom((get) => {
  return {
    ...get(userNameSerializeAtom),
    ...get(accountSerializeAtom),
  };
});

export const formValidateAtom = atom((get) => {
  return get(userNameValidateAtom) && get(accountValidateAtom);
});
