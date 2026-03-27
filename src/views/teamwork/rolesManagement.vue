
<template>
  <div style="height:100%">
    <!--el-button size="mini" type="info" style="margin:5px" @click="addNewRecord()">{{$t('base.button.create')}}</el-button-->
    <RolesTree ref="customTree" :rolesData="rolesData" :tree-node-key="treeNodeKey" @addItem="addTreeItem" @getAllRoles="getAllRolesData" @deleteItem="deleteTreeItem" @editItem="editTreeItem" />
  <!-- 地点弹窗 -->
    <place-dialog ref="placeDialog" @addData="addData" @editData="editData" />

  </div>
</template>

<script>

import RolesTree from './rolesTree'
import PlaceDialog from './PlaceDialog'

export default {
  props: {
    // 源数据
   rolesData: {
      type: Array,
      required: true,
    },
    getAllRoles:{
      type: Function
    }
  },
  components: {
    RolesTree,
    PlaceDialog
  },

  data() {
    return {
      treeNodeKey: 'id'
    }
  },

  created() {
    this.initTreeData()
  },

  methods: {

    getAllRolesData(){
      this.$emit('getAllRoles')
    },
    // 初始化列表
    initTreeData() {

    },

    // 添加新记录
    addNewRecord() {
      this.$refs.placeDialog.openDialog(false)
    },

    // 新增表单数据
    addData(data) {
      // 新增树节点
      this.$refs.customTree.treeAddItem(data)
    },

    // 修改表单数据
    editData(data) {
      // 修改树节点
      this.$refs.customTree.treeEditItem(data)
    },

    // 增加树节点
    addTreeItem(data) {
      // 打开地点弹窗，设置默认父级节点
      this.$refs.placeDialog.openDialog(false, data.ID, data)   // 增加是向下增加子节点
    },

    // 删除树节点
    deleteTreeItem(data) {
      this.$confirm('确定删除<'+data.RoleName+'>吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除树节点
        this.$refs.customTree.treeDeleteItem(data)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 修改树节点
    editTreeItem(data) {
      // 打开地点编辑弹窗
      this.$refs.placeDialog.openDialog(true, data.ParentId, data)
    }

  }
}
</script>

