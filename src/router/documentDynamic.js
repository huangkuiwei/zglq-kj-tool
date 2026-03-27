/* Layout */
import documentLayout from '../layout/documentSidebarLayout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }

*
* 配置在 dynamicRouterMap 中的路由，都将通过权限管理系统进行控制
* 通过从服务器中获取当前用户的权限信息，来决定某个路由是否出现在路由表当中
*/
const dynamicRouterMap = [
  {
    path: '/myDocument',
    meta: { title: '文档资料', icon: 'icon-wodewendang' },
    // redirect:'/projectFile?projectName=文档资料',
    component: documentLayout,
    props:true,
    children: [{
      path: '/myDocument',
      name: 'myDocument',
      component: () => import('@/views/project/Document/myDocument/index'),
    }],
    query: { projectName: '文档资料' }
  },
  {
    path: '/myCollection',
    meta: { title: '我的收藏', icon: 'iconfont icon-quxiaoshoucang' },
    component: documentLayout,
    children: [{
      path: '',
      name: 'myCollection',
      component: () => import('@/views/project/Document/myCollection/index')
    }]
  },
  {
    path: '/myShare',
    meta: { title: '我的分享', icon: 'icon-fenxiang' },
    component: documentLayout,
    children: [{
      path: '',
      name: 'myShare',
      component: () => import('@/views/project/Document/myShare/index')
    }]
  },
]

export default dynamicRouterMap
