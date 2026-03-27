import NProgress from "nprogress";
import "nprogress/nprogress.css";
import local from "@/utils/auth";
import loadPermittedRouterMap from "@/router/permissions";
import store from "./store";
import getPageTitle from "@/utils/get-page-title";
import { whiteList } from '@/utils/whiteList'
import postApi from "@/api/document/indexApi.js";
import { MessageBox } from "element-ui";
import { decrypt } from '@/utils'
import request from '@/utils/request'

NProgress.configure({ showSpinner: false });

export default function registerNavigateGuard(router) {
  let showmsg = true;
  router.beforeEach(async (to, from, next) => {
    NProgress.start();

    // document.title = getPageTitle(to.meta.title);
    if (local.getToken()) {
      let formData = new FormData();
      formData.append('urlname', to.path.slice(1))

      let res1 = await request.post('api/Users/userauthority', formData)

      if (res1.code !== 1) {
        next({ path: '/' })
        return
      }

      if (whiteList.indexOf(to.path) == -1 && to.path != "/payCenter") {


        var res = await postApi.get("/api/WebOrder/ServiceTimeVerify");
        if (res.code == 1) {
          res.data = JSON.parse(decrypt(res.data));

          if (res.data.hasCorp == false && showmsg) {
            showmsg = false;
            MessageBox.alert("暂未加入企业，请创建或加入已有的企业", "提示", {
              showCancelButton: false,
              showClose: false,
            }).then(() => {
              showmsg = true;
              local.setUserCenterMenuActived(2);
              next({
                path: "/userCenter",
              });
            });
          }
          if (res.data.verifyFileNotExists) {
            next({
              path: "/systemInitError",
              query: { errorTxt: "系统验证文件异常！！！" },
            });
            return false;
          } else if (res.data.verifyFileError) {
            next({
              path: "/systemInitError",
              query: { errorTxt: "系统验证失败！！！" },
            });
            return false;
          } else if (res.data.isExpire) {
            //if(res.data.privation){
            next({
              path: "/systemInitError",
              query: {
                errorTxt: "试用期已过，请加入/创建企业或联系我们!",
                isExpire: true,
              },
            });
            return false;
          }
        }


      }
      if (to.path === "/login") {
        next({ path: "/" });
        NProgress.done();
      } else if (localStorage.getItem('permi') == undefined && showmsg) {
        showmsg = false;
        MessageBox.alert("用户权限验证失败，请重新登录", "提示", {
          showCancelButton: false,
          showClose: false,
        }).then(async () => {
          await store.dispatch("LogOut").catch(() => {});
          next({ path: "/login" });
          NProgress.done();
        });
      } else {
        await store.dispatch("GetInfo");
        // await store.dispatch('SetProjectInfo')
        if (!store.getters.permissionsLoaded) {
          await loadPermittedRouterMap();
          await store.dispatch("setPermissionsLoaded");
          next({ ...to, replace: true });
        } else {
          next();
        }
      }
    } else {
      await store.dispatch("setPermissionsUnLoaded");
      if (
        whiteList.indexOf(to.path) !== -1 ||
        whiteList.indexOf(to.name) !== -1
      ) {
        next();
      } else {
        next(`/login`); // 否则全部重定向到登录页
        NProgress.done();
      }
    }
  });

  router.afterEach(() => {
    NProgress.done(); // 结束Progress
  });
}
