<!-- 文件目录树 -->
<template>
  <div class="treeList sideBarTree" style="height: calc(100vh - 182px); overflow-y: auto;padding-bottom:100px">
    <!--  @node-contextmenu="$emit('openMenu', ...arguments)"  -->
    <el-tree :show-checkbox="linkModelDialog" :animate="false" check-strictly :data="treeData" @check-change="checkChange" ref="eltree" lazy class="folderTree" node-key="iuid" highlight-current :load="loadNode" :props="folderTreeProps" :default-expanded-keys="treeOpenNodes" :expand-on-click-node="true" :auto-expand-parent="false" :empty-text="treeEmpty" @node-expand="$emit('saveTreeOpenNodes', ...arguments)" @node-collapse="$emit('removeTreeOpenNodes', ...arguments)" @node-click="$emit('openChildren', ...arguments)">
      <!-- :data="sidebarMenuList"  -->

      <div slot-scope="{ node, data }" class="treeItem">
        <div class="tree-item flex ai-center" v-if="!data.fileSuffix">
          <img v-if="data.fileName === '模型'" src="@/assets/button/moxing.svg" />
          <img v-else-if="data.fileName === '图纸'" src="@/assets/button/tuzhi.svg" />
          <img v-else-if="data.fileName === '文档'" src="@/assets/button/wendang.svg" />
          <img v-else-if="data.fileName === '实景'" src="@/assets/button/shijing.svg" />
          <img v-else src="@/assets/button/liangchang.svg" />
          <div style="font-size: 14px; font-weight: 500; margin-left: 5px">
            {{ data.fileName }}
          </div>

          <!--<div class="operBtn ai-center">-->
          <!--  <template v-if='filePermissionCon.editbit'>-->
          <!--    <el-tooltip content="重命名" placement="top" :open-delay="500" effect="dark">-->
          <!--      <img style="width:18px;margin-left: 8px;" src="@/assets/projectIcon/edit.svg" @click.stop="$emit('handleLinkEdit', data)" alt="">-->
          <!--    </el-tooltip>-->
          <!--  </template>-->
          <!--  <template v-if='filePermissionCon.deletebit'>-->
          <!--    <el-tooltip content="删除" placement="top" :open-delay="500" effect="dark">-->
          <!--      <img style="width:18px;margin-left: 8px;" src="@/assets/projectIcon/delete.svg" @click.stop="$emit('handleOpeDelete', data)" alt="">-->
          <!--    </el-tooltip>-->
          <!--  </template>-->
          <!--  <template v-if='filePermissionCon.editbit'>-->
          <!--    <el-tooltip content="上移" :disabled="data.sort == 0" placement="top" :open-delay="500" effect="dark">-->
          <!--      <img style="width:18px;margin-left: 8px;transform:rotate(-90deg)" src="@/assets/projectIcon/move.svg" @click.stop="handleMoveUpDown(data, 'Above')" alt="">-->
          <!--    </el-tooltip>-->
          <!--    <el-tooltip content="下移" :disabled="data.sort == treeData.length - 1" placement="top" :open-delay="500" effect="dark">-->
          <!--      <img style="width:18px;margin-left: 8px;transform:rotate(90deg)" src="@/assets/projectIcon/move.svg" @click.stop="handleMoveUpDown(data, 'Below')" alt="">-->
          <!--    </el-tooltip>-->
          <!--  </template>-->
          <!--</div>-->


        </div>
        <template v-else>
          <!--<el-popover v-if="!linkModelDialog" popper-class="treePopover" :disabled="!filePermissionCon.deletebit && ($modelFileSuffix.concat($ibimFileSuffix).indexOf(data.fileSuffix.toLowerCase()) == -1 || !data.lookbit)" placement="right" width="150px" effect="dark" :close-delay="0" transition="none" trigger="hover">-->
          <!--  <div class="flex ai-center jc-around">-->
          <!--    <div class="one-button" v-show="$modelFileSuffix.concat($ibimFileSuffix).includes(data.fileSuffix.toLowerCase()) && isCheckUser(data)">-->
          <!--      <el-tooltip effect="light" content="模型浏览" placement="top" popper-class="tip-class">-->
          <!--        <i class="el-icon-view" style="cursor: pointer;font-size:20px;margin-top: 3px;color: #98a2b4;" @click=" $modelFileSuffix.concat($ibimFileSuffix).includes(data.fileSuffix.toLowerCase()) && showTransferView($appList.find(item => item.type == 'bimwindows'), data.iuid, data)"></i>-->
          <!--      </el-tooltip>-->
          <!--    </div>-->
          <!--    <div class="one-button" v-show="filePermissionCon.deletebit == true && (data.checkStatus == '0' || data.checkStatus == undefined)">-->
          <!--      <el-tooltip effect="light" content="删除" placement="top" popper-class="tip-class">-->
          <!--        <i class="el-icon-delete-file" style="cursor: pointer" @click="$emit('handleDeleteFile', data)"></i>-->
          <!--      </el-tooltip>-->
          <!--    </div>-->
          <!--  </div>-->
          <!--  <div slot="reference" class="flex ai-center">-->
          <!--    <el-tooltip class="item" effect="light" :content="`该文件被${data.checkUserName}签出`" placement="top-start">-->
          <!--      <img src="@/assets/button/suo.svg" style="width: 12px; height: 12px; margin-right: 3px" v-if="data.checkStatus == '1'" />-->
          <!--    </el-tooltip>-->
          <!--    <fileIconComponends :fullPath="getFolderFullPath" :isBimWorks="false" :row="node.data" @linkToFilePage="$emit('linkToFilePage')" />-->
          <!--  </div>-->
          <!--</el-popover>-->

          <fileIconComponends :linkModelDialog="true" :fullPath="getFolderFullPath" :isBimWorks="false" :row="node.data" @linkToFilePage="$emit('linkToFilePage')" />
        </template>
      </div>
    </el-tree>
  </div>
