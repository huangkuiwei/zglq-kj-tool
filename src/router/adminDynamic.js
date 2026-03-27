/* Layout */
import isadminLayout from '../layout/adminLayout'

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
const dynamicRouterMap = [{
  path: '/alladmin',
  meta: { title: '正在转码', icon: 'icon-zuijin' },
  component: isadminLayout,
  children: [{
    path: '',
    name: 'alladmin',
    component: () =>
      import('@/views/alladmin/index')
  }]
},
{
  path: '/fulfil',
  meta: { title: '完成信息', icon: 'icon-zuijin' },
  component: isadminLayout,
  children: [{
    path: '',
    name: 'fulfil',
    component: () =>
      import('@/views/alladmin/fulfil')
  }]
},
{
  path: '/Infolog',
  meta: { title: '信息日志', icon: 'icon-zuijin' },
  component: isadminLayout,
  children: [{
    path: '',
    name: 'Infolog',
    component: () =>
      import('@/views/alladmin/Infolog')
  }]
},
{
  path: '/Errorlog',
  meta: { title: '错误日志', icon: 'icon-zuijin' },
  component: isadminLayout,
  children: [{
    path: '',
    name: 'Errorlog',
    component: () =>
      import('@/views/alladmin/Errorlog')
  }]
},
{
  path: '/FileOccupancy',
  meta: { title: '文件占用', icon: 'icon-zuijin' },
  component: isadminLayout,
  children: [{
    path: '',
    name: 'FileOccupancy',
    component: () =>
      import('@/views/alladmin/FileOccupancy')
  }]
},
{
  path: '/batCommand',
  meta: { title: 'bat转码文件', icon: 'icon-zuijin' },
  component: isadminLayout,
  children: [{
    path: '',
    name: 'batCommand',
    component: () =>
      import('@/views/alladmin/batCommand')
  }]
},
{
  path: '/customerManagement',
  meta: { title: '客户管理', icon: 'icon-zuijin' },
  component: isadminLayout,
  children: [{
    path: '',
    name: 'customerManagement',
    component: () =>
      import('@/views/alladmin/customerManagement')
  }]
},
{
  path: '/dataDictionary',
  meta: { title: '数据字典', icon: 'icon-zuijin' },
  component: isadminLayout,
  children: [{
    path: '',
    name: 'dataDictionary',
    component: () =>
      import('@/views/alladmin/dataDictionary')
  }]
},
{
  path: '/helpCenterManagement',
  meta: { title: '帮助中心管理', icon: 'icon-zuijin' },
  component: isadminLayout,
  children: [{
    path: '',
    name: 'helpCenterManagement',
    component: () =>
      import('@/views/alladmin/helpCenterManagement')
  }]
},
{
  path: '/companyManagement',
  meta: { title: '企业客户管理', icon: 'icon-zuijin' },
  component: isadminLayout,
  children: [{
    path: '',
    name: 'companyManagement',
    component: () =>
      import('@/views/superAdmin/companyManagement')
  }]
},
{
  path: '/personalManagement',
  meta: { title: '个人客户管理', icon: 'icon-zuijin' },
  component: isadminLayout,
  children: [{
    path: '',
    name: 'personalManagement',
    component: () =>
      import('@/views/superAdmin/personalManagement')
  }]
},
{
  path: '/backgroundManagement',
  meta: { title: '后台管理', icon: 'icon-zuijin' },
  component: isadminLayout,
  children: [{
    path: '',
    name: 'backgroundManagement',
    component: () =>
      import('@/views/superAdmin/backgroundManagement')
  }]
},
]

export default dynamicRouterMap
