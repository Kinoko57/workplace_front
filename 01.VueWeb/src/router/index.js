import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Index */
import Index from '@/views/Layout/Index.vue'
// import Index from '@/views/Index/components/Index.vue'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
import agentRouter from './modules/agent'
import usercenterRouter from './modules/usercenter'
import financialmanRouter from './modules/financialman'
import memberManagentRouter from './modules/memberManagent'
/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/',
    redirect: '/dashboard/index'
  }, {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '/dashboard',
    component: Index,
    name: 'Dashboard',
    meta: {
      title: '首页',
      top_title: '首页',
      icon: 'index',
      noCache: true
    },
    children: [{
      path: 'index',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      title: '首页',
      meta: {
        title: '首页',
        top_title: '首页',
        icon: 'index'
      },
      key: 'index_index'
    }]
  },
  agentRouter,
  {
    path: '/training',
    component: Index,
    name: 'Training',
    redirect: 'noredirect',
    meta: {
      title: '商学院',
      top_title: '商学院',
      icon: 'train',
      noCache: true
    },
    alwaysShow: true,
    full: false,
    children: [{
      path: 'tutor',
      name: 'TutorManage',
      key: 'offlineteacher_browse',
      component: () => import('@/views/training/tutorList'),
      meta: {
        title: '讲师管理',
        top_title: '商学院',
        noCache: true
      }
    }, {
      path: 'course',
      name: 'CourseManage',
      key: 'offlinecourse_browse',
      component: () => import('@/views/training/course'),
      meta: {
        title: '课程管理',
        top_title: '商学院',
        noCache: true
      }
    },
    {
      path: 'study',
      name: 'StudyManage',
      key: 'offlinestudy_browse',
      component: () => import('@/views/training/study'),
      meta: {
        title: '培训管理',
        top_title: '商学院',
        noCache: true
      }
    },
    {
      path: 'studyVisit/:id',
      name: 'StudyVisit',
      key: 'offlinestudy_browse',
      component: () => import('@/views/training/studyVisit'),
      meta: {
        title: '培训回访',
        top_title: '商学院',
        hidden: true,
        parentPath: '/training/study',
        noCache: true
      },
      hidden: true
    },
    {
      path: 'proxyList/:id',
      name: 'ProxyListManage',
      component: () => import('@/views/training/proxyList'),
      meta: {
        title: '经销商管理',
        top_title: '商学院',
        noCache: true,
        parentPath: '/training/study'
      },
      hidden: true
    }
    // {
    //   path: 'follow/:id',
    //   name: 'FollowManage',
    //   component: () => import('@/views/training/follow'),
    //   meta: {
    //     title: '培训回访',
    //     top_title: '商学院',
    //     noCache: true,
    //     parentPath: '/training/study'
    //   },
    //   hidden: true
    // }
    ]
  },
  {
    path: '/online',
    component: Index,
    name: 'Online',
    redirect: 'noredirect',
    meta: {
      title: '线上培训',
      top_title: '线上培训',
      icon: 'train',
      noCache: true
    },
    alwaysShow: true,
    full: false,
    children: [{
      path: 'level',
      name: 'LevelManage',
      key: 'onlinecourseagentlevel_browse',
      component: () => import('@/views/online/level'),
      meta: {
        title: '群员等级',
        top_title: '线上培训',
        noCache: true
      }
    }, {
      path: 'type',
      name: 'TypeManage',
      key: 'onlinecourse_browse',
      component: () => import('@/views/online/type'),
      meta: {
        title: '课程分类',
        top_title: '线上培训',
        noCache: true
      }
    },
    {
      path: 'course',
      name: 'CourseManage',
      key: 'onlinestudy_browse',
      component: () => import('@/views/online/course'),
      meta: {
        title: '排课管理',
        top_title: '线上培训',
        noCache: true
      }
    },
    {
      path: 'cradle',
      name: 'CradleGroupManage',
      key: 'cradlegroup_browse',
      component: () => import('@/views/online/cradleGroup'),
      meta: {
        title: '摇篮群管理',
        top_title: '线上培训',
        noCache: true
      }
    },
    {
      path: 'member',
      name: 'MemberManage',
      key: 'cradlegrouplist_browse',
      component: () => import('@/views/online/member'),
      meta: {
        title: '群员管理',
        top_title: '线上培训',
        noCache: true
      }
    },
    {
      path: 'memberlist',
      name: 'MemberListManage',
      component: () => import('@/views/online/memberlist'),
      meta: {
        title: '群员列表',
        top_title: '线上培训',
        noCache: true,
        hidden: true,
        parentPath: '/online/member'
      },
      hidden: true
    }
    ]
  },
  {
    path: '/excellentAgent',
    component: Index,
    name: 'ExcellentAgent',
    redirect: 'noredirect',
    meta: {
      title: '优秀经销商',
      top_title: '优秀经销商',
      icon: 'excellentAgent',
      noCache: true
    },
    full: false,
    alwaysShow: true,
    children: [{
      path: 'level',
      name: 'LevelManage',
      key: 'onlinedmcourseagentlevel_browse',
      component: () => import('@/views/excellentAgent/level'),
      meta: {
        title: '群员等级',
        top_title: '优秀经销商',
        noCache: true
      }
    }, {
      path: 'type',
      name: 'TypeManage',
      key: 'onlinedmcourse_browse',
      component: () => import('@/views/excellentAgent/type'),
      meta: {
        title: '课程分类',
        top_title: '优秀经销商',
        noCache: true
      }
    },
    {
      path: 'course',
      name: 'CourseManage',
      key: 'onlinedmstudy_browse',
      component: () => import('@/views/excellentAgent/course'),
      meta: {
        title: '排课管理',
        top_title: '优秀经销商',
        noCache: true
      }
    },
    {
      path: 'cradle',
      name: 'CradleGroupManage',
      key: 'cradlegroupdm_browse',
      component: () => import('@/views/excellentAgent/cradleGroup'),
      meta: {
        title: '优秀经销商群',
        top_title: '优秀经销商',
        noCache: true
      }
    },
    {
      path: 'member',
      name: 'MemberManage',
      key: 'cradlegroupdmlist_browse',
      component: () => import('@/views/excellentAgent/member'),
      meta: {
        title: '群员管理',
        top_title: '优秀经销商',
        noCache: true
      }
    },
    {
      path: 'memberlist',
      name: 'MemberListManage',
      component: () => import('@/views/excellentAgent/memberlist'),
      meta: {
        title: '群员列表',
        top_title: '优秀经销商',
        noCache: true,
        parentPath: '/excellentAgent/member'
      },
      hidden: true
    }
    ]
  },
  {
    path: '/supplier',
    component: Index,
    name: 'Supplier',
    redirect: 'noredirect',
    meta: {
      title: '供应商管理',
      top_title: '供应商',
      icon: 'supplier',
      noCache: true
    },
    alwaysShow: true,
    full: false,
    children: [{
      path: 'storehouse',
      name: 'StoreHouseManage',
      component: () => import('@/views/supplier/storehouse'),
      meta: {
        title: '供应商库',
        top_title: '供应商',
        noCache: true
      },
      key: 'supplier_browse'
    },
    {
      path: 'commodity',
      name: 'CommodityManage',
      component: () => import('@/views/supplier/commodity'),
      meta: {
        title: '商品列表',
        noCache: true,
        top_title: '供应商'
      },
      key: 'suppliergoods_browse'
    }
    ]
  },
  {
    path: '/office',
    component: Index,
    name: 'Office',
    meta: {
      title: '日常工作',
      top_title: '日常',
      icon: 'office',
      noCache: true
    },
    redirect: 'noredirect',
    alwaysShow: true,
    full: false,
    children: [{
      path: 'report',
      name: 'ReportManage',
      component: () => import('@/views/office/report'),
      meta: {
        title: '公告管理',
        top_title: '日常',
        noCache: true
      },
      key: 'notice_browse'
    },
    {
      path: 'editHelpWord',
      component: () => import('@/views/office/editHelpWord'),
      name: 'EditHelpWord',
      meta: {
        title: '帮助文档编辑',
        top_title: '日常',
        parentPath: '/office/report'
      },
      hidden: true
    }, {
      path: 'editTransaction',
      component: () => import('@/views/office/editTransaction'),
      name: 'EditTransaction',
      meta: {
        title: '事务对接表编辑',
        top_title: '日常',
        parentPath: '/office/report'
      },
      hidden: true
    },
    {
      path: 'approval',
      name: 'ApprovalManage',
      component: () => import('@/views/office/approval'),
      meta: {
        title: '审批流程',
        noCache: true,
        top_title: '日常',
        parentPath: '/office/approval'
      },
      key: 'index_index'
    },
    {
      path: 'approvalPage',
      name: 'ApprovalPageManage',
      component: () => import('@/views/office/approvalPage'),
      meta: {
        title: '审批流程',
        noCache: true,
        parentPath: '/office/approval',
        top_title: '日常'
      },
      hidden: true
    },
    {
      path: 'workSet',
      name: 'WorkSetManage',
      component: () => import('@/views/office/workSet'),
      meta: {
        title: '工作流类型',
        noCache: true,
        parentPath: '/office/approval',
        top_title: '日常'
      },
      hidden: true
    },
    {
      path: 'typeList',
      name: 'TypeListManage',
      component: () => import('@/views/office/typeList'),
      meta: {
        title: '工作流配置',
        noCache: true,
        parentPath: '/office/approval',
        top_title: '日常'
      },
      hidden: true
    },
    {
      path: 'complaint',
      name: 'ComplaintManage',
      component: () => import('@/views/common/complaint'),
      meta: {
        title: '投诉管理',
        top_title: '日常',
        noCache: true
      },
      key: 'complain_browse'
    },
    {
      path: 'complaintDetail',
      name: 'ComplaintDetailManage',
      component: () => import('@/views/common/follow'),
      meta: {
        title: '查看投诉',
        top_title: '日常',
        noCache: true,
        parentPath: '/office/complaint'

      },
      hidden: true
    },
    {
      path: 'complaintSet',
      name: 'ComplaintSetManage',
      component: () => import('@/views/common/complaintSet'),
      meta: {
        title: '投诉类型',
        top_title: '日常',
        noCache: true,
        parentPath: '/office/complaint'

      },
      hidden: true
    },
    {
      path: 'quality',
      name: 'QualityComplaintManage',
      component: () => import('@/views/common/qualityComplaint'),
      meta: {
        title: '质量件管理',
        top_title: '日常',
        noCache: true
      },
      key: 'quality_browse'
    },
    {
      path: 'qualityDetail',
      name: 'QualityComplaintDetailManage',
      component: () => import('@/views/common/qualityFollow'),
      meta: {
        title: '查看质量件',
        top_title: '日常',
        noCache: true,
        parentPath: '/office/quality'

      },
      hidden: true
    },
    {
      path: 'qualitySet',
      name: 'QualityComplaintSetManage',
      component: () => import('@/views/common/qualityComplaintSet'),
      meta: {
        title: '质量件类型',
        top_title: '日常',
        noCache: true,
        parentPath: '/office/quality'

      },
      hidden: true
    },
    // {
    //   path: 'daily',
    //   name: 'DailyManage',
    //   component: () => import('@/views/office/daily'),
    //   meta: {
    //     title: '员工日报',
    //     noCache: true
    //   },
    //   key: 'daily_browse'
    // },
    // {
    //   path: 'attendance',
    //   name: 'AttendanceManage',
    //   component: () => import('@/views/office/attendance'),
    //   meta: {
    //     title: '员工考勤',
    //     noCache: true
    //   },
    //   key: 'attendance_browse'
    // },
    {
      path: 'matterProgress',
      name: 'MatterProgress',
      component: () => import('@/views/office/matterProgress'),
      key: 'matter_browse',
      meta: {
        title: '事项通知',
        top_title: '日常',
        noCache: true
      }
    },
    {
      path: 'knowledgeBaseInfo',
      name: 'knowledgeBaseInfo',
      component: () => import('@/views/common/knowledgeBase/knowledgeBaseInfo'),
      meta: {
        title: '知识库',
        top_title: '日常',
        noCache: true,
        isShow: true // 若父路由可以点击，并且子路由隐藏则设为true
      },
      alwaysShow: true, // 若父路由下只有一个子路由，此属性设为true，则显示父路由
      key: 'knowledge_browse',
      children: []
    }
    ]
  },
  {
    path: '/administration',
    component: Index,
    name: 'Administration',
    redirect: 'noredirect',
    meta: {
      title: '员工考核',
      top_title: '考核',
      icon: 'administration',
      noCache: true
    },
    alwaysShow: true,
    full: false,
    children: [{
      path: 'questionBank',
      name: 'QuestionBank',
      key: 'itembank_browse',
      component: () => import('@/views/administration/questionBank'),
      meta: {
        title: '试题库',
        top_title: '考核',
        noCache: true
      }
    },
    {
      path: 'examIndex',
      name: 'ExamIndex',
      component: () => import('@/views/administration/paperList/examIndex'),
      key: 'dailypaper_browse',
      meta: {
        title: '试卷管理',
        top_title: '考核',
        noCache: true,
        isShow: true // 若父路由可以点击，并且子路由隐藏则设为true
      },
      alwaysShow: true,
      children: [{
        path: 'examInfo',
        component: () => import('@/views/administration/paperList/examInfo'),
        name: 'ExamInfo',
        meta: {
          title: '试卷详情',
          top_title: '考核',
          parentPath: '/administration/examIndex'
        }
      }]
    },
    {
      path: 'examHistory',
      name: 'ExamHistory',
      component: () => import('@/views/administration/paperHistory/examIndex'),
      key: 'dailyexam_browse',
      meta: {
        title: '考试结果',
        top_title: '考核',
        noCache: true,
        isShow: true // 若父路由可以点击，并且子路由隐藏则设为true
      },
      alwaysShow: true,
      children: [{
        path: 'examAnswer',
        component: () => import('@/views/administration/paperHistory/examAnswer'),
        name: 'ExamAnswer',
        meta: {
          title: '试卷详情',
          top_title: '考核',
          parentPath: '/administration/examHistory'
        }
      }]
    },
    {
      path: 'questionnaireIndex',
      name: 'QuestionnaireIndex',
      component: () => import('@/views/administration/paperList/questionnaireIndex'),
      meta: {
        title: '问卷管理',
        top_title: '考核',
        noCache: true,
        isShow: true // 若父路由可以点击，并且子路由隐藏则设为true
      },
      key: 'survey_browse',
      alwaysShow: true,
      children: [{
        path: 'questionnaireInfo',
        component: () => import('@/views/administration/paperList/questionnaireInfo'),
        name: 'QuestionnaireInfo',
        meta: {
          title: '问卷详情',
          top_title: '考核',
          parentPath: '/administration/questionnaireIndex'
        }
      }]
    },
    {
      path: 'questionnaireHistory',
      name: 'QuestionnaireHistory',
      component: () => import('@/views/administration/paperHistory/questionnaireHistoryIndex'),
      meta: {
        title: '问卷结果',
        top_title: '考核',
        noCache: true,
        isShow: true // 若父路由可以点击，并且子路由隐藏则设为true
      },
      key: 'surveyexam_browse',
      alwaysShow: true,
      children: [{
        path: 'questionnaireHistoryAnswer',
        component: () => import('@/views/administration/paperHistory/questionnaireHistoryAnswer'),
        name: 'QuestionnaireHistoryAnswer',
        meta: {
          title: '问卷详情',
          top_title: '考核',
          parentPath: '/administration/questionnaireHistory'
        }
      }]
    },
    {
      path: 'performanceIndex',
      name: 'PerformanceIndex',
      component: () => import('@/views/administration/paperList/performanceIndex'),
      key: 'performance_browse',
      meta: {
        title: '绩效管理',
        top_title: '考核',
        noCache: true,
        isShow: true // 若父路由可以点击，并且子路由隐藏则设为true
      },
      alwaysShow: true,
      children: [{
        path: 'performanceInfo',
        component: () => import('@/views/administration/paperList/performanceInfo'),
        name: 'performanceInfo',
        meta: {
          title: '绩效详情',
          top_title: '考核',
          parentPath: '/administration/performanceIndex'
        }
      }]
    },
    {
      path: 'performanceHistory',
      name: 'PerformanceHistory',
      component: () => import('@/views/administration/paperHistory/performanceIndex'),
      key: 'performanceexam_browse',
      meta: {
        title: '员工绩效',
        top_title: '考核',
        noCache: true,
        isShow: true // 若父路由可以点击，并且子路由隐藏则设为true
      },
      alwaysShow: true,
      children: [{
        path: 'performanceAnswer',
        component: () => import('@/views/administration/paperHistory/performanceAnswer'),
        name: 'PerformanceAnswer',
        meta: {
          title: '绩效详情',
          top_title: '考核',
          parentPath: '/administration/performanceHistory'
        }
      }]
    }
    ]
  },
  financialmanRouter,
  // {
  //   path: '/guangtonghui',
  //   component: Index,
  //   name: 'Guangdonghui',
  //   meta: {
  //     title: '广通汇',
  //     top_title: '广通汇',
  //     icon: 'guangtonghui',
  //     noCache: true
  //   },
  //   redirect: 'noredirect',
  //   alwaysShow: true,
  //   full: false,
  //   children: [
  //     {
  //       path: 'bussinessIndex',
  //       component: () => import('@/views/guangtonghui/business/bussinessIndex'),
  //       name: 'BussinessIndex',
  //       key: 'gthagent_browse',
  //       meta: {
  //         title: '商机管理',
  //         top_title: '广通汇',
  //         noCache: true,
  //         isShow: true // 若父路由可以点击，并且子路由隐藏则设为true
  //       },
  //       alwaysShow: true, // 若父路由下只有一个子路由，此属性设为true，则显示父路由
  //       children: [{
  //         path: 'follow',
  //         component: () => import('@/views/guangtonghui/business/follow'),
  //         name: 'FollowUp',
  //         meta: {
  //           title: '跟进'
  //         }
  //       }]
  //     },
  //     {
  //       path: 'transactionIndex',
  //       component: () => import('@/views/guangtonghui/transaction/transactionIndex'),
  //       name: 'TransactionIndex',
  //       key: 'gthagentbusiness_browse',
  //       meta: {
  //         title: '客户管理',
  //         isShow: true // 若父路由可以点击，并且子路由隐藏则设为true
  //       },
  //       children: [
  //         {
  //           path: 'info',
  //           component: () => import('@/views/guangtonghui/transaction/info'),
  //           name: 'IntentInfo',
  //           meta: {
  //             title: '客户详情'
  //           }
  //         }, {
  //           path: 'addorder',
  //           component: () => import('@/views/guangtonghui/transaction/addorder'),
  //           name: 'AddOrder',
  //           meta: {
  //             title: '下订单'
  //           }
  //         }, {
  //           path: 'follow',
  //           component: () => import('@/views/guangtonghui/transaction/follow'),
  //           name: 'IntentFollow',
  //           meta: {
  //             title: '跟进'
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'agreementIndex',
  //       component: () => import('@/views/guangtonghui/agreement/agreementIndex'),
  //       name: 'Agreement',
  //       meta: {
  //         title: '合同管理',
  //         noCache: true,
  //         isShow: true
  //       },
  //       key: 'gthcontract_browse',
  //       alwaysShow: true,
  //       children: [{
  //         path: 'find',
  //         component: () => import('@/views/guangtonghui/agreement/find'),
  //         name: 'Find',
  //         meta: {
  //           title: '查看'
  //         }
  //       }]
  //     }
  //     //  {
  //     //   path: 'level',
  //     //   name: 'LevelManage',
  //     //   key: 'gthlevel_browse',
  //     //   component: () => import('@/views/guangtonghui/level'),
  //     //   meta: {
  //     //     title: '群员等级',
  //     //     noCache: true
  //     //   }
  //     // }
  //   ]
  // },
  memberManagentRouter,
  {
    path: '/statement',
    component: Index,
    name: 'Statement',
    redirect: 'noredirect',
    meta: {
      title: '统计报表',
      top_title: '统计',
      icon: 'statement',
      noCache: true
    },
    alwaysShow: true,
    full: false,
    children: [{
      path: 'businessStatistics',
      name: 'BusinessStatistics',
      key: 'statisticstop_viewshangji',
      component: () => import('@/views/statement/businessStatistics'),
      meta: {
        top_title: '统计',
        title: '商机统计',
        noCache: true
      }
    },
    {
      path: 'transactionStatistics',
      name: 'TransactionStatistics',
      key: 'statisticstop_viewagent',
      component: () => import('@/views/statement/transactionStatistics'),
      meta: {
        title: '经销商统计',
        top_title: '统计',
        noCache: true
      }
    },
    {
      path: 'complainStatistics',
      name: 'ComplainStatistics',
      key: 'statisticscomplain_viewcount',
      component: () => import('@/views/statement/complainStatistics'),
      meta: {
        title: '投诉统计',
        top_title: '统计',
        noCache: true
      }
    },
    {
      path: 'attendanceStatistics',
      name: 'AttendanceStatistics',
      key: 'statisticscheckingin_viewcount',
      component: () => import('@/views/statement/attendanceStatistics'),
      meta: {
        title: '考勤统计',
        top_title: '统计',
        noCache: true
      }
    },
    {
      path: 'onlineStatistics',
      name: 'OnlineStatistics',
      key: 'statisticstrain_viewcount',
      component: () => import('@/views/statement/onlineStatistics'),
      meta: {
        title: '线上培训统计',
        top_title: '统计',
        noCache: true
      }
    },
    {
      path: 'offlineStatistics',
      name: 'OfflineStatistics',
      key: 'statisticstrain_viewcount',
      component: () => import('@/views/statement/offlineStatistics'),
      meta: {
        title: '商学院统计',
        top_title: '统计',
        noCache: true
      }
    },
    {
      path: 'birthdayStatistics',
      name: 'BirthdayStatistics',
      key: 'birthday_viewcount',
      component: () => import('@/views/statement/birthdayStatistics'),
      meta: {
        title: '生日统计',
        top_title: '统计',
        noCache: true
      }
    },
    {
      path: 'employeeStatistics',
      name: 'EmployeeStatistics',
      key: 'statisticsuser_viewcount',
      component: () => import('@/views/statement/employeeStatistics'),
      meta: {
        title: '员工统计',
        top_title: '统计',
        noCache: true
      }
    }]
  },
  usercenterRouter
// {
//   path: '/icon',
//   component: Index,
//   children: [{
//     path: 'index',
//     component: () => import('@/views/svg-icons/index'),
//     name: 'Icons',
//     meta: {
//       title: 'icons',
//       icon: 'icon',
//       noCache: true
//     }
//   }]
// }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
