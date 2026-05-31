<template>
  <div class="app-container background table-box">
    <el-dialog
      :title="folderDialogOpeType === 'reset' ? '重命名' : '新建文件夹'"
      :visible.sync="reloadNameDialogVisible"
      width="30%"
    >
      <el-input v-model="inputFileName" />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="reloadNameDialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="reloadNameOK"
        >{{ $t('base.button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <el-row style="display: flex">
      <el-col
        :span="14"
        class="btn-group flex ai-center"
        style="flex: 1"
      >
        <div
          v-if="btnShow && filePermissionCon.setupbit == true"
          class="btnCon mr_10"
        >
          <div
            style="cursor: pointer;flex-shrink:0;font-weight: bold;"
            @click="uploadDialogVisible = !uploadDialogVisible"
          >
            <i
              class="iconfont icon-upload"
              style="font-size: 12px"
            />{{ $t('base.button.upload') }}
          </div>
          <transition name="el-zoom-in-top">
            <div
              v-show="uploadDialogVisible"
              class="uploadFileBox"
            >
              <a
                href="javascript:;"
                class="fileFolderUploadHref"
                @click="uploadDialogVisible = false"
              >{{ $t('base.button.uploadFile') }} <input
                class="fileFolderUploadBtn"
                type="file"
                name="file"
                multiple
                alt="请选择文件"
                @change="submitFile"
              >
              </a>
              <a
                href="javascript:;"
                class="fileFolderUploadHref"
                @click="uploadDialogVisible = false"
              >{{ $t('base.button.uploadFolder') }} <input
                class="fileFolderUploadBtn"
                type="file"
                name="file"
                webkitdirectory
                alt="请选择文件夹"
                @change="fileFolderUpload"
              >
              </a>
            </div>
          </transition>
        </div>
        <el-button
          v-if="btnShow && filePermissionCon.setupbit == true"
          class="mr_10"
          size="small"
          @click="addFolder('add')"
        >
          <i class="iconfont icon-xinjianwenjianjia" />{{ $t('base.button.newFolder') }}
        </el-button>
        <downloadBtn
          v-if="filePermissionCon.downloadbit == true"
          class="mr_10"
          :rows="multipleSelection"
          :full-path="getFolderFullPath"
        />
        <el-button
          v-if="multipleSelection.length >= 1 && leftName != $t('comLib.nav.drawings') && btnShow && filePermissionCon.movebit == true"
          size="small"
          class="mr_10"
          @click="copyTo('move')"
        >
          <i class="iconfont icon-download" />移动到
        </el-button>
        <el-button
          v-if="multipleSelection.length >= 1 && leftName != $t('comLib.nav.drawings') && btnShow && filePermissionCon.movebit == true"
          size="small"
          style="margin-left: 0px;margin-right: 10px;"
          @click="copyTo('copy')"
        >
          <i class="iconfont icon-download" />{{ $t('projects.operation.copyTo') }}
        </el-button>
        <shareMutiple
          v-if="multipleSelection.length >= 1 && $shareMultipleVisible(multipleSelection)"
          :rows="multipleSelection"
          style="margin-right: 10px;"
        />
        <el-button
          v-if="btnShow && filePermissionCon.deletebit == true"
          size="small"
          type="danger"
          @click="handleDelete"
        >
          <i class="iconfont icon-delete" />{{ $t('base.button.delete') }}
        </el-button>
        <!-- <el-buttonsize="mini" @click="reloadTranscoding"><i class="iconfont icon-delete"></i>{{ $t('projects.transcoding.transcoding') }}</el-button> -->
      </el-col>
      <el-col
        :span="8"
        :offset="2"
        class="flex right"
        style="flex: 1"
      >
        <el-input
          v-model="inputValue"
          :placeholder="$t('base.button.inputFilename')"
          prefix-icon="el-icon-search"
          style="width: 240px"
          clearable
          size="mini"
          @change="queryData(true)"
        />
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <a @click="queryAll">{{ leftName }}</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          v-for="(item, index) in breadcrumb"
          :key="index"
          @click="querySelect(item, index)"
        >
          <a @click="querySelect(item, index)">{{ item.fileName }}</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="table">
      <el-table
        :data="tableData"
        class="t-table"
        :row-class-name="tableRowClassName"
        :header-cell-style="$thStyle"
        style="width: 100%; margin-top: 20px; font-size: 13px"
        height="100%"
        stripe
        :default-sort="{ prop: 'createTime', order: 'descending' }"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
      >
        > <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="fileName"
          :label="$t('base.button.fileName')"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <fileIconComponends
              :full-path="getFolderFullPath"
              :row="scope.row"
              @linkToFilePage="linkToFilePage"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="fileSize"
          :label="$t('base.button.fileSize')"
          width="180"
        />
        <el-table-column
          prop="createTime"
          :label="$t('base.button.createTime')"
          sortable="custom"
          width="220"
        />
        <el-table-column
          prop="statusType"
          :label="$t('base.button.fileStatus')"
          width="180"
        >
          <template
            v-if="scope.row.fileSuffix.toLowerCase() != ''"
            slot-scope="scope"
          >
            <fileStatusComponends :scope="scope" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('base.formLabel.operation')">
          <template slot-scope="scope">
            <div class="flex ai-center">
              <operateColCom
                :row="scope.row"
                class="tableOpeColMargin"
                :is-zsk="isZsk"
              />
              <!-- 压缩文件解压操作 -->
              <el-tooltip
                v-if="scope.row.fileSuffix && (scope.row.fileSuffix.toLowerCase() === '.zip' || scope.row.fileSuffix.toLowerCase() === '.rar')"
                class="tableOpeColMargin"
                effect="light"
                content="解压"
                placement="top"
              >
                <i
                  class="el-icon-folder-opened"
                  style="color: #8f9ab4; cursor: pointer"
                  @click="decompression(scope.row)"
                />
              </el-tooltip>
              <template v-if="scope.row.statusType === '3' || scope.row.statusType === '4'">
                <el-tooltip
                  v-if="($modelFileSuffix.indexOf(scope.row.fileSuffix.toLowerCase()) != -1 && scope.row.actionType === '2' && scope.row.fileSuffix.toLowerCase() != '.dgn') || ($reTransCodeVideo.indexOf(scope.row.fileSuffix.toLowerCase()) !== -1 && scope.row.statusType !== '3')"
                  class="tableOpeColMargin"
                  effect="light"
                  content="重新转码"
                  placement="top"
                >
                  <el-link
                    :underline="false"
                    icon="el-icon-convert"
                    @click="reloadTranscoding(scope.row.iuid, undefined, scope.row)"
                  />
                </el-tooltip>
              </template>
              <el-dropdown
                v-if="$modelFileSuffix.indexOf(scope.row.fileSuffix.toLowerCase()) != -1 && scope.row.actionType === '2' && scope.row.fileSuffix.toLowerCase() == '.dgn'"
                @command="handleCommand($event, scope.row)"
              >
                <i
                  class="el-icon-convert"
                  style="color: #8f9ab4; margin-right: 10px"
                />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item, index) in Conversion"
                    :key="index"
                    :command="item.code + '/' + scope.row.iuid"
                  >
                    {{ item.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- 更多 -->
              <el-tooltip
                v-if="filePermissionCon.editbit == true"
                class="tableOpeColMargin"
                effect="light"
                content="重命名"
                placement="top"
              >
                <i
                  class="el-icon-rename shrink"
                  style="color: #8f9ab4; cursor: pointer"
                  @click="reloadClick('reset', scope.row)"
                />
              </el-tooltip>
              <el-tooltip
                v-if="leftName == $t('comLib.nav.companyKnowledge') && scope.row.fileSuffix.toLowerCase() == '' && scope.row.authorizebit == true"
                class="tableOpeColMargin"
                effect="light"
                content="权限设置"
                placement="top"
              >
                <i
                  class="el-icon-setting"
                  style="color: #8f9ab4; cursor: pointer;font-size: 16px"
                  @click="permissionSet(scope.row)"
                />
              </el-tooltip>
              <el-tooltip
                v-if="scope.row.fileSuffix && scope.row.fileSuffix.toLowerCase() === '.json'"
                class="tableOpeColMargin"
                effect="light"
                content="复制链接"
                placement="top"
              >
                <i
                  class="el-icon-document-copy"
                  style="color: #8f9ab4; cursor: pointer;font-size: 16px;"
                  @click="copyLink(scope.row)"
                />
              </el-tooltip>
              <!-- <el-dropdown v-if="btnShow">
              <i class="iconfont icon-more" style="color: #8f9ab4"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="reloadClick('reset', scope.row)" v-if="filePermissionCon.editbit == true">{{ $t('projects.operation.rename') }}</el-dropdown-item>
                <el-dropdown-item @click.native="permissionSet(scope.row)" v-if="leftName == '公司资源库' && scope.row.fileSuffix == '' && scope.row.authorizebit == true">权限设置</el-dropdown-item>
                <template v-if="scope.row.fileSuffix && scope.row.fileSuffix.toLowerCase() === '.json'">
                  <el-dropdown-item @click.native="copyLink(scope.row)">复制链接</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <chunkUploader
      ref="chunkUploader"
      :folder-iuid="IUID"
      is-zsk
      @reloadData="queryData"
    />
    <versionViewComponeds
      :center-dialog-visible.sync="versionDialogVisible"
      :row-data="versionData"
      :selected-data="selectArray"
      @queryADDVersion="queryADDVersionPost"
      @sureVersion="sureVersionPost"
    />
    <!-- 移动复制 -->
    <moveCopyComponends
      :move-copy-dialog-visble.sync="moveCopyDialogVisible"
      :move-copy-type="moveCopyType"
      :row-data="multipleSelection"
      :is-resources="zskBoolean"
      @shiftData="shiftData"
    />
    <!-- 权限设置 -->
    <perssionComponends
      :permission-dialog-visble.sync="setDialogVisible"
      :file-data="perrsionData"
      :file-i-u-i-d="viewFileIuID"
      :is-zsk-set="isZskSetBoo"
      :inheritbit.sync="inheritbit"
      @choseItem="filterData"
      @surePermission="surePermissionPost"
    />
    <pagination
      :page-total="Total"
      @handleCurrentChange="paginationCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
    <partOfDeleteSuccess
      :container-visible.sync="pdsVisible"
      :delete-filelist="deleteFilelist"
      :successcount="successcount"
      :failurecount="failurecount"
    />
  </div>
</template>
<script>
import {
  mapGetters
} from "vuex";
import zskFileApi from "@/api/zsk/index.js";
import conversionApi from "@/api/project/file";
import projectFileApi from "@/api/document/indexApi.js";
import pagination from "@/components/pagination/index";
import chunkUploader from "@/components/ChunkUploader/trigger"; //分片上传触发器
import fileStatusComponends from "@/components/FileStatus";
import fileIconComponends from "@/components/fileIcon";
import operateColCom from "@/components/operateColCom";
import versionViewComponeds from "@/components/versionView";
import downloadBtn from "@/components/PreViewAndlistComBtn/downloadButton";
import moveCopyComponends from "@/components/moveCopyCom";
import perssionComponends from "@/components/permissionsSet";
import shareMutiple from "@/components/Share/shareBtn_mutiple";
import partOfDeleteSuccess from "@/components/partOfDeleteSuccess";
import request from '@/utils/request'
import {
  decrypt
} from '@/utils'
export default {
  components: {
    shareMutiple,
    pagination,
    chunkUploader,
    fileStatusComponends,
    fileIconComponends,
    operateColCom,
    versionViewComponeds,
    downloadBtn,
    moveCopyComponends,
    perssionComponends,
    partOfDeleteSuccess,
  },
  props: {
    btnShow: {
      type: Boolean,
    },
  },
  computed: {
    ...mapGetters(["signalRTableData", "user"]),
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
    $route(to, from) {
      this.handleCreated();
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
      Conversion: [],
      folderDialogOpeType: null,
      moveCopyType: null,
      treeIsvisible: null,
      // data: [],
      reloadNameDialogVisible: false,
      moveCopyDialogVisible: false,
      uploadDialogVisible: false,
      orderBy: "DESC",
      radioSelectedId: "",
      numType: "",
      allData: [],
      folderDialogIndex: "",
      folderDialogAddType: "",
      leftFileIuid: "",
      leftFileMainIuid: "",
      slectedClick: "",
      versionDialogVisible: false,
      versionData: [],
      selectArray: [{
        iuid: null,
        fileType: null,
      },],
      fileIuid: "",
      isZsk: true,
      leftName: "",
      locationRowIndex: null,
      cacheLocationPageIndex: null,
      zskBoolean: true,
      setDialogVisible: false,
      perrsionData: [],
      viewFileIuID: "",
      isZskSetBoo: true,
      filePermissionCon: [],
      pdsVisible: false,
      deleteFilelist: [],
      successcount: 0,
      failurecount: 0,
      inheritbit: false,
      retryCount: 0,
      lastRetryTime: Date.now()
    };
  },
  created() {
    this.breadcrumb = [];
    this.handleCreated();
    this.querySelectConversion();
  },
  mounted() {
    if (this.$route.name == "Mine") {
      this.leftName = this.$t('comLib.nav.myKnowledge');
    } else if (this.$route.name == "Company") {
      this.leftName = this.$t('comLib.nav.companyKnowledge');
    } else if (this.$route.name == "StandardInfo") {
      this.leftName = this.$t('comLib.nav.standard');
    } else if (this.$route.name == "blueprint") {
      this.leftName =this.$t('comLib.nav.drawings');
    }
    //-------------------chunkUploader组件必须----------------------------------
    document.addEventListener("dragenter", this.changeUploadDialogVisible, false);
    document.addEventListener("dragleave", this.changeUploadDialogVisible, false);
    document.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    document.addEventListener("drop", this.changeUploadDialogVisible, false);
    //-------------------chunkUploader组件必须----------------------------------
  },
  destroyed() {
    //-------------------chunkUploader组件必须----------------------------------
    document.removeEventListener("dragenter", this.changeUploadDialogVisible);
    document.removeEventListener("dragleave", this.changeUploadDialogVisible);
    document.removeEventListener("drop", this.changeUploadDialogVisible);
    //-------------------chunkUploader组件必须----------------------------------
  },
  methods: {
    tableRowClassName({
      row,
      rowIndex
    }) {
      if (rowIndex === this.locationRowIndex - 1 && this.page === this.cacheLocationPageIndex) {
        return "success-row";
      }
      return "";
    },
    async handleCreated() {
      if (this.$route.query.pageMode == "location") {
        var fileType = this.$route.query.fileType;
        var iuid = this.$route.query.iuid;
        var res = await projectFileApi.get("/api/Drawing/LocationFileInfo", {
          fileType,
          knowledgeBaseType: this.$route.name,
          iuid,
          pageSize: this.rows,
          orderBy: this.orderBy,
          fileName: this.inputValue,
        });
        if (res.data.fileDeleted) {
          this.$warning('文件已删除，无法进行定位')
          this.$router.go(-1)
          return
        }
        this.breadcrumb = res.data.folders;
        this.IUID = res.data.folderIuid;
        this.inputValue = "";
        this.cacheLocationPageIndex = res.data.pageIndex;
        this.page = res.data.pageIndex;
        this.locationRowIndex = res.data.rowIndex;
      }
      this.queryData();
    },
    async queryData(nameSearch) {
      if (nameSearch) {
        this.locationRowIndex = null;
        this.cacheLocationPageIndex = null;
      }
      var formData = new FormData();
      formData.append("KnowledgeBaseType", this.$route.name);
      formData.append("Orderby", this.orderBy);
      formData.append("IUID", this.IUID);
      formData.append("page", this.page);
      formData.append("rows", this.rows);
      formData.append("FileName", this.inputValue);
      const commonRouteName = ['blueprint', 'StandardInfo']
      var res
      if (commonRouteName.indexOf(this.$route.name) > -1) {
        res = await zskFileApi.post("/api/KnowledgeBase/GetKnowledgeBaseDocument", formData, process.env.VUE_APP_BASE_API);
      } else {
        res = await zskFileApi.post("/api/KnowledgeBase/GetKnowledgeBaseDocument", formData);
      }
      this.Total = res.count;
      // filePath 和 turnPath 解码
      res.data && res.data.forEach(item => {
        item.filePath = decrypt(item.filePath || '')
        item.turnPath = decrypt(item.turnPath || '')
      })
      this.tableData = res.data;
      this.filePermissionCon = res.twodata;
    },
    //-------------------chunkUploader组件必须----------------------------------
    changeUploadDialogVisible(event) {
      event.preventDefault();
      if (event.type === "dragenter") {
        this.elementNode = event.target;
        this.$chunkUploaderChangeVisible(this.$refs["chunkUploader"], true);
      } else if (event.type === "dragleave") {
        if (this.elementNode === event.target) {
          this.uploadDialogVisble = false;
          this.$chunkUploaderChangeVisible(this.$refs["chunkUploader"]);
        }
      } else if (event.type === "drop") {
        this.$chunkUploaderChangeVisible(this.$refs["chunkUploader"]);
        let items = event.dataTransfer.items;
        this.$refs["chunkUploader"].fileDrop(items, this.getFolderFullPath());
      }
    },
    getFolderFullPath() {
      let folderFullPath = "";
      this.breadcrumb.forEach((element) => {
        console.log(element);
        folderFullPath = folderFullPath + "/" + element.fileName;
      });
      folderFullPath = this.leftName + folderFullPath;
      return folderFullPath;
      // return this.$folderFullPath("知识库", []);
    },
    //-------------------chunkUploader组件必须----------------------------------
    paginationCurrentChange(val) {
      this.page = val;
      this.queryData();
    },
    handleSizeChange(val) {
      this.rows = val;
      this.queryData();
    },
    handleCommand(data, row) {
      var list = data.split("/");
      this.reloadTranscoding(list[1], list[0], row);
    },
    async reloadTranscoding(data, tool, row) {
      // if (this.retryCount >= 3 && (Date.now() - this.lastRetryTime < 60000)) {
      //   this.$message.warning('操作频繁，请稍后重试')
      //   return
      // }
      //
      // this.retryCount++
      // this.lastRetryTime = Date.now()
      row.statusType = '-1'
      var res = await zskFileApi.post("/api/KnowledgeBase/ReTranscoding", [{
        iuid: data,
        tool: tool ? tool : ""
      },]);
      if (res.code == 1) {
        this.$message({
          message: "已开始重新转码",
          type: "success",
        });
      } else {
        this.$message({
          message: res.msg,
          type: "success",
        });
      }
    },
    closeModel() {
      this.imodelDialogVisible = false;
    },
    querySelect(item, index) {
      this.locationRowIndex = null;
      this.cacheLocationPageIndex = null;
      this.breadcrumb.splice(index + 1);
      this.page = 1;
      this.IUID = item.iuid;
      console.log(this.IUID);
      this.queryData();
    },
    queryAll() {
      this.page = 1;
      this.locationRowIndex = null;
      this.cacheLocationPageIndex = null;
      this.IUID = "";
      this.breadcrumb = [];
      this.queryData();
    },
    linkToFilePage(row) {
      if (row.lookbit == true) {
        this.page = 1;
        this.breadcrumb.push(row);
        this.IUID = row.iuid;
        this.queryData();
      } else {
        this.$message({
          message: "您没有查看权限，请联系管理员开通此权限",
        });
      }
    },
    reloadClick(type, row) {
      this.folderDialogOpeType = type;
      this.reloadNameIuid = row.iuid;
      this.reloadNameDialogVisible = true;
      this.inputFileName = row.fileName.substr(0, row.fileSuffix.toLowerCase().length > 0 ? row.fileName.lastIndexOf(".") : row.fileName.length);
    },
    versionClick(row) {
      this.selectArray = [];
      this.selectArray.push(row);
      // this.fileIuid = this.selectArray[0].iuid
      // console.log(this.fileIuid)
      this.versionDialogVisible = true;
      this.queryVersionData();
    },
    async queryVersionData() {
      var formData = new FormData();
      formData.append("MainIUID", this.selectArray[0].iuid);
      formData.append("MainFileType", this.selectArray[0].fileType);
      var res = await conversionApi.queryFileVersion(formData);
      this.versionData = res.data;
    },
    queryADDVersionPost() {
      this.queryVersionData();
    },
    sureVersionPost() {
      this.queryData();
    },
    async reloadNameOK() {
      if (this.folderDialogOpeType == "add") {
        if (this.inputFileName == "") {
          this.reloadNameDialogVisible = false;
          return false;
        }
        var formData = new FormData();
        formData.append("KnowledgeBaseType", this.$route.name);
        formData.append("IUID", this.IUID);
        formData.append("Name", this.inputFileName);
        var res = await zskFileApi.post("/api/KnowledgeBase/KnowledgeBaseAdd", formData);
        if (res.code == 1) {
          this.$message({
            message: res.msg,
            type: "success",
          });
          this.queryData();
          this.reloadNameDialogVisible = false;
          this.inputFileName = "";
        }
      } else {
        if (this.folderDialogOpeType === "reset") {
          var fileName = this.inputFileName;
          if (this.inputFileName == "") {
            this.reloadNameDialogVisible = false;
            return false;
          }
          // if (this.inputFileName.indexOf(".") == -1) {
          //   fileName = this.inputFileName;
          // } else {
          //   fileName = this.inputFileName.slice(
          //     0,
          //     this.inputFileName.indexOf(".")
          //   );
          // }
          var formData = new FormData();
          formData.append("IUID", this.reloadNameIuid);
          formData.append("Name", fileName);
          formData.append("KnowledgeBaseType", this.$route.name);
          let url = "/api/KnowledgeBase/KnowledgeBaseRename?IUID=" + this.reloadNameIuid + "&Name=" + fileName + "&KnowledgeBaseType=" + this.$route.name;
          var res = await zskFileApi.post(url, formData);
          if (res.code == 1) {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.reloadNameDialogVisible = false;
            this.queryData();
          }
        }
      }
    },
    // 移动复制
    moveCopy(type, row) {
      this.multipleSelection = [];
      this.moveCopyDialogVisible = true;
      this.moveCopyType = type;
      this.multipleSelection.push(row);
    },
    copyTo(type) {
      this.moveCopyType = type;
      this.moveCopyDialogVisible = true;
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
    handleDelete() {
      if (this.multipleSelection == "") {
        this.$message.error("请选中一行数据");
      } else {
        this.$confirm("确定要删除吗？").then(async () => {
          let IUID = [];
          for (let key in this.multipleSelection) {
            IUID.push(this.multipleSelection[key].iuid);
          }
          var formData = new FormData();
          formData.append("IUID", IUID.join(","));
          formData.append("KnowledgeBaseType", this.$route.name);
          let url = "/api/KnowledgeBase/KnowledgeBaseDelete?IUID=" + IUID.join(",") + "&KnowledgeBaseType=" + this.$route.name;
          var res = await zskFileApi.post(url, formData);
          if (res.code == 1) {
            this.$deleteSuccess();
          } else if (res.code == -2) {
            this.pdsVisible = true;
            this.deleteFilelist = res.data.deleteFilelist;
            this.successcount = res.data.successcount;
            this.failurecount = res.data.failurecount;
          }
          this.queryData();
        });
      }
    },
    async addFolder(type) {
      this.folderDialogOpeType = type;
      this.reloadNameDialogVisible = true;
      this.inputFileName = "";
    },
    sortChange(column) {
      this.locationRowIndex = null;
      this.cacheLocationPageIndex = null;
      if (column.order === null) {
        this.orderBy === "DESC" ? (column.order = "ascending") : (column.order = "descending");
        column.column.order = column.order;
      }
      this.orderBy = column.order == "ascending" ? "ASC" : "DESC";
      this.queryData();
    },
    async querySelectConversion() {
      var res = await conversionApi.querySelectConversion({});
      if (res.code) {
        this.Conversion = res.data;
      }
    },
    fileFolderUpload(event) {
      var _self = this;
      this.$refs.chunkUploader.fileData = [];
      if (event.target.files.length > 1000) {
        this.$message.warning('单次仅支持1000以内的文件上传，可以通过上传压缩包再线上解压的形式上传大批量文件。')
        return
      }
      for (var i = 0; i < event.target.files.length; i++) {
        let item = event.target.files[i];
        this.$refs.chunkUploader.fileData.push({
          folderIuid: _self.IUID,
          fileName: item.name,
          isZsk: true,
          KnowledgeBaseType: _self.$route.name,
          fullPath: _self.getFolderFullPath(),
          relativePath: item.webkitRelativePath,
          file: item,
          fileLocalPath: item.path,
          fileSize: _self.$getFileSize(item.size),
          lastModifiedData: _self.$dayjs(item.lastModifiedDate, "YYYY-MM-DD HH:mm:ss"),
          uploadTime: _self.$dayjs(new Date(), "YYYY-MM-DD HH:mm:ss"),
        });
      }
      this.$refs.chunkUploader.uploadDragFile();
    },
    async submitFile(file) {
      var files = file.target.files;
      var _self = this;
      this.$refs.chunkUploader.fileData = [];
      for (var i = 0; i < files.length; i++) {
        this.$refs.chunkUploader.fileData.push({
          folderIuid: _self.IUID,
          isZsk: true,
          fileName: files[i].name,
          KnowledgeBaseType: _self.$route.name,
          relativePath: files[i].name,
          fullPath: _self.getFolderFullPath(),
          file: files[i],
          fileLocalPath: files[i].path,
          fileSize: _self.$getFileSize(files[i].size),
          lastModifiedData: _self.$dayjs(files[i].lastModifiedDate, "YYYY-MM-DD HH:mm:ss"),
          uploadTime: _self.$dayjs(new Date(), "YYYY-MM-DD HH:mm:ss"),
        });
      }
      this.$refs.chunkUploader.uploadDragFile();
    },
    shiftData() {
      this.queryData();
    },
    //权限设置
    async permissionSet(val) {
      this.setDialogVisible = true;
      this.viewFileIuID = val.iuid;
      var url = "/api/KnowledgeBase/GetKnowledgeBaseAuthorizeData?IUID=" + val.iuid;
      var res = await zskFileApi.post(url);
      this.perrsionData = res.data;
      this.inheritbit = res.twodata
    },
    filterData(val) {
      this.perrsionData = this.perrsionData.filter(
        (i) => !val.includes(i.userName));
    },
    copyLink(row) {
      let downloadUrl = process.env.VUE_APP_BASE_API + '/' + row.filePath
      let input = document.createElement('input')
      input.value = downloadUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      this.$message.success('复制成功')
    },
    surePermissionPost() {
      this.queryData();
    },
    /**
     * 解压压缩文件
     */
    decompression(row) {
      const loading = this.$loading({
        text: '文件正在解压，请稍等...',
        lock: true,
        body: true
      })
      request.get('/api/Home/Testingtemporary', {
        params: {
          IUID: row.iuid,
          filetype: '3',
        }
      }).then(res => {
        // 正常
        if (res.code === 1) {
          this.decompressionHandler(row, res, true).then((data) => {
            loading.close()
            if (data.code === 1) {
              this.$message.success('解压成功')
              this.queryData()
            }
          })
        } else if (res.code === -99) {
          loading.close()
          // 文件被占用
          this.$message.error(res.msg)
        } else if (res.code === -88) {
          loading.close()
          // 之前已解压，是否覆盖
          const h = this.$createElement
          this.$msgbox({
            title: '提示',
            message: h('div', res.msg),
            showCancelButton: true,
            confirmButtonText: '覆盖',
            cancelButtonText: '不覆盖',
            beforeClose: (action, instance, done) => {
              if (action === 'close') {
                done()
                return
              }
              const loading = this.$loading({
                text: '文件正在解压，请稍等...',
                lock: true,
                body: true
              })
              const isCover = action === 'confirm'
              this.decompressionHandler(row, res, isCover).then(() => {
                loading.close()
                this.$message.success('解压成功')
                this.queryData()
              })
              done()
            }
          })
        }
      })
    },
    decompressionHandler(row, res, isCover) {
      return request.get('/api/Home/decompressingfiles', {
        params: {
          knowledgeBaseType: this.$route.name,
          IUID: row.iuid,
          filetype: '3',
          tempIUID: res.data.tempIUID,
          typebit: isCover,
        }
      })
    }
  },
};
</script>
<style>
.el-submenu__title {
  display: none;
}

.same .el-dialog__footer {
  text-align: center;
}
</style>
<style scoped lang="scss">
.right {
  justify-content: flex-end;
}

.topTitle {
  text-align: center;
  padding-bottom: 30px;
}

.bottomCon {
  background: #f7f7f7;
  color: #424e67;
  margin-bottom: 20px;
}

.existing {
  flex: 1;
  padding-top: 17px;
}

.existingTit {
  justify-content: space-around;
  color: rgba(64, 158, 255, 1);
  padding-bottom: 17px;
}

.fileInfo {
  padding-left: 33px;
  line-height: 33px;
  color: gray;
}

.active {
  background: rgba(228, 233, 240, 1) !important;
}

.btnCon {
  position: relative;
  display: inline-block;
  padding: 8px 15px;
  font-size: 12px;
  flex-shrink: 0;
  border-radius: 3px;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
}

.uploadFileBox {
  padding-top: 5px;
  position: absolute;
  top: 28px;
  left: 0px;
  width: 110px;
  height: 70px;
  z-index: 99;
  background-color: white;
  box-shadow: 0 0 10px #ccc;
  border-radius: 3px;
}

.mr_10 {
  margin-right: 10px;
}
</style>
