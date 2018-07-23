import * as React from 'react'
import * as enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import enzymeSerializer from 'enzyme-to-json/serializer'
import ForgotPassword, { FormikRequestCode } from './ForgotPassword'
import { Query, QueryResult } from 'react-apollo'
import { qryRes, apolloError, getLocalStateData } from '../../utils/testMocks'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import wait from 'waait'

expect.addSnapshotSerializer(enzymeSerializer)
enzyme.configure({ adapter: new Adapter() })

describe('<ForgotPassword /> Main Suite', () => {
  it('snapshot on loading state', () => {
    const queryWrapper = enzyme.shallow(<ForgotPassword toComp={jest.fn()} />)
    const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, loading: true }
    const wrapper = enzyme.shallow(queryWrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
    expect(wrapper).toMatchSnapshot()
  })
  it('snapshot on error state', () => {
    const queryWrapper = enzyme.shallow(<ForgotPassword toComp={jest.fn()} />)
    const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, error: apolloError }
    const wrapper = enzyme.shallow(queryWrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
    expect(wrapper).toMatchSnapshot()
  })
  it('snapshot on default state : request code', () => {
    const queryWrapper = enzyme.shallow(<ForgotPassword toComp={jest.fn()} />)
    const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
    const wrapper = enzyme.shallow(<div>{queryWrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>}</div>)
    expect(wrapper).toMatchSnapshot()
  })
  it('snapshot on default state : reset code', async () => {
    const queryWrapper = enzyme.shallow(<ForgotPassword toComp={jest.fn()} />)
    const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
    queryWrapper.setState({ delivery: { error: 'error' } })
    const wrapper = enzyme.shallow(<div>{queryWrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>}</div>)
    queryWrapper.update()
    expect(wrapper).toMatchSnapshot()
  })
  describe('Back to Sign In Button Suite', () => {
    describe('Interactions', () => {
      // how interaction on this feature affects itself, other component, state(rendering in children), prop method call
      it('should call toComp with args signIn', () => {
        const toComp = jest.fn()
        const queryWrapper = enzyme.shallow(<ForgotPassword toComp={toComp} />)
        const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
        const wrapper = enzyme.shallow(<div>{queryWrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>}</div>)
        wrapper.find('button').simulate('click')
        expect(toComp).toBeCalledWith('signIn')
      })
    })
  })
})

describe('<FormikRequestCode /> Main Suite', () => {
  // rendering based on different state and props of main component
  // test here is state and props does not directly affects children
  // test here is state and props affects more than 1 children
  it('snapshot on default state', () => {
    const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
    const wrapper = enzyme.mount(FormikRequestCode(newRes, jest.fn(), jest.fn()))
    expect(wrapper).toMatchSnapshot()
  })
  describe('Email Input Suite', () => {
    describe('Static/Conditional Rendering', () => {
      it('snapshot on qryRes has email:"a@b.c" as email input', () => {
        const newRes: QueryResult<GetLocalStatesQuery> = {
          ...qryRes,
          data: { ...getLocalStateData, forms: { __typename: 'forms', input_Email: 'a@b.c' } }
        }
        const wrapper = enzyme.mount(FormikRequestCode(newRes, jest.fn(), jest.fn()))
        expect(wrapper.find('input[name="email"]')).toMatchSnapshot()
      })
    })
    describe('Interactions', () => {
      // how interaction on this feature affects itself, other component, state(rendering in children), prop method call
      it('should render "Email is required" error on blur ', async () => {
        const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
        const wrapper = enzyme.mount(FormikRequestCode(newRes, jest.fn(), jest.fn()))
        wrapper.find('input[name="email"]').simulate('change', { persist: () => undefined, target: { name: 'email', value: '' } })
        wrapper.find('input[name="email"]').simulate('blur', { persist: () => undefined, target: { name: 'email' } })
        await wait(0)
        wrapper.update()
        expect(wrapper.find('[children="Email is required"]').length).toBe(1)
      })
      it('should render "hello" on simulate change', async () => {
        const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
        const wrapper = enzyme.mount(FormikRequestCode(newRes, jest.fn(), jest.fn()))
        wrapper.find('input[name="email"]').simulate('change', { persist: () => undefined, target: { name: 'email', value: 'hello' } })
        wrapper.find('input[name="email"]').simulate('blur', { persist: () => undefined, target: { name: 'email' } })
        await wait(0)
        wrapper.update()
        expect(wrapper.find('input[name="email"]').props().value).toBe('hello')
      })
      it('should render "Not a valid email" error on invalid email & blur', async () => {
        const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
        const wrapper = enzyme.mount(FormikRequestCode(newRes, jest.fn(), jest.fn()))
        wrapper.find('input[name="email"]').simulate('change', { persist: () => undefined, target: { name: 'email', value: 'hello' } })
        wrapper.find('input[name="email"]').simulate('blur', { persist: () => undefined, target: { name: 'email' } })
        await wait(0)
        wrapper.update()
        expect(wrapper.find('[children="Not a valid email"]').length).toBe(1)
      })
      it('should render no error on valid email & blur', async () => {
        const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: getLocalStateData }
        const wrapper = enzyme.mount(FormikRequestCode(newRes, jest.fn(), jest.fn()))
        wrapper
          .find('input[name="email"]')
          .simulate('change', { persist: () => undefined, target: { name: 'email', value: 'hello@hi.com' } })
        wrapper.find('input[name="email"]').simulate('blur', { persist: () => undefined, target: { name: 'email' } })
        await wait(0)
        wrapper.update()
        expect(wrapper.find('[children="Not a valid email"]').length).toBe(0)
        expect(wrapper.find('[children="Email is required"]').length).toBe(0)
      })
    })
  })
})
