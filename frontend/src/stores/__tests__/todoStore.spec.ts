import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTaskData } from '../todoStore'

describe('todoStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('setTaskData sets all fields', () => {
    const store = useTaskData()
    const task = {
      task_id: 1,
      user_id: 2,
      task_body: 'body',
      is_task_done: true,
      task_deadline: '2025-01-01'
    }
    store.setTaskData(task as any)
    expect(store.taskId).toBe(1)
    expect(store.userId).toBe(2)
    expect(store.taskBody).toBe('body')
    expect(store.isTaskDone).toBe(true)
    expect(store.taskDeadline).toBe('2025-01-01')
  })

  it('getTaskData returns object built from state', () => {
    const store = useTaskData()
    store.taskId = 3
    store.userId = 4
    store.taskBody = 'x'
    store.isTaskDone = false
    store.taskDeadline = null
    const data = store.getTaskData()
    expect(data).toEqual({
      task_id: 3,
      user_id: 4,
      task_body: 'x',
      is_task_done: false,
      task_deadline: null
    })
  })
})
