import * as React from 'react'
import * as enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Protected from './Protected'

import { createBrowserHistory, createLocation } from 'history'

const history = createBrowserHistory()
const location = createLocation('/')
const match = {
  params: '',
  isExact: false,
  path: '',
  url: ''
}

enzyme.configure({ adapter: new Adapter() })

describe('<Protected />', () => {
  it('should have a h3 title Private', () => {
    const wrapper = enzyme.shallow(<Protected history={history} location={location} match={match} staticContext={undefined} />)
    console.log(wrapper.debug())
    expect(wrapper.find('h3').text()).toBe('Private')
  })
})
