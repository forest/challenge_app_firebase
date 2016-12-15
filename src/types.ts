export namespace Types {
  export interface IChallenge {
    key: string;
    name: string;
    members: {} | Array<IUserProfile>;
  }

  export interface IUserProfile {
    key: string;
    firstName: string;
    lastName: string;
    challenges: {} | Array<IChallenge>;
  }

  export interface IAuthenticatedUser {
    uid: string;
  }
}