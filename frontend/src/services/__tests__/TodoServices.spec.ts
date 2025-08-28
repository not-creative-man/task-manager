import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import TodoServices from '../TodoServices'

const mockJson = vi.fn()
const mockFetch = vi.fn(async () => ({ json: mockJson }))

describe('TodoServices', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = mockFetch
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('getTasks calls correct endpoint and returns json', async () => {
    mockJson.mockResolvedValueOnce([{ id: 1 }])
    const res = await TodoServices.getTasks('42')
    expect(mockFetch).toHaveBeenCalledWith('/api/todo/getUserTasks?userId=42', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    expect(res).toEqual([{ id: 1 }])
  })

  it('changeTaskDone posts payload and returns json', async () => {
    mockJson.mockResolvedValueOnce({ ok: true })
    const res = await TodoServices.changeTaskDone(5, true)
    expect(mockFetch).toHaveBeenCalledWith('/api/todo/changeTaskDone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 5, is_task_done: true })
    })
    expect(res).toEqual({ ok: true })
  })

  it('getTaskData calls correct endpoint', async () => {
    mockJson.mockResolvedValueOnce({ id: 7 })
    const res = await TodoServices.getTaskData(7)
    expect(mockFetch).toHaveBeenCalledWith('/api/todo/getTaskData?taskId=7', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    expect(res).toEqual({ id: 7 })
  })

  it('createTask sends PUT with body', async () => {
    mockJson.mockResolvedValueOnce({ created: 1 })
    const payload = { task_id: 1, user_id: 2, task_body: 'a', is_task_done: false, task_deadline: null }
    const res = await TodoServices.createTask(payload as any)
    expect(mockFetch).toHaveBeenCalledWith('/api/todo/createTask', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    expect(res).toEqual({ created: 1 })
  })

  it('deleteTask posts id body', async () => {
    mockJson.mockResolvedValueOnce({ deleted: 1 })
    const res = await TodoServices.deleteTask(10)
    expect(mockFetch).toHaveBeenCalledWith('/api/todo/deleteTask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: 10 })
    })
    expect(res).toEqual({ deleted: 1 })
  })

  it('updateTask posts payload', async () => {
    mockJson.mockResolvedValueOnce({ updated: 1 })
    const payload = { task_id: 1, user_id: 2, task_body: 'b', is_task_done: true, task_deadline: '2025-01-01' }
    const res = await TodoServices.updateTask(payload as any)
    expect(mockFetch).toHaveBeenCalledWith('/api/todo/updateTask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    expect(res).toEqual({ updated: 1 })
  })
})
