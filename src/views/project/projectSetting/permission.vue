<!-- 项目权限管理 -->
<template>
  <div class="flex" style="height: calc(90vh - 100px);">
    <div class="tree-box">
      <!-- 左侧文件夹新建/编辑 -->
      <!-- <el-button type="primary" style="width: calc(100% - 15px);margin-bottom: 10px;" size="small" icon="el-icon-plus" plain @click="addGroup">{{ $t('projects.operation.addGroup') }}</el-button>
      <el-dialog v-dialogDrag append-to-body :close-on-click-modal="false" :title="addEditType === 'add' ? '新建分组' : '编辑分组'" :visible.sync="addEditDialogVisble" width="400px">
        <el-form ref="form" :rules="folderRules" :model="fileForm" label-width="80px">
          <el-form-item label="分组名称" prop="name">
            <el-input placeholder="请输入分组名称" v-model="fileForm.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top: -10px">
          <el-button size="small" @click="addEditDialogVisble = false" style="width: 80px; margin-left: 5px">{{ $t('base.button.cancel') }}</el-button>
          <el-button size="small" type="primary" @click="sureAddEditFolder" style="width: 88px">确认</el-button>
        </div>
      </el-dialog> -->

      <el-tree lazy class="tree" :props="treeProps" :data="treeData" :expand-on-click-node="false" :load="loadNode"
        @node-click="queryFolderPermission">
        <div slot-scope="{node,data}" class="tree-item flex ai-center jc-between">
          <span>{{ node.label }}</span>
          <!-- <div class="operBtn ai-center">
            <el-tooltip content="重命名" placement="top" :open-delay="500" effect="dark">
              <img style="width:18px;margin-left: 8px;" src="@/assets/projectIcon/edit.svg" @click.stop="editGroup(data)" alt="">
            </el-tooltip>
            <el-tooltip content="删除" placement="top" :open-delay="500" effect="dark">
              <img style="width:18px;margin-left: 8px;" src="@/assets/projectIcon/delete.svg" @click.stop="deleteFolder(data)" alt="">
            </el-tooltip>
            <el-tooltip content="上移" :disabled="data.sort == 0" placement="top" :open-delay="500" effect="dark">
              <img style="width:18px;margin-left: 8px;transform:rotate(-90deg)" v-if="data.toprow == 1 && data.sort != 0" src="@/assets/projectIcon/move.svg" @click.stop="sortFolder(data, 'Above')" alt="">
            </el-tooltip>
            <el-tooltip content="下移" :disabled="data.sort == treeData.length - 1" placement="top" :open-delay="500" effect="dark">
              <img style="width:18px;margin-left: 8px;transform:rotate(90deg)" v-if="data.toprow == 1 && data.sort != treeData.length - 1" src="@/assets/projectIcon/move.svg" @click.stop="sortFolder(data, 'Below')" alt="">
            </el-tooltip>
          </div> -->
        </div>
      </el-tree>
    </div>
    <div>
      <div class="flex ai-center jc-between" style="margin-bottom: 15px;">
        <div style="font-weight: bold;">{{ currentFolder.name }}</div>
        <!-- <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="handleAdd">{{ $t('projects.operation.addFolderMember') }}</el-button> -->
        <!-- <el-button type="danger" plain size="mini" icon="el-icon-minus" v-if="multipleSelection.length > 0" @click="deletePerson">{{ $t('projects.operation.removeFolderMember') }}</el-button> -->
        <el-checkbox style="margin-left: auto;" v-if="currentFolder.toprow != 1" v-model="inherit">{{
          $t('projects.operation.inheritPermissions') }}</el-checkbox>
      </div>
      <!-- <member-picker :dialogVisible.sync="memberPickerVisible" @submit="saveUserAuthorize" :checkList="checkList" :memberList="memberList" @queryMember="queryMember" @cancelCheck="cancelCheck" dialog-title="选择文件夹成员"></member-picker> -->
      <el-table ref="multipleTable" :data="permissionData" border height="100%" maxHeight="calc(90vh - 220px)" tooltip-effect="light"
        style="width: calc(90vw - 340px)" :header-cell-style="$thStyle" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" :selectable='checkbox_callback' align="center" width="55"></el-table-column> -->
        <el-table-column prop="userName" :label="$t('base.button.member')" align="center" width="100"></el-table-column>
        <el-table-column prop="authorizename" :label="$t('base.button.role')" align="center" min-width="120"></el-table-column>
        <el-table-column prop="address" min-width="380" show-overflow-tooltip :label="$t('base.button.fileRight')" :render-header="renderHeader">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.lookbit" @change="handleChangeLookbit(scope.row, ...arguments)"
              :disabled="scope.row.bigBrotherbit">{{ $t('base.button.view') }}</el-checkbox>
            <el-checkbox v-model="scope.row.downloadbit" @change="handleChange(scope.row)"
              :disabled="scope.row.bigBrotherbit">{{ isBridgeMaster ? $t('base.button.checkIn') : $t('base.button.download') }}</el-checkbox>
            <el-checkbox v-model="scope.row.setupbit" @change="handleChange(scope.row)"
              :disabled="scope.row.bigBrotherbit">{{ isBridgeMaster ? $t('base.button.checkOut') : $t('base.button.new') }}</el-checkbox>
            <el-checkbox v-model="scope.row.editbit" @change="handleChange(scope.row)"
              :disabled="scope.row.bigBrotherbit">{{ $t('base.button.edit') }}</el-checkbox>
            <el-checkbox v-model="scope.row.deletebit" @change="handleChange(scope.row)"
              :disabled="scope.row.bigBrotherbit">{{ $t('base.button.delete') }}</el-checkbox>
            <el-checkbox v-model="scope.row.authorizebit" @change="handleChange(scope.row)"
              :disabled="scope.row.bigBrotherbit">{{ $t('base.button.authorize') }}</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="address" width="260" show-overflow-tooltip :label="$t('base.button.applicationPermissions')" :render-header="renderHeader">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.bimlookbit" @change="handleChange(scope.row)"
              :disabled="scope.row.bigBrotherbit">{{ $t('base.button.viewModel') }}</el-checkbox>
            <el-checkbox v-model="scope.row.bimeditbit" @change="handleChange(scope.row)"
              :disabled="scope.row.bigBrotherbit">{{ $t('base.button.editModel') }}</el-checkbox>
          </template>

        </el-table-column>

        <!-- <el-table-column show-overflow-tooltip align="center" width="80">
          <template slot-scope="scope" v-if="!scope.row.bigBrotherbit">
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deletePersonRow(scope.$index)" style="background:none;color:#F56C6C;border:none;cursor:pointer;font-size:16px">
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="flex">
        <el-button v-loading="saveLoading" type="primary" style="margin-top: 10px;margin-left: auto;" size="" @click="saveMember">{{
          $t('base.button.save') }}</el-button>
      </div>

    </div>
    <div class="PermissionIllustrate" v-if="PermissionIllustrateVisible">
      <div
        style="border-bottom:1px solid #eee;padding:5px 10px 10px;display: flex;align-items: center;justify-content: space-between;">
        <span>{{ PermissionIllustrateType }}说明：</span>
        <el-button type="text" size="mini" icon="el-icon-close" @click="PermissionIllustrateVisible = false"></el-button>
      </div>
      <div style="padding:10px">
        <template v-if="PermissionIllustrateType == '文件权限'">
          <p>1、查看：支持查看文件夹内的文件；</p>
          <p>2、下载：支持文件夹内的文件下载、分享；</p>
          <p>3、新建：支持在文件夹内新建、上传文件，支持更新文件版本；</p>
          <p>4、编辑：支持对文件夹内的文件进行移动、复制、重命名，支持更换文件版本；</p>
          <p>5、删除：支持对文件夹内的文件进行删除；</p>
          <p>6、授权：对该成员赋予文件夹管理权限，可对其他成员的权限进行设置；</p>
        </template>
        <template v-if="PermissionIllustrateType == '应用权限'">
          <p>1、模型查看：赋予该成员模型查看的应用权限，主要包括"看模王"模块；</p>
          <p>2、模型编辑：赋予该成员模型编辑的应用权限，主要包括"翻模王"、"总模王"、"毕昇"、"一模通"、"临建通"、"模数通"等模块，具体使用取决于用户角色；</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import postApi from '@/api/document/indexApi.js'
