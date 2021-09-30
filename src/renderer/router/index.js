import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

router.afterEach(to => {
  document.title = 'TCP Proxy - ' + to.meta.title
})

export default router
