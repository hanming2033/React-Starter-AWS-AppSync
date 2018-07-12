import * as React from 'react'

// other imports
import Nav from './components/MainFrame/Nav'
import { Switch, Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import Login from './components/Auth/SignIn'
import ProtectedRoute from './components/Auth/AuthenticatorRouter'
import Protected from './components/DummyFiles/Protected'
import Public from './components/DummyFiles/Public'
import Signup from './components/Auth/SignUp'

export class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <>
          <Nav />
          <Switch>
            <ProtectedRoute exact path="/protected" component={Protected} />
            <Route exact path="/public" component={Public} />
            <Route exact path="/signin" component={Login} />
            <Route exact path="/signup" component={Signup} />
          </Switch>
        </>
      </BrowserRouter>
    )
  }
}

export default App
