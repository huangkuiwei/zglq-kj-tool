<!--  -->
<template>
  <el-dialog title="菜单权限配置" v-dialogDrag append-to-body top="30px" :visible.sync="menuVisible" width="80%" :before-close="handleClose">
    <el-table :header-cell-style="$thStyle" stripe cell-class-name="cellStyle" :height="'calc(100vh - 220px)'" :data="menuData" row-key="id" :default-expand-all="isExpandAll" :tree-props="{ children: 'children' }">
      <el-table-column width="100">
        <template slot-scope="scope">
          <el-checkbox @change="checkNode(scope.row, ...arguments)" v-model="scope.row.isselect"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="项"></el-table-column>
      <el-table-column prop="id" label="排序"></el-table-column>
    </el-table>
    <span slot="footer">
      <el-button @click="handleClose">{{ $t('base.button.cancel') }}</el-button>
      <el-button type="primary" @click="updateMenu">{{ $t('base.button.save') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moment from 'moment'
import postApi from "@/api/document/indexApi.js";

export default {
  name: "permissionMenu",
  props: ['menuVisible', 'corpId'],
  data() {
    return {
      moment,
      isExpandAll: true,
      menuData: []

    };
  },
  watch: {
    menuVisible() {
      this.queryData()
    },
  },
  created() {
  },
  methods: {
    checkNode(e, f) {
      if (f == true) {
        e.children && e.children.forEach(item => {
          item.isselect = true
          if (item.children && item.children.length > 0) {
            item.children.forEach(item => {
              item.isselect = true
            })
          }
        })
      }
    },
    async queryData() {
      let form = new FormData()
      form.append('CorpId', this.corpId)
      let res = await postApi.post('/api/Adminsetup/GetBasemenuData', form, process.env.BASE_API, this.token)
      if (res.code == 1) {
        this.menuData = res.data
      }
    },
    async updateMenu() {
      let arr = JSON.parse(JSON.stringify(this.menuData))
      arr = this.concatChild(arr).filter(item => item.isselect == true).map(item => item.id)
      let query = { corpid: this.corpId, menuid: arr }
      let res = await postApi.post('/api/Adminsetup/SetupCorpmenu', query)
      if (res.code == 1) {
        this.$success(res.msg)
      }
    },
    concatChild(arr) {
      let result = [];
      const traverse = (items) => {
        for (let item of items) {
          result.push(item);
          if (item.children && Array.isArray(item.children)) {
            traverse(item.children);
          }
        }
      };
      traverse(arr);
      return result;
    },
    handleClose() {
      this.$emit('update:menuVisible', false)
    }
  }
}

</script>
<style></style>
