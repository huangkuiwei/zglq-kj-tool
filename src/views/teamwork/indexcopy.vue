<template>
  <el-container :style="{ 'min-height': 'calc(100vh - 51px)' }" style="display: flex">
    <mainSideMenu />
    <div class="flex" style="width: calc(100vw - 60px);">
      <div v-show="!workflowPage || activeTab == '审批事项'" class="flex column " ref="leftDom" style="width: calc(100vw - 420px)" :style="{ height: 'calc(100vh - 70px)' }">
        <div class="flex shrink jc-between" style="height: calc(45vh - 35px);margin-top:5px;padding:0 5px">
          <div class="chart-block" style="width:33%">
            <div class="progressTitle">{{ "项目分类" }}</div>
            <div style="position: absolute;margin-left: 20px;margin-top: 20px;text-align: center;display: flex;">
              <div style="color: #aec9db; font-size: 14px">项目总数:</div>
              <div style="color: black; font-size: 14px; margin-left: 5px">
                {{ number }}
              </div>
            </div>
            <div style="height: calc(45vh - 50px)" ref="categoryChartContainer" id="categoryChartContainer">
            </div>
          </div>
          <div class="chart-block" style="width:33%">
            <div class="flex jc-between ai-center" style="width: 100%;">
              <!-- <div class="progressTitle">项目区域分布</div> -->
              <div id="mapCharts" style="height: calc(45vh - 70px)" ref="mapCharts" class="mapCharts"></div>
              <!-- <div style="margin: 10px;">
                <el-button type="text" @click="showMap" icon="el-icon-map-location">查看地图</el-button>
              </div> -->
            </div>
            <!-- <div class="progressBox">
              <div v-for="(item, index) in locationList" :key="index" class="progressItem flex ai-center" :style="{ color: colorFormatter(index) }">
                <div class="progressFont">
                  <span class="dot">●</span>
                  <span>{{ item.province == 'null' ? '未知' : item.province }}</span>
                </div>
                <el-progress :percentage="item.progress" :color="colorFormatter(index)" class="progress"></el-progress>
                <div class="number">{{ item.number }}</div>
              </div>
            </div> -->
            <!-- <div class="topContainer">
              <div style="float: right">
                <el-input placeholder="请输入项目名称" prefix-icon="el-icon-search" v-model="searchRules.projectName" size="mini" style="width: 175px; margin-top: 40px"></el-input>
                <el-button type="primary" size="mini" style="margin-left: 120px; margin-top: 10px" @click="handleSearch">搜索</el-button>
              </div>
            </div> -->
            <el-dialog title="项目分布情况" :visible.sync="mapDialogVisible" width="60%" @close="destroyMap">
              <div id="mapCharts" ref="mapCharts" class="mapCharts"></div>
            </el-dialog>
          </div>
          <div class="chart-block" style="width:33%">
            <div class="progressTitle">{{ "项目状态" }}</div>
            <div style="height: calc(45vh - 95px);margin-top:20px" ref="statusChartContainer" id="statusChartContainer"></div>
          </div>
        </div>
        <div class="shrink lfb">
          <el-tabs class="task-menu-tabs" type="card" v-model="activeTabProject">
            <el-tab-pane class="lt-tab-pane" label="审批中心" name="审批中心">
              <template slot='label'>
                <i class='el-icon-workflowlist'></i>{{ "审批中心" }}
              </template>
              <WorkflowList @getAllTasks="getAllTasks" @showApproveDetail="showApproveDetail" ref="workflowList" />
            </el-tab-pane>
            <el-tab-pane class="lt-tab-pane" label="我参与的项目" name="我参与的项目">
              <template slot='label'>
                <i class='el-icon-project'></i>{{ "我参与的项目" }}
              </template>
              <MyInvolved />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div v-if="workflowPage && activeTab != '审批事项'" ref="leftDom" style="width: calc(100vw - 420px);position: relative;" :style="{ height: 'calc(100vh - 54px)' }">
        <workflow-management :isSystemTemplate='isSystemTemplate' @saveToTemplate="saveToTemplate" @save="save" :isSaving="isSaving" :tableRow='tableRow' :saveDraft='true' :loadDraft='true' @saveDraftDone='saveDraftDone' @loadDraftDone='loadDraftDone' :tableName='tableName' ref="workflowManagements" @xmlModel='xmlModel' :bpmnXmlStr='bpmnXmlStr' :newWoker='newWoker' :WfID='WfID' @referData='referData' />
      </div>
      <div class="rt">
        <el-tabs class="task-manage-tabs" stretch type="border-card" @tab-click="changeActType" v-model="activeTab">
          <el-tab-pane class="tab-pane" name="审批事项">
            <template slot='label'>
              <i class='el-icon-tasks'></i>{{ "审批事项" }}
            </template>
            <div class="flex ai-center" style="margin-bottom: 10px;">
              <el-select v-model="approveStatus" size='mini' :popper-append-to-body="false" style="width:30%; margin-right: 5px" @change="selectProjects">
                <el-option v-for="(item, index) in approveStatusList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
              <el-date-picker v-model="dateRange" size='mini' value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width:220px;" @change="selectProjects"></el-date-picker>
              <!-- <span style="font-size:12px; margin-left:10px">至今</span> -->
            </div>
            <div class="flex ai-center" style="font-size:14px;font-weight:400">
              <span style="margin-right: 5px; ">{{ $t('projects.label.name') }}:</span>
              <el-select multiple collapse-tags style="width: 258px;" size="mini" v-model="currentProjects" :popper-append-to-body="false" placeholder="请选择项目" @change="selectProjects">
                <el-option v-for="item in projectList" :key="item.iuid" :label="item.projectName" :value="item.iuid">
                </el-option>
              </el-select>
            </div>
            <el-row class="scrollContainer hide-scroll" :style="{ height: 'calc(100vh - 201px)' }" style="overflow-y: auto;margin-top:10px;">
              <template v-if="tasks.length == 0">
                <div class="flex ai-center jc-center" style="font-size: 12px;color: #999;margin-top: 45px;">
                  {{ $t('base.button.noProofreadingData') }}
                </div>
              </template>
              <div class="task-block" v-for="(item, idx) in tasks" :key="idx">
                <div class="task-title flex ai-center">
                  <span style="width:70%;">{{ `${item.taskName}` }}</span>
                  <div style="margin-left: auto;">
                    <el-button plain v-if="approveStatus == '待审批' && item.status == 0" type="primary" size="mini" @click="showApproveDetail(item.workflowId)">{{ $t('base.label.approval') }}</el-button>
                    <el-button plain v-else-if="approveStatus == '待审批' && item.status == -1" type="primary" size="mini" @click="showApproveDetail(item.workflowId)">{{ $t('base.button.view') }}</el-button>
                    <el-button plain v-else-if="approveStatus == '待审批' && item.status == -2" type="primary" size="mini" @click="showApproveDetail(item.workflowId)">{{ $t('base.button.view') }}</el-button>
                    <el-button plain v-else type="success" size="mini" @click="showApproveDetail(item.workflowId)">详情</el-button>
                  </div>
                </div>
                <div class="task-apply">
                  <span style="width:64px;font-family: SimHei">{{ $t('projects.label.name') }}:</span>
                  <span>{{ item.projectName }}</span>
                </div>
                <div class="task-apply">
                  <span style="width:64px;font-family: SimHei">{{ item.status == 0 ? '发起人' : '审批人' }}:</span>
                  <span>{{ item.apply }}</span>
                </div>
                <div class="task-apply">
                  <span style="width:64px;font-family: SimHei">流程名称:</span>
                  <span>{{ item.wfName }}</span>
                </div>
                <div class="task-apply">
                  <span style="width:64px;font-family: SimHei">提交时间:</span>
                  <span>{{ item.applyTime }}</span>
                </div>
                <div class="task-file" v-for="(file) in item.attachFiles">
                  <fileIconComponends :row="file.item" />
                </div>
              </div>
            </el-row>
          </el-tab-pane>
          <el-tab-pane class="tab-pane" name="流程管理">
            <template slot='label'>
              <i class='el-icon-workflow'></i>{{ "流程管理" }}
            </template>
            <el-row class="scrollContainer" style="overflow-y: auto;height: 100%;">
              <div class="task-block">
                <div class="task-title flex ai-center jc-between">
                  <div class="shrink">项目流程</div>
                  <div style="display: flex;margin-left:5px">
                    <el-button size="mini" type="text" @click="addWorkflows" :disabled="!currentProject">新建</el-button>
                    <!-- <el-button size="mini" type="text" @click="editWorkflows" :disabled="!currentProject || workflowChecked.length != 1">{{ $t('base.button.edit') }}</el-button> -->
                    <el-button size="mini" type="text" class="red" @click="deleteWorkflows" :disabled="!currentProject || workflowChecked.length == 0">{{ $t('base.button.delete') }}</el-button>
                  </div>
                </div>
                <div class="flex ai-center" style="margin-top: 20px;margin-bottom: 10px; font-size:14px; font-weight:400">
                  <span style="margin-left: 10px; margin-right: 5px">{{ $t('projects.label.name') }}:</span>
                  <el-select size="small" style="width: 65%;" v-model="currentProject" :popper-append-to-body="false" :placeholder="$t('base.button.pleaseSelect')" @change="selectProject">
                    <el-option v-for="item in projectList" :key="item.iuid" :label="item.projectName" :value="item.iuid" />
                  </el-select>
                </div>
                <el-table class="picTable" :border="false" ref='picTable' :header-cell-style="$thStyle" :data="tableDataLeft" v-show="tableDataLeft.length != 0" :show-header="false" highlight-current-row @row-click="showWorkflow" @selection-change="workflowSelect">
                  <el-table-column width="43px" type="selection"></el-table-column>
                  <el-table-column show-overflow-tooltip prop="wfName"></el-table-column>
                  <el-table-column width="50px">
                    <template slot-scope="scope">
                      <i class="el-icon-edit-outline blue" @click.stop="editWorkflows(scope.row)"></i>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="task-block">
                <div class="task-title flex ai-center jc-between">
                  <span style="width:35%;">流程模板</span>
                  <div style="display: flex;">
                    <el-button type="text" size="small" @click="addSystemWorkflows">新建</el-button>
                    <!-- <el-button type="text" size="small" :disabled="systemWorkflowChecked.length != 1" @click="editSystemWorkflows">{{ $t('base.button.edit') }}</el-button> -->
                    <el-button type="text" size="small" :disabled="systemWorkflowChecked.length != 1" @click="SysWfToProjectWorkFlow">复用</el-button>
                    <el-button type="text" size="small" class="red" :disabled="systemWorkflowChecked.length < 1" @click="deleteSystemWorkflows">{{ $t('base.button.delete') }}</el-button>
                  </div>
                </div>
                <el-table class="picTable" :border="false" ref='tempTable' :header-cell-style="$thStyle" :data="tableDataSystem" v-if="tableDataSystem.length != 0" :show-header="false" highlight-current-row @row-click="showTempWorkflow" @selection-change="tempWorkflowSelect">
                  <el-table-column width='43px' type="selection"></el-table-column>
                  <el-table-column prop="wfName" show-overflow-tooltip></el-table-column>
                  <el-table-column width="50">
                    <template slot-scope="scope">
                      <div class="flex jc-between">
                        <i class="el-icon-edit-outline blue" @click.stop="editSystemWorkflows(scope.row)"></i>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-row>
            <el-dialog v-dialogDrag :close-on-click-modal='false' :title="isAdd ? '新增流程' : '编辑流程'" :visible.sync="dialogVisible" width="30%" append-to-body @close="initForm">
              <el-form ref="tableForm" :model="tableForm" label-width="100px" :rules="rules">
                <el-form-item label="流程名称: " prop="wfName">
                  <el-input v-model="tableForm.wfName" style="margin-left: 10px"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
                <el-button type="primary" @click="submitForm">{{ $t('base.button.confirm') }}</el-button>
              </span>
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane class="tab-pane" name="我的组织">
            <template slot='label'>
              <i class='el-icon-roles'></i>{{ "我的组织" }}
            </template>
            <div class="flex ai-center" style="margin-bottom: 15px;">
              <span style="margin-right: 5px; font-size:14px">专业或部门:</span>
              <el-select size="small" v-model="department" :popper-append-to-body="false" style="width:50%; margin-right: 5px" @change="getAllRoles" value-key="specialtyIUID">
                <el-option v-for="(item, index) in departmentList" :key="item.specialtyIUID" :label="item.specialtyName" :value="item">
                </el-option>
              </el-select>
              <el-button type="primary" size="mini" style="margin-left: 3px;" :disabled="department.specialtyName != '全部'" @click="handleNewDepartment">{{$t('base.button.create')}}</el-button>
            </div>
            <div class="roleTree">
              <RolesManagement :rolesData="rolesData" @getAllRoles="getAllRoles" />
            </div>
            <el-dialog v-dialogDrag :close-on-click-modal="false" :modal="true" title="新建专业/部门" :visible.sync="newNameDialogVisble" width="400px">
              <el-form ref="form" :model="nameForm" label-width="80px" @submit.native.prevent>
                <el-form-item label="名称：">
                  <el-input ref="nameFormInput" v-model="nameForm.name" @keyup.enter.native="onSubmitNameInfo"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmitNameInfo" style="width: 88px">确认</el-button>
                <el-button @click="newNameDialogVisble = false" style="width: 80px; margin-left: 5px">{{ $t('base.button.cancel') }}</el-button>
              </div>
            </el-dialog>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="流程模板" :visible.sync="workflowManagementDialogVisible" width="80%" @opened='workflowManagementOPend' class="workflowManagement-dialog t-zhe-from-box" append-to-body>
      <workflow-management :viewMode='false' :tableRow='tableRow' :tableName='tableName' ref="workflowManagements" @xmlModel='xmlModel' :bpmnXmlStr='bpmnXmlStr' :newWoker='newWoker' :WfID='WfID' @referData='referData' />
    </el-dialog>
    <div class="sideWindow" :style="{ right: showDetail ? 0 : '-70vw' }">
      <approve-detail :approveId="approveId" v-if="showDetail" :showDetail.sync="showDetail" @getAllTasks="getAllTasks" @loadWorkflowList="loadWorkflowList"></approve-detail>
    </div>
    <div class="mask" @click="showDetail = false" v-show="showDetail"></div>
  </el-container>
