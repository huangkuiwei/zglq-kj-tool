// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";

// 部署版本配置
import './utils/deploy/index.js'

import ElementUI from "element-ui";
import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n
import registerNavigateGuard from "./navigate-guard"; // permission control

import i18n from '/static/locales/index'

import addVueExtenssions from "./utils/extenssions";
import "@/assets/icon/iconfont.js";
import "@/assets/iconworld/iconfont.js";
import * as echarts from 'echarts';

import VideoPlayer from "vue-video-player"; /*  */
import ksjButton from "@/components/Button/toolBoxButton";
import * as dd from "dingtalk-jsapi";
import * as WPS from "../static/jwps.es6";

import "@/utils/ApiInterface.js";

import signalR from "@/utils/signalR";
import uploader from "vue-simple-uploader";
import VueDraggableResizable from "vue-draggable-resizable";
import VueClipboards from "vue-clipboard2";
import Chat from "vue-beautiful-chat";

import mainSideMenu from '@/layout/mainSideMenu'
Vue.component('mainSideMenu', mainSideMenu)

import ksjTable from "@/components/table/ksjTable";
import ksjColumn from "@/components/table/ksjTableColumn";

import "@/styles/index.scss"; // global css
import "@/styles/flex-base.scss"; // global css
import "@/icons"; // icon
// import 'element-ui/lib/theme-chalk/index.css';
import "./utils/dialogDrag";
import "./utils/dialogClick";
import "video.js/dist/video-js.css";
import "./utils/ztree/jquery-1.4.4.min.js";
import "./utils/ztree/zTreeStyle.css";
import "./utils/ztree/jquery.ztree.core.js";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import encrypt$ from "dingtalk-jsapi/api/biz/util/encrypt";

ElementUI.Dialog.props.lockScroll.default = false;

addVueExtenssions();
Vue.component("vue-draggable-resizable", VueDraggableResizable);

Vue.use(VideoPlayer);

// import "videojs-flash";
Vue.prototype.wps = WPS;

window.eventBus = new Vue();
Vue.use(signalR);

Vue.use(VueClipboards);
Vue.use(Chat);
Vue.component("ksj-table", ksjTable);
Vue.component("ksj-table-column", ksjColumn);
Vue.use(uploader);
Vue.prototype.$dd = dd;
window.eventBus = new Vue();
Vue.component("ksj-button", ksjButton);
Vue.prototype.$echarts = echarts;
Vue.prototype.$isRead= process.env.isRead === 'true'
Vue.use(ElementUI,{
  i18n: (key, value) => i18n.t(key, value)
});

import { turnEncryptParams } from "@/utils/turnParams";
Vue.prototype.$turnEncryptParams = turnEncryptParams;


// 全局表格表头样式
let tableHeaderStyle = {
  background: "#f4f4f4",
  height: "38px",
  color: "#232323",
  fontSize: "14px",
  padding: "0",
  fontWeight: "400",
  lineHeight: "38px",
};
Vue.prototype.$thStyle = tableHeaderStyle;
Vue.config.productionTip = false;
registerNavigateGuard(router);
new Vue({
  el: "#app",
  data: {
    outputDataReceived: "",
  },
  i18n,
  router,
  store,
  render: (h) => h(App),
});
/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * @param fmt
 * @returns {*}
 * @constructor
 * @example
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 *
 */
Date.prototype.Format = function (fmt) {
  const o = {
    "M+": this.getMonth() + 1, // 月份
    "d+": this.getDate(), // 日
    "h+": this.getHours(), // 小时
    "m+": this.getMinutes(), // 分
    "s+": this.getSeconds(), // 秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  }
  return fmt;
};
