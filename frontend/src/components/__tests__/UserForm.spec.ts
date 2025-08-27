import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UserForm from '../UserForm.vue'

describe('UserForm', () => {
  it('renders header, text and fields, binds inputs and submits', async () => {
    const onSubmit = vi.fn()
    const dataList = [
      { type: 'text', label: 'Email', value: 'email' },
      { type: 'password', label: 'Password', value: 'password' },
    ]

    const wrapper = mount(UserForm, {
      props: {
        header: 'Login',
        text: 'Please login',
        dataList,
        buttonText: 'Submit',
        handleSubmit: onSubmit,
      },
    })

    expect(wrapper.text()).toContain('Login')
    expect(wrapper.text()).toContain('Please login')

    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(2)

    await inputs[0].setValue('user@example.com')
    await inputs[1].setValue('secret')

    await wrapper.find('form').trigger('submit.prevent')
    expect(onSubmit).toHaveBeenCalled()
  })
})
