import request from "@/utils/request";

export default {
  //微信
  //查询微信支付前端参数
  queryWxOrderParams(params) {
    return request({
      method: "get",
      url: "/api/WebOrder/QueryWxOrderParams",
      params
    });
  },

  //支付宝
  //支付宝下单
  placeAliOrder(data){
    return request({
      method: "post",
      url: "/api/WebOrder/AliPlaceOrder",
      data
    });
  }
};