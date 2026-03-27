// 中铁四局 私有化部署 非space
// 部署配置文件
export const deployName = 'zt4j'

// 是否私有化部署
export const isOwner = 1;
// space演示版本
export const isSpace = 1;
// 网页标题
export const webTitle = "协同交付平台";


const deployFolder = "tky-deploy";
// 登录界面
export const loginBackgroundImage = require(`/static/deployImage/${deployFolder}/login-bg.jpg`);
// 登录框顶部logo
export const loginFormLogo = require(`/static/deployImage/${deployFolder}/kj-logo.svg`);
// 登录框顶部用标题还是logo
export const loginFormHead = 'title'
// 底部logo
export const loginBottomLogo = require(`/static/deployImage/${deployFolder}/R-logo.png`);
// 平台界面
// header栏logo
export const headerLogo = require("/static/deployImage/" + deployFolder + "/kj-logo.png");
export const loginLogoHeight = '56px'

// 项目空间等边栏底部logo
export const sideBarLogo = require("/static/deployImage/" + deployFolder + "/R-logo.png");

// 主目录显示模块
export const sideBarModules = ["工作台", "项目空间"]
export const showAppTitle = false

export let appList = [
  {
    type: "bimwindows",
    appName: "BIM Windows",
    title: "看模王",
    isEdit: false,
    origin: 'KmwOrigin'
  },
  // {
  //   type: "bimComposer",
  //   appName: "BIM Composer",
  //   title: "BIM云编辑",
  // },
  // {
  //   type: "bimstation",
  //   appName: "BIM Station",
  //   title: "BIM云建模",
  // },
  // {
  //   type: "csdmodeler",
  //   appName: "CSD Modeler",
  //   title: "路桥隧快速建模",
  // },
  // {
  //   type: "bimWorks",
  //   appName: "BIM Works",
  //   title: "总体方案设计",
  // },

  // {
  //   type: "cscwbs",
  //   appName: "CSC WBS",
  //   title: "施工任务分解",
  // },
  // {
  //   type: "cscmodeler",
  //   appName: "CSC Modeler",
  //   title: "施工模型深化",
  // },
  // {
  //   type: "cscschedule",
  //   appName: "CSC 4D",
  //   title: "施工进度管理",
  // },
  // {
  //   type: "presentation",
  //   appName: "CSC Simulate",
  //   title: "施工模拟动画",
  // },
  // {
  //   type: "sitelayout",
  //   appName: "CSC Sitelayout",
  //   title: "临建规划及场地布置",
  // },
  //  {
  //     type: "steelboxgirder",
  //     appName: "CSD SteelBridge",
  //     title: "钢箱梁设计",
  // },
  // {
  //     type: "bimcompetion",
  //     appName: "BIM Competition",
  //     title: "设计方案评比",
  // }
];
export const appImgFolder = "start-owner";

appList.forEach((item) => {
  // item.image = require(`/public/desktop-2024/image/${item.title}.png`);
  item.start = require(`/public/desktop-2024/${appImgFolder}/${item.title}.png`);
  item.logo = require(`/public/desktop-2024/logo/${item.title}.svg`);
});

// 工作台桌面应用
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