import axios from "axios";
import { Message, MessageBox } from "element-ui";
import NProgress from "nprogress";
import local from "@/utils/auth";
import router from "@/router";
import Cookies from "js-cookie";
import store from "../store";
import { closemodel, closemodelCallback } from "./CloseModel";
import { Loading } from "element-ui";
let loading;
var once = 0;
function startLoading(text) {
  //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: text ? text : "处理中...",
  });
}

function endLoading() {
  //使用Element loading-close 方法
  if (loading) {
    loading.close();
  }
}
const commonRouteName = ["blueprint", "StandardInfo"];
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 60 * 60 * 1000,
  withCredentials: true,
});
service.defaults.withCredentials = true;
let errorMsgShow = true;

let _request;
// request拦截器
// loadingParams: {isLoading: true,loadingTxt: '下载中'}
service.interceptors.request.use(
  (config) => {
    // console.log('currentName',router.history.current.name)
    // commonRouteName.indexOf(router.history.current.name) > -1? process.env.BASE_DDAPI : process.env.BASE_API
    // debugger
    if (config.apiUrl) {
      config.baseURL = config.apiUrl;
    } else {
      config.baseURL = process.env.BASE_API;
    }
    errorMsgShow = config.errorMsgShow == undefined ? true : config.errorMsgShow;
    config.headers["userInfoToken"] = config.token ? config.token : local.getToken();
    config.headers["language"] = (localStorage.getItem('language') == 'en' ? 'english' : 'chinese')
    if (config.contentType) {
      config.headers["Content-Type"] = config.contentType;
    }
    config.headers["bwForWeb"] = true;
    if (config.loadingParams && config.loadingParams.isLoading) {
      startLoading(config.loadingParams.loadingTxt);
    }
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);
// response 拦截器
service.interceptors.response.use(
  (response) => {
    endLoading();
    NProgress.done();
    const res = response.data;

    if ((res.code === "0004" || res.code === -501) &&
      (!response.config.url.includes('api/ProjectFile/AddFileBrowseData') &&
        !response.config.url.includes('api/Log/AddFileviewing') &&
        !response.config.url.includes('api/ProjectManagement/GetProjectData') &&
        !response.config.url.includes('api/Noticeboard/GetProjectFileTree')
      )) {
      if (once == 0) {
        once = 1;
        MessageBox.confirm("登录已过期，请重新登录", "确定", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning",
        }).then(async () => {
          await store.dispatch("FedLogOut").catch(() => {});
          once = 0;
          router.push({
            path: "/login",
          });
        });
      }
      return Promise.reject();
    } else if (res.code == -120) {
      MessageBox.confirm(
        "文件处于占用状态,请在关闭占用的模型文件后,重新进行上述操作",
        "提示",
        {
          confirmButtonText: "关闭",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        if (res.data) {
          let filePath = res.data
          closemodel(
            process.env.GisIframeOrigin + "/?" + filePath,
            closemodelCallback
          );
        }
      });
    } else if ([-1, -2, -20, -100].includes(res.code) && errorMsgShow) {
      if (
        !response.config.url.includes("/api/imodel/imodelFileobjadd") &&
        !response.config.url.includes(
          "/api/ProjectManagement/GetMasterfileData"
        ) &&
        !response.config.url.includes(
          "/api/Home/Editshareapply"
        )
      ) {
        Message({
          offset: 60,
          message: !res.msg ? "请求失败" : res.msg,
          type: "error",
          duration: 5 * 1000,
        });
      }
    }
    return res;
  },
  (error) => {
    endLoading();
    NProgress.done();
    console.log("err" + error); // for debug
    if (errorMsgShow) {
      Message({
        offset: 60,
        message: "服务器繁忙，请稍后重试",
        type: "error",
        duration: 5 * 1000,
      });
      return Promise.reject(error);
    } else {
      return {
        msg: "网络错误",
      };
    }
  }
);
export default service;
