import * as React from 'react'
import { AuthProxy } from '../Auth/AuthProxy'
import { RouteComponentProps } from 'react-router'

class Protected extends React.Component<RouteComponentProps<{}>> {
  public render() {
    return (
      <>
        <h3>private</h3>
        <p>
          Welcome! <button onClick={() => AuthProxy.signOut().then(() => this.props.history.replace('/'))}>Sign Out</button>{' '}
        </p>
      </>
    )
  }
}

export default Protected

// const AuthButton = withRouter(
//   ({ history }) =>
//     true ? (
//       <p>
//         Welcome! <button onClick={() => AuthProxy.signOut().then(() => history.replace('/'))}>Sign Out</button>{' '}
//       </p>
//     ) : (
//       <p>You are not logged in</p>
//     )
// )
