<template>
  <div class="background table-box">
    <el-row style="display:flex;">
      <el-input placeholder="请输入企业名称" prefix-icon="el-icon-search" style="width: 180px;margin-right: 20px;" clearable v-model="inputValue" @change="handleSearch" size="mini"></el-input>
      <el-input placeholder="请输入企业负责人" prefix-icon="el-icon-search" style="width: 180px;margin-right: 20px;" clearable v-model="superintend" @change="handleSearch" size="mini"></el-input>
      <el-input :laceholder="$t('base.button.inputPhoneNumber')" prefix-icon="el-icon-search" style="width: 180px;margin-right: 20px;" clearable v-model="superintendphone" @change="handleSearch" size="mini"></el-input>
      <el-button type="primary" plain style="height:28px;padding: 0 20px;margin-left:10px" @click="handelOperation('ADD')">新增企业</el-button>
    </el-row>
    <el-row class="table">
      <el-table :data="tableData" class="t-table" :header-cell-style="$thStyle" cell-class-name="cellStyle" style="width: 100%; margin-top: 20px; font-size: 13px" height="100%" stripe @selection-change="handleSelectionChange" @sort-change="sortChange" :default-sort="{ prop: 'createTime', order: 'descending' }">
        <el-table-column type="expand" width="55">
          <template slot-scope="scope">
            <el-descriptions border :column="3" size="small" style="margin: 0 10px;" :contentStyle="CS" :label-style="LS">
              <el-descriptions-item span="1" label="组织机构代码">{{ scope.row.corpCode }}</el-descriptions-item>
              <el-descriptions-item span="1" label="已用容量">{{ $getFileSize(scope.row.usedSpace) || '0.00B' }}</el-descriptions-item>
              <el-descriptions-item span="1" label="人员数量">{{ scope.row.userCount }}人</el-descriptions-item>
              <el-descriptions-item span="1" :label="$t('base.button.remark')">{{ scope.row.remarks }}</el-descriptions-item>
              <el-descriptions-item span="1" label="全部容量">{{ $getFileSize(scope.row.usableSpace) }}</el-descriptions-item>
              <el-descriptions-item span="1" label="项目数量">{{ scope.row.projectCount }}个</el-descriptions-item>
            </el-descriptions>
          </template>
        </el-table-column>
        <el-table-column type="index" width="55" align="center" :label="$t('base.button.index')"></el-table-column>
        <el-table-column prop="corpName" show-overflow-tooltip label="企业名称" class-name="bold"></el-table-column>
        <el-table-column prop="superintend" label="负责人" align="center" width="100"></el-table-column>
        <el-table-column prop="superintendphone" :label="$t('base.label.phone')" align="center" width="130"></el-table-column>
        <el-table-column prop="createTime" align="center" label="开通时间" width="110">
          <template v-if="scope.row.createTime" slot-scope="scope">
            {{ scope.row.createTime.split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" align="center" label="到期时间" width="110">
          <template v-if="scope.row.serviceStopTime" slot-scope="scope">
            {{ scope.row.serviceStopTime.split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column prop="stopUsing" label="启用状态" align="center" width="90">
          <template slot-scope="scope">
            <el-tag :type="scope.row.stopUsing ? 'danger' : 'success'" size="mini">{{ scope.row.stopUsing ? '未启用' : '已启用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="stopUsing" label="是否过期" align="center" width="90">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isServiceStop ? 'danger' : 'success'" size="mini">{{ scope.row.isServiceStop ? '已过期' : '未过期' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('base.formLabel.operation')" align="center" width="320">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit-outline" @click="handelOperation('EDIT', scope.row)">{{ $t('base.button.edit') }}</el-button>
            <el-button type="text" size="small" icon="el-icon-time" @click="handleStopTime(scope.row)">到期时间</el-button>
            <!-- <el-button type="text" size="small" icon="el-icon-circle-close" style="color:#F56C6C" @click="handleStopCorp(scope.row)" v-if="!scope.row.stopUsing">停用</el-button> -->
            <!-- <el-button type="text" size="small" icon="el-icon-circle-check" style="color:#33CC99" @click="handleStopCorp(scope.row)" v-else>启用</el-button> -->
            <el-button type="text" size="small" icon="el-icon-user" @click="handleCheckCustom(scope.row)">查看人员</el-button>
            <el-button type="text" size="small" icon="el-icon-setting" @click="setPermission(scope.row)">菜单配置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <permission-menu :corpId="corpId" :menuVisible.sync="menuVisible"></permission-menu>
    <company-person-add :visible.sync="personDialogVisible" :corpId="corpId" @loadPerson="loadCompanyPerson"></company-person-add>
    <stop-time-dialog :timeDialogVisible.sync="timeDialogVisible" :rowData="rowData" @queryData="queryData"></stop-time-dialog>
    <pagination :pageTotal="Total" :pageIndex="page" :pageSize="rows" @handleCurrentChange="paginationCurrentChange" @handleSizeChange="handleSizeChange"></pagination>
    <opeDialog ref="opeDialog" :opeType="baseInfoOpeType" :corpId="corpId" :corpName="corpName" :dialogVisible.sync="baseInfoDialogVisible" @reload="queryData" @addperson='addperson' />
    <companyDialogCom :dialogVisible.sync="companyDialogVisible" @reload="queryData" :opeType="opeType" :corpId="corpId"></companyDialogCom>
  </div>
</template>
<script>
import pagination from "@/components/pagination/index";
import postApi from "@/api/document/indexApi.js";
import companyPersonAdd from "@/components/Dialog/companyPersonAdd";
import opeDialog from "@/components/editPersonalInfoCom";
import companyDialogCom from "./dialog/companyDialog"
import stopTimeDialog from "./dialog/stopTimeDialog.vue";
import permissionMenu from "../../components/permissionMenu.vue";

import { decrypt } from '@/utils'

export default {
  components: {
    pagination,
    opeDialog,
    companyDialogCom,
    permissionMenu,
    stopTimeDialog,
    companyPersonAdd
  },
  data() {
    return {
      //
      CS: {
        'width': '12.5%',   //最小宽度
        'word-break': 'break-all'  //过长时自动换行
      },
      LS: {
        'width': '12.5%',
        'word-break': 'keep-all'
      },
      // 翻页
      personDialogVisible: false,
      Total: 0,
      page: 1,
      rows: 15,
      inputValue: '',
      superintend: '',
      superintendphone: '',
      tableData: [],
      multipleSelection: [],
      companyDialogVisible: false,
      dialogTitle: '',
      orderBy: 'DESC',
      baseInfoDialogVisible: false,
      baseInfoOpeType: null,
      corpId: null,
      menuVisible: false,
      corpName: '',
      opeType: '',
      timeDialogVisible: false,
      rowData: {},
    }
  },
  mounted() {
    this.queryData()
    // this.setPermission()
  },
  methods: {
    async setPermission(row) {
      this.corpId = row.corpId
      this.menuVisible = true
    },
    handleStopTime(row) {
      this.timeDialogVisible = true
      this.rowData = JSON.parse(JSON.stringify(row))
    },
    loadCompanyPerson() {
      this.$refs.opeDialog.loadPerson()
    },
    handleSearch() {
      this.page = 1;
      this.queryData();
    },
    async queryData() {
      var formData = new FormData();
      formData.append("Orderby", this.orderBy);
      formData.append("page", this.page);
      formData.append("rows", this.rows);
      formData.append("corpName", this.inputValue);
      formData.append("superintend", this.superintend);
      formData.append("superintendphone", this.superintendphone);
      var res = await postApi.post('/api/WebAccount/GetCorpData', formData)
      this.Total = res.count;

      // filePath 和 turnPath 解码
      res.data && res.data.forEach(item => {
        item.filePath = decrypt(item.filePath || '')
        item.turnPath = decrypt(item.turnPath || '')
      })

      this.tableData = res.data;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;

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
    paginationCurrentChange(val) {
      this.page = val;
      this.queryData();
    },
    handleSizeChange(val) {
      this.rows = val;
      this.queryData();
    },
    addperson() {
      this.personDialogVisible = true;
    },
    handleCheckCustom(row) {
      this.baseInfoOpeType = "checkCompanyPerson";
      this.corpId = row.corpId
      this.corpName = row.corpName
      this.baseInfoDialogVisible = true;
    },
    handleStopCorp(row) {
      this.$confirm('确认要' + (row.stopUsing ? '启用该企业吗？' : '停用该企业吗？停用后企业下的用户将无法正常使用系统功能！！') + '').then(async (r) => {
        var res = await postApi.post('/api/WebAccount/StopCorp', { corpId: row.corpId })
        if (res.code == 1) {
          this.$success(res.msg)
          this.queryData()
        }
      })
    },
    handelOperation(val, row) {
      if (val == "EDIT") {
        this.corpId = row.corpId
      } else {
        this.corpId = null
      }
      this.companyDialogVisible = true
      this.opeType = val
    },
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-table {
  td {
    &.cellStyle {
      padding: 7px 0;
    }
  }
}

.bold {
  font-weight: 500;
}
</style>
