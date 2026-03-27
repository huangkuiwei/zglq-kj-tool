// 交通运输部公路科学研究院

// 环境名称
export const deployName = 'rioh'
// 是否私有化部署
export const isOwner = 1;
// space演示版本
export const isSpace = 1;

// 网页标题
export const webTitle = "RIOH 4.0";

const deployFolder = "rioh";
// 登录界面

// 背景图
export const loginBackgroundImage = require(`/static/deployImage/${deployFolder}/login-bg.jpg`);
// 登录框顶部logo
export const loginFormLogo = require(`/static/deployImage/${deployFolder}/login-logo.png`);
// 登录框顶部用标题还是logo
export const loginFormHead = 'logo'

// 底部logo
export const loginBottomLogo = require(`/static/deployImage/${deployFolder}/logo.png`);

// 平台界面
// header栏logo
export const headerLogo = require("/static/deployImage/" + deployFolder + "/logo.png");
export const loginLogoHeight = '56px'

// 项目空间等边栏底部logo
export const sideBarLogo = require("/static/deployImage/" + deployFolder + "/logo.png");

// 主目录显示模块
export const sideBarModules = ["项目空间", "工作台", "团队协作", "公共资源", "系统设置"];

export const showAppTitle = false

export const appImgFolder = isOwner ? "start-owner" : "start";
export const appList = [
  {
    type: "bimstation",
    appName: "BIM Station",
    title: "毕昇",
    isEdit: true,
    origin: 'BimStationOrigin'
  },
  {
    type: "bimwindows",
    appName: "BIM Windows",
    title: "看模王",
    isEdit: false,
    origin: 'KmwOrigin'
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
  item.start = require(`/public/desktop-2024/rioh.jpg`);
  item.logo = require(`/public/desktop-2024/logo/${item.title}.svg`);
});
let isMac = /macintosh|mac os x/i.test(navigator.userAgent);

export const appTools = [
  {
    appName: "AutoCAD",
    type: 0,
    ref: "ACAD://",
    logo: require("/public/logo/AutoCAD.jpg"),
  },
  {
    appName: "MicroStation",
    type: 0,
    ref: "MS://",
    logo: require("/public/logo/MicroStation.png"),
  },
  {
    appName: "OpenRoads Designer",
    type: 0,
    ref: "ORD://",
    logo: require("/public/logo/OpenRoads.png"),
  },
  {
    appName: "桥梁大师",
    type: 0,
    ref: "BM://",
    logo: require("/public/logo/BM.png"),
  },
  {
    appName: "设计大师CSD",
    type: 0,
    ref: "CSD://",
    logo: require("/public/logo/CSD.png"),
  },
  {
    appName: "建造大师CSC",
    type: 1,
    ref: "http://cd01xmzhglpt.polycd.com:8090/",
    logo: require("/public/logo/CSC.png"),
  },
  {
    appName: "可视化评审系统",
    type: 1,
    ref: "https://kshps.ksj.com.cn/#/",
    logo: require("/public/logo/CSP.png"),
  },
  {
    appName: "腾讯会议",
    type: 0,
    // ref: "TXM://",
    ref: "wemeet://",
    logo: require("/public/logo/TXM.png"),
  },
  {
    appName: "WORD",
    type: 0,
    ref: isMac ? "WORD://" : "ms-word://",
    logo: require("/public/logo/word.png"),
  },
  {
    appName: "EXCEL",
    type: 0,
    ref: isMac ? "EXCEL://" : "ms-excel://",
    logo: require("/public/logo/excel.png"),
  },
  {
    appName: "PowerPoint",
    type: 0,
    ref: isMac ? "PPT://" : "ms-powerpoint://",
    logo: require("/public/logo/ppt.png"),
  },
];
