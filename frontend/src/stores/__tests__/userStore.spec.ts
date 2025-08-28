// src/stores/__tests__/userStore.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/router/index', () => ({
  default: {
    push: vi.fn(async () => {
    })
  }
}))

import router from '@/router/index'
import { useUserData } from '../userStore'

describe('userStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // @ts-ignore
    router.push.mockClear()
  })

  it('setUserId and getUserId work', () => {
    const store = useUserData()
    store.setUserId(123)
    expect(store.getUserId()).toBe(123)
  })

  it('logOut pushes "/" when userId is undefined', async () => {
    const store = useUserData()
    store.userId = undefined
    await store.logOut()
    expect(router.push).toHaveBeenCalledWith('/')
  })

  it('logOut does nothing when userId is set', async () => {
    const store = useUserData()
    store.userId = 5
    await store.logOut()
    expect(router.push).not.toHaveBeenCalled()
  })
})