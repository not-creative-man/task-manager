import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import UserServices from '../UserServices'

const mockJson = vi.fn()
const mockFetch = vi.fn(async () => ({ json: mockJson }))

describe('UserServices', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = mockFetch
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('login calls correct endpoint', async () => {
    mockJson.mockResolvedValueOnce({ token: 't' })
    const res = await UserServices.login('e@e', 'p')
    expect(mockFetch).toHaveBeenCalledWith('/api/user/login?email=e@e&password=p')
    expect(res).toEqual({ token: 't' })
  })

  it('register posts payload', async () => {
    mockJson.mockResolvedValueOnce({ id: 1 })
    const res = await UserServices.register('nick', 'pass', 'e@e')
    expect(mockFetch).toHaveBeenCalledWith('/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname: 'nick', password: 'pass', email: 'e@e' }),
    })
    expect(res).toEqual({ id: 1 })
  })
})
