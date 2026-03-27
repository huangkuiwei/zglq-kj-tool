<template>
  <div
    v-loading="loading"
    class="model-iframe-content"
    element-loading-text="正在加载模型文件..."
  >
    <iframe
      ref="imodelIframe1"
      :src="modelLoadUrl"
      frameborder="0"
      @load="sendFileData('imodelIframe1', rowData)"
    />
    <div class="menu-btn">
      <el-button
        v-show="showMenuBtn"
        type="primary"
        @click="clearIsolateSelectedElement"
      >
        取消突显
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModelFileCheckIframe",

  props: {
    isSmallSize: {
      type: Boolean,
      default: false,
    },
    rowData: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      baseUrl: process.env.VUE_APP_GisIframeOrigin,
      loading: true,
      showMenuBtn: false,
    };
  },

  computed: {
    isCollapse() {
      let flag = false;
      flag = this.$store.state.app.isCollapse;
      return !flag;
    },
    modelLoadUrl() {
      let path = this.rowData.turnPath?this.rowData.turnPath:this.rowData.filePath;
      return (
        this.baseUrl +
        "/?" + this.$turnEncryptParams(path, 'forViewBim')
      );
    },
  },

  created() {
    this.$iframeListener((res) => {
      if (res.data.command === "ImodelClose") {
        this.$emit("update:modelComparisonDialog", false);
      }

      if (res.data.command === "beforeImodelClose") {
        this.$iframePostMes(
          this.$refs.imodelIframe1.contentWindow,
          "ImodelClose",
          null
        );
      }
    });
  },

  methods: {
    closeModel() {
      this.$iframePostMes(
        this.$refs.imodelIframe1.contentWindow,
        "ImodelClose",
        null
      );
    },
    // 文件检查
    checkModelFile(formSearchData) {
      this.$iframePostMes(
        this.$refs.imodelIframe1.contentWindow,
        "fileModelCheck",
        {
          ...this.rowData,
          ...formSearchData,
        }
      );
    },
    // 获取上次检查数据
    getLastCheckData(formSearchData) {
      this.$iframePostMes(
        this.$refs.imodelIframe1.contentWindow,
        "lastfileModelCheckResult",
        {
          ...this.rowData,
          ...formSearchData,
        }
      );
    },
    // 删除上次检查数据
    deleteLastCheckData(formSearchData) {
      this.$iframePostMes(
        this.$refs.imodelIframe1.contentWindow,
        "deletefileModelCheckResult",
        {
          ...this.rowData,
          ...formSearchData,
        }
      );
    },
    // 定位构件
    locateModelByIds(id) {
      this.$iframePostMes(
        this.$refs.imodelIframe1.contentWindow,
        "LocationElementByIds",
        [id]
      );
    },
    // 突显
    isolateSelectedElement(id) {
      this.$iframePostMes(
        this.$refs.imodelIframe1.contentWindow,
        "locationIsolateElementByIds",
        [id]
      );
      this.showMenuBtn = true;
    },
    // 取消突显
    clearIsolateSelectedElement() {
      this.$iframePostMes(
        this.$refs.imodelIframe1.contentWindow,
        "clearLocationIsolateElementByIds",
        null
      );
      this.showMenuBtn = false;
    },
    sendFileData(imodelIframe, row) {
      this.loading = false;
      this.$iframePostMes(
        this.$refs[imodelIframe].contentWindow,
        "CurrentFile",
        row
      );
      this.$iframePostMes(
        this.$refs[imodelIframe].contentWindow,
        "readonly",
        true
      );
      this.$iframePostMes(
        this.$refs[imodelIframe].contentWindow,
        "hideBackBtn",
        null
      );
      this.$emit('modelLoaded');
    },
  },
};
</script>

<style scoped lang="scss">
.model-iframe-content {
  width: 100%;
  height: 100%;
  position: relative;

  iframe {
    width: 100%;
    height: 100%;
  }

  .menu-btn {
    position: absolute;
    top: 12px;
    left: 60px;
  }
}
</style>
