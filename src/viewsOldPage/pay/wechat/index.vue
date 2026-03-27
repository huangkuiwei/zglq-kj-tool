<template>
  <div></div>
</template>

<script>
import orderApi from "@/api/order"

export default {
  data(){
      return {
          wxJsApiParam
      }
  },
  async mounted(){
      document.title="聚合支付";
      var openId = this.$route.query.openId
      var productId = this.$route.query.productId
      if(openId && productId){
          var res = await orderApi.queryWxOrderParams({openId,productId})
            if(res.code == 1){
                this.wxJsApiParam = eval('(' + res.data + ')');
                this.callPay();
            }
            else if(res.code == -88){
                alert(res.msg)
            }
      }
      else{
          alert('error params')
      }    
  },
  methods: {
    callPay() {
      if (typeof WeixinJSBridge == "undefined") {
        alert('WeixinJsBridge is undefi')
        if (document.addEventListener) {
          document.addEventListener("WeixinJSBridgeReady", jsApiCall, false);
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", jsApiCall);
          document.attachEvent("onWeixinJSBridgeReady", jsApiCall);
        }
      } else {
        this.jsApiCall();
      }
    },
    jsApiCall() {
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        this.wxJsApiParam,
        (res)=> {
          if (res.err_msg == "get_brand_wcpay_request:cancel") {      
            window.close()     
            return false;
          } else if (res.err_msg == "get_brand_wcpay_request:ok") {
            //支付成功，前端可以做一些相应处理
            window.close()     
          }
        }
      );
    },
  },
};
</script>