import request from "@/utils/request";
export default {
  FileCheckStatusSave(data) {
    return request({
      method: "post",
      url: "/api/ProjectFile/FileCheckStatusSave",
      data
    });
  },
  ProjectFileDetailsDelete(data) {
    return request({
      method: "post",
      url: "/api/ProjectFile/ProjectFileDetailsDelete",
      data
    });
  },
  ProjectBidSectionListSave(data) {
    return request({
      method: "post",
      url: "/api/ProjectFile/ProjectBidSectionListSave",
      data
    });
  },
  GetProjectBidSectionData(data) {
    return request({
      method: "post",
      url: "/api/ProjectFile/GetProjectBidSectionData",
      data
    });
  },
  queryFileListByProjectId(params) {
    return request({
      method: "get",
      url: "/api/ProjectManagement/GetProjectFoldeR",
      params
    });
  },
  queryFolderTree(data) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/GetGetFileDetailsTreeData",
      data
    });
  },
  queryFileListByFileId(data) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/GetGetFileDetailsData",
      data
    });
  },
  addFileFolder(data) {
    return request({
      method: "post",
      url: "/api/ProjectFile/ProjectFilefolderAdd",
      data
    });
  },
  addFolder(data) {
    return request({
      method: "post",
      url: "/api/ProjectFile/ProjectFileAdd",
      data
    });
  },
  deleteFile(data) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/ProjectFileDetailsDelete",
      data
    });
  },
  leftDeleteFile(data) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/ProjectFileDelete",
      data
    });
  },
  leftRenameFile(data) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/ProjectFileNameRename",
      data
    });
  },
  leftAddFile(data) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/ProjectFileAdd",
      data
    });
  },
  leftSortFile(data) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/ProjectFileSort",
      data
    });
  },
  resetFileOrFolderName(data) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/ProjectFileRename",
      data
    });
  },
  reTranscoding(data) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/ReTranscoding",
      data
    });
  },
  querySelectConversion(data) {
    return request({
      method: "post",
      url: "/api/Home/GetConversionToolData",
      data
    });
  },
  moveCopyProTree(data) {
    return request({
      method: "post",
      url: "/api/Home/Setupmove",
      data
    });
  },
  queryFileVersion(data) {
    return request({
      method: "post",
      url: "/api/ProjectFile/GetFileVersionData",
      data
    });
  },
  addNewVersion(data) {
    return request({
      method: "post",
      url: "/api/ProjectFile/FileVersionAdd",
      data
    });
  },
  deleteEffectFile(data) {
    return request({
      method: "post",
      url: "/api/ProjectFile/FileVersionDeleteData",
      data
    });
  },
  setEffect(data) {
    return request({
      method: "post",
      url: "/api/ProjectFile/SetFileVersionEffective",
      data
    });
  },
  effectOK(data) {
    return request({
      method: "post",
      url: "/api/ProjectFile/FileVersionConfirm",
      data
    });
  },
  permissionSubmit(data) {
    return request({
      method: "post",
      url: "/api/FileAuthorize/FileAuthorizeOperate",
      data
    });
  },
  leftFilePermissionSubmit(data) {
    return request({
      method: "post",
      url: "/api/FileAuthorize/LeftFileAuthorizeOperate",
      data
    });
  },
  zskPermissionSubmit(data) {
    return request({
      method: "post",
      url: "/api/KnowledgeBase/KnowledgeBaseAuthorizeOperate",
      data
    });
  },
//   自动通过审核
  Processpassing(data) {
    // return request({
    //   method: "post",
    //   url: "/api/projectworkflow/Processpassing",
    //   data
    // });
  }
};
