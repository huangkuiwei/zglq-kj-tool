<template>
  <div class="background table-box">
    <el-row style="display: flex">
      <el-input placeholder="请输入用户姓名" style="width: 240px;" clearable v-model="UserName" size="mini">
      </el-input>
      <el-input placeholder="请输入注册账号" style="width: 240px;margin-left: 10px;" clearable v-model="phone" size="mini">
      </el-input>
      <el-input placeholder="请输入企业名" style="width: 240px;margin-left: 10px;" clearable v-model="CorpName" size="mini">
      </el-input>
      <el-button style="display: flex;align-items: center;height: 28px;margin-left: 10px;" @click="queryData()">{{ $t('base.button.query') }}</el-button>
    </el-row>
    <el-row class="table">
      <el-table :data="tableData" class="t-table" :header-cell-style="$thStyle" style="width: 100%; margin-top: 20px; font-size: 13px" height="100%" :row-class-name="tableRowClassName" stripe :default-sort="{ prop: 'registersTime', order: 'descending' }">
        <el-table-column prop="row" width="50" align="center" :label="$t('base.button.index')"> </el-table-column>
        <el-table-column prop="userName" label="付款人名称" width="120" align="center"></el-table-column>
        <el-table-column prop="phone" label="付款人手机号"></el-table-column>
        <el-table-column prop="payFee" label="实际付款金额" align="center"></el-table-column>
        <el-table-column prop="payway" label="支付方式" align="center"></el-table-column>
        <el-table-column prop="corpName" label="企业名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="corpCode" label="组织机构代码"></el-table-column>
        <el-table-column prop="createTime" label="付款时间">
          <template v-if="scope.row.createTime" slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="购买事项" align="center"></el-table-column>
        <el-table-column prop="invoicing" label="是否需要发票" align="center"></el-table-column>
        <!-- <el-table-column :label="$t('base.formLabel.operation')">
          <template slot-scope="scope">
            <el-button type="text" @click="handleStopUser(scope.row)">到期时间</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-row>
    <pagination :pageTotal="Total" :pageIndex="page" :pageSize="rows" @handleCurrentChange="paginationCurrentChange" @handleSizeChange="handleSizeChange"></pagination>
    <el-dialog v-dialogDrag title="修改到期时间" width="30%" :visible.sync="personDialogVisible">
      <el-form ref="addPersonForm" :model="addfrom" label-width="80px" label-position="left">
        <el-form-item label="到期时间" label-width="80px">
          <el-date-picker type="datetime" v-model="addfrom.serviceStopTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" @change="changeServiceStopTime">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sure" size="small">{{ $t('base.button.confirm') }}</el-button>
        <el-button @click="personDialogVisible = false" size="small">{{ $t('base.button.cancel') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/components/pagination/index";

import postApi from "@/api/document/indexApi.js";


export default {
  components: {
    pagination,

  },
  data() {
    return {
      addfrom: {
        serviceStopTime: '',
      },
      tableData: [],

      CorpName: '',
      phone: '',
      UserName: '',
      // 翻页
      Total: 0,
      page: 1,
      rows: 15,
      personDialogVisible: false,
      orderId: null,
      rowData: {}
    };
  },
  mounted() {
    this.queryData();
  },
  methods: {
    changeServiceStopTime(data) {
      console.log(this.rowData.serviceStopTime)
      console.log(this.addfrom.serviceStopTime)
    },
    async sure() {
      // if (this.rowData.serviceStopTime < this.addfrom.serviceStopTime) {
      var forData = new FormData()
      forData.append('OrderId', this.rowData.orderId)
      forData.append('ServiceStopTime', this.addfrom.serviceStopTime)
      var res = await postApi.post("/api/WebAccount/GetCorpuserDataEdit", forData);
      if (res.code === 1) {
        this.$success(res.msg);
      }
      this.personDialogVisible = false
      this.queryData()
      // } else {
      // this.$warning('修改时间不能小于到期时间')
      // }
    },
    async queryData() {
      var forData = new FormData()
      forData.append('page', this.page)
      forData.append('rows', this.rows)
      forData.append('CorpName', this.CorpName)
      forData.append('phone', this.phone)
      forData.append('UserName', this.UserName)
      var res = await postApi.post("/api/WebAccount/GetCorpuserData", forData);
      if (res.code === 1) {
        this.tableData = res.data;
        this.Total = res.count
      }
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
      this.personDialogVisible = true
      this.rowData = row
      this.addfrom.serviceStopTime = row.serviceStopTime
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
  },
};
</script>
<style scoped></style>
