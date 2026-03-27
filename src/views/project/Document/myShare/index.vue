<template>
  <div class="app-container background table-box">
    <el-dialog title="上传文件" :visible.sync="fileDialogVisible" width="30%">
      <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" multiple :limit="1" :file-list="fileList" :on-change="fileOnChange" :auto-upload="autoUpload" :before-upload="beforeUpload">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">请上传文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fileDialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
        <el-button type="primary" @click="submitFile">{{ $t('base.button.confirm') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :modal="false" title="分享详情" v-if="shareDetailVisible" :visible.sync="shareDetailVisible" width="700px">
      <shareResult :shareUrl="selectRow.shareUrl" :shareUrlM="selectRow.shareUrlM" :isVisible="selectRow.isvisible" :password="selectRow.pssword" @closeDialog="shareDetailDialogClose" />
    </el-dialog>
    <!-- 删除/ -->
    <el-dialog title="删除" :visible.sync="deleteDialogVisible" width="30%">
      <span>确定删除么</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
        <el-button type="primary" @click="deleteFile">{{ $t('base.button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- //重命名 -->
    <el-dialog title="重命名" :visible.sync="reloadNameDialogVisible" width="30%">
      <el-input v-model="inputFileName" :placeholder="oldPlaceholder"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reloadNameDialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
        <el-button type="primary" @click="reloadNameOK">{{ $t('base.button.confirm') }}</el-button>
      </span>
    </el-dialog>

    <!-- <el-row>
      <el-col :span="14" class="btn-group">
        <downloadBtn :rows="multipleSelection" :fullPath="getFolderFullPath" />
      </el-col>
    </el-row> -->

    <!-- <el-row style="margin-top: 20px" v-if="breadcrumb.length > 0">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <a @click="queryAll">文件夹</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          @click="querySelect(item, index)"
          v-for="(item, index) in breadcrumb"
          :key="index"
        >
          <a @click="querySelect(item, index)">{{ item.fileName }}</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row> -->
    <el-row class="table">
      <el-table class="t-table" :data="tableData" height="100%" :header-cell-style="$thStyle" style="margin-top: 20px; font-size: 13px" stripe @selection-change="handleSelectionChange" @sort-change="sortChange" :default-sort="{ prop: 'shareTime', order: 'descending' }">
        <!-- <el-table-column type="index" width="55"> </el-table-column> -->
        <el-table-column show-overflow-tooltip prop="fileName" :label="$t('base.button.fileName')">
          <template slot-scope="scope">
            <fileIconComponends :row="scope.row" @linkToFilePage="linkToFilePage" />
          </template>
        </el-table-column>

        <!--<el-table-column prop="createTime" label="上传时间" width="200">-->
        <!--</el-table-column>-->
        <el-table-column prop="shareTime" :label="$t('base.button.shareTime')" sortable="custom" width="200">
        </el-table-column>

        <el-table-column prop="shareText" :label="$t('base.button.approvalStatus')" width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === '0'" size="small">
              已通过
            </el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === '5'" size="small">
              已拒绝
            </el-tag>
            <el-tag type="warning" v-else-if="!scope.row.status" size="small">
              未审批无效
            </el-tag>
            <el-tag type="info" v-else size="small">
              审批中
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="username" :label="$t('base.button.approver')">
        </el-table-column>

        <el-table-column prop="shareText" :label="$t('base.button.shareStatus')" width="120">
          <template slot-scope="scope" v-if="scope.row.status !== '5'">
            <el-tag type="danger" v-if="scope.row.shareText === '已过期'" size="small">
              {{ scope.row.shareText }}
            </el-tag>
            <el-tag type="success" v-if="scope.row.shareText === '正常'" size="small">
              {{ scope.row.shareText }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column :label="$t('base.formLabel.operation')" width="150">
          <template slot-scope="scope">
            <!-- <el-input
              class="shareText"
              ref="shareFileInput"
              type="textarea"
              v-model="scope.row.shareUrl"
              ></el-input
            > -->

            <template v-if="scope.row.status === '0' && scope.row.shareText !== '已过期'">
              <el-tooltip style="font-size:15px !important" class="tableOpeColMargin" effect="light" content="详情" placement="top">
                <el-link :underline="false" icon="el-icon-link" @click="handleDetail(scope.row)"></el-link>
              </el-tooltip>
            </template>

            <el-tooltip class="tableOpeColMargin" effect="light" content="取消分享" placement="top">
              <el-link :underline="false" icon="el-icon-switch-button" @click="cancelShare(scope.row)"></el-link>
            </el-tooltip>

            <el-tooltip class="tableOpeColMargin" effect="light" content="流程详情" placement="top">
              <el-link :underline="false" icon="el-icon-view" @click="detail(scope.row)"></el-link>
            </el-tooltip>

            <template v-if="scope.row.status === '0'">
              <el-tooltip class="tableOpeColMargin" effect="light" content="申请列表" placement="top">
                <el-badge @click.native="getShareList(scope.row)" class="share-badge" style="margin-right: 20px;cursor: pointer;margin-top: 7px;" :value="scope.row.applycheckcount" :max="99" :hidden="scope.row.applycheckcount == 0" size="mini" type="danger">
                  <img @click="getShareList(scope.row)" src="../../../../assets/newNavBtn/remind.svg" style="cursor: pointer;width: 14px;height: 14px;">
                </el-badge>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <pagination :pageTotal="Total" :pageIndex="page" :pageNumber="rows" @handleCurrentChange="paginationCurrentChange" @handleSizeChange="handleSizeChange"></pagination>

    <el-dialog
        :modal="false"
        :title="$t('base.button.applicationList')"
        class="link-model-dialog"
        :visible.sync="shareListDialog"
        width="800px"
        @close="shareListDialog = false"
    >
      <el-table :data="shareList" style="max-height: 70vh; overflow: auto;">
        <el-table-column prop="usertext" :label="$t('base.button.applicant')" width="140" />
        <el-table-column prop="scene" :label="$t('base.button.usageScenario')" :show-overflow-tooltip="true" />
        <el-table-column prop="createTime" :label="$t('base.button.applicationTime')" width="180" />
        <el-table-column :label="$t('base.button.applicationStatus')" width="100">
          <template slot-scope="scope">
            <el-tag type="success" size="small" v-if="scope.row.passtype == 1">已通过</el-tag>
            <el-tag type="danger" size="small" v-else-if="scope.row.passtype == 2">已拒绝</el-tag>
            <el-tag type="info" size="small" v-else>等待中</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('base.formLabel.operation')" width="160">
          <template slot-scope="scope" v-if="scope.row.passtype === 0">
            <el-button size="mini" @click="shareHandler(1, scope.row)" type="primary">同意</el-button>
            <el-button size="mini" @click="shareHandler(2, scope.row)" type="danger">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <WorkflowInfoManagement :dialogVisible.sync="workflowDialogVisible" :workflowIuid='workflowIuid'
                            :projectId="projectId" ref="workflowInfoManagements"></WorkflowInfoManagement>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import projectFileApi from "@/api/document/indexApi.js";
import local from "@/utils/auth";
import socketio from "socket.io-client";
import pagination from "@/components/pagination/index";
import fileStatusComponends from "@/components/FileStatus"
import fileIconComponends from "@/components/fileIcon"
import operateColCom from "@/components/operateColCom"
import shareResult from "@/components/Share/shareResult"
import downloadBtn from "@/components/PreViewAndlistComBtn/downloadButton"
import { decrypt } from '@/utils'
import folderTree from '@/views/project/file/folderTree.vue'
import request from '@/utils/request'
import { MessageBox } from 'element-ui'
import WorkflowInfoManagement from '@/views/teamwork/workflowInfoManagement.vue'


export default {
  components: {
    WorkflowInfoManagement,
    folderTree,
    pagination,
    fileStatusComponends,
    fileIconComponends,
    operateColCom,
    shareResult,
    downloadBtn
  },
  computed: {
    ...mapGetters(["signalRTableData"]),
  },
  watch: {
    signalRTableData() {
      this.tableData.forEach((element) => {
        if (element.iuid == this.signalRTableData.iuid) {
          element.statusType = this.signalRTableData.statusType;
          element.turnPath = this.signalRTableData.turnPath;
        }
      });
    },
  },
  data() {
    return {
      // 翻页
      Total: 0,
      page: 1,
      rows: 10,
      // ---------------
      inputValue: "",
      fileDialogVisible: false,
      reloadNameDialogVisible: false,
      shareDialogVisible: false,
      autoUpload: false,
      fileList: [],
      tableData: [],
      multipleSelection: [],
      breadcrumb: [],
      IUID: "",
      inputFileName: "",
      shareFileName: "",
      reloadNameIuid: "",
      deleteDialogVisible: false,
      oldPlaceholder: "",
      orderBy: "DESC",
      shareDetailVisible: false,
      selectRow: {
        shareUrl: null,
        isvisible: false,
        pssword: null
      },
      shareListDialog: false,
      shareList: [],
      workflowDialogVisible: false,
      workflowIuid: null,
      projectId: null
    };
  },
  created() {
    this.breadcrumb = [];
    this.queryData();
  },
  methods: {
    detail(row) {
      this.workflowIuid = row.workflowiuid;
      this.workflowDialogVisible = true;
    },

    getShareList(row) {
      this.currentRow = { ...row }
      this.shareListDialog = true

      let formData = new FormData();
      formData.append("ShareTaskId", this.currentRow.shareTaskId);
      formData.append("page", 1);
      formData.append("rows", 999);

      request.post('api/Drawing/Getshareapplydata', formData).then(res => {
        this.shareList = res.data
      })
    },

    shareHandler(type, row) {
      MessageBox.confirm(`您确认${type === 1 ? '同意' : '拒绝'}该申请吗？`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: false,
        callback: (action) => {
          if (action !== 'confirm') {
            return
          }

          let formData = new FormData();
          formData.append("IUID", row.iuid);
          formData.append("passtype", type);

          request.post('api/Drawing/shareapplyratify', formData).then(() => {
            this.getShareList(this.currentRow)
          })
        }
      })
    },

    getFolderFullPath() {
      return this.$folderFullPath("图档 / 我的分享", this.breadcrumb);
    },
    paginationCurrentChange(val) {
      this.page = val;
      this.queryData();
    },
    handleSizeChange(val) {
      this.rows = val;
      this.queryData();
    },
    queryAll() {
      this.IUID = "";
      this.breadcrumb = [];
      this.queryData();
    },
    linkToFilePage(row) {
      this.breadcrumb.push(row);
      this.IUID = row.iuid;
      this.queryData();
    },
    reloadClick(row) {
      this.reloadNameIuid = row.iuid;
      this.reloadNameDialogVisible = true;
      this.oldPlaceholder = row.fileName;
    },
    async reloadNameOK() {
      var formData = new FormData();
      formData.append("IUID", this.reloadNameIuid);
      formData.append("Name", this.inputFileName);
      let url =
        "/api/Drawing/DrawingFileRename?IUID=" +
        this.reloadNameIuid +
        "&Name=" +
        this.inputFileName;
      var res = await projectFileApi.post(url, formData);
      this.$message(res.msg);
      this.reloadNameDialogVisible = false;
      this.queryData();
    },
    formatterProject(row) {
      if (row.projectText == "") {
        return "我的文件";
      } else {
        return row.projectText;
      }
    },
    formaResouse(row) {
      switch (row.fileType) {
        case "0":
          return "我的文件";
          break;
        case "1":
          return "项目文件";
          break;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async deleteFile() {
      let IUID = [];
      let fileType = [];
      for (let key in this.multipleSelection) {
        IUID.push(this.multipleSelection[key].iuid);
        fileType.push(this.multipleSelection[key].fileType);
      }
      var formData = new FormData();
      formData.append("IUID", IUID.join(","));
      formData.append("fileType", fileType.join(","));
      let url =
        "/api/Drawing/DrawingFileDelete?IUID=" +
        IUID.join(",") +
        "&fileType=" +
        fileType.join(",");
      var res = await projectFileApi.post(url, formData);
      this.$message(res.msg);
      this.deleteDialogVisible = false;
      this.queryData();
    },

    handleDetail(row) {
      this.selectRow = row
      this.selectRow.shareUrl = this.$shareUrl + "?" + this.selectRow.shareTaskId;
      this.selectRow.shareUrlM = this.$shareUrlH5 + "?" + this.selectRow.shareTaskId;
      this.shareDetailVisible = true
    },
    shareDetailDialogClose() {
      this.shareDetailVisible = false
    },
    beforeUpload(file) {
      console.log(file);
    },
    fileOnChange(file, fileList) {
      this.fileList = fileList;
      console.log(this.fileList);
    },
    sortChange(column) {
      if (column.order === null) {
        this.orderBy === "DESC" ?
          (column.order = "ascending") :
          (column.order = "descending");
        column.column.order = column.order;
      }
      this.orderBy = column.order == "ascending" ? "ASC" : "DESC";
      this.queryData();
    },
    async queryData() {
      var formData = new FormData();
      formData.append("Orderby", this.orderBy);
      formData.append("page", this.page);
      formData.append("rows", this.rows);
      var res = await projectFileApi.post(
        "/api/Drawing/GetShare",
        formData
      );
      this.Total = res.count;

      // filePath 和 turnPath 解码
      res.data && res.data.forEach(item => {
        item.filePath = decrypt(item.filePath || '')
        item.turnPath = decrypt(item.turnPath || '')
      })

      this.tableData = res.data;
    },
    copyShareUrl(shareUrl) {
      var _self = this
      this.$copyText(shareUrl).then(function (e) {
        _self.$success(res.msg)
      }, function (e) {

      })
    },
    async submitFile() {
      var res = await projectFileApi.AjaxFile(
        this.fileList[0].raw,
        0,
        "",
        this.IUID,
        true,
        this
      );
      this.$message("上传进行中");
      this.fileDialogVisible = false;
    },
    async cancelShare(row) {
      this.$confirm("取消分享后好友将无法再访问此分享链接。确定要取消分享吗？").then(async () => {
        var res = await projectFileApi.post(
          "/api/Drawing/Cancelsharing?IUID=" + row.shareTaskId
        )

        if (res.code == 1) {
          this.$success(res.msg)
          this.queryData()
        }
      });
    }
  },
};
</script>
<style scoped lang="scss">
.icluude {
  padding: 15px 0;
  font-size: 13px;
  cursor: pointer;

  div {
    font-weight: 700;
    text-decoration: none;
    transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    color: #303133;
  }

  .list:last-child {
    font-weight: 400;
    color: #606266;
    cursor: text;
  }

  span {
    margin: 0 9px;
    font-weight: 700;
    color: #c0c4cc;
  }
}

.kanbaniframe {
  width: 100%;
  height: 100%;
}

.imodelDialog {
  ::v-deep .el-dialog {
    height: calc(100% - 16vh);
  }

  ::v-deep .el-dialog__body {
    height: calc(100% - 16vh);
  }
}

.allfile {
  position: absolute;
  height: 100%;
  background: #fff;
  border: 1px solid #e6e6e6;
  padding: 10px;
  width: 100%;
  overflow: auto;
}

.right {
  justify-content: flex-end;
}
</style>

<style lang="scss">
.share-badge {
  .el-badge__content {
    font-size: 10px;
    height: 14px;
    line-height: 14px;
    padding: 0 3px;
  }
}
</style>
