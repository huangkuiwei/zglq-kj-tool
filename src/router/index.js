import Vue from "vue";
import Router from "vue-router";
import store from "../store/index";
import shareInitLayout from "../layout/shareInitLayout";
import NavbarLayout from "../layout/navbarLayout";
import adminSetting from "./adminSetting";
import system from "./systemSetting";
import deployConfig from "./deployConfig";
import projectDynamic from './projectDynamic'
export const constantRouterMap = [

  // 登录
  {
    path: "/login",
    component: () => import("@/views/login/Login"),
    // component: () => import("@/views/Login/index"),
    hidden: true,
  },
  {
    path: "/OALogin",
    component: () => import("@/views/Login/OALogin"),
    hidden: true
  },
  // 首页
  {
    path: "/",
    // redirect: "/all",
    redirect: "/clouddesktop",
    hidden: true,
  },
  // 工作台
  {
    path: "/clouddesktop",
    component: NavbarLayout,
    hidden: true,
    children: [
      {
        path: "/clouddesktop",
        name: "clouddesktop",
        component: () => import("@/views/CloudDesktop/index"),
      },
    ]
  },
  // 项目空间
  ...projectDynamic,
  // 团队协作
  {
    path: "/teamwork",
    component: NavbarLayout,
    hidden: true,
    children: [
      {
        path: "/teamwork",
        name: "teamwork",
        component: () => import("@/views/teamwork/index"),
      },
    ],
  },
  // 系统管理
  // ...adminSetting,
  // 超管平台管理
  // ...system,
  // 私有化部署平台配置
  // ...deployConfig,
  // 404页面
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  // 旧首页
  {
    path: "/AppHomepage",
    meta: {
      keepAlive: false,
    },
    component: () => import("@/views/AppHomepage"),
    hidden: true,
  },
  // 账号中心
  {
    path: "/userCenter",
    component: NavbarLayout,
    hidden: true,
    children: [
      {
        path: "/userCenter",
        name: "userCenter",
        meta: {
          homeLink: true,
        },
        component: () => import("@/views/AccountCenter/index"),
      },
    ],
  },
  // 账号验权
  {
    path: "/systemInitError",
    hidden: true,
    name: "systemInitError",
    component: () => import("@/views/systemInitError"),
  },
  // 分享
  {
    path: "/s",
    component: shareInitLayout,
    hidden: true,
    children: [
      {
        path: "/s",
        name: "s",
        component: () => import("@/views/Project/share/index"),
      },
    ],
  },
  // 移动端分享
  {
    path: "/shareH5",
    hidden: true,
    component: () => import("@/views/Project/share/h5/shareH5.vue"),
  },
  // bimWorks项目汇报
  {
    path: "/html",
    hidden: true,
    component: () => import("@/views/Project/share/html/report.vue"),
  },
  // 学习园地
  {
    path: "/classonline",
    component: shareInitLayout,
    hidden: true,
    children: [
      {
        path: "/classonline",
        name: "classonline",
        component: () => import("@/views/ClassOnline/index"),
      },
    ],
  },
  // 模型页面
  {
    path: "/bimiframe",
    component: NavbarLayout,
    hidden: true,
    children: [
      {
        path: "",
        name: "bimiframe",
        component: () => import("@/views/Project/bimiframe/index"),
      },
    ],
  },
  // 企业详情
  {
    path: "/corpDetail",
    component: NavbarLayout,
    children: [
      {
        path: "",
        meta: {
          homeLink: true,
        },
        name: "corpDetail",
        component: () => import("@/views/spaceAndPerson/corpDetail"),
      },
    ],
  },
];
Vue.use(Router);
const router = new Router({
  // mode: 'history', //后端支持可开
  // scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
});
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
router.beforeEach((to, from, next) => {
  store.commit("SET_PREVIEW_CONTAINER_UNVISIBLE", false);
  store.commit("SETUPLOADER_VISIBLE", "clear"); //关闭上传窗口
  if (to.meta.nav == 'projects') {
    store.commit('SET_ACTIVE_TAB', 'projects')
  }
  else if (to.path == '/teamwork') {
    store.commit('SET_ACTIVE_TAB', 'teamwork')
  } else if (to.meta.nav == 'setting') {
    store.commit('SET_ACTIVE_TAB', 'setting')
  }

  let iframe = document.querySelector("iframe");
  if (
    iframe &&
    iframe.contentWindow
  ) {
    //切换到非模型界面时，关闭模型
    var command = "ImodelClose";
    var data = null;
    iframe.contentWindow.postMessage(
      {
        command,
        data,
      },
      process.env.GisIframeOrigin
    );
  }
  next();
});
export default router;
