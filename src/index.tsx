import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import { ApolloProvider } from 'react-apollo'
// *aws appsync imports - download from AppSync
import { Rehydrated } from 'aws-appsync-react'
import { client } from './AWSApolloClient'

ReactDOM.render(
  <ApolloProvider client={client}>
    <Rehydrated>
      <App />
    </Rehydrated>
  </ApolloProvider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
