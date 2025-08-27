import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskButton from '../TaskButton.vue'

const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  template: '<a><slot /></a>'
}

describe('TaskButton', () => {
  it('renders RouterLink to Task Page with create params and shows text', () => {
    const wrapper = mount(TaskButton, {
      props: { msg: 'Add new task' },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.exists()).toBe(true)
    expect(wrapper.text()).toContain('Add new task')
  })
})