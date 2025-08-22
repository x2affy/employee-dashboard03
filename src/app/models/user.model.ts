// A simple description of the user object we care about.
export interface User {
  name: { first: string; last: string };
  email: string;
  login: { uuid: string };
  picture: { thumbnail: string; large?: string };
}
