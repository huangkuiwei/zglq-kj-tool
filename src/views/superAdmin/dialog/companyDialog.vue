<template>
  <el-dialog :title="opeType == 'EDIT' ? $t('base.button.edit') : $t('base.button.add')" :visible.sync="dialogVisible" width="452px" :before-close="handleClose" v-dialogDrag :close-on-click-modal="false" :modal="true">
    <div>
      <el-form ref="personalForm" v-if="isPersonal" :model="personalForm" :rules="personalFormRules" label-width="120px" size="small">
        <!-- <el-form-item label="企业名称：" prop="corpName">
          <el-input v-model="personalForm.corpName"></el-input>
        </el-form-item>
        <el-form-item label="组织机构代码：" prop="corpCode">
          <el-input v-model="personalForm.corpCode"></el-input>
        </el-form-item> -->
        <el-form-item label="空间容量上限：" prop="corpSpace" class="companyCode">
          <el-input v-model.number="personalForm.usableSpace"></el-input>
          <div class="companyCodeAdd">GB</div>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="personalForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-else ref="dataForm" :model="dataForm" :rules="dataFormRules" label-width="120px" size="small">
        <el-form-item label="企业名称：" prop="corpName">
          <el-input v-model="dataForm.corpName"></el-input>
        </el-form-item>
        <el-form-item label="组织机构代码：" prop="corpCode">
          <el-input v-model="dataForm.corpCode"></el-input>
        </el-form-item>
        <el-form-item label="负责人：" prop="superintend">
          <el-input v-model="dataForm.superintend"></el-input>
        </el-form-item>
        <el-form-item label="负责人手机号：" prop="superintendphone">
          <el-input v-model="dataForm.superintendphone"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" v-model="dataForm.remark"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="sure" size="small">{{ $t('base.button.confirm') }}</el-button>
      <el-button @click="handleClose" size="small">{{ $t('base.button.cancel') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import postApi from "@/api/document/indexApi.js";
import local from "@/utils/auth";

export default {
  name:'companyDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    reload: {
      type: Function
    },
    opeType: {
      type: String,
    },
    corpId: {
      type: String,
    },
    userId: {
      type: String,
    },
    isPersonal: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    dialogVisible: {
      handler() {
        if (this.dialogVisible) {
          if (this.$refs["dataForm"]) {
            this.$refs["dataForm"].resetFields();
          }

          if (this.$refs["personalForm"]) {
            this.$refs["personalForm"].resetFields();
          }

          if (this.opeType == "EDIT") {
            if (!this.isPersonal) {
              this.loadCorpData();
            } else {
              this.loadUserData();
            }
          }
        }
      },
      immediate: true,
    },
  },
  data() {
    var checkMobile = (rules, value, callback) => {
      const regMobile =
        /^(0|86|17951)?1[0-9]{10}$/;
      if (regMobile.test(value) == true) {
        return callback();
      } else {
        callback(new Error("请输入合法的手机号"));
      }
    };

    return {
      dataForm: {
        corpId: null,
        corpName: null,
        corpCode: null,
        superintend: null,
        superintendphone: null,
        corpSpace: null,
        corpProjectNumber: null,
        remark: null,
      },
      dataFormRules: {
        corpName: [
          { required: true, message: "请输入企业名称", trigger: "blur" },
        ],
        corpCode: [
          { required: true, message: "请输入18位组织机构代码", trigger: "blur" },
          { max: 18, min: 18, message: "请输入18位组织机构代码", trigger: "blur" },
        ],
        superintend: [
          { required: true, message: "请输入负责人", trigger: "blur" },
        ],
        superintendphone: [
          { required: true, message: "请输入正确手机号", trigger: "blur", validator: checkMobile, },
        ],
      },
      personalFormRules: {
        remark: null,
      },
      personalForm: {
        usableSpace: null,
        remark: null,
      },
    };
  },
  methods: {
    async loadCorpData() {
      var res = await postApi.get("/api/WebAccount/GetCorpItem", {
        corpId: this.corpId,
      });
      if (res.code == 1) {
        this.dataForm = res.data[0];
      }
    },
    async loadUserData() {
      var res = await postApi.get("/api/WebAccount/GetUserItem", {
        userId: this.userId,
      });
      if (res.code == 1 && res.data.length > 0) {
        this.personalForm = res.data[0];
      }
    },
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
    tableRowClassName({ row, rowIndex }) {
      if (
        rowIndex === this.locationRowIndex - 1 &&
        this.page === this.cacheLocationPageIndex
      ) {
        return "success-row";
      }
      return "";
    },
    sure() {
      if (this.isPersonal) {
        this.$refs["personalForm"].validate(async (valid) => {
          if (valid) {
            this.personalForm.userId = this.userId;
            var res = await postApi.post(
              "/api/WebAccount/SaveUser",
              this.personalForm
            );
            if (res.code === 1) {
              this.$success(res.msg);
              this.$emit("reload");
              this.$emit("update:dialogVisible", false);
            }
          }
        });
      } else {
        this.$refs["dataForm"].validate(async (valid) => {
          if (valid) {
            //用户中心界面用户主动创建企业
            if (this.$route.name == "userCenter" || this.$route.path == '/systemInitError') {
              this.dataForm.isPersonalVersionCreate = true;
              this.$confirm(
                "一个账号只能加入一个企业，新加入或创建企业将自动将原来的申请撤回，请确定是否继续"
              ).then(async () => {
                var res = await postApi.post(
                  "/api/WebAccount/SaveCorp",
                  this.dataForm
                );
                if (res.code === 1) {
                  this.$success(res.msg);
                  this.$store.state.user.user.corpIdbit = true;
                  this.$store.state.user.user.systemIsPersonal = false;
                  local.setUser(this.$store.state.user.user);
                  if (this.$route.name == "userCenter") {
                    this.$router.go(0);
                  } else if (this.$route.path == '/systemInitError') {
                    this.$router.push('/');
                  }
                  // this.$emit("reload");
                  this.$emit("update:dialogVisible", false);
                }
              });
            } else {
              // 编辑企业
              var res = await postApi.post(
                "/api/WebAccount/SaveCorp",
                this.dataForm
              );
              if (res.code === 1) {
                this.$success(res.msg);
                this.$store.state.user.user.systemIsPersonal = false;
                this.$store.state.user.user.corpIdbit = true;
                local.setUser(this.$store.state.user.user);
                // this.$router.go(0);
                this.$emit('reload')
                this.$emit("update:dialogVisible", false);
              }
            }
          }
        });
      }
    },
  },
};
</script>
<style scoped>
.companyCode ::v-deep .el-form-item__content {
  display: flex;
}

.companyCode ::v-deep .el-input__inner {
  border-radius: 4px 0 0 4px;
  border-right-width: 0;
}

.companyCodeAdd {
  width: 50px;
  height: 32px;
  border-radius: 0px 4px 4px 0px;
  border: 1px solid #d8dce6;
  background: #f9f9f9;
  text-align: center;
}
</style>
