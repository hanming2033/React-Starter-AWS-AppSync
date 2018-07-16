import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import { ApolloProvider } from 'react-apollo'
import { ApolloLink } from 'apollo-link'
// *aws amplify imports - download from mobile hub
import Amplify, { Auth } from 'aws-amplify'
import awsconfig from './aws-exports'
// *aws appsync imports - download from AppSync
import { Rehydrated } from 'aws-appsync-react'
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

  // TODO: investigate this
  // disableOffline: true
})

const link = ApolloLink.from([stateLink, appSyncLink])

// TODO: investigate this
// client to write queries without being in a component
export const client = new AWSAppSyncClient({} as any, { link } as any)

ReactDOM.render(
  <ApolloProvider client={client}>
    <Rehydrated>
      <App />
    </Rehydrated>
  </ApolloProvider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
