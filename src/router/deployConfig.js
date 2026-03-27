// 超管 私有化部署配置页面
const deployConfigRouters = [
  {
    path: "/deployConfig",
    redirect:'/adminLogin',
    hidden: true,
    component: () => import("@/views/DeployConfig/container"),
    children: [
      {
        path: "/adminLogin",
        name:"登录界面",
        hidden: true,
        component: () => import("@/views/DeployConfig/adminLogin"),
      },
      {
        path: "/companyConfig",
        name:"企业配置",
        hidden: false,
        component: () => import("@/views/DeployConfig/companyConfig"),
      },
      {
        path: "/interfaceConfig",
        name:"配置界面",
        hidden: false,
        component: () => import("@/views/DeployConfig/interfaceConfig"),
      },
      {
        path: "/serviceConfig",
        name:"服务配置",
        hidden: false,
        component: () => import("@/views/DeployConfig/serviceConfig"),
      },
      {
        path: "/menuPermissionConfig",
        name:"菜单权限配置",
        hidden: false,
        component: () => import("@/views/DeployConfig/menuPermissonConfig"),
      }
    ],
  },
];

export default deployConfigRouters;
