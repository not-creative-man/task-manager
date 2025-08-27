import { describe, it, expect, vi, beforeEach, type MockInstance } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TaskTable from '../TaskTable.vue'

// Mock static assets used in the component
vi.mock('@/assets/edit.png', () => ({ default: 'edit.png' }), { virtual: true })
vi.mock('@/assets/delete.png', () => ({ default: 'delete.png' }), { virtual: true })

// Create service mocks in a hoisted scope to avoid initialization errors
const serviceMocks = vi.hoisted(() => ({
  getTasks: vi.fn(),
  changeTaskDone: vi.fn(),
  deleteTask: vi.fn(),
}))

// Mock TodoServices module using the hoisted mocks
vi.mock('@/services/TodoServices.ts', () => ({
  default: {
    getTasks: (...args: any[]) => serviceMocks.getTasks(...args),
    changeTaskDone: (...args: any[]) => serviceMocks.changeTaskDone(...args),
    deleteTask: (...args: any[]) => serviceMocks.deleteTask(...args),
  }
}))

// Mock RouterLink to avoid real router
const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  template: '<a><slot /></a>'
}

// Mock child TaskButton (visual only)
const TaskButtonStub = {
  name: 'TaskButton',
  props: ['msg'],
  template: '<button class="task-btn">{{ msg }}</button>'
}

// Spy on alert - recreated per test
let alertSpy: MockInstance<[message?: any], void>

describe('TaskTable.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('loads tasks on mount and renders rows', async () => {
    serviceMocks.getTasks.mockResolvedValueOnce([
      { task_id: 1, user_id: 2, task_body: 'A', is_task_done: false, task_deadline: null },
      { task_id: 2, user_id: 2, task_body: 'B', is_task_done: true, task_deadline: '2025-01-01' },
    ])

    const wrapper = mount(TaskTable, {
      props: { userId: '2' },
      global: {
        stubs: { RouterLink: RouterLinkStub },
        components: { TaskButton: TaskButtonStub },
      },
    })

    await flushPromises()

    // two rows rendered
    const rows = wrapper.findAll('.task-row')
    expect(rows.length).toBe(2)
    expect(rows[0].text()).toContain('A')
    expect(rows[1].text()).toContain('B')
  })

  it('changeTaskDone toggles and refreshes list', async () => {
    // initial load
    serviceMocks.getTasks.mockResolvedValueOnce([
      { task_id: 3, user_id: 2, task_body: 'C', is_task_done: false, task_deadline: null },
    ])
    serviceMocks.changeTaskDone.mockResolvedValueOnce({ ok: true })
    // refresh load
    serviceMocks.getTasks.mockResolvedValueOnce([
      { task_id: 3, user_id: 2, task_body: 'C', is_task_done: true, task_deadline: null },
    ])

    const wrapper = mount(TaskTable, {
      props: { userId: '2' },
      global: { stubs: { RouterLink: RouterLinkStub }, components: { TaskButton: TaskButtonStub } },
    })
    await flushPromises()

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.trigger('click')
    await flushPromises()

    expect(serviceMocks.changeTaskDone).toHaveBeenCalledWith(3, true)
    expect(serviceMocks.getTasks).toHaveBeenCalledTimes(2) // initial + refresh
  })

  it('deleteTask calls service and refreshes list', async () => {
    // initial
    serviceMocks.getTasks.mockResolvedValueOnce([
      { task_id: 4, user_id: 2, task_body: 'D', is_task_done: false, task_deadline: null },
    ])
    serviceMocks.deleteTask.mockResolvedValueOnce({ ok: true })
    // refresh
    serviceMocks.getTasks.mockResolvedValueOnce([])

    const wrapper = mount(TaskTable, {
      props: { userId: '2' },
      global: { stubs: { RouterLink: RouterLinkStub }, components: { TaskButton: TaskButtonStub } },
    })
    await flushPromises()

    const delImg = wrapper.find('img[alt="Delete task"]')
    await delImg.trigger('click')
    await flushPromises()

    expect(serviceMocks.deleteTask).toHaveBeenCalledWith(4)
    expect(serviceMocks.getTasks).toHaveBeenCalledTimes(2)
  })

  it('deleteTask calls service without id', async () => {
    // initial
    serviceMocks.getTasks.mockResolvedValueOnce([
      { user_id: 2, task_body: 'D', is_task_done: false, task_deadline: null },
    ])
    serviceMocks.deleteTask.mockResolvedValueOnce({ ok: true })
    // refresh
    serviceMocks.getTasks.mockResolvedValueOnce([])

    const wrapper = mount(TaskTable, {
      props: { userId: '2' },
      global: { stubs: { RouterLink: RouterLinkStub }, components: { TaskButton: TaskButtonStub } },
    })
    await flushPromises()

    const delImg = wrapper.find('img[alt="Delete task"]')
    await delImg.trigger('click')
    await flushPromises()
  })

  // it('alerts on getTasks error', async () => {
  //   serviceMocks.getTasks.mockResolvedValueOnce({ error: 'boom' })
  //
  //   mount(TaskTable, {
  //     props: { userId: '2' },
  //     global: { stubs: { RouterLink: RouterLinkStub }, components: { TaskButton: TaskButtonStub } },
  //   })
  //   await flushPromises()
  //
  //   expect(alertSpy).toHaveBeenCalledWith('boom')
  // })
})