</template>

<script>
import fileIconComponends from "@/components/fileIcon";
import projectFileApi from "@/api/project/file";
import { decrypt } from "@/utils";

export default {
  name: "folderTree",
  props: {
    currentIuid: {
      type: String,
      default: null
    },
    projectId: {
      type: String,
      default: null
    },
    folderLists: {
      type: Array,
      default: []
    },
    handleLinkEdit: {
      type: Function
    },
    handleOpeDelete: {
      type: Function,
    },
    getFolderFullPath: {
      type: Function,
    },
    sidebarMenuList: {
      type: Array,
    },
    treeEmpty: {
      type: String,
    },
    saveTreeOpenNodes: {
      type: Function,
    },
    filePermissionCon: {
      type: Object,
      default: null
    },
    removeTreeOpenNodes: {
      type: Function,
      default: null
    },
    treeOpenNodes: {
      type: Array,
      default: null
    },
    openMenu: {
      type: Function,
      default: null
    },
    openChildren: {
      type: Function,
      default: null
    },
    loadSidebarMenuList: {
      type: Function,
      default: null
    },
    handleDeleteFile: {
      type: Function,
      default: null
    },
    linkToFilePage: {
      type: Function,
      default: null
    },
    linkModelDialog: {
      type: Boolean,
      default: false
    }
  },
  components: {
    fileIconComponends
  },
  computed: {
    isBimWorks() {
      return function (a) {
        var flag = false;
        // let projectInfo = await this.$store.dispatch('queryRecentlyProject');
        // if (projectInfo.projectTypeName == "桥梁大师项目" && a.parent.data.fileName == '全桥布跨图') flag = true
        return flag
      }
    }
  },
  data() {
    return {
      folderTreeProps: {
        children: "children",
        label: "name",
        isLeaf: "leaf",
      },
      show: true,
      treeData: [],
      rootNode: '',
      rootResolve: '',
      currentKey: ''
    };
  },
  methods: {
    //上移
    async handleMoveUpDown(val, type) {
      var formData = new FormData();
      formData.append("Sort", val.sort);
      formData.append("type", type);
      formData.append("IUID", val.iuid);
      formData.append("MainIUID", this.projectId);
      var res = await projectFileApi.leftSortFile(formData);
      if (res.code == 1) {
        this.updateRootChild()
      }
    },
    checkChange(data, checked) {
      if (checked) {
        this.$refs.eltree.setCheckedNodes([data])
      }
    },

    getMainIuid(node) {
      if (node.parent.level == 1) {
        return node.parent.data.iuid
      } else {
        this.getMainIuid(node.parent)
      }
    },
    async updateRootChild() {
      this.rootNode.childNodes = []
      this.loadNode(this.rootNode, this.rootResolve)
    },
    async updateChild(node) {
      if (node) {
        node = node.data ? node : {
          level: 1,
          data: {
            ...node
          }
        }
        let formData = new FormData();
        formData.append("page", 1);
        formData.append("rows", 999);
        formData.append("sortfield", 'createTime');
        formData.append("Orderby", 'desc');
        if (node.level == 0) {
          formData.append("ProjectIUID", this.projectId);
        } else if (node.level == 1) {
          formData.append("MainIUID", node.data.iuid);
        } else if (node.level > 1) {
          formData.append("MainIUID", this.getMainIuid(node));
          formData.append("IUID", node.data.iuid);
        }
        var res = await projectFileApi.queryFileListByFileId(formData);
        if (res.code == 1) {
          res.data && res.data.forEach((item) => {
            item.filePath = decrypt(item.filePath || "");
            item.turnPath = decrypt(item.turnPath || "");
            item.leaf = (item.insideint <= 0)
            item.disabled = !item.fileSuffix.toLowerCase()
          });
          let resAppendShow = res.data.map((item, idx) => {
            return {
              ...item,
              show: false,
            };
          });

          if (this.linkModelDialog) {
            resAppendShow = res.data.filter(item => !item.fileSuffix || item.fileSuffix.toLowerCase() === '.dwg').map((item, idx) => {
              return {
                ...item,
                show: false,
              };
            });
          }
          this.$refs['eltree'].updateKeyChildren(node.data.iuid, resAppendShow)
          this.$forceUpdate()
        }
      }
    },
    async loadNode(node, resolve) {
      let formData = new FormData();
      formData.append("page", 1);
      formData.append("rows", 999);
      formData.append("sortfield", 'createTime');
      formData.append("Orderby", 'desc');
      if (node.level == 0) {
        this.rootNode = node;
        this.rootResolve = resolve
        formData.append("ProjectIUID", this.projectId);
      } else if (node.level == 1) {
        formData.append("MainIUID", node.data.iuid);
      } else if (node.level > 1) {
        formData.append("MainIUID", this.getMainIuid(node));
        formData.append("IUID", node.data.iuid);
      }
      var res = await projectFileApi.queryFileListByFileId(formData);
      if (res.code == 1) {
        this.$emit('loadSidebarMenuList', res)
        res.data && res.data.forEach((item) => {
          item.filePath = decrypt(item.filePath || "");
          item.turnPath = decrypt(item.turnPath || "");
          item.leaf = (item.insideint <= 0)
          item.disabled = !item.fileSuffix.toLowerCase()
        });
        let resAppendShow = res.data.map((item, idx) => {
          return {
            ...item,
            show: false,
          };
        });

        if (this.linkModelDialog) {
          resAppendShow = res.data.filter(item => !item.fileSuffix || item.fileSuffix.toLowerCase() === '.dwg').map((item, idx) => {
            return {
              ...item,
              show: false,
            };
          });
        }
        return resolve(resAppendShow)
      }
    },
    showTransferView(item, iuid, row) {
      let _this = this;
      const openApp = () => {
        _this.$openItwinApp({
          appName: item.title,
          appOrigin: item.origin,
          appType: item.type,
          appImage: item.start,
        }, iuid, true, row);
      }
      openApp()
    },
    isCheckUser(data) {
      return (data.checkStatus == '1' && data.checkUser == (this.$store.state.user.user && this.$store.state.user.user.userID)) || data.checkStatus == '0' || data.checkStatus == null || data.checkStatus == undefined
    }
  }
}

</script>
<style lang="scss" scoped>
.tree-item {

  .operBtn {
    display: none;
    width: 100%;
    margin-right: 10px;
  }

  &:hover {
    .operBtn {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }

}
</style>
<style>
.sideBarTree .collapse-transition {
  transition: none;
}

.treeItem {
  width: 100%;
  height: 34px;
  line-height: 34px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.treeItem .isactive {
  background-color: #f8f8f8;
}

.treePopover[x-placement^="right"] {
  margin-left: 0;
}

.treePopover[x-placement^="right"] .popper__arrow::after {
  border-right-color: #000000cc;
}

.treePopover {
  min-width: 100px;
  border-color: #000000cc;
  background: #000000cc;
}
</style>
<style lang="scss">
.treeList {
  &::-webkit-scrollbar {
    width: 0 !important;
  }

  &.isCollapse {
    width: 0;
  }
}
</style>
