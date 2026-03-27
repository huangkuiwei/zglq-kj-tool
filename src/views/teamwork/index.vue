<template>
  <el-container :style="{ 'min-height': 'calc(100vh - 51px)' }" style="display: flex">
    <mainSideMenu />
    <div class="flex jc-between teamwork">
      <div style="width: calc(100vw - 420px)">
        <div style="margin:15px 10px;font-size: 15px;font-weight: bold;">{{ $t('teamwork.title') }}</div>
        <div class="flex jc-between" style="width: 100%;height: 150px;padding: 0 10px;">
          <div class="count-item">
            <div class="count-title">{{ $t('teamwork.approve.todo') }}</div>
            <div class="flex ai-end jc-center count-box">
              <div class="count">{{ approveCount.mytodoint }}</div>
              <div>条</div>
            </div>
          </div>
          <!-- 我发起的 -->
          <div class="count-item">
            <div class="count-title">{{ $t('teamwork.approve.initiated') }}</div>
            <div class="flex ai-end jc-center count-box">
              <div class="count">{{ approveCount.mystartint }}</div>
              <div>条</div>
            </div>
          </div>
          <div class="count-item">
            <div class="count-title">{{ $t('teamwork.approve.received') }}</div>
            <div class="flex ai-end jc-center count-box">
              <div class="count">{{ approveCount.mypartakeint }}</div>
              <div>条</div>
            </div>
          </div>

          <div class="count-item">
            <div class="count-title">{{ $t('teamwork.approve.all') }}</div>
            <div class="flex ai-end jc-center count-box">
              <div class="count">{{ approveCount.allint }}</div>
              <div>条</div>
            </div>
          </div>
        </div>
        <div class="flex ai-center jc-between" style="margin: 10px;">
          <div class="tabs">
            <el-tag style="cursor:pointer;margin-right: 10px;" v-for="(item, idx) in taskType" :key="item.type" :type="item.act ? 'primary' : 'info'" size="" @click="handleTypeChange(idx)">{{ item.type == 'all' ? $t('teamwork.approve.all') : item.type == 'my' ? $t('teamwork.approve.initiated') : item.type == 'join' ? $t('teamwork.tag.joinIn') : '' }}</el-tag>
          </div>
          <div class="flex ai-center">
            <el-input v-model="searchForm.projectName" :placeholder="$t('base.label.searchProject')" prefix-icon="el-icon-search" size="small" style="width: 180px;margin-right: 10px;" clearable @change=""></el-input>
            <el-input v-model="searchForm.userName" :placeholder="$t('base.label.searchPeople')" prefix-icon="el-icon-search" size="small" style="width: 180px;margin-right: 10px;" clearable @change=""></el-input>
            <el-popover placement="bottom-end" v-model="showTimeRange" title="时间范围" trigger="click">
              <el-form :model="searchForm" ref="form" label-width="100px" :inline="false" label-suffix=":" size="small">
                <el-form-item label="提交审批时间">
                  <el-date-picker v-model="searchForm.startTimeRange" value-format="yyyy-MM-dd" style="width:240px" type="daterange" size="small" :startPlaceholder="$t('base.button.pleaseSelect')" :endPlaceholder="$t('base.button.pleaseSelect')"></el-date-picker>
                </el-form-item>
                <el-form-item label="完成审批时间">
                  <el-date-picker v-model="searchForm.endTimeRange" value-format="yyyy-MM-dd" style="width:240px" type="daterange" size="small" :startPlaceholder="$t('base.button.pleaseSelect')" :endPlaceholder="$t('base.button.pleaseSelect')"></el-date-picker>
                </el-form-item>
                <div class="flex ai-center jc-between">
                  <el-button type="text" size="small" @click="clearTime">清空搜索条件</el-button>
                  <div>
                    <el-button size="small" type="primary" @click="getAllTasks(); showTimeRange = false">{{ $t('base.button.search') }}</el-button>
                  </div>
                </div>
              </el-form>
              <el-button slot="reference" size="small">{{ $t('base.label.timeFiltering') }}</el-button>
            </el-popover>
          </div>
        </div>
        <div class="flex ai-center">
          <div class="counts" v-for="item in counts" :key="item.name">
            <div class="count-title">{{ item.name }}</div>
            <div class="count-info">
              <span class="count">{{ item.count }}</span>条
            </div>
          </div>
        </div>
        <WorkflowList @getAllTasks="getAllTasks" @queryApproveCount='queryApproveCount' :searchForm="searchForm" @showApproveDetail="showApproveDetail" ref="workflowList" />
      </div>
      <div class="rt">
        <template v-if="tasks.length == 0">
          <div class="flex ai-center jc-center" style="font-size: 12px;color: #999;margin-top: 45px;">
            {{ $t('base.button.noProofreadingData') }}
          </div>
        </template>

        <template v-else>
          <div class="count">{{ $t('projects.label.pendingApproval') }}<span style="color: #ed1c24;">：{{ tasks.length }}</span></div>
          <div class="task-list hide-scroll">
            <div class="task-block" v-for="(item, idx) in tasks" :key="idx">
              <div class="task-title flex ai-center">
                <span style="width:70%;">{{ `${item.wfName}` }}</span>
                <div style="margin-left: auto;">
                  <el-button plain v-if="approveStatus == '待审批' && item.status == 0" type="primary" size="mini" @click="showApproveDetail(item.workflowId, item)">{{ $t('base.label.approval') }}</el-button>
                  <el-button plain v-else-if="approveStatus == '待审批' && item.status == -1" type="primary" size="mini" @click="showApproveDetail(item.workflowId)">{{ $t('base.button.view') }}</el-button>
                  <el-button plain v-else-if="approveStatus == '待审批' && item.status == -2" type="primary" size="mini" @click="showApproveDetail(item.workflowId)">{{ $t('base.button.view') }}</el-button>
                  <el-button plain v-else type="success" size="mini" @click="showApproveDetail(item.workflowId)">详情</el-button>
                </div>
              </div>
              <div class="task-apply">
                <span style="width:84px;font-family: SimHei">{{ $t('projects.label.projectName') }}:</span>
                <span>{{ item.projectName }}</span>
              </div>
              <div class="task-apply">
                <span style="width:84px;font-family: SimHei">{{ item.status == 0 ? $t('teamwork.workflow.person') : $t('base.button.approver') }}:</span>
                <span>{{ item.apply }}</span>
              </div>
              <!--<div class="task-apply">-->
              <!--  <span style="width:64px;font-family: SimHei">流程名称:</span>-->
              <!--  <span>{{ item.wfName }}</span>-->
              <!--</div>-->
              <div class="task-apply">
                <span style="width:84px;font-family: SimHei">{{ $t('base.button.submitTime') }}:</span>
                <span>{{ item.applyTime }}</span>
              </div>

              <div class="task-file" v-if="item.fileexportname">
                <div class="fileTypeIcon flex ai-center">
                  <svg class="tableLinkIcon" aria-hidden="true">
                    <use xlink:href="#icon-weizhiwenjian"></use>
                  </svg>

                  <div class="fileIconName hover">
                    {{ item.fileexportname }}
                  </div>
                </div>
              </div>

              <template v-else>
                <div class="task-file" v-for="(file) in item.attachFiles">
                  <fileIconComponends :row="file.item" />
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="sideWindow" v-show="showDetail && module !== 'share' && module !== 'download'" :style="{ right: showDetail ? 0 : '-70vw' }">
      <approve-detail :module="module" :approveId="approveId" v-if="showDetail" @queryApproveCount='queryApproveCount' :showDetail.sync="showDetail" @getAllTasks="getAllTasks" @loadWorkflowList="loadWorkflowList"></approve-detail>
    </div>
    <div class="mask" @click="showDetail = false" v-show="showDetail && module !== 'share' && module !== 'download'"></div>

    <!--<el-dialog append-to-body :visible.sync="submitVisible" width="450px" title="审批结果">-->
    <!--  <el-form class="approve-form">-->
    <!--    <el-form-item label="审批结果：">-->
    <!--      <el-radio-group v-model="approveResult">-->
    <!--        <el-radio :label="1">同意</el-radio>-->
    <!--        <el-radio :label="2">不同意</el-radio>-->
    <!--      </el-radio-group>-->
    <!--    </el-form-item>-->
    <!--    <el-form-item label="审批意见：">-->
    <!--      <el-input type="textarea" :rows="4" placeholder="请输入审批意见" v-model="approveOpinion" />-->
    <!--    </el-form-item>-->
    <!--  </el-form>-->

    <!--  <template slot="footer" class="dialog-footer">-->
    <!--    <el-button @click="submitVisible = false" size="small">{{ $t('base.button.cancel') }}</el-button>-->
    <!--    <el-button type="primary" @click="submitResult" size="small">{{ $t('base.button.confirm') }}</el-button>-->
    <!--  </template>-->
    <!--</el-dialog>-->
  </el-container>
