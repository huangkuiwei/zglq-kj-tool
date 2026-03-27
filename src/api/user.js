import request from "@/utils/request";
export default {
  adminLogin(data) {
    return request({
      method: "post",
      url: "/api/Home/phoneLogin",
      data
    });
  },
  TkyLogin() {
    return request({
      method: "post",
      url: "/api/TkyAreas/Login"
    });
  },
  updatePwd(userId, password, oldPassword) {
    return request({
      method: "post",
      url: "/admin/user/pwd",
      data: {
        userId,
        password,
        oldPassword
      }
    });
  },
  getPermissions() {
    return request({
      method: "get",
      url: "/api/Menu/GetLoginUserMenuList"
    });
  },
  getAuthorizerId() {
    return request({
      method: "get",
      url: "/api/home/GetLoginUserAuthorizerInfo"
    });
  },
  queryPageUserLog(params) {
    return request({
      method: "get",
      url: "/api/WebBusiness/LogQuery/GetPagingList",
      params
    });
  }
};
