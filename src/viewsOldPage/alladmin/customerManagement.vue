<template>
  <div class="app-container background table-box">
    <el-row>
      <el-col class="flex right">
        <el-input placeholder="请输入项目名称" prefix-icon="el-icon-search" style="width: 240px" clearable v-model="inputValue" @change="queryData" size="mini">
        </el-input>
      </el-col>
    </el-row>
    <el-row class="table">
      <el-table :data="tableData" class="t-table" :header-cell-style="$thStyle" style="margin-top: 20px; font-size: 13px" height="100%" stripe @selection-change="handleSelectionChange" @sort-change="sortChange" :default-sort="{ prop: 'createTime', order: 'descending' }"> > <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="fileName" label="企业名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="iconFile"></i>
            <span>{{ scope.row.corpName
            }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="itemName"
                         label="购买套餐类型" width="120">
        </el-table-column> -->
        <el-table-column prop="createTime" sortable="custom" label="开通时间" width="150">
        </el-table-column>
        <el-table-column prop="usableSpace" label="全部容量" width="100">
        </el-table-column>
        <el-table-column prop="usedSpace" label="已用容量" width="100">
        </el-table-column>
        <el-table-column prop="projectCount" label="项目数量" width="100">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="handleProjectSpaceDetail(scope.row)">{{ scope.row.projectCount }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="corpStatus" label="企业状态(是否删除)" align="center" width="100">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="!scope.row.isDelete">正常</el-tag>
            <el-tag size="small" type="danger" v-else>企业已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="stopUsing" label="启用状态" align="center" width="100">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="!scope.row.stopUsing">已启用</el-tag>
            <el-tag size="small" type="danger" v-else>已停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="授权状态" align="center" width="100">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.isAuth">已授权</el-tag>
            <el-tag size="small" type="danger" v-else>取消授权</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('base.formLabel.operation')" width="150">
          <template slot-scope="scope">
            <el-link v-if="scope.row.stopUsing == '0'" :underline="false" icon="el-icon-circle-close" type="danger" @click="handleUpdCorpStatus(scope.row)">停用</el-link>
            <el-link v-else :underline="false" icon="el-icon-circle-check" type="success" @click="handleUpdCorpStatus(scope.row)">启用</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <pagination :pageTotal="total" @handleCurrentChange="paginationCurrentChange" @handleSizeChange="handleSizeChange"></pagination>
  </div>
</template>
<script>
import commonApi from "@/api/common"
import pagination from "@/components/pagination/index";
import {
  decrypt
} from '@/utils'
export default {
  components: {
    pagination,
  },
  data() {
    return {
      inputValue: '',
      multipleSelection: null,
      tableData: null,
      orderBy: 'DESC',
      page: 1,
      rows: 20,
      total: 0,
    }
  },
  mounted() {
    this.queryData()
  },
  methods: {
    async queryData() {
      var formData = new FormData();
      formData.append("corpName", this.inputValue);
      formData.append("page", this.page);
      formData.append("rows", this.rows);
      formData.append("Orderby", this.orderBy);
      var res = await commonApi.queryAllCorpSpace(formData);
      // filePath 和 turnPath 解码
      res.data && res.data.forEach(item => {
        item.filePath = decrypt(item.filePath || '')
        item.turnPath = decrypt(item.turnPath || '')
      })
      this.tableData = res.data;
      this.total = res.count;
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
    paginationCurrentChange(val) {
      this.page = val;
      this.queryData();
    },
    handleSizeChange() {
      this.rows = val;
      this.queryData();
    },
    async handleUpdCorpStatus(row) {
      var res = await commonApi.updateCorpUsingStatus({
        corpId: row.corpId
      })
      if (res.code === 1) {
        this.$success(res.msg)
        this.queryData()
      }
    },
    handleProjectSpaceDetail(row) {
      this.$store.state.app.corpIdForProjectSpace = row.corpId
      this.$store.state.app.projectSpaceDialogVisible = true
    }
  }
}
</script>
