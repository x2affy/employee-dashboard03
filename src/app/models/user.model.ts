// A description of the user object
export interface User {
  name: { first: string; last: string };
  email: string;
  login: { uuid: string };
  picture: { thumbnail: string; large?: string };
}
