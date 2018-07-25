import { Route, RouteProps, RouteComponentProps, StaticContext, Redirect } from 'react-router'
import React from 'react'
import { AuthProxy } from './AuthProxies/AuthProxy'
import Signin from './SignIn'
import Forgot from './ForgotPassword'
import RequireNewPassword from './RequireNewPassword'
import Signup from './SignUp'
import SignupConfirm from './SignupConfirm'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import { GetLocalStatesQuery, SetAuthMutation } from '../../data/graphql-types'
import { ChildProps, graphql, compose } from 'react-apollo'
import VerifyContact from './VerifyContact'
import { IVerification, ICognitoUser } from './AuthProxies/AuthTypes'
import { SET_AUTH } from '../../data/actions/Mutations'
import { JS } from 'aws-amplify'

interface IAuthenticatorProps {
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

export type TtoComp = (newComponent: validComponents, userData?: ICognitoUser) => void
export type TsetAuth = (verification: IVerification) => void

interface IProtectedRouteState {
  userData: ICognitoUser | null
  componentToShow: validComponents
  verification: IVerification
}

export class Authenticator extends React.Component<
  ChildProps<IAuthenticatorProps & RouteProps, GetLocalStatesQuery & SetAuthMutation>,
  IProtectedRouteState
> {
  public state = {
    userData: null,
    componentToShow: 'signUp' as validComponents,
    verification: { verified: {}, unverified: {} }
  }

  public toComp: TtoComp = (component, userData) => {
    this.setState({
      componentToShow: component,
      userData: userData ? userData : this.state.userData
    })
  }

  public setAuth = (verification: IVerification) => {
    const isAuthenticated = !JS.isEmpty(verification.verified)
    this.toComp('verifyContact')
    if (!this.props.mutate) return
    this.props.mutate({ variables: { status: isAuthenticated } })
  }

  public componentDidMount() {
    AuthProxy.checkAuthState()
      .then(res => {
        // console.log('Authenticator Router On Mount: ', res)
        return res
      })
      .then(res => {
        if (!res.data) return
        AuthProxy.verifyUser(res.data.user).then(verification => {
          if (res.data) {
            this.setAuth(verification)
          } else {
            this.setAuth({ verified: {}, unverified: {} })
          }
        })
      })
  }

  public render() {
    const { component: Component, data, ...rest } = this.props
    const { componentToShow } = this.state
    if (!data || !data.auth) return null
    if (data.auth.isAuthenticated && this.props.path === '/authenticate') return <Redirect to="/" />
    if (data.auth.isAuthenticated) return <Route {...rest} render={props => <Component {...props} />} />
    if (componentToShow === 'signIn')
      return <Route {...rest} render={props => <Signin setAuth={this.setAuth} {...props} toComp={this.toComp} />} />
    if (componentToShow === 'signUp') return <Route {...rest} render={props => <Signup {...props} toComp={this.toComp} />} />
    if (componentToShow === 'forgotPassword') return <Route {...rest} render={props => <Forgot {...props} toComp={this.toComp} />} />
    if (componentToShow === 'confirmSignUp') return <Route {...rest} render={props => <SignupConfirm {...props} toComp={this.toComp} />} />
    if (componentToShow === 'requireNewPassword')
      return (
        <Route
          {...rest}
          render={props => <RequireNewPassword setAuth={this.setAuth} {...props} userData={this.state.userData} toComp={this.toComp} />}
        />
      )
    if (componentToShow === 'verifyContact') return <Route {...rest} render={props => <VerifyContact {...props} />} />
    return 'Not Authenticated!' // dummy output
  }
}

export default compose(
  graphql<IAuthenticatorProps & RouteProps, GetLocalStatesQuery>(GET_LOCAL_STATES, { options: { fetchPolicy: 'network-only' } }),
  graphql<IAuthenticatorProps & RouteProps, SetAuthMutation>(SET_AUTH, {})
)(Authenticator)
