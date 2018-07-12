import * as React from 'react'
import * as enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Public from './Public'

enzyme.configure({ adapter: new Adapter() })

describe('<Public />', () => {
  it('just for demo', () => {
    const wrapper = enzyme.shallow(<Public />)
    expect(wrapper.find('h3').text()).toBe('public')
  })
})
