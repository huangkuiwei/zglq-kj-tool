import request from "@/utils/request";
export default {
  // 查找用户
  getUserData(data) {
    return request({
      method: "post",
      url: "/api/dialogue/GetUserdata",
      data,
    });
  },
  // 创建对话
  setupDialogue(data) {
    return request({
      method: "post",
      url: "/api/dialogue/setupdialogue",
      data,
    });
  },
  //查询会话记录
  getDialogue(data) {
    return request({
      method: "post",
      url: "/api/dialogue/Getdialogue",
      data,
    });
  },
  // 已读聊天记录
  getFetchDialogue(data) {
    return request({
      method: "post",
      url: "/api/dialogue/Getfetchdialogue",
      data,
    });
  },
  // 删除聊天记录
  getDialogueDelete(data) {
    return request({
      method: "post",
      url: "/api/dialogue/Getdialoguedelete",
      data,
    });
  },
  // 获取聊天记录
  getDialogueData(data) {
    return request({
      method: "post",
      url: "/api/dialogue/GetdialogueData",
      data,
    });
  },
};
