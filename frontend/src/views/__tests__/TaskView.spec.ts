import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TaskView from '../TaskView.vue'

// Mocks
const pushMock = vi.fn()
let routeParams: any = { action: 'create', task_id: undefined }

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<any>('vue-router')
  return {
    ...actual,
    useRoute: () => ({ params: routeParams }),
    useRouter: () => ({ push: pushMock }),
    RouterLink: { name: 'RouterLink', template: '<a><slot /></a>' }
  }
})

const logOutMock = vi.fn(async () => {
})
let userId: number | undefined = 1
vi.mock('@/stores/userStore.ts', () => ({
  useUserData: () => ({ userId, logOut: logOutMock })
}))

// Hoisted service mocks to avoid initialization errors with vi.mock hoisting
const serviceMocks = vi.hoisted(() => ({
  getTaskData: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn()
}))

vi.mock('@/services/TodoServices.ts', () => ({
  default: {
    getTaskData: (...args: any[]) => serviceMocks.getTaskData(...args),
    createTask: (...args: any[]) => serviceMocks.createTask(...args),
    updateTask: (...args: any[]) => serviceMocks.updateTask(...args)
  }
}))

const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {
})

describe('TaskView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    pushMock.mockReset()
    routeParams = { action: 'create', task_id: undefined }
    userId = 1
  })

  it('create flow: submits and navigates back', async () => {
    const wrapper = mount(TaskView, {
      props: { action: 'create' }
    })
    await flushPromises()

    // Fill form
    await wrapper.find('#task_body').setValue('Task X')
    await wrapper.find('#task_deadline').setValue('2025-01-01')
    const checkbox = wrapper.find('#is_task_done')
    await checkbox.setValue(true)

    serviceMocks.createTask.mockResolvedValueOnce({ ok: true })

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(serviceMocks.createTask).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith('/user')
    expect(logOutMock).toHaveBeenCalled()
  })

  it('update flow: fetches task, formats date, updates and navigates back', async () => {
    routeParams = { action: 'update', task_id: '10' }
    serviceMocks.getTaskData.mockResolvedValueOnce([
      { task_body: 'Old', task_deadline: '2025-02-15T10:00:00.000Z', is_task_done: false, user_id: 1, task_id: 10 }
    ])

    const wrapper = mount(TaskView, { props: { action: 'update', task_id: '10' } })
    await flushPromises()

    // after load, date should be formatted yyyy-mm-dd
    const dateInput: HTMLInputElement = wrapper.find('#task_deadline').element as HTMLInputElement
    expect(dateInput.value).toMatch(/^2025-02-15$/)

    serviceMocks.updateTask.mockResolvedValueOnce({ ok: true })
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(serviceMocks.getTaskData).toHaveBeenCalledWith(10)
    expect(serviceMocks.updateTask).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith('/user')
  })

  it('shows alert on getTaskData error', async () => {
    routeParams = { action: 'update', task_id: '7' }
    serviceMocks.getTaskData.mockResolvedValueOnce({ error: 'boom' })

    mount(TaskView, { props: { action: 'update', task_id: '7' } })
    await flushPromises()

    expect(alertSpy).toHaveBeenCalledWith('boom')
  })
})
