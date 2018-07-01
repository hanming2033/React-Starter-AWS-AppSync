import { Route, RouteProps, RouteComponentProps, StaticContext } from 'react-router'
import React from 'react'
import { AuthProxy } from './AuthProxy'
import Login from './SignIn'
import ForgotPassword from './ForgotPassword'

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

interface IProtectedRouteState {
  isAuthenticated: boolean
  componentToShow: validComponents
}

class ProtectedRoute extends React.Component<IProtectedRouteProps & RouteProps, IProtectedRouteState> {
  public state = {
    isAuthenticated: false,
    componentToShow: 'signIn' as validComponents
  }

  public toggleAuth = () => {
    this.setState(prevState => ({
      isAuthenticated: !prevState.isAuthenticated
    }))
  }

  public changeComponentTo = (component: validComponents) => {
    this.setState({
      componentToShow: component
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
            toggleAuth={this.toggleAuth}
            referrer={location ? location.pathname : '/'}
          />
        )
      case 'forgotPassword':
        return <ForgotPassword {...props} changeComponentTo={this.changeComponentTo} />
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
