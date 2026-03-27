import systemCenter from "@/views/superAdmin/index";
import NavbarLayout from "@/layout/navbarLayout";

const platformRouters = [
  {
    path: "/adminSystem",
    meta: { title: "系统管理", icon: "", homeLink: true },
    hidden: true,
    component: NavbarLayout,
    children: [
      {
        path: "/adminSystem",
        redirect: '/companyManagement',
        component: systemCenter,
        children: [
          {
            path: "/companyManagement",
            meta: {
              key: "companyManagement",
              title: "企业管理",
              name: 'settings.nav.companyManagement',
              homeLink: true
            },
            component: () => import("@/views/superAdmin/companyManagement"),
          },
          // {
          //   path: "/personManagement",
          //   meta: {
          //     title: "用户管理",
          //     key: "personManagement",
          //     name: 'settings.nav.personManagement',
          //     homeLink: true
          //   },
          //   component: () => import("@/views/superAdmin/personalManagement"),
          // },
          {
            path: "/questionAnswer",
            meta: {
              title: "常见问题",
              key: "questionAnswer",
              name: 'settings.nav.questionAnswer',
              homeLink: true
            },
            component: () => import("@/views/systemSetting/FAQ"),
          },

          {
            path: "/privateResource",
            meta: {
              title: "系统构件库",
              key: "map",
              name: 'settings.nav.privateResource',
              homeLink: true
            },
            component: () => import("@/views/superAdmin/privateResource"),
          },
          {
            path: "/platformDictionary",
            meta: {
              title: "数据字典",
              key: "dict",
              name: 'settings.nav.platformDict',
              homeLink: true
            },
            component: () => import("@/views/superAdmin/platformDictionary"),
          },
          // 版本页面
          {
            path: "/clientVersion",
            meta: {
              title: "客户端管理",
              key: "clientVersion",
              name: 'settings.nav.clientVersion',
              homeLink: true
            },
            component: () => import("@/views/ClientVersion/VersionManage"),
          },
        ]
      },
    ],
  },
];

export default platformRouters;