</template>
<script>
import axios from 'axios'
// import AppMain from "./";
// import mainSideMenu from "../mainSideMenu";
import fileIconComponends from "@/components/fileIcon";
import projectFileApi from "@/api/document/indexApi.js";
import {
  mapGetters
} from "vuex";
import mapComponents from "@/components/2DMap";
import approveDetail from "./approveDetail";
import projectApi from "@/api/project/all/index";
import MyInvolved from "@/views/project/main/myInvolved";
import workflowManagement from "@/views/SystemSetting/workflowManagement/index";
import AssignWorkflowTask from "@/components/assignWorkflowTask.vue";
// import WorkflowList from "./workflowList.vue";
import RolesManagement from "./rolesManagement.vue";
import chinaMap from "@/libs/mapJson/china.json";
export default {
  computed: {
    ...mapGetters(["clientHeight"]),
    colorFormatter() {
      return function (index) {
        let color;
        switch (index) {
          case 0:
            color = "#d84431";
            break;
          case 1:
            color = "#ef702a";
            break;
          case 2:
            color = "#e3ab21";
            break;
          default:
            color = "#AEC9DB";
        }
        return color;
      };
    },
  },
  components: {
    // AppMain,
    // mainSideMenu,
    fileIconComponends,
    mapComponents,
    MyInvolved,
    workflowManagement,
    AssignWorkflowTask,
    WorkflowList,
    approveDetail,
    RolesManagement
  },
  data() {
    return {
      // 校审单
      approveId: null,
      showDetail: false,

      leftDom: null,
      clientStartX: 0,
      activeTab: '审批事项',
      activeTabProject: '审批中心',
      categoryCharts: null,
      isSaving: false, //保存版本的loading
      statusCharts: null,
      mapCharts: null,
      mapDialogVisible: false,
      tasks: [],
      projectList: null,
      currentProjects: [],
      currentProject: null,
      searchRules: {
        projectName: null,
      },
      locationList: null,
      typeList: null,
      number: 0,
      workflowPage: false,
      projectWorkflows: [{
        code: 1,
        name: "图纸校审"
      }, {
        code: 2,
        name: "BIM模型校审"
      }],
      systemWorkflows: [{
        code: 1,
        name: "校审流程",
        file: "设计校审单",
        note: "公路设计项目"
      }, {
        code: 2,
        name: "复核流程",
        file: "设计复核单",
        note: "公路设计项目"
      }, {
        code: 3,
        name: "提资流程",
        file: "互提资料单",
        note: "公路设计项目"
      }, {
        code: 4,
        name: "会签流程",
        file: "设计会签单",
        note: "公路设计项目"
      }],
      workflowChecked: [],
      systemWorkflowChecked: [], // 系统模板的选择项
      isSystemTemplate: false, // 是否是系统流程模板
      ////
      responsiblePersonDialogVisible: false,
      rolePersonData: [],
      responsiblePersonChecked: [],
      handoverNames: '',
      /////
      modifyDialogVisible: false,
      isViewApprove: false, // true: 查看详情； false: 去审批
      approveDialogVisible: false,
      approveItem: null, // 待审批的任务
      approveOpinion: '',
      approveResult: 0,
      approveStatusList: ['待审批', '已审批'],
      approveStatus: '待审批',
      dateRange: null,
      //
      department: {
        specialtyName: '全部',
        specialtyIUID: ''
      },
      departmentList: [],
      rolesData: [], // 当前专业或部门包含的全部角色数据
      nameForm: {
        name: "",
        oldPlaceName: "",
      },
      newNameDialogVisble: false,
      //
      tableDataSystem: [], // 模板中的流程数据
      newWoker: true,
      tableRow: {},
      tableName: '',
      workflowManagementDialogVisible: false,
      tableDataLeft: [], // 项目中的流程数据
      leftRows: 40,
      leftPage: 1,
      leftTotal: 0,
      tableHeaderLeftFrom: {
        wfname: ''
      },
      WfID: 0,
      nodes: [],
      nodesGateway: [],
      isAdd: true,
      dialogVisible: false,
      tableForm: {
        wfCode: '',
        wfName: '',
        TableName: '',
        FormPath: '',
        ReportPath: ''
      },
      formID: '',
      rules: {
        wfCode: [{
          required: true,
          message: '请填写工作流编码',
          trigger: 'blur'
        }, {
          min: 1,
          message: '工作流编码最小一个字符',
          trigger: 'blur'
        }],
        wfName: [{
          required: true,
          message: '请填写工作流名称',
          trigger: 'blur'
        }, {
          min: 1,
          message: '工作流名称最小一个字符',
          trigger: 'blur'
        }],
        TableName: [{
          required: true,
          message: '请填写数据表名',
          trigger: 'blur'
        }, {
          min: 1,
          message: '数据表名最小一个字符',
          trigger: 'blur'
        }]
      },
      bpmnXmlStr: '<?xml version="1.0" encoding="UTF-8"?>' + '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' + 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' + 'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' + 'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' + 'targetNamespace="http://bpmn.io/schema/bpmn" ' + 'id="Definitions_1">' + '<bpmn:process id="Process_1" isExecutable="false">' + '<bpmn:startEvent id="StartEvent_1"/>' +
        '</bpmn:process>' + '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' + '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' + '<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">' + '<dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>' + '</bpmndi:BPMNShape>' + '</bpmndi:BPMNPlane>' + '</bpmndi:BPMNDiagram>' + '</bpmn:definitions>',
      bpmnXmlStrCopy: '<?xml version="1.0" encoding="UTF-8"?>' + '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' + 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' + 'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' + 'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' + 'targetNamespace="http://bpmn.io/schema/bpmn" ' + 'id="Definitions_1">' + '<bpmn:process id="Process_1" isExecutable="false">' + '<bpmn:startEvent id="StartEvent_1"/>' +
        '</bpmn:process>' + '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' + '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' + '<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">' + '<dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>' + '</bpmndi:BPMNShape>' + '</bpmndi:BPMNPlane>' + '</bpmndi:BPMNDiagram>' + '</bpmn:definitions>',
      xmlJsonOutput: '',
    };
  },
  watch: {
    '$route': {
      deep: true,
      immediate: undefined,
      handler: function (val, oldval) {
        if (!!val.query.workflowId) this.showApproveDetail(this.$route.query.workflowId)
      }
    }
  },
  async mounted() {
    this.loadProjectData()
    this.getAllTasks();
    var now = new Date();
    var date = now.Format('yyyy-MM-dd');
    // this.startDate = this.getPreviousMonth(date);
    this.leftDom = this.$refs.leftDom;
    this.$store.state.app.teamworkClientWidth = this.leftDom.style.width;
    this.referData();
    this.getAllDepartment();
    this.$nextTick(async () => {
      if (!!this.$route.query.workflowId) {
        this.showApproveDetail(this.$route.query.workflowId)
      }
      await this.initCategoryCharts()
      await this.initStatusCharts()
      await this.initMapCharts()

      let _this = this
      window.addEventListener('resize', () => {
        if (_this.mapCharts != null) _this.mapCharts.resize();
        if (_this.statusCharts != null) _this.statusCharts.resize();
        if (_this.categoryCharts != null) _this.categoryCharts.resize();
      });
    })
  },
  beforeDestroy() {
    if (this.categoryCharts != null) {
      this.categoryCharts.clear()
      this.categoryCharts = null
    }
    if (this.statusCharts != null) {
      this.statusCharts.clear()
      this.statusCharts = null
    }
    if (this.mapCharts != null) {
      this.mapCharts.clear()
      this.mapCharts = null
    }
  },
  methods: {
    changeActType() {
      setTimeout(() => {
        if (this.activeTab != '流程管理') {
          if (this.$refs['tempTable']) this.$refs['tempTable'].setCurrentRow()
          if (this.$refs['picTable']) this.$refs['picTable'].setCurrentRow()
        }
        this.setWorkflow(false)

        if (this.categoryCharts == null) {
          this.initCategoryCharts()
        }
        if (this.statusCharts == null) {
          this.initStatusCharts()
        }
      }, 200)

    },
    async loadProjectData() {
      var postData = new FormData()
      postData.append('ProjectName', '')
      postData.append('page', 1)
      postData.append('rows', 1000)
      postData.append('dataRule', 'myParticipateIn')
      postData.append('Orderby', 'DESC')
      var res = await projectApi.queryProjectPageList(postData)
      //   var res = await projectApi.getAllProject();       // 这个函数有问题,YGP
      this.projectList = res.data;
      this.projectInfo = await this.$store.dispatch('queryRecentlyProject');
      if (projectInfo != null && this.projectList && this.projectList.length > 0) {
        for (var i = 0; i < this.projectList.length; i++) {
          if (this.projectList[i].iuid == projectInfo.iuid) {
            this.currentProject = projectInfo.iuid;
            this.isSystemTemplate = false
            this.referData()
            break;
          }
        }
      }
    },
    async initCategoryCharts() {
      var statisticsRes = await projectApi.getStatistics();
      this.locationList = statisticsRes.data.location;
      this.typeList = statisticsRes.data.type;
      this.number = statisticsRes.data.number; //项目总数
      const scaleData = [];
      this.typeList.forEach((element) => {
        scaleData.push({
          name: element.type,
          value: element.number
        });
      });
      const holderValue = scaleData.reduce((a, b) => {
        return a + b.value;
      }, 0) * 0.01;
      const occupiedHolderStyle = {
        value: holderValue,
        itemStyle: {
          normal: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            color: "rgba(0, 0, 0, 0)",
            borderColor: "rgba(0, 0, 0, 0)",
          },
        },
      };
      const legendOption = {
        icon: "circle",
        // itemGap: 30,
        itemWidth: 18,
        itemHeight: 8,
        textStyle: {
          fontSize: 12,
          rich: {
            name: {
              color: "#bed3f8",
              fontSize: 12,
              // width: 60,
            },
            percent1: {
              color: "#53A8F0",
              fontSize: 12,
            },
            percent2: {
              color: "#D893FA",
              fontSize: 12,
            },
            percent3: {
              color: "#F9FCFF",
              fontSize: 12,
            },
            percent4: {
              color: "#E6B747",
              fontSize: 12,
            },
            percent5: {
              color: "#D6F44F",
              fontSize: 12,
            },
            percent6: {
              color: "#74FAD7",
              fontSize: 12,
            },
          },
        },
      };
      var legend = [];
      for (var i = 0; i < this.typeList.length; i++) {
        legend.push({
          data: [this.typeList[i].type],
          legendOption,
        });
      }
      const colorList = [
        ["#17AEE2"],
        ["#AEC9DB"],
        ["#D84431"],
        ["#E3AB21"],
        ["#1FDC5E"],
        ["#66b1ff"],
      ];
      // 项目分类
      this.categoryCharts = this.$echarts.init(this.$refs.categoryChartContainer);
      const data = [];
      for (let i = 0; i < scaleData.length; i++) {
        data.push({
          value: scaleData[i].value,
          name: scaleData[i].name,
          itemStyle: {
            color: colorList[i][0],
          }
        });
        // ,occupiedHolderStyle
      }
      this.categoryCharts.setOption({
        legend: {
          width: 200,
          top: '5%',
          right: 30
        },
        color: colorList,
        series: [{
          type: "pie",
          radius: ["32%", "47%"],
          labelLine: {
            show: true,
          },
          data: data,
        }],
      });
    },
    async initMapCharts() {
      // 项目分布map
      let max = Math.max(...this.locationList.map(item => item.number))
      this.mapCharts = this.$echarts.init(this.$refs.mapCharts);
      this.$echarts.registerMap("china", chinaMap);
      this.mapCharts.setOption({
        title: {
          text: '项目区域分布情况',
          left: '10px',
          textStyle: {
            fontSize: 14,
            fontWeight: '400',
            fontFamily: 'Microsoft YaHei'
          }
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter(p, t, cb) {
            return p.name + '：' + (isNaN(p.value) ? 0 : p.value) + "个"
          }
        },
        visualMap: {
          left: 'right',
          max: max,
          text: [max, 0],
          inRange: {
            color: ['#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027']
          },
        },
        series: [{
          type: 'map',
          map: 'china',
          roam: true,
          scaleLimit: {
            max: 20,
            min: 1
          },
          label: {
            show: true,
            color: '#333',
            textBorderColor: '#fff',
            textBorderWidth: 1,
            position: 'inside',
            formatter: (data) => {
              return !!data.value ? data.value : ''
            }
          },
          itemStyle: {
            areaColor: '#e0f3f8',
            borderColor: 'rgba(0, 0, 0, 0.2)',
          },
          data: this.locationList.map(item => {
            return {
              name: item.province,
              value: item.number,
            }
          })
        }]
      })
    },
    async initStatusCharts() {
      //项目状态
      this.statusCharts = this.$echarts.init(this.$refs.statusChartContainer);
      let projectStatusData = await projectFileApi.get('/api/ProjectManagement/GetProjectDesignPhaseData')
      let seriesData;
      if (projectStatusData.code == 1) {
        seriesData = {
          data: projectStatusData.data.map(item => item.projectNumber),
          xData: projectStatusData.data.map(item => item.designPhaseName)
        }
      }
      var option = {
        grid: {
          top: 30,
          bottom: 40
        },
        tooltip: { //提示框组件 悬浮在主条上的文字提示
          trigger: 'axis', //trigger 触发类型 axis坐标轴触发，主要在柱状图，折线图等
          formatter: '{b}: {c}'
        },
        xAxis: { //x轴 直角坐标系 grid 中的 x 轴
          axisLine: { //坐标轴轴线相关设置
            lineStyle: { //坐标轴线线的颜色
              color: 'black', //坐标轴线的颜色修改--文字也同步修改
              type: 'dashed'
            }
          },
          axisTick: { //坐标轴刻度相关设置
            show: true, //是否显示坐标轴刻度
            alignWithLabel: true, //可以保证刻度线和标签对齐
          },
          axisLabel: {
            interval: 0,
            color: 'green', //刻度标签文字的颜色
            fontSize: 10
          },
          data: seriesData.xData
        },
        yAxis: { //y轴  可以省略内容  数据series显示
          axisLine: { //坐标轴轴线相关设置
            lineStyle: { //坐标轴线线的颜色
              color: 'black',
            }
          },
          boundaryGap: [0, '10%'],
          axisLabel: { //坐标轴刻度标签的相关设置
            color: 'green'
          },
          splitLine: { //坐标轴在 grid 区域中的分隔线。
            show: true, //是否显示分隔线。默认数值轴显示，类目轴不显示。
            lineStyle: {
              color: ['#aaa', '#ddd'], //隔线会按数组中颜色的顺序依次循环设置颜色
            }
          }
        },
        series: [{ //系列列表。每个系列通过 type 决定自己的图表类型
          type: 'bar', //柱状/条形图
          label: { //图形上的文本标签，可用于说明图形的一些数据信息
            show: true, //是否显示标签
            position: 'top' //label 位置
          },
          itemStyle: { //图形样式
            color: "#53A8F0", //柱条的颜色
            borderColor: '#66b1ff', //描边
          },
          emphasis: { //高亮的图形样式和标签样式
            label: {
              show: false,
            },
            itemStyle: {
              color: '#5ecccc'
            }
          },
          barWidth: 30, //柱条的宽度，不设时自适应。
          data: seriesData.data
        }]
      }
      this.statusCharts.setOption(option);
    },
    showMap() {
      this.mapDialogVisible = true;
      this.$nextTick(() => {
        this.initMapCharts()
      })
    },
    destroyMap() {
      if (this.mapCharts != null) {
        this.mapCharts.clear()
        this.mapCharts = null
      }
    },
    getPreviousMonth(data) {
      let arr = data.split('-')
      let year = arr[0] // 获取当前日期的年份
      let month = arr[1] // 获取当前日期的月份
      let day = arr[2] // 获取当前日期的日
      let year2 = year
      let month2 = parseInt(month) - 1
      if (month2 === 0) {
        year2 = parseInt(year2) - 1
        month2 = 12
      }
      let day2 = day
      let days2 = new Date(year2, month2, 0)
      days2 = days2.getDate()
      if (day2 > days2) {
        day2 = days2
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }
      let m = year2 + '-' + month2 + '-' + day2
      return m
    },

    handleSearch() {
      this.$refs.mapComponents.mapQueryByProjectName(this.searchRules.projectName);
    },

    moveHandle(nowClientX, leftDom) {
      let computedX = nowClientX - this.clientStartX;
      let leftBoxWidth = parseInt(leftDom.style.width);
      let changeWidth = leftBoxWidth + computedX;
      leftDom.style.width = changeWidth + "px";
      this.clientStartX = nowClientX;
      this.$store.state.app.teamworkClientWidth = changeWidth + "px";
    },
    // 得到“我”所有的任务
    async getAllTasks() {
      this.tasks = [];
      var formData = new FormData();
      var allIds = this.currentProjects.join(',');
      formData.append('projectiuid', allIds);
      var status = [];
      if (this.approveStatus == '待审批') {
        status.push(0);
        status.push(-1); // 拒绝后修改
        status.push(-2); // 打回后修改
      } else {
        status.push(1);
      }
      formData.append('status', status); // (this.approveStatus == '待审批') ? 0 : 1);
      formData.append('createTime', this.dateRange ? this.dateRange[0] : '');
      formData.append('endTime', this.dateRange ? this.dateRange[1] : '');
      var res = await projectFileApi.post("/api/projectworkflow/workflowPathTableData", formData);
      if (res.code == 1) {
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
            roles: []
          });
        }
      }
      // if (this.approveStatus == '待审批') {
      //     var formData = new FormData();
      //     formData.append('projectiuid', allIds);
      //     formData.append('status', -1);    // 得到所有被拒修改的
      //     formData.append('createTime', this.startDate);
      //     var res = await projectFileApi.post("/api/projectworkflow/workflowPathTableData", formData);
      //     if (res.code == 1) {
      //         for (var j = 0; j < res.data.length; j++) {
      //             var files = [];
      //             var idStrs = (!res.data[j].relatedFiles) ? "" : res.data[j].relatedFiles.split(";");
      //             for (var k = 0; k < idStrs.length; k++) {
      //                 files.push({ iuid: idStrs[k], item: null });
      //             }
      //             this.tasks.push({
      //                 iuid: res.data[j].iuid, workflowId: res.data[j].id, wfID: res.data[j].workflowGuid, wfName: res.data[j].workflowName,
      //                 taskName: res.data[j].taskName, taskID: res.data[j].taskID, applyID: res.data[j].creatorID, apply: res.data[j].creatorName, applyTime: res.data[j].createTime,
      //                 endTime: res.data[j].endTime, projectId: res.data[j].projectiuid, projectName: res.data[j].projectName,
      //                 attachFiles: files, opinion: res.data[j].opinion, resulttext: res.data[j].resulttext, status: res.data[j].status, roles: []
      //             });
      //         }
      //     }
      // }
      for (var i = 0; i < this.tasks.length; i++) {
        await this.getItem(this.tasks[i].projectId, this.tasks[i].attachFiles); // 得到关联的文件信息
        this.tasks[i].roles = await this.getTaskRoles(this.tasks[i]); // 得到任务节点的承担人信息
      }
    },
    showApproveDetail(iuid) {
      this.showDetail = true;
      this.approveId = iuid;
      this.$forceUpdate()
    },
    // 得到文件路径
    async getItem(projectId, files) {
      for (var i = 0; i < files.length; i++) {
        var item = null;
        var url = "/api/ProjectManagement/GetMasterfileData?IUID=" + projectId + '&FileIUID=' + files[i].iuid;
        var res = await projectFileApi.post(url);
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
    async getTaskRoles(task) { // 得到任务节点的承担人信息
      let queryForm = new FormData();
      queryForm.append('WfID', task.wfID);
      queryForm.append('ID', task.taskID);
      var res = await projectFileApi.post('/api/Workflow/GetWfStepList', queryForm);
      var roles = [];
      if (res.code == 1) {
        var roleIDs = res.data[0].roleIDs;
        roles = await this.getAllUsersOfRole(roleIDs);
      }
      return roles;
    },
    async getAllUsersOfRole(roleIDs) {
      var roles = [];
      for (var i = 0; i < roleIDs.length; i++) {
        let queryForm = new FormData();
        queryForm.append('roleID', roleIDs[i].roleID);
        var res = await projectFileApi.post('/api/Permission/GetUserDataByRole', queryForm);
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
    confirmCheckResponsiblePerson() {
      /*  var users = []
        this.responsiblePersonChecked.forEach((item) => {
          var checkedUser = this.rolePersonData.find((ele) => {
            return ele.userName === item.userName
          })

          if (checkedUser !== undefined) {
            users.push({
              userId: checkedUser.userId,
              userName: checkedUser.userName
            })
          }
        })
        this.responsiblePersonChecked = users;*/
      alert(this.responsiblePersonChecked[0].userName)
      alert(this.responsiblePersonChecked[0].userID)
      this.responsiblePersonDialogVisible = false;
    },
    getFolderFullPath(projectId, item) {
      if (!item) return;
      //   var path = item.turnPath;
      //   if(path == "") path = item.filePath;
      var path = (this.$ibimFileSuffix.indexOf(item.fileSuffix.toLowerCase()) > -1 ? item.filePath : item.turnPath);
      path = path.replace(/\\/g, `/`);
      var mainfolder = `Files/${projectId}`;
      mainfolder = mainfolder.replace(/-/g, '_'); // 文件名中无'_'
      var index = path.indexOf(mainfolder);
      if (index != -1) path = path.substring(index + mainfolder.length);
      index = path.lastIndexOf("/");
      if (index == -1) return;
      var fpath = path.substring(0, index);
      var fname = path.substring(index + 1);
      var folderFullPath = "项目" + fpath;
      return folderFullPath;
    },

    loadWorkflowList() {
      this.$nextTick(() => {
        this.$refs['workflowList'].loadWorkflowList();
      });
    },

    setWorkflow(bTrue) {
      this.workflowPage = bTrue;
    },
    tableRowClassName({
      row,
      rowIndex
    }) {
      if (rowIndex % 2 == 0) {
        return 'success-row';
      } else if (rowIndex % 2 != 0) {
        return 'warning-row';
      }
      return '';
    },
    async saveDraftDone(xmlStr) {
      var obj = new Object();
      obj.xmlStr = xmlStr;
      obj.wfID = this.WfID;
      var res = await projectFileApi.post('/api/Workflow/SaveDraft', this.$objectToFormData(obj));
      if (res.code == 1) {
        this.$message({
          type: 'success',
          message: '保存草稿成功!'
        });
      }
    },
    async loadDraftDone() {
      console.log(1);
      var obj = new Object();
      obj.wfID = this.WfID;
      var res = await projectFileApi.post('/api/Workflow/LoadDraft', this.$objectToFormData(obj));
      if (res) {
        if (res.code == 1) {
          this.workflowManagementDialogVisible = true;
          this.bpmnXmlStr = res.data.xmlStr
          this.$refs['workflowManagements'].disabled = false;
          this.$nextTick(() => {
            this.$refs['workflowManagements'].createNewDiagram() //流程图重绘
          })
        }
      }
    },
    xmlModel(data) {
      this.bpmnXmlStr = data
      this.$nextTick(() => {
        this.$refs['workflowManagements'].createNewDiagram() //流程图重绘
      })
    },
    cellClick(row, column, cell, event) {
      this.WfID = row.id
    },
    addWorkflows() {
      this.isSystemTemplate = false;
      this.isAdd = true
      this.dialogVisible = true
    },
    addSystemWorkflows() {
      this.isSystemTemplate = true;
      this.isAdd = true
      this.dialogVisible = true
    },
    editSystemWorkflows(row) {
      // this.isSystemTemplate = true;
      // var row = null;
      // for (var i = 0; i < this.tableDataSystem.length; i++) {
      //   if (this.tableDataSystem[i].id == this.systemWorkflowChecked[0]) {
      //     row = this.tableDataSystem[i];
      //     break;
      //   }
      // }
      // if (!row) return;
      this.isAdd = false
      this.dialogVisible = true
      this.tableForm.wfName = row.wfName;
      this.tableForm.wfCode = row.wfCode;
      this.tableForm.TableName = row.tableName;
      this.formID = row.id
    },
    editWorkflows(row) {
      // var row = null;
      // for (var i = 0; i < this.tableDataLeft.length; i++) {
      //   if (this.tableDataLeft[i].id == this.workflowChecked[0]) {
      //     row = this.tableDataLeft[i];
      //     break;
      //   }
      // }
      // if (!row) return;
      this.isAdd = false
      this.dialogVisible = true
      this.tableForm.wfName = row.wfName;
      this.tableForm.wfCode = row.wfCode;
      this.tableForm.TableName = row.tableName;
      this.formID = row.id
    },
    async deleteWorkflows() {
      this.$confirm('确定删除该流程吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var obj = new Object();
        obj.ids = (!this.isSystemTemplate) ? this.workflowChecked : this.systemWorkflowChecked;
        var res = await projectFileApi.post('/api/Workflow/delWF', this.$objectToFormData(obj));
        if (res.code == 1) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          await this.referData();
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
      })
    },
    async SysWfToProjectWorkFlow() {
      if (!this.currentProject) {
        this.$error('请选择项目');
        return
      }
      let formData = new FormData()
      formData.append('WfID', this.systemWorkflowChecked[0])
      formData.append('projectId', this.currentProject)
      var res = await projectFileApi.post('/api/Workflow/Workflowcopy', formData);
      if (res.code == 1) {
        this.$success(res.msg)
        this.referData()
      }
    },
    async deleteSystemWorkflows() {
      this.isSystemTemplate = true;
      await this.deleteWorkflows();
      //      this.tableDataSystem = await this.querySystemTable();
      //     this.isSystemTemplate = false;
    },
    getXmlDocumentByXmlString(xmlString) {
      var xmlDoc = null;
      if (window.DOMParser) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlString, "text/xml");
      } else {
        //IE
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlString);
      }
      this.xml2json(xmlDoc)
    },
    xmlStr2XmlObj(xmlStr) {
      var xmlObj = {};
      if (document.all) {
        var xmlDom = new ActiveXObject("Microsoft.XMLDOM");
        xmlDom.loadXML(xmlStr);
        xmlObj = xmlDom;
      } else {
        xmlObj = new DOMParser().parseFromString(xmlStr, "text/xml");
      }
      return xmlObj;
    },
    xmlObj2json(xml) {
      var xmlObj = this.xmlStr2XmlObj(xml);
      var jsonObj = {};
      if (xmlObj.childNodes.length > 0) {
        jsonObj = this.xml2json(xmlObj);
      }
      return jsonObj;
    },
    xml2json(xml) {
      try {
        var obj = {};
        if (xml.children.length > 0) {
          for (var i = 0; i < xml.children.length; i++) {
            var item = xml.children.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
              obj[nodeName] = this.xml2json(item);
            } else {
              if (typeof (obj[nodeName].push) == "undefined") {
                var old = obj[nodeName];
                obj[nodeName] = [];
                obj[nodeName].push(old);
              }
              obj[nodeName].push(this.xml2json(item));
            }
          }
        } else {
          obj = xml.textContent;
        }
        return obj;
      } catch (e) { }
    },
    async selectProject() {
      this.isSystemTemplate = false
      this.setWorkflow(false);
      await this.referData();
    },
    async selectProjects() {
      this.getAllTasks();
    },
    async saveToTemplate(xmlJson) {
      this.isSystemTemplate = true;
      this.isAdd = true

      this.tableForm = {
        wfCode: '',
        wfName: this.tableRow.wfName,
        TableName: '',
        FormPath: '',
        ReportPath: '',
      }
      await this.tableSubmitData('saveToTemplate', xmlJson)
      this.isSystemTemplate = false
    },
    // 保存流程版本
    async save(xmlJson, wfID) {
      this.isSaving = true;
      if (!xmlJson) {
        this.$warning('流程未更改')
        this.isSaving = false
      }
      else {
        this.xmlJsonOutput = this.xmlObj2json(xmlJson)
        var obj = new Object();
        obj.WfID = wfID ? wfID : this.WfID // 流程ID
        obj.xmlJson = xmlJson // 流程图
        obj.nodes = []
        obj.exclusiveGateway = []
        if (xmlJson) {
          obj.xmlJson = xmlJson
        } else {
          obj.xmlJson = this.bpmnXmlStr
        }
        this.nodes = []
        var nodesList = []
        this.xmlStrToJsonObj(obj.xmlJson)
        for (let key in this.nodes) {
          var objNode = {}
          for (var i = 0, atts = this.nodes[key].attributes, n = atts.length, arr = []; i < n; i++) {
            objNode[atts[i].nodeName] = this.nodes[key].getAttribute(atts[i].nodeName)
          }
          nodesList.push(objNode)
        }
        var nodesGateway = []
        for (let key in this.nodesGateway) {
          var objNode = {}
          for (var i = 0, atts = this.nodesGateway[key].attributes, n = atts.length, arr = []; i < n; i++) {
            objNode[atts[i].nodeName] = this.nodesGateway[key].getAttribute(atts[i].nodeName)
          }
          nodesGateway.push(objNode)
        }
        var sequenceFlow = []
        for (let key in this.sequenceFlow) {
          var objNode = {}
          for (var i = 0, atts = this.sequenceFlow[key].attributes, n = atts.length, arr = []; i < n; i++) {
            objNode[atts[i].nodeName] = this.sequenceFlow[key].getAttribute(atts[i].nodeName)
          }
          sequenceFlow.push(objNode)
        }
        var ot0 = 'bpmn:definitions'
        var ot1 = 'bpmn:exclusiveGateway'
        var ot2 = 'bpmn:task'
        var ot3 = 'bpmn:incoming'
        var ot4 = 'bpmn:outgoing'
        var ot5 = 'bpmn:process'
        // 拼数据
        // console.log(this.xmlJsonOutput);
        let task = this.xmlJsonOutput['bpmn:definitions']['bpmn:process']['bpmn:task']
        nodesList.forEach((item, key) => {
          item.incoming = []
          item.outgoing = []
          if (nodesList.length == 1) {
            item.incoming.push(task[ot3])
            item.outgoing.push(task[ot4])
          } else if (nodesList.length > 1) {
            item.incoming.push(task[key][ot3])
            item.outgoing.push(task[key][ot4])
          }
          // if (Array.isArray(this.xmlJsonOutput[ot0][ot5][ot2][key][ot4])) {
          //   item.outgoing = this.xmlJsonOutput[ot0][ot5][ot2][key][ot4]
          // } else {
          //   item.outgoing.push(this.xmlJsonOutput[ot0][ot5][ot2][key][ot4])
          // }
        })
        // if(nodesList[nodesList.length-1].stepsType!='state'){
        //   this.$error('最后节点必须为状态节点')
        //   return
        // }

        obj.nodes = JSON.stringify(nodesList)
        nodesGateway.forEach((item, key) => {
          item.incoming = []
          item.outgoing = []
          if (nodesList.length > 1) {
            item.incoming = this.xmlJsonOutput[ot0][ot5][ot1][key][ot3]
            item.outgoing = this.xmlJsonOutput[ot0][ot5][ot1][key][ot4]
          } else {
            item.incoming = this.xmlJsonOutput[ot0][ot5][ot1][ot3]
            item.outgoing = this.xmlJsonOutput[ot0][ot5][ot1][ot4]
          }
        })
        // 对象转数组对象
        nodesGateway.forEach((item) => {
          if (!Array.isArray(item.incoming)) {
            item.incoming = [item.incoming]
          }
          if (!Array.isArray(item.outgoing)) {
            item.incoming = [item.outgoing]
          }
        })
        obj.startEvent = this.xmlJsonOutput[ot0][ot5]['bpmn:startEvent'][ot4]
        obj.endEvent = this.xmlJsonOutput[ot0][ot5]['bpmn:endEvent'][ot3]

        var formData = new FormData()
        formData.append('WfID', obj.WfID)
        formData.append('xmlJson', obj.xmlJson)
        formData.append('nodes', obj.nodes)
        formData.append('startEvent', obj.startEvent)
        formData.append('endEvent', obj.endEvent)
        formData.append('exclusiveGateway', JSON.stringify(nodesGateway))
        formData.append('sequenceFlow', JSON.stringify(sequenceFlow))

        var res = await projectFileApi.post('/api/Workflow/SaveEditCustomWF', formData);

        this.isSaving = false;

        if (res.code == 1) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.WfID = res.data;

          await this.referData()
        } else {
          this.$message({
            message: res.data,
            type: 'error'
          });
        }
      }
    },
    xmlStrToJsonObj(xmlStr) {
      var xmlObj = this.xmlStrToXmlObj(xmlStr);
      var jsonObj = {};
      if (xmlObj.childNodes.length > 0) {
        jsonObj = this.xmlObjToJsonObj(xmlObj.childNodes);
      }
      return jsonObj;
    },
    xmlStrToXmlObj(xmlStr) {
      var xmlObj = {};
      if (document.all) {
        var xmlDom = new ActiveXObject("Microsoft.XMLDOM");
        xmlDom.loadXML(xmlStr);
        xmlObj = xmlDom;
      } else {
        xmlObj = new DOMParser().parseFromString(xmlStr, "text/xml");
      }
      return xmlObj;
    },
    xmlObjToJsonObj(xmlNodes) {
      var obj = {};
      var list = [];
      var listGateway = []
      var sequenceFlow = []
      if (xmlNodes.length == 0) {
        obj = '';
      } else {
        for (var i = 0; i < xmlNodes.length; i++) {
          var node = xmlNodes[i];
          if (node.tagName == "bpmn:task") {
            // obj = node.nodeValue;
            list.push(node)
            this.nodes = list
          }
          if (node.tagName == "bpmn:exclusiveGateway") {
            listGateway.push(node)
            this.nodesGateway = listGateway
          }
          if (node.tagName == "bpmn:sequenceFlow") {
            sequenceFlow.push(node)
            this.sequenceFlow = sequenceFlow
          } else {
            var key = node.tagName;
            var value = this.xmlObjToJsonObj(node.childNodes)
            obj[key] = value;
          }
        }
      }
      return obj;
    },
    workflowManagementOPend() {
      this.$nextTick(() => {
        // this.$refs['workflowManagements'].watchFn()
      })
    },
    async isCanLoadDraft() {
      /*YYY 暂屏蔽 */
      console.log(2);
      var obj = new Object();
      obj.wfID = this.WfID;
      var res = await projectFileApi.post('/api/Workflow/LoadDraft', this.$objectToFormData(obj));
      if (res.code == 1) {
        this.$refs['workflowManagements'].disabledDraft = false;
      } else {
        //   this.$refs['workflowManagements'].loadDraft = false;
      }
    },
    workflowSelect(e) {
      this.workflowChecked = e.map(item => item.id)
    },
    tempWorkflowSelect(e) {
      this.systemWorkflowChecked = e.map(item => item.id)
    },
    async showWorkflow(row) {
      this.isSystemTemplate = false;
      if (this.$refs['tempTable']) this.$refs['tempTable'].setCurrentRow()
      this.tableRow = row
      this.setWorkflow(true); // 打开工作流页面
      row.firstStepID == 0 ? this.newWoker = true : this.newWoker = false
      this.tableName = row.tableName
      this.WfID = row.id
      if (row.whether && row.whether != 'null') {
        this.bpmnXmlStr = row.xmlJson
      } else {
        this.bpmnXmlStr = this.bpmnXmlStrCopy
      }
      this.$nextTick(() => {
        this.$refs['workflowManagements'].createNewDiagram() //流程图重绘
        this.$refs['workflowManagements'].disabled = true //保存默认不能点击
        this.$refs['workflowManagements'].value = '' // 模板清空
      })
      // await this.isCanLoadDraft();
    },
    async showTempWorkflow(row) {
      this.isSystemTemplate = true;
      this.setWorkflow(true); // 打开工作流页面
      this.tableRow = row
      if (this.$refs['picTable']) this.$refs['picTable'].setCurrentRow()

      row.firstStepID == 0 ? this.newWoker = true : this.newWoker = false
      this.tableName = row.tableName
      this.WfID = row.id
      // this.workflowManagementDialogVisible = true
      if (row.whether && row.whether != 'null') {
        this.bpmnXmlStr = row.xmlJson
      } else {
        this.bpmnXmlStr = this.bpmnXmlStrCopy
      }
      this.$nextTick(() => {
        this.$refs['workflowManagements'].createNewDiagram() //流程图重绘
        this.$refs['workflowManagements'].disabled = true //保存默认不能点击
        this.$refs['workflowManagements'].value = '' // 模板清空
      })
      // await this.isCanLoadDraft();
    },
    initForm() {
      this.$nextTick(() => {
        this.tableForm = {
          wfCode: '',
          wfName: '',
          TableName: '',
          FormPath: '',
          ReportPath: ''
        }
        this.$refs['tableForm'].resetFields()
      })
    },
    async submitForm() {
      this.$refs['tableForm'].validate(async (valid) => {
        if (valid) {
          await this.tableSubmitData()
        }
      })
    },
    // 保存流程
    async tableSubmitData(type, xmlJson) {
      // debugger
      var url = this.isAdd ? '/api/Workflow/saveWfInfo?formID=0' : '/api/Workflow/saveWfInfo?formID=' + this.formID
      var formData = this.$objectToFormData(this.tableForm);
      formData.append('projectId', this.getProjectId());
      var res = await projectFileApi.post(url, formData);
      if (res.code == 1) {
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.dialogVisible = false
        if (type == 'saveToTemplate') {

          console.log('dothis');
          this.save(xmlJson, res.twodata.id)
          await this.querySystemTable()
        } else {
          this.referData()
        }
      }
      this.dialogVisible = false;
    },
    buildQueryForm() {
      var projectId = this.getProjectId();
      let queryForm = new FormData();
      queryForm.append('rows', this.leftRows)
      queryForm.append('page', this.leftPage)
      queryForm.append('projectId', projectId)
      //YYY   if (!this.isEmpty(this.tableHeaderLeftFrom.wfname)) {
      //YYY     queryForm.append('wfname', this.tableHeaderLeftFrom.wfname)
      //YYY   }
      return queryForm;
    },
    getProjectId() {
      var projectId = (!this.isSystemTemplate) ? this.currentProject : "SystemWorkflows"; //this.getProjectId();
      return projectId;
    },
    async queryleftTable() {
      if (!this.getProjectId()) return;
      var res = await projectFileApi.post('/api/Workflow/getWorkflowList', this.buildQueryForm());
      if (res.code == 1) {
        this.tableDataLeft = res.data;
      }
    },
    async querySystemTable() {
      this.isSystemTemplate = true;
      var res = await projectFileApi.post('/api/Workflow/getWorkflowList', this.buildQueryForm());
      this.isSystemTemplate = false;
      if (res.code == 1) {
        this.tableDataSystem = res.data
      }
    },
    async referData() {
      if (this.isSystemTemplate) {
        await this.querySystemTable()
      } else {
        await this.querySystemTable()
        await this.queryleftTable()
      }
      // await this.querySystemTable()
    },
    async getAllRoles() {
      this.rolesData = [];
      var formData = new FormData();
      if (this.department.specialtyIUID != "") {
        formData.append('specialtyIUID', this.department.specialtyIUID);
        formData.append('specialtyName', this.department.specialtyName);
      }
      var res = await projectFileApi.post("/api/Permission/GetRoleList", formData);
      if (res.code === 1) {
        this.rolesData = JSON.parse(res.data)
      }
    },
    async getAllDepartment() {
      this.departmentList = [];
      this.departmentList.push({
        specialtyName: '全部',
        specialtyIUID: ''
      });
      var res = await projectFileApi.get("/api/Permission/GetSpecialtyData");
      if (res.code == 1) {
        for (var i = 0; i < res.data.length; i++) {
          this.departmentList.push(res.data[i]);
        }
        await this.getAllRoles();
      }
    },
    handleNewDepartment() {
      this.newNameDialogVisble = true;
    },
    async onSubmitNameInfo() {
      this.newNameDialogVisble = false;
      var formData = new FormData();
      formData.append('specialtyName', this.nameForm.name);
      var res = await projectFileApi.post("/api/Permission/SpecialtySave", formData);
      if (res.code == 1) {
        await this.getAllDepartment();
        this.nameForm.name = ''
      }
    },
  }
}
</script>
<style lang="scss">
.picTable {
  &.el-table{
    &::before{
      height: 0;
    }
  }
  .el-table__row {
    &:last-child {
      .el-table__cell {
        border-bottom: 0 none;
      }
    }
  }
}

