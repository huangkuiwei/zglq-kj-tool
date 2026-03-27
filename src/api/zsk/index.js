import request from "@/utils/request";
export default {
  post(url, params,baseURL) {
    return request({
      method: "post",
      url: url,
      data: params,
      apiUrl: baseURL
    });
  }
};