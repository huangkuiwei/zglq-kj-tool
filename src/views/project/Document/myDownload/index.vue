<template>
  <div class="app-container background table-box">
    <el-row class="table">
      <el-table class="t-table" :data="tableData" height="100%" :header-cell-style="$thStyle" style="margin-top: 20px; font-size: 13px" stripe>
        <el-table-column show-overflow-tooltip prop="fileName" :label="$t('base.button.fileName')">
          <template slot-scope="scope">
            <fileIconComponends :row="scope.row" :linkModelDialog="true" />
          </template>
        </el-table-column>

        <el-table-column prop="applyTime" :label="$t('base.button.applicationTime')">
        </el-table-column>

        <el-table-column :label="$t('base.button.applicationStatus')">
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

        <el-table-column :label="$t('base.formLabel.operation')" width="100px">
          <template slot-scope="scope">
            <el-tooltip class="tableOpeColMargin" effect="light" content="流程详情" placement="top">
              <el-link :underline="false" icon="el-icon-view" @click="detail(scope.row)"></el-link>
            </el-tooltip>

            <el-tooltip
                v-for="item of scope.row.downloadState"
                :key="item.key"
                class="tableOpeColMargin"
                effect="light"
                :content="(item.key === '.' || item.key === '.zip') ? '源文件下载' : 'bim文件下载'"
                placement="top"
                v-if="!item.isdownload && scope.row.status === '0'"
            >
              <el-link :underline="false" icon="el-icon-download" @click="download(item)"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <pagination :pageTotal="Total" :pageIndex="page" :pageNumber="rows" @handleCurrentChange="paginationCurrentChange" @handleSizeChange="handleSizeChange"></pagination>

    <WorkflowInfoManagement :dialogVisible.sync="workflowDialogVisible" :workflowIuid='workflowIuid'
                            :projectId="projectId" ref="workflowInfoManagements"></WorkflowInfoManagement>
  </div>
</template>
<script>
import projectFileApi from "@/api/document/indexApi.js";
import pagination from "@/components/pagination/index";
import fileIconComponends from "@/components/fileIcon"
import { decrypt } from '@/utils'
import WorkflowInfoManagement from '@/views/teamwork/workflowInfoManagement.vue'
import request from '@/utils/request'
import commonApi from '@/api/common'
import postApi from "@/api/document/indexApi.js";

