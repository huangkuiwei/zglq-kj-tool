<template>
  <div class="app-container background table-box">
    <el-row>
      <el-col :span="22" class="btn-group">
        <shareMutiple v-if="multipleSelection.length > 0 && $shareMultipleVisible(multipleSelection)" :rows="multipleSelection" />
        <el-button type="danger" v-if="multipleSelection.length > 0" size="small" @click="cancelCollect">取消收藏</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px" v-if="breadcrumb.length >= 0">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <a @click="queryAll">{{ $t('base.button.allFile') }}</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item @click="querySelect(item, index)" v-for="(item, index) in breadcrumb" :key="index">
          <a @click="querySelect(item, index)">{{ item.fileName }}</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="table">
      <el-table :data="tableData" class="t-table" :header-cell-style="$thStyle" style="margin-top: 20px; font-size: 13px" stripe height="100%" @selection-change="handleSelectionChange" @sort-change="sortChange" :default-sort="{ prop: 'createTime', order: 'descending' }">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column show-overflow-tooltip prop="fileName" :label="$t('base.button.fileName')">
          <template slot-scope="scope">
            <fileIconComponends :fullPath="getFolderFullPath" :row="scope.row" @linkToFilePage="linkToFilePage" />
          </template>
        </el-table-column>
        <el-table-column prop="projectText" :label="$t('base.button.fileSource')" :formatter="formatterProject" show-overflow-tooltip width="200">
        </el-table-column>
        <el-table-column prop="fileSize" :label="$t('base.button.fileSize')" width="120">
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('base.button.collectionTime')" width="200" sortable='custom'>
          <template slot-scope="scope">
            <span v-if="scope.row.isChildFile == 1">{{ cacheCollectionDate }}</span>
            <span v-else>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileCreateTime" :label="$t('base.button.createTime')" width="200">
        </el-table-column>
        <el-table-column prop="statusType" :label="$t('base.button.fileStatus')" width="120">
          <template slot-scope="scope" v-if="scope.row.fileSuffix != ''">
            <fileStatusComponends :scope="scope" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('base.formLabel.operation')" width="120">
          <template slot-scope="scope">
            <operateColCom :row="scope.row" class="tableOpeColMargin" :isZsk="isZsk" />
            <!-- 更多 -->
            <!-- <el-dropdown>
              <i class="iconfont icon-more"
                 style="color: #8f9ab4"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="versionClick(scope.row)"
                                  style="text-align:center"
                                  v-if="scope.row.fileSuffix!=''">版本</el-dropdown-item>
                <el-dropdown-item @click.native="reloadClick('reset', scope.row)">{{ $t('projects.operation.rename') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <pagination :pageTotal="Total" @handleCurrentChange="paginationCurrentChange" @handleSizeChange="handleSizeChange"></pagination>
    <versionViewComponeds :centerDialogVisible.sync="versionDialogVisible" :rowData="versionData" :selectedData="selectArray" @queryADDVersion="queryADDVersionPost" @sureVersion="sureVersionPost" :collectType="collectType"></versionViewComponeds>
  </div>
</template>
<script>
import {
  mapGetters
} from "vuex";
import zskFileApi from "@/api/zsk/index.js";
import commonApi from "@/api/common";
import pagination from "@/components/pagination/index";
import conversionApi from "@/api/project/file";
import fileStatusComponends from "@/components/FileStatus";
import fileIconComponends from "@/components/fileIcon";
import operateColCom from "@/components/operateColCom";
import versionViewComponeds from "@/components/versionView"
import shareMutiple from "@/components/Share/shareBtn_mutiple"
import {
  decrypt
} from '@/utils'
export default {
  components: {
    pagination,
    fileStatusComponends,
    fileIconComponends,
    operateColCom,
    versionViewComponeds,
    shareMutiple
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
      rows: 20,
      // ---------------
      input2: "",
      fileDialogVisible: false,
      reloadNameDialogVisible: false,
      shareDialogVisible: false,
      autoUpload: false,
      fileList: [],
      tableData: [],
      multipleSelection: [],
      breadcrumb: [],
      IUID: "",
      cacheCollectionDate: null,
      fileType: "",
      inputFileName: "",
      shareFileName: "",
      reloadNameIuid: "",
      deleteDialogVisible: false,
      oldPlaceholder: "",
      orderBy: "DESC",
      versionDialogVisible: false,
      versionData: [],
      selectArray: [],
      collectType: "collect",
      isZsk: true
    };
  },
  created() {
    this.breadcrumb = [];
    this.queryData();
  },
  methods: {
    getFolderFullPath() {
      return this.$folderFullPath("图档 / 我的收藏", this.breadcrumb);
    },
    paginationCurrentChange(val) {
      this.page = val;
      this.queryData();
    },
    handleSizeChange(val) {
      this.rows = val;
      this.queryData();
    },
    querySelect(item, index) {
      this.breadcrumb.splice(index + 1);
      this.IUID = item.mainIUID;
      this.fileType = item.fileType;
      this.queryData();
    },
    queryAll() {
      this.IUID = "";
      this.breadcrumb = [];
      this.queryData();
    },
    linkToFilePage(row) {
      this.breadcrumb.push(row);
      this.IUID = row.mainIUID;
      this.cacheCollectionDate = row.createTime
      this.fileType = row.fileType;
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
      let url = "/api/Drawing/DrawingFileRename?IUID=" + this.reloadNameIuid + "&Name=" + this.inputFileName;
      var res = await projectFileApi.post(url, formData);
      this.$message(res.msg);
      this.reloadNameDialogVisible = false;
      this.queryData();
    },
    async cancelCollect() {
      let formData = this.multipleSelection.map(item => {
        return {
          IUID: item.iuid,
          FileType: item.fileType,
        }
      })
      var res = await commonApi.cancelCollect(formData, this.isZsk);
      if (res.code == 1) {
        this.$success(res.msg)
        this.queryData()
      }

    },
    formatter(row) {
      if (row.actionType != "" && row.fileSuffix.toLowerCase() != "" && row.fileSuffix.toLowerCase() != ".dgn") {
        switch (row.actionType) {
          case "0":
            return "上传失败";
            break;
          case "1":
            return "正在上传";
            break;
          case "2":
            return "上传完成";
            break;
        }
      } else if (row.fileSuffix.toLowerCase() == "") {
        return "";
      } else if (row.fileSuffix.toLowerCase() == ".dgn") {
        switch (row.statusType) {
          case "0":
            return "上传中";
            break;
          case "1":
            return "上传中";
            break;
          case "2":
            return "转码中";
            break;
          case "3":
            return "完成";
            break;
        }
      }
    },
    formatterProject(row) {
      if (row.projectText == "") {
        return "知识库";
      } else {
        return row.projectText;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    sortChange(column) {
      if (column.order === null) {
        this.orderBy === "DESC" ? (column.order = "ascending") : (column.order = "descending");
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
      formData.append("IUID", this.IUID);
      formData.append("fileType", this.fileType);
      var res = await zskFileApi.post("/api/KnowledgeBase/GetCollection", formData);
      this.Total = res.count;
      // filePath 和 turnPath 解码
      res.data && res.data.forEach(item => {
        item.filePath = decrypt(item.filePath || '')
        item.turnPath = decrypt(item.turnPath || '')
      })
      this.tableData = res.data;
    },
    versionClick(row) {
      console.log(row)
      this.selectArray = []
      this.selectArray.push(row)
      this.versionDialogVisible = true;
      this.queryVersionData()
    },
    queryADDVersionPost() {
      this.queryVersionData()
    },
    async queryVersionData() {
      var formData = new FormData();
      formData.append("MainIUID", this.selectArray[0].mainIUID);
      formData.append("MainFileType", this.selectArray[0].fileType);
      var res = await conversionApi.queryFileVersion(formData);
      this.versionData = res.data
    },
    sureVersionPost() {
      this.queryData();
    },
  },
};
</script>
<style scoped lang="scss">
.shareText {
  font-size: 14px;
  color: #3194d0;
  margin-left: 10px;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  background: transparent;
  width: 100%;
  border: none;
  line-height: 20px;
  height: 109px;
  padding: 0;
  white-space: break-spaces;
  resize: none;
}

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
