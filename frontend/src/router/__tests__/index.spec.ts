import { describe, it, expect } from 'vitest'
import router from '@/router'

// Optional: import components to assert exact component bindings
import WelcomeView from '@/views/WelcomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import UserTasksView from '@/views/UserTasksView.vue'
import TaskView from '@/views/TaskView.vue'

describe('Router: src/router/index.ts', () => {
  it('defines expected routes with correct names and paths', () => {
    const routes = router.getRoutes()
    const byName = new Map(routes.map(r => [r.name, r]))

    // sanity: expected number of top-level routes
    expect(routes.length).toBe(5)

    // Home
    const home = byName.get('Home')
    expect(home).toBeTruthy()
    expect(home?.path).toBe('/')
    expect(home?.components?.default ?? home?.component).toBe(WelcomeView)

    // Login
    const login = byName.get('Login Page')
    expect(login).toBeTruthy()
    expect(login?.path).toBe('/login')
    expect(login?.components?.default ?? login?.component).toBe(LoginView)

    // Register
    const register = byName.get('Register Page')
    expect(register).toBeTruthy()
    expect(register?.path).toBe('/register')
    expect(register?.components?.default ?? register?.component).toBe(RegisterView)

    // User
    const user = byName.get('User Page')
    expect(user).toBeTruthy()
    expect(user?.path).toBe('/user')
    expect(user?.components?.default ?? user?.component).toBe(UserTasksView)

    // Task
    const task = byName.get('Task Page')
    expect(task).toBeTruthy()
    expect(task?.path).toBe('/task/:action/:task_id?')
    expect(task?.components?.default ?? task?.component).toBe(TaskView)

    // props should be enabled on Task route
    // Vue Router stores this on the record as props["default"] when using SFC or component
    const propsOption = (task as any)?.props
    const taskProps = typeof propsOption === 'object' ? propsOption.default : propsOption
    expect(taskProps).toBe(true)
  })

  it('resolves dynamic params correctly for Task route', () => {
    // /task/create -> action=create, no task_id
    const r1 = router.resolve('/task/create')
    expect(r1.name).toBe('Task Page')
    expect(r1.params.action).toBe('create')
    // Optional param may be undefined or an empty string depending on resolution
    expect(r1.params.task_id === undefined || r1.params.task_id === '').toBe(true)

    // /task/edit/123 -> action=edit, task_id=123
    const r2 = router.resolve('/task/edit/123')
    expect(r2.name).toBe('Task Page')
    expect(r2.params.action).toBe('edit')
    expect(r2.params.task_id).toBe('123')
  })
})
