import Vue from "vue";
import router from "../../router";
import store from "@/store";
import postApi from "@/api/document/indexApi.js";
import request from '@/utils/request'

export default function addIframeExtenssions() {
  const fn = Vue.prototype;
  //gisMap load main method
  fn.$loadGisModel = (iframeWindow, gisParams) => {
    fn.$iframePostMes(
      iframeWindow, //根据ref属性获取iframe对象
      fn.$iframeCommandType.LoadBuildModel, //命令类型【gis项目规定】   详情请见: @/utils/extenssions/iframe.extenssions.js
      gisParams //传递数据
    );
  };

  fn.$iframeListener = (callback) => {
    window.addEventListener("message", callback);
  };

  fn.$removeIframeListener = (callback) => {
    window.removeEventListener("message", callback);
  };

  fn.$iframePostMes = (iframeWin, command, Data, env) => {
    iframeWin.postMessage(
      {
        command,
        Data,
      },
      '*'
    );
  };

  fn.$iframeEditPostMes = (iframeWin, command, Data) => {
    iframeWin.postMessage(
      {
        command,
        Data,
      },
      "*"
    );
  };

  fn.$getAppName = (appType) => {
    var appName = "KSJ Space";
    if (appType == "board" || appType == "bimwindows" || appType == "presentation") appName = "BIM Windows";
    if (appType == "bimstation") appName = "BIM Station";
    if (appType == "csdmodeler") appName = "CSD Modeler";
    if (appType == "cscmodeler") appName = "CSC Modeler";
    if (appType == "cscschedule") appName = "CSC Schedule";
    if (appType == "sitelayout") appName = "CSC Sitelayout";
    if (appType == "steelboxgirder") appName = "CSD SteelBridge";
    if (appType == "bridgeMaster") appName = "Bridge Master";
    if (appType == "bimWorks") appName = "BIM-GPT";
    return appName;
  };
  // iuid: 可以为无，如有则是当前要打开文件的iuid
  fn.$openItwinApp = async (
    { appName, appType, appOrigin, appImage, appLogo, selectFile, mainFile, projectIuid },
    iuid,
    bNewPage,
    row
  ) => {

    let form = new FormData()
    form.append('IUID', iuid);
    form.append('application', appType);
    await postApi.post('/api/ProjectFile/AddFileBrowseData', form)
    let projectInfo = await store.dispatch('queryRecentlyProject');
    localStorage.setItem("projectInfo", JSON.stringify(projectInfo));

    if (!appName || appName == "") {
      appName = fn.$getAppName(appType);
    }

    if (row && row.fileName) {
      let logType = ''

      if (appType === 'bimwindows') {
        logType = 'BIMWindows_check'
      } else if (appType === 'bimgpt') {
        logType = 'GPT_check'
      } else if (appType === 'bimchat') {
        logType = 'BIM-Chat_check'
      } else if (appType === 'bimrailoneall') {
        logType = 'Rail-OneAll_check'
      }

      let formData1 = new FormData();
      formData1.append('Filename', row.fileName)
      formData1.append('projectname', projectInfo.projectName)
      formData1.append('logtype', logType)

      request.post('api/Log/AddFileviewing', formData1)
    }

    if (bNewPage) {
      // 打开一个新页面
      const routeLink = router.resolve({
        path: "/bimiframe",
        query: {
          appOrigin,
          name: appName,
          mainFile: mainFile,
          selectFile: selectFile,
          appType: appType,
          projectIuid: projectIuid,
          iuid,
          appImage,
          appLogo,
        }, // 参数传值
      });
      let win = window.open(routeLink.href);
      return win;
    } else fn.$runItwinApp({ appName, appType }, iuid); // 在原页面中打开
  };

  fn.$runItwinApp = async ({ appName, appType }, iuid) => {
    let projectInfo = await store.dispatch('queryRecentlyProject');
    localStorage.setItem("projectInfo", JSON.stringify(projectInfo));

    if (iuid)
      router.push({
        path: "/bimiframe",
        query: { name: appName, appType: appType, iuid: iuid },
      });
    else
      router.push({
        path: "/bimiframe",
        query: { name: appName, appType: appType },
      });
  };

  fn.$setCurrentIframe = (iframe) => {
    store.state.app.currApp = iframe;
    alert(store.state.app.currApp);
  };

  fn.$iframePosturl = process.env.GisIframeOrigin + "/?";
}
