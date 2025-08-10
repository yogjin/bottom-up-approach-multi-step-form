import { atom, useAtom } from 'jotai';
import { UserName } from './types';

export const userNameAtom = atom<UserName>({
  lastName: '',
  firstName: '',
});

export const userNameSerializeAtom = atom((get) => {
  const { lastName, firstName } = get(userNameAtom);

  return {
    name: `${lastName} ${firstName}`,
  };
});

export const userNameValidateAtom = atom((get) => {
  const { lastName, firstName } = get(userNameAtom);

  return lastName.length > 0 && firstName.length > 0;
});

const UserNameStep = () => {
  const [value, setValue] = useAtom(userNameAtom);

  return (
    <div>
      <h2>1단계: 이름 입력</h2>
      <input
        value={value.lastName}
        onChange={(e) => setValue({ ...value, lastName: e.target.value })}
        placeholder="성 (예: 홍)"
      />
      <input
        value={value.firstName}
        onChange={(e) => setValue({ ...value, firstName: e.target.value })}
        placeholder="이름 (예: 길동)"
      />
    </div>
  );
};

export default UserNameStep;
