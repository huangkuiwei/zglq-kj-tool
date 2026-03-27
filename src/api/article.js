import request from "@/utils/request";

export default {
  //常见问题增删改查
  FAQList(data) {
    return request({
      method: "post",
      url: "/api/Breachdepot/GetIssuetableData",
      data,
    });
  },
  FAQAddOrUpdate(data) {
    return request({
      method: "post",
      url: "/api/Breachdepot/IssuetableAddEdit",
      data,
    });
  },
  FAQDelete(data) {
    return request({
      method: "post",
      url: "/api/Breachdepot/IssuetableDEL",
      data,
    });
  },

  //公告增删改查
  noticeList(data) {
    return request({
      method: "post",
      url: "/api/Breachdepot/GetnoticetableData",
      data,
    });
  },
  noticeDetail(data) {
    return request({
      method: "post",
      url: "/api/Breachdepot/Getnoticecontenttext",
      data,
    });
  },
  noticeAddOrUpdate(data) {
    return request({
      method: "post",
      url: "/api/Breachdepot/noticetableAddEdit",
      data,
    });
  },
  noticeDelete(data) {
    return request({
      method: "post",
      url: "/api/Breachdepot/noticetableDEL",
      data,
    });
  },
  // 个人日程管理
  scheduleList(data) {
    return request({
      method: "post",
      url: "/api/Breachdepot/scheduledataData",
      data,
    });
  },
  scheduleAddOrUpdate(data) {
    return request({
      method: "post",
      url: "/api/Breachdepot/scheduledataAddEdit",
      data,
    });
  },
  scheduleDelete(data) {
    return request({
      method: "post",
      url: "/api/Breachdepot/scheduledataDEL",
      data,
    });
  },
};
