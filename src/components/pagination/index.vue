<template>
  <el-pagination class="t-pagination" :pager-count="pagerCount" :page-sizes="paginations.pageSizes" :page-size="pageNumber" :layout="paginations.layout" :total="pageTotal" :current-page='pageIndex' @current-change='handleCurrentChange' @size-change='handleSizeChange'>
  </el-pagination>
</template>
<script>
  export default {
    name: 'pagination',
    data() {
      return {
        paginations: {
          pageSize: 15, // 1页显示多少条
          pageSizes: [5,10,15,30,60], //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
        },
      }
    },
    props: {
      pageIndex: {
        type: Number,
        default: () => 1
      },
      pageTotal: {
        type: Number,
        default: () => 0
      },
      pagerCount: {
        type: Number,
        default: () => 5
      },
      pageNumber: {
        type: Number,
        default: () => 15
      }
    },
    created() {},
    mounted() {},
    methods: {
      // 上下分页 pageIndex
      handleCurrentChange(page) {
        this.$emit('handleCurrentChange', page);
      },
      // 每页多少条切换 pageSize
      handleSizeChange(page_size) {
        this.$emit('handleSizeChange', page_size);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .t-pagination {
    height: 53px;
    padding: 12px 0 0;
    border-top: 1px solid #DCDFE6;
    text-align: right;
    padding-right: 20px;
    z-index: 99;
    background-color: #fff
  }
</style>
