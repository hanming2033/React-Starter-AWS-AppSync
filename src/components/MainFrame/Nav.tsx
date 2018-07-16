import * as React from 'react'
import { NavLink } from 'react-router-dom'

interface INavProps {}

const Nav: React.SFC<INavProps> = props => {
  return (
    <>
      <NavLink exact activeStyle={{ color: '#fa923f' }} to="/public">
        Public
      </NavLink>
      <div style={{ width: '20px', display: 'inline-block' }} />
      <NavLink exact activeStyle={{ color: '#fa923f' }} to="/protected">
        Protected
      </NavLink>
      <div style={{ width: '20px', display: 'inline-block' }} />
      <NavLink exact activeStyle={{ color: '#fa923f' }} to="/authenticate">
        Account
      </NavLink>
      <br />
      <br />
    </>
  )
}

export default Nav