.sysTempIcon {
  background-size: 73%;
  background-position: center;
}


.sideWindow {
  width: 70vw;
  background-color: #fff;
  height: calc(100vh - 51px);
  position: absolute;
  right: -70vw;
  z-index: 502;
  top: 0;
  transition: all .3s;
}

.lt-tab-pane {
  .app-container {
    padding: 0;
    padding-top: 30px;
  }
}

.wrap {
  // width: 100%;
  height: 100%;
  display: flex;
}

.lfb {
  height: calc(55vh - 29px);
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

.wrap .rt {
  width: 400px;
  height: 100%;
  overflow-y: auto;
  flex: 1;
  padding-right: 20px;
}

.task-block {
  display: block;
  margin: 3px 2px 12px 3px;
  background: #f7f7ee;
  padding: 5px;
  box-shadow: 1px 1px 2px #ccc;
  border-radius: 6px;
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

// .chart-block {
//   height: 100%;
//   border: 1px solid #d6dae3;
//   display: inline-block;
//   border-radius: 6px;
//   background: white;
// }

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

.el-progress-bar {
  padding-right: 0;
}

.el-progress-bar__inner {
  border-radius: 0 !important;
}

.el-progress-bar__outer {
  border-radius: 0 !important;
  height: 15px !important;
  background-color: #2b426c !important;
}

.el-progress__text {
  display: none;
}

.progressBox {
  width: 100%;
  height: calc(45vh - 100px);
  overflow-y: auto;
}

.progressTitle {
  color: black;
  font-size: 14px;
  font-family: '微软雅黑';
  letter-spacing: 1px;
  margin: 10px;
  position: relative;
}

.progressItem {
  width: calc(100% - 35px);
  margin-left: 20px;
  margin-top: 15px;
  font-size: 14px;
  color: #aec9db;
}

.progressFont {
  width: 130px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  margin-right: 10px;
}

.progress {
  flex-grow: 1;
}

.dot {
  margin-right: 11px;
}

.sort {
  margin-right: 25px;
}

.number {
  margin-left: 15px;
}

.topContainer {
  position: absolute;
  top: 30px;
  margin-right: 520px;
  right: 0;
  width: 100%;
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

.mapCharts {
  margin-top: 10px;
  width: 95%;
  // height: 80%
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
<style scoped lang="scss">
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
</style>
