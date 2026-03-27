<!--  -->
<template>
    <div></div>
</template>

<script>
import postApi from "@/api/document/indexApi.js";
import local from "@/utils/auth";
import { encrypt, decrypt } from '@/utils'

export default {
    name: "",
    data() {
        return {
            loginForm: {
                phone: '',
                password: '',
            },
            loginLoading: false,
            rememberPwd: true,
        };
    },
    created() {
        var url = location.href
        if (url.indexOf('?') > -1) {
            var result = {};
            var str = url.split('?')[1];
            var temp = str.split('&');
            for (var i = 0; i < temp.length; i++) {
                var temp2 = temp[i].split('=');
                console.log(temp2);
                result[temp2[0]] = temp2[1];
            }
        }
        if (result && result.type == 'oa') {
            this.loginForm.phone = result.loginid;
            this.loginForm.password = decodeURIComponent(result.password);
            this.handleLogin('oa')
        }
    },
    methods: {
        // 开始登录
        async handleLogin() {
            this.loginLoading = true;
            var formData = new FormData();
            formData.append("minutes", this.rememberPwd ? 10080 : 1);
            formData.append("phone", this.loginForm.phone);
            formData.append("password", this.loginForm.password);
            const res = await this.$store.dispatch("AdminLogin", formData);
            if (res.code === 1) {
                this.$store.commit('SET_PERSONAL', !res.data.corpIdbit)
                if (res.data.tryOut) {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: "提示",
                        message: h("p", null, [h("span", null, "即将开始试用，试用期限为"), h("i", { style: "color: red" }, "1个月"), h("span", null, "，确认要开始试用吗？")]),
                        showCancelButton: true,
                        closeOnClickModal: false,
                        closeOnPressEscape: false,
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        beforeClose: async (action, instance, done) => {
                            if (action === "confirm") {
                                instance.confirmButtonLoading = true;
                                instance.confirmButtonText = "执行中...";
                                var res = await postApi.post("/api/WebOrder/TryOut");
                                if (res.code === 1) {
                                    done();
                                    instance.confirmButtonLoading = false;
                                }
                            } else {
                                this.$store.dispatch("LogOut").catch(() => {});
                                done();
                            }
                        },
                    }).then((action) => {
                        const token = local.getToken();
                        this.signalr.invoke("loginConnnectAsync", token);
                        this.$success(res.msg);
                        this.$router.push("/");
                    });
                } else {
                    const token = local.getToken();
                    this.signalr.invoke("loginConnnectAsync", token);
                    var companyApplyRes = await postApi.get("/api/WebCompanyApply/QueryCompanyApply");
                    if (companyApplyRes.code == 1) {
                        this.$store.state.user.hasNotDealApply = companyApplyRes.data
                    }
                    this.$success(res.msg);
                    // this.$router.push("/");
                }
            }
            this.loginLoading = false;
        },
    }
}

</script>
<style></style>
