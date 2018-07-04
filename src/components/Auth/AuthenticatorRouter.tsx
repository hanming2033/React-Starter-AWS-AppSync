import { Route, RouteProps, RouteComponentProps, StaticContext } from 'react-router'
import React from 'react'
import { AuthProxy } from './AuthProxy'
import Login from './SignIn'
import ForgotPassword from './ForgotPassword'
import RequireNewPassword from './RequireNewPassword'

interface IProtectedRouteProps {
  component:
    | React.ComponentClass<RouteComponentProps<any, StaticContext>>
    | React.StatelessComponent<RouteComponentProps<any, StaticContext>>
    | React.ComponentClass<any>
    | React.StatelessComponent<any>
}

export type validComponents =
  | 'signIn'
  | 'confirmSignIn'
  | 'signUp'
  | 'confirmSignUp'
  | 'forgotPassword'
  | 'requireNewPassword'
  | 'verifyContact'
  | 'TOTPSetup'
// | 'signedOut'
// | 'signedUp'

export type TChangeComponent = (newComponent: validComponents, userData?: any) => void
export type TSetAuth = (isAuthenticated: boolean) => void

interface IProtectedRouteState {
  isAuthenticated: boolean
  authData: any
  componentToShow: validComponents
}

class ProtectedRoute extends React.Component<IProtectedRouteProps & RouteProps, IProtectedRouteState> {
  public state = {
    isAuthenticated: false,
    authData: null,
    componentToShow: 'signIn' as validComponents
  }

  public setAuth: TSetAuth = isAuthenticated => {
    this.setState({ isAuthenticated })
  }

  public changeComponentTo: TChangeComponent = (component, userData) => {
    this.setState({
      componentToShow: component,
      authData: userData ? userData : this.state.authData
    })
  }

  public componentDidMount() {
    AuthProxy.checkAuthState()
      .then(data =>
        this.setState({
          isAuthenticated: data.isAuthenticated
        })
      )
      .catch(() =>
        this.setState({
          isAuthenticated: false
        })
      )
  }

  public genAuthComp = (componentToShow: validComponents, props: any) => {
    switch (componentToShow) {
      case 'signIn':
        return (
          <Login
            {...props}
            changeComponentTo={this.changeComponentTo}
            setAuth={this.setAuth}
            referrer={location ? location.pathname : '/'}
          />
        )
      case 'forgotPassword':
        return <ForgotPassword {...props} changeComponentTo={this.changeComponentTo} />
      case 'requireNewPassword':
        return (
          <RequireNewPassword {...props} setAuth={this.setAuth} authData={this.state.authData} changeComponentTo={this.changeComponentTo} />
        )
      default:
        return null
    }
  }

  public render() {
    const { component: Component, location, ...rest } = this.props
    return (
      <Route
        {...rest}
        render={props => (this.state.isAuthenticated ? <Component {...props} /> : this.genAuthComp(this.state.componentToShow, props))}
      />
    )
  }
}

export default ProtectedRoute
