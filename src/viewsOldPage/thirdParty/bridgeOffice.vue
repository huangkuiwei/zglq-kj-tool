<template>
  <div :style="{height:clientHeight + 'px'}">
    <iframe
      v-if="modelPreViewInitUrl"
      ref="imodelIframe"
      :src="modelPreViewInitUrl"
      :height="clientHeight"
      style="background-color: white;border:none;height:100%;width:100%"
      @load="sendFileData"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import postApi from "@/api/document/indexApi.js";

export default {
    data(){
        return {
            modelPreViewInitUrl: null
        }
    },
    computed:{
        ...mapGetters(["clientHeight"])
    },
    async mounted(){
        var masterFileRes = await postApi.post("/api/ProjectManagement/GetMasterfileData?IUID=5cc625c1-c0c6-4b72-9faa-0434895e6804","");
            if(masterFileRes.code === 1){
                this.currentFile = masterFileRes.data
                this.modelPreViewInitUrl =  process.env.VUE_APP_GisIframeOrigin + "/?" + masterFileRes.data.turnPath +"?大桥局"
            }
    },
    methods:{
        sendFileData(){
            this.$iframePostMes(this.$refs.imodelIframe.contentWindow,'CurrentFile',this.currentFile)
        }
    }
}
</script>