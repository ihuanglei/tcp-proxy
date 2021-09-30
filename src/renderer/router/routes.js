export default [
  {
    path: '/',
    name: 'index',
    meta: {
      title: '首页'
    },
    component: () => import('@/pages/index')
  },
  {
    path: '/log',
    name: 'log',
    meta: {
      title: '日志'
    },
    component: () => import('@/pages/log')
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      title: '关于我们'
    },
    component: () => import('@/pages/about')
  }
]
