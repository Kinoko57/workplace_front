/** When your routing table is too long, you can split it into small modules**/

// import Layout from '@/views/layout/components/Layout.vue'
import Index from '@/views/Layout/Index.vue'

const memberManagentRouter = {
  path: '/memberManagement',
  component: Index,
  name: 'MemberManagement',
  meta: {
    title: '员工管理',
    top_title: '员工',
    icon: 'system',
    noCache: true
  },
  full: false,
  alwaysShow: true,
  redirect: 'noredirect',
  children: [{
    path: 'person',
    name: 'PersonManage',
    component: () => import('@/views/memberManagement/personnel'),
    meta: {
      title: '人员管理',
      top_title: '员工',
      noCache: true
    },
    key: 'user_admin'
  },
  {
    path: 'follow/:id',
    name: 'FollowMember',
    component: () => import('@/views/memberManagement/follow'),
    meta: {
      title: '员工详情',
      top_title: '员工',
      noCache: true,
      hidden: true,
      parentPath: '/memberManagement/person'
    },
    key: 'user_admin'
  },
  {
    path: 'daily',
    name: 'DailyManage',
    component: () => import('@/views/memberManagement/daily'),
    meta: {
      title: '员工日报',
      top_title: '员工',
      noCache: true
    },
    key: 'daily_browse'
  },
  {
    path: 'dailyView',
    name: 'DailyViewManage',
    component: () => import('@/views/memberManagement/dailyView'),
    meta: {
      title: '员工日报',
      top_title: '员工',
      parentPath: '/memberManagement/daily',
      noCache: true,
      hidden: true
    },
    key: 'daily_browse'
  },
  {
    path: 'attendance',
    name: 'AttendanceManage',
    component: () => import('@/views/memberManagement/attendance'),
    meta: {
      title: '员工考勤',
      top_title: '员工',
      noCache: true
    },
    key: 'attendance_browse'
  },
  {
    path: 'department',
    name: 'DepartmentManage',
    component: () => import('@/views/memberManagement/department'),
    meta: {
      title: '组织管理',
      top_title: '员工',
      noCache: true
    },
    key: 'organize_browse'
  },
  {
    path: 'role',
    name: 'RoleManage',
    component: () => import('@/views/memberManagement/role'),
    meta: {
      title: '角色管理',
      top_title: '员工',
      noCache: true,
      isShow: true // 若父路由可以点击，并且子路由隐藏则设为true
    },
    alwaysShow: true,
    key: 'group_browse',
    children: [{
      path: 'set',
      component: () => import('@/views/memberManagement/set'),
      name: 'Set',
      meta: {
        title: '设置权限',
        top_title: '员工',
        parentPath: '/memberManagement/role'

      }
    }]
  },
  {
    path: 'log',
    name: 'LogManage',
    component: () => import('@/views/memberManagement/log'),
    meta: {
      title: '操作日志',
      top_title: '员工',
      noCache: true
    },
    key: 'log_browse'
  }
  ]
}
export default memberManagentRouter
