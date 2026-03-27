<!--  -->
<template>
    <div class="bs">
        <iframe v-if="showModel" :src="url" @load="sendFileData" ref="imodelIframe1" frameborder="0" class="iframe"></iframe>
    </div>
</template>

<script>
export default {
    name: "",
    data() {
        return {
            showModel: false,
            url: ''
        };
    },
    mounted() {
        this.url = decodeURIComponent(this.$route.query.filePath)
        setTimeout(() => {
            this.showModel = true
        }, 200);
    },
    methods: {
        iframePostMes(iframeWin, command, Data) {
            iframeWin.postMessage(
                {
                    command,
                    Data,
                },
                '*'
            );
        },
        sendFileData() {
            this.iframePostMes(this.$refs['imodelIframe1'].contentWindow, 'onlyShowModel', { backgroundColor: '#040d2e' })
        }
    }
}

</script>
<style scoped>
.bs .iframe {
    width: 100vw;
    height: 100vh;
}
</style>