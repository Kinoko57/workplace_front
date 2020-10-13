/** When your routing table is too long, you can split it into small modules**/
// import Layout from '@/views/layout/components/Layout.vue'
import Index from '@/views/Layout/Index.vue'

const usercenterRouter = {
  path: '/usercenter',
  component: Index,
  redirect: 'noredirect',
  name: 'Usercenter',
  meta: {
    title: '个人中心',
    icon: 'icon',
    noCache: true
  },
  hidden: true,
  alwaysShow: true,
  full: false,
  children: [{
    path: 'mail',
    component: () => import('@/views/usercenter/mail'),
    name: 'Mail',
    meta: {
      title: '站内信',
      noCache: true
    }
  }, {
    path: 'editprofile',
    component: () => import('@/views/usercenter/editprofile'),
    name: 'Editprofile',
    meta: {
      title: '修改资料',
      noCache: true
    }
  },
  {
    path: 'changepassword',
    component: () => import('@/views/usercenter/changepassword'),
    name: 'Changepassword',
    meta: {
      title: '修改密码',
      noCache: true
    }
  }
  ]
}
export default usercenterRouter
