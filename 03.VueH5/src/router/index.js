import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  // mode: 'history', // 本地测试，最后要去掉
  routes: [
    {
      path: '/',
      name: 'Map',
      component: () => import('@/views/home/map'),
      meta: { title: '签到结果' }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/home/login'),
      meta: { title: '登录' }
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('@/views/home/main'),
      children: [{
        path: 'index',
        name: 'Index',
        meta: { title: '首页' },
        component: () => import('@/views/home/index')
      },
      {
        path: 'message',
        name: 'Message',
        meta: { title: '消息' },
        component: () => import('@/views/home/message')
      },
      {
        path: 'messageNotice',
        name: 'MessageNotice',
        meta: { title: '系统公告' },
        component: () => import('@/views/home/messageNotice')
      },
      {
        path: 'messageNews',
        name: 'MessageNews',
        meta: { title: '提醒消息' },
        component: () => import('@/views/home/messageNews')
      },
      {
        path: 'messageView',
        name: 'MessageView',
        meta: { title: '消息详情' },
        component: () => import('@/views/home/messageView')
      },
      {
        path: 'workbench',
        name: 'Mywork',
        meta: { title: '工作台' },
        component: () => import('@/views/home/workbench')
      },
      {
        path: 'list',
        name: 'List',
        meta: { title: '列表' },
        component: () => import('@/views/home/list')
      },
      {
        path: 'dailyList',
        name: 'DailyList',
        meta: { title: '日报列表' },
        component: () => import('@/views/home/dailyList')
      },
      {
        path: 'dailyDetail',
        name: 'DailyDetail',
        meta: { title: '日报详情' },
        component: () => import('@/views/home/dailyDetail')
      },
      {
        path: 'detail',
        name: 'Detail',
        meta: { title: '详情' },
        component: () => import('@/views/home/detail')
      },
      {
        path: 'new',
        name: 'New',
        meta: { title: '新增' },
        component: () => import('@/views/home/new')
      },
      {
        path: 'person',
        name: 'Person',
        meta: { title: '个人中心' },
        component: () => import('@/views/home/person')
      }]
    },
    {
      path: '/error',
      name: 'error',
      meta: { title: 'error' },
      component: () => import('@/error')
    },
    {
      path: '/warning',
      name: 'warning',
      meta: { title: '温馨提示' },
      component: () => import('@/warning')
    }
  ]
})
