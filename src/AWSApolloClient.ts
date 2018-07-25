import { ApolloLink } from 'apollo-link'
// *aws amplify imports - download from mobile hub
import Amplify, { Auth } from 'aws-amplify'
import awsconfig from './aws-exports'
// *aws appsync imports - download from AppSync
import AWSAppSyncClient, { createAppSyncLink, createLinkWithCache } from 'aws-appsync/lib'
import { withClientState } from 'apollo-link-state'
import appSyncConfig from './AppSync'

// *configure using mobilehub export
Amplify.configure(awsconfig)

// import local state
import defaultState from './data/setup/DefaultState'
import typeDefs from './data/setup/TypeDefs'
import { mutationResolvers } from './data/resolvers/Mutations'

// create local state
const stateLink = createLinkWithCache((cache: any) =>
  withClientState({
    defaults: defaultState,
    resolvers: { ...mutationResolvers },
    typeDefs,
    cache
  })
)

// subscription is enabled by default
const appSyncLink = createAppSyncLink({
  url: appSyncConfig.graphqlEndpoint,
  region: appSyncConfig.region,
  auth: {
    type: appSyncConfig.authenticationType,
    apiKey: appSyncConfig.apiKey,
    // whenever appsync need to call backend, it will grab the token and verify user
    // congnito user group allows users to be grouped
    jwtToken: async () => (await Auth.currentSession()).getAccessToken().getJwtToken()
  },
  complexObjectsCredentials: ''
})

export const link = ApolloLink.from([stateLink, appSyncLink])

// client to write queries without being in a component
// disableOffline should be added in the first arg
export const client = new AWSAppSyncClient({} as any, { link } as any)
