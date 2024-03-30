import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import { isAccessTokenStoredValid, getUserAuthorization } from '@/utils/token'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
    restricted: false,
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    restricted: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach(async (to) => {
  const isRestrict = routes.find(route => route.name === to.name)?.restricted

  if (isRestrict) {

    if (to.name === "home") {
      const isAuthorizationSuccessful = await getUserAuthorization()

      if (!isAuthorizationSuccessful)
        return router.push("/")
    
    }else if (!isAccessTokenStoredValid()){
      return router.push("/")
    }

  }
})

export default router
