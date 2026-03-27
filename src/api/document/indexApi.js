import request from "@/utils/request";
export default {
  post(url, params, baseURL, token) {
    return request({
      method: "post",
      url: url,
      data: params,
      apiUrl: baseURL,
      token: token
    });
  },
  get(url, params, baseURL) {
    return request({
      method: "get",
      url: url,
      params,
      apiUrl: baseURL,
    });
  },
  docmentResetFileOrFolderName(data) {
    return request({
      method: "post",
      url: "/api/Drawing/DrawingFileRename",
      data,
    });
  },
};
