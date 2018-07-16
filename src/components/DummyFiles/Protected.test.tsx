import * as React from 'react'
import * as enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Protected from './Protected'

import { createBrowserHistory, createLocation } from 'history'

const routeProps = {
  history: createBrowserHistory(),
  location: createLocation('/'),
  match: {
    params: '',
    isExact: false,
    path: '',
    url: ''
  },
  staticContext: undefined
}

enzyme.configure({ adapter: new Adapter() })

describe('<Protected />', () => {
  it('should have a h3 title Private', () => {
    const wrapper = enzyme.shallow(<Protected {...routeProps} />)
    expect(wrapper.find('h3').text()).toMatch(/Private/)
  })
})
