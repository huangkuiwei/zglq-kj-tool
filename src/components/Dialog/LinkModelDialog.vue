<template>
  <el-dialog
      title="关联文件"
      class="link-model-dialog"
      :visible.sync="visible"
      width="500px"
      @close="$emit('update:visible', false)"
  >
    <folder-tree ref="folderTree" :link-model-dialog="true" :projectId="projectId" @loadSidebarMenuList="loadSidebarMenuList" :parentExpand="parentExpand" :currentIuid="currentIuid" :folderLists="folderLists" :filePermissionCon="filePermissionCon" :sidebarMenuList.sync="sidebarMenuList" :treeEmpty="treeEmpty" @saveTreeOpenNodes="saveTreeOpenNodes" @removeTreeOpenNodes="removeTreeOpenNodes" :treeOpenNodes="treeOpenNodes" @openMenu="openMenu" @openChildren="openChildren" @handleDeleteFile="handleDeleteFile" @getFolderFullPath="getFolderFullPath" @linkToFilePage="linkToFilePage"></folder-tree>

    <div style="margin-top: 20px; display: flex; align-items: center; justify-content: flex-end">
      <el-button size="medium" type="primary" @click="submit">{{ $t('base.button.confirm') }}</el-button>
      <el-button size="medium" @click="$emit('update:visible', false)">{{ $t('base.button.cancel') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import folderTree from '../../views/project/file/folderTree.vue'
import request from '../../utils/request'

export default {
  name: 'linkModelDialog',
  components: { folderTree },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    projectId: {},
    parentExpand: {},
    currentIuid: {},
    folderLists: {},
    filePermissionCon: {},
    sidebarMenuList: {},
    treeEmpty: {},
    treeOpenNodes: {},
    tableSelection: {},
  },

  methods: {
    loadSidebarMenuList() {},
    saveTreeOpenNodes() {},
    removeTreeOpenNodes() {},
    openMenu() {},
    openChildren() {},
    handleDeleteFile() {},
    getFolderFullPath() {},
    linkToFilePage() {},

    submit() {
      let item = this.$refs.folderTree.$refs.eltree.getCheckedKeys()

      if (item.length) {
        request.post('api/imodel/FileconsultAdd', {
          owneriuid: this.tableSelection[0].iuid,
          soniuidlist: item,
        }).then((res) => {
          if (res.code === 1) {
            this.$message.success('操作成功')
            this.$emit('update:visible', false)
          }
        })
      } else {
        this.$message.warning('请勾选需要关联的dwg文件')
      }
    }
  }
}
</script>

<style lang="scss">
.link-model-dialog {
  .el-dialog__body {
    .treeList {
      height: auto !important;
      padding-bottom: 0 !important;

      .folderTree {
        width: 100% !important;
      }
    }
  }
}
</style>
