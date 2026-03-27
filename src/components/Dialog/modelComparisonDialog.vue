<template>
  <div :class="[
    {
      'model-comparison-dialog': !isSmallSize,
      isSmallSize: isSmallSize,
      isCollapse: isCollapse,
    },
  ]">
    <iframe @load="sendFileData('imodelIframe2', rowData[1])" ref="imodelIframe2" id="imodelIframe2" :src="secondModelUrl" frameborder="0"></iframe>
    <iframe style="margin-left: 1px;" @load="sendFileData('imodelIframe1', rowData[0])" ref="imodelIframe1" id="imodelIframe1" :src="firstModelUrl" frameborder="0"></iframe>
  </div>
</template>

<script>
import { ElementAPI } from "@/utils/ApiInterface.js";
export default {
  name: "modelComparisonDialog",
  props: {
    isSmallSize: {
      type: Boolean,
      default: false,
    },
    allDeffData: {
      type: Array,
      default: () => [],
    },

    rowData: {
      type: Array,
      default: () => [],
    },

    modelComparisonDialog: {
      type: Boolean,
    },

    currentRow: {
      type: Object,
    },
    onViewOpened: {
      type: Boolean,
    },

    setIfm1Data: {
      type: Function,
    },
    setIfm2Data: {
      type: Function,
    },
  },

  data() {
    return {
      baseUrl: process.env.GisIframeOrigin,
      sec: false,
    };
  },

  watch: {
    currentRow(value) {
      if (value) {
        if (value.flag == "add") {
          this.$iframePostMes(
            this.$refs["imodelIframe1"].contentWindow,
            "LocationComponentByIds",
            {
              Component: [value.id],
            }
          );
        } else if (value.flag == "delete") {
          this.$iframePostMes(
            this.$refs["imodelIframe2"].contentWindow,
            "LocationComponentByIds",
            {
              Component: [value.id],
            }
          );
        } else {
          this.$iframePostMes(
            this.$refs["imodelIframe1"].contentWindow,
            "LocationComponentByIds",
            {
              Component: [value.id2],
            }
          );
          this.$iframePostMes(
            this.$refs["imodelIframe2"].contentWindow,
            "LocationComponentByIds",
            {
              Component: [value.id1],
            }
          );
        }
      }
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
  mounted() {
    this.$iframeListener(this.messageReceived);
  },
  beforeDestroy() {
    this.$removeIframeListener(this.messageReceived);
  },
  computed: {
    isCollapse() {
      let flag = false;
      flag = this.$store.state.app.isCollapse;
      return !flag;
    },
    firstModelUrl() {
      let path = this.rowData[0].turnPath || this.rowData[0].filePath;
      return this.baseUrl + "/?" + this.$turnEncryptParams(path, "forViewBim");
    },

    secondModelUrl() {
      let path = this.rowData[1].turnPath || this.rowData[1].filePath;
      return this.baseUrl + "/?" + this.$turnEncryptParams(path, "forViewBim");
    },
  },

  methods: {
    async messageReceived(res) {
      if (res.data.command == "onBWApiMessage") {
        // <!-- 构件加载完成 -->
        if (res.data.Data.FirstType == "System") {
          if (res.data.Data.name == "onViewOpened") {
            this.$emit("update:onViewOpened", true);
          }
        }
        // <!-- 查询构件属性回调 -->
        if (res.data.Data.FirstType == "ElementApi") {
          if (res.data.Data.name == "onGetNVs") {
            let nvs = res.data.Data.data;
            console.log(this.sec);
            if (!this.sec) {
              this.$emit("setIfm1Data", nvs);
            } else {
              this.$emit('setIfm2Data', nvs)
            }
            this.$forceUpdate();
          }
        }
      }
    },
    closeModel() {
      this.$iframePostMes(
        this.$refs.imodelIframe1.contentWindow,
        "ImodelClose",
        null
      );
      this.$iframePostMes(
        this.$refs.imodelIframe2.contentWindow,
        "ImodelClose",
        null
      );
    },
    getNvsById(type, ids, sec = undefined) {
      if (type == "add") {
        let el = new ElementAPI("imodelIframe1", this.baseUrl);
        el.getNVs(ids);
      }
      if (type == "delete") {
        let el = new ElementAPI("imodelIframe2", this.baseUrl);
        el.getNVs(ids);
      }
      if (type == "change" || type == "same") {
        if (sec!='sec') {
          let el = new ElementAPI("imodelIframe1", this.baseUrl);
          this.sec = false
          el.getNVs(ids);
        } else {
          let el2 = new ElementAPI("imodelIframe2", this.baseUrl);
          this.sec = true
          el2.getNVs(ids);
        }
      }
    },
    sendFileData(imodelIframe, row) {
      this.$iframePostMes(
        this.$refs[imodelIframe].contentWindow,
        "CurrentFile",
        row
      );

      if (this.isSmallSize) {
        this.$iframePostMes(
          this.$refs[imodelIframe].contentWindow,
          "readonly",
          null
        );
      }

      this.$iframePostMes(
        this.$refs["imodelIframe2"].contentWindow,
        "comparisonData",
        {
          version: 1,
          addCount: this.allDeffData.filter((item) => item.flag === this.$t('base.button.add')),
          changeCount: this.allDeffData.filter((item) => item.flag === "修改"),
          deleteCount: this.allDeffData.filter((item) => item.flag === "删除"),
        }
      );
      this.$iframePostMes(
        this.$refs["imodelIframe1"].contentWindow,
        "comparisonData",
        {
          version: 2,
          addCount: this.allDeffData.filter((item) => item.flag === this.$t('base.button.add')),
          changeCount: this.allDeffData.filter((item) => item.flag === "修改"),
          deleteCount: this.allDeffData.filter((item) => item.flag === "删除"),
        }
      );
    },
  },
};
</script>

<style scoped lang="scss">
.isSmallSize {
  width: calc(90vw - 48px);
  height: calc(90vh - 510px);
  position: relative;
  display: flex;

  iframe {
    width: 50%;
    height: 100%;
  }
}

.model-comparison-dialog {
  position: fixed;
  top: 51px;
  bottom: 0;
  right: 0;
  left: 282px;
  width: calc(100vw - 282px);
  height: calc(100vh - 50px);
  background: #ffffff;
  z-index: 999;
  display: flex;

  &.isCollapse {
    width: calc(100vw - 60px);
    left: 60px;
  }

  iframe {
    width: 50%;
    height: 100%;
  }
}
</style>
