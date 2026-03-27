<template>
  <div class="approve-dialog">
    <el-dialog title="发起分享流程" :visible="dialogVisible" width="455px" v-dialogDrag :modal="true"
      :close-on-click-modal="false" @close='closeDialog'>
      <el-form label-width="95px" label-position="left">
        <!--<el-form-item label="流程名称：" required>-->
        <!--  <el-col :span="23">-->
        <!--    <div class="flex jc-between">-->
        <!--      <el-select class="grow" style="margin-right: 10px;" v-model="currentWorkflow" :popper-append-to-body="false"-->
        <!--        :placeholder="$t('base.button.pleaseSelect')" @change="handleSearch">-->
        <!--        <el-option v-for="item in workflowList" :key="item.id" :label="item.wfName" :value="item.wfName">-->
        <!--        </el-option>-->
        <!--      </el-select>-->
        <!--      <el-button @click="toViewWorkflow(currentProject, currentWorkflow)" class="el-icon-view"-->
        <!--        size="small"></el-button>-->
        <!--    </div>-->
        <!--  </el-col>-->
        <!--</el-form-item>-->
        <!--<el-form-item label=" 起始任务：">-->
        <!--  <el-col :span="23">-->
        <!--    <el-input v-model="taskName" disabled>-->
        <!--    </el-input>-->
        <!--  </el-col>-->
        <!--</el-form-item>-->
        <!--<el-form-item label=" 关联文件：">-->
        <!--  <el-col :span="23">-->
        <!--    <el-input type="textarea" :rows="4" v-model="relatedFiles" disabled>-->
        <!--    </el-input>-->
        <!--  </el-col>-->
        <!--</el-form-item>-->
        <template v-if="roles.length > 0">
          <!--<span style="font-weight: 800; margin:15px 0 15px 5px;display: block;">指派给:</span>-->
          <div v-for="(roleItem, k) in roles">
            <el-form-item :label="roleItem.currentRole" required label-width="200px" size="normal">
              <el-select style="margin-bottom:10px; width:190px;float: right;" v-model="roleItem.current"
                :popper-append-to-body="false" collapse-tags :placeholder="$t('base.button.pleaseSelect')" multiple value-key="userID">
                <el-option v-for="(item, index) in roleItem.roleNameList" :key="item.userID" :label="item.userName"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="small">{{ $t('base.button.cancel') }}</el-button>
        <el-button type="primary" :disabled="validateSubmit" :loading="loading" @click="saveAppliedWorkflow"
          size="small">{{ $t('base.button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <WorkflowViewDialog :dialogVisible.sync="workflowManagementDialogVisible" :workflowName='currentWorkflow'
      :projectId='currentProject'>
    </WorkflowViewDialog>
  </div>
</template>
<script>
import projectFileApi from "@/api/document/indexApi.js";
import WorkflowViewDialog from "@/views/SystemSetting/workflowManagement/workflowViewDialog";
export default {
  components: {
    WorkflowViewDialog
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    currentProject: {
      type: String,
      default: '',
      required: true
    },
    refresh: {
      type: Function
    },
    rowData: {
      type: Array,
      default: null,
    },
    shareId: {
      type: String,
    }
  },
  data() {
    return {
      loading: false,
      projectUserNames: null,
      companyMemberDialogVisible: false,
      companyMemberChecked: [],
      companyPersonData: [],
      endTime: null,
      workflowList: [], // 全部流程
      currentWorkflow: '', // 当前流程名称
      taskName: '', // 当前流程的第一个任务名称
      taskID: '', // 当前流程的第一个任务ID
      roles: [],
      relatedFiles: '',
      workflowManagementDialogVisible: false,
    };
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val) {
          this.initDialog()
        }
      },

      immediate: true
    }
  },
  computed: {
    validateSubmit() {
      console.log(this.workflowList.length == 0);
      console.log(this.roles.length == 0);
      console.log(this.roles.map(item => item.current.length).indexOf(0) >= 0);
      if (this.workflowList.length == 0) {
        return true
      } else if (
        this.roles.length == 0 || this.roles.map(item => item.current.length).indexOf(0) >= 0
      ) {
        return true
      } else {
        return false
      }
    },
  },
  async created() {
    this.workflowList = [];
    this.currentWorkflow = '';
    await this.getAllWorkflows();
    if (this.workflowList.length > 0) this.currentWorkflow = this.workflowList[0].wfName;
  },
  methods: {
    // 得到当前此项目所有的工作流
    async getAllWorkflows() {
      let queryForm = new FormData();
      queryForm.append('type', 'all')
      queryForm.append('projectId', this.currentProject)
      queryForm.append('wfname', '分享审批')
      var res = await projectFileApi.post('/api/Workflow/getWorkflowList', queryForm);
      if (res.code == 1) {
        this.workflowList = res.data;
      }
    },
    getCurrentWorkflowId() {
      for (var i = 0; i < this.workflowList.length; i++) {
        if (this.workflowList[i].wfName == this.currentWorkflow) {
          return this.workflowList[i].id;
        }
      }
    },
    async handleSearch() {
      this.roles = []
      for (var i = 0; i < this.workflowList.length; i++) {
        if (this.workflowList[i].wfName == this.currentWorkflow) {
          await this.getFirstTask(i);
          break;
        }
      }
    },
    async getFirstTask(i) { // 得到第一个任务节点
      // if(!this.workflowList[i].firstStepID) return;
      if (this.workflowList.length == 0) return;
      let queryForm = new FormData();
      queryForm.append('WfID', this.workflowList[i].id);
      queryForm.append('ID', this.workflowList[i].firstStepID);
      var res = await projectFileApi.post('/api/Workflow/GetWfStepList', queryForm);
      if (res.code == 1 && res.data.length != 0) {
        this.taskName = res.data[0].name;
        this.taskID = res.data[0].id;
        var roleIDs = res.data[0].roleIDs;
        await this.getAllUsersOfRole(roleIDs);
      } else if (res.data.length == 0) {
        // 流程无起始任务
        this.$error('此流程任务配置有误，请联系管理员调整')
      }
    },
    async getDepartmentName(roleID) {
      var name = "";
      var formData = new FormData();
      formData.append('roleID', roleID);
      var res = await projectFileApi.get("/api/Permission/GetSpecialtyDataByRole");
      if (res.code == 1) {
        if (res.data.length > 0) name = res.data[0].specialtyName;
      }
      return name;
    },
    async getAllUsersOfRole(roleIDs) {
      if (!roleIDs || roleIDs.length == 0 || roleIDs[0].roleID == 'none') {
        this.$error('此流程未指派角色，请联系管理员调整')
        return
      } else {
        this.roles = [];
        for (var i = 0; i < roleIDs.length; i++) {
          let queryForm = new FormData();
          queryForm.append('roleID', roleIDs[i].roleID);
          queryForm.append('ProjectIUID', this.currentProject);
          var res = await projectFileApi.post('/api/Permission/GetUserDataByRole', queryForm);
          if (res.code == 1) {
            if (res.data.length == 0) {
              this.$error('此流程指派角色有误，请联系管理员调整')
              this.$emit('update:dialogVisible', false)
              return
            } else {
              var role = {
                currentRole: '',
                roleNameList: [],
                current: []
              };
              var depName = await this.getDepartmentName(roleIDs[i].roleID);
              // role.currentRole = roleIDs[i].roleName;
              role.currentRole = !!roleIDs[i].roleName ? roleIDs[i].roleName : roleIDs[i].roleUserName;
              if (depName != "") role.currentRole += '【' + depName + '】';
              role.roleNameList = res.data;
              this.roles.push(role);
            }
          }
        }
      }
    },
    async initDialog() {
      this.workflowList = [];
      this.currentWorkflow = '';
      await this.getAllWorkflows();
      if (this.workflowList.length > 0) this.currentWorkflow = this.workflowList[0].wfName;
      await this.getFirstTask(0);
      var allFiles = '';
      for (var i = 0; i < this.rowData.length; i++) {
        allFiles += "☑ " + this.rowData[i].fileName;
        if (i != this.rowData.length - 1) allFiles += '\n';
      }
      this.relatedFiles = allFiles;
    },
    // 保存工作流到项目工作流表中(流程发起表)
    async saveAppliedWorkflow() {

      if (this.roles.map(item => item.current.length).indexOf(0) >= 0) {
        this.$error('请选择指派人员')
        return
      } else {
        this.loading = true
        for (var i = 0; i < this.workflowList.length; i++) {
          if (this.workflowList[i].wfName == this.currentWorkflow) {
            break;
          }
        }
        let workflow = this.workflowList[i];
        let data = new FormData();
        data.append('iuid', '');
        data.append('mainiuid', this.shareId);
        data.append('projectiuid', this.currentProject);
        data.append('workflowName', this.workflowList[i].wfName);
        data.append('workflowGuid', this.workflowList[i].wfCode); // 这个可能带版本信息
        var allFiles = "";
        for (var i = 0; i < this.rowData.length; i++) {
          allFiles += this.rowData[i].iuid;
          if (i != this.rowData.length - 1) allFiles += ';';
        }
        data.append('relatedFiles', allFiles);
        data.append('endTime', this.endTime); // 指定完成时间
        data.append('finishTime', ''); // 实际完成时间
        data.append('taskName', this.taskName); // 指定的当前任务
        var allUserIDs = [];
        var allUserNames = [];
        this.roles.forEach(rolesItem => {
          rolesItem.current.forEach(currentItem => {
            if (allUserIDs.indexOf(currentItem.userID) < 0) {
              allUserIDs.push(currentItem.userID)
            }
            if (allUserNames.indexOf(currentItem.userName) < 0) {
              allUserNames.push(currentItem.userName)
            }
          })
        })
        data.append('userID', allUserIDs.join(';')); // 指派的人（可能多个？）
        data.append('userName', allUserNames.join(';'));
        data.append('status', '1');
        data.append('module', 'share');
        var res = await projectFileApi.post("/api/Workflow/MainworkflowAdd", data);
        if (res.code == 1) {
          for (var i = 0; i < this.roles.length; i++) {
            this.roles[i].current.forEach(async (item) => {
              await this.startWorkflow(res.twodata, workflow, item, allFiles);
            })
          }
          // let paylod = new FormData()
          // paylod.append('taskID', this.taskID);
          // paylod.append('ID', res.twodata);
          // await fileApi.Processpassing(paylod)
          this.$emit('refresh'); // 刷新列表
          this.$emit('reload'); // 重新读入所有工作流刷新列表
          this.closeDialog();
        }
        setTimeout(() => {
          this.loading = false
        }, 200);
      }
    },
    // 同时在流程流转表中生成记录
    async startWorkflow(workflowIuid, workflow, role, allFiles) { // 启动流程流转
      let data = new FormData();
      data.append('projectiuid', this.currentProject);
      data.append('ID', workflowIuid); // 流程发起的记录ID
      data.append('workflowName', workflow.wfName);
      data.append('workflowGuid', this.getCurrentWorkflowId()); //workflow.wfCode);   // 这个可能带版本信息
      data.append('taskName', this.taskName);
      data.append('taskID', this.taskID);
      data.append('undertaker', role.userID);
      data.append('relatedFiles', allFiles);
      data.append('endTime', this.endTime); // 指定完成时间
      data.append('fulfilTime', ''); // 实际完成时间
      data.append('opinion', ''); // 指定的当前任务
      data.append('resulttext', ''); // 指派的人（可能多个？）
      var res = await projectFileApi.post("/api/Workflow/MainworkflowPathTableAddEdit", data);
      if (res.code == 1) {
        this.$message({
          message: '校审请求已发送至' + role.userName,
          type: "success",
        });
      }
    },
    async closeDialog() {
      this.$emit("update:dialogVisible", false)
    },
    toViewWorkflow(projectId, workflowName) {
      this.workflowManagementDialogVisible = true;
    },
  }
};
</script>

<style>.approve-dialog .el-form-item__label::before {
  margin-left: -9px;
}</style>