import Vue from "vue";
import NProgress from "nprogress";
import { MessageBox, Message } from "element-ui";
import _, { reject, values } from "underscore";
import store from "../../store";
import local from "@/utils/auth";
import addIframeExtenssions from "./iframe.extenssions";
import dayjs from "dayjs";
import request from "@/utils/request";
import { encrypt, decrypt } from "@/utils/index";
import { turnEncryptParams } from "@/utils/turnParams";
import { closemodel, closemodelCallback } from "@/utils/CloseModel";
// import { resolve } from "path-browserify";

import axios from "axios";
import { ipcRenderer } from 'electron'
import { TaskStatus } from '@/utils/taskStorage'


addIframeExtenssions();
export default function addVueExtenssions() {
  const fn = Vue.prototype;
  fn.$fileStatus = [
    { key: "FileType1", value: "正在上传", },
    { key: "FileType0", value: "上传失败", },
    { key: "FileType2", value: "上传完成", },
    { key: "StatusType1", value: "正在排队", },
    { key: "StatusType2", value: "正在转码", },
    { key: "StatusType3", value: "转码完成", },
    { key: "StatusType4", value: "转码失败", },
    { key: "StatusType0", value: "未响应", }
  ];
  fn.$ObsPath = "&quot"; // process.env.ObsWebOrigin
  fn.$formItemWidth = "120px";
  fn.$formItemWidthForDesign = "32%";
  fn.$addSuccess = () =>
    fn.$message({
      offset: 60,
      type: "success",
      message: "添加成功",
    });
  fn.$dayjs = (value, formatter) => {
    return dayjs(value).format(formatter ? formatter : "YYYY-MM-DD");
  };
  fn.$compare = (prop) => {
    return function (a, b) {
      if (a[prop] < b[prop]) {
        // 按某种排序标准进行比较, a 小于 b
        return -1;
      }
      if (a[prop] > b[prop]) {
        return 1;
      }
      // a must be equal to b
      return 0;
    };
  };
  fn.$S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  fn.$hasPermi = (permi) => {
    return (
      localStorage.getItem('permi').includes(permi)
    )
  }
  fn.$NewGuid = () => {
    return (
      fn.$S4() +
      fn.$S4() +
      "-" +
      fn.$S4() +
      "-" +
      fn.$S4() +
      "-" +
      fn.$S4() +
      "-" +
      fn.$S4() +
      fn.$S4() +
      fn.$S4()
    );
  };
  fn.$editSuccess = () =>
    fn.$message({
      offset: 60,
      type: "success",
      message: "编辑成功",
    });
  fn.$deleteSuccess = () =>
    fn.$message({
      offset: 60,
      type: "success",
      message: "删除成功",
    });
  fn.$refreshSuccess = () =>
    fn.$message({
      offset: 160,
      type: "success",
      message: "刷新成功",
    });
  fn.$operateSuccess = () =>
    fn.$message({
      offset: 60,
      type: "success",
      message: "操作成功",
    });
  const factory = (type) => (message) =>
    fn.$message({
      offset: 30,
      type,
      message,
    });
  fn.$success = factory("success");
  fn.$warning = factory("warning");
  fn.$pauseFunction = (message) =>
    fn.$warning(message ? message : "功能暂停，服务端未支持"); //开发阶段提示语
  fn.$error = factory("error");
  fn.$confirm = (msg) => {
    return new Promise((resolve, reject) => {
      MessageBox.confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: false,
      }).then(() => {
        resolve(true);
      })
    });
  };

  fn.$progress = NProgress;
  fn.$ajaxStart = NProgress.start;
  fn.$ajaxDone = NProgress.done;
  // undersocre
  fn._ = _;
  fn.$tableOnResize = function () {
    let h = document.documentElement.clientHeight || document.body.clientHeight;
    return h - 360;
  };
  //上传相关
  fn.$uploadHeaders = () => {
    return {
      userInfoToken: local.getToken(),
    };
  };
  fn.$dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    var data = new File([u8arr], filename, {
      type: mime,
    });
    return data;
  };
  //针对el组件上传
  fn.$uploadUrl = process.env.VUE_APP_BASE_API + "/api/home/uploadFilePicture";
  //针对图片预览src指向
  //fn.$selectUploadImageApiPrefix = process.env.VUE_APP_BASE_API + '/api/Home/Get UploadPictureFileZip?fileUrl='
  fn.$clientHeight = () => {
    return store.getters.clientHeight;
  };
  fn.$uploadChange = (files, fileList) => {
    if (fileList.length > 1) {
      fileList.splice(0, 1);
    }
  };
  fn.$chunkUploaderChangeVisible = (refs, show = false) => {
    if (refs) {
      show ? refs.showUploadDialog() : refs.hideUploadDialog();
    }
  };
  fn.$showPhoneNumber = () => {
    fn.$alert("", "400-650-5128", {
      confirmButtonText: "确定",
      center: true,
      type: "success",
      showClose: false,
    });
  };
  fn.$systemPrice = [
    { person: "免费试用", days: "15天", price: 0, remarks: "", },
    { person: "1（个人版）", days: "1个月", price: 18, remarks: "无", },
    { person: "1（个人版）", days: "3个月", price: 48, remarks: "无", },
    { person: "1（个人版）", days: "1年", price: 168, remarks: "无", },
    { person: "1-5（企业版）", days: "1个月", price: 198, remarks: "限购一次", },
    { person: "1-5（企业版）", days: "3个月", price: 888, remarks: "限购一次", },
    { person: "1-5（企业版）", days: "1年/2年", price: "5000/9000", remarks: "无", },
    { person: "6-15（企业版）", days: "1年/2年", price: "10000/18000", remarks: "无", },
    { person: "16-30（企业版）", days: "1年/2年", price: "20000/36000", remarks: "无", },
    { person: "31-50（企业版）", days: "1年/2年", price: "30000/42000", remarks: "无", },
    { person: "51-100（企业版）", days: "1年/2年", price: "50000/88000", remarks: "无", },
    { person: "101-200（企业版）", days: "1年/2年", price: "80000/150000", remarks: "无", },
    { person: "201-500（企业版）", days: "1年/2年", price: "150000/268000", remarks: "无", }
  ];
  fn.$objectToFormData = (object) => {
    let formData = new FormData();
    Object.keys(object).forEach((key) => {
      formData.append(key, object[key]);
    });
    return formData;
  };
  fn.$supportWebGL = () => {
    try {
      var canvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch (e) {
      return false;
    }
  };
  fn.$isnotInDingTalk = () => {
    var terminalType = fn.$dd.env.platform;
    if (terminalType == "notInDingTalk") {
      return true;
    }
  };
  fn.$getFileSize = (fileByte) => {
    var fileSizeByte = fileByte;
    var fileSizeMsg = "";
    if (fileSizeByte) {
      if (fileSizeByte < 1024) fileSizeMsg = fileByte + "B";
      else if (fileSizeByte == 1024) fileSizeMsg = "1B";
      else if (fileSizeByte > 1024 && fileSizeByte < 1048576)
        fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
      else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
      else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824)
        fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB";
      else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824)
        fileSizeMsg = "1GB";
      else if (fileSizeByte > 1073741824)
        fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    } else if (fileSizeByte === 0) fileSizeMsg = "0GB";
    return fileSizeMsg;
  };
  fn.$GaoDeMapJsApiKey = "e66681b7682df5cdccf9827a4a44e2ec";
  fn.$GaoDeMapWebServiceKey = "a22bbc4e294c6cff2a7eea715e1282f1";
  fn.$modelFileSuffix = [".dgn", ".dwg", ".nwc", ".ifc", ".rvt", ".dxf", ".nwd", ".3dxml", ".3ds", ".3dm", ".skp", ".obj", ".fbx", ".cel", ".dgnlib", ".pid", ".shp", ".data", ".rfa"];
  fn.$modelFileSuffix3 = [".3sm", ".3mx", ".3SM", ".3MX"];
  fn.$reTransCodeVideo = [".wmv", ".avi", ".mkv", ".mov", ".rmvb"];
  fn.$ibimFileSuffix = [".bim", ".ibim", ".BIM", ".IBIM"];
  fn.$imageFileSuffix = [".png", ".jpg", ".jpeg", ".gif", ".gpj", ".PNG", ".JPG", ".JPEG", ".GIF", ".GPJ",];
  fn.$zipFileSuffix = [".zip", ".rar", ".ZIP", ".RAR"];
  fn.$videoFileSuffix = [".ogg", ".mp4", ".webm", ".OGG", ".MP4", ".WEBM"];
  fn.$otherVideoFileSuffix = [".wmv", ".avi", ".mkv", ".mov", ".rmvb", ".WMV", ".AVI", ".MKV", ".MOV", ".RMVB",];
  fn.$officeFileSuffix = [".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".DOC", ".DOCX", ".XLS", ".XLSX", ".PPT", ".PPTX",];
  fn.$pptFileSuffix = [".ppt", ".pptx", ".PPT", ".PPTX"];
  fn.$allfileType = [".pdf", ".txt", ".PDF", ".TXT"]
    .concat(fn.$modelFileSuffix)
    .concat(fn.$ibimFileSuffix)
    .concat(fn.$otherVideoFileSuffix)
    .concat(fn.$imageFileSuffix)
    .concat(fn.$zipFileSuffix)
    .concat(fn.$videoFileSuffix)
    .concat(fn.$officeFileSuffix);
  fn.$otherFileType = fn.$allfileType.filter(function (v) {
    return (
      fn.$modelFileSuffix.indexOf(v) == -1 &&
      fn.$otherVideoFileSuffix.indexOf(v) == -1
    );
  });
  fn.$pptFileSizeToLarge = (fileSize) => {
    let pptFileSizeToLarge = false;
    if (fileSize.indexOf("MB") > 0) {
      const size = fileSize.replace("MB", "");
      if (size > 100) {
        pptFileSizeToLarge = true;
      }
    } else if (fileSize.indexOf("GB") > 0 || fileSize.indexOf("TB") > 0) {
      pptFileSizeToLarge = true;
    }
    return pptFileSizeToLarge;
  };
  fn.$preViewLinkCheck = (row) => {
    let pptFileSizeToLarge = false;
    if (fn.$pptFileSuffix.indexOf(row.fileSuffix.toLowerCase()) > -1) {
      pptFileSizeToLarge = fn.$pptFileSizeToLarge(row.fileSize);
    }
    return (
      (fn.$modelFileSuffix
        .concat(fn.$ibimFileSuffix)
        .indexOf(row.fileSuffix.toLowerCase()) > -1 &&
        row.statusType == "3") ||
      (fn.$otherVideoFileSuffix
        .concat(fn.$videoFileSuffix)
        .indexOf(row.fileSuffix.toLowerCase()) > -1 &&
        row.statusType == "3") ||
      (fn.$otherFileType.indexOf(row.fileSuffix.toLowerCase()) > -1 &&
        row.actionType == "2" &&
        row.fileSuffix.toLowerCase() != "") ||
      (fn.$pptFileSuffix.indexOf(row.fileSuffix.toLowerCase()) > -1 &&
        row.lookbit &&
        (!pptFileSizeToLarge || (pptFileSizeToLarge && row.statusType == "0")))
    );
  };
  fn.$modelPreViewModeHasVShow = false;
  fn.$viewMode = (row, type, showModelTree) => {
    if (fn.$allfileType.indexOf(row.fileSuffix.toLowerCase()) > -1) {
      if (
        fn.$modelFileSuffix.indexOf(row.fileSuffix.toLowerCase()) > -1 &&
        row.statusType != "3"
      ) {
        fn.$warning("文件未转换完毕，请稍后查看");
        return;
      }
      if (fn.$modelPreViewModeHasVShow) {
        //单独控制模型预览显隐条件
        if (
          fn.$modelFileSuffix
            .concat(fn.$ibimFileSuffix)
            .indexOf(row.fileSuffix.toLowerCase()) > -1 &&
          !store.state.app.modelPreViewContainerVisible
        ) {
          store.state.app.modelPreViewContainerVisible = true; //v-if  第一次加载
          store.state.app.modelPreViewContainerDisplayVisible = true;
          let path =
            fn.$ibimFileSuffix.indexOf(row.fileSuffix.toLowerCase()) > -1
              ? row.filePath
              : row.turnPath;

          if (row.viewname) {
            path += `&view=${row.viewname.replace('.json', '')}`
          }

          if (showModelTree === 'true') {
            path += `&showModelTree=1`
          }

          store.state.app.modelPreViewInitUrl =
            process.env.VUE_APP_GisIframeOrigin + "/?" + turnEncryptParams(path);
        }
        if (
          fn.$modelFileSuffix
            .concat(fn.$ibimFileSuffix)
            .indexOf(row.fileSuffix.toLowerCase()) > -1 &&
          store.state.app.modelPreViewContainerVisible
        ) {
          store.state.app.modelPreViewContainerDisplayVisible = true; //v-show 之后的加载
        }
        if (
          fn.$modelFileSuffix
            .concat(fn.$ibimFileSuffix)
            .indexOf(row.fileSuffix.toLowerCase()) === -1 &&
          store.state.app.modelPreViewContainerVisible
        ) {
          store.state.app.modelPreViewContainerDisplayVisible = false; //v-show 之后的加载
        }
      }
      store.dispatch("UpdatePreViewContainerVisible", row);
      if (!fn.$modelPreViewModeHasVShow) {
        let path =
          fn.$ibimFileSuffix.indexOf(row.fileSuffix.toLowerCase()) > -1
            ? row.filePath
            : row.turnPath;
        // &type=forViewBim&editable=0

        if (row.viewname) {
          path += `&view=${row.viewname.replace('.json', '')}`
        }

        if (showModelTree === 'true') {
          path += `&showModelTree=1`
        }

        store.state.app.preViewContainerVisible = true;
        if (
          fn.$modelFileSuffix
            .concat(fn.$ibimFileSuffix)
            .indexOf(row.fileSuffix.toLowerCase()) > -1
        ) {
          // fn.$loading({
          //   target: '.el-container',
          //   lock: true,
          //   text: '正在加载模型，请稍等...'
          // })

          if (process.env.VUE_APP_BASE_API === "http://47.94.131.208:8081" || process.env.VUE_APP_BASE_API === "http://111.59.7.106:5007") {
            request("/api/TaskManagement/imodelport").then((res) => {
              if (res.data) {
                store.state.app.modelPreViewInitUrl =
                  process.env.VUE_APP_GisIframeOrigin + "/?" + turnEncryptParams(path);
              } else {
                request("/api/TaskManagement/openimodel").then((res) => {
                  if (res.data === 1) {
                    store.state.app.modelPreViewInitUrl =
                      process.env.VUE_APP_GisIframeOrigin +
                      "/?" +
                      turnEncryptParams(path);
                  }
                });
              }
            });
          } else {
            if (type == "h5") {
              store.state.app.modelPreViewInitUrl =
                process.env.VUE_APP_ViewOrigin +
                "/?" +
                turnEncryptParams(path);
            } else {
              store.state.app.modelPreViewInitUrl =
                process.env.VUE_APP_GisIframeOrigin + "/?" + turnEncryptParams(path);
            }
          }
        }
      }
    }
  };
  fn.$getFileUrl = (row) => {
    let path =
      fn.$ibimFileSuffix.indexOf(row.fileSuffix.toLowerCase()) > -1
        ? row.filePath
        : row.turnPath;
    var url = process.env.VUE_APP_GisIframeOrigin + "/?" + turnEncryptParams(path);
    return url;
  };
  fn.$downloadFileProject = async (fileName, iuid, getFileFolderName, data) => {
    // console.log(fileName, iuid, getFileFolderName);
    // 打包下载不需要判断文件状态
    let downloadUrl = process.env.VUE_APP_BASE_API + "/api/home/GetUploadPictureFileZip" + "?IUID=" + iuid + "&fileType=zip" + "&getFileFolderName=" + getFileFolderName;
    store.dispatch("ChangeUploderVisible", "show");
    store.commit("CHANGE_UPLOADERTAB_INDEX", 2);
    let downLoadData = {
      iuid: data.newIUID,
      fileName: getFileFolderName + data.newIUID,
      fileSize: data.fileSize,
      fullPath: getFileFolderName,
      downloadTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };
    store.commit("UPDATEDOWNLOADFILEDATA_CLONE", downLoadData);


    let aLink = document.createElement("a");
    aLink.download = fileName;
    aLink.style.display = "none";
    aLink.href = downloadUrl;
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink);
  };
  // compressionFileInfo = {compressionFileId,compressionFileSize}
  fn.$downloadFile = async (row, _self, isCompressionFile = false, compressionFileInfo = null, downloadByUrl = false, isBim = false, isshenpi = false) => {
    if(isBim) {
      request.get(`api/Home/GetFilebimState?iuid=${row.iuid}` + (row.workflowiuid ? `&workflowiuid=${row.workflowiuid}` : '')).then(async (res) => {
        if (res.code === 1) {
          let fileName
          let path

          if (row.turnPath) {
            let index = row.turnPath.indexOf('Files')
            path = row.turnPath.slice(index)
            fileName = path.split('/')[path.split('/').length - 1];
          } else {
            path = row.filePath
            fileName = row.fileName.replace(/\\\\/g, '/');
          }

          if (!fileName.endsWith('.bim') && !fileName.endsWith('.BIM')) {
            fileName += fileName + '.bim'
          }

          // 文件传输面板
          store.dispatch("ChangeUploderVisible", "show");
          store.commit("CHANGE_UPLOADERTAB_INDEX", 2);
          let downLoadData = {
            fileName: row.fileName,
            fileSize: row.fileSize,
            fullPath: row.fullPath,
            downloadTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            progress: 0,
            fileSuffix: '.' + row.fileName.split('.')[row.fileName.split('.').length - 1],
          };
          console.log(row);
          store.commit("UPDATEDOWNLOADFILEDATA_CLONE", downLoadData);

          console.log(111)
          const taskId = Date.now().toString()
          const url = `${process.env.VUE_APP_BASE_API}/${path}`

          const task = {
            id: taskId,
            url: url,
            filename: fileName,
            totalSize: 0,
            downloaded: 0,
            progress: 0,
            status: TaskStatus.DOWNLOADING,
            speed: 0,
            error: undefined,
            userinfotoken: local.getToken(),
          }

          await ipcRenderer.invoke('start-download', url, fileName, taskId, task.userinfotoken)
          store.commit('ADD_DOWNLOAD', task)
        }
      })

      return
    }

    if (!isCompressionFile) {
      let res = await request.get(`api/Home/GetossFile?IUID=${row.iuid}`)

      if (res.code === 1) {
        if (res.data) {
          console.log(222)
          const taskId = Date.now().toString()
          const url = res.data

          const task = {
            id: taskId,
            url: url,
            filePath: undefined,
            filename: row.filename,
            totalSize: 0,
            downloaded: 0,
            progress: 0,
            status: TaskStatus.DOWNLOADING,
            speed: 0,
            error: undefined,
            userinfotoken: local.getToken(),
          }

          await ipcRenderer.invoke('start-download', url, row.filename, taskId, task.userinfotoken)
          store.commit('ADD_DOWNLOAD', task)
        } else {
          Message.info(res.msg)
        }

        return
      }
    }

    let downloadUrl = (type) => {
      let url = '';
      // 文件路径编码
      const VUE_APP_BASE_API = "/api/home/GetUploadPictureFile";
      const STATE_API = "/api/home/GetFileState";
      let api = type == 'state' ? STATE_API : VUE_APP_BASE_API
      if (isCompressionFile) {
        url = api + "?IUID=" + compressionFileInfo.iuid + (type != 'state' ? "&fileType=zip" + "&getFileFolderName=" + compressionFileInfo.getFileFolderName : '') + (row.workflowiuid ? `&workflowiuid=${row.workflowiuid}` : '');
      } else if (downloadByUrl) {
        url = api + "?fileUrl=" + encodeURIComponent(encrypt(row.turnPath || row.filePath));
      } else {
        url = api + "?IUID=" + row.iuid + (type != 'state' ? "&fileType=" + row.fileType + "&getFileFolderName=" + row.getFileFolderName : '') + (row.workflowiuid ? `&workflowiuid=${row.workflowiuid}` : '');
      }
      return url
    };

    async function handleDownload(fileName) {
      // 文件传输面板
      store.dispatch("ChangeUploderVisible", "show");
      store.commit("CHANGE_UPLOADERTAB_INDEX", 2);
      let downLoadData = {
        fileName: row.fileName,
        fileSize: row.fileSize,
        fullPath: row.fullPath,
        downloadTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        progress: 0,
        fileSuffix: '.zip',
      };
      console.log(row);
      store.commit("UPDATEDOWNLOADFILEDATA_CLONE", downLoadData);

      console.log(333)
      const taskId = Date.now().toString()
      const url = process.env.VUE_APP_BASE_API + downloadUrl()

      const task = {
        id: taskId,
        url: url,
        filename: fileName + '.zip',
        totalSize: 0,
        downloaded: 0,
        progress: 0,
        status: TaskStatus.DOWNLOADING,
        speed: 0,
        error: undefined,
        userinfotoken: local.getToken(),
      }

      await ipcRenderer.invoke('start-download', url, fileName + '.zip', taskId, task.userinfotoken, isshenpi, {
        workflowIUID: row.workflowiuid,
        downloadType: row.key,
      })
      store.commit('ADD_DOWNLOAD', task)
    }
    if (isCompressionFile) {
      // 打包下载不需要判断文件状态
      handleDownload(row.fileName)
    } else {
      axios.get(process.env.VUE_APP_BASE_API + downloadUrl('state')).then((r) => {
        let res = r.data
        if (res.code == -100) {
          fn.$error('资源文件丢失，下载失败！')
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
                process.env.VUE_APP_GisIframeOrigin + "/?" + filePath,
                closemodelCallback
              );
            }
          });
        } else {
          handleDownload(row.fileName)
        }
      }).then(e => {
        console.log(e);
      })
    }


  };
  fn.$folderFullPath = (basePath, breadcrumb) => {
    let folderFullPath = basePath;
    breadcrumb.forEach((element) => {
      folderFullPath = folderFullPath + "/" + element.fileName;
    });
    return folderFullPath;
  };
  fn.$tableRowsCheck = (rows, message) => {
    if (!rows || rows.length == 0) {
      fn.$warning(message ? message : "请选中一行数据");
      return false;
    } else {
      return true;
    }
  };
  fn.$illegalCharacter_FileName = ["\\", "/", ":", "*", "?", '"', "<", ">", "|"];
  fn.$fileNameCheck = (name) => {
    // debugger
    let isIllegal = false;
    fn.$illegalCharacter_FileName.forEach((element) => {
      if (name.indexOf(element) > -1) {
        fn.$error('文件名不能包含下列任何字符 \\ / : * ? " < > |');
        isIllegal = true;
      }
    });
    return !isIllegal;
  };
  fn.$shareMultipleVisible = (rows) => {
    let visible = true;
    if (rows.length > 0) {
      rows.forEach((row) => {
        if (
          (fn.$modelFileSuffix.indexOf(row.fileSuffix.toLowerCase()) > -1 &&
            row.statusType == "3") ||
          (fn.$otherVideoFileSuffix.indexOf(row.fileSuffix.toLowerCase()) >
            -1 &&
            row.statusType == "3") ||
          fn.$otherFileType.indexOf(row.fileSuffix.toLowerCase()) > -1 ||
          row.fileSuffix.toLowerCase() == "" ||
          fn.$allfileType.indexOf(row.fileSuffix.toLowerCase()) == -1
        ) {
        } else {
          visible = false;
        }
      });
    } else {
      visible = false;
    }
    return visible;
  };
}
