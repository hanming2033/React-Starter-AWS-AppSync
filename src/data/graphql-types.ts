/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface SetAuthMutationVariables {
  status: boolean,
};

export interface SetAuthMutation {
  setAuth: boolean,
};

export interface GetLocalStatesQuery {
  auth:  {
    __typename: "auth",
    isAuthenticated: boolean,
  } | null,
  forms:  {
    __typename: "forms",
    input_Email: string,
  } | null,
  nav:  {
    __typename: "nav",
    nextPath: string,
  } | null,
};
