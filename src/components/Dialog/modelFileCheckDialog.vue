<template>
    <div>
        <el-dialog :destroy-on-close="true" v-loading="loading" element-loading-text="正在关闭模型"
            element-loading-background="rgba(0, 0, 0, 0.8)" custom-class="check-model-dialog" title="质量检查"
            :visible.sync="dialogVisible" :modal-append-to-body="false" :before-close="beforeCloseDialog"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="file-check-content">
                <resizeZone initLeftWidth="65%">
                    <template slot="left">
                        <div class="info-show-content">
                            <el-form :inline="true" size="small" :model="formModelCheck">
                                <el-form-item label="检查标准">
                                    <el-select v-model="formModelCheck.checkStandard"
                                        :placeholder="$t('base.button.pleaseSelect')">
                                        <!-- <el-option label="公路工程设计建模标准" :value="1" /> -->
                                        <el-option label="中国路桥设计标准" :value="2" />
                                        <el-option label="中国路桥施工标准" :value="3" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="模型分类">
                                    <el-select v-model="formModelCheck.checkModelType" @change="getLastCheckData"
                                        :placeholder="$t('base.button.pleaseSelect')">
                                        <template v-if="formModelCheck.checkStandard === 1">
                                            <el-option v-for="item in modelTypes" :key="item.value" :label="item.label"
                                                :value="item.value" />
                                        </template>
                                        <template v-else>
                                            <el-option v-for="item in modelTypesMore" :key="item.value"
                                                :label="item.label" :value="item.value" />
                                        </template>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="模型精度等级">
                                    <el-select v-model="formModelCheck.checkModelLevel" @change="getLastCheckData"
                                        :placeholder="$t('base.button.pleaseSelect')">
                                        <el-option v-if="formModelCheck.checkStandard !== 3" label="L2.0"
                                            value="lv2"></el-option>
                                        <el-option v-if="formModelCheck.checkStandard !== 3" label="L3.0"
                                            value="lv3"></el-option>
                                        <el-option v-if="formModelCheck.checkStandard === 3" label="L3.5"
                                            value="lv35"></el-option>
                                        <el-option v-if="formModelCheck.checkStandard === 3" label="L4.0"
                                            value="lv4"></el-option>
                                        <el-option v-if="formModelCheck.checkStandard === 3" label="L5.0"
                                            value="lv5"></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item>
                                    <el-button type="primary" @click="onSubmit(1)">信息深度检查</el-button>

                                    <el-button type="primary" @click="onSubmit(2)" v-if="formModelCheck.checkStandard !== 1">
                                        标识码检查
                                        <el-tooltip effect="dark"
                                            content="选择L2.0-L3.0,标识码检查“标识代码”;L3.5-L5.0,标识码检查“施工标识码”" placement="top">
                                            <i class="el-icon-warning-outline el-icon--right"></i>
                                        </el-tooltip>
                                    </el-button>

                                    <el-button v-if="showExportBtn" type="success" @click="onExport">导出<i
                                            class="el-icon-download el-icon--right"></i></el-button>
                                    <!-- 清空数据 -->
                                    <el-button @click="clearTabeleData">清空数据</el-button>
                                </el-form-item>
                            </el-form>
                            <el-tabs v-model="activeTab" @tab-click="tabsChange">
                                <!-- <el-tab-pane :label="$t('base.button.fileName')" name="fileCheck"></el-tab-pane>
                        <el-tab-pane label="构件分类及编码" name="codeCheck"></el-tab-pane> -->
                                <el-tab-pane 
                                    v-if="checkType === 1"
                                    label="构件信息深度" 
                                    name="attrCheck"
                                ></el-tab-pane>
                                <el-tab-pane
                                    v-if="checkType === 1"
                                    label="信息深度冗余"
                                    name="redundancyCheck"
                                ></el-tab-pane>
                                <el-tab-pane 
                                    v-if="formModelCheck.checkStandard !== 1 && checkType === 2"
                                    label="标识码" 
                                    name="signCodeCheck"
                                ></el-tab-pane>
                                <el-tab-pane
                                    v-if="formModelCheck.checkStandard !== 1 && checkType === 2"
                                    label="标识码冗余"
                                    name="signCodeRedundancy"
                                ></el-tab-pane>
                            </el-tabs>
                            <el-table :data="showTableData" :header-cell-style="$thStyle" cell-class-name="cellStyle"
                                v-loading="tableLoading" element-loading-text="正在检查中，请耐心等候...">
                                <el-table-column type="index" :label="$t('base.button.index')" width="60"
                                    align="center"></el-table-column>
                                <el-table-column key="1" align="center" label="构件ID">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.errorContent.id || '' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="formModelCheck.checkStandard !== 1 && activeTab === 'attrCheck'" key="2" align="center"
                                    label="分类名称">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.errorContent.name || '' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="activeTab === 'attrCheck'" key="6" align="center" label="分类编码">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.errorContent.value || '' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="activeTab === 'attrCheck'" key="7" align="center" label="已有属性">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.errorContent.hasCorrectAttrs &&
                                            scope.row.errorContent.hasCorrectAttrs.join(' ') || '' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="activeTab === 'attrCheck'" key="8" align="center" label="缺少属性">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.errorContent.missAttrs &&
                                            scope.row.errorContent.missAttrs.join(' ')
                                            || '' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="activeTab === 'redundancyCheck'" key="9" align="center"
                                    label="冗余构件类型">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.errorContent.redundancyType || '' }}</span>
                                    </template>
                                </el-table-column>

                                <!-- 标识码 -->
                                <el-table-column v-if="activeTab === 'signCodeCheck'" key="10" align="center"
                                    label="国家码">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.errorContent.countryCode || '' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="activeTab === 'signCodeCheck'" key="11" align="center"
                                    label="单位工程码">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.errorContent.unitCode || '' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="activeTab === 'signCodeCheck'" key="12" align="center"
                                    label="分幅码">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.errorContent.panelCode || '' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="activeTab === 'signCodeCheck'" key="13" align="center"
                                    label="分部工程码">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.errorContent.sideCode || '' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="activeTab === 'signCodeCheck'" key="14" align="center"
                                    label="错误信息">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.errorContent.signErrors || '' }}</span>
                                    </template>
                                </el-table-column>

                                <!-- <el-table-column v-if="activeTab === 'signCodeRedundancy'" key="15" align="center"
                                    label="标识码">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.errorContent.signCode || '' }}</span>
                                    </template>
                                </el-table-column> -->

                                <el-table-column v-if="activeTab !== 'fileCheck'" key="18"
                                    :label="$t('base.formLabel.operation')" align="center" width="180">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.errorContent.isGeometry">
                                            <el-button type="text" size="small"
                                                @click="viewElement(scope.row)">定位</el-button>
                                            <el-button type="text" size="small"
                                                @click="isolateSelected(scope.row)">突显</el-button>
                                        </span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="imodel-check-page-content">
                                <el-pagination hide-on-single-page :page-size="pageSize"
                                    :current-page.sync="currentPage" layout="prev, pager, next, total" :total="total"
                                    @current-change="currentPageChange">
                                </el-pagination>
                            </div>

                        </div>
                    </template>
                    <template slot="right">
                        <div class="model-show-content">
                            <modelFileCheckIframe v-if="modelFileCheckIframeCanLoad" ref="modelFileCheckIframeRef"
                                :row-data="currentFileData" @modelLoaded="getLastCheckData" />
                            <div class="result-chat-content" :class="{ 'result-chat-content-hide': hideChartData }"
                                ref="chartImodelContentRef">
                                <chartImodelCheck ref="chartImodelCheckRef" />
                            </div>
                        </div>
                    </template>
                </resizeZone>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import modelFileCheckIframe from './modelFileCheckIframe.vue';
