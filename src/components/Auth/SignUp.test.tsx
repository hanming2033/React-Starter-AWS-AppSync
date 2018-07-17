import * as React from 'react'
import * as enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import SignUp from './SignUp'
import { Query, QueryResult } from 'react-apollo'
// import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import { client } from '../../index'
import { GetLocalStatesQuery } from '../../data/graphql-types'

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

const qryRes: QueryResult = {
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

describe('<SignUp />', () => {
  it('should have a h3 title Private', () => {
    const wrapper = enzyme.shallow(<SignUp toComp={toCompFn} />).prop('children')({ data })
    // const queryWrapper = enzyme.shallow(
    //   wrapper
    //     .find(Query)
    //     .setProps({ query: GET_LOCAL_STATES, client })
    //     .prop('children')
    // )

    // console.log(wrapper.debug())
    // expect(wrapper.find('h1').text()).toMatch(/SignUp/)
  })
})
