<template>
    
</template>

<script>
import orderApi from "@/api/order"

export default {
    async mounted(){
        var goodsCode = this.$route.query.goodsCode
        var accessToken = this.$route.query.accessToken        
        //请求支付宝支付接口
        var res = await orderApi.placeAliOrder({goodsCode,accessToken})
        if(res.code === 1){
            const div = document.createElement('div')
            div.innerHTML = res.data
            document.body.appendChild(div)
            document.forms[0].submit()
        }
    }
}
</script>