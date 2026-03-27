<template>
  <el-dialog v-dialogDrag title="分享数量规格" :visible.sync="dialogVisible" width="800px" :close-on-click-modal="false" :modal="true">
    <el-table class="t-table" ref="multipleTable" :data="systemShareCountItem" stripe :header-cell-style="$thStyle" style="width: 100%; font-size: 13px;">
      <el-table-column prop="AAA" width="50px"> </el-table-column>
      <el-table-column prop="person" label="人数"> </el-table-column>
      <el-table-column prop="days" label="周期"></el-table-column>
      <el-table-column prop="price" label="价格(元)"></el-table-column>
      <el-table-column prop="limit" label="分享文件数量限制"></el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
  import {
    mapGetters
  } from "vuex";
  export default {
    computed: {
      ...mapGetters(["shareCountItemContainerVisible"]),
    },
    watch: {
      shareCountItemContainerVisible() {
        this.dialogVisible = this.shareCountItemContainerVisible;
      },
      dialogVisible() {
        this.$store.state.app.shareCountItemContainerVisible = this.dialogVisible;
      },
    },
    data() {
      return {
        dialogVisible: false,
        systemShareCountItem: [{
          person: '免费试用',
          days: '1个月',
          price: '0',
          limit: '无限制'
        }, {
          person: '1(个人版)',
          days: '1个月',
          price: '18',
          limit: '5'
        }, {
          person: '1(个人版)',
          days: '3个月',
          price: '48',
          limit: '5'
        }, {
          person: '1(个人版)',
          days: '1年',
          price: '168',
          limit: '5'
        }, {
          person: '1-5(企业版)',
          days: '1个月',
          price: '198',
          limit: '25'
        }, {
          person: '1-5(企业版)',
          days: '3个月',
          price: '888',
          limit: '25'
        }, {
          person: '1-5(企业版)',
          days: '1年/2年',
          price: '5000/9000',
          limit: '25'
        }, {
          person: '6-15(企业版)',
          days: '1年/2年',
          price: '10000/18000',
          limit: '75'
        }, {
          person: '16-30(企业版)',
          days: '1年/2年',
          price: '20000/36000',
          limit: '150'
        }, {
          person: '31-50(企业版)',
          days: '1年/2年',
          price: '30000/42000',
          limit: '250'
        }, {
          person: '51-100(企业版)',
          days: '1年/2年',
          price: '50000/88000',
          limit: '500'
        }, {
          person: '101-200(企业版)',
          days: '1年/2年',
          price: '80000/150000',
          limit: '1000'
        }, {
          person: '201-500(企业版)',
          days: '1年/2年',
          price: '150000/268000',
          limit: '2500'
        }, {
          person: '500以上(企业版)',
          days: '请联系供应商',
          price: '0',
          limit: '无限制'
        }, ]
      };
    },
  };
</script>
