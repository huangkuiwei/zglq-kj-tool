/* Layout */
import knowledgeBaseLayout from '../layout/knowledgeBaseLayout'
const dynamicRouterMap = [
  {
    path: '/commonBuildLibrary',
    meta: {
      title: '公共构件库',
      icon: 'component',
      name: 'comLib.nav.commonBuildLibrary'
    },
    component: knowledgeBaseLayout,
    children: [{
      path: '',
      name: 'commonBuildLibrary',
      meta: {
        nav: 'resource'
      },
      component: () => import('@/views/PublicResource/commonBuildLibrary/index')
    }]
  },
  {
    path: '/blueprintData',
    meta: {
      title: '公共图纸库',
      icon: 'drawings',
      name: 'comLib.nav.drawings'
    },
    component: knowledgeBaseLayout,
    children: [{
      path: '',
      meta: {
        nav: 'resource'
      },
      name: 'blueprint',
      component: () =>
        import('@/views/PublicResource/blueprintData/index')
    }]
  },
  // {
  //   path: '/materialLibrary',
  //   meta: {
  //     title: '材质库',
  //     icon: 'material',
  //     name: 'comLib.nav.materialLibirary'
  //   },
  //   component: knowledgeBaseLayout,
  //   children: [{
  //     path: '',
  //     meta: {
  //       nav: 'resource'
  //     },
  //     name: 'Material',
  //     component: () => import('@/views/PublicResource/material/index')
  //   }]
  // },
  {
    path: '/standardData',
    meta: {
      title: '公共标准库',
      icon: 'standard',
      name: 'comLib.nav.standard'
    },
    component: knowledgeBaseLayout,
    children: [{
      path: '',
      meta: {
        nav: 'resource'
      },
      name: 'StandardInfo',
      component: () => import('@/views/PublicResource/standardData/index')
    }]
  },
  {
    path: '/companyKnowledgeBase',
    meta: {
      title: '企业文件库',
      icon: 'resource',
      name: 'comLib.nav.companyKnowledge'
    },
    component: knowledgeBaseLayout,
    children: [{
      path: '',
      meta: {
        nav: 'resource'
      },
      name: 'Company',
      component: () => import('@/views/PublicResource/companyKnowledgeBase/index')
    }]
  },
  
  {
    path: '/myKnowledgeBase',
    meta: {
      title: '个人文件库',
      icon: 'part',
      name: 'comLib.nav.myKnowledge'
    },
    component: knowledgeBaseLayout,
    children: [{
      path: '',
      meta: {
        nav: 'resource'
      },
      name: 'Mine',
      component: () => import('@/views/PublicResource/myKnowledgeBase/index')
    }]
  },
  
  {
    path: '/myCollectionKnowledgeBase',
    meta: {
      title: '我收藏的',
      icon: 'collect',
      name: 'comLib.nav.myCollect'
    },
    component: knowledgeBaseLayout,
    children: [{
      path: '',
      meta: {
        nav: 'resource'
      },
      name: 'myCollectionKnowledgeBase',
      component: () => import('@/views/PublicResource/myCollectionKnowledgeBase/index')
    }]
  },
  {
    path: '/myComponents',
    meta: {
      title: '我上传的',
      icon: 'approve',
      name: 'comLib.nav.myComponents'
    },
    component: knowledgeBaseLayout,
    children: [{
      path: '/myComponents',
      name: 'myComponents',
      meta: {
        nav: 'resource'
      },
      component: () => import('@/views/PublicResource/myComponents/index')
    }]
  },
  {
    path: '/approve',
    meta: {
      title: '构件审批',
      icon: 'approve',
      name: 'comLib.nav.approve'
    },
    component: knowledgeBaseLayout,
    children: [{
      path: '/approve',
      name: 'approve',
      meta: {
        nav: 'resource'
      },
      component: () => import('@/views/PublicResource/approve/index')
    }]
  }
]

export default dynamicRouterMap
