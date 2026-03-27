<template>
  <div style="display:inline-block">
    <template v-if="isPreViewMode">
      <div class="collect" v-if="permission.downloadbit">
        <el-button style="height:32px" v-if="!collectionSign" size="small" @click="collectionFile" :loading="collectLoading"><i class="el-icon-uncollect"></i>收藏</el-button>
        <el-button style="height:32px" size="small" @click="cancelCollectionFile" :loading="cancelCollectLoading" type="danger" v-else><i style="color:#FFE039" class="el-icon-collect"></i>取消收藏</el-button>
      </div>
    </template>
    <template v-else>
      <template v-if="isZsk || permission.downloadbit">
        <el-tooltip v-if="!collectionSign && !isDocumentCollectionPage" popper-class="tip-class" effect="light" content="收藏" placement="top">
          <el-link :underline="false" icon="el-icon-uncollect" @click="collectionFile"></el-link>
        </el-tooltip>
        <el-tooltip v-else effect="light" content="取消收藏" placement="top" popper-class="tip-class">
          <el-link :underline="false" icon="el-icon-collect" @click="cancelCollectionFile" style="color:#FFE039"></el-link>
        </el-tooltip>
      </template>
      <el-link v-else-if="!permission.downloadbit" :underline="false" icon="el-icon-uncollect" style="opacity: .4;cursor: not-allowed;"></el-link>
    </template>
  </div>
</template>
<script>
import commonApi from "@/api/common";
export default {
  data() {
    return {
      collectLoading: false,
      cancelCollectLoading: false,
      collectionSign: this.rows[0].collectbit
    };
  },
  watch: {
    rows() {
      this.collectionSign = this.rows[0].collectbit
    }
  },
  computed: {
    // collectionSign(){
    //   return this.rows[0].collectbit
    // },
    isDocumentCollectionPage() {
      return (this.$route.name === 'myCollection' ? true : false) || (this.$route.name === 'myCollectionKnowledgeBase' ? true : false)
    }
  },
  props: {
    //行数据,列表(list)模式下为选中的多行,预览模式下为单条数据数组数据:[row]
    rows: {
      type: Array,
      default: [],
    },
    permission:{
      type: Object,
      default: () => {}
    },
    isPreViewMode: {
      type: Boolean,
      default: false,
    },
    isZsk: {
      type: Boolean,
      default: false
    }
  },
  inject: ["reload"],
  methods: {
    async collectionFile() {
      this.collectLoading = true;
      let formData = [];
      for (let key in this.rows) {
        formData.push({
          IUID: this.rows[key].iuid,
          FileType: this.rows[key].fileType,
          Name: this.rows[key].fileName,
        });
      }
      var res = await commonApi.collect(formData, this.isZsk);
      if (res.code == 1) {
        this.$success(res.msg);
        this.collectionSign = true
      }
      this.collectLoading = false;
      if (this.isPreViewMode) {
        this.reload()
      }
    },
    async cancelCollectionFile() {
      this.cancelCollectLoading = true
      let formData = [];
      formData.push({
        IUID: (this.isDocumentCollectionPage ? this.rows[0].iuid : this.rows[0].collectIUID),
        FileType: this.rows[0].fileType,
      });
      var res = await commonApi.cancelCollect(formData, this.isZsk);
      if (res.code == 1) {
        this.$success(res.msg);
        this.collectionSign = false
      }
      this.collectLoading = false;
      this.cancelCollectLoading = false
      if (this.isPreViewMode || this.isDocumentCollectionPage) {
        this.reload()
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.collect {
  ::v-deep .el-icon-uncollect {
    width: 12px;
    height: 12px;
  }

  ::v-deep .el-icon-collect {
    width: 12px;
    height: 12px;
  }
}
</style>
