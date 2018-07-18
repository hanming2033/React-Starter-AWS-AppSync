import * as React from 'react'
import * as enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import SignUp, { FormikSignUp } from './SignUp'
import { Query, QueryResult } from 'react-apollo'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { client } from '../../AWSApolloClient'

enzyme.configure({ adapter: new Adapter() })

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
  data,
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

const toCompFn = jest.fn()

describe('<SignUp /> Main Suite', () => {
  describe('static rendering', () => {
    describe('rendering on loading state', () => {
      it('should render Loading... text', () => {})
    })
    describe('rendering on error state', () => {
      it('should render Error... text on error', () => {})
      it('should render Error... text on no data', () => {})
    })
    describe('rendering on success state', () => {
      it('should render SignUp Title', () => {})
      it('should render formik component', () => {})
      it('should render ConfirmCode Button', () => {})
      it('should render GoToLogin Button', () => {})
    })
  })

  // describe('dynamic rendering on props and states',() => {})

  describe('interactions', () => {
    it('should call toComp with arg confirmSignUp on ConfirmCode button click', () => {})
    it('should call toComp with arg signIn on GoToSignIn button click', () => {})
    // it('should call async function on SignUp button click'),()={})
  })

  it('should have a h3 title Private', () => {
    const dummyWrapper = enzyme.shallow(<SignUp toComp={toCompFn} />)
    const queryWrapper = enzyme.shallow(dummyWrapper.find(Query).prop('children')(qryRes) as React.ReactElement<any>)
    const formikWrapper = enzyme.shallow(FormikSignUp(null, qryRes, jest.fn()))
    // console.log(queryWrapper.debug())
    console.log(formikWrapper.debug())
    // expect(wrapper.find('undefined')).toHaveLength(1)
  })
})

describe('Formik Main Suite', () => {
  describe('static rendering', () => {
    it('should render Email Input', () => {})
    it('should render Password Input', () => {})
    it('should render Phone Number Input', () => {})
    it('should render SignUp Button', () => {})
  })

  describe('dynamic rendering on props and states', () => {
    it('should render "" by default for Email Input', () => {})
    it('should render abc@abc.com with email passed in for Email Input', () => {})
  })

  describe('interactions', () => {
    it('should call async function on SignUp button click', () => {})
  })
})
