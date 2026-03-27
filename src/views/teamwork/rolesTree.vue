<template>
  <el-scrollbar style="height:calc(100% - 5px);">
    <el-tree id="my-tree" ref="tree" class="tree-view structure-tree" accordion :data="rolesData" :default-expanded-keys="defaultNode" :default-expand-all="false" :props="treeDefaultProps" :auto-expand-parent="true" :expand-on-click-node="true" :show-checkbox="false" :check-strictly="true" node-key="ID" style="margin-left:5px; width:calc(100% - 10px); overflow-y: scroll" @node-expand="expandChange">
      <span slot-scope="{ node, data }" class="custom-tree-node" @mouseenter="mouseenter(data)" @mouseleave="mouseleave(data)">
        <div class="tooltip">
          <div v-if="data.typeName == '专业'"> <i class="el-icon-department"></i>
            <span class="node-name">{{ data.RoleName }}</span>
          </div>
          <div v-if="data.typeName == '角色'"> <i class="el-icon-role"></i>
            <span class="node-name">{{ data.RoleName }}</span>
          </div>
          <div v-if="data.typeName == '人员'"> <i class="el-icon-person"></i>
            <span class="node-name">{{ data.RoleName }}</span>
          </div>
        </div>
        <!--div v-if="node.isCurrent == true" class="operation-view"-->
        <div v-if="data.show == true && data.RoleName != '默认专业'" class="operation-view flex ai-center">
          <i v-if="data.typeName == '专业'" class="small-operation-btn el-icon-plus" @click.stop="handleAdd(data)" />
          <img v-if="data.typeName == '角色'" @click.stop="handleAdd(data)" style="width: 14px" src="../../assets/iconImg/setuser.svg" class="small-operation-btn ">
          <i v-if="data.typeName == '专业' || data.typeName == '角色'" class="small-operation-btn el-icon-edit " @click.stop="handleEdit(data)" />
          <i v-if="node.level != 1 || data.typeName != '人员'" class="small-operation-btn el-icon-delete" @click.stop="handleDelete(data)" />
        </div>
      </span>
    </el-tree>
  </el-scrollbar>
</template>
<script>
import projectFileApi from "@/api/document/indexApi.js";
export default {
  props: {
    // 源数据
    rolesData: {
      type: Array,
      required: true,
    },
    getAllRoles: {
      type: Function
    },
    // 树节点唯一标识
    treeNodeKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      treeDefaultProps: {
        parent: 'ParentID', // 父级唯一标识
        value: 'ID', // 唯一标识
        label: 'RoleName', //'OrganizeName', // 标签显示
        children: 'children', // 子级
        typeName: 'typeName',
      },
      defaultNode: ["100001"],
      selectItem: {}
    }
  },
  methods: {
    mouseenter(data) {
      this.$set(data, 'show', true);
    },
    mouseleave(data) {
      this.$set(data, 'show', false);
    },
    // 添加新增按钮
    handleAdd(data) {
      this.$emit('addItem', data)
    },
    // 点击删除按钮
    handleDelete(data) {
      this.$emit('deleteItem', data)
    },
    // 点击编辑按钮
    handleEdit(data) {
      this.selectItem = data
      this.$emit('editItem', JSON.parse(JSON.stringify(data)))
    },
    // ============== 组件内事件 结束=============
    // ============== 父组件回调事件 开始=============
    // 添加新记录，树形列表回显
    async treeAddItem(data) {
      if (data.typeName == '角色') {
        var formData = new FormData();
        formData.append('RoleName', data.RoleName);
        formData.append('RoleDesc', data.desc);
        formData.append('RoleCode', '');
        formData.append('Sort', 1);
        formData.append('ID', '');
        formData.append('SpecialtyIUID', data.ParentID);
        var res = await projectFileApi.post("/api/Permission/RoleSave", formData);
        if (res.code == 1) {
          data.ID = res.data;
          this.$refs.tree.append(data, data.ParentID)
        }
      } else if (data.typeName == '人员') { // 可以一次添加多个人
        var res = await projectFileApi.post("/api/Permission/UserSetRoleListSave", data);
        if (res.code == 1) {
          this.$emit('getAllRoles')
        }
      }
    },
    expandChange(e) {
      this.defaultNode = [e.ID]
    },
    delsuccess() {
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    },
    // 删除节点
    async treeDeleteItem(data) {
      this.$refs.tree.remove(data)
      if (data.typeName == '专业') {
        var formData = new FormData();
        formData.append('SpecialtyIUID', data.ID);
        var res = await projectFileApi.post("/api/Permission/SpecialtyDelete", formData);
        if (res.code == 1) { this.delsuccess() }
      } else if (data.typeName == '角色') {
        var formData = new FormData();
        formData.append('IUID', data.ID);
        var res = await projectFileApi.post("/api/Permission/RoleDelete", formData);
        if (res.code == 1) { this.delsuccess() }
      } else if (data.typeName == '人员') {
        var formData = new FormData();
        formData.append('ID', data.ParentID);
        formData.append('UserID', data.ID);
        var res = await projectFileApi.post("/api/Permission/RoleDeleteUser", formData);
        if (res.code == 1) { this.delsuccess() }
      }
    },
    // 修改记录，树形列表回显
    async treeEditItem(data) {
      Object.assign(this.selectItem, data)
      this.selectItem = {}
      if (data.typeName == '专业') {
        var formData = new FormData();
        formData.append('SpecialtyName', data.RoleName);
        formData.append('SpecialtyIUID', data.ID);
        var res = await projectFileApi.post("/api/Permission/SpecialtySave", formData);
        if (res.code == 1) { }
      } else if (data.typeName == '角色') {
        var formData = new FormData();
        formData.append('RoleName', data.RoleName);
        formData.append('ID', data.ID);
        var res = await projectFileApi.post("/api/Permission/RoleSave", formData);
        if (res.code == 1) { }
      }
    }
    // ============== 父组件回调事件 结束=============
  }
}
</script>
<style lang="scss">
.el-scrollbar__wrap {
  overflow-x: hidden;
}

.structure-tree {
  .el-scrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  #my-tree .el-tree>.el-tree-node {
    min-width: 100%;
    display: inline-block;
  }

  .el-tree-node__content {
    margin-bottom: 1px;
  }

  .tooltip {
    margin-right: 5px;
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
    white-space: nowrap;
    padding: 4px;
    display: flex;
    z-index: 20;
  }

  .operation-view {
    display: inline-block;
    padding: 0px 5px;
    margin-left: 5px;
    color: #777777;
  }

  .small-operation-btn {
    margin: 0px 3px;
  }

  .custom-tree-node {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    margin-right: 18px;
  }
}
</style>
