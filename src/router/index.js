import Vue from 'vue';
import VueRouter from 'vue-router'

Vue.use(VueRouter);

export default new VueRouter({
  // mode: 'history',
  // base: '/vue/',
  mdoe: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      meta: { title: '主页' },
      component: () => import('../pages/home.vue')
    },
    {
      path: '/about',
      name: 'about',
      meta: { title: '关于' },
      component: () => import('../pages/about.vue')
    }, 
    {
      path: '/login',
      name: 'login',
      meta: { title: '登录' },
      component: () => import('../pages/login.vue')
    },
    {
      path: '/register',
      name: 'register',
      meta: { title: '注册' },
      component: () => import('../pages/register.vue')
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})