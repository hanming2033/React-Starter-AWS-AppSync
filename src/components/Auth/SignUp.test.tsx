import * as React from 'react'
import * as enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import SignUp, { FormikSignUp } from './SignUp'
import { Query, QueryResult } from 'react-apollo'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { client } from '../../AWSApolloClient'
import { ApolloError } from 'apollo-client'
import { Formik } from 'formik'

enzyme.configure({ adapter: new Adapter() })

// *stubs start
const data: GetLocalStatesQuery = {
  auth: {
    __typename: 'auth',
    isAuthenticated: false
  },
  forms: {
    __typename: 'forms',
    input_Email: ''
  },
  nav: {
    __typename: 'nav',
    nextPath: ''
  }
}

const qryRes: QueryResult<GetLocalStatesQuery> = {
  client,
  data: undefined,
  error: undefined,
  loading: false,
  networkStatus: 7,
  startPolling: jest.fn(),
  stopPolling: jest.fn(),
  subscribeToMore: jest.fn(),
  variables: {},
  refetch: jest.fn(),
  fetchMore: jest.fn(),
  updateQuery: jest.fn()
}

const apolloError: ApolloError = {
  name: 'error',
  message: 'error',
  graphQLErrors: [{ name: 'error', message: 'error' }],
  networkError: null,
  extraInfo: ''
}
// *stubs end

describe('<SignUp /> Main Suite', () => {
  describe('static rendering on loading state', () => {
    const toCompFn = jest.fn()
    it('should render Loading... text', () => {
      const wrapper = enzyme.shallow(<SignUp toComp={toCompFn} />)
      const newRes = { ...qryRes, loading: true }
      const queryWrapper = enzyme.shallow(wrapper.find(Query).prop('children')(newRes) as React.ReactElement<any>)
      expect(queryWrapper.find('h3').text()).toBe('Loading...')
    })
  })
  describe('static rendering on error state', () => {
    const toCompFn = jest.fn()
    let wrapper: enzyme.ShallowWrapper
    beforeEach(() => {
      wrapper = enzyme.shallow(<SignUp toComp={toCompFn} />)
    })
    it('should render Error... text on error', () => {
      const newRes = { ...qryRes, loading: false, error: apolloError }
      const queryWrapper = enzyme.shallow(wrapper.find(Query).prop('children')(newRes) as React.ReactElement<any>)
      expect(queryWrapper.find('h3').text()).toBe('Error...')
    })
    it('should render Error... text on no data', () => {
      const newRes = { ...qryRes, loading: false, error: undefined, data: undefined }
      const queryWrapper = enzyme.shallow(wrapper.find(Query).prop('children')(newRes) as React.ReactElement<any>)
      expect(queryWrapper.find('h3').text()).toBe('Error...')
    })
  })
  describe('static rendering on success state', () => {
    const toCompFn = jest.fn()
    let wrapper: enzyme.ShallowWrapper
    let queryWrapper: enzyme.ShallowWrapper
    beforeEach(() => {
      wrapper = enzyme.shallow(<SignUp toComp={toCompFn} />)
      const newRes = { ...qryRes, loading: false, error: undefined, data }
      queryWrapper = enzyme.shallow(wrapper.find(Query).prop('children')(newRes) as React.ReactElement<any>)
    })
    it('should render SignUp Title', () => {
      expect(queryWrapper.find('h1').text()).toBe('Sign Up')
    })
    it('should render formik component', () => {
      expect(queryWrapper.find(Formik)).toHaveLength(1)
    })
    it('should render ConfirmCode Button', () => {
      expect(queryWrapper.find('button[children="Confirm a Code"]')).toHaveLength(1)
    })
    it('should render GoToLogin Button', () => {
      expect(queryWrapper.find('button[children="Go to SignIn"]')).toHaveLength(1)
    })
  })

  // describe('dynamic rendering on props and states', () => {})

  describe('interactions', () => {
    it('should call toComp with arg confirmSignUp on ConfirmCode button click', () => {
      const toCompFn = jest.fn()
      const wrapper = enzyme.shallow(<SignUp toComp={toCompFn} />)
      const newRes = { ...qryRes, loading: false, error: undefined, data }
      const queryWrapper = enzyme.shallow(wrapper.find(Query).prop('children')(newRes) as React.ReactElement<any>)
      queryWrapper.find('[children="Confirm a Code"]').simulate('click')
      expect(toCompFn.mock.calls[0][0]).toBe('confirmSignUp')
    })
    it('should call toComp with arg signIn on GoToSignIn button click', () => {
      const toCompFn = jest.fn()
      const wrapper = enzyme.shallow(<SignUp toComp={toCompFn} />)
      const newRes = { ...qryRes, loading: false, error: undefined, data }
      const queryWrapper = enzyme.shallow(wrapper.find(Query).prop('children')(newRes) as React.ReactElement<any>)
      queryWrapper.find('[children="Go to SignIn"]').simulate('click')
      expect(toCompFn.mock.calls[0][0]).toBe('signIn')
    })
    it('should call toComp twice', () => {
      const toCompFn = jest.fn()
      const wrapper = enzyme.shallow(<SignUp toComp={toCompFn} />)
      const newRes = { ...qryRes, loading: false, error: undefined, data }
      const queryWrapper = enzyme.shallow(wrapper.find(Query).prop('children')(newRes) as React.ReactElement<any>)
      queryWrapper.find('[children="Confirm a Code"]').simulate('click')
      queryWrapper.find('[children="Go to SignIn"]').simulate('click')
      expect(toCompFn.mock.calls.length).toBe(2)
    })
  })
})

describe('Formik Main Suite', () => {
  describe('static rendering', () => {
    const signUpSubmit = jest.fn()
    const wrapper = enzyme.shallow(FormikSignUp(qryRes, signUpSubmit))
    it('should render Email Input', () => {
      expect(wrapper.find('[name="email"]')).toHaveLength(1)
    })
    it('should render Password Input', () => {
      expect(wrapper.find('[name="password"]')).toHaveLength(1)
    })
    it('should render Phone Number Input', () => {
      expect(wrapper.find('[name="phone"]')).toHaveLength(1)
    })
    it('should render SignUp Button', () => {
      expect(wrapper.find('[children="Sign Up"]')).toHaveLength(1)
    })
  })

  describe('dynamic rendering on props and states', () => {
    const signUpSubmit = jest.fn()
    it('should have state.email "" by default', () => {
      if (!data || !data.forms) return
      const newData: GetLocalStatesQuery = { ...data, forms: { ...data.forms } }
      const newRes: QueryResult<GetLocalStatesQuery> = { ...qryRes, data: newData }
      const wrapper = enzyme.shallow(FormikSignUp(newRes, signUpSubmit))
      expect(wrapper.state()).toEqual(data)
      console.log(wrapper.state())
    })
    it('should render abc@abc.com with email passed in for Email Input', () => {})
  })

  describe('interactions', () => {
    it('should call async function on SignUp button click', () => {})
  })
})
