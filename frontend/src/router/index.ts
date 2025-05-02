import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '@/views/WelcomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import UserTasksView from '@/views/UserTasksView.vue'
import TaskView from '@/views/TaskView.vue'
//import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: WelcomeView,
    },
    {
      path: '/login',
      name: 'Login Page',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'Register Page',
      component: RegisterView,
    },
    {
      path: '/user',
      name: 'User Page',
      component: UserTasksView,
    },
    {
      path: '/task/:action/:task_id?',
      name: 'Task Page',
      component: TaskView,
      props: true,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
