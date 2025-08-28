import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ActionButton from '../ActionButton.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Создаем мок для Vue Router с тестовым маршрутом
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/test-path',
      name: 'test-path',
      component: { template: '<div>Test</div>' }
    }
  ]
})

describe('ActionButton', () => {
  it('renders properly with props', () => {
    const wrapper = mount(ActionButton, {
      props: {
        msg: 'Test Message',
        path: 'test-path',
        alt: 'Test Alt',
        route: 1,
        action: 'test-action'
      },
      global: {
        plugins: [router]
      }
    })

    // Проверяем, что компонент отрендерился
    expect(wrapper.exists()).toBe(true)

    // Проверяем, что RouterLink содержит правильный путь
    const routerLink = wrapper.findComponent({ name: 'RouterLink' })
    expect(routerLink.exists()).toBe(true)
    expect(routerLink.props('to')).toEqual({ name: 'test-path' })

    // Проверяем, что img содержит правильные атрибуты
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('test-path')
    expect(img.attributes('alt')).toBe('Test Alt')
  })
}) 