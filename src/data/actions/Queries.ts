// *add new global state step 4: add queries, mutations and subscriptions

import gql from 'graphql-tag'

export const GET_LOCAL_STATES = gql`
  query GetLocalStates {
    forms @client {
      __typename
      input_Email
    }
  }
`
