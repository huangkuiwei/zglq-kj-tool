<template>
  <!-- 重名文件 -->
  <el-dialog v-dialogDrag title="文件版本选择" :visible.sync="dialogVisible" :close-on-click-modal="false" width="800px">
    <div class="topTitle">请选择要查看的版本：</div>
    <div class="bottomCon">
      <el-table :data="versionFiles" class="t-table" :header-cell-style="$thStyle" @selection-change="handleSelectionChange" style="width: 100%; margin-top: 0; margin-bottom: 10px; font-size: 13px" height="100%" stripe>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="versionNumber" width="65" label="版本">
        </el-table-column>
        <el-table-column prop="fileName" :label="$t('base.button.fileName')"> </el-table-column>
        <el-table-column prop="createTime" :label="$t('base.button.createTime')"> </el-table-column>
        <el-table-column prop="creatorName" label="创建人"> </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: flex-end">
        <el-button size="mini" @click="closeDialog">{{ $t('base.button.cancel') }}</el-button>
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
        tableSelection: [],
        dialogVisible: false,
      };
    },
    methods: {
      confirm() {
        if (this.tableSelection.length == 0) {
          this.$warning('请至少选择一个版本文件')
          return
        }
        this.$emit("versionFilesCallBack", this.tableSelection);
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
