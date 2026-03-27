// 跨界部署配置文件

// 环境名称
export const deployName = 'display'
// 是否私有化部署
export const isOwner = 1;
// space演示版本
export const isSpace = 1;

// 网页标题
export const webTitle = "跨~界云空间";
// "KSJ-Space";

const deployFolder = isOwner ? "tky-deploy" : "deploy";
// 登录界面

// 背景图
export const loginBackgroundImage = require(`/static/deployImage/${deployFolder}/login-bg.jpg`);
// 登录框顶部logo
export const loginFormLogo = require(`/static/deployImage/${deployFolder}/kj-logo.svg`);
// 登录框顶部用标题还是logo
export const loginFormHead = 'logo'

// 底部logo
export const loginBottomLogo = require(`/static/deployImage/${deployFolder}/R-logo.png`);

// 平台界面
// header栏logo
export const headerLogo = require("/static/deployImage/" + deployFolder + "/kj-logo.png");
export const loginLogoHeight = 0

// 项目空间等边栏底部logo
export const sideBarLogo = require("/static/deployImage/" + deployFolder + "/R-logo.png");

// 主目录显示模块
export const sideBarModules = ["项目空间", "文档资料", "工作台", "团队协作", "公共资源", "学习园地", "系统设置"];

export const showAppTitle = false

export const appImgFolder = isOwner ? "start-owner" : "start";
export const appList = [
  {
    type: "bimwindows",
    appName: "BIM Windows",
    title: "看模王",
    isEdit: false,
    origin: 'KmwOrigin'
  },
  {
    type: "bimstation",
    appName: "BIM Station",
    title: "毕昇",
    isEdit: true,
    origin: 'BimStationOrigin'
  },
  {
    type: "bimfactory",
    appName: "BIM-Factory",
    title: "翻模王",
    isEdit: true,
    origin: 'BimFactoryOrigin'
  },
  {
    type: "bimgpt",
    appName: "BIM-GPT",
    title: "总模王",
    isEdit: true,
    origin: 'BimGPTOrigin'
  },
  {
    type: "cscmodeler",
    appName: "BIM-OneAll",
    title: "一模通",
    isEdit: true,
    origin: 'CscOneAllOrigin'
  },
  {
    type: "sitelayout",
    appName: "BIM-SiteAll",
    title: "临建通",
    isEdit: true,
    origin: 'CscSiteAllOrigin'
  },

];
appList.forEach((item) => {
  // item.image = require(`/public/desktop-2024/image/${item.title}.png`);
  item.start = require(`/public/desktop-2024/${appImgFolder}/${item.title}.png`);
  item.logo = require(`/public/desktop-2024/logo/${item.title}.png`);
});