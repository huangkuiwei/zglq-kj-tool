<template>
  <div class="dialog-container">
    <el-dialog title="历史版本" append-to-body :visible="centerDialogVisible" width="1250px" :modal-append-to-body="false" v-dialogDrag custom-class="dialogFixedZindex" :close-on-click-modal="false" :before-close="closeDialog">
      <el-table ref="multipleTable" :header-cell-style="$thStyle" :data="rowData" tooltip-effect="light" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column label="版本" prop="versionNumber" align="center" width="100">
          <template slot-scope="scope">
            <el-tooltip content="当前版本" placement="top" effect="dark">
              <i class="iconfont icon-dangqian" v-if="scope.row.effective == 1" style="color: #48dba4"></i>
            </el-tooltip>
            {{ scope.row.versionNumber }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('base.button.fileName')" min-width="150" prop="fileName" />
        <el-table-column prop="createTime" label="更新时间" align="center" width="160" />
        <el-table-column prop="creatorName" label="更新人员" align="center" show-overflow-tooltip />
        <el-table-column prop="reason" label="版本变更原因" align="center" show-overflow-tooltip />
        <el-table-column prop="contenttext" label="版本变更内容" align="center" show-overflow-tooltip />
        <el-table-column prop="statusType" label="状态" align="center" width="100">
          <template slot-scope="scope">
            <template v-if="scope.row.statusType != '3'">
              <fileStatusComponends style="display: block;" :scope="scope" />
            </template>
            <template v-else>
              <el-tag size="small" v-if="scope.$index != rowData.length - 1" :type="contrastTypeName(scope.row.contrastType, 'type')">{{ contrastTypeName(scope.row.contrastType, 'name') }}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column min-width="120" :label="$t('base.formLabel.operation')" align="center">
          <template slot-scope="scope">
            <div class="flex jc-center">
              <el-button type="text" v-if="scope.row.contrastType != '3' && scope.row.versionNumber != 'V1'" @click="openContrastEvent(scope.$index)">对比差异</el-button>
              <el-button type="text" v-if="scope.row.contrastType == '3' && scope.row.versionNumber != 'V1'" @click="viewDeff(scope.$index)">查看结果</el-button>
              <el-button type="text" style="color:#48dba4" v-if="scope.row.effective != 1" @click="setEffect(scope.row)">设为生效</el-button>
              <el-button type="text" style="color:#F56C6C;" v-if="scope.row.effective != 1" @click="deleteFile(scope.row)">{{ $t('base.button.delete') }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer flex" style="justify-content: space-between">
        <div class="flex ai-center">
          <el-button class="fileFolderUploadHref" style="color:#48dba4;border-color:#48dba4;width:130px;line-height:unset" size="mini">上传新版本
            <input ref="file" class="fileFolderUploadBtn" type="file" name="file" @change="uploadNewVersion" />
          </el-button>

        </div>
        <div>
          <el-button @click="closeDialog" size="mini">{{ $t('base.button.cancel') }}</el-button>
          <el-button type="success" style="background: #409eff; border-color: #409eff" @click="effectSure" size="mini">{{ $t('base.button.confirm') }}</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="新版本上传" append-to-body :visible.sync="versionUploadVisible" width="520px">
      <el-form :model="vForm" ref="vForm" :rules="vFormRules" label-width="120px" :inline="false" label-suffix=":">
        <el-form-item :label="$t('base.button.fileName')">
          {{ uploadFileName }}
        </el-form-item>
        <el-form-item label="版本号" prop="versionNumber">
          <div class="flex ai-center">
            <div style="margin-right: 5px;">V</div>
            <el-input placeholder="请输入版本号" size="small" @input="versionInput" v-model.trim="vForm.versionNumber"></el-input>
          </div>
        </el-form-item>

        <el-form-item label="版本变更原因">
          <div class="flex ai-center">
            <el-input type="textarea" rows="5" placeholder="请输入" size="small" v-model="vForm.reason"></el-input>
          </div>
        </el-form-item>

        <el-form-item label="版本变更内容">
          <div class="flex ai-center">
            <el-input type="textarea" rows="5" placeholder="请输入" size="small" v-model="vForm.contenttext"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="versionUploadVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="handleValidate">上传</el-button>
      </span>
    </el-dialog>

    <el-dialog v-loading="loading" element-loading-text="正在关闭模型" element-loading-background="rgba(0, 0, 0, 0.8)" title="版本差异" :visible.sync="deffDialogVisible" :modal-append-to-body="false" custom-class="deffDialog" :before-close="closeDeffDialog">
      <el-radio-group v-model="showType" size="mini" @change="showTypeChange" style="margin-bottom: 10px">
        <el-radio-button label="模型对比"></el-radio-button>
        <el-radio-button label="差异统计"></el-radio-button>
      </el-radio-group>
      <modelComparisonDialog ref="compare" :onViewOpened.sync="onViewOpened" @setIfm1Data="setIfm1Data" @setIfm2Data="setIfm2Data" :isSmallSize="isSmallSize" :allDeffData="allDefModel" :rowData="rowData" :modelComparisonDialog.sync="modelComparisonDialogVisible" v-show="showComparison" v-if="modelComparisonDialogVisible" :currentRow="currentRow" />
      <div class="flex ai-center jc-around chartsBox" v-show="!showComparison">
        <div class="chartsView" id="barCharts" ref="barCharts"></div>
        <el-divider direction="vertical"></el-divider>
        <div class="chartsView" id="ringCharts" ref="ringCharts"></div>
      </div>
      <el-tabs v-model="deffActiveTab" @tab-click="deffTabsChange">
        <el-tab-pane :label="`新增构件(${addCount})`" name="add"></el-tab-pane>
        <el-tab-pane :label="`删除构件(${deleteCount})`" name="delete"></el-tab-pane>
        <el-tab-pane :label="`修改构件(${changeCount})`" name="change"></el-tab-pane>
        <el-tab-pane :label="`相同构件(${sameCount})`" name="same"></el-tab-pane>
      </el-tabs>
      <el-table :data="deffData" :key="deffActiveTab" :header-cell-style="$thStyle" :row-class-name="setClassName" cell-class-name="cellStyle" height="280">
        <el-table-column align="center" type="expand">
          <template slot-scope="scope" v-if="scope.row.info1.length > 1 || scope.row.info2.length > 1">
            <div class="flex jc-between" style="text-align: center;" v-for="(item, idx) in deffActiveTab == 'add' ? scope.row.info2 : scope.row.info1" :key="idx">
              <div style="width:48px">{{ idx + 1 }}</div>
              <template>
                <div style="width: calc((100% - 248px)/4);">
                  {{ scope.row.elementID }}
                </div>
                <div style="width: calc((100% - 248px)/4);">
                  {{ deffActiveTab == 'add' ? scope.row.info2[idx].id : deffActiveTab == 'delete' ? scope.row.info1[idx].id : (deffActiveTab == 'change' || deffActiveTab == 'same') ? scope.row.info1[idx].id + ' / ' + scope.row.info2[idx].id : '' }}
                </div>
                <div style="width: calc((100% - 248px)/4);">
                  {{ deffActiveTab == 'add' ? scope.row.info2[idx].name : deffActiveTab == 'delete' ? scope.row.info1[idx].name : (deffActiveTab == 'change' || deffActiveTab == 'same') ? scope.row.info1[idx].name + ' / ' + scope.row.info2[idx].name : '' }}
                </div>
                <div style="width: calc((100% - 248px)/4);">
                  {{ deffActiveTab == 'add' ? scope.row.info2[idx].type : deffActiveTab == 'delete' ? scope.row.info1[idx].type : (deffActiveTab == 'change' || deffActiveTab == 'same') ? scope.row.info1[idx].type + ' / ' + scope.row.info2[idx].type : '' }}
                </div>
              </template>
              <div style="width:200px">
                <el-button type="text" size="small" :disabled="!onViewOpened" @click="viewElement(scope.row, idx)">定位构件</el-button>
                <el-button type="text" size="small" :disabled="!onViewOpened" @click="elementDetail(scope.row, false, idx)">查看属性</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="elementID" align="center" label="elementID">
          <template slot-scope="scope">
            {{ scope.row.elementID }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="构件id">
          <template slot-scope="scope">
            <template v-if="scope.row.info1.length == 1 || scope.row.info2.length == 1">
              {{ deffActiveTab == 'add' ? scope.row.info2[0].id : deffActiveTab == 'delete' ? scope.row.info1[0].id : `${scope.row.info1[0].id} / ${scope.row.info2[0].id}` }}
            </template>
          </template>
        </el-table-column>
        <template>
          <el-table-column align="center" label="构件名称" prop="name"></el-table-column>
          <el-table-column align="center" label="构件类型" prop="type"></el-table-column>
        </template>
        <el-table-column :label="$t('base.formLabel.operation')" width="200" align="center">
          <template slot-scope="scope" v-if="scope.row.info1.length == 1 || scope.row.info2.length == 1">
            <el-button type="text" size="small" :disabled="!onViewOpened" @click="viewElement(scope.row, 0)">定位构件</el-button>
            <el-button type="text" size="small" :disabled="!onViewOpened" @click="elementDetail(scope.row, false, 0)">查看属性</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pageTotal="currentTotal" :pageIndex="pageIndex" :pageNumber="pageNumber" @handleCurrentChange="pageChange" @handleSizeChange="pageSizeChange" />
    </el-dialog>
    <!-- 删除/ -->
    <el-dialog append-to-body title="删除" :visible.sync="deleteDialogVisible" width="30%">
      <span>确定删除么</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false" size="mini">{{ $t('base.button.cancel') }}</el-button>
        <el-button type="primary" @click="deleteNoEffectFile" size="mini">{{ $t('base.button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看属性" custom-class="deffDetail" :visible.sync="detailDialogVisible" width="1300px">
      <div class="flex" style="width: 100%;line-height: 30px;border: 1px solid #f0f0f0;border-bottom: 0;">
        <div style="flex-grow: 1;text-align: center;background: #F5F7FA;border-right: 1px solid #f0f0f0;">{{ (deffActiveTab == 'change' || deffActiveTab == 'same') ? '旧版本' : '构件属性' }}</div>
        <div v-if="deffActiveTab == 'change' || deffActiveTab == 'same'" style="flex-shrink: 0;width:50%;text-align: center;background: #F5F7FA">新版本</div>
      </div>
      <div class="flex" style="width: 100%;border: 1px solid #f0f0f0;">
        <el-tree ref="tree1" default-expand-all highlight-current @node-click="nodeClick(...arguments, 'tree2')" style="border-right: 1px solid #f0f0f0;flex-grow: 1;" :data="deffDetail.info1" node-key="id" :props="treeProps"></el-tree>
        <el-tree ref="tree2" v-if="deffActiveTab == 'change' || deffActiveTab == 'same'" default-expand-all highlight-current @node-click="nodeClick(...arguments, 'tree1')" style="width:50%;flex-shrink: 0;" :data="deffDetail.info2" node-key="id" :props="treeProps"></el-tree>
      </div>
    </el-dialog>
    <chunkUploader ref="chunkUploader" @reloadData="queryData" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import fileStatusComponends from "@/components/FileStatus";

import conversionApi from "@/api/project/file";
import chunkUploader from "@/components/ChunkUploader/trigger"; //分片上传触发器
import pagination from "@/components/pagination/index";
import postApi from "@/api/document/indexApi";
import modelComparisonDialog from "./Dialog/modelComparisonDialog.vue";

export default {
  components: {
    chunkUploader,
    pagination,
    fileStatusComponends,
    modelComparisonDialog,
  },
  props: {
    centerDialogVisible: {
      type: Boolean,
      default: false,
    },
    //版本数据
    rowData: {
      type: Array,
      default: null,
    },
    queryADDVersion: {
      type: Function
    },
    //主文件数据
    selectedData: {
      type: Array,
      default: null,
    },
    collectType: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      versionUploadVisible: false,
      uploadFile: '',
      uploadFileName: '',
      vForm: {
        versionNumber: '',
        reason: '',
        contenttext: '',
      },
      vFormRules: {
        versionNumber: [
          { required: true, message: '请输入版本号', trigger: 'blur' },
        ]
      },

      onViewOpened: false,
      showType: "模型对比",
      showComparison: false,
      isSmallSize: false,
      isClosing: false,
      tableData: [],
      init: false,
      barCharts: null,
      ringCharts: null,

      //查看属性
      detailLoading: false,
      deleteDialogVisible: false,
      deffDetail: {},
      treeProps: {
        children: 'sub',
        label: 'label'
      },

      multipleSelection: [],
      formData: {
        MainIUID: null,
        MainFileType: null,
      },
      addVersionData: {
        fileName: null,
        IUID: null,
        MainFileType: null,
        Files: null,
      },
      IUID: "",
      loadingDeff: false,
      loading: false,
      showModal: true,
      pageIndex: 1,
      pageNumber: 5,
      deffDialogVisible: false,
      effectIuid: null,
      currentIdx: '',
      deffActiveTab: "add",
      deffData: [],
      addCount: 0,
      deleteCount: 0,
      changeCount: 0,
      sameCount: 0,
      versionData: [],
      allDefCount: {},
      modelComparisonDialogVisible: false,
      detailDialogVisible: false,
      currentRow: undefined,
      currentElementIdx: 0,
      allDefModel: [],
    };
  },
  computed: {
    ...mapGetters(["signalRTableData"]),
    currentTotal() {
      let total = 0;
      total =
        this.deffActiveTab == "add"
          ? this.addCount
          : this.deffActiveTab == "delete"
            ? this.deleteCount
            : this.deffActiveTab == "change"
              ? this.changeCount
              : this.deffActiveTab == "same"
                ? this.sameCount
                : 0;
      return total;
    },
  },

  watch: {
    centerDialogVisible(n, o) {
      if (n == false) {
        this.versionUploadVisible = false;
        this.vForm.versionNumber = "";
        this.uploadFile = "";
        this.uploadFileName = "";
      }
    },
    deffDialogVisible(n, o) {
      if (n == true && this.init == false) {
        this.init = true;
        this.$nextTick(() => {
          this.initCharts();
        });
      }
    },
    selectedData: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
      },
    },

    signalRTableData(val) {
      if (this.signalRTableData.biuid) {
        if (this.rowData.filter(item => item.iuid == this.signalRTableData.biuid).length > 0) {
          this.$emit("queryADDVersion");
        }
      } else {
        if (this.rowData.filter(item => item.iuid == this.signalRTableData.iuid).length > 0) {
          this.$emit("queryADDVersion");
        }
      }
    },
  },
  methods: {
    versionInput(e) {
      this.vForm.versionNumber = e.replace(/[^\d.]/g, '');
    },
    setClassName({ row, index }) {
      return (row.info1.length == 1 || row.info2.length == 1) ? 'expand' : ''
    },
    nodeClick(e, n, t, ref) {
      if (this.deffActiveTab == 'add' || this.deffActiveTab == 'delete') {
        return
      } else {
        if (this.$refs[ref].getNode(e.id)) {
          this.$refs[ref].setCurrentKey(e.id)
          this.$refs[ref].getNode(e.id).expanded = n.expanded
        }
      }
    },
    // 1：正在排队、2：正在对比、3：对比完成、4对比失败，空：未对比
    contrastTypeName(status, type) {
      if (type == 'name') {
        return status == '1' ? '正在排队' : status == '2' ? '正在对比' : status == '3' ? '对比完成' : status == '4' ? '对比失败' : '未对比'
      }
      if (type == 'type') {
        return status == '1' ? '' : status == '2' ? 'warning' : status == '3' ? 'success' : status == '4' ? 'danger' : 'info'
      }
    },
    setData(arr, data) {
      let n = 1;
      data.forEach(item => {
        if (item.sub == null) {
          arr.push({ label: item.name + '：' + (item.value ? item.value : '-'), id: item.name + n, sub: null })
        }
        if (item.sub != null) {
          let sub = []
          this.setData(sub, item.sub)
          arr.push({ label: item.name, id: item.name + n, sub: sub })
        }
        n += 1
      })
    },
    async setIfm1Data(data) {
      let arr = []
      this.setData(arr, data.nvs[0].nvs)
      if (this.deffActiveTab == 'change' || this.deffActiveTab == 'same') {
        this.elementDetail(this.currentRow, 'sec', this.currentElementIdx)
        this.deffDetail.info2 = arr
      } else {
        this.deffDetail.info1 = arr
      }
      this.$forceUpdate()
    },
    async setIfm2Data(data) {
      let arr = []
      this.setData(arr, data.nvs[0].nvs)
      this.deffDetail.info1 = arr
      this.$forceUpdate()
    },
    elementDetail(row, sec, idx) {
      this.currentRow = row;
      this.currentElementIdx = idx
      if (sec == 'sec') {
        this.deffDetail.info2 = []
      } else {
        this.deffDetail.info2 = []
        this.deffDetail.info1 = []
      }

      this.detailDialogVisible = true;
      if (this.deffActiveTab == 'add') {
        this.$refs['compare'].getNvsById('add', [row.info2[idx].id])
      }
      if (this.deffActiveTab == 'delete') {
        this.$refs['compare'].getNvsById('delete', [row.info1[idx].id])
      }
      if (this.deffActiveTab == 'change' || this.deffActiveTab == 'same') {
        this.$refs['compare'].getNvsById(this.deffActiveTab, sec ? [row.info1[idx].id] : [row.info2[idx].id], sec)
      }
    },
    viewElement(row, idx) {
      if (this.deffActiveTab == 'add' || this.deffActiveTab == 'delete') {
        let item = this.deffActiveTab == 'add' ? row.info2[idx] : this.deffActiveTab == 'delete' ? row.info1[idx] : ''
        this.currentRow = { flag: this.deffActiveTab, ...item };
      } else {
        this.currentRow = { flag: this.deffActiveTab, id1: row.info1[idx].id, id2: row.info2[idx].id };
      }
    },

    showTypeChange(e) {
      this.showComparison = e == "模型对比" ? true : false;
      if (this.showComparison == false) {
        setTimeout(() => {
          this.barCharts.resize()
          this.ringCharts.resize()
        }, 100);
      }
    },
    getFolderFullPath() { },
    async comparison(idx) {
      this.showComparison = true;
      // await this.viewDeff(idx, true, "large");
      await this.getAllDiffData()
      this.modelComparisonDialogVisible = true;
    },

    async getAllDiffData() {
      this.allDefModel = []
      let flags = [this.$t('base.button.add'), '删除', '修改']

      let getDiffDataPromise = flags.map(flag => {
        let query = {
          AIUID: this.rowData[this.currentIdx + 1].iuid,
          BIUID: this.rowData[this.currentIdx].iuid,
          page: 1,
          rows: 99999,
          flag: flag,
        }

        return postApi.get('/api/imodel/Bimcontrast', query);
      })

      return Promise.all(getDiffDataPromise).then(res => {
        res.forEach(item => {
          this.allDefModel.push(...item.data)
        })
      })
    },
    async openContrastEvent(idx) {
      let query = {
        AIUID: this.rowData[idx + 1].iuid,
        BIUID: this.rowData[idx].iuid,
        page: this.pageIndex,
        rows: this.pageNumber,
      }
      let res = await postApi.get('/api/imodel/Bimcontrast', query);
      this.$forceUpdate()
    },
    async getDeffData() {
      this.loadingDeff = true;
      let flag = this.deffActiveTab == "add" ? this.$t('base.button.add')
        : this.deffActiveTab == "same" ? "相同"
          : this.deffActiveTab == "delete" ? "删除"
            : this.deffActiveTab == "change" ? "修改"
              : "";
      let query = {
        AIUID: this.rowData[this.currentIdx + 1].iuid,
        BIUID: this.rowData[this.currentIdx].iuid,
        page: this.pageIndex,
        rows: this.pageNumber,
        flag: flag,
      }
      let res = await postApi.get('/api/imodel/Bimcontrast', query);
      if (res.code == 1) {
        this.loadingDeff = false;
        this.deffData = res.data;
        this.allDefCount = res.twodata;
        let data2 = res.twodata
        this.addCount = data2.addcount;
        this.deleteCount = data2.deletecount;
        this.changeCount = data2.changecount;
        this.sameCount = data2.samecount;
      }
    },
    async viewDeff(idx, noShowDeff, size) {
      this.currentIdx = idx
      this.isSmallSize = size == "large" ? false : true;
      await this.getDeffData()
      this.comparison()
      if (!noShowDeff) {
        this.$nextTick(() => {
          this.deffDialogVisible = true;
          this.showComparison = true;
          this.modelComparisonDialogVisible = true;
        });
      } else {
        this.$emit("update:centerDialogVisible", false);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    pageChange(e) {
      this.pageIndex = e;
      this.getDeffData()
    },
    pageSizeChange(e) {
      this.pageNumber = e;
      this.getDeffData()
    },
    initCharts() {
      let _this = this;
      this.barCharts = this.$echarts.init(this.$refs.barCharts);
      let xdata = ["新增构件", "删除构件", "修改构件", "相同构件"];
      this.barCharts.setOption({
        title: {
          text: "数量统计",
        },
        grid: {
          bottom: 20,
          top: 45,
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          show: true,
          right: 0,
          top: 0,
          orient: "horizontal",
          data: xdata,
        },
        xAxis: {
          type: "category",
          axisTick: {
            alignWithLabel: true,
          },
          data: xdata,
        },
        yAxis: {
          type: "value",
          splitNumber: 4,
          boundaryGap: [0, "10%"],
          axisLabel: {
            //坐标轴刻度标签的相关设置
            color: "#62b2d6",
          },
          splitLine: {
            //坐标轴在 grid 区域中的分隔线。
            show: true, //是否显示分隔线。默认数值轴显示，类目轴不显示。
            lineStyle: {
              type: "dotted",
              color: ["#ddd"], //隔线会按数组中颜色的顺序依次循环设置颜色
            },
          },
        },
        series: {
          type: "bar",
          barWidth: 30,
          label: {
            //图形上的文本标签，可用于说明图形的一些数据信息
            show: true, //是否显示标签
            position: "top", //label 位置
          },
          data: [
            {
              name: "新增构件",
              value: _this.addCount,
              itemStyle: {
                color: "#81c461",
              },
            },
            {
              name: "删除构件",
              value: _this.deleteCount,
              itemStyle: {
                color: "#e74e53",
              },
            },
            {
              name: "修改构件",
              value: _this.changeCount,
              itemStyle: {
                color: "#f8be47",
              },
            },
            {
              name: "相同构件",
              value: _this.sameCount,
              itemStyle: {
                color: "#62b2d6",
              },
            },
          ],
        },
      });
      this.ringCharts = this.$echarts.init(this.$refs.ringCharts);
      this.ringCharts.setOption({
        title: {
          text: "类型统计",
        },
        grid: {
          bottom: 20,
          top: 20,
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          left: "right",
          orient: "verticalAlign",
        },
        series: [
          {
            type: "pie",
            label: {
              show: true,
              position: "center",
            },
            radius: ["40%", "70%"],
            label: {
              //图形上的文本标签，可用于说明图形的一些数据信息
              show: true, //是否显示标签
              fontSize: 14,
              color: "#444",
              formatter: "{b}:{c}个",
              position: "top", //label 位置
            },
            data: [
              {
                value: 4,
                name: "几何变更",
                itemStyle: {
                  color: "#f8be47",
                },
              },
              {
                value: 5,
                name: "属性变更",
                itemStyle: {
                  color: "#81c461",
                },
              },
            ],
          },
        ],
      });
    },
    deffTabsChange() {
      this.deffData = [];
      this.pageIndex = 1;
      this.getDeffData()
    },
    closeDialog() {
      this.$emit("update:centerDialogVisible", false);
    },
    closeDeffDialog() {
      this.loading = true;
      this.$refs["compare"] && this.$refs["compare"].closeModel();
      setTimeout(() => {
        this.deffDialogVisible = false;
        this.modelComparisonDialogVisible = false;
        this.loading = false
      }, 2000);
    },
    getFolderFullPath() {
      return this.$folderFullPath("新版本", []);
    },
    //上传新版本
    async uploadNewVersion(file) {
      this.uploadFile = file.target.files;
      this.uploadFileName = this.uploadFile[0].name;
      setTimeout(() => {
        this.versionUploadVisible = true
      }, 400);
    },
    async handleValidate() {
      this.$refs.vForm.validate(async validate => {
        if (validate) {
          let formdata = new FormData();
          formdata.append("VersionNumber", this.vForm.versionNumber);
          formdata.append("MainIUID", this.selectedData[0].iuid);
          formdata.append("MainFileType", '1');
          let res = await postApi.post('/api/ProjectFile/FileVersionValidateByNumber', formdata)
          if (res.code == 1) {
            this.versionUploadVisible = false;
            this.fileListChange()
          }
        }
      })
    },
    async fileListChange() {
      var files = this.uploadFile;
      var _self = this;
      this.$refs.chunkUploader.fileData = [];
      for (var i = 0; i < files.length; i++) {
        this.$refs.chunkUploader.fileData.push({
          folderIuid: this.IUID,
          isVersion: true,
          fileIuid:
            this.collectType == "collect"
              ? this.selectedData[0].mainIUID
              : this.selectedData[0].iuid,
          fileType: this.selectedData[0].fileType,
          fileName: files[i].name,
          relativePath: files[i].name,
          fullPath: _self.getFolderFullPath(),
          file: files[i],
          fileSize: _self.$getFileSize(files[i].size),
          lastModifiedData: _self.$dayjs(
            files[i].lastModifiedDate,
            "YYYY-MM-DD HH:mm:ss"
          ),
          uploadTime: _self.$dayjs(new Date(), "YYYY-MM-DD HH:mm:ss"),
          versionNumber: this.vForm.versionNumber,
          reason: this.vForm.reason,
          contenttext: this.vForm.contenttext,
        });
      }
      this.$refs.chunkUploader.uploadDragFile();
      this.vForm.versionNumber = '';
      this.$refs.vForm.resetFields();
      this.$refs.file.value = ''
    },
    //设为生效
    async setEffect(row) {
      var formData = new FormData();
      formData.append("IUID", row.iuid);
      formData.append(
        "MainIUID",
        this.collectType == "collect"
          ? this.selectedData[0].mainIUID
          : this.selectedData[0].iuid
      );
      var res = await conversionApi.setEffect(formData);
      if (res.code == 1) {
        this.$emit("queryADDVersion");
        this.$message({
          message: res.msg,
          type: "success",
        });
      }
    },
    //刪除版本文件
    deleteFile(row) {
      this.effectIuid = row.iuid;
      this.deleteDialogVisible = true;
    },
    async deleteNoEffectFile() {
      var formData = new FormData();
      formData.append("IUID", this.effectIuid);
      var res = await conversionApi.deleteEffectFile(formData);
      if (res.code == 1) {
        this.$message({
          message: res.msg,
          type: "success",
        });
        this.deleteDialogVisible = false;
        this.$emit("queryADDVersion");
      }
    },
    //版本确认
    async effectSure() {
      var formData = new FormData();
      formData.append(
        "MainIUID",
        this.collectType == "collect"
          ? this.selectedData[0].mainIUID
          : this.selectedData[0].iuid
      );
      formData.append("MainFileType", this.selectedData[0].fileType);
      var res = await conversionApi.effectOK(formData);
      if (res.code == 1) {
        this.$emit("update:centerDialogVisible", false);
        this.$emit("sureVersion");
      }
    },
    queryData() {
      this.$emit("queryADDVersion");
    },
  },
};
</script>
<style>
.deffDialog {
  margin-top: 5vh !important;
  width: 90vw;
  height: 90vh;
}

.deffDialog .el-dialog__body {
  max-height: 100%;
}

.expand .el-table__expand-column .cell {
  display: none;
}
</style>
<style scoped lang="scss">
::v-deep .el-table {
  td {
    &.cellStyle {
      padding: 0;
      height: 38px;
      line-height: 1.5;
    }
  }
}

.chartsBox {
  width: calc(90vw - 48px);
  height: calc(90vh - 510px);
}

.loadingclass {
  z-index: 2223;
}

.el-divider--vertical {
  height: 12em;
}

.chartsView {
  width: 35%;
  height: calc(90vh - 520px);
  margin-bottom: 15px;
  // background-color: #F56C6C;
}

.effectTit {
  line-height: 32px;
  padding-right: 10px;
  color: #33CC99;
  cursor: pointer;

  &.deff {
    color: #409eff;
  }

  &.delete {
    color: #f56c6c;
  }
}

.deffDetail {
  z-index: 2400;
}

.d-table {
  width: 500px;

  .d-head {
    width: 33.3%;
  }
}

.version-opericon {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin-right: 8px;
}
</style>
