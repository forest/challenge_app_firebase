export namespace Types {
  export interface IChallenge {
    key: string;
    name: string;
    members: {} | Array<IUserProfile>;
  }

  export interface IUserProfile {
    key: string;
    // firstName: string;
    // lastName: string;
    email: string;
    name: string;
    photoURL: string;
    challenges: {} | Array<IChallenge>;
  }

  export interface IAuthenticatedUser {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    providerData: Array<any>;
  }
}