</template>

<script>
import fileIconComponends from "@/components/fileIcon";
import postApi from "@/api/document/indexApi.js";
import approveDetail from "./approveDetail.vue";
import WorkflowList from "./workflowList.vue";
import request from '@/utils/request'
export default {
  computed: {

  },
  components: {
    fileIconComponends,
    WorkflowList,
    approveDetail,
  },
  data() {
    return {
      showTimeRange: false,
      counts: [],
      approveCount: {},
      searchForm: {
        typedata: 'all',
        projectName: '',
        userName: '',
        startTimeRange: [],
        endTimeRange: [],
      },
      tasks: [],
      taskType: [
        {
          type: 'all',
          act: true
        },
        {
          type: 'my',
          act: false
        },
        {
          type: 'join',
          act: false
        },
      ],
      approveId: '',
      approveStatus: '待审批',
      showDetail: false,
      submitVisible: false,
      approveOpinion: null,
      approveResult: 1,
      module: null
    }
  },
  watch: {
    // 路由参数带审批id自动打开审批单
    '$route': {
      deep: true,
      immediate: undefined,
      handler: function (val, oldval) {
        if (!!val.query.workflowId) this.showApproveDetail(this.$route.query.workflowId)
      }
    }
  },
  async mounted() {
    this.getAllTasks();
    this.queryApproveCount()
    this.$nextTick(() => {
      if (!!this.$route.query.workflowId) {
        this.showApproveDetail(this.$route.query.workflowId)
      }
    })
  },

  methods: {
    // async submitResult() {
    //   if (this.approveResult == 0) {
    //     await this.submitApproveForm('已修改', 1, 0);
    //   } else if (this.approveResult == 1) {
    //     await this.submitApproveForm('不予修改', 1, 0);
    //   }
    // },

    // 查询审批数
    async queryApproveCount() {
      let res = await postApi.post('api/projectworkflow/GetworkflowDatacount')
      if (res.code == 1) {
        this.approveCount = res.data
      }
    },
    // 查询所有任务
    async getAllTasks() {
      var formData = new FormData();
      var status = [];
      if (this.approveStatus == '待审批') {
        status.push(0);  //待审批
        status.push(-1); // 拒绝后修改
        status.push(-2); // 打回后修改
      } else {
        status.push(1);
      }
      formData.append('status', status); // (this.approveStatus == '待审批') ? 0 : 1);
      var res = await postApi.post("/api/projectworkflow/workflowPathTableData", formData);
      if (res.code == 1) {
        this.tasks = [];

        for (var j = 0; j < res.data.length; j++) {
          var files = [];
          var idStrs = (!res.data[j].relatedFiles) ? "" : res.data[j].relatedFiles.split(";");
          for (var k = 0; k < idStrs.length; k++) {
            files.push({
              iuid: idStrs[k],
              item: null
            });
          }
          this.tasks.push({
            iuid: res.data[j].iuid,
            workflowId: res.data[j].id,
            wfID: res.data[j].workflowGuid /*wfID*/,
            wfName: res.data[j].workflowName,
            taskName: res.data[j].taskName,
            taskID: res.data[j].taskID,
            applyID: res.data[j].creatorID,
            apply: res.data[j].creatorName,
            applyTime: res.data[j].createTime,
            endTime: (!res.data[j].endTime ? "未定" : res.data[j].endTime),
            projectId: res.data[j].projectiuid,
            projectName: res.data[j].projectName,
            attachFiles: files,
            opinion: res.data[j].opinion,
            resulttext: res.data[j].resulttext,
            status: res.data[j].status,
            roles: [],
            module: res.data[j].module,
            fileexportname: res.data[j].fileexportname,
          });
        }
      }
      for (var i = 0; i < this.tasks.length; i++) {
        await this.getItem(this.tasks[i].projectId, this.tasks[i].attachFiles); // 得到关联的文件信息
        this.tasks[i].roles = await this.getTaskRoles(this.tasks[i]); // 得到任务节点的承担人信息
      }
    },
    clearTime() {
      this.searchForm.startTimeRange = [];
      this.searchForm.endTimeRange = [];
    },
    async getTaskRoles(task) { // 得到任务节点的承担人信息
      let queryForm = new FormData();
      queryForm.append('WfID', task.wfID);
      queryForm.append('ID', task.taskID);
      var res = await postApi.post('/api/Workflow/GetWfStepList', queryForm);
      var roles = [];
      if (res.code == 1) {
        var roleIDs = res.data[0].roleIDs;
        roles = await this.getAllUsersOfRole(roleIDs, task.projectId);
      }
      return roles;
    },
    loadWorkflowList() {
      this.$nextTick(() => {
        this.$refs['workflowList'].loadWorkflowList();
      });
    },
    async getAllUsersOfRole(roleIDs, projectId) {
      var roles = [];
      for (var i = 0; i < roleIDs.length; i++) {
        let queryForm = new FormData();
        queryForm.append('roleID', roleIDs[i].roleID);
        queryForm.append('ProjectIUID', projectId);
        var res = await postApi.post('/api/Permission/GetUserDataByRole', queryForm);
        if (res.code == 1) {
          roles.push({});
          roles[i].currentRole = roleIDs[i].roleName;
          roles[i].roleNameList = res.data;
          roles[i].type = roleIDs[i].type;
          if (roleIDs[i].type == 1) { // 直接指定了人员
            roles[i].currentName = roleIDs[i].roleUserName;
            roles[i].currentID = roleIDs[i].roleUserID;
            roles[i].roleNameList = [{
              userName: roles[i].currentName,
              userID: roles[i].currentID
            }];
          } else { // 指定了角色则选择第一个作为缺省
            roles[i].currentName = res.data[0].userName;
            roles[i].currentID = res.data[0].userID;
          }
        }
      }
      return roles;
    },
    showApproveDetail(iuid, item, row) {
      if (item) {
        this.module = item.module
      }

      this.showDetail = true;
      this.approveId = iuid;
      this.$forceUpdate()

      // 日志
      let formData = new FormData();
      formData.append('Filename', row.relatedFilesName)
      formData.append('projectname', row.projectName)
      formData.append('logtype', 'xsdetailsdata_check')

      request.post('api/Log/AddFileviewing', formData)
    },
    handleTypeChange(idx) {
      this.taskType.forEach(item => {
        item.act = false
      })
      this.searchForm.typedata = this.taskType[idx].type
      this.taskType[idx].act = true
    },
    // 得到文件路径
    async getItem(projectId, files) {
      for (var i = 0; i < files.length; i++) {
        var item = null;
        var url = "/api/ProjectManagement/GetMasterfileData?IUID=" + projectId + '&FileIUID=' + files[i].iuid;
        var res = await postApi.post(url);
        if (res.code == 1) {
          files[i].item = {
            ...res.data,
            actionType: '2',
            statusType: '3'
          };
          files[i].item.lookbit = true;
          files[i].item.fileSuffix = files[i].item.fileSuffix || ''

          if (this.$ibimFileSuffix.indexOf(files[i].item.fileSuffix.toLowerCase()) > -1) // bim文件
            files[i].item.filePath = files[i].item.turnPath;
          else {
            files[i].item.fileType = "1"; // 未知原因，YGP
          }
        } else files[i].item = null;
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.tableLinkIcon {
  width: 16px;
  flex-shrink: 0;
  height: 16px;
  font-size: 16px;
  display: flex;
  align-items: center;
  /* vertical-align: -5px; */
  /* margin-right: 4px; */
}

.fileIconName {
  width: 100%;
  color: #606266;
  overflow: hidden;
  word-break: keep-all;
  display: inline-block;
  text-overflow: ellipsis;
  font-size: 14px !important;
  font-weight: 500;
}

.task-file .fileIconName {
  max-width: 260px;
  display: block;
}

.teamwork {
  background-color: #fff;
  width: calc(100vw - 60px);

  .rt {
    width: 400px;
    height: calc(100vh - 51px);
    border-left: 1px solid #d6dae3;
    padding-left: 10px;
    padding-right: 10px;

    .count {
      width: 100%;
      margin: 10px 0;
      text-align: right;
    }

    .task-list {
      height: calc(100vh - 91px);
      overflow-y: auto;
    }

    .task-block {
      display: block;
      margin: 3px 2px 12px 3px;
      background: #f7f7ee;
      padding: 5px;
      box-shadow: 1px 1px 2px #ccc;
      border-radius: 6px;
    }
  }

}

.sideWindow {
  width: 70vw;
  background-color: #fff;
  height: calc(100vh - 51px);
  position: absolute;
  right: -70vw;
  z-index: 1502;
  top: 0;
  transition: all .3s;
}

.wrap {
  // width: 100%;
  height: 100%;
  display: flex;
}

.lfb {
  height: calc(100vh - 61px);
  width: calc(100% - 10px);
  border-radius: 6px;
  margin: 5px;
  background-color: #fff;
  overflow: hidden;
}

.wrap .lf {
  width: calc(100vw - 360px);
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  position: relative;
}

.wrap .lf .touch-div {
  position: absolute;
  top: 0;
  height: 100%;
  left: 100%;
  width: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: col-resize;
}

.wrap .lf .touch-div span {
  width: 2px;
  background: #bbb;
  margin: 0 1px;
  height: 15px;
}

.wrap .lf a {
  display: block;
  padding: 3px 0;
  word-break: break-word;
}

.task-block:hover {
  box-shadow: 2px 2px 5px #bbb;
}

.task-title {
  font-size: 14px;
  font-weight: 800;
  color: black;
  margin: 10px;
  display: flex;
}

.task-apply {
  font-size: 12px;
  font-weight: 200;
  margin: 10px;
  color: black;
  display: flex;
}

.workflow-item {
  font-size: 12px;
  font-weight: 200;
  margin: 5px;
  margin-left: 10px;
  color: black;
  display: flex;
  height: 25px;
}

.workflow-item:hover {
  cursor: pointer;
  border-radius: 2px;
  background: #fff !important;
  border-color: #fff !important;
}

.workflow-item-select {
  font-size: 12px;
  font-weight: 200;
  margin: 5px;
  margin-left: 10px;
  color: black;
  display: flex;
  height: 25px;
  background: #66b1ff;
  border-color: #66b1ff;
}

.task-file {
  font-size: 12px;
  font-weight: 200;
  margin: 10px;
}

.client-2row {
  display: grid;
  width: 100%;
  border-color: #e2e6ecea;
  background-color: #e2e6ecea;
  grid-row-gap: 5px;
  row-gap: 5px;
  grid-template-rows: 1fr 1fr;
  align-items: center;
}

.client-3col {
  display: grid;
  //  border-color: #e2e6ecea;
  //  background-color: #e2e6ecea;
  grid-row-gap: 0px;
  row-gap: 0px;
  grid-column-gap: 0px;
  column-gap: 0px;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  //  background: white;
  margin-left: 2px;
  margin-right: 2px;
  margin-bottom: 5px;
  //  border-radius: 4px;
}

.client-block {
  margin-left: 2px;
  margin-right: 2px;
  margin-bottom: 5px;
  background: white;
  border: 1px solid #d6dae3;
  border-radius: 4px;
}


.areaStatisticsDataContainer {
  position: absolute;
  height: 40%;
  margin-top: 100px;
  right: 0;
  width: 330px;
  background-color: rgba(255, 255, 255, 0);
}

.statisticsDataContainer {
  bottom: 0;
  position: fixed;
  height: 50%;
  right: 0;
  width: 330px;
  background-color: rgba(255, 255, 255, 0);
}

.tab-pane {
  height: calc(100vh - 125px);
}

.task-menu-tabs {
  .el-tabs__header {
    margin-bottom: 0;
  }

  .el-tabs__nav-wrap {
    &:after {
      display: none;
    }
  }

  .el-tabs__nav-scroll {
    display: flex;
    align-items: left;

    .el-tabs__nav {
      display: flex;
      align-items: left;

      .el-tabs__item {
        vertical-align: bottom;
        text-align: center;
        background: #F5F7FA;
        border-bottom: 1px solid #d6dae3;
        border-radius: 4px;
        font-weight: 800;

        &.is-active {
          color: black;
          background: rgba(64, 158, 255, .2);
        }
      }

      .el-tabs__active-bar {
        display: none;
      }
    }
  }
}

.task-manage-tabs {
  width: 360px;

  .el-tabs__nav-wrap {
    &:after {
      display: none;
    }
  }

  .el-tabs__nav-scroll {
    display: flex;
    align-items: left;

    .el-tabs__nav {
      display: flex;
      align-items: left;

      .el-tabs__item {
        vertical-align: bottom;
        text-align: center;
        background: #F5F7FA;
        border-bottom: 1px solid #d6dae3;
        border-radius: 4px;
        font-weight: 800;
        padding: 0 !important;

        &.is-active {
          color: black;
          background: rgba(64, 158, 255, .2);
        }
      }

      .el-tabs__active-bar {
        display: none;
      }
    }
  }
}

.red {
  color: #F56C6C;
  font-size: 12px;

  &.is-disabled {
    color: #C0C4CC
  }
}

.blue {
  color: #409eff;
  font-size: 12px;

  &.is-disabled {
    color: #C0C4CC
  }
}

.count-item {
  width: calc(25% - 8px);
  border-radius: 5px;
  height: 140px;

  &:nth-child(1) {
    background-image: linear-gradient(180deg, #ee666622, #ee666655);
  }

  &:nth-child(2) {
    background-image: linear-gradient(180deg, #2BB2FE22, #2BB2FE55);
  }

  &:nth-child(3) {
    background-image: linear-gradient(180deg, #73c0de22, #73c0de55);
  }

  &:nth-child(4) {
    background-image: linear-gradient(180deg, #7456FE22, #7456FE55);
  }

  .count-title {
    margin: 15px 10px;
    font-size: 16px;
    font-weight: bold;
  }

  .count-box {
    margin-top: 40px;

    .count {
      font-size: 36px;
      margin-right: 5px;
      line-height: 32px;
      font-weight: bold;
    }
  }
}

.workflowManagement-dialog {
  .el-dialog {
    height: 78%;
  }

  .el-dialog__body {
    height: 85%;
  }

  .property-panel {
    height: calc(100% - 100px);
    overflow-y: auto;
    top: 7%;
    padding-right: 10px;
  }
}
</style>

<style>
.t-zhe-from-box .el-dialog__body {
  overflow-y: auto;
  height: calc(100% - 172px);
}

.x-zhe-from-box .el-dialog {
  height: calc(100% - 15vh - 50px);
}

.el-table .warning-row {
  background: #afeeee;
}

.el-table .success-row {
  background: #fff;
}

.image-button {
  width: 24px;
  height: 24px;
  border: 1px solid #8F9AB4;
  border-radius: 12px;
  margin-left: 5px;
}

.image-button:hover {
  cursor: pointer;
  border: 1px solid #FF7474;
}

.select-person-container {
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
}

.person-option {
  width: 100px;
  display: -webkit-box !important;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  text-align: left;
  cursor: pointer;
}

.roleTree {
  width: 100%;
  height: calc(100% - 45px);
  margin-right: 20px;
  border: 1px solid #cccccc;
}

/*
.roleTree .tooltip {
    z-index: 2000;
} */

.picTable .el-table__cell {
  padding: 6px 0;
  background: #f7f7f1;
  cursor: pointer;
}
</style>
