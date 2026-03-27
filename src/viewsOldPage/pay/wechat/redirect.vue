<template>
    <div></div>
</template>

<script>
export default {
    async mounted(){
        var search = window.location.search;
        var code = getSearchString('code', search); //结果：18
        var state = getSearchString('state', search); //结果：2

        //key(需要检索的键） url（传入的需要分割的url地址，例：?id=2&age=18）
        function getSearchString(key, Url) {
            var str = Url;
            str = str.substring(1, str.length); // 获取URL中?之后的字符（去掉第一位的问号）
            // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
            var arr = str.split("&");
            var obj = new Object();

            // 将每一个数组元素以=分隔并赋给obj对象 
            for (var i = 0; i < arr.length; i++) {
                var tmp_arr = arr[i].split("=");
                obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
            }
            return obj[key];
        }

        location.href=process.env.BASE_API +  "/api/WebOrder/WxRedirect?code="+code+"&state="+state+"";
    }
}
</script>