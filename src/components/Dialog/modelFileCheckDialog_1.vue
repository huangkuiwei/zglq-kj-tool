<template>
  <div>
    <el-dialog
      v-loading="loading"
      :destroy-on-close="true"
      element-loading-text="正在关闭模型"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      custom-class="check-model-dialog"
      title="质量检查"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      :before-close="beforeCloseDialog"
    >
      <div class="file-check-content">
        <div class="info-show-content">
          <el-form
            :inline="true"
            size="small"
            :model="formModelCheck"
          >
            <!-- <el-form-item label="模型分类">
                            <el-select v-model="formModelCheck.checkModelType" @change="getLastCheckData" :placeholder="$t('base.button.pleaseSelect')">
                                <el-option v-for="item in modelTypes" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </el-form-item> -->
            <!-- <el-form-item label="模型精度等级">
                            <el-select v-model="formModelCheck.checkModelLevel" @change="getLastCheckData" :placeholder="$t('base.button.pleaseSelect')">
                                <el-option v-for="item in [2, 3]" :key="item" :label="`L${item}.0`" :value="`lv`+item" />
                            </el-select>
                        </el-form-item> -->
            <el-form-item label="检查标准">
              <el-select
                v-model="formModelCheck.checkStandard"
                :placeholder="$t('base.button.pleaseSelect')"
                @change="setCheckStandard"
              >
                <!-- <el-option :label="$t('base.button.pleaseSelect')" value="" /> -->
                <el-option
                  v-for="item in checkStandards"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit"
              >
                检查
              </el-button>
            </el-form-item>
          </el-form>
          <el-tabs
            v-model="activeTab"
            @tab-click="tabsChange"
          >
            <!-- <el-tab-pane :label="$t('base.button.fileName')" name="fileCheck"></el-tab-pane>
                        <el-tab-pane label="构件分类及编码" name="codeCheck"></el-tab-pane> -->
            <el-tab-pane
              label="构件信息深度"
              name="attrCheck"
            />
            <el-tab-pane
              label="冗余信息"
              name="redundancyCheck"
            />
          </el-tabs>
          <el-table
            v-loading="tableLoading"
            :data="showTableData"
            :header-cell-style="$thStyle"
            cell-class-name="cellStyle"
            max-height="485"
          >
            <el-table-column
              type="index"
              :label="$t('base.button.index')"
              width="60"
              align="center"
            />
            <el-table-column
              v-if="activeTab !== 'fileCheck'"
              key="11"
              align="center"
              label="构件ID"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.errorContent.id || '' }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="errorLabel" align="center" label="问题描述"></el-table-column> -->
            <el-table-column
              v-if="activeTab === 'fileCheck'"
              key="1"
              prop="errorContent"
              align="center"
              label="问题展示"
            />
            <el-table-column
              v-if="activeTab === 'fileCheck'"
              key="2"
              align="center"
              label="示例"
            >
              <template slot-scope="scope">
                <div> {{ 'XXX项目_XX标段_XX桥_桥梁上部结构_V1.0' }}</div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="activeTab === 'codeCheck'"
              key="3"
              align="center"
              label="分类编码"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.errorContent.value || '' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="activeTab === 'codeCheck'"
              key="4"
              align="center"
              label="分类名称"
            >
              <template slot-scope="scope">
                <div v-html="codeCheckFormater(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column
              v-if="activeTab === 'codeCheck'"
              key="5"
              align="center"
              label="正确值"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.errorContent.basicValue || '' }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column v-if="activeTab === 'attrCheck'" key="6" align="center" label="分类编码">
                            <template slot-scope="scope">
                                <span>{{ scope.row.errorContent.value || '' }}</span>
                            </template>
                        </el-table-column> -->
            <el-table-column
              v-if="activeTab === 'attrCheck'"
              key="7"
              align="center"
              label="已有属性"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.errorContent.hasCorrectAttrs && scope.row.errorContent.hasCorrectAttrs.join(' ') || '' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="activeTab === 'attrCheck'"
              key="8"
              align="center"
              label="缺少属性"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.errorContent.missAttrs && scope.row.errorContent.missAttrs.join(' ') || '' }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column v-if="activeTab === 'redundancyCheck'" key="9" align="center" label="冗余构件类型">
                            <template slot-scope="scope">
                                <span>{{ scope.row.errorContent.redundancyType || '' }}</span>
                            </template>
                        </el-table-column> -->
            <!-- <el-table-column v-if="activeTab === 'redundancyCheck'" key="10" align="center" label="示例">
                            <template slot-scope="scope">
                                <div>
                                    {{
                                        scope.row.errorContent.errorType === 1? '标识信息/尺寸信息/设计信息':
                                        scope.row.errorContent.errorType === 2? '18-01.00.00.00':
                                        scope.row.errorContent.errorType === 3? '混凝土': ''
                                    }}
                                </div>
                            </template>
                        </el-table-column> -->
            <el-table-column
              v-if="activeTab !== 'fileCheck'"
              key="12"
              :label="$t('base.formLabel.operation')"
              align="center"
              width="180"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.errorContent.isGeometry">
                  <el-button
                    type="text"
                    size="small"
                    @click="viewElement(scope.row)"
                  >定位</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="isolateSelected(scope.row)"
                  >突显</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div class="imodel-check-page-content">
            <el-pagination
              hide-on-single-page
              :page-size="pageSize"
              :current-page.sync="currentPage"
              layout="prev, pager, next, total"
              :total="total"
              @current-change="currentPageChange"
            />
          </div>
        </div>
        <div class="model-show-content">
          <modelFileCheckIframe
            v-if="modelFileCheckIframeCanLoad"
            ref="modelFileCheckIframeRef"
            :row-data="currentFileData"
            @modelLoaded="getLastCheckData"
          />
          <div
            ref="chartImodelContentRef"
            class="result-chat-content"
            :class="{'result-chat-content-hide': hideChartData}"
          >
            <chartImodelCheck ref="chartImodelCheckRef" />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import modelFileCheckIframe from './modelFileCheckIframe.vue';
