<template>
  <!-- 重名文件 -->
  <el-dialog v-dialogDrag title="文件版本提醒" :visible.sync="dialogVisible" :before-close="closeDialog" :close-on-click-modal="false" width="800px">
    <div class="topTitle">删除的文件存在多个版本，请选择处理方式：</div>
    <div class="bottomCon">
      <div style="padding: 15px 0">
        <el-radio-group v-model="deleteOperate" size="small">
          <el-radio :label="1">跳过此文件</el-radio>
          <el-radio :label="2">全部删除</el-radio>
          <el-radio :label="3">选择要删除的版本</el-radio>
        </el-radio-group>
      </div>
      <el-table :data="dataList" class="t-table" :header-cell-style="$thStyle" @selection-change="handleSelectionChange" style="width: 100%; margin-top: 0; margin-bottom: 10px; font-size: 13px" height="100%" :key="deleteOperate" stripe>
        <el-table-column type="selection" v-if="deleteOperate == 3" width="55" />
        <el-table-column width="55" v-else> </el-table-column>
        <el-table-column prop="versionNumber" width="65" label="版本">
        </el-table-column>
        <el-table-column prop="fileName" :label="$t('base.button.fileName')"> </el-table-column>
        <el-table-column prop="createTime" :label="$t('base.button.createTime')">
          <template slot-scope="scope">
            <span v-if="scope.row.createTime">{{ scope.row.createTime.split(['T']).join(' ') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="创建人"> </el-table-column>
      </el-table>
      <div style="padding: 5px 0" v-if="dataIndex < versionFiles.length - 1">
        <el-radio-group v-model="fileOperate" size="small">
          <el-radio v-if="deleteOperate != 3" :label="1">为后面的所有文件执行此操作</el-radio>
          <el-radio :label="2">每个文件都要询问我</el-radio>
        </el-radio-group>
      </div>
      <div style="display: flex; justify-content: flex-end">
        <el-button type="primary" size="mini" @click="confirm">{{ $t('base.button.confirm') }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  import fileIconComponends from "@/components/fileIcon";
  export default {
    components: {
      fileIconComponends,
    },
    props: {
      versionFiles: {
        type: Object | Array,
      },
      dialogVisibleProp: {
        type: Boolean,
      },
    },
    watch: {
      deleteOperate: {
        handler() {
          if (this.deleteOperate == 3) {
            this.fileOperate = 2;
          } else {
            this.fileOperate = 1;
          }
        },
        immediate: true,
      },
      versionFiles() {
        this.dataIndex = 0;
        this.dataList = this.versionFiles[this.dataIndex].versionFiles;
        this.versionFilesCallBack = [];
      },
      dialogVisibleProp() {
        this.dialogVisible = this.dialogVisibleProp;
      },
      dialogVisible() {
        if (!this.dialogVisible) {
          this.$emit("update:dialogVisibleProp", false);
        }
      },
    },
    data() {
      return {
        dataIndex: 0,
        dataList: null,
        deleteOperate: 3,
        fileOperate: 1,
        tableSelection: [],
        dialogVisible: false,
      };
    },
    methods: {
      confirm() {
        if (this.deleteOperate == 3 && this.tableSelection.length == 0) {
          this.$warning('请选择至少一个版本文件')
          return
        }
        var deleteFiles;
        if (this.fileOperate == 1) {
          //为后面的选择都执行此操作
          if (this.deleteOperate == 2) {
            for (let index = this.dataIndex; index < this.versionFiles.length; index++) {
              const element = this.versionFiles[index];
              deleteFiles = element.versionFiles && element.versionFiles.map((item) => {
                return item.iuid;
              });
              this.versionFilesCallBack = this.versionFilesCallBack.concat(deleteFiles);
            }
          }
          //跳跃所有数据，提交versionFilesIuid
          this.$emit("versionFilesCallBack", this.versionFilesCallBack);
        } else {
          if (this.deleteOperate != 1) {
            //跳过文件
            if (this.deleteOperate == 2) {
              //全部删除
              deleteFiles = this.dataList.map((item) => {
                return item.iuid;
              });
            } else if (this.deleteOperate == 3) {
              //部分删除
              deleteFiles = this.tableSelection.map((item) => {
                return item.iuid;
              });
            }
            this.versionFilesCallBack = this.versionFilesCallBack.concat(deleteFiles);
          }
          this.dataIndex += 1;
          if (this.dataIndex < this.versionFiles.length) {
            this.dataList = this.versionFiles[this.dataIndex].versionFiles;
            return;
          }
        }
        this.$emit("versionFilesCallBack", this.versionFilesCallBack);
        console.log("versionFilesCallBack", this.versionFilesCallBack);
        this.dialogVisible = false;
      },
      handleSelectionChange(val) {
        this.tableSelection = val;
      },
      closeDialog() {
        this.dialogVisible = false;
      },
    },
  };
</script>
<style scoped>
  .existing {
    flex: 1;
    padding-top: 17px;
  }

  .existingTit {
    justify-content: space-around;
    color: rgba(64, 158, 255, 1);
    padding-bottom: 17px;
  }
</style>
