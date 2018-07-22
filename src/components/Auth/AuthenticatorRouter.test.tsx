import * as React from 'react'
import * as enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import enzymeSerializer from 'enzyme-to-json/serializer'
import { Query, QueryResult } from '../../../node_modules/react-apollo'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { qryRes, getLocalStateData, mtnRes } from '../../utils/testMocks'
import { Mutation } from 'react-apollo'
import { SET_AUTH } from '../../data/actions/Mutations'
import { Route } from 'react-router'
import { createBrowserHistory, createLocation } from 'history'
import AuthenticatorRouter, { Authenticator } from './AuthenticatorRouter'
import wait from 'waait'
import Protected from '../DummyFiles/Protected'
import { NetworkStatus } from '../../../node_modules/apollo-client'

expect.addSnapshotSerializer(enzymeSerializer)
enzyme.configure({ adapter: new Adapter() })

// * always try to test component rendering instead of state unless rendering is happening in child components
// * always try to test on interaction instead of state change unless interaction happens in child components
// * always try to use unit test, snapshot for conditional rendering or maintance cost is high
// * Group by feature. Each feature test on rendering and its interaction
// * -- rendering: how props and state(prefer interaction on component unless interaction happen in children) affect this component
// * -- interaction: how feature's interaction affect itself, other component, state(prefer rendering unless rendering in children), prop method call

const routeProps = {
  history: createBrowserHistory(),
  location: createLocation('/'),
  match: {
    params: '',
    isExact: false,
    path: '',
    url: ''
  },
  staticContext: {
    statusCode: 1
  }
}

describe('<MainComponent /> Main Suite', () => {
  // it('dummy', async () => {
  //   const newRes: QueryResult<GetLocalStatesQuery> = {
  //     ...qryRes,
  //     data: {
  //       ...getLocalStateData,
  //       auth: { __typename: 'auth', isAuthenticated: false },
  //       forms: { __typename: 'forms', input_Email: '' }
  //     }
  //   }
  //   const wrapper = enzyme.shallow(<AuthenticatorRouter />)
  //   const wrapper2 = enzyme.shallow(wrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
  //   const wrapper3 = enzyme.shallow(wrapper2.find(Mutation).prop('children')(SET_AUTH, mtnRes) as React.ReactElement<{}>)
  //   const holder = wrapper3.find(Route).prop('render')
  //   // wrapper3.update()
  //   if (!holder) return
  //   const wrapper3Instance = wrapper3.instance() as Authenticator
  //   console.log(wrapper3.state('componentToShow'))
  //   wrapper3Instance.toComp('forgotPassword')
  //   console.log(wrapper3.state('componentToShow'))
  //   const wrapper4 = enzyme.shallow(holder(routeProps) as React.ReactElement<{}>)
  //   const wrapper5 = enzyme.shallow(wrapper4.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
  //   console.log(wrapper5.debug())
  // })
  it('dummy', async () => {
    const wrapper = enzyme.shallow(<Authenticator component={Protected} />)
    wrapper.setProps({ data: getLocalStateData })
    const routeWrapper = enzyme
    console.log(enzyme.shallow(wrapper.find(Route).prop('render')()))

    // const wrapper2 = enzyme.shallow(wrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
    // const wrapper3 = enzyme.shallow(wrapper2.find(Mutation).prop('children')(SET_AUTH, mtnRes) as React.ReactElement<{}>)
    // const holder = wrapper3.find(Route).prop('render')
    // // wrapper3.update()
    // if (!holder) return
    // const wrapper3Instance = wrapper3.instance() as Authenticator
    // console.log(wrapper3.state('componentToShow'))
    // wrapper3Instance.toComp('forgotPassword')
    // console.log(wrapper3.state('componentToShow'))
    // const wrapper4 = enzyme.shallow(holder(routeProps) as React.ReactElement<{}>)
    // const wrapper5 = enzyme.shallow(wrapper4.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
    // console.log(wrapper5.debug())
  })
  // rendering based on different state and props of main component
  // test here is state and props does not directly affects children
  // test here is state and props affects more than 1 children
  it('snapshot on loading state', () => {})
  it('snapshot on error state', () => {})
  it('snapshot on default state', () => {})
  it('snapshot on component props', () => {})
  describe('Feature 1 Suite', () => {
    // all things related to this feature/component
    describe('Static/Conditional Rendering', () => {
      // rendering based on different props and state of this component
      it('snapshot on default state/prop', () => {})
      it('snapshot on some prop', () => {})
      it('snapshot on some state', () => {})
    })
    describe('Interactions', () => {
      // how interaction on this feature affects itself, other component, state(rendering in children), prop method call
      it('should call prop method with args xxx', () => {})
      it('should cause component x to render', () => {})
      it('should cause state to change to xxx', () => {})
      // !try to use snapshot for interaction sparingly
      it('snapshot on some change', () => {})
    })
  })
})
