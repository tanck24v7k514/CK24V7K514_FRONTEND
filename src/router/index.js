import { createWebHistory, createRouter } from 'vue-router'
import ContactBook from '@/views/ContactBook.vue'
import Login from '@/views/Login.vue'

const routes = [
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: () => import('@/views/Register.vue') },
  {
    path: '/',
    name: 'contactbook',
    component: ContactBook,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('@/views/NotFound.vue'),
  },
  {
    path: '/contact/:id',
    name: 'contact.edit',
    component: () => import('@/views/ContactEdit.vue'),
    props: true,
  },
  {
    path: '/contacts/add',
    name: 'contact.add',
    component: () => import('@/views/ContactAdd.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('token')

  if (authRequired && !loggedIn) {
    return next('/login')
  }
  next()
})

export default router
