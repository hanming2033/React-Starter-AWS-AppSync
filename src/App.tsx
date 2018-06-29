import * as React from 'react'
// *aws amplify imports - download from mobile hub
import Amplify, { Auth } from 'aws-amplify'
import awsconfig from './aws-exports'
// *aws appsync imports - download from AppSync
import { Rehydrated } from 'aws-appsync-react'
// other imports
import Nav from './components/MainFrame/Nav'
import { Switch, Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

// grab configuration from mobilehub
Amplify.configure(awsconfig)

const Protected = () => {
  return (
    <>
      <button onClick={() => Auth.signOut()}>logout</button>
      <h3>private</h3>
    </>
  )
}
const Public = () => <h3>public</h3>

export class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <Rehydrated>
          <Nav />
          <Switch>
            <Route exact path="/protected" component={Protected} />
            <Route exact path="/public" component={Public} />
          </Switch>
        </Rehydrated>
      </BrowserRouter>
    )
  }
}

// import { withAuthenticator } from "aws-amplify-react";
import { ConfirmSignIn, VerifyContact, withAuthenticator } from 'aws-amplify-react'
import SignIn from './components/Auth/SignIn'
import SignUp from './components/Auth/SignUp'
import SignupConfirm from './components/Auth/SignupConfirm';
import ForgotPassword from './components/Auth/ForgotPassword';
// can use withAuthenticator(App) to set up fully automated auth flow. need to redo css
export default withAuthenticator(App, true, [
  // tslint:disable-next-line:jsx-key
  <SignIn />,
  // tslint:disable-next-line:jsx-key
  <ConfirmSignIn />,
  // tslint:disable-next-line:jsx-key
  <VerifyContact />,
  // tslint:disable-next-line:jsx-key
  <SignUp />,
  // tslint:disable-next-line:jsx-key
  <SignupConfirm />,
  // tslint:disable-next-line:jsx-key
  <ForgotPassword />
])
