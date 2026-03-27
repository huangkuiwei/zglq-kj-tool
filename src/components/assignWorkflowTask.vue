<template>
  <div class="approve-dialog">
    <el-dialog title="指派流程任务" append-to-body :visible="dialogVisible" width="460px" v-dialogDrag :modal="true"
      :show-close="false" :close-on-click-modal="false">
      <el-form label-width="95px" label-position="left">
        <el-form-item label="流程名称：">
          <el-col :span="23">
            <div class="flex jc-between" style="margin-bottom:10px">
              <el-select v-model="currentWorkflow" style="width: 80%;" :popper-append-to-body="false" disabled>
                <el-option v-for="item in workflowList" :key="item.id" :label="item.wfName"
                  :value="item.wfName"></el-option>
              </el-select>
              <el-button @click="toViewWorkflow(currentProject, currentWorkflow)" class="el-icon-view"
                size="small"></el-button>
            </div>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="结束时间：">
          <el-col :span="23">
            <el-date-picker style="width:100%" v-model="taskData.endTime" value-format="yyyy-MM-dd" type="date" disabled></el-date-picker>
          </el-col>
        </el-form-item> -->
        <el-form-item label="下一任务：">
          <el-col :span="23">
            <el-input v-model="taskName" disabled></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="关联文件：">
          <el-col :span="23">
            <el-input type="textarea" :rows="4" v-model="relatedFiles" disabled>
            </el-input>
          </el-col>
        </el-form-item>
        <span style="font-weight: 800; margin:15px; margin-left:5px">指派给:</span>
        <div v-for="(roleItem, idx) in roles" :key="idx">
          <el-form-item :label="roleItem.currentRole" required label-width="200px" size="normal">
            <el-select style="margin-bottom:10px; width:190px;float: right;" v-model="roleItem.current"
              :popper-append-to-body="false" collapse-tags :placeholder="$t('base.button.pleaseSelect')" multiple value-key="userID">
              <el-option v-for="(item, index) in roleItem.roleNameList" :key="item.userID" :label="item.userName"
                :value="item"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!--el-button @click="closeDialog" size="small">{{ $t('base.button.cancel') }}</el-button-->
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
import fileApi from "@/api/project/file.js";
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
    taskData: {
      type: Object,
      default: null,
    },
    parentClose: {
      type: Function,
      default: null
    },
    close: {
      type: Function,
      default: null
    },
    reload: {
      type: Function,
      default: null
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
      currentProject: '',
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
      immediate: false,
      async handler(val) {
        if (val) {
          await this.initDialog()
          this.workflowList = [];
          this.currentWorkflow = '';
          await this.getAllWorkflows();
          await this.getNextTask();
        }
      }
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
  methods: {
    // 得到当前此项目所有的工作流
    async getAllWorkflows() {
      let queryForm = new FormData();
      queryForm.append('projectId', this.taskData.projectId)
      var res = await projectFileApi.post('/api/Workflow/getWorkflowList', queryForm);
      if (res.code == 1) {
        this.workflowList = res.data;
        this.currentWorkflow = this.taskData.wfName;
        this.currentProject = this.taskData.projectId;
      }
    },
    async getNextTask() { // 得到第一个任务节点
      this.taskName = this.taskData.taskName;
      this.taskID = this.taskData.taskID;
      var roleIDs = this.taskData.roleIDs;
      await this.getAllUsersOfRole(roleIDs);
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
      this.roles = [];
      if (!roleIDs || roleIDs.length == 0 || roleIDs[0].roleID == 'none') return
      for (var i = 0; i < roleIDs.length; i++) {
        let queryForm = new FormData();
        queryForm.append('roleID', roleIDs[i].roleID);
        queryForm.append('ProjectIUID', this.taskData.projectId)
        var res = await projectFileApi.post('/api/Permission/GetUserDataByRole', queryForm);
        if (res.code == 1) {
          var role = {
            currentRole: '',
            roleNameList: [],
            current: []
          };
          var depName = await this.getDepartmentName(roleIDs[i].roleID);
          role.currentRole = !!roleIDs[i].roleName ? roleIDs[i].roleName : roleIDs[i].roleUserName;
          if (depName != "") role.currentRole += '【' + depName + '】';
          role.roleNameList = res.data;

          this.roles.push(role);
        }
      }
    },
    async initDialog() {
      this.workflowList = [];
      this.currentWorkflow = '';
      await this.getAllWorkflows();
      await this.getNextTask();
      var allFiles = '';
      for (var i = 0; i < this.taskData.relatedFiles.length; i++) {
        allFiles += "☑ " + this.taskData.relatedFiles[i].item.fileName;
        if (i != this.taskData.relatedFiles.length - 1) allFiles += '\n';
      }
      this.relatedFiles = allFiles;
    },
    //
    async saveAppliedWorkflow() {
      if (this.roles.map(item => item.current.length).indexOf(0) >= 0) {
        this.$message({
          message: '请选择指派人员',
          type: "warning",
        });
        return;
      } else {
        this.loading = true
        var allFiles = "";
        for (var i = 0; i < this.taskData.relatedFiles.length; i++) {
          allFiles += this.taskData.relatedFiles[i].item.iuid;
          if (i != this.taskData.relatedFiles.length - 1) allFiles += ';';
        }
        for (var i = 0; i < this.roles.length; i++) {
          this.roles[i].current.forEach(async (item) => {
            await this.startWorkflow(item, allFiles);
          })
        }
        // let paylod = new FormData()
        // paylod.append('taskID', this.taskID);
        // paylod.append('ID', this.taskData.workflowId);
        // await fileApi.Processpassing(paylod)
        this.loading = false
        this.closeDialog();
        this.$emit('reload'); // 重新读入所有工作流刷新列表
        this.$emit('parentClose', 1)
      }
    },
    // 同时在流程流转表中生成记录
    async startWorkflow(role, allFiles) { // 启动流程流转
      let data = new FormData();
      data.append('projectiuid', this.taskData.projectId);
      data.append('ID', this.taskData.workflowId); // 流程发起的记录ID
      data.append('workflowName', this.taskData.wfName);
      data.append('workflowGuid', this.taskData.wfID); //workflow.wfCode);   // 这个可能带版本信息
      data.append('taskName', this.taskName);
      data.append('taskID', this.taskID);
      data.append('undertaker', role.userID);
      data.append('relatedFiles', allFiles);
      data.append('endTime', this.taskData.endTime); // 指定完成时间
      data.append('fulfilTime', ''); // 实际完成时间
      data.append('opinion', ''); // 指定的当前任务
      data.append('resulttext', ''); // 指派的人（可能多个？）
      var res = await projectFileApi.post("/api/projectworkflow/workflowPathTableAddEdit", data);
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
