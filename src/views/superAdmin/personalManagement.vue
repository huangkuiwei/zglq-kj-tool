<template>
  <div class="background table-box">
    <el-row style="display: flex">
      <el-input :placeholder="$t('base.label.inputName')" prefix-icon="el-icon-search" style="width: 180px;margin-right: 20px;" clearable v-model="inputValue" @change="queryData()" size="mini"></el-input>
      <el-input :placeholder="$t('base.label.inputPhone')" prefix-icon="el-icon-search" style="width: 180px" clearable v-model="phone" @change="queryData()" size="mini"></el-input>
    </el-row>
    <el-row class="table">
      <el-table :data="tableData" class="t-table" :header-cell-style="$thStyle" style="width: 100%; margin-top: 20px; font-size: 13px" :height="'calc(100vh - 211px)'" :row-class-name="tableRowClassName" stripe>
        <el-table-column type="index" :label="$t('base.button.index')" align="center" width="55"></el-table-column>
        <el-table-column prop="userName" align="center" width="100" :label="$t('base.label.name')" show-overflow-tooltip></el-table-column>
        <el-table-column prop="phone" align="center" label="手机号码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="corpName" align="center" label="所属企业" show-overflow-tooltip></el-table-column>
        <el-table-column prop="registersTime" align="center" label="注册时间">
          <template v-if="scope.row.registersTime" slot-scope="scope">
            {{ scope.row.registersTime }}
          </template>
        </el-table-column>
        <el-table-column prop="serviceStopTime" align="center" label="到期时间">
          <template v-if="scope.row.serviceStopTime" slot-scope="scope">
            {{ scope.row.serviceStopTime }}
          </template>
        </el-table-column>
        <el-table-column prop="stopUsing" label="是否过期" align="center" width="90">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isServiceStop ? 'danger' : 'success'" size="mini">{{ scope.row.isServiceStop ? '已过期' : '未过期' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="usableSpace" label="总容量" width="100">
          <template slot-scope="scope">
            {{ $getFileSize(scope.row.usableSpace) }}
          </template>
        </el-table-column>
        <el-table-column prop="usedSpace" label="已使用" width="100">
          <template slot-scope="scope">
            {{ $getFileSize(scope.row.usedSpace) }}
          </template>
        </el-table-column>
        <el-table-column prop="stopUsing" label="启用状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="!scope.row.stopUsing" type="success" size="small">已启用</el-tag>
            <el-tag v-else type="danger" size="small">未启用</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="remarks" :label="$t('base.button.remark')" width="120"></el-table-column> -->
        <el-table-column :label="$t('base.formLabel.operation')" align="center" width="240">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-circle-close" style="color: #f56c6c" @click="handleStopUser(scope.row)" v-if="!scope.row.stopUsing">停用</el-button>
            <el-button type="text" icon="el-icon-circle-check" style="color: #33CC99" @click="handleStopUser(scope.row)" v-else>启用</el-button>
            <el-button type="text" icon="el-icon-edit-outline" @click="handelOperation(scope.row)">{{ $t('base.button.edit') }}</el-button>
            <el-button type="text" icon="el-icon-time" @click="handleStopTime(scope.row)">到期时间</el-button>
          </template>
        </el-table-column>
      </el-table>
      <stop-time-dialog :timeDialogVisible.sync="timeDialogVisible" :rowData="rowData" :addfrom="addfrom" @queryData="queryData"></stop-time-dialog>
    </el-row>
    <pagination :pageTotal="Total" :pageIndex="page" :pageSize="rows" @handleCurrentChange="paginationCurrentChange" @handleSizeChange="handleSizeChange"></pagination>
    <company-dialog-com :dialogVisible.sync="companyDialogVisible" isPersonal :userId="checkUserId" @reload="queryData" opeType="EDIT"></company-dialog-com>
  </div>
</template>
<script>
import pagination from "@/components/pagination/index";
import companyDialogCom from "./dialog/companyDialog";
import postApi from "@/api/document/indexApi.js";
import stopTimeDialog from "./dialog/stopTimeDialog.vue";
import { decrypt } from "@/utils";

export default {
  components: {
    pagination,
    companyDialogCom,
    stopTimeDialog
  },
  data() {
    return {
      addfrom: {},
      inputValue: "",
      phone:'',
      tableData: [],
      multipleSelection: [],
      // 翻页
      Total: 0,
      page: 1,
      rows: 15,
      rowData: {},
      orderBy: "DESC",
      timeDialogVisible: false,
      companyDialogVisible: false,
      dialogTitle: "",
      checkUserId: null,
    };
  },
  mounted() {
    this.queryData();
  },
  methods: {
    handleStopTime(row) {
      this.timeDialogVisible = true
      this.rowData = row
    },
    tableRowClassName({ row, rowIndex }) {
      if (
        rowIndex === this.locationRowIndex - 1 &&
        this.page === this.cacheLocationPageIndex
      ) {
        return "success-row";
      }
      return "";
    },
    async queryData() {
      var formData = new FormData();
      formData.append("Orderby", this.orderBy);
      formData.append("page", this.page);
      formData.append("rows", this.rows);
      formData.append("userName", this.inputValue);
      formData.append("phone", this.phone);
      var res = await postApi.post("/api/WebAccount/QueryAllUserWithoutCorp", formData);     // 本接口改为了查询所有用户 与BW不一致  2023.6.1
      this.Total = res.count;
      // filePath 和 turnPath 解码
      res.data &&
        res.data.forEach((item) => {
          item.filePath = decrypt(item.filePath || "");
          item.turnPath = decrypt(item.turnPath || "");
        });

      this.tableData = res.data;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    sortChange(column) {
      if (column.order === null) {
        this.orderBy === "DESC"
          ? (column.order = "ascending")
          : (column.order = "descending");
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
    handleStopUser(row) {
      this.$confirm(
        "确认要" +
        (row.stopUsing
          ? "启用该账户吗？"
          : "停用该账户吗？停用后该账户将无法正常使用系统功能！！") +
        ""
      ).then(async (r) => {
        var res = await postApi.post("/api/WebAccount/StopUser", {
          userId: row.userId,
        });
        if (res.code == 1) {
          this.$success(res.msg);
          this.queryData();
        }
      });
    },
    handelOperation(row) {
      this.checkUserId = row.userId;
      this.companyDialogVisible = true;
    },
  },
};
</script>
<style scoped></style>
