import * as React from 'react'
import * as enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import SignIn, { FormikSignIn } from './SignIn'
import { Query, QueryResult } from 'react-apollo'

import { qryRes, apolloError, getLocalStateData } from '../../utils/testMocks'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import wait from 'waait'

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

describe('<Formik SignIn /> Main Suite(Mounting)', () => {
  describe('Email Input Suite', async () => {
    const subtmitFn = jest.fn()
    it('should render "" if qyrRes has "" email field', () => {
      const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
      const mounted = enzyme.mount(FormikSignIn(newRes, subtmitFn, { toComp: jest.fn(), setAuth: jest.fn() }))
      const inputEmail = mounted.find('input[name="email"]')
      expect(inputEmail.props().value).toBe('')
    })
    it('should render "hanming2033@gmail.com" if qyrRes has "hanming2033@gmail.com" email field', () => {
      if (!getLocalStateData || !getLocalStateData.forms) return
      const newRes: QueryResult<GetLocalStatesQuery> = {
        ...qryRes,
        data: { ...getLocalStateData, forms: { ...getLocalStateData.forms, input_Email: 'hanming2033@gmail.com' } }
      }
      const mounted = enzyme.mount(FormikSignIn(newRes, subtmitFn, { toComp: jest.fn(), setAuth: jest.fn() }))
      const inputEmail = mounted.find('input[name="email"]')
      expect(inputEmail.props().value).toBe('hanming2033@gmail.com')
    })
    it('should render "abc" on input change "abc"', () => {
      const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
      const mounted = enzyme.mount(FormikSignIn(newRes, subtmitFn, { toComp: jest.fn(), setAuth: jest.fn() }))
      mounted.find('input[name="email"]').simulate('change', { persist: () => undefined, target: { name: 'email', value: 'abc' } })
      expect(mounted.find('input[name="email"]').props().value).toBe('abc')
    })
    it('should render "required error" on input change "" and blur', async () => {
      const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
      const mounted = enzyme.mount(FormikSignIn(newRes, subtmitFn, { toComp: jest.fn(), setAuth: jest.fn() }))
      mounted.find('input[name="email"]').simulate('change', { persist: () => undefined, target: { name: 'email', value: '' } })
      mounted.find('input[name="email"]').simulate('blur', { persist: () => undefined, target: { name: 'email' } })
      await wait(0)
      mounted.update()
      expect(mounted.find('[children="Email is required"]').length).toBe(1)
    })
    it('should render "not valid email error" on input change "abc" and blur', async () => {
      const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
      const mounted = enzyme.mount(FormikSignIn(newRes, subtmitFn, { toComp: jest.fn(), setAuth: jest.fn() }))
      mounted.find('input[name="email"]').simulate('change', { persist: () => undefined, target: { name: 'email', value: 'abc' } })
      mounted.find('input[name="email"]').simulate('blur', { persist: () => undefined, target: { name: 'email' } })
      await wait(0)
      mounted.update()
      expect(mounted.find('[children="Not a valid email"]').length).toBe(1)
    })
  })
  describe('Password Input Suite', () => {
    const subtmitFn = jest.fn()
    const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
    const mounted = enzyme.mount(FormikSignIn(newRes, subtmitFn, { toComp: jest.fn(), setAuth: jest.fn() }))
    it('should render "" if qyrRes has "" password field', () => {
      expect(mounted.find('input[name="password"]').props().value).toBe('')
    })
    it('should render "abc" on input change "abc"', () => {
      mounted.find('input[name="password"]').simulate('change', { persist: () => undefined, target: { name: 'password', value: 'abc' } })
      expect(mounted.find('input[name="password"]').props().value).toBe('abc')
    })
    it('should render "required error" on input change "" and blur', async () => {
      mounted.find('input[name="password"]').simulate('change', { persist: () => undefined, target: { name: 'password', value: '' } })
      mounted.find('input[name="password"]').simulate('blur', { persist: () => undefined, target: { name: 'password' } })
      await wait(0)
      mounted.update()
      expect(mounted.find('[children="Password is required"]').length).toBe(1)
    })
    it('should render "too short error" on input change "abc" and blur', async () => {
      mounted.find('input[name="password"]').simulate('change', { persist: () => undefined, target: { name: 'password', value: 'abc' } })
      mounted.find('input[name="password"]').simulate('blur', { persist: () => undefined, target: { name: 'password' } })
      await wait(0)
      mounted.update()
      expect(mounted.find('[children="Minimum 6 characters"]').length).toBe(1)
      console.log(mounted.debug())
    })
  })
  describe('Submit Button Suite', () => {
    it('should render a button with "Sign In"', () => {
      const subtmitFn = jest.fn()
      const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
      const mounted = enzyme.mount(FormikSignIn(newRes, subtmitFn, { toComp: jest.fn(), setAuth: jest.fn() }))
      expect(mounted.find('button').text()).toBe('Sign In')
    })
    it('should have disable state = false initially', () => {
      const subtmitFn = jest.fn()
      const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
      const mounted = enzyme.mount(FormikSignIn(newRes, subtmitFn, { toComp: jest.fn(), setAuth: jest.fn() }))
      expect(mounted.find('button').props().disabled).toBe(false)
    })
    it('should call submitFn on click', () => {
      const subtmitFn = jest.fn()
      const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
      const mounted = enzyme.mount(FormikSignIn(newRes, subtmitFn, { toComp: jest.fn(), setAuth: jest.fn() }))
      console.log(mounted.state())
      mounted.find('button').simulate('click')
      expect(subtmitFn).toBeCalled()
    })
    it('should disable the button on click', () => {})
  })
})

// describe('Mounting', () => {
//   it('should render form', async () => {
//     const subtmitFn = jest.fn()
//     const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
//     const mounted = enzyme.mount(FormikSignIn(newRes, subtmitFn, { toComp: jest.fn(), setAuth: jest.fn() }))
//     mounted
//       .find('input[name="email"]')
//       .simulate('change', { persist: () => undefined, target: { name: 'email', value: 'hanming@gmail.com' } })
//     console.log(mounted.state())
//     mounted.find('input[name="email"]').simulate('blur', { persist: () => undefined, target: { name: 'email' } })
//     await wait(0)
//     console.log(mounted.state())
//     // mounted.find('button').simulate('click')
//     mounted.update()
//     console.log(mounted.debug())
//   })
// })
