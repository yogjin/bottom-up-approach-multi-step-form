export enum Step {
  UserName = "UserName",
  Account = "Account"
}

export type FormPayload = {
  name: string;
  email: string;
  password: string;
};

export type UserName = {
  firstName: string;
  lastName: string;
};

export type Account = {
  email: string;
  password: string;
};