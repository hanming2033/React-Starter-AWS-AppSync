import * as React from 'react'
import * as enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import SignIn, { FormikSignIn } from './SignIn'
import { Query, QueryResult } from 'react-apollo'
import { qryRes, apolloError, getLocalStateData } from '../../utils/testMocks'
import { GetLocalStatesQuery } from '../../data/graphql-types'

enzyme.configure({ adapter: new Adapter() })

// * always try to test component rendering instead of state unless rendering is happening in child components
// * always try to test on interaction instead of state change unless interaction happens in child components
// * Group by feature. Each feature test on rendering and its interaction
// * -- rendering: how props and state(prefer interaction on component unless interaction happen in children) affect this component
// * -- interaction: how feature's interaction affect itself, other component, state(prefer rendering unless rendering in children), prop method call

describe('<SignIn /> Main Suite', () => {
  it('should render Loading... if local state has loading', () => {
    const toComp = jest.fn()
    const setAuth = jest.fn()
    const queryWrapper = enzyme.shallow(<SignIn toComp={toComp} setAuth={setAuth} />)
    const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, loading: true }
    const wrapper = enzyme.shallow(queryWrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
    expect(wrapper.find('[children="Loading..."]').length).toBe(1)
  })
  it('should render Error... if local state has error or no data', () => {
    const toComp = jest.fn()
    const setAuth = jest.fn()
    const queryWrapper = enzyme.shallow(<SignIn toComp={toComp} setAuth={setAuth} />)
    const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, error: apolloError }
    const wrapper = enzyme.shallow(queryWrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
    expect(wrapper.find('[children="Error..."]').length).toBe(1)
  })
  describe('h1 Sign In Suite', () => {
    it('should render h1 with text Sign In', () => {
      const toComp = jest.fn()
      const setAuth = jest.fn()
      const queryWrapper = enzyme.shallow(<SignIn toComp={toComp} setAuth={setAuth} />)
      const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
      const wrapper = enzyme.shallow(queryWrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
      expect(wrapper.find('[children="Sign In"]').length).toBe(1)
    })
  })
  describe('Forgot Password Button Suite', () => {
    it('should render Forgot Password', () => {
      const toComp = jest.fn()
      const setAuth = jest.fn()
      const queryWrapper = enzyme.shallow(<SignIn toComp={toComp} setAuth={setAuth} />)
      const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
      const wrapper = enzyme.shallow(queryWrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
      expect(wrapper.find('[children="Forgot Password"]').length).toBe(1)
    })
    it('should call toComp(propMethod) with args: forgotPassword', () => {
      const toComp = jest.fn()
      const setAuth = jest.fn()
      const queryWrapper = enzyme.shallow(<SignIn toComp={toComp} setAuth={setAuth} />)
      const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
      const wrapper = enzyme.shallow(queryWrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
      wrapper.find('[children="Forgot Password"]').simulate('click')
      expect(toComp.mock.calls[0][0]).toBe('forgotPassword')
    })
  })
  describe('To Sign Up Button Suite', () => {
    it('should render Go To SignUp', () => {
      const toComp = jest.fn()
      const setAuth = jest.fn()
      const queryWrapper = enzyme.shallow(<SignIn toComp={toComp} setAuth={setAuth} />)
      const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
      const wrapper = enzyme.shallow(queryWrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
      expect(wrapper.find('[children="Go To SignUp"]').length).toBe(1)
    })
    it('should call toComp(propMethod) with args: signUp', () => {
      const toComp = jest.fn()
      const setAuth = jest.fn()
      const queryWrapper = enzyme.shallow(<SignIn toComp={toComp} setAuth={setAuth} />)
      const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
      const wrapper = enzyme.shallow(queryWrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
      wrapper.find('[children="Go To SignUp"]').simulate('click')
      expect(toComp.mock.calls[0][0]).toBe('signUp')
    })
  })
})

// * always try to test component rendering instead of state unless rendering is happening in child components
// * always try to test on interaction instead of state change unless interaction happens in child components
// * Group by feature. Each feature test on rendering and its interaction
// * -- rendering: how props and state(prefer interaction on component unless interaction happen in children) affect this component
// * -- interaction: how feature's interaction affect itself, other component, state(prefer rendering unless rendering in children), prop method call

describe('<Formik SignIn /> Main Suite', () => {
  it('test', () => {
    const subtmitFn = jest.fn()
    const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
    const wrapper = enzyme.shallow(FormikSignIn(newRes, subtmitFn, {} as any))
    wrapper.setState({ touched: { email: true }, errors: { email: 'error' } })
    console.log(wrapper.state())
    console.log(wrapper.debug())
  })
  describe('Feature 1 Suite', () => {
    it('should render something on some props', () => {})
    it('should render something on some state', () => {})
  })
  describe('Feature 2 Suite', () => {
    it('should call prop method with args xxx', () => {})
    it('should cause component x to render', () => {})
    it('should cause state to change to xxx', () => {})
  })
})
