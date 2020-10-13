/** When your routing table is too long, you can split it into small modules**/

// import Layout from '@/views/layout/components/Layout.vue'
import Index from '@/views/Layout/Index.vue'

const agentRouter = {
  path: '/agent',
  component: Index,
  //   redirect: '/nested/menu1/menu1-1',
  name: 'Nested',
  meta: {
    title: '经销商管理',
    top_title: '经销商',
    icon: 'agent',
    noCache: true
  },
  redirect: 'noredirect',
  alwaysShow: true,
  full: false,
  children: [
    {
      path: 'welfare',
      component: () => import('@/views/agent/welfare/welfareManage'),
      name: 'WelfareManage',
      key: 'welfare_browse',
      meta: {
        title: '福利管理',
        top_title: '经销商',
        noCache: true
      }
    }, {
      path: 'record',
      component: () => import('@/views/agent/welfare/welfareRecord'),
      name: 'WelfareRecord',
      key: 'welfarerecord_browse',
      meta: {
        title: '福利记录',
        top_title: '经销商',
        noCache: true
      }
    }, {
      path: 'proxyLabel',
      component: () => import('@/views/agent/proxyLabel'),
      name: 'ProxyLabel',
      key: 'agentproxy_browse',
      meta: {
        title: '经销商标签',
        top_title: '经销商',
        noCache: true
      }
    }, {
      path: 'agentLevel',
      component: () => import('@/views/agent/agentLevel'),
      name: 'AgentLevel',
      key: 'agentlevel_browse',
      meta: {
        title: '经销商等级',
        top_title: '经销商',
        noCache: true
      }
    }, {
      path: 'wechatManage',
      name: 'WechatManage',
      component: () => import('@/views/agent/wechat'),
      key: 'service_browse',
      meta: {
        title: '客服手机',
        top_title: '经销商',
        noCache: true
      }
    },
    {
      path: 'bussinessIndex',
      component: () => import('@/views/agent/business/bussinessIndex'),
      name: 'BussinessIndex',
      key: 'agent_agentbusinessbrowse',
      meta: {
        title: '商机管理',
        top_title: '经销商',
        noCache: true,
        isShow: true // 若父路由可以点击，并且子路由隐藏则设为true
      },
      alwaysShow: true, // 若父路由下只有一个子路由，此属性设为true，则显示父路由
      children: [{
        path: 'follow',
        component: () => import('@/views/agent/business/follow'),
        name: 'FollowUp',
        meta: {
          title: '跟进',
          top_title: '经销商',
          parentPath: '/agent/bussinessIndex'
        }
      }
      // {
      //   path: 'detail',
      //   component: () => import('@/views/agent/business/detail'),
      //   name: 'BussinessDetail',
      //   meta: {
      //     title: '跟进',
      //     top_title: '经销商',
      //     parentPath: '/agent/bussinessIndex'
      //   }
      // }
      ]
    },
    // {
    //   path: 'business',
    //   component: () => import('@/views/agent/business/index'),
    //   name: 'Business',
    //   hidden: true,
    //   meta: {
    //     title: '商机管理',
    //     noCache: true,
    //     isShow: true // 若父路由可以点击，并且子路由隐藏则设为true
    //   }
    // },
    {
      path: 'transactionIndex',
      component: () => import('@/views/agent/agentManage/transaction/transactionIndex'),
      name: 'TransactionIndex',
      key: 'agent_agentbrowse',
      meta: {
        title: '成交经销商',
        top_title: '经销商',
        isShow: true // 若父路由可以点击，并且子路由隐藏则设为true
      },
      children: [
        // {
        //   path: 'info',
        //   component: () => import('@/views/agent/agentManage/transaction/info'),
        //   name: 'IntentInfo',
        //   meta: {
        //     title: '经销商详细',
        //     top_title: '经销商',
        //     parentPath: '/agent/transactionIndex'
        //   }
        // },
        {
          path: 'follow',
          component: () => import('@/views/agent/agentManage/transaction/follow'),
          name: 'IntentFollow',
          meta: {
            title: '跟进',
            top_title: '经销商',
            parentPath: '/agent/transactionIndex'
          }
        }
      ]
    },
    {
      path: 'lossIndex',
      component: () => import('@/views/agent/agentManage/lossIndex/lossIndex'),
      name: 'LossIndex',
      key: 'agent_loseagentbrowse',
      meta: {
        title: '流失经销商',
        top_title: '经销商'
      },
      children: [{
        path: 'lossfollow',
        component: () => import('@/views/agent/agentManage/lossIndex/followLoss'),
        name: 'LossFollow',
        meta: {
          title: '跟进',
          top_title: '经销商',
          parentPath: '/agent/lossIndex'
        }
      }]
    }]
}

export default agentRouter
