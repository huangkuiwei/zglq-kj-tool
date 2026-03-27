import request from "@/utils/request";
export default {
  //处理自定义文件上传，提供该上传接口
  uploadFile(data) {
    return request({
      method: "post",
      url: "/api/home/uploadFilePicture",
      data
    });
  },
  compressFileFolderProject(iuid, downloadType) {
    return request({
      method: "get",
      url: "/api/home/compressFileFolderProject",
      params: {
        IUID: iuid,
        downloadType: downloadType
      }
    });
  },
  compressFileFolder(iuid, workflowiuid) {
    return request({
      method: "get",
      url: "/api/home/CompressFileFolder?iuid=" + iuid + (workflowiuid ? `&workflowiuid=${workflowiuid}` : ''),
      timeout: 0
    });
  },
  getImageBase64Str(fileUrl) {
    return request({
      method: "get",
      url: "/api/home/GetUploadImgStream",
      params: {
        fileUrl
      }
    });
  },
  // //针对主动下载
  // downloadFile (fileUrl,fileName) {
  //   var baseApi=process.env.VUE_APP_BASE_API;
  //   window.location.href =baseApi+'/api/Home/Get UploadPictureFileZip?fileUrl='+fileUrl+'&fileName='+fileName
  // },
  chunkUploadFile(model, isProject) {
    return request({
      method: "post",
      url: isProject ? "/api/ProjectFile/ProjectFileListAdd" : "/api/Drawing/DrawingFileListAdd",
      data: model,
      errorMsgShow: false
    })
  },
  // 公共构件库上传
  fileUploadFile(model) {
    return request({
      method: "post",
      url: "/api/publiclibrary/publiclibraryFileListAdd",
      data: model,
      errorMsgShow: false
    })
  },
  // 系统构件库上传
  privateFileUploadFile(model) {
    return request({
      method: "post",
      url: "/api/publiclibrarynew/publiclibraryFileListAdd",
      data: model,
      errorMsgShow: false
    })
  },
  versionChunkUploadFile(model) {
    return request({
      method: "post",
      url: "/api/ProjectFile/FileVersionAdd",
      data: model,
      errorMsgShow: false
    })
  },
  zskChunkUploadFile(model) {
    return request({
      method: "post",
      url: "/api/KnowledgeBase/KnowledgeBaseListAdd",
      data: model,
      errorMsgShow: false
    })
  },
  getSuccessFileUploadData(model) {
    return request({
      method: "post",
      url: "/api/Home/GetTransmissionData",
      data: model
    })
  },
  delSuccessFileUploadDataById(iuid) {
    return request({
      method: "post",
      url: "/api/Home/DeleteTransmissionDataById?IUID=" + iuid
    })
  },
  delAllSuccessFileUploadData() {
    return request({
      method: "post",
      url: "/api/Home/DeleteAllTransmissionData"
    })
  },
  collect(data, isZsk) {
    return request({
      method: "post",
      url: isZsk ? "/api/KnowledgeBase/KnowledgeBaseCollection" : "/api/Drawing/DrawingCollection",
      data
    });
  },
  buildCollect(data) {
    return request({
      method: "post",
      url: "/api/publiclibrary/publiclibraryCollection",
      data
    });
  },
  cancelCollect(data, isZsk) {
    return request({
      method: "post",
      url: isZsk ? "/api/KnowledgeBase/KnowledgeBaseCollectionDe" : "/api/Drawing/DrawingCollectionDe",
      data
    })
  },
  queryCorpSpace() {
    return request({
      method: "get",
      url: "/api/WebAccount/GetCorpSpace"
    })
  },
  queryAllCorpSpace(data) {
    return request({
      method: "post",
      url: "/api/systemSetting/GetCorpSpace",
      data
    })
  },
  updateCorpUsingStatus(params) {
    return request({
      method: "get",
      url: "/api/systemSetting/UpdateCorpUsingStatus",
      params
    })
  }
};
