/* Layout */
import projectLayout from '../layout/sidebarLayout'
import NavbarLayout from "../layout/navbarLayout";

const dynamicRouterMap = [
  {
    path: '/lately',
    meta: {
      title: '最近浏览',
      icon: 'clock',
      name: 'projects.menu.recently'
    },
    component: projectLayout,
    children: [{
      path: '/lately',
      name: 'lately',
      meta: {
        nav: 'projects',
        keepAlive: true
      },
      component: () => import('@/views/project/main/lately')
    }]
  },
  {
    path: '/all',
    meta: {
      title: '全部项目',
      icon: 'all',
      name: 'projects.menu.all'
    },
    component: projectLayout,
    children: [{
      path: '/all',
      name: 'all',
      meta: {
        nav: 'projects',
        keepAlive: true
      },
      component: () => import('@/views/project/main/all')
    }]
  },
  {
    path: '/myCreated',
    meta: {
      title: '我的项目',
      icon: 'created',
      name: 'projects.menu.my'
    },
    component: projectLayout,
    children: [{
      path: '/myCreated',
      name: 'myCreated',
      meta: {
        nav: 'projects',
        keepAlive: true
      },
      component: () => import('@/views/project/main/myCreated')
    }]
  },
  {
    path: '/myParticipateIn',
    meta: {
      title: '我参与的',
      icon: 'part',
      name: 'projects.menu.participation'
    },
    component: projectLayout,
    children: [{
      path: '/myParticipateIn',
      name: 'myParticipateIn',
      meta: {
        nav: 'projects',
        keepAlive: true
      },
      component: () => import('@/views/project/main/myParticipateIn')
    }]
  },

  {
    path: '/myCollectionProject',
    meta: {
      title: '收藏项目',
      icon: 'collect',
      name: 'projects.menu.collect'
    },
    component: projectLayout,
    children: [{
      path: '/myCollectionProject',
      name: 'myCollectionProject',
      meta: {
        nav: 'projects',
        keepAlive: true
      },
      component: () => import('@/views/project/main/myCollection')
    }]
  },

  // {
  //   path: '/myShare',
  //   meta: {
  //     title: '我的分享',
  //     icon: 'part',
  //     name: 'base.button.myShare'
  //   },
  //   component: projectLayout,
  //   children: [{
  //     path: '/myShare',
  //     name: 'myShare',
  //     meta: {
  //       nav: 'projects',
  //       keepAlive: true
  //     },
  //     component: () => import('@/views/project/Document/myShare/index')
  //   }]
  // },
  //
  // {
  //   path: '/myCollection',
  //   meta: {
  //     title: '我的收藏',
  //     icon: 'collect',
  //     name: 'base.button.myCollection'
  //   },
  //   component: projectLayout,
  //   children: [{
  //     path: '/myCollection',
  //     name: 'myCollection',
  //     meta: {
  //       nav: 'projects',
  //       keepAlive: true
  //     },
  //     component: () => import('@/views/project/Document/myCollection/index')
  //   }]
  // },

  {
    path: '/myDownload',
    meta: {
      title: '我的下载',
      icon: 'created',
      name: 'base.button.myDownload'
    },
    component: projectLayout,
    children: [{
      path: '/myDownload',
      name: 'myDownload',
      meta: {
        nav: 'projects',
        keepAlive: true
      },
      component: () => import('@/views/project/Document/myDownload/index')
    }]
  },

  // 大屏展示
  {
    path: "/bigScreen",
    hidden: true,
    component: () => import("@/views/project/bigScreen/index"),
  },
  // 项目文件列表
  {
    path: "/projectFile",
    component: NavbarLayout,
    hidden: true,
    children: [
      {
        meta: {
          nav: 'projects',
          keepAlive: true
        },
        path: "/projectFile",
        name: "projectFile",
        component: () => import("@/views/project/file/index"),
      },
    ],
  },
]

export default dynamicRouterMap
