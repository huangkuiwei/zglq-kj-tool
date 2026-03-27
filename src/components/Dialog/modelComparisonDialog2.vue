<template>
  <div :class="[{ 'model-comparison-dialog': !isSmallSize, isSmallSize: isSmallSize, isCollapse: isCollapse }]">
    <iframe @load="sendFileData('imodelIframe2', rowData[1])" ref="imodelIframe2" :src="secondModelUrl" frameborder="0"></iframe>
    <iframe @load="sendFileData('imodelIframe1', rowData[0])" ref="imodelIframe1" :src="firstModelUrl" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  name: "modelComparisonDialog2",

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
      type: String,
    },
  },

  data() {
    return {
      baseUrl: process.env.GisIframeOrigin,
    };
  },

  watch: {
    currentRow(value) {
      if (value) {
        if (value.info2 && value.info2.id) {
          this.$iframePostMes(
            this.$refs.imodelIframe1.contentWindow,
            "LocationComponentByIds",
            {
              Component: [value.info2.id],
            }
          );
        }

        if (value.info1 && value.info1.id) {
          this.$iframePostMes(
            this.$refs.imodelIframe2.contentWindow,
            "LocationComponentByIds",
            {
              Component: [value.info1.id],
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

  computed: {
    isCollapse() {
      let flag = false;
      flag = this.$store.state.app.isCollapse;
      return !flag;
    },
    firstModelUrl() {
      let path = this.rowData[0].turnPath || this.rowData[0].filePath
      return (
        this.baseUrl +
        "/?" + this.$turnEncryptParams(path, 'forViewBim')
      );
    },

    secondModelUrl() {
      let path = this.rowData[1].turnPath || this.rowData[1].filePath
      return (
        this.baseUrl +
        "/?" + this.$turnEncryptParams(path, 'forViewBim')
      );
    },
  },

  methods: {
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

      if (imodelIframe === "imodelIframe2") {
        this.$iframePostMes(
          this.$refs[imodelIframe].contentWindow,
          "comparisonData",
          {
            version: 1,
            addCount: this.allDeffData.filter(item => item.flag === this.$t('base.button.add')),
            changeCount: this.allDeffData.filter(item => item.flag === '修改'),
            deleteCount: this.allDeffData.filter(item => item.flag === '删除'),
          }
        );
      }

      if (imodelIframe === "imodelIframe1") {
        this.$iframePostMes(
          this.$refs[imodelIframe].contentWindow,
          "comparisonData",
          {
            version: 2,
            addCount: this.allDeffData.filter(item => item.flag === this.$t('base.button.add')),
            changeCount: this.allDeffData.filter(item => item.flag === '修改'),
            deleteCount: this.allDeffData.filter(item => item.flag === '删除'),
          }
        );
      }
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
  height: calc(100vh - 51px);
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