import chartImodelCheck from './showDataCharts.vue';

const LOCALFORMKEY = 'LastFormModelCheckKey';

export default {
    name: "ModelFileCheckDialog",
    components: {
        modelFileCheckIframe,
        chartImodelCheck,
    },
    props: {},
    data() {
        return {
            // 路线 路基 路面 桥梁 涵洞 隧道 交通工程及沿线设施 地形地质模型
            modelTypes: [
                {label: '路线', value: 1},
                {label: '路基', value: 2},
                {label: '路面', value: 3},
                {label: '桥梁', value: 4},
                {label: '涵洞', value: 5},
                {label: '隧道', value: 6},
                {label: '交通工程及沿线设施', value: 7},
                // {label: '地形地质模型', value: 8},
            ],
            checkStandards: [],
            currentFileData: {
                fileName: '',
                turnPath: '',
            },
            modelFileCheckIframeCanLoad: false,
            loading: false,
            tableLoading: false,
            dialogVisible: false,
            activeTab: "attrCheck",

            formModelCheck: {
                // 模型分类
                checkModelType: Number(this.getLocalFormModelCheck('checkModelType')) || 1,
                checkModelLevel: this.getLocalFormModelCheck('checkModelLevel') || 'lv2',
                checkStandard: this.getLocalFormModelCheck('checkStandard') || '',
            },
            baseUrl: process.env.VUE_APP_ViewOrigin,
            checkResultData: [],
            currentTableData: [],
            showTableData: [],
            hideChartData: true,
            // 分页
            currentPage: 1,
            pageSize: 10,
            total: 0,
        };
    },
    created() {
        this.$iframeListener((res) => {
            if (res.data.command === "fileCheckSuccess") {
                this.tableLoading = false;
                let data = res.data.data;
                console.log('外壳收到数据1：', data);
                if (data.error_code === 0) {
                    this.localSaveFormModelCheck();
                    this.checkResultData = data.data;
                    this.$nextTick(() => {
                        this.filterTableData();
                        this.checkErrorNum();
                    });
                } else {
                    this.checkResultData = null;
                    this.$message.error(data.msg);
                }
            }
            if (res.data.command === "getCheckFileHistoryDataSuccess") {
                this.tableLoading = false;
                let data = res.data.data;
                console.log('外壳收到数据2：', data);
                if (data.error_code === 0) {
                    this.checkResultData = data.data;
                    this.$nextTick(() => {
                        this.filterTableData();
                        this.checkErrorNum();
                    });
                }
                else {
                    this.checkResultData = null;
                    this.$nextTick(() => {
                        this.filterTableData();
                    });
                }
            }

            if (res.data.command === 'getAllStandardSuccess') {
                console.log('外壳收到数据3：', res.data.data);
                this.checkStandards = res.data.data && res.data.data.options || [];
            }
        });
    },
    mounted() {

    },
    methods: {
        initData(fileData) {
            this.currentFileData = fileData;
            this.formModelCheck.checkModelType = Number(this.getLocalFormModelCheck('checkModelType', fileData.fileName)) || 1,
            this.formModelCheck.checkModelLevel = this.getLocalFormModelCheck('checkModelLevel', fileData.fileName) || 'lv2',
            this.formModelCheck.checkStandard = this.getLocalFormModelCheck('checkStandard', fileData.fileName) || '',
            this.activeTab = "attrCheck";
            this.checkResultData = null;
            this.currentTableData = [];
            this.showTableData = [];
            this.total = 0;
            this.currentPage = 1;
            this.$nextTick(() => {
                this.modelFileCheckIframeCanLoad = true;
            });

        },
        showDialog(fileData) {
            this.dialogVisible = true;
            this.initData(fileData);
        },
        currentPageChange(curPageNum) {
            this.currentPage = curPageNum;
            let showTableData = this.currentTableData.slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
            );
            this.showTableData = showTableData;
        },
        tabsChange(tab) {
            this.activeTab = tab.name;
            this.currentTableData = [];
            this.$nextTick(() => {
                this.filterTableData();
            });
        },
        localSaveFormModelCheck() {
            let result = {};
            let localStr = localStorage.getItem(LOCALFORMKEY);
            if (localStr) {
                result = JSON.parse(localStorage.getItem(LOCALFORMKEY));
            }
            console.log('localSaveFormModelCheck', JSON.stringify({
                ...result,
                [encodeURIComponent(this.currentFileData.fileName)]: this.formModelCheck
            }));
            localStorage.setItem(LOCALFORMKEY, JSON.stringify({
                ...result,
                [encodeURIComponent(this.currentFileData.fileName)]: this.formModelCheck
            }));
        },
        getLocalFormModelCheck(key, fileName) {
            if (!fileName && !this.currentFileData) {
                return '';
            }
            if (!fileName) {
                fileName = this.currentFileData.fileName;
            }
            if (!fileName) {
                return '';
            }
            let localStr = localStorage.getItem(LOCALFORMKEY);
            if (!localStr) {
                return '';
            }
            let data = JSON.parse(localStorage.getItem(LOCALFORMKEY));
            return data[encodeURIComponent(fileName)]? data[encodeURIComponent(fileName)][key] : '';
        },
        // 根据当前tab激活项，过滤checkResultData数据 到 currentTableData
        filterTableData() {
            let activeTab = this.activeTab;
            let currentTableData = [];
            // 隐藏图表
            this.hideChartData = true;

            if (this.checkResultData) {
                if (activeTab === "fileCheck") {
                    // 显示图表
                    this.checkResultData && (this.hideChartData = false);
                    currentTableData = this.checkResultData.file || [];
                } else if (activeTab === "codeCheck") {
                    currentTableData = this.checkResultData.code || [];
                } else if (activeTab === "attrCheck") {
                    currentTableData = this.checkResultData.attr || [];
                } else if (activeTab === "redundancyCheck") {
                    currentTableData = this.checkResultData.redundancy || [];
                }
            }

            this.currentTableData = currentTableData;

            this.total = currentTableData.length;
            this.currentPage = 1;

            this.$nextTick(() => {
                this.currentPageChange(1);
            });
        },
        // 总结错误数据
        checkErrorNum() {
            let idsNum = this.checkResultData.totalIdsNum;
            let fileErrors = this.checkResultData.file.length;
            let codeErrors = this.checkResultData.code.length;
            let attrErrors = this.checkResultData.attr.length;
            let reduErrors = this.checkResultData.redundancy.length;
            let totalErrors = fileErrors + codeErrors + attrErrors + reduErrors;

            this.$refs.chartImodelCheckRef.initEcharts({
                chartsData: [
                    {name: '文件名称', value: fileErrors, itemStyle: { color: "#17AEE2" }},
                    {name: '构件分类及编码', value: codeErrors, itemStyle: { color: "#D84431" }},
                    {name: '构件信息深度', value: attrErrors, itemStyle: { color: "#E3AB21" }},
                    {name: '冗余信息', value: reduErrors, itemStyle: { color: "#1FDC5E" }},
                ],
                errorData: {
                    componentNum: idsNum,
                    problemNum: totalErrors,
                    fileProblemNum: fileErrors,
                    componentProblemNum: totalErrors - fileErrors,
                }
            });
        },
        viewElement(row) {
            console.log(row);
            this.$refs["modelFileCheckIframeRef"].locateModelByIds(row.errorContent.id);
        },
        isolateSelected(row) {
            this.$refs["modelFileCheckIframeRef"].isolateSelectedElement(row.errorContent.id);
        },
        beforeCloseDialog(done) {
            this.loading = true;
            this.$refs["modelFileCheckIframeRef"].closeModel();
            setTimeout(() => {
                this.modelFileCheckIframeCanLoad = false;
                this.loading = false;
                this.dialogVisible = false;
                done();
            }, 2000);
        },
        onSubmit() {
            this.tableLoading = true;
            this.$refs["modelFileCheckIframeRef"].checkModelFile(this.formModelCheck);
        },
        getLastCheckData() {
            this.tableLoading = true;
            this.$refs["modelFileCheckIframeRef"].getAllStandard();
            this.$refs["modelFileCheckIframeRef"].getLastCheckData(this.formModelCheck);
        },
        setCheckStandard() {
            this.$refs["modelFileCheckIframeRef"].setCheckStandard(this.formModelCheck.checkStandard);
        },
        codeCheckFormater(row) {
            let {id, name, value, basicValue} = row.errorContent;
            // if (name && value && basicValue) {
            //     let result = '';
            //     for (let i = 0; i < name.length; i++) {
            //         if (name[i] !== basicValue[i]){
            //             result += "<span style='color:red'>" + name[i] + "</span>";
            //         } else {
            //             result += name[i];
            //         }
            //     }
            //     return result;
            // }
            // return '';

            return "<span style='color:red'>" + name + "</span>"
        },
    },
};
</script>

<style>
.check-model-dialog {
    margin-top: 5vh !important;
    width: 90vw;
    height: 90vh;
    box-sizing: border-box;
}
.check-model-dialog .el-dialog__body {
    height: calc(100% - 52px);
    max-height: 100%;
}
</style>

<style lang="scss" scoped>
.check-model-dialog {
    .file-check-content {
        display: flex;
        width: 100%;
        height: 100%;
        .info-show-content {
            flex: 1;
            height: 100%;
            padding-right: 20px;

            .imodel-check-page-content {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }
        }
        .model-show-content {
            width: 500px;
            height: 100%;
            position: relative;
            overflow: hidden;

            .result-chat-content {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                background-color: #fff;
            }

            .result-chat-content-hide {
                position: absolute;
                left: 100%;
            }

        }
    }
}

</style>

