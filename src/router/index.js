import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/Main.vue'
import NewPost from '../views/NewPost.vue'
import Dashboard from '../views/Dashboard.vue'
import Auth from '../views/Auth.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: Main },
    { path: "/newpost", component: NewPost },
    { path: "/dashboard", component: Dashboard },
    { path: "/auth", component: Auth },
  ]
})

export default router
