<template>
  <el-pagination
    class="t-pagination"
    :pager-count="pagerCount"
    :page-sizes="paginations.pageSizes"
    :page-size="paginations.pageSize"
    :layout="paginations.layout"
    :total="pageTotal"
    :current-page='paginations.pageIndex'
    @current-change='handleCurrentChange'
    @size-change='handleSizeChange'
  >
  </el-pagination>

</template>


<script>
export default {
  name: 'pagination',
  data() {
    return {
      paginations: {
        pageIndex: 1,  // 当前位于哪页
        pageSize: 10,   // 1页显示多少条
        pageSizes: [10, 20, 30, 40],  //每页显示多少条
        layout: "prev, pager, next"   // 翻页属性
      },
    }
  },
  props: {
    pageTotal: {
      type: Number,
      default: () => 0
    },
    pagerCount: {
      type: Number,
      default: () => 5
    }
  },
  created() {

  },
  mounted() {

  },
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

<style lang="sass" scoped>
.t-pagination
  padding-bottom: 10px
  text-align: right
  padding-right: 20px
</style>