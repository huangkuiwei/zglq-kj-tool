import platfromCenter from "../views/SystemSetting/index";
import NavbarLayout from "../layout/navbarLayout";
const platformRouters = [
  {
    path: "/systemSetting",
    hidden: true,
    component: NavbarLayout,
    children: [
      {
        path: "/systemSetting",
        hidden: true,
        meta: { title: "平台管理", icon: "" },
        component: platfromCenter,
        // redirect: "/notice",
        children: [
          {
            path: "/notice",
            name: "notice",
            meta: {
              nav: 'setting',
              key: "notice",
              permi: 'setting:announcement:*',
              title: "公告管理",
              name: 'settings.nav.notice'
            },
            component: () => import("@/views/SystemSetting/noticeManagement"),
          },
          // {
          //   path: "/member",
          //   name: "member",
          //   meta: {
          //     title: "组织管理",
          //     permi: 'setting:member:*',
          //     key: "member",
          //     name: 'settings.nav.member'
          //   },
          //   component: () => import("@/views/SystemSetting/member"),
          // },
          {
            path: "/dept",
            name: "dept",
            meta: {
              nav: 'setting',
              key: "dept",
              permi: 'setting:divisional:*',
              title: "组织管理",
              name: 'settings.nav.organization'
            },
            component: () => import("@/views/SystemSetting/dept"),
          },
          {
            path: "/role",
            name: "role",
            meta: {
              nav: 'setting',
              key: "role",
              permi: 'setting:role:*',
              title: "角色管理",
              name: 'settings.nav.role'
            },
            component: () => import("@/views/SystemSetting/role"),
          },
          {
            path: "/workflow",
            name: "workflow",
            meta: {
              nav: 'setting',
              title: "流程管理",
              permi: 'setting:processman:*',
              key: "workflow",
              name: 'settings.nav.workflow'
            },
            component: () => import("@/views/SystemSetting/workflowManagement/index"),
          },
          {
            path: "/dict",
            name: "dict",
            meta: {
              nav: 'setting',
              key: "dict",
              permi: 'setting:datadictionary:*',
              title: "数据字典",
              name: 'settings.nav.dict'
            },
            component: () => import("@/views/SystemSetting/dataDictionary"),
          },
          {
            path: "/operlog",
            name: "operlog",
            meta: {
              nav: 'setting',
              key: "operlog",
              permi: 'setting:Logman:*',
              title: "日志管理",
              name: 'settings.nav.log'
            },
            component: () => import("@/views/SystemSetting/operLog"),
          },
          {
            path: "/map",
            name: "map",
            meta: {
              nav: 'setting',
              key: "map",
              permi: 'setting:Serverman:*',
              title: "地图配置",
              name: 'settings.nav.map'
            },
            component: () => import("@/views/SystemSetting/mapKeyConfig"),
          },
        ],
      },
    ],
  },
];

export default platformRouters;
