/** When your routing table is too long, you can split it into small modules**/
// import Layout from '@/views/layout/components/Layout.vue'
import Index from '@/views/Layout/Index.vue'

const financialmanRouter = {
  path: '/financialman',
  component: Index,
  redirect: 'noredirect',
  name: 'Financialman',
  meta: {
    title: '财务管理',
    top_title: '财务',
    icon: 'financialman',
    noCache: true
  },
  alwaysShow: true,
  full: false,
  children: [{
    path: 'agreement',
    component: () => import('@/views/financialman/agreement/agreementinfo'),
    name: 'Agreement',
    meta: {
      title: '保证金录入',
      top_title: '财务',
      noCache: true,
      isShow: true
    },
    key: 'contract_browse',
    alwaysShow: true,
    children: [{
      path: 'find',
      component: () => import('@/views/financialman/agreement/find'),
      name: 'Find',
      meta: {
        title: '查看',
        top_title: '财务',
        parentPath: '/financialman/agreement'
      }
    }]
  },
  {
    path: 'payment',
    component: () => import('@/views/financialman/payment'),
    name: 'Payment',
    meta: {
      title: '付款管理',
      top_title: '财务',
      noCache: true
    },
    key: 'payment_browse'
  }
  // {
  //   path: 'sales',
  //   component: () => import('@/views/financialman/sales'),
  //   name: 'Sales',
  //   meta: {
  //     title: '首咖流水',
  //     noCache: true
  //   },
  //   key: 'turnover_browse'
  // }
  ]
}
export default financialmanRouter
