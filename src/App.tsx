import * as React from 'react'
// *aws amplify imports - download from mobile hub
import Amplify from 'aws-amplify'
import awsconfig from './aws-exports'
// *aws appsync imports - download from AppSync
import { Rehydrated } from 'aws-appsync-react'
// other imports
import Nav from './components/MainFrame/Nav'
import { Switch, Route, withRouter } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import Login from './components/Auth/SignIn'
import { AuthProxy } from './components/Auth/AuthProxy'
import ProtectedRoute from './components/Auth/AuthenticatorRouter'

// grab configuration from mobilehub
Amplify.configure(awsconfig)

const Public = () => <h3>public</h3>

class Protected extends React.Component {
  public render() {
    return (
      <>
        <h3>private</h3>
      </>
    )
  }
}

const AuthButton = withRouter(
  ({ history }) =>
    true ? (
      <p>
        Welcome! <button onClick={() => AuthProxy.signOut().then(() => history.replace('/'))}>Sign Out</button>{' '}
      </p>
    ) : (
      <p>You are not logged in</p>
    )
)

export class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <Rehydrated>
          <Nav />
          <AuthButton />
          <Switch>
            <ProtectedRoute exact path="/protected" component={Protected} />
            <Route exact path="/public" component={Public} />
            <Route exact path="/signin" component={Login} />
          </Switch>
        </Rehydrated>
      </BrowserRouter>
    )
  }
}

export default App
