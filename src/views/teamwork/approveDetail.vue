<!-- 校审单详情页 -->

<template>
  <div
    v-loading="loading"
    class="detailPage hide-scroll"
  >
    <el-button
      type="text"
      class="closeBtn"
      icon="el-icon-close"
      @click="close"
    />
    <template v-if="!loading">
      <div class="top-flex">
        <div
          class="flex ai-center head bg_w pd_10"
          style=""
        >
          <div class="title">
            {{ approveData.userName }}
            <span style="font-weight: 400;font-size: 14px;margin-left: 20px;">提交的文件审核</span>
          </div>
          <div class="divider" />
          <div
            class="name"
            style="font-size: 14px;"
          >
            <span>编号：{{ approveData.codenumber }}</span>
          </div>
          <div
            v-if="approveData.status === '0'"
            class="flex ai-center svg downloadSvg"
            @click="exportData"
          >
            <img
              src="@/assets/iconImg/download.png"
              style="width: 15px;margin-right: 5px;"
            >
            <span> 校审单下载 </span>
          </div>
          <!-- <img src="@/assets/iconimg/print.svg" class="svg ml_15" @click="print" /> -->
        </div>
        <div class="pd_10 info-box flex bg_w jc-between">
          <div
            v-for="(item, idx) in itemList"
            :key="idx"
            class="info-item flex ai-center"
          >
            <div class="itemLabel">
              {{ item.title }}：
            </div>
            <div class="itemText">
              {{ approveData[item.code] }}
            </div>
          </div>
        </div>
      </div>
      <!-- 文件列表 -->
      <div
        class="bg_w pd_10 pt_114"
        style="position: relative;"
      >
        <div
          class="flex"
          style="margin-bottom: 15px"
        >
          <span style="margin-right: 100px">文件列表</span>
          <!-- <span style="color: #0d99ff; font-size: 14px; cursor: pointer" @click="exportData" v-if="approveData.status === '0'">校审单下载</span> -->
        </div>
        <img
          v-if="approveData.status === '0'"
          src="@/assets/iconImg/approveSuccess.svg"
          class="approve-status-icon"
        >
        <img
          v-if="approveData.status === '5'"
          src="@/assets/iconImg/reject.svg"
          class="approve-status-icon"
        >
        <img
          v-if="approveData.status === '3'"
          src="@/assets/iconImg/revoke.svg"
          class="approve-status-icon"
        >
        <el-table
          ref="fileTable"
          class="detailTable"
          :border="true"
          :data="approveData.data"
          :header-cell-style="tableHeadStyle"
          @selection-change="filterFile"
        >
          <el-table-column
            type="selection"
            align="center"
          />
          <el-table-column
            align="center"
            :label="$t('base.button.fileName')"
            prop="fileName"
          />
          <el-table-column
            align="center"
            width="180"
            label="版本"
            prop="versionNumber"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.versionNumber || "" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="180"
            label="文件操作"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.fileSuffix.toLowerCase() == ''"
                type="text"
                size="small"
                style="margin-left: 5px"
                @click="showFileList(scope.row)"
              >
                打开文件夹
              </el-button>
              <el-button
                v-if="scope.row.fileSuffix.toLowerCase() != '' && isMyApprove && approveData.isEdit"
                type="text"
                size="small"
                style="margin-left: 5px"
                @click="versionClick(scope.row)"
              >
                更新
              </el-button>
              <el-button
                v-if="scope.row.fileSuffix != ''"
                type="text"
                size="small"
                @click="viewMode(scope.row)"
              >
                {{ $t('base.button.view') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 校审信息 -->
      <div
        class="bg_w pd_10"
        style="margin-bottom: 0"
      >
        <div
          class="flex"
          style="margin-bottom: 15px"
        >
          <span>校审信息</span>
          <el-button
            v-if="approveData.isAdd"
            size="small"
            type="primary"
            style="margin-left: 10px"
            @click="addApproveInfo"
          >
            {{ $t('base.button.create') }}
          </el-button>
        </div>
        <el-table
          class="detailTable infoTable"
          stripe
          border
          :data="apprpveInfo"
          :header-cell-style="tableHeadStyle"
        >
          <el-table-column
            align="center"
            :label="$t('base.button.index')"
            width="120px"
            type="index"
          />
          <el-table-column
            align="center"
            label="审批人"
            prop="userName"
          />
          <el-table-column
            align="center"
            label="审批意见"
            prop="approveidea"
          />
          <el-table-column
            align="center"
            label="提出时间"
            prop="posetime"
          />
          <el-table-column
            align="center"
            label="设计回复"
            prop="designanswer"
          />
          <el-table-column
            align="center"
            label="回复时间"
            prop="answertime"
          />
          <el-table-column
            align="center"
            label="意见定位"
          >
            <template slot-scope="scope">
              <el-button
                v-if="!!scope.row.imodelDataIUID"
                type="text"
                size="small"
                @click="positionLabel(scope.row)"
              >
                {{ $t('base.button.view') }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="意见状态"
            prop="opinionstatus"
          >
            <template slot-scope="scope">
              <el-select
                v-if="scope.row.isstatus"
                v-model="scope.row.opinionstatus"
                size="small"
                @change="changeStauts(...arguments, scope.row.iuid)"
              >
                <el-option value="复核通过" />
                <el-option value="复核不通过" />
              </el-select>
              <div
                v-else
                :class="scope.row.opinionstatus == '复核不通过' ? 'red' : scope.row.opinionstatus == '复核通过' ? 'green' : ''"
              >
                {{ scope.row.opinionstatus }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="130px"
            :label="$t('base.formLabel.operation')"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.isanswer"
                size="mini"
                type="text"
                @click="editApproveInfo(scope.row, 'reply')"
              >
                回复
              </el-button>
              <el-button
                v-if="scope.row.iseditdel"
                size="mini"
                type="text"
                @click="editApproveInfo(scope.row, 'edit')"
              >
                {{ $t('base.button.edit') }}
              </el-button>
              <el-button
                v-if="scope.row.iseditdel"
                size="mini"
                type="text"
                @click="deleteInfo(scope.row)"
              >
                <span :style="{ color: scope.row.iseditdel ? '#f56c6c' : '#f56c6c66' }">{{ $t('base.button.delete') }}</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 底部按钮 -->
      <div class="footer-box flex">
        <div
          v-if="approveData.status != 3 && approveData.status != 0 && approveData.status != 5"
          class="flex"
          style="width: 100%;"
        >
          <div>
            <el-button
              v-if="approveData.isrevoke"
              size="small"
              type="primary"
              plain
              @click="submitRevoke"
            >
              撤回
            </el-button>
            <el-button
              v-if="isMyApprove && (showOperBtn == -1 || showOperBtn == -2)"
              size="small"
              :disabled="!approveData.isEdit"
              type="primary"
              @click="showSubmit('提交')"
            >
              重新提交
            </el-button>
          </div>
          <div
            v-if="showOperBtn == 0"
            style="margin-left: auto;"
          >
            <el-popover
              ref="reject"
              placement="top"
              width="100"
              :visible-arrow="true"
              style="margin: 0 5px;"
              popper-class="popover"
              trigger="click"
            >
              <div class="flex column">
                <el-button
                  style="margin:0;width:80px"
                  type="text"
                  size="small"
                  @click="showSubmit(4)"
                >
                  修改再审
                </el-button>
                <el-button
                  style="margin:0;width:80px"
                  type="text"
                  size="small"
                  @click="showSubmit(3)"
                >
                  重启流程
                </el-button>
              </div>
              <el-button
                slot="reference"
                size="small"
                plain
              >
                退回 <i class="el-icon-arrow-up" />
              </el-button>
            </el-popover>
            <el-button
              size="small"
              :disabled="!canHandover(approveItem)"
              type="primary"
              @click="handoverTask(approveItem)"
            >
              转交
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="showSubmit(2)"
            >
              拒绝
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="showSubmit(0)"
            >
              同意
            </el-button>
          </div>
        </div>
      </div>
      <!-- 选择转交人 -->
      <el-dialog
        v-dialogDrag
        append-to-body
        title="选择转交人"
        :close-on-click-modal="false"
        width="425px"
        :visible.sync="transferVisible"
      >
        <el-checkbox-group
          v-model="responsiblePersonChecked"
          class="select-person-container"
        >
          <div
            v-for="(item, index) in rolePersonData"
            :key="index"
            style="padding: 0px 8px; margin: 0px; display:flex; align-items: center; height: 30px"
          >
            <el-checkbox
              :key="index"
              class="person-option"
              :disabled="item.userID == user.userID"
              style="display:block;margin-top:10px"
              :value="item"
              :label="item"
            >
              {{ item.userName }}
            </el-checkbox>
          </div>
        </el-checkbox-group>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="small"
            @click="transferVisible = false"
          >
            {{ $t('base.button.cancel') }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="submitTransfer"
          >
            {{ $t('base.button.confirm') }}
          </el-button>
        </div>
      </el-dialog>
      <!-- 提交信息 -->
      <el-dialog
        append-to-body
        :visible.sync="submitVisible"
        width="450px"
        :title="`${submitType == 'submit' ? '提交' : '审批'}结果`"
        @close="close1"
      >
        <el-form class="approve-form">
          <template v-if="submitType == 'submit'">
            <el-form-item label="提交结果：">
              <el-radio-group v-model="approveResult">
                <el-radio label="0">
                  已修改
                </el-radio>
                <el-radio label="1">
                  不予修改
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="提交信息：">
              <el-input
                v-model="approveOpinion"
                type="textarea"
                :rows="4"
                placeholder="请输入提交信息"
              />
            </el-form-item>
          </template>

          <template v-else-if="submitType == 'approve'">
            <el-form-item
              v-if="module === 'share' || module === 'download'"
              label="审批内容："
            >
              <div>{{ nodeName }}</div>
            </el-form-item>

            <el-form-item
              v-if="module === 'share' || module === 'download'"
              label="审批结果："
            >
              <el-radio-group v-model="approveResult">
                <el-radio :label="0">
                  同意
                </el-radio>
                <el-radio :label="2">
                  拒绝
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              v-else
              label="审批结果："
            >
              <div>{{ approveResult | resultMap }}</div>
            </el-form-item>
            <el-form-item label="审批意见：">
              <el-input
                v-model="approveOpinion"
                type="textarea"
                :rows="4"
                placeholder="请输入审批意见"
              />
            </el-form-item>
          </template>
        </el-form>

        <template
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="small"
            @click="submitVisible = false"
          >
            {{ $t('base.button.cancel') }}
          </el-button>
          <el-button
            v-if="submitType == 'approve'"
            type="primary"
            size="small"
            @click="submitReturn"
          >
            {{ $t('base.button.confirm') }}
          </el-button>
          <el-button
            v-if="submitType == 'submit'"
            type="primary"
            size="small"
            @click="submitResult"
          >
            {{ $t('base.button.confirm') }}
          </el-button>
        </template>
      </el-dialog>
      <!-- 校审信息 -->
      <el-dialog
        append-to-body
        :visible.sync="approveInfoDialogVisible"
        width="450px"
        :title="approveInfoType + '校审信息'"
        :before-close="(done) => { this.$refs['approveInfoForm'].clearValidate(); done() }"
      >
        <el-form
          ref="approveInfoForm"
          :model="approveInfoForm"
          :rules="approveInfoFormRules"
          label-width="120px"
          size="small"
        >
          <el-form-item
            label="所属文件："
            prop="approveidea"
          >
            <el-select
              v-model="approveInfoForm.FileIUID"
              :disabled="approveInfoType != $t('base.button.add')"
              placeholder="请选择文件"
              clearable
            >
              <el-option
                v-for="item in fileOptions"
                :key="item.fileIUID"
                :label="item.fileName"
                :value="item.fileIUID"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="审批意见："
            prop="approveidea"
            :rules="{ required: true, message: '审批意见不能为空', trigger: 'blur' }"
          >
            <el-input
              v-model="approveInfoForm.approveidea"
              type="textarea"
              :disabled="approveInfoType == '回复'"
              placeholder="请输入内容"
              style="width: 100%"
              :rows="4"
            />
          </el-form-item>
          <template v-if="isMyApprove && approveItem.status < 0">
            <el-form-item
              label="设计回复："
              prop="designanswer"
              :rules="{ required: true, message: '设计回复不能为空', trigger: 'blur' }"
            >
              <el-input
                v-model="approveInfoForm.designanswer"
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                style="width: 100%"
              />
            </el-form-item>
          </template>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="small"
            @click="() => { approveInfoDialogVisible = false; this.$refs['approveInfoForm'].clearValidate() }"
          >
            {{ $t('base.button.cancel') }}
          </el-button>
          <el-button
            v-if="approveInfoType == $t('base.button.add')"
            size="small"
            type="primary"
            @click="submitReply('add')"
          >
            提 交
          </el-button>
          <el-button
            v-if="approveInfoType == '回复'"
            size="small"
            type="primary"
            @click="submitReply('reply')"
          >
            提 交
          </el-button>
          <el-button
            v-if="approveInfoType == $t('base.button.edit')"
            size="small"
            type="primary"
            @click="submitReply('edit')"
          >
            提 交
          </el-button>
        </div>
      </el-dialog>
      <!-- 选择下一步 -->
      <AssignWorkflowTask
        :dialog-visible.sync="assignWorkflowDialogVisible"
        :task-data="nextTask"
        @reload="getData"
        @parentClose="close"
      />
      <!-- 版本 -->
      <versionViewComponeds
        :is-approve="true"
        :center-dialog-visible.sync="versionDialogVisible"
        :row-data="versionData"
        :selected-data="versionFile"
        @queryADDVersion="queryVersionData"
        @sureVersion="getData"
      />
      <!-- 文件夹审核 -->
      <el-dialog
        v-dialogDrag
        style="z-index:505"
        :modal-append-to-body="false"
        title="文件列表"
        :visible.sync="fileListVisible"
        width="500"
      >
        <el-table
          :data="fileList"
          border
          :header-cell-style="$thStyle"
          stripe
        >
          <el-table-column
            type="index"
            align="center"
            width="60"
            :label="$t('base.button.index')"
          />
          <el-table-column
            prop="fileName"
            align="center"
            label="文件列表"
          />
          <el-table-column
            prop="version"
            width="120"
            align="center"
            label="版本"
          />
          <el-table-column
            align="center"
            width="180"
            label="文件操作"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.fileSuffix.toLowerCase() == ''"
                type="text"
                size="small"
                style="margin-left: 5px"
                @click="showFileList(scope.row)"
              >
                打开文件夹
              </el-button>
              <el-button
                v-if="scope.row.fileSuffix.toLowerCase() != '' && isMyApprove && approveData.isEdit"
                type="text"
                size="small"
                style="margin-left: 5px"
                @click="versionClick(scope.row)"
              >
                更新
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="viewMode(scope.row)"
              >
                {{ $t('base.button.view') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer">
          <el-button @click="fileListVisible = false">{{ $t('base.button.close') }}</el-button>
        </span>
      </el-dialog>
    </template>

    <iframe
      v-if="showModel"
      ref="imodelIframe"
      :src="modelPreViewInitUrl"
      class="iframe"
      style="background-color: white"
      @load="sendFileData"
    />
  </div>
</template>

<script>
import moment from 'moment'
import conversionApi from "@/api/project/file";
import AssignWorkflowTask from "@/components/assignWorkflowTask.vue";
import versionViewComponeds from "@/components/versionView";
import postApi from "@/api/document/indexApi.js";
import { decrypt, encrypt } from '@/utils'
import { MessageBox } from "element-ui";
import request from '../../utils/request'
import i18n from '../../../static/locales'

export default {
  filters: {
    resultMap(val) {
      let resList = {
        0: '同意',
        1: '转交',
        2: '拒绝',
        3: '重启流程',
        4: '修改再审'
      }
      return resList[val]
    }
  },
  components: {
    AssignWorkflowTask,
    versionViewComponeds,
  },
  props: ["showDetail", "approveId", "loadWorkflowList", "queryApproveCount", "getAllTasks", "approveFileList", "module"],
  data() {
    return {
      fileListVisible: false,
      fileList: [],
      isLastStep: 0,
      nodeName: '',
      showOperBtn: null,
      approveItem: {},
      approveOpinion: '',
      selectFile: [],
      submitVisible: false,
      approveResult: null,
      submitType: null,

      approveFilesTree: [],
      // 下一个任务
      assignWorkflowDialogVisible: false,
      nextTask: { // 下一个任务的信息
        projectId: '', // 项目iuid
        workflowId: null, // 该任务对应的流程发起记录ID
        wfID: null, // 流程定义中的流程ID
        wfName: null, // 流程定义中的流程名称
        taskID: null, // 流程定义中的任务ID
        taskName: '',
        roleIDs: null, // 流程定义中的角色人员
        endTime: null,
        relatedFiles: null, // 关联文件完整信息
      },


      itemList: [
        { title: "项目名称", code: "projectName" },
        { title: "流程名称", code: "workflowName" },
        { title: "审批阶段", code: "nodename" },
        { title: "发起时间", code: "applyTime" },
      ],
      data: {},
      approveInfoDialogVisible: false,
      approveInfoType: i18n.t('base.button.add'),
      approveInfoForm: {

      },
      fileOptions: [],

      approveInfoFormRules: {},
      // base
      tableHeadStyle: {
        background: "#EBEEF5",
        border: "0px solid #DDDDDD",
        height: "10px",
        color: "#2B579A",
      },
      loading: true,
      showViewer: false,
      searchRules: {
        nonpermajor: "",
      },
      // 版本
      versionDialogVisible: false,
      versionData: [],
      versionFile: [],
      selectArray: [],

      approveData: {},
      urlList: [],
      isResubmit: false,
      apprpveInfo: [],
      selectProps: {
        multiple: true,
        emitPath: false,
      },
      problemLevelList: [
        {
          label: "严重错误",
        },
        {
          label: "可提升",
        },
        {
          label: "待核实",
        },
      ], //问题等级
      opinionsStatusList: [
        {
          label: "复核通过",
        },
        {
          label: "复核不通过",
        },
      ], //意见状态
      selectOptions: [],
      selectryid: [], //审核人检索
      auditstatus: "", //审批意见
      rolePersonData: [],
      transferVisible: false,
      responsiblePersonChecked: [],
      modelPreViewInitUrl: '',
      showModel: false,
      selectImodelFile: {},
      imodelAuditCountInfoDialog: false,
      iframeLoading: null
    };
  },
  computed: {
    imodelAuditCountInfo() {
      return {
        total: this.apprpveInfo.filter(item => item.imodelDataIUID && item.fileIUID === this.selectImodelFile.iuid).length,
        replied: this.apprpveInfo.filter(item => item.imodelDataIUID && item.fileIUID === this.selectImodelFile.iuid).filter(item => item.designanswer).length
      }
    },

    showBtn() {
      let flag = true;
      flag =
        this.approveData.flowstate == "已撤回"
          ? false
          : this.approveData.flowstate == "已完成"
            ? false
            : true;
      return flag;
    },
    user() {
      return this.$store.state.user.user;
    },
    isMyApprove() {
      return this.approveData.applyPerson == this.user.userID;
    },
  },
  watch: {
    approveId: {
      deep: true,
      handler(news, olds) {
        if (news != undefined) {
          this.getData();
          this.getFileOptions()
        }
      }
    },

    showModel(value) {
      if (value) {
        this.iframeLoading = this.$loading({
          target: document.querySelector('.iframe'),
          background: 'transparent',
          fullscreen: false,
          body: false
        })
      }
    }
  },
  async mounted() {
    if (this.approveId != null && this.approveId != '' && this.approveId != undefined) {
      this.getData();
      this.getFileOptions()
    }
    this.$iframeListener(this.messageReceived);

    if (this.module !== 'share' && this.module !== 'download') {
      let formData = new FormData()
      formData.append('iuid', this.approveId)
      let res = await postApi.post('/api/projectworkflow/FileTree', formData)
      if (res.code == 1) {
        res.data.forEach((item) => {
          this.transTreeData(item);
        });

        this.approveFilesTree = res.data
      }
    } else {
      this.showSubmit(0)
    }
  },
  beforeDestroy() {
    this.close()
    this.$removeIframeListener(this.messageReceived)
  },
  methods: {
    close1() {
      if (this.module === 'share' || this.module === 'download') {
        this.$emit("update:showDetail", false);
      }
    },

    findFolder(tree, iuid) {
      if (tree.children.filter(item => item.iuid == iuid).length > 0) {
        this.fileList = tree.children.filter(item => item.iuid == iuid)[0].children
      } else {
        tree.children.forEach(item => {
          this.findFolder(item, iuid)
        })
      }
    },
    async showFileList(e) {
      this.fileListVisible = true;
      this.findFolder(this.approveFilesTree[0], e.iuid)  //递归遍历查询文件夹数据
    },
    getItemFolder(tree, iuid) {
      for (const treeElement of tree) {
        if (treeElement.iuid === iuid) {
          return treeElement
        }

        if (treeElement.children && treeElement.children.length) {
          let res = this.getItemFolder(treeElement.children, iuid)

          if (res) {
            return res
          }
        }
      }
    },

    getFolderFirstFile(tree) {
      for (const treeElement of tree) {
        if (treeElement.fileSuffix && treeElement.turnPath) {
          return treeElement
        }

        if (treeElement.children && treeElement.children.length) {
          let res = this.getFolderFirstFile(treeElement.children)

          if (res) {
            return res
          }
        }
      }
    },

    transTreeData(data) {
      data.filePath = decrypt(data.filePath || "");
      data.turnPath = decrypt(data.turnPath || "");

      if (data.children && data.children.length) {
        data.children.forEach((item) => {
          this.transTreeData(item);
        });
      }
    },
    exportData() {
      window.open(process.env.VUE_APP_BASE_API + `/api/projectworkflow/ProofreadingSetExport?iuid=${this.approveId}`)
    },
    messageReceived(res) {
      if (res.data.command === "ImodelClose") {
        this.showModel = false
        this.imodelAuditCountInfoDialog = false
      } else if (res.data.command === "loadedImodel") {
        if (this.showModel) this.imodelAuditCountInfoDialog = true
      } else if (res.data.command === "addImodelApprove") {
        let formData = new FormData()
        formData.append('MainIUID', this.approveData.iuid)
        formData.append('FileIUID', this.selectImodelFile.iuid)
        formData.append('approveidea', res.data.data.approveidea)
        formData.append('jsontext', res.data.data.jsontext)

        request.post('/api/projectworkflow/OperateProofreadImodelData', formData).then((res) => {
          if (res.code === 1) {
            this.$message.success('操作成功')
            this.getInfo().then(() => {
              this.$iframePostMes(this.$refs.imodelIframe.contentWindow, 'kjApprovalData', {
                bwVersionName: 'kj',
                apprpveInfo: this.apprpveInfo.filter(item => item.imodelDataIUID && item.fileIUID === this.selectImodelFile.iuid),
                approveData: this.approveData
              })
            })
          }
        })
      } else if (res.data.command === "modifyImodelApprove") {
        let formData = new FormData()
        formData.append('IUID', res.data.data.iuid)
        formData.append('approveidea', res.data.data.approveidea)
        formData.append('jsontext', res.data.data.jsontext)

        request.post('/api/projectworkflow/OperateProofreadImodelData', formData).then((res) => {
          if (res.code === 1) {
            this.$message.success('操作成功')
            this.getInfo().then(() => {
              this.$iframePostMes(this.$refs.imodelIframe.contentWindow, 'kjApprovalData', {
                bwVersionName: 'kj',
                apprpveInfo: this.apprpveInfo.filter(item => item.imodelDataIUID && item.fileIUID === this.selectImodelFile.iuid),
                approveData: this.approveData
              })
            })
          }
        })
      } else if (res.data.command === "replyImodelApprove") {
        let formData = new FormData()
        formData.append('IUID', res.data.data.iuid)
        formData.append('opinionstatus', '待复核')
        formData.append('designanswer', res.data.data.designanswer)
        formData.append('answertime', res.data.data.answertime)

        request.post('/api/projectworkflow/imodelanswerDataEdit', formData).then((res) => {
          if (res.code === 1) {
            this.$message.success('操作成功')
            this.getInfo().then(() => {
              this.$iframePostMes(this.$refs.imodelIframe.contentWindow, 'kjApprovalData', {
                bwVersionName: 'kj',
                apprpveInfo: this.apprpveInfo.filter(item => item.imodelDataIUID && item.fileIUID === this.selectImodelFile.iuid),
                approveData: this.approveData
              })
            })
          }
        })
      } else if (res.data.command === "changeApproveState") {
        let formData = new FormData()
        formData.append('IUID', res.data.data.iuid)
        formData.append('opinionstatus', res.data.data.opinionstatus)

        request.post('/api/projectworkflow/OperateProofreadData', formData).then((res) => {
          if (res.code === 1) {
            this.$message.success('操作成功')
            this.getInfo().then(() => {
              this.$iframePostMes(this.$refs.imodelIframe.contentWindow, 'kjApprovalData', {
                bwVersionName: 'kj',
                apprpveInfo: this.apprpveInfo.filter(item => item.imodelDataIUID && item.fileIUID === this.selectImodelFile.iuid),
                approveData: this.approveData
              })
            })
          }
        })
      } else if (res.data.command === 'ModelChange') {
        let fileItem = this.getItemFolder(this.approveFilesTree, res.data.data.iuid)

        if (fileItem) {
          this.selectImodelFile = { ...fileItem }
        }
      } else if (res.data.command === 'updateApprpveInfo') {
        this.getInfo().then(() => {
          this.$iframePostMes(this.$refs.imodelIframe.contentWindow, 'kjApprovalData', {
            bwVersionName: 'kj',
            apprpveInfo: this.apprpveInfo.filter(item => item.imodelDataIUID && item.fileIUID === this.selectImodelFile.iuid),
            approveData: this.approveData
          })
        })
      }
    },

    sendFileData() {
      if (this.iframeLoading) {
        this.iframeLoading.close()
      }

      this.$iframePostMes(this.$refs.imodelIframe.contentWindow, 'CurrentFile', this.selectImodelFile)

      // this.$iframePostMes(
      //   this.$refs.imodelIframe.contentWindow,
      //   'bimwindows',
      //   {
      //     treeData: this.approveFilesTree,
      //     currentProj: {
      //       ...this.approveFilesTree[0],
      //       children: null
      //     },
      //     currentFile: this.selectImodelFile,
      //   }
      // );

      this.$iframePostMes(this.$refs.imodelIframe.contentWindow, 'kjApprovalData', {
        bwVersionName: 'kj',
        apprpveInfo: this.apprpveInfo.filter(item => item.imodelDataIUID && item.fileIUID === this.selectImodelFile.iuid),
        approveData: this.approveData,
        positionLabelIuid: this.positionIuid
      })
    },

    positionLabel(row) {
      let fileIUID = row.fileIUID
      let currentFile = this.getItemFolder(this.approveFilesTree, fileIUID)

      let query = "path=" + currentFile.turnPath + "&editable=0" + "&selectFile=0"
      this.modelPreViewInitUrl = process.env.VUE_APP_KmwOrigin + "/?" + encrypt(encodeURIComponent(query))
      this.selectImodelFile = { ...currentFile }
      this.positionIuid = row.iuid

      localStorage.setItem('approve', JSON.stringify(true))
      localStorage.setItem('CurrentFile', JSON.stringify(this.selectImodelFile))
      localStorage.setItem('kjApprovalData', JSON.stringify({
        bwVersionName: 'kj',
        apprpveInfo: this.apprpveInfo.filter(item => item.imodelDataIUID && item.fileIUID === this.selectImodelFile.iuid),
        approveData: this.approveData,
        positionLabelIuid: this.positionIuid
      }))

      let copyRow = { ...row, iuid: row.fileIUID }

      this.showTransferView(this.$appList.find((item) => item.type == 'bimwindows'), copyRow)

      // this.showModel = true
    },

    // 筛选文件关联校审信息
    filterFile(e) {
      this.selectFile = e.map(item => item.iuid);
      this.getInfo()
    },
    // 显示提交对话框
    showSubmit(type) {
      this.submitType = type == '提交' ? 'submit' : 'approve'
      this.isResubmit = type == '提交' ? '重新提交' : false
      this.approveOpinion = "";
      this.approveResult = type == '提交' ? '0' : type
      this.$forceUpdate()
      this.submitVisible = true;
    },
    // 是否可转交
    canHandover(item) {
      if (!item || !item.roles) return false;
      if (item.roles.length == 1 && item.roles[0].type == 1) return false; // 只有一个承担人肯定就是‘自己’
      for (var i = 0; i < item.roles.length; i++) {
        if (item.roles[i].type != 1) return true; // 指定的是角色，可以另选
      }
      return false;
    },
    /* 发起转交 */
    handoverTask(item) {
      this.approveResult = 1;
      this.rolePersonData = [];
      for (var i = 0; i < item.roles.length; i++) {
        if (item.roles[i].type != 1) { // 是角色
          for (var j = 0; j < item.roles[i].roleNameList.length; j++) {
            this.rolePersonData.push(item.roles[i].roleNameList[j]);
          }
        }
      }
      this.transferVisible = true;
      this.responsiblePersonChecked = [];
    },
    // 获取角色人员
    async getAllUsersOfRole(roleIDs) {
      var roles = [];
      for (var i = 0; i < roleIDs.length; i++) {
        let queryForm = new FormData();
        queryForm.append('roleID', roleIDs[i].roleID);
        queryForm.append('ProjectIUID', this.approveItem.projectId);
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
    // 得到任务节点的承担人信息
    async getTaskRoles(task) {
      let queryForm = new FormData();
      queryForm.append('WfID', task.wfID);
      queryForm.append('ID', task.taskID);
      var res = await postApi.post('/api/Workflow/GetWfStepList', queryForm);
      var roles = [];
      if (res.code == 1) {
        this.isLastStep = res.data[0].isLastStep
        this.nodeName = res.data[0].name
        var roleIDs = res.data[0].roleIDs;
        roles = await this.getAllUsersOfRole(roleIDs);
      }
      return roles;
    },

    async getFileOptions() {
      let formData = new FormData();
      formData.append("iuid", this.approveId);
      var res = await postApi.post('/api/projectworkflow/GetFilepullData', formData);
      if (res.code) {
        this.fileOptions = res.data
      }
    },

    onselectionchange(e) {
      this.selectryid = e;
      this.getInfo();
    },
    // 获取审核详情数据
    async getData() {
      if (this.module !== 'share' && this.module !== 'download') {
        let formdata = new FormData();
        formdata.append("iuid", this.approveId);
        let res = await postApi.post(
            "/api/projectworkflow/GetFileWorkflowdetailsData",
            formdata
        );

        if (res.code == 1) {
          res.data.data.forEach((item) => {
            item.filePath = decrypt(item.filePath);
            item.turnPath = decrypt(item.turnPath);
          });
          this.approveData = res.data
          this.getInfo();
        }
      }

      let taskFormdata = new FormData();
      taskFormdata.append('id', this.approveId);
      let res2 = await postApi.post(
          "/api/projectworkflow/workflowPathTableData",
          taskFormdata
      );
      if (res2.code) {
        let datas = res2.data.filter(item => item.undertaker == this.user.userID)
        let data = datas.filter(item => item.status <= 0)[0]
        if (data != undefined) {
          this.showOperBtn = data.status;
          var files = [];
          var idStrs = (!data.relatedFiles) ? "" : data.relatedFiles.split(";");
          for (var k = 0; k < idStrs.length; k++) {
            files.push({
              iuid: idStrs[k],
              item: null
            });
          }
          this.approveItem = {
            iuid: data.iuid,
            workflowId: data.id,
            wfID: data.workflowGuid,
            wfName: data.workflowName,
            taskName: data.taskName,
            taskID: data.taskID,
            applyID: data.creatorID,
            apply: data.creatorName,
            applyTime: data.createTime,
            endTime: (!data.endTime ? "未定" : data.endTime),
            projectId: data.projectiuid,
            projectName: data.projectName,
            attachFiles: files,
            opinion: data.opinion,
            resulttext: data.resulttext,
            status: data.status,
            roles: []
          }
          await this.getItem(this.approveItem.projectId, this.approveItem.attachFiles); // 得到关联的文件信息
          this.approveItem.roles = await this.getTaskRoles(this.approveItem) // 得到任务节点的承担人信息
        }
      }

      setTimeout(() => {
        this.loading = false;
      }, 100);
    },
    // 得到文件路径
    async getItem(projectId, files) {
      for (var i = 0; i < files.length; i++) {
        var item = null;
        var url = "/api/ProjectManagement/GetMasterfileData?IUID=" + projectId + '&FileIUID=' + files[i].iuid;
        var res = await postApi.post(url);
        if (res.code == 1) {
          files[i].item = res.data;
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
    // ===============校审信息函数===============
    // 获取校审信息表
    async getInfo() {
      let formdata = new FormData();
      formdata.append("iuid", this.approveData.iuid);
      formdata.append("FileIUID", this.selectFile.join(','));
      if (this.selectryid) {
        formdata.append("selectryid", this.selectryid.join(","));
      }
      let res = await postApi.post(
        "/api/projectworkflow/getFormTransferData",
        formdata
      );
      if (res.code == 1) {
        this.apprpveInfo = res.data.map((item) => {
          return {
            ...item,
            yjview: item.yjview
              ? process.env.VUE_APP_BASE_API + "/" + item.yjview
              : null,
            hfview: item.hfview
              ? process.env.VUE_APP_BASE_API + "/" + item.hfview
              : null,
            isMyApprove: item.creatorID == this.user.userid,
          };
        });
      }
    },
    // 添加校审信息
    addApproveInfo() {
      this.approveInfoForm = {};
      this.approveInfoType = this.$t('base.button.add');
      this.approveInfoDialogVisible = true;
    },
    // 编辑校审信息
    editApproveInfo(item, type) {
      this.approveInfoType = type == "edit" ? this.$t('base.button.edit') : "回复";
      this.approveInfoForm = {
        ...item,
        FileIUID: item.fileIUID
      };
      this.approveInfoDialogVisible = true;
    },
    // 提交校审信息 新增 修改 回复
    submitReply(type) {
      this.$refs['approveInfoForm'].validate((r) => {
        if (r) {
          let data = JSON.parse(JSON.stringify(this.approveInfoForm));
          let formdata = new FormData();
          if (type == 'add') {
            formdata.append("MainIUID", this.approveData.iuid);
            formdata.append("FileIUID", data.FileIUID);
            formdata.append("groupID", data.FileIUID);
            formdata.append("approveidea", data.approveidea);
          } else if (type == 'reply') {
            formdata.append("IUID", data.iuid);
            formdata.append("opinionstatus", '待复核');
            formdata.append("designanswer", data.designanswer);
            formdata.append("answertime", moment().format('YYYY-MM-DD HH:mm:ss.SSS'));
          } else if (type == 'edit') {
            formdata.append("IUID", data.iuid);
            formdata.append("approveidea", data.approveidea);
          }
          this.submitInfo(formdata)
        }
      })
    },
    // 提交校审信息函数
    async submitInfo(formdata) {
      let res = await postApi.post(
        "/api/projectworkflow/OperateProofreadData",
        formdata
      );
      if (res.code == 1) {
        this.$message.success(res.msg);
        this.approveInfoDialogVisible = false;
        this.getInfo();
      }
    },
    // 修改校审信息校审状态
    async changeStauts(e, iuid) {
      let formdata = new FormData();
      formdata.append("iuid", iuid);
      formdata.append("opinionstatus", e);
      let res = await postApi.post("/api/projectworkflow/OperateProofreadData", formdata);
      if (res.code == 1) {
        this.$message.success(res.msg);
        await this.getInfo();
      }

      if (e == "复核不通过") {
        await MessageBox.confirm("是否再次创建审核意见？", "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning",
        }).then(() => {
          this.addApproveInfo();
        });
      }
    },

    // ===============页面功能函数===============
    // 文件查看
    async viewMode(row) {
      this.fileListVisible = false
      if (row.fileSuffix.toLowerCase()) {
        if (this.$modelFileSuffix.concat(this.$ibimFileSuffix).indexOf(row.fileSuffix.toLowerCase()) > -1) {
          this.selectImodelFile = { ...row }
          this.positionIuid = undefined

          let path = row.turnPath ? row.turnPath : row.filePath
          // let path = 'C:\\Users\\kui10\\Desktop\\临时文件夹\\模型\\铲车\\铲车.dgn.bim'
          // let query = "path=" + path + "&editable=0" + "&selectFile=0"
          // this.modelPreViewInitUrl = process.env.VUE_APP_KmwOrigin + "/?" + encrypt(encodeURIComponent(query))
          // this.showModel = true

          localStorage.setItem('approve', JSON.stringify(true))
          localStorage.setItem('CurrentFile', JSON.stringify(this.selectImodelFile))
          localStorage.setItem('kjApprovalData', JSON.stringify({
            bwVersionName: 'kj',
            apprpveInfo: this.apprpveInfo.filter(item => item.imodelDataIUID && item.fileIUID === this.selectImodelFile.iuid),
            approveData: this.approveData,
            positionLabelIuid: this.positionIuid
          }))

          let rowCopy = { ...row }

          this.showTransferView(this.$appList.find((item) => item.type == 'bimwindows'), rowCopy)
        } else {
          this.$viewMode(row);
        }
      } else {
        let folderItem = this.getItemFolder(this.approveFilesTree, row.iuid)

        if (folderItem) {
          let fileItem = this.getFolderFirstFile([folderItem])

          if (fileItem) {
            let path = fileItem.turnPath;
            // let path = 'C:\\Users\\kui10\\Desktop\\临时文件夹\\模型\\铲车\\铲车.dgn.bim'
            let query = "path=" + path + "&editable=0" + "&selectFile=0"
            this.modelPreViewInitUrl = process.env.VUE_APP_KmwOrigin + "/?" + encrypt(encodeURIComponent(query))
            this.selectImodelFile = { ...fileItem }
            this.positionIuid = undefined
          }
        }
      }
    },

    async showTransferView(item, row, mainfile) {
      console.log('row', row)

      let _this = this;
      const openApp = () => {
        let win = _this.$openItwinApp(
            {
              appName: item.title,
              appType: item.type,
              appOrigin: item.origin,
              appImage: item.start,
              mainfile: mainfile,
            },
            row.iuid,
            true,
            row
        );

        return win
      };
      let win = openApp();
      return win
    },

    // 关闭窗口
    async close(refresh) {
      // this.$router.push('/teamwork')
      if (refresh || this.module === 'share' || this.module === 'download') {
        this.$emit('loadWorkflowList')
        this.$emit('getAllTasks')
        this.$store.dispatch("GetMsgData")
        this.$emit('queryApproveCount')
      }
      this.approveData = {}
      this.loading = true;
      this.$emit('update:approveId', undefined)
      this.$emit("update:showDetail", false);
    },

    // ===============校审功能函数===============
    // 自动审批  ==>这个功能不要了
    async processPassing() {
      // let paylod = new FormData()
      // paylod.append('taskID', this.approveItem.taskID);
      // paylod.append('ID', this.approveData.iuid);
      // await fileApi.Processpassing(paylod)
    },

    // 获取版本信息
    async queryVersionData() {
      var formData = new FormData();
      formData.append("MainIUID", this.versionFile[0].iuid);
      formData.append("MainFileType", this.versionFile[0].mainFileType);
      var res = await conversionApi.queryFileVersion(formData);
      this.versionData = res.data;
    },
    // 选择版本
    async versionClick(item) {
      item.mainFileType = '1';
      item.fileType = "1"
      this.versionFile = [item];
      await this.queryVersionData();
      this.versionDialogVisible = true;
    },
    // 打印校审单
    print() {
      window.print()
    },
    // 导出校审单
    exportExl() {
      let downloadUrl =
        process.env.VUE_APP_BASE_API +
        `/api/Verify/ProofreadingSetExport?iuid=${this.approveData.iuid}`;
      window.open(downloadUrl, "校审单.xls");
    },


    // ===============校审流程函数===============

    async reassignCurrentStep() {
      var allFiles = "";
      for (var i = 0; i < this.approveItem.attachFiles.length; i++) {
        allFiles += this.approveItem.attachFiles[i].item.iuid;
        if (i != this.approveItem.attachFiles.length - 1) allFiles += ';';
      }
      let data = new FormData();
      data.append('projectiuid', this.approveItem.projectId);
      data.append('ID', this.approveItem.workflowId); // 流程发起的记录ID
      data.append('workflowName', this.approveItem.wfName);
      data.append('workflowGuid', this.approveItem.wfID); //workflow.wfCode);   // 这个可能带版本信息
      var taskName = this.approveItem.taskName.replace("（退回修改）", "").replace("(转交)", "");
      data.append('taskName', taskName);
      data.append('taskID', this.approveItem.taskID); //(this.approveResult == 2) ? -2 : -1);
      data.append('undertaker', this.approveItem.applyID); // 返回给发起人
      data.append('undertakerName', this.approveItem.apply); // 返回给发起人
      data.append('relatedFiles', allFiles);
      data.append('endTime', this.approveItem.endTime); // 指定完成时间
      data.append('fulfilTime', ''); // 实际完成时间
      data.append('opinion', ''); // 指定的当前任务
      data.append('resulttext', '');
      data.append('status', 0); // 待审批
      // if (res.code == 1) {
      this.close(1)
      // await this.processPassing()
      // this.$message({
      // message: res.msg,
      // type: "success",
      // });
      // }
    },
    async restartAllSteps() {
      let data = new FormData();
      data.append('iuid', this.approveItem.workflowId); // 流程发起的记录ID
      var res = await postApi.post("/api/projectworkflow/workflowagain", data);
      if (res.code == 1) {
        this.close(1)
        this.$message({
          message: res.msg,
          type: "success",
        });
      }
    },

    async assignNextStep() {
      let data = new FormData();
      data.append('type', (this.approveResult == 0) ? 1 : 2); //1--同意 2-不同意
      data.append('wfID', this.approveItem.wfID) // 流程ID
      data.append('stepID', this.approveItem.taskID)
      var res = await postApi.post("/api/Workflow/GetNextStepsNew", data);
      if (res.code == 1) {
        this.nextTask.projectId = this.approveItem.projectId;
        this.nextTask.workflowId = this.approveItem.workflowId;
        this.nextTask.wfID = this.approveItem.wfID;
        this.nextTask.wfName = this.approveItem.wfName;
        this.nextTask.taskID = res.data[0].id;
        this.nextTask.taskName = res.data[0].stepName;
        this.nextTask.roleIDs = res.data[0].roleIDs;
        this.nextTask.endTime = this.approveItem.endTime;
        this.nextTask.relatedFiles = this.approveItem.attachFiles;
        this.assignWorkflowDialogVisible = true;
      } else { // 已经没有下一步任务
        this.$message({
          type: 'success',
          message: '该工作流已结束并关闭!'
        });
        await this.setWorkflowStatus('0');
        this.close(1)
      }

    },
    // 修改流程发起表中的状态
    async setWorkflowStatus(status) {
      let data = new FormData();
      if (status == '3') {
        data.append('iuid', this.approveId);
      } else {
        data.append('iuid', this.approveItem.workflowId);
      }
      data.append('status', status); // 修改状态为流程已结束

      // if (this.module === 'share' || this.module === 'download') {
      //   return
      // }

      var res = await postApi.post( (this.module === 'share' || this.module === 'download') ? '/api/Workflow/MainworkflowAdd' : "/api/projectworkflow/projectworkflowAdd", data);
      if (res.code == 1) {
        // this.close(1)
        return res
      }
    },
    // 获取当前流程数据
    async getCurrentWorkflow(iuid) {
      let data = new FormData();
      data.append('iuid', iuid);
      var res = await postApi.post("/api/projectworkflow/projectworkflowData", data); // 流程发起表中的数据
      this.relatedFiles = [];
      if (res.code == 1) {
        return res.data;
      } else {
        return null;
      }
    },
    async checkIfAllAproved(item) {
      let data = new FormData();
      data.append('projectiuid', item.projectId);
      data.append('ID', item.workflowId);
      data.append('taskID', item.taskID);
      var res = await postApi.post("/api/projectworkflow/workflowPathTableisfinish", data);
      if (res.code == 1 && res.data == true) return true;
      else {
        var taskInfo = [];
        let data = new FormData();
        data.append('iuid', item.workflowId);
        var res = await postApi.post("/api/projectworkflow/workflowPathTabledetailsData", data);
        if (res.code == 1) {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].taskID == item.taskID) {
              taskInfo.push({
                undertaker: res.data[i].undertaker,
                status: res.data[i].status
              });
            }
          }
          for (var i = 0; i < taskInfo.length; i++) { // 检查当前任务是否有待审批或待修改的
            if (taskInfo[i].status != 1) { // 待审批或待修改
              for (var j = 0; j < taskInfo.length; j++) {
                if (j == i) continue;
                if (taskInfo[j].undertaker == taskInfo[i].undertaker && taskInfo[j].status == 1 && taskInfo[j].resulttext == '同意') break; // 有同用户“同意”的记录，必须全部同意的记录，
              }
              if (j == taskInfo.length) return false; // 没有找到对应的已审批记录
            }
          }
          return true;
        }
      }
      return false;
    },
    // 转交
    async submitTransfer() {
      await this.submitApproveForm('转交', 2, 1);
      this.transferVisible = false
      this.close(1)
    },
    // 撤回
    async submitRevoke() {
      this.$confirm("确认要撤回本条审批吗?").then(async () => {
        await this.submitApproveForm('撤回', 5, '')
        let res = await this.setWorkflowStatus('3');
        if (res.code) {
          this.$success(res.msg)
          this.close(1)
        }
      })
    },
    // 同意拒绝
    async submitResult() {
      if (this.approveResult == 0) {
        await this.submitApproveForm('已修改', 1, 0);
      } else if (this.approveResult == 1) {
        await this.submitApproveForm('不予修改', 1, 0);
      }
      this.close(1)
    },
    // 提交
    async checkNextStep() {
      let data = new FormData();
      data.append('type', (this.approveResult == 0) ? 1 : 2); //1--同意 2-不同意
      data.append('wfID', this.approveItem.wfID) // 流程ID
      data.append('stepID', this.approveItem.taskID)
      var res = await postApi.post("/api/Workflow/GetNextStepsNew", data);
      if (res.code == 1 && res.data[0].roleIDs.length > 0) {
        let roleIDs = res.data[0].roleIDs;
        let queryForm = new FormData();
        queryForm.append('roleID', roleIDs[0].roleID);
        queryForm.append('ProjectIUID', this.approveItem.projectId);
        var res2 = await postApi.post('/api/Permission/GetUserDataByRole', queryForm);
        if (res2.code == 1 && res2.data.length > 0) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    async submitReturn() {

      if (this.approveResult == 0) {
        console.log('this.isLastStep', this.isLastStep)

        if (!this.isLastStep) {
          if (await this.checkNextStep()) {
            await this.submitApproveForm('同意', 1, 0);
          } else {
            this.$error('下级审批流程配置有误，请联系管理员调整')
          }
        } else {
          await this.submitApproveForm('同意', 1, 0);
        }

      } else if (this.approveResult == 2) {
        await this.submitApproveForm('拒绝', 3, 2);
      } else if (this.approveResult == 4) {
        await this.submitApproveForm('修改再审', 1, 4);
      } else if (this.approveResult == 3) {
        await this.submitApproveForm('重启流程', 1, 3);
      }
      if (this.approveResult != 0) {
        this.close(1)
      }
    },
    // 提交校审流程
    async submitApproveForm(text, status, result) {
      if (result != undefined) this.approveResult = result;
      let data = new FormData();
      var now = new Date();
      var date = now.Format('yyyy-MM-dd hh:mm:ss');
      if (this.isResubmit == '重新提交') {
        data.append('isResubmit', '重新提交');
      }
      data.append('iuid', this.approveItem.iuid);
      data.append('fulfilTime', date); // 实际完成时间
      data.append('opinion', this.approveOpinion);
      data.append('resulttext', text);
      data.append('status', status); // 流程详情中显示

      var res = await postApi.post((this.module === 'share' || this.module === 'download') ? '/api/Workflow/MainworkflowPathTableAddEdit' : "/api/projectworkflow/workflowPathTableAddEdit", data); // 修改流转表
      if (res.code == 1) {
        if (status != 5) {
          await this.setWorkflowStatus('2'); // 表示已正式进入了审批流程
        }
        if (this.approveResult != 0) { // 审批未通过：拒绝或转交
          if (this.approveResult == 2) await this.endAllWorkflows(this.approveItem.workflowId, true); // 拒绝
          else if (this.approveResult == 1) await this.handoverNextStep(); // 转交
          else if (this.approveResult == 3) await this.gobackToApply(); // 打回发起者,并重启流程
          else if (this.approveResult == 4) await this.gobackToApplyThenBack(); // 打回发起者, 再返回审批
          await this.getData(); // 创建以后再刷新
        } else { // 同意则下一步

          if (this.submitType == 'submit') { // 提交修改后重新发起上次的审批任务
            if (this.approveItem.status == -2) { // 是被打回后的修改
              await this.restartAllSteps(); // 重启所有的任务
            } else await this.reassignCurrentStep();
            await this.getData(); // 创建以后再刷新
          } else if (this.submitType == 'approve') {
            var item = this.approveItem;
            var finished = await this.checkIfAllAproved(item); // 检查是否当前任务已全部通过（多人审批时要等所有人完成审批)
            // 这个要在getData之前做，因为getData会改掉this.approveItem数据

            if (this.module === 'share' || this.module === 'download') {
            } else {
              await this.getData().catch(() => {}); // 刷新
            }

            if (finished) await this.assignNextStep();
            else {
              this.$success(res.msg)
              this.close(1)
            }
          }
        }
      }
      this.submitVisible = false;
    },

    // 当被转交时，自动创建流程任务
    async handoverNextStep() {
      var allFiles = "";
      for (var i = 0; i < this.approveItem.attachFiles.length; i++) {
        allFiles += this.approveItem.attachFiles[i].item.iuid;
        if (i != this.approveItem.attachFiles.length - 1) allFiles += ';';
      }
      for (var i = 0; i < this.responsiblePersonChecked.length; i++) {
        let data = new FormData();
        data.append('projectiuid', this.approveItem.projectId);
        data.append('ID', this.approveItem.workflowId); // 流程发起的记录ID
        data.append('workflowName', this.approveItem.wfName);
        data.append('workflowGuid', this.approveItem.wfID); //workflow.wfCode);   // 这个可能带版本信息
        data.append('taskName', this.approveItem.taskName + (this.approveItem.taskName.indexOf("(转交)") > -1 ? '' : "(转交)"));
        data.append('taskID', this.approveItem.taskID);
        data.append('undertaker', this.responsiblePersonChecked[i].userID); // 转交
        data.append('undertakerName', this.responsiblePersonChecked[i].userName); // 转交
        data.append('relatedFiles', allFiles);
        data.append('endTime', this.approveItem.endTime); // 指定完成时间
        data.append('fulfilTime', ''); // 实际完成时间
        data.append('opinion', ''); // 指定的当前任务
        data.append('resulttext', '');
        data.append('status', 0); // 待审批
        var res = await postApi.post((this.module === 'share' || this.module === 'download') ? '/api/Workflow/MainworkflowPathTableAddEdit' : "/api/projectworkflow/workflowPathTableAddEdit", data);
        if (res.code == 1) {
          // await this.processPassing()
          this.$message({
            message: '当前校审任务已转发至' + this.responsiblePersonChecked[i].userName,
            type: "success",
          });
        }
      }
      this.close(1)
    },
    // 拒绝时终止所有的任务
    async endAllWorkflows(iuid, isEnd = false) {
      let data = new FormData();
      data.append('iuid', iuid);
      var res = await postApi.post("/api/projectworkflow/workflowstop", data); // 流程发起表中的数据
      if (res.code == 1) {
        if (isEnd) {
          await this.setWorkflowStatus('5');
        }
      }
    },
    // 当被打回时，自动创建流程任务
    async gobackToApply() {
      await this.endAllWorkflows(this.approveItem.workflowId); // 把其他未完成的任务全部终止
      var allFiles = "";
      for (var i = 0; i < this.approveItem.attachFiles.length; i++) {
        allFiles += this.approveItem.attachFiles[i].item.iuid;
        if (i != this.approveItem.attachFiles.length - 1) allFiles += ';';
      }
      let data = new FormData();
      data.append('projectiuid', this.approveItem.projectId);
      data.append('ID', this.approveItem.workflowId); // 流程发起的记录ID
      data.append('workflowName', this.approveItem.wfName);
      data.append('workflowGuid', this.approveItem.wfID); //workflow.wfCode);   // 这个可能带版本信息
      data.append('taskName', this.approveItem.taskName + (this.approveItem.taskName.indexOf("（退回修改）") > -1 ? '' : "（退回修改）"));
      data.append('taskID', this.approveItem.taskID);
      var wf = await this.getCurrentWorkflow(this.approveItem.workflowId);
      if (wf) {
        data.append('undertaker', wf.applyPerson); // 打回给流程发起者
        data.append('undertakerName', wf.applyPersonName); // 打回给流程发起者
      }
      data.append('relatedFiles', allFiles);
      data.append('endTime', this.approveItem.endTime); // 指定完成时间
      data.append('fulfilTime', ''); // 实际完成时间
      data.append('opinion', ''); // 指定的当前任务
      data.append('resulttext', '');
      data.append('status', -2); // 待修改
      var res = await postApi.post((this.module === 'share' || this.module === 'download') ? '/api/Workflow/MainworkflowPathTableAddEdit' : "/api/projectworkflow/workflowPathTableAddEdit", data);
      this.close(1)
      // await this.processPassing()
    },
    // 当被打回时，自动创建流程任务, 返回发起人处理后再回到审批人
    async gobackToApplyThenBack() {
      var allFiles = "";
      for (var i = 0; i < this.approveItem.attachFiles.length; i++) {
        allFiles += this.approveItem.attachFiles[i].item.iuid;
        if (i != this.approveItem.attachFiles.length - 1) allFiles += ';';
      }
      let data = new FormData();
      data.append('projectiuid', this.approveItem.projectId);
      data.append('ID', this.approveItem.workflowId); // 流程发起的记录ID
      data.append('workflowName', this.approveItem.wfName);
      data.append('workflowGuid', this.approveItem.wfID); //workflow.wfCode);   // 这个可能带版本信息
      data.append('taskName', this.approveItem.taskName + (this.approveItem.taskName.indexOf("(（退回修改）") > -1 ? '' : "（退回修改）"));
      data.append('taskID', this.approveItem.taskID);
      var wf = await this.getCurrentWorkflow(this.approveItem.workflowId);
      if (wf) {
        data.append('undertaker', wf.applyPerson); // 打回给流程发起者
        data.append('undertakerName', wf.applyPersonName); // 打回给流程发起者
      }
      data.append('relatedFiles', allFiles);
      data.append('endTime', this.approveItem.endTime); // 指定完成时间
      data.append('fulfilTime', ''); // 实际完成时间
      data.append('opinion', ''); // 指定的当前任务
      data.append('resulttext', '');
      data.append('status', -1); // 待修改
      var res = await postApi.post((this.module === 'share' || this.module === 'download') ? '/api/Workflow/MainworkflowPathTableAddEdit' : "/api/projectworkflow/workflowPathTableAddEdit", data);
      this.close(1)

      // await this.processPassing()
    },


    // ===============校审信息函数===============
    // 删除校审信息
    async deleteInfo(item) {
      let formdata = new FormData();
      formdata.append("IUID", item.iuid);
      this.$confirm(`确定要删除本条审核信息吗？`).then(async (r) => {
        if (r) {
          let res = await postApi.post(
            "/api/projectworkflow/OperateProofreadDataDel",
            formdata
          );
          if (res.code == 1) {
            this.$message.success(res.msg);
            this.getInfo();
          }
        }
      });
    },
  },
};
</script>

<style>
.popover {
  min-width: 100px !important;
}
</style>

<style lang="scss" scoped>
.approve-form {
  .el-form-item {
    margin-bottom: 0;
  }
}

.top-flex {
  position: absolute;
  top: 0;
  background-color: #fff;
  height: 114px;
  width: 100%;
  z-index: 9;
}

.closeBtn {
  position: absolute;
  top: 10px;
  right: 25px;
  z-index: 10;
}

.bg_w {
  background: #fff;
}

.pd_10 {
  padding: 15px 15px;
}

.pt_114 {
  margin-top: 114px;
}

.detailPage {
  width: 70vw;
  height: calc(100vh - 51px);
  overflow-y: auto;
  padding-bottom: 50px;

  .head {
    width: calc(100% - 30px);
    margin: 0 auto;
    height: 60px;
    border-bottom: 1px solid #f2f2f2;

    .title {
      font-size: 18px;
      font-weight: 500;
    }

    .name {
      margin-left: 15px;
    }
  }

  .detailTable {
    &.infoTable {
      // max-height: calc(100vh - 550px);
      overflow-y: auto;
    }

    ::v-deep th {
      padding: 10px 0;
      height: 28px;
      line-height: 28px;
      background-color: #fafafa;
    }
  }

  .info-box {
    padding: 10px 25px;
    height: 52px;
    font-size: 14px;
    line-height: 52px;
    box-shadow: 2px 3px 3px #eee;
    justify-content: space-between;
  }

  .downloadSvg {
    margin-left: auto;
    margin-right: 40px;
    font-size: 14px;
  }

  .svg {
    cursor: pointer;

    &:hover {
      img {
        filter: drop-shadow(0px 0px 0px #409eff);
      }

      span {
        color: #409eff;
      }
    }
  }

  .footer-box {
    padding: 0 20px;
    background-color: #fff;
    box-shadow: 0 0 4px #aaa;
    z-index: 9;
    height: 50px;
    width: 70vw;
    position: absolute;
    bottom: 0;
    right: 0;

  }

  iframe {
    position: fixed;
    left: 60px;
    right: 0;
    top: 50px;
    bottom: 0;
    width: calc(100% - 60px);
    height: calc(100% - 50px);
    z-index: 999;
    border: none;
  }

  .imodel-audit-count-info-dialog {
    position: fixed;
    z-index: 999;
    top: 150px;
    left: 0;
    right: 0;
    margin: 0 auto;
    background: #ffffff;
    width: 220px;
    text-align: center;
    padding: 5px 10px;
    border-radius: 4px;
    display: flex;
    align-items: center;

    >div {
      white-space: nowrap;

      &:not(:last-child) {
        margin-right: 15px;
      }
    }
  }
}

.flex {
  display: flex;
  align-items: center;
}

.itemText {
  font-weight: 500;
  color: #101010;
  margin-left: 10px;
}

.ml_15 {
  margin-left: 20px;
}

.el-icon-picture {
  font-size: 20px;
}

.hover-blue {
  color: #33a0ff;
  cursor: pointer;

  &:hover {
    color: #00ccff;
  }
}

.approve-status-icon {
  width: 110px;
  position: absolute;
  right: 30px;
  top: -25px;
  z-index: 10;
}

.divider {
  width: 1px;
  height: 25px;
  margin: 0 20px;
  background-color: #bbb;
}

.yellow {
  color: #FF9900;
}

.red {
  color: #f56c6c;
}

.green {
  color: #33CC99;
}

.hover-blue.disabled {
  color: #999;
  cursor: not-allowed;
}
</style>