import chartImodelCheck from './showDataCharts.vue';
import resizeZone from './resizeZone.vue';

import exportExcel from '@/utils/exportExcel';

export default {
    name: "modelFileCheckDialog",
    components: {
        modelFileCheckIframe,
        chartImodelCheck,
        resizeZone,
    },
    props: {},
    data() {
        return {
            // 路线 路基 路面 桥梁 涵洞 隧道 交通工程及沿线设施 地形地质模型
            modelTypes: [
                { label: '路线', value: 1 },
                { label: '路基', value: 2 },
                { label: '路面', value: 3 },
                { label: '桥梁', value: 4 },
                { label: '涵洞', value: 5 },
                { label: '隧道', value: 6 },
                { label: '交通工程', value: 7 },
                { label: '地形地质', value: 8 },
                { label: '项目', value: 9 },
                { label: '标段', value: 10 },
                { label: '路线交叉', value: 11 }
            ],
            modelTypesMore: [
                { label: '路线', value: 1 },
                { label: '路基', value: 2 },
                { label: '路面', value: 3 },
                { label: '桥梁', value: 4 },
                { label: '涵洞', value: 5 },
                { label: '隧道', value: 6 },
                { label: '交通工程', value: 7 },
                { label: '地形地质', value: 8 },
                { label: '项目', value: 9 },
                { label: '标段', value: 10 },
                { label: '路线交叉', value: 11 },
                { label: '景观绿化', value: 12 },
                { label: '市政管线', value: 13 },
            ],
            currentFileData: {
                fileName: '',
                turnPath: '',
            },
            modelFileCheckIframeCanLoad: false,
            loading: false,
            showExportBtn: true,
            tableLoading: false,
            dialogVisible: false,
            activeTab: "attrCheck",
            formModelCheck: {
                // 模型分类
                checkModelType: Number(this.getLocalFormModelCheck('checkModelType')) || 1,
                checkModelLevel: this.getLocalFormModelCheck('checkModelLevel') || 'lv2',
                checkStandard: Number(this.getLocalFormModelCheck('checkStandard')) || 2,
            },
            checkType: 1,
            hasChecked: false,
            checkResultData: null,
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
                        // this.checkErrorNum();
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
                    this.hasChecked = true;
                    this.checkResultData = data.data;
                    this.$nextTick(() => {
                        this.filterTableData();
                        // this.checkErrorNum();
                    });
                }
                else {
                    this.checkResultData = null;
                    this.$nextTick(() => {
                        this.filterTableData();
                    });
                }
            }
            if (res.data.command === "deleteCheckFileHistoryDataSuccess") {
                this.clearTabeleData();
            }
        });
    },
    mounted() {

    },
    computed: {
        // showExportBtn() {
        //     return this.checkResultData && (
        //         this.checkResultData.attr.length > 0 ||
        //         this.checkResultData.redundancy.length > 0 ||
        //         this.checkResultData.signCode.length > 0 ||
        //         this.checkResultData.signCodeRedundancyResult.length > 0
        //     );
        // }
    },
    methods: {
        initData(fileData) {
            this.currentFileData = fileData;
            this.formModelCheck.checkModelType = Number(this.getLocalFormModelCheck('checkModelType', fileData.fileName)) || 1,
                this.formModelCheck.checkModelLevel = this.getLocalFormModelCheck('checkModelLevel', fileData.fileName) || 'lv2',
                this.formModelCheck.checkStandard = this.getLocalFormModelCheck('checkStandard', fileData.fileName) || 2,
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
        clearTabeleData() { 
            this.checkResultData = null;
            this.currentTableData = [];
            this.showTableData = [];
            this.total = 0;
            this.currentPage = 1;
            this.checkType = 1;
            this.tableLoading = false;
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
            let localStr = localStorage.getItem('LastFormModelCheck');
            if (localStr) {
                result = JSON.parse(window.atob(localStorage.getItem('LastFormModelCheck')));
            }
            localStorage.setItem('LastFormModelCheck', window.btoa(JSON.stringify({
                ...result,
                [encodeURIComponent(this.currentFileData.fileName)]: this.formModelCheck
            })));
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
            let localStr = localStorage.getItem('LastFormModelCheck');
            if (!localStr) {
                return '';
            }
            let data = JSON.parse(window.atob(localStorage.getItem('LastFormModelCheck')));
            return data[encodeURIComponent(fileName)] ? data[encodeURIComponent(fileName)][key] : '';
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
                else if (activeTab === "signCodeCheck") {
                    currentTableData = this.checkResultData.signCodeResult || [];
                }
                else if (activeTab === "signCodeRedundancy") {
                    currentTableData = this.checkResultData.signCodeRedundancyResult || [];
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
                    { name: '文件名称', value: fileErrors, itemStyle: { color: "#17AEE2" } },
                    { name: '构件分类及编码', value: codeErrors, itemStyle: { color: "#D84431" } },
                    { name: '构件信息深度', value: attrErrors, itemStyle: { color: "#E3AB21" } },
                    { name: '冗余信息', value: reduErrors, itemStyle: { color: "#1FDC5E" } },
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
        onSubmit(type) {
            this.checkType = type;
            if (type === 1) {
                this.activeTab = 'attrCheck';
            }
            else if (type === 2) {
                this.activeTab = 'signCodeCheck';
            }
            this.tableLoading = true;
            this.$refs["modelFileCheckIframeRef"].checkModelFile(this.formModelCheck);
        },
        onCodeCheck() {
            this.tableLoading = true;
            this.$refs["modelFileCheckIframeRef"].checkModelFile(this.formModelCheck);
        },
        onExport() {
            let activeTabName = this.activeTab === 'attrCheck' ? '构件信息深度' : 
                                this.activeTab === 'redundancyCheck' ? '信息深度冗余' : 
                                this.activeTab === 'signCodeCheck' ? '标识码' :
                                this.activeTab === 'signCodeRedundancy' ? '标识码冗余' : '';            
            if (this.currentTableData && this.currentTableData.length > 0) {
                let data = {};
                if (this.activeTab === 'attrCheck') {
                    data = {
                        attr: this.currentTableData
                    }
                }
                else if (this.activeTab === 'redundancyCheck') {
                    data = {
                        redundancy: this.currentTableData
                    }
                }
                else if (this.activeTab === 'signCodeCheck') {
                    data = {
                        signCodeResult: this.currentTableData
                    }
                }
                else if (this.activeTab === 'signCodeRedundancy') {
                    data = {
                        signCodeRedundancyResult: this.currentTableData
                    }
                }
                exportExcel(data, this.currentFileData.fileName + `_${activeTabName}.xlsx`);
            }
            else {
                this.$message.error(`${activeTabName}数据为空无法导出`);
            }
        },
        getLastCheckData() {
            this.tableLoading = true;
            this.$refs["modelFileCheckIframeRef"].getLastCheckData(this.formModelCheck);
        },
        deleteLastCheckData() {
            this.tableLoading = true;
            this.$refs["modelFileCheckIframeRef"].deleteLastCheckData(this.formModelCheck);
        },
        codeCheckFormater(row) {
            let { id, name, value, basicValue } = row.errorContent;
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
            padding-right: 10px;

            .imodel-check-page-content {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }
        }

        .model-show-content {
            width: 100%;
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
