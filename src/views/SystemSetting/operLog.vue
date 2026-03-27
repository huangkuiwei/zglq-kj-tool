<template>
  <div class="background table-box">
    <el-row style="display: flex">
      <el-form :model="searchForm" ref="form" label-suffix="：" :inline="true" size="mini">
        <el-form-item :label="$t('base.button.module')">
          <el-select v-model="searchForm.module" style="width: 180px;" @change="queryTypeList" :placeholder="$t('base.button.selectModule')" clearable>
            <el-option v-for="item in moduleList" :key="item.iuid" :label="item.itemText" :value="item.iuid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('base.button.type')">
          <el-select v-model="searchForm.moduleType" :disabled="searchForm.module == ''" style="width: 218px;" @change="(event) => {handleSearch(); queryModulefunList(event)}" :placeholder="searchForm.module == '' ? $t('base.button.selectModule') : $t('base.button.selectOperationType')" clearable>
            <el-option v-for="item in typeList" :key="item.iuid" :label="item.itemText" :value="item.itemText"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('base.button.function')">
          <el-select v-model="searchForm.modulefun" :disabled="searchForm.moduleType == ''" style="width: 218px;" @change="handleSearch" clearable>
            <el-option v-for="item in modulefunList" :key="item.iuid" :label="item.itemText" :value="item.itemText"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('base.button.project')">
          <el-input :placeholder="$t('base.button.inputProjectName')" @change="handleSearch" style="width: 180px;" clearable v-model="searchForm.projectname"></el-input>
        </el-form-item>

        <el-form-item :label="$t('base.button.people')">
          <el-input :placeholder="$t('base.button.inputOperatorName')" @change="handleSearch" style="width: 180px;" clearable v-model="searchForm.userName"></el-input>
        </el-form-item>

        <el-form-item :label="$t('base.button.operate')">
          <el-input :placeholder="$t('base.button.selectOperationKey')" style="width: 180px;" @change="handleSearch" clearable v-model="searchForm.contenttext"></el-input>
        </el-form-item>
        <el-form-item :label="$t('base.button.dateRange')">
          <el-date-picker style="width:250px" v-model="searchForm.createTime" @change="handleSearch" value-format="yyyy-MM-dd" type="daterange" range-separator="-" :start-placeholder="$t('base.button.startTime')" :end-placeholder="$t('base.button.endTime')"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain style="height: 28px;margin-left: 10px;" @click="resetQuery">{{ $t('base.button.reset') }}</el-button>
          <el-button type="primary" style="height: 28px;margin-left: 10px;" @click="queryData">{{ $t('base.button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="table">
      <el-table :data="tableData" class="t-table" :header-cell-style="$thStyle" style="width: 100%; margin-top: 20px; font-size: 13px" :height="'calc(100vh - 180px)'" stripe>
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column prop="userName" align="center" width="150" :label="$t('base.button.people')"></el-table-column>
        <el-table-column prop="module" align="center" width="150" :label="$t('base.button.module')"></el-table-column>
        <el-table-column prop="moduleType" align="center" width="150" :label="$t('base.button.type')"></el-table-column>
        <el-table-column prop="projectname" align="center" width="220" :label="$t('base.button.project')"></el-table-column>
        <!--<el-table-column align="center" width="220" :label="$t('base.button.file')">-->
        <!--  <template slot-scope="scope" v-if="scope.row.moduleType === '文件'">-->
        <!--    <span>{{ scope.row.contenttext }}</span>-->
        <!--  </template>-->
        <!--</el-table-column>-->
        <el-table-column prop="modulefun" align="center" width="240" :label="$t('base.button.function')" show-overflow-tooltip>
          <!--<template slot-scope="scope">-->
          <!--  <span>{{ scope.row.modulefun != '' ? scope.row.modulefun : scope.row.moduleType }}</span>-->
          <!--</template>-->
        </el-table-column>
        <el-table-column align="center" width="220" :label="$t('base.button.time')">
          <template v-if="scope.row.createTime" slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('base.button.operate')">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleDetail(scope.row)">{{ $t('base.button.detail') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <pagination :pageTotal="Total" :pageIndex="page" :pageSize="rows" @handleCurrentChange="paginationCurrentChange" @handleSizeChange="handleSizeChange"></pagination>
  </div>
</template>
<script>
import pagination from "@/components/pagination/index";
import postApi from "@/api/document/indexApi.js";
export default {
  name: 'operLog',
  components: {
    pagination,
  },
  props: ['parentPage', 'type', 'ProjectIUID', 'editMember'],
  data() {
    return {
      addfrom: {
      },
      searchForm: {
        userName: '',
        module: '',
        moduleType: '',
        modulefun: '',
        projectname: '',
        contenttext: '',
        createTime: ['', ''],
      },
      moduleList: [],
      modulefunList: [],
      typeList: [],
      rules: {},
      tableData: [],
      multipleSelection: [],
      // 翻页
      Total: 0,
      page: 1,
      rows: 15,
    };
  },
  async mounted() {
    await this.getModuleList();
    await this.queryData();
  },
  methods: {
    resetQuery() {
      this.page = 1;
      this.searchForm.userName = '';
      this.searchForm.module = '';
      this.searchForm.moduleType = '';
      this.searchForm.contenttext = '';
      this.searchForm.projectname = '';
      this.searchForm.createTime = ['', '']
      this.queryData();
    },
    handleSearch() {
      this.page = 1;
      this.queryData();
    },
    async getModuleList() {
      const res = await postApi.get('/api/Log/Getpulldowndata')
      if (res.code == 1) {
        this.moduleList = res.data;
      }
    },
    async queryTypeList(e) {
      let module = this.moduleList.filter(item => item.iuid == e)
      if(module.length>0){
        this.searchForm.module = this.moduleList.filter(item => item.iuid == e)[0].itemText 
      }
      this.queryData()
      this.typeList = []
      let res = await postApi.get('/api/Log/Getpulldowndata?IUID=' + e)
      if (res.code == 1) {
        this.typeList = res.data
      }

      this.searchForm.moduleType = ''
      this.searchForm.modulefun = ''
    },

    async queryModulefunList(e) {
      let module = this.typeList.filter(item => item.itemText == e)
      this.queryData()
      this.modulefunList = []
      let res = await postApi.get('/api/Log/Getpulldowndata?IUID=' + module[0].iuid)
      if (res.code == 1) {
        this.modulefunList = res.data
      }

      this.searchForm.modulefun = ''
    },

    async queryData() {
      if (this.searchForm.createTime == null) {
        this.searchForm.createTime = ['', '']
      }
      let form = new FormData();
      form.append('page', this.page);
      form.append('rows', this.rows);
      form.append('userName', this.searchForm.userName);
      form.append('module', this.searchForm.module);
      form.append('moduleType', this.searchForm.moduleType);
      form.append('modulefun', this.searchForm.modulefun);
      form.append('contenttext', this.searchForm.contenttext);
      form.append('projectname', this.searchForm.projectname);
      form.append('CreateTimebegin', this.searchForm.createTime[0]);
      form.append('CreateTimeend', this.searchForm.createTime[1]);
      const res = await postApi.post('/api/Log/GetLogData', form)
      if (res.code == 1) {
        this.tableData = res.data;
        this.Total = res.count;
      }

    },
    handleDetail(row) {
      let h = this.$createElement;
      this.$msgbox({
        title: '操作详情',
        message: h('div', null, [
          h('div', { class: 'flex', style: { marginBottom: '15px' } }, [
            h('div', { style: { width: '50%' } }, [
              h('span', { style: { fontWeight: 'bold' } }, '操作人：'),
              h('span', null, row.userName),
            ]),
            h('div', { style: { width: '50%' } }, [
              h('span', { style: { fontWeight: 'bold' } }, '操作：'),
              h('span', null, row.modulefun != "" ? row.modulefun : row.moduleType),
            ]),
          ]),
          h('p', { style: { marginBottom: '15px' } }, [
            h('span', { style: { fontWeight: 'bold' } }, '操作时间：'),
            h('span', null, row.createTime),
          ]),
          h('p', null, [
            h('span', { style: { fontWeight: 'bold' } }, '日志内容：'),
            h('span', null, row.contenttext),
          ]),
        ]),
        showCancelButton: false,
        confirmButtonText: '关闭',
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    paginationCurrentChange(val) {
      this.page = val;
      this.queryData();
    },
    handleSizeChange(val) {
      this.rows = val;
      this.queryData();
    },
  },
};
</script>
<style scoped></style>
