<template>
<div>
  <el-table key='wf' :data="tableData" :height="'calc(100vh - 352px)'" :show-overflow-tooltip='true' class="wf-table"
    :header-cell-style="$thStyle" cell-class-name="cellStyle" :stripe="true" border>
    <!-- <el-table-column :label="$t('base.button.index')" align="center" type="index" width='60px' /> -->
    <el-table-column prop="projectName" show-overflow-tooltip :label="$t('leftNavs.projects')" align="left">
      <template slot-scope="scope">
        <el-link class="task-file " @click="linkToFilePage(scope.row)" :underline="false"
          style="font-size:14px !important;">
          {{ scope.row.projectName }}
        </el-link>
      </template>
    </el-table-column>
    <el-table-column prop="workflowName" :label="$t('teamwork.workflow.name')" align="center">
      <template slot-scope="scope">
        <div style="cursor: pointer" @click="toViewWorkflow(scope.row.projectiuid, scope.row.workflowName)">
          <span>{{ scope.row.workflowName }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('teamwork.workflow.file')" min-width="200" align="left">
      <template slot-scope="scope">
        <div v-if="relatedFiles.length > scope.$index && relatedFiles[scope.$index].files">
          <div class="flex" v-for="(file, idx) in relatedFiles[scope.$index].files" :key="file.iuid" v-if="idx == 0">
            <fileIconComponends :row="file.item" />
            <template v-if="relatedFiles[scope.$index].files.length > 1">
              <div class="grow" style="word-break: keep-all;margin-left: 5px;font-size: 13px;">等{{
                relatedFiles[scope.$index].files.length }}个文件</div>
            </template>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="applyPersonName" :label="$t('teamwork.workflow.person')" width="80px" align="center">
    </el-table-column>
    <el-table-column prop="applyTime" :label="$t('teamwork.workflow.time')" width="160px" align="center">
    </el-table-column>
    <el-table-column prop="status" :label="$t('base.formLabel.status')" align="center" width="80px">
      <template slot-scope="scope">
        <div style="display:flex;justify-content: center;font-size: 14px;">
          <div class="blue" v-if="scope.row.status == '1'">已发起</div>
          <div class="yellow" v-if="scope.row.status == '2'">审批中</div>
          <div class="red" v-if="scope.row.status == '4'">待修改</div>
          <div class="gray" v-if="scope.row.status == '3'">已撤回</div>
          <div class="green" v-if="scope.row.status == '0'">已通过</div>
          <div class="red" v-if="scope.row.status == '5'">已拒绝</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="operation" :label="$t('base.formLabel.operation')" align="center" width="200">
      <template slot-scope="scope">
        <div class="operationVid">
          <el-button type="text" @click="toWorkflowDetail(scope.row.projectiuid, scope.row.iuid, scope.row)">{{$t('base.button.detail')}}</el-button>
          <!-- <el-button type="text" class="yellow"  @click="" v-if="scope.row.status=='2'">催办</el-button> -->
          <!-- <el-button type="text" @click="" v-if="scope.row.status=='0'">报表</el-button> -->
          <el-button type="text"
            @click="$emit('showApproveDetail', scope.row.iuid, relatedFiles[scope.$index], scope.row)">{{$t('teamwork.workflow.sheet')}}</el-button>
          <el-button type="text" @click="handleDeleteWorkflow(scope.row)" v-if="scope.row.isadministrator"
            class="red">{{ $t('base.button.delete') }}</el-button>
        </div>
      </template>
    </el-table-column>
    <WorkflowInfoManagement :dialogVisible.sync="workflowDialogVisible" :workflowIuid='workflowIuid'
      :projectId="projectId" ref="workflowInfoManagements"></WorkflowInfoManagement>
    <workflowViewDialog :dialogVisible.sync="workflowViewDialogVisible" :workflowName='workflowName'
      :projectId="projectId" :isedit="false">
    </workflowViewDialog>
  </el-table>
  <pagination :pageTotal="total"
            :pageIndex="pageIndex"
            :pageNumber="pageNumber"
            @handleSizeChange="paginationSizeChange"
            @handleCurrentChange="paginationCurrentChange" />
</div>
</template>
<script>

import documentFileApi from "@/api/document/indexApi.js";
import fileIconComponends from "@/components/fileIcon";
import WorkflowInfoManagement from "@/views/teamwork/workflowInfoManagement.vue";
import pagination from "@/components/pagination/index";
import workflowViewDialog from "@/views/SystemSetting/workflowManagement/workflowViewDialog.vue";
import request from '@/utils/request'
export default {
  nameL: "workflowList",
  props: {
    searchForm: {
      type: Object
    },
    modeler: {
      type: Object,
      required: false
    },
    queryApproveCount: {
      type: Function
    },
    showApproveDetail: {
      type: Function
    },
    getAllTasks: {
      type: Function
    }
  },
  components: {
    fileIconComponends,
    WorkflowInfoManagement,
    workflowViewDialog,
    pagination
  },
  data() {
    return {
      isEditable: false,
      tableData: [],
      pageIndex: 1,
      pageNumber: 10,
      relatedFiles: [],
      total: 0,
      workflowDialogVisible: false,
      workflowIuid: '',
      workflowViewDialogVisible: false,
      workflowName: '', // 流程定义workflowName
      projectId: ''
    };
  },
  watch: {
    searchForm: {
      deep: true,
      handler(e) {
        this.pageIndex = 1
        this.loadWorkflowList()
      },
    }
  },
  async mounted() {
    await this.loadWorkflowList();
  },
  methods: {
    paginationSizeChange(val) {
      this.pageNumber = val;
      this.loadWorkflowList();
    },
    paginationCurrentChange(val) {
      this.pageIndex = val;
      this.loadWorkflowList();
    },
    async loadWorkflowList() {
      this.tableData = [];
      let data = new FormData();
      if (this.searchForm.startTimeRange == null) {
        this.searchForm.startTimeRange = []
      }
      if (this.searchForm.endTimeRange == null) {
        this.searchForm.endTimeRange = []
      }
      data.append('projectiuid', "");
      data.append('projectName', this.searchForm.projectName);
      data.append('applyPersonName', this.searchForm.userName);
      data.append('typedata', this.searchForm.typedata);
      data.append('starttime', this.searchForm.startTimeRange[0] || '');
      data.append('endtime', this.searchForm.startTimeRange[1] || '');
      data.append('fulfiltime', this.searchForm.endTimeRange[0] || '');
      data.append('fulfilendtime', this.searchForm.endTimeRange[1] || '');
      data.append("page", this.pageIndex);
      data.append("rows", this.pageNumber);
      var res = await documentFileApi.post("/api/projectworkflow/projectworkflowData", data); // 流程发起表中的数据
      this.relatedFiles = [];
      if (res.code == 1) {
        this.tableData = res.data;
        this.total = res.count
        for (var j = 0; j < res.data.length; j++) {
          var files = [];
          var idStrs = (!res.data[j].relatedFiles) ? "" : res.data[j].relatedFiles.split(";");
          for (var k = 0; k < idStrs.length; k++) {
            files.push({
              iuid: idStrs[k],
              item: null
            });
          }
          await this.getItem(res.data[j].projectiuid, files);
          this.relatedFiles.push({
            files: files
          });
        }
        // console.log(this.relatedFiles);
      }
    },
    // 得到文件路径
    async getItem(projectId, files) {
      for (var i = 0; i < files.length; i++) {
        var item = null;
        var url = "/api/ProjectManagement/GetMasterfileData?IUID=" + projectId + '&FileIUID=' + files[i].iuid;
        var res = await documentFileApi.post(url);
        if (res.code == 1) {
          files[i].item = {
            ...res.data,
            actionType: '2',
            statusType: '3'
          };
          files[i].item.lookbit = true;
          files[i].item.fileSuffix = files[i].item.fileSuffix || ''

          if (files[i].item.fileSuffix && this.$ibimFileSuffix.indexOf(files[i].item.fileSuffix.toLowerCase()) > -1) // bim文件
            files[i].item.filePath = files[i].item.turnPath;
          else {
            files[i].item.fileType = "1"; // 未知原因，YGP
          }
        } else files[i].item = null;
      }
    },
    toWorkflowDetail(projectId, workflowIuid, row) {
      this.projectId = projectId;
      this.workflowDialogVisible = true;
      this.workflowIuid = workflowIuid;

      // 日志
      let formData = new FormData();
      formData.append('Filename', row.relatedFilesName)
      formData.append('projectname', row.projectName)
      formData.append('logtype', 'xsdata_check')

      request.post('api/Log/AddFileviewing', formData)
    },
    toViewWorkflow(projectId, workflowName) {
      this.workflowViewDialogVisible = true;
      this.projectId = projectId;
      this.workflowName = workflowName;
    },
    async linkToFilePage(row) {
      // localStorage.setItem('projectInfo', JSON.stringify(row))
      this.$router.push({
        path: '/projectFile',
        query: {
          projectId: row.projectiuid,
          projectName: row.projectName,
          projectIsPictureMode: false,
          path: ''
        }
      })
    },
    // 删除已发起的流程
    async handleDeleteWorkflow(item) {
      this.$confirm("确定要删除<" + `${item.workflowName}` + ">吗？").then(async () => {
        let postData = [];
        postData.push({
          IUID: item.iuid
        });
        var res = await documentFileApi.post('/api/projectworkflow/projectworkflowdelete', postData);
        if (res.code == 1) {
          this.loadWorkflowList()
          this.$emit('getAllTasks')
          this.$emit('queryApproveCount')
          // var index = this.tableData.indexOf(item);
          // if (index != -1) this.tableData.splice(index, 1);
        }
      })
    },
  }
}
</script>
<style lang="scss"
       scoped>
      .redCircle {
        width: 10px;
        height: 10px;
        margin: 5px;
        margin-top: 6px;
        margin-left: 20px;
        border: 1px solid #FF3300;
        background-color: #FF3300;
        border-radius: 5px;
      }

      .task-file {
        width: 100%;
        font-size: 14px !important;
        font-weight: 400 !important;
        margin-right: 10px;

        ::v-deep span {
          display: inline-block;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      ::v-deep .el-table {
        td {
          &.cellStyle {
            padding: 0;
            height: 48px;
            line-height: 1.5;
          }
        }
      }

      ::v-deep .el-table {
        // max-height: 500px;
        // overflow-y: scroll;
        // height: calc(55vh - 130px);

        &::before {
          height: 0px !important;
        }
      }

      .wf-table {
        // margin-left: 6px;
        width: calc(100% - 20px);
        margin: 0 10px;
        font-size: 14px;

        :v-deep() .el-table__cell {
          padding: 0 !important;
        }

        .wrap {
          .lf {
            a {
              padding: 0
            }
          }
        }
      }

      .operationVid {
        display: flex;
        justify-content: center;
      }

      .red {
        color: #F56C6C;
        font-weight: 500
      }

      .green {
        color: #33CC99;
        font-weight: 500
      }

      .gray {
        color: gray;
        font-weight: 500
      }

      .blue {
        color: #409eff;
        font-weight: 500
      }

      .yellow {
        color: #FF9900;
        font-weight: 500
      }
    </style>
