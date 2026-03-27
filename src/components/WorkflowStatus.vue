<template>
  <div style="display: flex">
    <div v-for="(item, index) in allWorkflows">
      <!-- closable @close="handleClose(item)" 删除功能 -->
      <el-tag size="small" type="success" class="workflow" @click="toViewWorkflow(item)">{{ item.workflowName }}</el-tag>
    </div>
    <WorkflowInfoManagement :projectId="projectId" :dialogVisible.sync="workflowVisible" :workflowIuid="currentWorkflowIuid" ref="workflowInfoManagements"></WorkflowInfoManagement>
  </div>
</template>


<script>
import WorkflowInfoManagement from "@/views/teamwork/workflowInfoManagement";
import projectFileApi from "@/api/document/indexApi.js";

export default {
  props: {
    scope: {
      type: Object,
      default: null
    },
    workflows: {        // 当前项目已发起的全部工作流
      type: Array,
      default: null
    },
    projectId: {
      type: String,
      default: ''
    }
  },
  components: {
    WorkflowInfoManagement,
  },
  data() {
    return {
      allWorkflows: [],   // 当前文件已发起的所有流程
      workflowVisible: false,
      currentWorkflow: '',
      currentWorkflowIuid: '',
    };
  },
  mounted() {
    this.getWorkflow();
  },
  methods: {
    getWorkflow() {   // 得到当前文件包含的工作流程
      this.allWorkflows = [];
      for (var i = 0; i < this.workflows.length; i++) {
        if (!this.workflows[i].relatedFiles) continue;
        if (this.workflows[i].relatedFiles.includes(this.scope.row.iuid)) {
          this.allWorkflows.push(this.workflows[i]);
        }
      }
    },

    toViewWorkflow(row) {
      console.log(row);
      this.workflowVisible = true;
      this.currentWorkflow = row.workflowName;
      this.currentWorkflowIuid = row.iuid;
    },

    // 删除已发起的流程
    async handleClose(item) {
      this.$confirm("确定要删除<" + `${item.workflowName}` + ">吗？").then(async () => {
        let postData = [];
        postData.push({ IUID: item.iuid });
        var res = await projectFileApi.post('/api/projectworkflow/projectworkflowdelete', postData);
        if (res.code == 1) {
          var index = this.allWorkflows.indexOf(item);
          if (index != -1) this.allWorkflows.splice(index, 1);
          this.$success(res.msg)
        }
      })
    },
  }
};
</script>