export default {
  components: {
    WorkflowInfoManagement,
    pagination,
    fileIconComponends,
  },

  data() {
    return {
      Total: 0,
      page: 1,
      rows: 10,
      tableData: [],
      breadcrumb: [],
      IUID: "",
      workflowDialogVisible: false,
      workflowIuid: null,
      projectId: null
    };
  },

  created() {
    this.breadcrumb = [];
    this.queryData();

    this.$root.$on('queryMyDownloadData', this.queryData)
  },

  beforeDestroy() {
    this.$root.$off('queryMyDownloadData', this.queryData);
  },

  methods: {
    detail(row) {
      this.workflowIuid = row.workflowiuid;
      this.workflowDialogVisible = true;
    },

    async download(row) {
      row.iuid = row.fileIUID;
      this.$downloadFile(row, row.downloadType === '.bim', true);

      // const loading = this.$loading({
      //   text: '正在压缩文件，请稍等...',
      //   body: true,
      //   lock: true,
      //   background: '#00000010',
      // })
      //
      // let res = {}
      //
      // if (row.downloadType === '.bim') {
      //   res = await request.get(`api/Home/GetFilebimState?iuid=${row.fileIUID}` + (row.workflowiuid ? `&workflowiuid=${row.workflowiuid}` : ''), {
      //     timeout: 0
      //   }).catch(() => {})
      // } else {
      //   res = await commonApi.compressFileFolder(row.fileIUID, row.workflowiuid).catch(() => {})
      // }
      //
      // loading.close()
      //
      // if (res && res.code == 1) {
      //   var compressionFileInfo = {
      //     path: res.data.zipfileRelativePath,
      //     compressionFileSize: res.data.fileSize,
      //     iuid: res.data.newIUID,
      //     workflowiuid: row.workflowiuid
      //   }
      //   this.$downloadFile(row, this, true, compressionFileInfo, false, false, true)
      // } else {
      //   this.$message.error("压缩失败，请重试");
      // }

      // if (row.downloadType === '.zip') {
      //   const loading = this.$loading({
      //     text: '正在压缩文件，请稍等...',
      //     body: true,
      //     lock: true,
      //     background: '#00000010',
      //   })
      //
      //   const res = await commonApi.compressFileFolder(row.fileIUID, row.workflowiuid)
      //
      //   loading.close()
      //
      //   if (res.code == 1) {
      //     var compressionFileInfo = {
      //       path: res.data.zipfileRelativePath,
      //       compressionFileSize: res.data.fileSize,
      //       iuid: res.data.newIUID,
      //       workflowiuid: row.workflowiuid
      //     }
      //     this.$downloadFile(row, this, true, compressionFileInfo, false, false, true)
      //   }
      // } else if (row.downloadType === '.') {
      //   row.iuid = row.fileIUID
      //   this.$downloadFile(row, this, false, undefined, false, false, true);
      // } else if (row.downloadType === '.bim') {
      //   row.iuid = row.fileIUID
      //   this.$downloadFile(row, this, false, null, true, true, true);
      // } else {
      //   let res1 = await postApi.get("/api/Home/GetOssObsUrlData?IUID=" + row.fileIUID);
      //   if (res1.code == 1) {
      //     let url = new URL(res1.data)
      //     let fileName = url.searchParams.get('IUID') + '.7z'
      //
      //     // 文件传输面板
      //     this.$store.dispatch("ChangeUploderVisible", "show");
      //     this.$store.commit("CHANGE_UPLOADERTAB_INDEX", 2);
      //     let downLoadData = {
      //       fileName: fileName,
      //       fileSize: '计算中',
      //       fullPath: res1.data,
      //       downloadTime: this.$dayjs(new Date(), "YYYY-MM-DD HH:mm:ss"),
      //       progress: 0,
      //       fileSuffix: '.' + fileName.split('.')[fileName.split('.').length - 1],
      //     };
      //     this.$store.commit("UPDATEDOWNLOADFILEDATA_CLONE", downLoadData);
      //
      //     request.get(res1.data + `&workflowiuid=${row.workflowiuid}`, {
      //       responseType: "blob",
      //       onDownloadProgress: (e) => {
      //         downLoadData.fileSize = Math.round(e.total / 1024 / 1024) + 'M'
      //
      //         let progress = e.loaded / e.total;
      //         downLoadData.progress = Math.round(progress * 100);
      //       }
      //     }).then(res3 => {
      //       if (res3.type === 'application/json') {
      //         let blob = new Blob([res3], { type: '' });
      //         let reader = new FileReader();
      //
      //         reader.onloadend = (event) => {
      //           let res = JSON.parse(event.target.result);
      //           this.$message.error(res.msg);
      //         }
      //
      //         reader.readAsText(blob);
      //       } else {
      //         let blob = new Blob([res3], { type: '' });
      //         let elink = document.createElement("a");
      //         elink.download = fileName;
      //         elink.style.display = "none";
      //         let href = window.URL.createObjectURL(blob);
      //         elink.href = href;
      //         document.body.appendChild(elink);
      //         elink.click();
      //         document.body.removeChild(elink);
      //         window.URL.revokeObjectURL(href);
      //       }
      //     })
      //   }
      // }

      setTimeout(() => {
        row.isdownload = true
        this.queryData()
      }, 100)
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

    linkToFilePage(row) {
      this.breadcrumb.push(row);
      this.IUID = row.iuid;
      this.queryData();
    },

    async queryData() {
      var formData = new FormData();
      formData.append("page", this.page);
      formData.append("rows", this.rows);
      var res = await projectFileApi.post(
        "/api/ProjectFile/GetMydownloadData",
        formData
      );
      this.Total = res.count;

      // filePath 和 turnPath 解码
      res.data && res.data.forEach(item => {
        if (item.fileName) {
          item.fileSuffix = item.fileName.split('.')[item.fileName.split('.').length - 1];
        } else {
          item.fileSuffix = ''
        }

        item.downloadState = JSON.parse(item.downloadState)

        item.downloadState.forEach(x => {
          Object.assign(x, { ...item, isdownload: x.isdownload })
          x.downloadType = x.key
        })
      })

      this.tableData = res.data;
    },
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
