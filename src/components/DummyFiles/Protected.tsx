import * as React from 'react'
import { AuthProxy } from '../Auth/AuthProxy'
import { RouteComponentProps } from 'react-router'

class Protected extends React.Component<RouteComponentProps<{}>> {
  public render() {
    return (
      <>
        <h3>Private</h3>
        <p>
          Welcome! <button onClick={() => AuthProxy.signOut().then(() => this.props.history.replace('/'))}>Sign Out</button>{' '}
        </p>
      </>
    )
  }
}

export default Protected
