import store from "./../store";
import router from "./../router";
import { constantRouterMap } from "./index";
import knowledgeBaseRouterMap from "./knowledgeBase";
import systemRouterMap from "./systemSetting";
import menuHelper from "@/utils/tools";

export default async function loadPermittedRouterMap() {
  // 直接splice操作源数据会导致signalr更新时缺少数据,需要[].concat()深拷贝
  let k = [].concat(knowledgeBaseRouterMap);
  let s = [].concat(systemRouterMap);
  let permittedRoutes = k.concat(s);
  let rlist = [];
  permittedRoutes.forEach((item) => {
    if (rlist.indexOf(item) < 0) {
      rlist.push(item);
    }
  });

  let routerMap = menuHelper.sortTree(rlist);
  // 在此处才将匹配不到就跳转到 404 的规则加入路由表
  // 是为了解决页面刷新就跳转到 404 的问题

  router.addRoutes(
    routerMap.concat([{ path: "*", redirect: "/404", hidden: true }])
  );

  // 组合成完整的路由表
  const fullRouterMap = constantRouterMap.concat(routerMap);
  store.dispatch("setRouterMap", fullRouterMap);
}
