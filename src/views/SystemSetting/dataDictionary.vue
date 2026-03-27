<template>
  <el-container class="background" style="height: 100%">
    <el-aside width="280px">
      <!-- <el-tree :data="typeData" :props="treeProps"></el-tree> -->
      <el-table class="table" :data="typeData" style="width: 100%" border row-class-name="typeRow"
        @row-click="handleSelectionChange" :header-cell-style="$thStyle">
        <el-table-column prop="typeName" :label="$t('base.label.dictionaryName')">
          <template slot-scope="scope">
            <div class="tableLine flex ai-center jc-between"
              :style="{ color: typeForm.code == scope.row.typeCode ? '#409eff' : '#000' }" style="cursor: pointer">
              {{ scope.row.typeName }}
              <el-button type="text" size="default" class="editBtn" @click.stop="handelType('edit', scope.row)">{{
                $t("base.button.edit") }}</el-button>
            </div>
          </template>
        </el-table-column>

      </el-table>
    </el-aside>
    <el-main class="background" style="background-color: #fff">
      <div style="
          padding-left: 20px;
          margin-left: 20px;
          border-left: 1px solid #d6dfed;
        ">
        <el-row style="margin-bottom: 20px">
          <el-button type="primary" size="small" :disabled="!addVisible" @click="rightHandelType('add')">
            {{ $t("base.button.create") }}
          </el-button>
          <el-button type="primary" size="small" @click="rightHandelType('edit')" :disabled="!isClick">
            {{ $t("base.button.edit") }}
          </el-button>
          <el-button type="danger" size="small" @click="rightHandelDel" :disabled="!isClick">
            {{ $t("base.button.delete") }}
          </el-button>
        </el-row>
        <el-row>
          <el-tree class="roleTree" highlight-current :data="treeData" @node-expand="saveTreeOpenNodes"
            default-expand-all @node-collapse="removeTreeOpenNodes" :props="defaultProps"
            :default-expanded-keys="treeOpenNodes" @node-click="handleNodeClick"></el-tree>
        </el-row>
      </div>
    </el-main>
    <el-dialog :title="showType == 'add' ? $t('base.button.add') : $t('base.button.edit')" :visible.sync="dialogVisible" width="30%">
      <el-form ref="typeForm" :model="typeForm" label-width="120px" :rules="codeRules">
        <!-- <el-form-item label="类型编码" prop="code">
          <el-input v-model="typeForm.code" :disabled="showType == 'add' ? false : true"></el-input>
        </el-form-item>-->
        <el-form-item :label="$t('base.button.index')" prop="number">
          <el-input v-model="typeForm.number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('base.button.typeName')" prop="typeName">
          <el-input v-model="typeForm.typeName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm()">{{ $t('base.button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="rightShowType == 'add' ? $t('base.button.add') : $t('base.button.edit')" :visible.sync="rightDialogVisible" width="30%">
      <el-form ref="dataForm" :rules="codeRules" :model="rightTreeForm" label-width="80px">
        <el-form-item :label="$t('base.button.index')" prop="num">
          <el-input v-model="rightTreeForm.num"></el-input>
        </el-form-item>
        <el-form-item :label="$t('base.button.name')" prop="name">
          <el-input v-model="rightTreeForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
        <el-button type="primary" @click="rightSubmitForm()">{{ $t('base.button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import documentApi from "@/api/document/indexApi.js";
import zskFileApi from "@/api/zsk/index.js";
export default {
  props: {
    actionType: { type: String, default: "1" },
  },
  data() {
    return {
      typeData: [],
      addVisible: false,
      dialogVisible: false,
      showType: "",

      typeForm: {
        iuid: "",
        code: "",
        number: "",
        typeName: "",
      },
      currentData: {
        num: "",
        name: "",
      },
      rightTreeForm: {
        num: "",
        name: "",
      },

      treeProps: {
        label: "typeName",
      },
      codeRules: {
        code: [
          {
            pattern: /[a-zA-z]$/,
            required: true,
            message: "请输入英文编码",
          },
        ],
        typeName: [
          {
            required: true,
            message: "请输入类型名称",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
        num: [
          {
            required: true,
            message: "请输入序号",
            trigger: "blur",
          },
        ],
      },
      selectData: [],
      Iuid: "",
      defaultProps: {
        children: "child",
        label: "itemText",
      },
      treeOpenNodes: [],
      rightDialogVisible: false,
      rightShowType: "",
      treeData: [],

      isClick: false,
      Childlevel: "",
      treeIuid: "",
    };
  },
  watch: {
    rightDialogVisible() {
      if (!this.rightDialogVisible) {
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        });
      }
    },
    dialogVisible() {
      if (!this.dialogVisible) {
        this.$nextTick(() => {
          this.$refs.typeForm.clearValidate();
        });
      }
    },
  },
  mounted() {
    this.queryDataDictionaryType();
  },
  methods: {
    saveTreeOpenNodes(paylod) {
      this.treeOpenNodes.push(paylod.iuid);
    },
    removeTreeOpenNodes(paylod) {
      if (this.treeOpenNodes) {
        this.treeOpenNodes.some((item, i) => {
          if (item == paylod.iuid) {
            this.treeOpenNodes.splice(i, 1);
            if (paylod.child.length > 0) {
              paylod.child.forEach((i) => {
                this.removeTreeOpenNodes(i);
              });
            }
          }
        });
      }
    },
    //查询左侧数据
    async queryDataDictionaryType() {
      var res = await documentApi.get("/api/systemSetting/GetItemTypeData?ActionType=" + this.actionType);
      this.typeData = res.data;
      this.handleSelectionChange(this.typeData[0]);
    },
    handelType(type, row) {
      this.showType = type;
      this.typeForm.iuid = row.iuid
      this.typeForm.code = row.typeCode;
      this.typeForm.number = row.number;
      this.typeForm.typeName = row.typeName;
      if (type == "add") {
        this.typeForm = {
          code: "",
          typeName: "",
        };
      }
      this.dialogVisible = true;
    },
    handleSelectionChange(row, column, event) {
      this.addVisible = true
      this.selectData = [row];
      this.typeForm.iuid = row.iuid;
      this.typeForm.code = row.typeCode;
      this.typeForm.number = row.number;
      this.typeForm.typeName = row.typeName;
      this.Iuid = row.iuid;
      this.isClick = false;
      this.queryRightTree();
    },
    //左侧新增、编辑
    async addOrEditType() {
      var formData = new FormData();
      formData.append("IUID", this.showType == "add" ? "" : this.typeForm.iuid);
      formData.append("number", this.typeForm.number);
      formData.append("TypeCode", this.typeForm.code);
      formData.append("TypeName", this.typeForm.typeName);
      formData.append("type", this.showType == "add" ? "Add" : "Edit");
      var res = await zskFileApi.post(
        "/api/systemSetting/GetItemTypeAddEdit",
        formData
      );
      if (res.code == 1) {
        this.$success(res.msg);
        this.queryDataDictionaryType();
        this.dialogVisible = false;
      }
    },
    submitForm() {
      this.$refs.typeForm.validate((valid) => {
        if (valid) {
          this.addOrEditType();
          this.selectData = [];
        }
      });
    },
    //左侧删除
    async handelDel() {
      this.$confirm("确定要删除吗？").then(async () => {
        var res = await documentApi.get(
          "/api/systemSetting/GetItemTypeDELETE?IUID=" + this.Iuid,
          ""
        );
        if (res.code == 1) {
          this.dialogVisible = false;
          this.$success(res.msg);
          this.queryDataDictionaryType();
        }
      });
    },
    //查询右侧数据
    async queryRightTree() {
      if (this.actionType == '1') {
        let res = await documentApi.get(`/api/Home/GetItemInfoData?TypeCode=${this.typeForm.code}&ActionType=${this.actionType}`);
        this.treeData = res.data;
      } else if (this.actionType == '0') {
        let res = await documentApi.get(`/api/systemSetting/GetItemInfoData?iuid=${this.typeForm.iuid}`);
        this.treeData = res.data;
      }
    },
    handleNodeClick(data, node) {
      if (['ProjectStatus'].includes(this.typeForm.code)) {
        if (node.level >= 2) {
          this.addVisible = false
        } if (node.level < 2) {
          this.addVisible = true
        }
      } else {
        this.addVisible = false
      }
      this.isClick = true;
      this.Childlevel = data.childlevel;
      this.treeIuid = data.iuid;
      this.currentData = {
        num: data.itemIndex,
        name: data.itemText,
      };
    },
    rightHandelType(type) {
      this.rightShowType = type;
      if (type == "add") {
        this.rightTreeForm = {
          num: "",
          name: "",
        };
      } else {
        this.rightTreeForm = {
          num: this.currentData.num,
          name: this.currentData.name,
        };
      }
      this.rightDialogVisible = true;
    },
    //右侧新增、编辑
    rightAddEdit() {
      this.$refs["dataForm"].validate(async (valid) => {
        if (valid) {
          var formData = new FormData();
          formData.append(
            "IUID",
            this.rightShowType == "add" ? "" : this.treeIuid
          );
          formData.append(
            "Parentlevel",
            this.isClick == false ? this.Iuid : this.Childlevel
          );
          formData.append("ItemIndex", this.rightTreeForm.num);
          formData.append("ItemText", this.rightTreeForm.name);
          formData.append("type", this.rightShowType == "add" ? "Add" : "Edit");
          formData.append("ActionType", this.actionType);
          var res = await zskFileApi.post(
            "/api/systemSetting/GetItemInfoAddEdit",
            formData
          );
          if (res.code == 1) {
            this.$success(res.msg);
            this.queryRightTree();
            this.rightDialogVisible = false;
          }
        }
      });
    },
    rightSubmitForm() {
      this.rightAddEdit();
    },
    rightHandelDel() {
      this.$confirm("确定要删除吗？").then(async () => {
        var res = await documentApi.get(
          "/api/systemSetting/GetItemInfoDELETE?IUID=" + this.treeIuid,
          ""
        );
        if (res.code == 1) {
          this.treeIuid = "";
          this.isClick = false;
          this.rightDialogVisible = false;
          this.$success(res.msg);
          this.queryRightTree();
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.roleTree {
  height: calc(100vh - 182px);
  overflow-y: auto;
}

.table {
  ::v-deep() .typeRow {
    cursor: pointer;

    .editBtn {
      display: none;
      padding: 0;
    }

    &:hover {
      .editBtn {
        display: block;
      }
    }
  }
}
</style>
