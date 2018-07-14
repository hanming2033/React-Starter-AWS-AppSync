// import { Route, RouteProps, RouteComponentProps, StaticContext } from 'react-router'
// import React from 'react'
// import { AuthProxy } from './AuthProxy'
// import Signin from './SignIn'
// import ForgotPassword from './ForgotPassword'
// import RequireNewPassword from './RequireNewPassword'
// import Signup from './SignUp'
// import SignupConfirm from './SignupConfirm'
// import { GET_LOCAL_STATES } from '../../data/actions/Queries'
// import { GetLocalStatesQuery } from '../../data/graphql-types'
// import { client } from '../../index'

// interface IProtectedRouteProps {
//   component:
//     | React.ComponentClass<RouteComponentProps<any, StaticContext>>
//     | React.StatelessComponent<RouteComponentProps<any, StaticContext>>
//     | React.ComponentClass<any>
//     | React.StatelessComponent<any>
// }

// export type validComponents =
//   | 'signIn'
//   | 'confirmSignIn'
//   | 'signUp'
//   | 'confirmSignUp'
//   | 'forgotPassword'
//   | 'requireNewPassword'
//   | 'verifyContact'
//   | 'TOTPSetup'

// export type TChangeComponent = (newComponent: validComponents, userData?: any) => void
// export type TSetAuth = (isAuthenticated: boolean) => void

// interface IProtectedRouteState {
//   isAuthenticated: boolean
//   authData: any
//   componentToShow: validComponents
// }

// class ProtectedRoute extends React.Component<IProtectedRouteProps & RouteProps, IProtectedRouteState> {
//   public state = {
//     isAuthenticated: false,
//     authData: null,
//     componentToShow: 'signUp' as validComponents
//   }

//   public setAuth: TSetAuth = isAuthenticated => {
//     const data: GetLocalStatesQuery | null = client.readQuery({ query: GET_LOCAL_STATES })
//     console.log(data)
//     if (!data) return
//     if (!data.auth) return
//     const newData: GetLocalStatesQuery = {
//       ...data,
//       auth: {
//         ...data.auth,
//         isAuthenticated
//       }
//     }
//     client.writeQuery({
//       query: GET_LOCAL_STATES,
//       data: newData
//     })
//     this.setState({ isAuthenticated })
//   }

//   public changeComponentTo: TChangeComponent = (component, userData) => {
//     this.setState({
//       componentToShow: component,
//       authData: userData ? userData : this.state.authData
//     })
//   }

//   public componentDidMount() {
//     AuthProxy.checkAuthState(this.changeComponentTo, this.setAuth)
//       .then(data =>
//         this.setState({
//           isAuthenticated: data.data ? true : false
//         })
//       )
//       .catch(() =>
//         this.setState({
//           isAuthenticated: false
//         })
//       )
//   }

//   public genAuthComp = (componentToShow: validComponents, props: any) => {
//     console.log('AuthenticatorRouter Switching routes... ', componentToShow)
//     switch (componentToShow) {
//       case 'signIn':
//         return (
//           <Signin
//             {...props}
//             toComp={this.changeComponentTo}
//             setAuth={this.setAuth}
//             referrer={location ? location.pathname : '/'}
//           />
//         )
//       case 'forgotPassword':
//         return <ForgotPassword {...props} changeComponentTo={this.changeComponentTo} />
//       case 'requireNewPassword':
//         return (
//           <RequireNewPassword {...props} setAuth={this.setAuth} authData={this.state.authData} changeComponentTo={this.changeComponentTo} />
//         )
//       case 'signUp':
//         return <Signup changeComponentTo={this.changeComponentTo} />
//       case 'confirmSignUp':
//         return <SignupConfirm changeComponentTo={this.changeComponentTo} />
//       default:
//         return null
//     }
//   }

//   public render() {
//     const { component: Component, ...rest } = this.props
//     return (
//       <Route
//         {...rest}
//         render={props => (this.state.isAuthenticated ? <Component {...props} /> : this.genAuthComp(this.state.componentToShow, props))}
//       />
//     )
//   }
// }

// export default ProtectedRoute
