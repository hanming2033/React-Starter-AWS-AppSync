import { Route, RouteProps, RouteComponentProps, StaticContext, Redirect } from 'react-router'
import React from 'react'
import { AuthProxy } from './AuthProxy'
import Signin from './SignIn'
import Forgot from './ForgotPassword'
import RequireNewPassword from './RequireNewPassword'
import Signup from './SignUp'
import SignupConfirm from './SignupConfirm'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { Query } from 'react-apollo'

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

export type TChangeComponent = (newComponent: validComponents, userData?: any) => void
export type TSetAuth = (isAuthenticated: boolean) => void

interface IProtectedRouteState {
  authData: any
  componentToShow: validComponents
}

class ProtectedRoute extends React.Component<IProtectedRouteProps & RouteProps, IProtectedRouteState> {
  public state = {
    authData: null,
    componentToShow: 'signUp' as validComponents
  }

  public toComp: TChangeComponent = (component, userData) => {
    this.setState({
      componentToShow: component,
      authData: userData ? userData : this.state.authData
    })
  }

  public componentDidMount() {
    AuthProxy.checkAuthState().then(res => {
      console.log('Authenticator Router On Mount: ', res)
    })
  }

  public render() {
    const { component: Component, ...rest } = this.props
    return (
      <Query<GetLocalStatesQuery> query={GET_LOCAL_STATES} fetchPolicy="network-only">
        {qryRes => {
          if (qryRes.loading) return 'loading...'
          if (!qryRes || qryRes.error) return 'Error...'
          const { componentToShow } = this.state

          const authenticated = qryRes.data && qryRes.data.auth && qryRes.data.auth.isAuthenticated
          console.log('AuthenticatorRouter Switching routes... ', componentToShow)

          if (authenticated && this.props.path === '/authenticate') return <Redirect to="/" />
          if (authenticated) return <Route {...rest} render={props => <Component {...props} />} />
          if (componentToShow === 'signIn') return <Route {...rest} render={props => <Signin {...props} toComp={this.toComp} />} />
          if (componentToShow === 'signUp') return <Route {...rest} render={props => <Signup {...props} toComp={this.toComp} />} />
          if (componentToShow === 'forgotPassword') return <Route {...rest} render={props => <Forgot {...props} toComp={this.toComp} />} />
          if (componentToShow === 'confirmSignUp')
            return <Route {...rest} render={props => <SignupConfirm {...props} toComp={this.toComp} />} />
          if (componentToShow === 'requireNewPassword')
            return (
              <Route {...rest} render={props => <RequireNewPassword {...props} authData={this.state.authData} toComp={this.toComp} />} />
            )

          return 'Not Authenticated!' // dummy output
        }}
      </Query>
    )
  }
}

export default ProtectedRoute
