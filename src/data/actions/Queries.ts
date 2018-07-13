// *add new global state step 4: add queries, mutations and subscriptions

import gql from 'graphql-tag'

export const GET_LOCAL_STATES = gql`
  query GetLocalStates {
    auth @client {
      __typename
      isAuthenticated
    }
    forms @client {
      __typename
      input_Email
    }
    nav @client {
      __typename
      nextPath
    }
  }
`
