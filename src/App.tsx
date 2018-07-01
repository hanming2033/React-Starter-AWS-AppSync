import * as React from 'react'
// *aws amplify imports - download from mobile hub
import Amplify, { Auth } from 'aws-amplify'
import awsconfig from './aws-exports'
// *aws appsync imports - download from AppSync
import { Rehydrated } from 'aws-appsync-react'
// other imports
import Nav from './components/MainFrame/Nav'
import { Switch, Route, Redirect } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import Login from './components/Auth/Login';


// grab configuration from mobilehub
Amplify.configure(awsconfig)

class Protected extends React.Component {
  public state = {
    loggedIn: false
  }

  public componentDidMount() {
    Auth.currentSession()
      .then(() => this.setState({ loggedIn: true }))
      .catch(err => console.log(err))
  }

  public render() {
    return (
      <>
        <h3>private</h3>
        {this.state.loggedIn ? <button onClick={() => Auth.signOut()}>logout</button> : null}
      </>
    )
  }
}
const Public = () => <h3>public</h3>

const AuthProxy = {
  authenticated: false,
  checkAuthState: async () => {
    try {
      await Auth.currentSession()
      AuthProxy.authenticated = true
    } catch (err) {
      console.log(err)
    }
  }
}

class ProtectedRoute extends React.Component<any, any> {
  public render() {
    AuthProxy.checkAuthState()
    const { component: Component, ...rest } = this.props as any
    return <Route {...rest} render={props => (AuthProxy.authenticated ? <Component {...props} /> : <Redirect to="/signin" />)} />
  }
}

export class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <Rehydrated>
          <Nav />
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

// import { VerifyContact, withAuthenticator } from 'aws-amplify-react'
// import SignIn from './components/Auth/SignIn'
// import SignUp from './components/Auth/SignUp'
// import SignupConfirm from './components/Auth/SignupConfirm'
// import ForgotPassword from './components/Auth/ForgotPassword'
// import RequireNewPassword from './components/Auth/RequireNewPassword'
// import SigninConfirm from './components/Auth/SigninConfirm'

export default App

// withAuthenticator(App, true, [
//   // tslint:disable-next-line:jsx-key
//   <SignIn />,
//   // tslint:disable-next-line:jsx-key
//   <SigninConfirm />,
//   // tslint:disable-next-line:jsx-key
//   <VerifyContact />,
//   // tslint:disable-next-line:jsx-key
//   <SignUp />,
//   // tslint:disable-next-line:jsx-key
//   <SignupConfirm />,
//   // tslint:disable-next-line:jsx-key
//   <ForgotPassword />,
//   // tslint:disable-next-line:jsx-key
//   <RequireNewPassword />
// ])
