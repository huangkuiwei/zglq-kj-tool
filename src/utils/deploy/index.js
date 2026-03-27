// 部署配置 是否私有化,演示版

import Vue from "vue";

import {
  deployName,
  isSpace,
  isOwner,
  appImgFolder,
  appList,
  showAppTitle,
  sideBarModules,
  sideBarLogo,
  headerLogo,
  loginLogoHeight,
  loginBackgroundImage,
  loginBottomLogo,
  loginFormLogo,
  loginFormHead,
  webTitle,
} from "./version/deploy-luqiao-new.js";

export const websiteTitle = webTitle;
export const isSpaceEnv = isSpace;

// share
Vue.prototype.$shareUrl = location.origin + '/#/s';
Vue.prototype.$shareUrlH5 = location.origin + '/#/shareH5';

// 是否私有化部署
Vue.prototype.$deployName = deployName;
Vue.prototype.$isOwner = isOwner;

// 工作台标题
Vue.prototype.$showAppTitle = showAppTitle;

// 网站标题
Vue.prototype.$webTitle = webTitle;
// 是否space环境
Vue.prototype.$isSpace = isSpace;
// 网页顶部logo
Vue.prototype.$headerLogo = headerLogo;
// 网页顶部logo高度
Vue.prototype.$loginLogoHeight = loginLogoHeight;
// 登录页面背景
Vue.prototype.$loginBackgroundImage = loginBackgroundImage;
// 登录页底部logo
Vue.prototype.$loginBottomLogo = loginBottomLogo;
// 登录页表单顶部logo
Vue.prototype.$loginFormLogo = loginFormLogo;
// 指定登录页表单顶部使用logo还是标题
Vue.prototype.$loginFormHead = loginFormHead;

// 项目空间等边栏底部logo
Vue.prototype.$sideBarLogo = sideBarLogo;
// 网站左侧模块
Vue.prototype.$sideBarModules = sideBarModules;
// 应用台图片文件夹
Vue.prototype.$appImgFolder = appImgFolder;
// 应用台应用列表
Vue.prototype.$appList = appList;
