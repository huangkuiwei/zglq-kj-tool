<template>
  <div>
    <el-dialog title="文件设置" :visible="bidDialogVisible" width="1000px" v-dialogDrag custom-class="dialogFixedZindex" :modal="true" :close-on-click-modal="false" :before-close="closeDialog">
      <el-form>
          <el-form-item label="总标段数：">
            <el-input style="width: 100px" size="mini" prefix-icon="el-icon-refresh" v-model="sectionLength" @change="handleSearch"></el-input>
          </el-form-item>
        </el-form>
        <el-table ref="multipleTable" :header-cell-style="$thStyle" :data="rowData.data" tooltip-effect="light" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column prop="fileName" :label="$t('base.button.fileName')" >
          </el-table-column>
          <el-table-column prop="bidSectionNumber" label="标段号" width="250">
            <template slot-scope="scope">
              <el-select size="mini" placeholder="请选择标段号" v-model="scope.row.bidSectionNumber" @change="(val, row) => { changeBidSection(val, scope.row) }">
                <el-option :label="item" :value="item" v-for="(item, index) in section" :key="index">{{ item }}</el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="bidSectionName" label="标段名" width="250">
            <template slot-scope="scope">
              <el-input size="mini" placeholder="请输入标段名" v-model="scope.row.bidSectionName"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" :label="$t('base.formLabel.operation')" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <el-button size="mini" style="display:inline-block" type="danger" @click="deleteFile(scope.row)"> 删除 </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer flex" style="justify-content:space-between">
          <div>
            <el-button type="success" style="background:#48Dba4;border-color:#48Dba4" @click="saveBidSection" size="mini">{{ $t('base.button.confirm') }}</el-button>
            <el-button @click="closeDialog" size="mini">{{ $t('base.button.cancel') }}</el-button>
          </div>
        </div>
      </el-dialog>
    <!-- 删除/ -->
      <el-dialog title="删除" :visible.sync="deleteDialogVisible" width="30%">
        <span>确定删除么</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialogVisible = false" size="mini">{{ $t('base.button.cancel') }}</el-button>
          <el-button type="primary" @click="deleteNoEffectFile" size="mini">{{ $t('base.button.confirm') }}</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
import projectFileApi from "@/api/project/file";
export default {
  components: {},
  props: {
    bidDialogVisible: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object,
      default: null,
    },
    handleSetMainfile: {
      type: Function,
    },
    sureBidSection: {
      type: Function,
    },
    collectType: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      section: [],
      deleteIuid: null,
      deleteDialogVisible: false,
      multipleSelection: [],
    }
  },
  computed: {
    sectionLength(){
      let length = 0
      if(this.section){
        length = this.section.length
      }
      return length
    }
  },
  watch: {
    rowData: {
      handler() {
        if (this.rowData) {
          this.section = this.rowData.twodata
        }
      },
      immediate: true
    },
  },
  mounted() { },
  methods: {
    handleSearch() {
      var optionsType = [];
      for (var i = 0; i < this.section; i++) {
        if (i == 0) {
          optionsType.push("主文件");
        } else {
          optionsType.push("标段" + i);
        }
      }
      this.section = optionsType
    },
    async saveBidSection() {
      var res = await projectFileApi.ProjectBidSectionListSave(this.rowData.data);
      if (res.code == 1) {
        this.$message({
          message: res.msg,
          type: "success",
        });
        this.$emit("sureBidSection")
        this.closeDialog();
      } else {
        this.$message({
          message: res.msg,
          type: "error",
        });
      }
    },
    deleteFile(row) {
      this.deleteIuid = row.fileIUID
      // this.deleteDialogVisible = true;
      this.deleteNoEffectFile()
    },
    async deleteNoEffectFile() {
      var formData = new FormData();
      formData.append("FileIUID", this.deleteIuid);
      var res = await projectFileApi.ProjectFileDetailsDelete(formData);
      if (res.code == 1) {
        this.$message({
          message: res.msg,
          type: "success",
        });
        // this.deleteDialogVisible = false;
        // this.closeDialog();
        this.$emit("handleSetMainfile")
      }
    },
    changeBidSection(val, row) {
      if (val == '主文件') row.bidSectionName = 'NA'
      else row.bidSectionName = ''
    },
    closeDialog() {
      this.$emit("update:bidDialogVisible", false)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  }
}
</script>
<style scoped lang="scss"></style>
