<template>
  <div class="app-container background table-box">
    <el-dialog
      title="上传文件"
      :visible.sync="fileDialogVisible"
      width="30%"
    >
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :limit="1"
        :file-list="fileList"
        :on-change="fileOnChange"
        :auto-upload="autoUpload"
        :before-upload="beforeUpload"
      >
        <el-button
          size="small"
          type="primary"
        >
          点击上传
        </el-button>
        <div
          slot="tip"
          class="el-upload__tip"
        >
          请上传文件
        </div>
      </el-upload>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="fileDialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="submitFile"
        >{{ $t('base.button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 删除/ -->
    <el-dialog
      title="删除"
      :visible.sync="deleteDialogVisible"
      width="30%"
    >
      <span>确定删除么</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="deleteDialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="deleteFile"
        >{{ $t('base.button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- //重命名 -->
    <el-dialog
      title="重命名"
      :visible.sync="reloadNameDialogVisible"
      width="30%"
    >
      <el-input
        v-model="inputFileName"
        :placeholder="oldPlaceholder"
      />
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
    <!-- //移动复制 -->
    <el-dialog
      :title="moveCopyType === 'move' ? '移动到' : '复制到'"
      :visible.sync="moveCopyDialogVisible"
      width="30%"
    >
      <el-container style="height: 500px; border: 1px solid #eee">
        <el-aside
          width="150px"
          style="background-color: rgb(238, 241, 246);overflow:hidden"
        >
          <el-menu
            :default-openeds="['1','2']"
            style="height:100%"
          >
            <el-submenu
              index="1"
              style="border-bottom:1px solid #eee;"
            >
              <el-menu-item
                :class="{active:activityindex == 0}"
                @click="projectTree(0)"
              >
                项目空间
              </el-menu-item>
            </el-submenu>
            <el-submenu
              index="2"
              style="border-bottom:1px solid #eee"
            >
              <el-menu-item
                :class="{active:activityindex == 1}"
                @click="myTree(1)"
              >
                文档资料
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <!-- 项目文档树 -->
            <el-tree
              :data="data"
              :props="defaultProps"
              @node-click="handleNodeClick"
            >
              <span
                slot-scope="{data}"
                class="custom-tree-node"
              >
                <span>
                  <i
                    class="iconfont icon-wenjian"
                    style="padding-right:10px"
                  />{{ data.name }}
                </span>
              </span>
            </el-tree>
          </el-main>
        </el-container>
      </el-container>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          style="float:left;padding:11px 15px"
          @click="addFolder(activityindex,'add','treeAdd')"
        >
          <i class="iconfont icon-xinjianwenjianjia" />新建文件夹
        </el-button>
        <el-button
          type="primary"
          @click="moveCopySure"
        >{{ $t('base.button.confirm') }}</el-button>
        <el-button @click="moveCopyDialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
      </span>
    </el-dialog>
    <!-- 重名文件 -->
    <el-dialog
      :title="moveCopyType === 'move' ? '移动文件' : '复制文件'"
      :visible.sync="sameFileDialogVisible"
      width="30%"
      class="same"
    >
      <div class="topTitle">
        <span v-if="moveCopyType != 'move'">复制的位置已经包含了同名的文件，请选择你的操作：</span>
        <span v-if="moveCopyType === 'move'">移动的位置已经包含了同名的文件，请选择你的操作：</span>
      </div>
      <div>
        <div
          class="flex existingTit"
          style=""
        >
          <div>已有的文件</div>
          <div>正在<span v-if="moveCopyType != 'move'">复制的</span><span v-if="moveCopyType === 'move'">移动的</span>文件：</div>
        </div>
        <div
          v-for="(item,index) in sameFileData"
          :key="index"
          class="bottomCon"
        >
          <div
            v-for="(Data,i) in item.data"
            :key="i"
            class="flex"
            style="border-bottom:1px solid #eee;padding: 0 15px 15px 15px;"
          >
            <div class="existing">
              <div class="flex">
                <span>
                  <fileIconComponends
                    :full-path="getFolderFullPath"
                    :row="Data"
                    class="fontStyle"
                    @linkToFilePage="linkToFilePage"
                  />
                </span>
              </div>
              <div class="fileInfo">
                <span>{{ Data.fileSize }}</span><span class="fileInfo">{{ Data.createTime }}</span>
              </div>
            </div>
            <div class="existing">
              <div class="flex">
                <span>
                  <fileIconComponends
                    :full-path="getFolderFullPath"
                    :row="Data"
                    class="fontStyle"
                    @linkToFilePage="linkToFilePage"
                  />
                </span>
              </div>
              <div class="fileInfo">
                <span>{{ Data.fileSize }}</span><span class="fileInfo">{{ Data.createTime }}</span>
              </div>
            </div>
          </div>
          <div style="width:70%;margin:auto;padding:15px 0">
            <el-radio-group v-model="item.rowRadio">
              <el-radio
                v-for="opt in danoptions"
                :key="opt.label"
                :label="opt.label"
                @change="radioChanges(item.rowRadio)"
              >
                {{ opt.value }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer flex"
        style="justify-content:space-between"
      >
        <!-- <el-button type="primary"
                   @click="replaceSure">替换文件</el-button>
        <el-button type="primary"
                   @click="additionalSure">保留两个文件</el-button> -->
        <div style="margin:auto 0">
          <el-radio-group
            v-model="allRadio"
            @change="allRadioChanges"
          >
            <el-radio label="1">跳过本组</el-radio>
            <el-radio label="2">生成副本</el-radio>
            <el-radio label="3">覆盖文件</el-radio>
          </el-radio-group>
        </div>
        <div>
          <el-button @click="sameFileDialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="replaceSure"
          >{{ $t('base.button.confirm') }}</el-button>
        </div>
      </span>
    </el-dialog>
    <el-row>
      <el-col
        :span="14"
        class="btn-group"
      >
        <downloadBtn
          :rows="multipleSelection"
          :full-path="getFolderFullPath"
        />
        <el-button
          v-if="multipleSelection.length>=1"
          size="mini"
          @click="copyTo('move')"
        >
          <i class="iconfont icon-download" />移动到
        </el-button>
        <el-button
          v-if="multipleSelection.length>=1"
          size="mini"
          @click="copyTo('copy')"
        >
          <i class="iconfont icon-download" />复制到
        </el-button>
      </el-col>
      <el-col
        :span="8"
        :offset="2"
        class="flex right"
      >
        <el-input
          v-model="inputValue"
          :placeholder="$t('base.button.inputFilename')"
          prefix-icon="el-icon-search"
          style="width: 240px"
          clearable
          size="mini"
          @change="queryData"
        />
      </el-col>
    </el-row>
    <el-row
      v-if="breadcrumb.length > 0"
      style="margin-top: 20px"
    >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a @click="queryAll">文件夹</a></el-breadcrumb-item>
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
        class="t-table"
        :data="tableData"
        height="100%"
        :header-cell-style="$thStyle"
        style="margin-top: 20px; font-size: 13px"
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
          show-overflow-tooltip
          prop="fileName"
          :label="$t('base.button.fileName')"
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
          prop="projectText"
          label="文件来源"
          show-overflow-tooltip
          width="200"
          :formatter="formatterProject"
        />
        <el-table-column
          prop="fileSize"
          :label="$t('base.button.fileSize')"
          width="120"
        />
        <el-table-column
          prop="createTime"
          label="上传时间"
          sortable="custom"
          width="200"
        />
        <el-table-column
          prop="userName"
          label="上传人"
          width="120"
        />
        <el-table-column
          prop="statusType"
          :label="$t('base.button.fileStatus')"
          width="120"
        >
          <template
            v-if="scope.row.fileSuffix.toLowerCase() != ''"
            slot-scope="scope"
          >
            <fileStatusComponends :scope="scope" />
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('base.formLabel.operation')"
        >
          <template slot-scope="scope">
            <operateColCom
              :row="scope.row"
              class="tableOpeColMargin"
            />
            <!-- 更多 -->
            <el-dropdown>
              <i
                class="iconfont icon-more"
                style="color: #8f9ab4"
              />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="moveCopy('move', scope.row)">
                  移动到
                </el-dropdown-item>
                <el-dropdown-item @click.native="moveCopy('copy', scope.row)">
                  {{ $t('projects.operation.copyTo') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.fileSuffix.toLowerCase()!=''"
                  style="text-align:center"
                  @click.native="versionClick(scope.row)"
                >
                  版本
                </el-dropdown-item>
                <!-- <el-dropdown-item @click.native="reloadClick('reset', scope.row)">{{ $t('projects.operation.rename') }}</el-dropdown-item> -->
                <template v-if="scope.row.fileSuffix && scope.row.fileSuffix.toLowerCase() === '.json'">
                  <el-dropdown-item @click.native="copyLink(scope.row)">
                    复制链接
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <pagination
      :page-total="Total"
      @handleCurrentChange="paginationCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
    <versionViewComponeds
      :center-dialog-visible.sync="versionDialogVisible"
      :row-data="versionData"
      :selected-data="selectArray"
      @queryADDVersion="queryADDVersionPost"
      @sureVersion="sureVersionPost"
    />
  </div>
</template>
<script>
  import {
    mapGetters
  } from "vuex";
  import projectFileApi from "@/api/document/indexApi.js";
  import conversionApi from "@/api/project/file";
  import pagination from "@/components/pagination/index";
  import fileStatusComponends from "@/components/FileStatus"
  import fileIconComponends from "@/components/fileIcon"
  import operateColCom from "@/components/operateColCom"
  import versionViewComponeds from "@/components/versionView"
  import downloadBtn from "@/components/PreViewAndlistComBtn/downloadButton"
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
        rows: 20,
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
        moveCopyType: null,
        formData: {
          IUID: [],
          FileType: [],
          Operationtype: '',
          TargetIUID: '',
          TargetFileType: '',
          Parentlevel: '',
          Operatingstate: []
        },
        treeIsvisible: null,
        data: [],
        sameFileData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        reloadNameDialogVisible: false,
        moveCopyDialogVisible: false,
        sameFileDialogVisible: false,
        activityindex: 0,
        allRadio: '',
        danoptions: [{
          label: "1",
          value: '跳过本组'
        }, {
          label: "2",
          value: '生成副本'
        }, {
          label: "3",
          value: '覆盖文件'
        }, ],
        radioSelectedId: '',
        numType: '',
        allData: [],
        folderDialogIndex: '',
        folderDialogAddType: '',
        leftFileIuid: '',
        leftFileMainIuid: '',
        slectedClick: '',
        orderBy: 'DESC',
        versionDialogVisible: false,
        versionData: [],
        selectArray: []
      };
    },
    created() {
      this.breadcrumb = [];
      this.queryData();
    },
    methods: {
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
        this.IUID = item.iuid;
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
        // var formData = new FormData();
        // formData.append("IUID", this.reloadNameIuid);
        // formData.append("Name", this.inputFileName);
        // let url =
        //   "/api/Drawing/DrawingFileRename?IUID=" +
        //   this.reloadNameIuid +
        //   "&Name=" +
        //   this.inputFileName;
        // var res = await projectFileApi.post(url, formData);
        // this.$message(res.msg);
        // this.reloadNameDialogVisible = false;
        // this.queryData();
        if (this.folderDialogIndex == 1) {
          var formData = new FormData();
          formData.append("IUID", this.formData.TargetIUID);
          formData.append("name", this.inputFileName);
          var res = await projectFileApi.post("/api/Drawing/DrawingFileAdd", formData);
          this.$message(res.msg);
          this.myTree(1);
          this.reloadNameDialogVisible = false;
        } else {
          if (this.treeIsvisible != false) {
            var formData = new FormData();
            formData.append("name", this.inputFileName);
            formData.append("MainIUID", this.leftFileIuid);
            formData.append("IUID", this.leftFileMainIuid);
            var res = await conversionApi.addFolder(formData);
            this.$message(res.msg);
            this.projectTree(0);
            this.reloadNameDialogVisible = false;
          } else {
            var formData = new FormData();
            formData.append("MainIUID", this.formData.TargetIUID);
            formData.append("Name", this.inputFileName);
            var res = await projectFileApi.post("/api/ProjectManagement/ProjectFileAdd", formData);
            this.$message(res.msg);
            this.projectTree(0);
            this.reloadNameDialogVisible = false;
          }
        }
      },
      async addFolder(index, type, addType) {
        this.folderDialogIndex = index;
        // var formData = new FormData();
        // formData.append("flie", "");
        // formData.append("IUID", this.IUID);
        // var res = await projectFileApi.post(
        //   "/api/Drawing/DrawingFileAdd",
        //   formData
        // );
        // this.$message(res.msg);
        // this.queryData();
        if (index == 0) {
          if ((this.formData.TargetIUID == '') && (this.formData.Operationtype == "YD" || this.formData.Operationtype == "FZ")) {
            this.$message({
              message: "请选择目标文件",
            });
          } else {
            this.reloadNameDialogVisible = true
          }
        } else {
          if ((this.slectedClick != 1) && (this.formData.Operationtype == "YD" || this.formData.Operationtype == "FZ")) {
            this.$message({
              message: "请选择目标文件",
            });
          } else {
            this.reloadNameDialogVisible = true
          }
        }
      },
      // 移动复制
      moveCopy(type, row) {
        // this.multipleSelection.push(row)
        this.formData.IUID = []
        this.formData.FileType = []
        this.formData.Operatingstate = []
        for (let key in this.multipleSelection) {
          this.formData.IUID.push(this.multipleSelection[key].iuid)
          this.formData.FileType.push(this.multipleSelection[key].fileType);
          this.formData.Operatingstate.push(0);
        }
        this.moveCopyType = type;
        this.numType = "one"
        if (type == "move") {
          this.formData.Operationtype = "YD"
        } else {
          this.formData.Operationtype = "FZ"
        }
        this.moveCopyDialogVisible = true;
        this.projectTree(0)
      },
      async moveCopyPost() {
        if (this.treeIsvisible == false && (this.formData.Operationtype == "YD" || this.formData.Operationtype == "FZ")) {
          this.$message({
            message: "不是目录文件，请重新选择",
          });
        } else {
          let oneData = []
          var formData = new FormData();
          formData.append("IUID", JSON.stringify(this.formData.IUID));
          formData.append("FileType", JSON.stringify(this.formData.FileType));
          formData.append("Operatingstate", JSON.stringify(this.formData.Operatingstate));
          formData.append("Operationtype", this.formData.Operationtype);
          formData.append("TargetIUID", this.formData.TargetIUID);
          formData.append("TargetFileType", this.formData.TargetFileType);
          formData.append("Parentlevel", this.formData.Parentlevel);
          var res = await conversionApi.moveCopyProTree(formData)
          this.sameFileDialogVisible = true;
          this.moveCopyDialogVisible = false;
          this.sameFileData = res.data.filter((item) => item.code == "2");
          console.log(this.sameFileData)
          //添加选中操作属性
          for (let key in this.sameFileData) {
            this.$set(this.sameFileData[key], 'rowRadio', '')
          }
          oneData = res.data.filter((item) => item.code == "1");
          this.allData = res.data;
          console.log(this.allData)
          if (oneData.length == res.data.length) {
            this.sameFileDialogVisible = false;
            this.queryData();
          }
        }
      },
      radioChanges(val) {
        this.radioSelectedId = val
        // for (let key in this.sameFileData) {
        //   this.sameFileData[key].rowRadio = val
        //   // if (this.sameFileData[key].rowRadio != this.sameFileData[key].rowRadio) {
        //   //   this.allRadio = ''
        //   // }
        // }
      },
      allRadioChanges(val) {
        for (let key in this.sameFileData) {
          this.sameFileData[key].rowRadio = val
        }
      },
      moveCopySure() {
        this.moveCopyPost()
        if (this.formData.Operationtype == "FZ" && this.allData.length != 0) {
          this.$message({
            message: "复制成功",
            type: "success",
          });
        } else if (this.formData.Operationtype == "YD" && this.allData.length != 0) {
          this.$message({
            message: "移动成功",
            type: "success",
          });
        }
      },
      copyTo(type) {
        this.moveCopyType = type;
        this.numType = "more"
        this.projectTree(0)
        this.formData.IUID = []
        this.formData.FileType = []
        this.formData.Operatingstate = []
        for (let key in this.multipleSelection) {
          this.formData.IUID.push(this.multipleSelection[key].iuid)
          this.formData.FileType.push(this.multipleSelection[key].fileType);
          this.formData.Operatingstate.push(0);
        }
        if (type == "move") {
          this.formData.Operationtype = "YD"
        } else {
          this.formData.Operationtype = "FZ"
        }
        this.moveCopyDialogVisible = true;
      },
      //覆盖
      replaceSure() {
        //判断选中多条覆盖或生成副本需清空之前的iuid和fileType
        this.formData.IUID = []
        this.formData.FileType = []
        this.formData.Operatingstate = []
        //判断生成副本还是覆盖文件
        for (let key in this.multipleSelection) {
          for (let k in this.sameFileData) {
            for (let y in this.sameFileData[k].data) {
              if (this.multipleSelection[key].fileName == this.sameFileData[k].data[y].fileName) {
                if (this.sameFileData[k].rowRadio == '2') {
                  this.formData.Operatingstate.push(1);
                  this.formData.IUID.push(this.multipleSelection[key].iuid)
                  this.formData.FileType.push(this.multipleSelection[key].fileType);
                } else if (this.sameFileData[k].rowRadio == '3') {
                  this.formData.Operatingstate.push(2);
                  this.formData.IUID.push(this.multipleSelection[key].iuid)
                  this.formData.FileType.push(this.multipleSelection[key].fileType);
                }
              }
              if (this.formData.Operationtype == "FZ" && this.sameFileData[k].rowRadio != "1") {
                console.log(this.formData.Operationtype + this.allData.length)
                this.$message({
                  message: "复制成功",
                  type: "success",
                });
              } else if (this.formData.Operationtype == "YD" && this.sameFileData[k].rowRadio != "1") {
                this.$message({
                  message: "移动成功",
                  type: "success",
                });
              }
            }
          }
        }
        this.moveCopyPost()
        this.sameFileDialogVisible = false;
        this.allRadio = ''
      },
      async projectTree(index) {
        this.activityindex = index
        var res = await projectFileApi.post("/api/Home/ProjectTreeData", '')
        this.data = res.data
      },
      async myTree(index) {
        this.activityindex = index
        this.data = []
        var res = await projectFileApi.post("/api/Home/IndividualTreeData", '')
        this.data.push(res.data)
      },
      handleNodeClick(data) {
        this.slectedClick = 1
        this.inputFileName = ''
        this.treeIsvisible = data.isvisible;
        this.formData.TargetIUID = data.iuid;
        this.formData.TargetFileType = data.fileType;
        this.formData.Parentlevel = data.parentlevel;
        if (data.parentlevel == '0') {
          this.leftFileIuid = data.iuid;
          this.leftFileMainIuid = '';
        } else {
          this.leftFileMainIuid = data.iuid
        }
      },
      formatterProject(row) {
        if (row.projectText == "") {
          return "文档资料";
        } else {
          return row.projectText;
        }
      },
      formaResouse(row) {
        switch (row.fileType) {
          case "0":
            return "文档资料";
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
        let url = "/api/Drawing/DrawingFileDelete?IUID=" + IUID.join(",") + "&fileType=" + fileType.join(",");
        var res = await projectFileApi.post(url, formData);
        this.$message(res.msg);
        this.deleteDialogVisible = false;
        this.queryData();
      },
      getFolderFullPath() {
        return this.$folderFullPath("图档 / 全部文件", this.breadcrumb)
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
          this.orderBy === "DESC" ? (column.order = "ascending") : (column.order = "descending");
          column.column.order = column.order;
        }
        this.orderBy = column.order == "ascending" ? "ASC" : "DESC";
        this.queryData();
      },
      async queryData() {
        var formData = new FormData();
        formData.append("Orderby", this.orderBy);
        formData.append("IUID", this.IUID);
        formData.append("page", this.page);
        formData.append("rows", this.rows);
        formData.append("FileName", this.inputValue);
        var res = await projectFileApi.post("/api/Drawing/GetAlldocumentsData", formData);
        this.Total = res.count;
        // filePath 和 turnPath 解码
        res.data && res.data.forEach(item => {
          item.filePath = decrypt(item.filePath || '')
          item.turnPath = decrypt(item.turnPath || '')
        })
        this.tableData = res.data;
      },
      async submitFile() {
        var res = await projectFileApi.AjaxFile(this.fileList[0].raw, 0, "", this.IUID, true, this);
        this.$message("上传进行中");
        this.fileDialogVisible = false;
      },
      versionClick(row) {
        this.selectArray = []
        this.selectArray.push(row)
        this.versionDialogVisible = true;
        this.queryVersionData()
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
      queryADDVersionPost() {
        this.queryVersionData()
      },
      async queryVersionData() {
        var formData = new FormData();
        formData.append("MainIUID", this.selectArray[0].iuid);
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
<style>
  .el-submenu__title {
    display: none;
  }

  .same .el-dialog__footer {
    text-align: center;
  }

  /* .el-dropdown {
  margin-right: 10px;
} */
</style>
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

  .topTitle {
    text-align: center;
    padding-bottom: 30px;
  }

  .bottomCon {
    background: #f7f7f7;
    color: #424e67;
    // padding: 0 15px 15px 15px;
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
</style>
