<template>
  <el-dialog
    v-dialogDrag
    title="部分文件删除失败提醒"
    :visible.sync="dialogVisible"
    width="800px"
  >
    <div style="margin-top: 15px;text-align:left">
      共有<span style="color:#33CC99;font-size:16px">{{successcount}}</span>个文件删除成功，<span style="color:#F56C6C;font-size:16px">{{failurecount}}</span>个文件删除失败
    </div>
    <div style="margin-top: 20px">
      <el-table
        class="t-table"
        ref="multipleTable"
        :data="deleteFilelist"
        stripe
        :header-cell-style="$thStyle"
        style="width: 100%; font-size: 13px; margin-top: 30px"
      >
        <el-table-column prop="AAA" width="50px"> </el-table-column>
        <el-table-column prop="fileName" :label="$t('base.button.fileName')"> </el-table-column>
        <el-table-column prop="fileSize" :label="$t('base.button.fileSize')"></el-table-column>
        <el-table-column prop="filePath" label="文件路径"></el-table-column>
        <el-table-column prop="errMsg" label="失败原因"></el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import documentSidebarLayoutVue from '../layout/documentSidebarLayout.vue';
export default {
  props:{
      containerVisible:{
          type:Boolean
      },
      deleteFilelist:{
          type:Array | Object
      },
      successcount:{
          type:Number
      },
      failurecount:{
          type:Number
      }
  },
  watch:{
      containerVisible:{
          handler(){
              if(this.containerVisible){
                this.dialogVisible = this.containerVisible
              }
          },
          immediate:true
      },
      dialogVisible(){
          if(!this.dialogVisible){
              this.$emit("update:containerVisible",false)
          }
      }
  },
  data() {
    return {
      dialogVisible: false
    };
  }
};
</script>

<style scoped>
.corpSpaceDetailTitle {
  color: #303133;
  font-size: 20px;
  font-weight: 400;
  margin-right: 10px;
  margin-left: 10px;
}

.buyButton:hover{
    cursor: pointer;
}

.corpSpaceDetailTitleImage {
  width: 80px;
  height: 14px;
}

.corpSpaceDetailTitleImage_Revert {
  width: 80px;
  height: 14px;
  transform: rotateY(180deg);
}
</style>
