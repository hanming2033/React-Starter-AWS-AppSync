import * as React from 'react'
import * as enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import enzymeSerializer from 'enzyme-to-json/serializer'
import { getLocalStateData, qryRes } from '../../utils/testMocks'
import { createBrowserHistory, createLocation } from 'history'
import { Authenticator } from './AuthenticatorRouter'
import Protected from '../DummyFiles/Protected'
import { Route } from 'react-router'
import { Query } from '../../../node_modules/react-apollo'

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
  //   const wrapper = enzyme.shallow(<Authenticator component={Protected} />)
  //   wrapper.setProps({ data: getLocalStateData })
  //   const wrapperInstance = wrapper.instance() as Authenticator
  //   wrapperInstance.toComp('forgotPassword')
  //   const holder = wrapper.find(Route).prop('render')
  //   if (!holder) return
  //   const routeWrapper = enzyme.shallow(holder(routeProps) as React.ReactElement<{}>)
  //   const newRes = { ...qryRes, data: getLocalStateData }
  //   const queryWrapper = enzyme.shallow(routeWrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
  //   console.log(queryWrapper.debug())
  // })
  // rendering based on different state and props of main component
  // test here is state and props does not directly affects children
  // test here is state and props affects more than 1 children
  it('snapshot on no data prop', () => {
    const wrapper = enzyme.shallow(<Authenticator component={Protected} />)
    wrapper.setProps({ data: null })
    expect(wrapper).toMatchSnapshot()
  })
  it('snapshot on authenticated & /authenticate redirect', () => {
    const wrapper = enzyme.shallow(<Authenticator component={Protected} />)
    wrapper.setProps({ data: { auth: { isAuthenticated: true } }, path: '/authenticate' })
    expect(wrapper).toMatchSnapshot()
  })
  it('snapshot on authenticated showing actual component', () => {
    const wrapper = enzyme.shallow(<Authenticator component={Protected} />)
    wrapper.setProps({ data: { auth: { isAuthenticated: true } } })
    const holder = wrapper.find(Route).prop('render')
    if (!holder) return
    const routeWrapper = enzyme.shallow(holder(routeProps) as React.ReactElement<{}>)
    expect(routeWrapper).toMatchSnapshot()
  })
  it('snapshot on signUp', () => {
    const wrapper = enzyme.shallow(<Authenticator component={Protected} />)
    wrapper.setProps({ data: { auth: { isAuthenticated: false } } })
    const holder = wrapper.find(Route).prop('render')
    if (!holder) return
    const routeWrapper = enzyme.shallow(holder(routeProps) as React.ReactElement<{}>)
    const newRes = { ...qryRes, data: getLocalStateData }
    const queryWrapper = enzyme.shallow(routeWrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
    expect(queryWrapper.childAt(0)).toMatchSnapshot()
  })
  it('snapshot on signIn', () => {
    const wrapper = enzyme.shallow(<Authenticator component={Protected} />)
    wrapper.setProps({ data: getLocalStateData })
    const wrapperInstance = wrapper.instance() as Authenticator
    wrapperInstance.toComp('signIn')
    wrapper.update()
    const holder = wrapper.find(Route).prop('render')
    if (!holder) return
    const routeWrapper = enzyme.shallow(holder(routeProps) as React.ReactElement<{}>)
    const newRes = { ...qryRes, data: getLocalStateData }
    const queryWrapper = enzyme.shallow(routeWrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
    expect(queryWrapper.childAt(0)).toMatchSnapshot()
  })
  it('snapshot on forgotPassword', () => {
    const wrapper = enzyme.shallow(<Authenticator component={Protected} />)
    wrapper.setProps({ data: getLocalStateData })
    const wrapperInstance = wrapper.instance() as Authenticator
    wrapperInstance.toComp('forgotPassword')
    wrapper.update()
    const holder = wrapper.find(Route).prop('render')
    if (!holder) return
    const routeWrapper = enzyme.shallow(holder(routeProps) as React.ReactElement<{}>)
    const newRes = { ...qryRes, data: getLocalStateData }
    const queryWrapper = enzyme.shallow(routeWrapper.find(Query).prop('children')(newRes) as React.ReactElement<{}>)
    expect(queryWrapper.childAt(0)).toMatchSnapshot()
  })
  it('snapshot on confirmSignUp', () => {})
  it('snapshot on requireNewPassword', () => {})
  it('snapshot on verifyContact', () => {})
  // describe('Feature 1 Suite', () => {
  //   // all things related to this feature/component
  //   describe('Static/Conditional Rendering', () => {
  //     // rendering based on different props and state of this component
  //     it('snapshot on default state/prop', () => {})
  //     it('snapshot on some prop', () => {})
  //     it('snapshot on some state', () => {})
  //   })
  //   describe('Interactions', () => {
  //     // how interaction on this feature affects itself, other component, state(rendering in children), prop method call
  //     it('should call prop method with args xxx', () => {})
  //     it('should cause component x to render', () => {})
  //     it('should cause state to change to xxx', () => {})
  //     // !try to use snapshot for interaction sparingly
  //     it('snapshot on some change', () => {})
  //   })
  // })
})
