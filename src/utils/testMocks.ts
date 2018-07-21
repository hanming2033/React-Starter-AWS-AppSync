import { GetLocalStatesQuery } from '../data/graphql-types'
import { QueryResult } from 'react-apollo'
import { ApolloError } from 'apollo-client'
import { link } from '../AWSApolloClient'
import AWSAppSyncClient from 'aws-appsync/lib'

export const getLocalStateData: GetLocalStatesQuery = {
  auth: {
    __typename: 'auth',
    isAuthenticated: false
  },
  forms: {
    __typename: 'forms',
    input_Email: ''
  },
  nav: {
    __typename: 'nav',
    nextPath: ''
  }
}

export const stubClient = new AWSAppSyncClient({} as any, { link } as any)

export const qryRes: QueryResult<GetLocalStatesQuery> = {
  client: stubClient,
  data: undefined,
  error: undefined,
  loading: false,
  networkStatus: 7,
  startPolling: jest.fn(),
  stopPolling: jest.fn(),
  subscribeToMore: jest.fn(),
  variables: {},
  refetch: jest.fn(),
  fetchMore: jest.fn(),
  updateQuery: jest.fn()
}

export const apolloError: ApolloError = {
  name: 'error',
  message: 'error',
  graphQLErrors: [{ name: 'error', message: 'error' }],
  networkError: null,
  extraInfo: ''
}
