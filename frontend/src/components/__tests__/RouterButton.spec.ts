import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RouterButton from '../RouterButton.vue'

const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  template: '<a><slot /></a>'
}

const wrapper = mount(RouterButton, {
  props: { msg: 'Go', path: '/login' },
  global: { stubs: { RouterLink: RouterLinkStub } }
})

describe('RouterButton', () => {
  it('renders RouterLink with correct path and text', () => {
    const wrapper = mount(RouterButton, {
      props: { msg: 'Go', path: '/login' },
      global: { stubs: { RouterLink: RouterLinkStub } }
    })
    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.exists()).toBe(true)
    expect(link.props('to')).toBe('/login')
    expect(wrapper.text()).toContain('Go')
  })
})