import projectFileApi from "@/api/project/file";
import memberPicker from "@/components/memberPicker"
export default {
  name: "permission",
  props: ['ProjectIUID', 'isBridgeMaster', 'close'],
  components: {
    memberPicker,
  },
  data() {
    return {
      memberPickerVisible: false,
      memberList: [],
      memberChecked: [],
      saveLoading:false,
      checkList: [],
      addEditType: '',
      addEditDialogVisble: false,
      fileForm: {
        name: '',
        toprow: '',
        iuid: null
      },
      folderRules: {
        name: [
          { required: true, message: '请输入分组名称', trigger: 'blur' }
        ],
      },
      mod: {},
      treeData: [],
      inherit: true,
      PermissionIllustrateVisible: false,
      PermissionIllustrateType: '',
      permissionData: [],
      currentFolder: '',
      lilterData: '',
      multipleSelection: '',
      deleteData: '',
      treeProps: {
        label: 'name',
      }

    };
  },
  watch: {
    ProjectIUID() {
      this.queryTreeData()
    }
  },
  created() {
    this.queryTreeData()
  },
  methods: {
    //新建分组
    addGroup() {
      this.addEditType = 'add';
      this.fileForm.name = "";
      this.fileForm.iuid = null;
      this.addEditDialogVisble = true;
    },
    //编辑分组
    editGroup(data) {
      this.addEditType = 'edit';
      this.fileForm.name = data.name;
      this.fileForm.toprow = data.toprow;
      this.fileForm.iuid = data.iuid;
      this.addEditDialogVisble = true;
    },
    // 提交分组
    async sureAddEditFolder() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          var formData = new FormData();
          if (this.addEditType != "add") {
            if (this.fileForm.toprow == 1) {
              formData.append("IUID", this.fileForm.iuid);
              formData.append("MainIUID", this.ProjectIUID);
              formData.append("Name", this.fileForm.name);
              var res = await projectFileApi.leftRenameFile(formData);
            } else {
              formData.append("IUID", this.fileForm.iuid);
              formData.append("Name", this.fileForm.name);
              var res = await postApi.post('/api/ProjectManagement/ProjectFileRename', formData);
            }
          } else {
            formData.append("MainIUID", this.ProjectIUID);
            formData.append("Name", this.fileForm.name);
            var res = await projectFileApi.leftAddFile(formData);
          }
          if (res.code == 1) {
            this.addEditDialogVisble = false;
            this.$success(res.msg);
            this.queryTreeData()
          }
        }
      });
    },
    async loadNode(node, resolve) {
      if (node.data.iuid) {
        let form = new FormData()
        form.append('IUID', node.data.iuid)
        let res = await postApi.post('/api/FileAuthorize/GetfilefolderData', form)
        if (res.code == 1) {
          resolve(res.data)
        }
      }
    },
    async queryTreeData(noRefresh) {
      this.treeData = []
      let form = new FormData()
      form.append('ProjectIUID', this.ProjectIUID)
      let res = await postApi.post('/api/FileAuthorize/GetfilefolderData', form)
      if (res.code == 1) {
        this.treeData = res.data
        if (!noRefresh) {
          this.currentFolder = res.data[0]
          this.queryPermissionData(res.data[0])
        }
      }
    },
    async handleAdd() {
      await this.queryMember()
      this.checkList = []
      this.memberPickerVisible = true
    },
    // 获取项目成员
    async queryMember(name) {
      let form = new FormData()
      form.append('IUID', this.currentFolder.iuid)
      if (name) form.append('UserName', name)
      let res = await postApi.post('/api/FileAuthorize/GetAuthorizeUsersData', form)
      if (res.code == 1) {
        this.memberList = res.data.map(item => {
          return {
            ...item,
            disabled: item.isbit
          }
        })
      }
    },
    async saveUserAuthorize(e) {
      if (e.length == 0) {
        this.$error('请选择成员')
        return
      } else {
        let data = {
          IUID: this.currentFolder.iuid,
          UserIDList: e.map(item => item.userID)
        }
        let res = await postApi.post('/api/FileAuthorize/SaveUserAuthorize', data)
        if (res.code == 1) {
          this.$success(res.msg)
          this.queryPermissionData(this.currentFolder)
          this.memberPickerVisible = false
        }
      }
    },
    async saveMember() {
      this.saveLoading = true
      let data = {
        IUID: this.currentFolder.iuid,
        inheritbit: this.inherit,
        data: this.permissionData
      }
      let res = await postApi.post('/api/FileAuthorize/FileAuthorizeOperate', data)
      if (res.code == 1) {
        this.$success(res.msg)
        this.saveLoading = false
        // this.$emit('close')
      }
    },
    cancelCheck(idx) {
      this.checkList.splice(idx, 1)
    },
    // delete

    // 获取文件夹权限
    async queryPermissionData(data) {
      this.permissionData = []
      var res = await postApi.post('/api/FileAuthorize/GetProjectFileAuthorizeData?IUID=' + data.iuid);
      if (res.code == 1) {
        this.permissionData = res.data;
        this.inherit = res.twodata;
      }
    },
    async queryFolderPermission(data) {
      this.currentFolder = data
      this.queryPermissionData(data)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    checkbox_callback(row) {
      if (row.bigBrotherbit == true) {
        return false
      } else {
        return true
      }
    },
    handleChangeLookbit(row, e) {
      if (e == false) {
        row.downloadbit = false
        row.setupbit = false
        row.editbit = false
        row.deletebit = false
        row.authorizebit = false
        row.bimlookbit = false
        row.bimeditbit = false
      }
      if (row.operateType != 'Add') {
        row.operateType = 'Update'
      }
    },
    handleChange(row) {
      if (
        row.downloadbit == true ||
        row.setupbit == true ||
        row.editbit == true ||
        row.deletebit == true ||
        row.authorizebit == true ||
        row.bimlookbit == true ||
        row.bimeditbit == true
      ) {
        row.lookbit = true
      }
      if (row.operateType != 'Add') {
        row.operateType = 'Update'
      }
    },
    async sortFolder(e, type) {
      let form = new FormData()
      form.append('Sort', e.sort)
      form.append('type', type)
      form.append('IUID', e.iuid)
      form.append('MainIUID', this.ProjectIUID)
      var res = await postApi.post('/api/ProjectManagement/ProjectFileSort', form)
      if (res.code == 1) {
        this.$success(res.msg);
        this.queryTreeData(1)
      }
    },
    deleteFolder(e) {
      this.$confirm('删除分类时子目录及文件也将同步删除，请确认操作', '提示', { type: 'warning' }).then(async r => {
        if (e.toprow == 1) {
          let form = new FormData()
          form.append('IUID', e.iuid)
          var res = await postApi.post('/api/ProjectManagement/ProjectFileDelete', form)
        }
        if (e.toprow == 2) {
          let postData = [{ IUID: e.iuid }]
          var res = await postApi.post('/api/ProjectManagement/ProjectFileDetailsDelete', postData)
        }
        if (res.code == 1) {
          this.$success(res.msg);
          this.queryTreeData()
        }
      })
    },
    deletePerson() {
      this.$confirm('确定删除文件夹成员吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.multipleSelection.forEach(element => {
          const index = this.permissionData.findIndex(item => item.iuid === element.iuid)
          if (index !== -1) {
            this.permissionData.splice(index, 1)
          }
        });
        this.saveMember()
      }).catch(() => {
        // Cancel logic here
      });
    },
    renderHeader(h, { column }) {
      console.log(column);
      // h即为cerateElement的简写，具体可看vue官方文档
      var _self = this
      return h('div', [
        h('span', column.label),
        h('i', {
          class: 'el-icon-question',
          style: 'color:rgb(230, 162, 60);margin-left:5px;cursor:pointer',
          on: {
            click: function () {
              _self.PermissionIllustrateType = column.label
              _self.PermissionIllustrateVisible = !_self.PermissionIllustrateVisible
            },
          },
        }),
      ])
    },
    deletePersonRow(index) {
      this.$confirm('确定删除文件夹成员吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.permissionData.splice(index, 1)
        this.saveMember()
      }).catch();
    },
  }
}

</script>
<style lang="scss" scoped>
.tree-box {
  width: 280px;
  overflow-y: auto;
  border-right: 1px solid #e6e6e6;
  max-height: calc(90vh - 120px);
  margin-right: 15px;

  .tree-item {
    width: 100%;
  }

  ::v-deep .is-current {
    &>.el-tree-node__content {
      background-color: #409eff33;
    }
  }

  ::v-deep .el-tree-node {
    width: 100%;

    .operBtn {
      display: none;
      margin-right: 10px;
    }

    &:hover {
      .operBtn {
        display: flex;
      }
    }

  }

}

.PermissionIllustrate p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.PermissionIllustrate {
  width: 720px;
  background: #fff;
  position: absolute;
  top: 70px;
  padding: 15px;
  z-index: 999;
  left: 580px;
  border-radius: 4px;
  border: 1px solid #ddd;
  box-shadow: 3px 4px 7px #ddd;
}
</style>
