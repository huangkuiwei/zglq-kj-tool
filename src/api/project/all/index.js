import request from "@/utils/request";

export default {
  queryMyDocument(data) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/GetMyProjectData",
      data
    });
  },
  queryProjectPageList(data) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/GetProjectData",
      data
    });
  },
  queryProjectTypeList(params) {
    return request({
      method: "get",
      url: "/api/ProjectManagement/GetProjectClassification",
      params
    });
  },
  insert(data) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/ProjectAdd",
      data
    });
  },
  delete(data) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/ProjectDelete",
      data
    });
  },
  getAllProject() {
    return request({
      method: "get",
      url: "/api/ProjectManagement/GetAllProject",
    });
  },
  getStatistics() {
    return request({
      method: "get",
      url: "/api/ProjectManagement/GetStatistics",
    })
  },
  querySingleProjectData(iuid, corpId, isInsideApp = 1) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/ProjectUpdateData",
      params: {
        iuid,
        corpId,
        isInsideApp
      }
    });
  },
  updateProject(data) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/ProjectUpdate",
      data: data
    });
  },
  addProjectBrowseData(projectId) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/AddProjectBrowseData?projectId=" + projectId
    });
  },
  projectCollection(data) {
    return request({
      method: "post",
      url: "/api/ProjectManagement/ProjectUpdateCollection",
      data: data
    });
  },
  queryProjectSpace(data) {
    return request({
      method: "post",
      url: "/api/WebAccount/GetCorpProjectSpace",
      data
    })
  }

};
