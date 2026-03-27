import request from "@/utils/request";

export default {
  getDDJs_TicketParams (isPc,isInside = true,corpId = '') {
    return request({
      method: "get",
      url: isInside? "/api/DingDing/Account/DDJs_TicketParams" : "/api/DingDing/ThirdPartyAccount/DDJs_TicketParams",
      params : {
        isPc,
        corpId
      }
    });
  },
  getDDConfig(){
    return request({
      method: "get",
      url: "/api/DingDing/Account/GetDDConfig"
    });
  }
};
