<template>
  <div class="table-box" :style="{ width: parentPage != 'project' ? 'calc(100% - 360px)' : '100%' }">
    <div class="member-box">
      <div class="flex ai-center">
        <el-popover v-if="parentPage == 'project'" placement="bottom" v-model="showPop" style="margin-right: 10px"
          trigger="click">
          <div class="flex column ai-center">
            <div class="mHover" @click="pickMember">
              {{ $t("projects.button.companyMember") }}
            </div>
            <div class="mHover" @click="addMember">
              {{ $t("projects.button.projectMember") }}
            </div>
          </div>
          <el-button slot="reference" type="primary" size="small" style="width: 64px">{{
            $t("base.button.increase")
          }}</el-button>
        </el-popover>
        <template v-else>
          <el-button type="primary" size="small" :disabled="currentRow == null" style="margin-right: 20px"
            icon="el-icon-plus" @click="createOrEdit('add')">{{ $t("base.button.add") }}</el-button>
          <el-input :placeholder="$t('base.label.inputName')" prefix-icon="el-icon-search" style="width: 180px; margin-right: 20px" clearable
            v-model="username" @change="search" size="small"></el-input>
          <el-input :placeholder="$t('base.label.inputPhone')" prefix-icon="el-icon-search" style="width: 180px" clearable v-model="phone"
            @change="search" size="small"></el-input>
        </template>
      </div>
      <el-table :data="tableData" class="t-table" :header-cell-style="$thStyle"
        style="width: 100%; margin-top: 20px; font-size: 13px" :maxHeight="parentPage == 'project' ? 'calc(100vh - 220px)' : 'calc(100vh - 180px)'
          " stripe>
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column prop="userName" align="center" :label="$t('base.label.name')"
          show-overflow-tooltip></el-table-column>
        <el-table-column prop="phone" align="center" :label="$t('base.label.phone')"
          show-overflow-tooltip></el-table-column>
        <el-table-column align="center" v-if="parentPage != 'project'" :label="$t('base.label.type')">
          <template slot-scope="scope">
            {{ scope.row.isadministrator ? $t('settings.member.manager') : $t('settings.member.normal') }}
          </template>
        </el-table-column>

        <el-table-column v-if="currentRow && currentRow.id" align="center" :label="$t('base.label.departmentManager')">
          <template slot-scope="scope">
            {{ scope.row.setuproletype === '1' ? $t('projects.label.yes') : $t('projects.label.no') }}
          </template>
        </el-table-column>

        <el-table-column v-if="parentPage == 'project'" prop="roleName" align="center"
          :label="$t('base.label.role')"></el-table-column>
        <el-table-column v-if="parentPage == 'project'" prop="outueser" align="center" :label="$t('base.button.memberType')"></el-table-column>
        <!-- <el-table-column prop="remarks" align="center" :label="$t('base.button.remark')"></el-table-column> -->
        <el-table-column v-if="parentPage == 'project'" align="center" :label="$t('base.button.joinTime')">
          <template v-if="scope.row.createTime" slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column v-else prop="registersTime" align="center" :label="$t('base.button.joinTime')">
          <template v-if="scope.row.registersTime" slot-scope="scope">
            {{ scope.row.registersTime }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('base.formLabel.operation')" align="center" width="380">
          <template slot-scope="scope">
            <el-button :style="{color: scope.row.setuproletype === '1' ? '#f56c6c' : ''}" type="text" size="small" icon="el-icon-edit-outline" @click="setAdmin(scope.row)" v-if="Number(currentRow && currentRow.id)">
              {{ scope.row.setuproletype === '1' ? $t('base.label.cancelManager') : $t('base.label.setManager') }}
            </el-button>

            <el-button type="text" size="small" icon="el-icon-edit-outline" @click="createOrEdit('edit', scope.row)">{{
              $t("base.button.edit") }}</el-button>
            <el-button type="text" v-if="scope.row.isadminID != 1" size="small" icon="el-icon-circle-close"
              style="color: #f56c6c" @click="handleDelete(scope.row)">{{ $t("base.button.delete") }}</el-button>

            <el-button type="text" v-if="(scope.row.isadminID != 1 && scope.row.outueser === '外协单位') || parentPage !== 'project'" size="small" icon="el-icon-refresh"
                       style="color: #f56c6c" @click="resetPassword(scope.row)">{{ $t('login.rePassword') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageTotal="Total" :pageIndex="page" :pageSize="rows" :pageNumber="10"
        @handleCurrentChange="paginationCurrentChange" @handleSizeChange="handleSizeChange"></pagination>
    </div>

    <member-picker v-if="parentPage == 'project'" dialogTitle="选择项目成员" @cancelCheck="cancelCheck"
      @queryMember="queryMemberData" :checkList="checkList" :memberList="memberList" @submit="saveMember"
      :dialogVisible.sync="memberPickerVisible" />

    <el-dialog :title="dialogTitle" append-to-body :visible.sync="dialogVisible" @close="clearValidate('form')"
      width="550px">
      <el-form :model="addform" ref="form" :rules="rules" label-width="160px" label-suffix=":" size="normal">
        <el-form-item :label="$t('base.button.organizationName')" prop="listDDCorpId">
          <el-cascader style="width: 100%" v-model="addform.listDDCorpId" :options="deptOptions" :props="{
            label: 'name',
            value: 'id',
            checkStrictly: true,
            emitPath: false,
            multiple: true,
          }" :show-all-levels="false" @change="handleDeptChange"></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('base.label.name')" prop="UserName">
          <el-input v-model="addform.UserName" :placeholder="$t('base.label.inputName')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('base.label.phone')" prop="phone">
          <el-input v-model="addform.phone" :laceholder="$t('base.button.inputPhoneNumber')"></el-input>
        </el-form-item>
        <!-- <el-form-item :label="$t('base.button.remark')" prop="remarks">
          <el-input v-model="addform.remarks" placeholder="请输入备注"></el-input>
        </el-form-item> -->
        <el-form-item :label="$t('settings.member.category')" prop="isadministrator" v-if="user.isadministrator">
          <el-radio-group v-model="addform.isadministrator">
            <el-radio :label="true">{{$t('settings.member.manager')}}</el-radio>
            <el-radio :label="false">{{$t('settings.member.normal')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">{{
          $t("base.button.cancel")
        }}</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submit">{{ $t("base.button.save") }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="memberDialogTitle" :close-on-click-modal="false" append-to-body
      @close="clearValidate('memberForm')" :visible.sync="memberDialogVisible" width="500px">
      <el-form :model="currentUser" label-width="100px" ref="memberForm" :rules="mRules" label-suffix=":" size="small">
        <template v-if="memberDialogTitle == '添加成员'">
          <el-form-item :label="$t('base.label.phone')" prop="phone">
            <el-input v-model="currentUser.phone" :laceholder="$t('base.button.inputPhoneNumber')" clearable @blur="searchUser"></el-input>
          </el-form-item>
          <el-form-item :label="$t('base.label.name')" prop="UserName" v-if="currentUser.isOutuser">
            <el-input v-model="currentUser.UserName" placeholder="请输入姓名" clearable></el-input>
          </el-form-item>
        </template>
        <el-form-item label="角色" prop="rolelist" v-if="user">
          <el-select style="width: 100%" v-model="currentUser.rolelist" value-key="id" multiple placeholder="请选择成员角色，支持多选"
            collapse-tags clearable>
            <el-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="memberDialogVisible = false">{{
          $t("base.button.cancel")
        }}</el-button>
        <el-button size="small" type="primary" @click="submitMember">{{
          $t("base.button.confirm")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pagination from "@/components/pagination/index";
import postApi from "@/api/document/indexApi.js";
import memberPicker from "@/components/memberPicker";
import i18n from '../../../static/locales'
import request from '@/utils/request'
import { mapGetters } from 'vuex'

export default {
  name: "member",
  components: {
    memberPicker,
    pagination,
  },
  props: [
    "parentPage",
    "type",
    "ProjectIUID",
    "addDeptUser",
    "currentRow",
    "deptOptions",
  ],
  data() {
    var checkMobile = async (rules, value, callback) => {
      const regMobile = /^(0|86|17951)?1[0-9]{10}$/;
      if (value === "") {
        callback(new Error(i18n.t('base.button.inputPhoneNumber')));
      } else if (regMobile.test(value) == true) {
        callback();
      } else {
        callback(new Error(i18n.t('base.button.inputCorrectPhoneNumber')));
      }
    };
    return {
      username: "",
      phone: "",
      addform: {},
      rules: {
        listDDCorpId: [{ required: true, message: i18n.t('base.button.selectOrganization'), trigger: "blur" }],
        UserName: [{ required: true, message: i18n.t('base.button.selectOrganization'), trigger: "blur" }],
        phone: [{ required: true, message: i18n.t('base.label.inputName'), trigger: "blur" }],
      },
      tableData: [],

      memberPickerVisible: false,
      memberList: [],
      checkList: [],

      multipleSelection: [],
      // 翻页
      Total: 0,
      page: 1,
      rows: 10,
      dialogTitle: "",
      dialogVisible: false,
      showPop: false,

      // 成员管理
      memberDialogTitle: "",
      memberDialogVisible: false,
      currentUser: {
        phone: "",
        UserName: "",
        rolelist: [],
        isOutuser: false,
      },
      roles: [],
      mRules: {
        phone: [
          {
            required: true,
            validator: checkMobile,
            trigger: "blur",
          },
        ],
        UserName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        rolelist: [
          {
            required: true,
            message: "请选择角色类型",
            trigger: "blur",
          },
        ],
      },
      submitLoading: false
    };
  },
  watch: {
    currentRow: {
      deep: true,
      handler(val) {
        this.page = 1
        this.queryData();
      },
    },
    memberDialogVisible(val) {
      if (!val) {
        this.$nextTick(() => {
          this.currentUser = {
            phone: "",
            UserName: "",
            isOutuser: true,
            rolelist: [],
          };
          this.$refs["memberForm"].resetFields();
        });
      }
    },
    ProjectIUID(val) {
      this.page = 1;
      this.queryData();
      this.queryRoles();
      this.queryMemberData();
    },
  },

  computed: {
    ...mapGetters(["user"]),
  },
 
  mounted() {
    this.queryData();
    if (this.parentPage == "project") {
      this.queryRoles();
    }
    this.queryMemberData();
  },
  methods: {
    clearValidate(dom) {
      this.$refs[dom].resetFields();
    },
    async searchUser() {
      let form = new FormData();
      form.append("phone", this.currentUser.phone);
      let res = await postApi.post("/api/Users/GetphoneUser", form);
      if (res.code == 1 && res.data != null) {
        this.currentUser.UserName = res.data.UserName;
      }
    },
    handleDeptChange() { },
    addMember() {
      this.memberDialogTitle = "添加成员";
      this.memberDialogVisible = true;
      this.currentUser = {
        phone: "",
        UserName: "",
        isOutuser: true,
        rolelist: [],
      };
    },
    async submitMember() {
      this.$refs["memberForm"].validate(async (valid) => {
        if (valid) {
          let form = {
            phone: this.currentUser.phone, //手机号
            UserName: this.currentUser.UserName, //姓名
            roleid: this.currentUser.rolelist,
            ProjectIUID: null,
            IUID: null,
          };
          let res = {};
          if (this.ProjectIUID) {
            form.ProjectIUID = this.ProjectIUID; //项目IUID
          }
          if (this.memberDialogTitle == "添加成员") {
            res = await postApi.post("/api/Users/SetupAddUser", form);
          } else {
            form.IUID = this.currentUser.IUID; //
            res = await postApi.post("/api/Users/SetupUserRole", form);
          }
          if (res.code == 1) {
            this.$success(res.msg);
            this.memberDialogVisible = false;
            this.queryData();
          }
        } else {
          return false;
        }
      });
    },

    async queryRoles() {
      let form = new FormData();
      form.append("ProjectIUID", this.ProjectIUID);
      let res = await postApi.post("/api/BaseRole/GetProjectRoleData", form);
      if (res.code == 1) {
        this.roles = res.data;
      }
    },
    search() {
      this.page = 1;
      this.queryData();
    },
    async queryData() {
      if (this.parentPage != "project") {
        if (this.currentRow.parentlevel == null) {
          var formData = new FormData();
          formData.append("page", this.page);
          formData.append("rows", this.rows);
          formData.append("username", this.username);
          formData.append("phone", this.phone);
          var res = await postApi.post("/api/Users/GetCorpUsersData", formData);
          if (res.code == 1) {
            this.Total = res.count;
            this.tableData = res.data.map((item) => {
              return {
                ...item,
                listDDCorpId: item.listDDCorpId ? item.listDDCorpId.split(",") : [],
              };
            });
          }
        } else {
          let form = new FormData();
          form.append("departmentid", this.currentRow.id);
          form.append("page", this.page);
          form.append("rows", this.rows);
          form.append("UserName", this.username);
          form.append("phone", this.phone);
          let res = await postApi.post("/api/Basedepartment/GetcheckedUser", form);
          if (res.code == 1) {
            this.Total = res.count;
            this.tableData = res.data.map((item) => {
              return {
                ...item,
                listDDCorpId: item.listDDCorpId ? item.listDDCorpId.split(",") : [],
              };
            });
          }
        }
      } else if (this.parentPage == "project") {
        var formData = new FormData();
        formData.append("type", null);
        formData.append("ProjectIUID", this.ProjectIUID);
        formData.append("page", this.page);
        formData.append("rows", this.rows);
        var res = await postApi.post("/api/Users/GetProjectUsersData", formData);
        this.Total = res.count;
        this.tableData = res.data;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    paginationCurrentChange(val) {
      this.page = val;
      this.queryData();
    },
    handleSizeChange(val) {
      this.rows = val;
      this.queryData();
    },
    async pickMember() {
      await this.queryCheckedList();
      this.memberPickerVisible = true;
      this.showPop = false;
    },

    setAdmin(row) {
      this.$confirm(row.setuproletype === '1' ? '确认要取消BIM负责人吗？' : '确认要设置为BIM负责人吗？').then(() => {
        let formData = new FormData();
        formData.append("userID", row.userID);
        formData.append("setuproletype", row.setuproletype === '1' ? '' : '1');
        formData.append("departmentid", this.currentRow.id);

        request.post('api/Users/Editdepartusertype', formData).then((res) => {
          if (res.code === 1) {
            this.queryData();
            this.$emit('updateDeptList')
            this.$message.success('操作成功');
          }
        })
      })
    },

    async createOrEdit(type, row) {
      if (this.parentPage == "project") {
        // 项目内成员编辑
        let form = {
          IUID: row.iuid,
        };
        let res = await postApi.post(
          "/api/Users/GetProjectUsereditData",
          this.$objectToFormData(form)
        );
        if (res.code == 1) {
          this.currentUser = {
            IUID: row.iuid,
            rolelist: res.data.rolelist.map((item) => parseInt(item)),
          };
          this.memberDialogTitle = "编辑成员";
          this.memberDialogVisible = true;
        }
      } else {
        this.dialogVisible = true;
        this.addform = "";
        if(this.currentRow.isCorp){
          this.currentRow.id = undefined
        }
        // 企业成员管理
        if (type == "add") {
          this.dialogTitle = this.$t('base.button.addPeople');
          this.addform = {
            UserName: "",
            phone: "",
            listDDCorpId: this.currentRow.id ? [this.currentRow.id] : "",
            remarks: "",
            isadministrator: false,
          };
        } else if (type == "edit") {
          this.dialogTitle = this.$t('base.button.editPeople');
          this.addform = {
            IUID: row.iuid,
            UserName: row.userName,
            phone: row.phone,
            remarks: row.remarks,
            listDDCorpId: row.listDDCorpId,
            isadministrator: row.isadministrator,
          };
        }
      }
    },
    cancelCheck(idx) {
      this.checkList.splice(idx, 1);
    },
    async queryMemberData(user) {
      let form = new FormData();
      if (user) {
        form.append("userName", user);
      }
      let res = await postApi.post("/api/Basedepartment/GetAllUser", form);
      if (res.code == 1) {
        this.memberList = res.data;
      }
    },
    async queryCheckedList() {
      let form = new FormData();
      form.append("ProjectIUID", this.ProjectIUID);
      let res = await postApi.post("/api/Users/GetcheckedProjectUser", form);
      if (res.code == 1) {
        this.checkList = res.data;
      }
    },
    // 保存选择的成员
    async saveMember(list) {
      let data = {
        ProjectIUID: this.ProjectIUID,
        UserID: list.map((item) => item.userID),
      };
      let res = await postApi.post("/api/ProjectManagement/ProjectuserAddedit", data);
      if (res.code == 1) {
        this.memberPickerVisible = false;
        this.queryData();
        this.$success(res.msg);
      }
    },
    submit() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          let res = await postApi.post("/api/Users/SaveUser", this.addform);
          if (res.code == 1) {
            this.dialogVisible = false;
            this.$success(res.msg);

            this.$emit("loadDept");
            this.queryData();
          }

          this.submitLoading = false
        }
      });
    },
    handleDelete(row) {
      const h = this.$createElement;
      this.$msgbox({
        type: "warning",
        title: "警告",
        center: true,
        showCancelButton: true,
        message: h("div", null, [
          h("div", null, "你确定要删除此成员吗？"),
          this.parentPage == "project"
            ? null
            : h("div", { style: { marginTop: "10px" } }, "(此操作不可恢复)"),
        ]),
      }).then(async () => {
        if (this.parentPage == "project") {
          // 项目成员删除
          var res = await postApi.post("/api/ProjectManagement/Projectuserdel", [
            row.iuid,
          ]);
        } else {
          // 企业管理成员删除
          var res = await postApi.post("/api/WebAccount/RemoveUser", {
            userId: row.userID,
          });
          this.$emit("loadDept");
        }
        if (res.code == 1) {
          this.queryData();
          this.$success(res.msg);
        }
      });
    },

    resetPassword(row) {
      const h = this.$createElement;
      this.$msgbox({
        type: "warning",
        title: "警告",
        center: true,
        showCancelButton: true,
        message: h("div", null, [
          h("div", null, "你确定要重置此成员密码吗？"),
          this.parentPage == "project"
              ? null
              : h("div", { style: { marginTop: "10px" } }, "(此操作不可恢复)"),
        ]),
      }).then(async () => {
        let formData = new FormData()
        formData.append('userid', row.userID)

        request.post('api/Users/UserResetpassword', formData).then(res => {
          if (res.code == 1) {
            this.$message.success('操作成功')
          }
        })
      });
    }
  },
};
</script>
<style scoped>
.mHover {
  margin: 10px 0;
  cursor: pointer;
}

.mHover:hover {
  color: #409eff;
}
</style>
