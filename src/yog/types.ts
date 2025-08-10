export enum Step {
  UserName = 'UserName',
  Account = 'Account',
}

export type UserName = {
  lastName: string;
  firstName: string;
};

export type Account = {
  email: string;
  password: string;
};

export type FormPayload = {
  name: string;
  email: string;
  password: string;
};
