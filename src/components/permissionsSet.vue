<template>
  <div class="perssionDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal="true" title="权限设置" :visible.sync="permissionDialogVisble" :before-close="closeDialog" width="1000px" style="height:100%">
      <div style="padding-bottom:10px; display: flex; align-items: center">
        <el-button type="success" icon="el-icon-plus" size="mini" @click="authorizeNewPerson">授权新成员</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletePerson(multipleSelection.map(i => i.userName))">移除成员</el-button>

        <el-select style="margin-left: 10px" size="mini" v-if="isBridgeMaster" v-model="folderIuid" @change="onFolderChange">
          <el-option v-for="item of bridgeMasterFolders" :key="item.iuid" :value="item.iuid" :label="item.fileName"></el-option>
        </el-select>
      </div>
      <el-table ref="multipleTable" :data="fileData" border :height="'calc(85vh - 250px)'" tooltip-effect="light" style="width: 100%" :header-cell-style="$thStyle" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :selectable='checkbox_callback' align="center" width="55">
        </el-table-column>
        <el-table-column prop="authorizename" :label="$t('base.button.memberType')" align="center" width="100">
        </el-table-column>
        <el-table-column prop="userName" label="成员" align="center" width="90">
        </el-table-column>
        <el-table-column prop="address" show-overflow-tooltip label="权限" :render-header="renderHeader">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.lookbit" @change="change(scope.row)" :disabled="scope.row.bigBrotherbit">{{ $t('base.button.view') }}</el-checkbox>
            <el-checkbox v-model="scope.row.downloadbit" @change="change(scope.row)" :disabled="scope.row.bigBrotherbit">{{ isBridgeMaster ? '签出' : '下载' }}</el-checkbox>
            <el-checkbox v-model="scope.row.setupbit" @change="change(scope.row)" :disabled="scope.row.bigBrotherbit">{{ isBridgeMaster ? '签入' : '创建' }}</el-checkbox>
            <el-checkbox v-model="scope.row.editbit" @change="change(scope.row)" :disabled="scope.row.bigBrotherbit">{{ $t('base.button.edit') }}</el-checkbox>
            <el-checkbox v-model="scope.row.movebit" @change="change(scope.row)" :disabled="scope.row.bigBrotherbit">移动复制</el-checkbox>
            <el-checkbox v-model="scope.row.deletebit" @change="change(scope.row)" :disabled="scope.row.bigBrotherbit">{{ $t('base.button.delete') }}</el-checkbox>
            <el-checkbox v-model="scope.row.authorizebit" @change="change(scope.row)" :disabled="scope.row.bigBrotherbit">授权</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="address" show-overflow-tooltip align="center" width="80">
          <template slot-scope="scope" v-if="!scope.row.bigBrotherbit">
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deletePersonRow(scope.$index, scope.row)" style="background:none;color:#F56C6C;border:none;cursor:pointer;font-size:16px">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="padding-top:16px;display:flex;justify-content:space-between">
        <div style="line-height:28px;flex:1;text-align:left" v-if="operationType != 'leftFile'">
          <el-checkbox :value="inheritbit" @input="inheritbit = $event">允许上级文件夹管理</el-checkbox>
        </div>
        <div style="height:28px;flex:1">
          <el-button @click="closeDialog" size="mini" style="width: 80px; margin-left: 5px">{{ $t('base.button.cancel') }}</el-button>
          <el-button type="primary" size="mini" @click="sureDeleteFolder" :loading="submitLoading" style="width: 88px">确认</el-button>
        </div>
      </div>
      <div class="PermissionIllustrate" v-if="PermissionIllustrateVisible">
        <div style="border-bottom:1px solid #eee;padding:5px 10px 10px;display: flex;align-items: center;justify-content: space-between;">
          <span>权限说明</span>
          <el-button type="text" size="mini" icon="el-icon-close" @click="PermissionIllustrateVisible = false"></el-button>
        </div>
        <div style="padding:10px">
          <p> 权限等级从低到高依次是: 查看、下载、新建、编辑、删除、授权。</p>
          <p> 权限采用正向继承的方式，即子文件及子文件夹会自动继承来自父文件夹得权限；如果对子文件或者子文件夹得权限进行了修改，则不影响父文件夹的权限。权限范围如下：</p>
          <p> 查看：在线查看文件；</p>
          <p> 下载：下载文件、分享文件；</p>
          <p> 新建：上传文件、新建文件夹、更新文件版本；</p>
          <p> 编辑：重命名文件和文件夹、设置文件默认版本；</p>
          <p> 删除：删除文件和文件夹、移动文件和文件夹；</p>
          <p> 授权：增删授权人员、编辑授权人员的权限。</p>
        </div>

      </div>
    </el-dialog>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal="true" title="授权新人员" :visible.sync="personDialogVisble" :before-close="closePersonDialog" width="50%" style="height:100%">
      <el-row class="permission">
        <el-col :span="12">
          <div class="selectedPeople">
            <div style="line-height: 40px;">新增人员</div>
            <el-tag :key="index" v-for="(tag, index) in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
              {{ tag.userName }}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="padding:0 10px;">
            <div style="line-height: 40px;">项目人员</div>
            <div>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            </div>
            <div class="list_radio">
              <el-checkbox-group v-model="checkCodeList" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="(item, index) in PersonData" :key="index" :label="item" :disabled="item.isbit" style="display:block;margin: 5px 0;" @change="handelChange($event, index)">
                  <el-avatar shape="square" size="small" :src="squareUrl" style="vertical-align: middle;margin-right: 8px;"></el-avatar> {{ item.userName }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button type="primary" size="mini" @click="surePerson">确定({{ num }}/100)</el-button>
        <el-button @click="closePersonDialog" size="mini" style="width: 80px; margin-left: 5px">{{ $t('base.button.cancel') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import documentFileApi from '@/api/document/indexApi.js'
import conversionApi from '@/api/project/file'
import { createNamespacedHelpers } from 'vuex'
export default {
  props: {
    permissionDialogVisble: {
      type: Boolean,
      default: false,
    },
    //主文件数据
    fileData: {
      type: Array,
      default: null,
    },
    fileIUID: {
      type: String,
    },
    isZskSet: {
      type: Boolean
    },
    operationType: {
      type: String,
      default: null,
    },
    inheritbit: {
      type: Boolean,
      default: false
    },
    isBridgeMaster: {
      type: Boolean,
      default: false
    },
    bridgeMasterFolders: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    fileData: {
      deep: true, // 深度监听
      immediate: true,
      handler(newVal, oldVal) {
        if (this.folderIuid) {
          this.$set(this.allFolderPermissionSet, this.folderIuid, newVal)
        }
      },
    },
    permissionDialogVisble(value) {
      if (value) {
        if (this.bridgeMasterFolders.length) {
          this.folderIuid = this.bridgeMasterFolders[0].iuid
        }
      } else {
        this.allFolderPermissionSet = {}
      }
    }
  },
  data() {
    return {
      multipleSelection: [],
      checkbox: [],
      checkCodeList: [],
      personDialogVisble: false,
      PersonData: [],
      UserName: '',
      lilterData: [],
      selectPer: [],
      personMultipleSelection: [],
      disabled: null,
      backData: [],
      deleteData: [],
      PermissionIllustrateVisible: false,
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      resource: '',
      desc: '',
      checkAll: false,//全选
      isIndeterminate: false,//全选
      ruleForm: {
        resource: '',
        desc: '',
      },
      squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      num: 0,
      folderIuid: '',
      allFolderPermissionSet: {},
      submitLoading: false
    }
  },
  methods: {
    onFolderChange($event) {
      if (this.allFolderPermissionSet[$event]) {
        this.$emit('update:fileData', this.allFolderPermissionSet[$event])
      } else {
        this.$emit('onFolderSelectChange', $event)
      }
    },

    sureDeleteFolder() {
      this.backData = this.fileData.filter((i) => {
        let flag = false
        if (i.operateType != '') flag = true
        return flag && i
      })
      this.backData = this.deleteData.concat(this.backData)
      this.submitData()
    },
    async submitData() {
      if (this.isBridgeMaster) {
        this.submitLoading = true

        for (const key of Object.keys(this.allFolderPermissionSet)) {
          let paramsData = JSON.parse(JSON.stringify(this.allFolderPermissionSet[key])).filter(item => item.authorizename !== '负责人' && item.authorizename !== '创建人')

          paramsData.forEach(item => {
            item.operateType = ''
            item.delbit = item.deletebit
            item.deletebit = undefined
          })

          let postData = {
            IUID: key,
            inheritbit: (typeof this.inheritbit === 'boolean') ? this.inheritbit : true,
            data: paramsData,
          }

          if (this.isZskSet) {
            var res = await conversionApi.zskPermissionSubmit(postData)
          } else if (!this.isZskSet && this.operationType == '') {
            var res = await conversionApi.permissionSubmit(postData)
          } else if (!this.isZskSet && this.operationType == 'leftFile') {
            var res = await conversionApi.leftFilePermissionSubmit(postData)
          }

          if (res.code == 1) {
            if (this.operationType == 'leftFile') {
              this.$emit('surePermission', 1)
            } else {
              this.$emit('surePermission', 0)
            }
          }
        }

        this.submitLoading = false
        this.$emit('update:permissionDialogVisble', false)

        this.$message({
          message: '操作成功',
          type: 'success',
        })

        return
      }

      let paramsData = JSON.parse(JSON.stringify(this.fileData)).filter(item => item.authorizename !== '负责人' && item.authorizename !== '创建人')
      paramsData.forEach(item => {
        item.operateType = ''
        item.delbit = item.deletebit
        item.deletebit = undefined
      })

      let postData = {
        IUID: this.isBridgeMaster ? this.folderIuid : this.fileIUID,
        inheritbit: (typeof this.inheritbit === 'boolean') ? this.inheritbit : true,
        data: paramsData,
      }

      if (this.isZskSet) {
        var res = await conversionApi.zskPermissionSubmit(postData)
      } else if (!this.isZskSet && this.operationType == '') {
        var res = await conversionApi.permissionSubmit(postData)
      } else if (!this.isZskSet && this.operationType == 'leftFile') {
        var res = await conversionApi.leftFilePermissionSubmit(postData)
      }

      if (res.code == 1) {
        this.$emit('update:permissionDialogVisble', false)
        if (this.operationType == 'leftFile') {
          this.$emit('surePermission', 1)
        } else {
          this.$emit('surePermission', 0)
        }

        this.$message({
          message: res.msg,
          type: 'success',
        })
      }
    },
    checkbox_callback(row) {
      if (row.bigBrotherbit == true) {
        return false
      } else {
        return true
      }
    },
    closeDialog() {
      this.$emit('update:permissionDialogVisble', false)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    renderHeader(h, { column }) {
      // h即为cerateElement的简写，具体可看vue官方文档
      var _self = this
      return h('div', [
        h('span', column.label),
        h('i', {
          class: 'el-icon-question',
          style: 'color:rgb(230, 162, 60);margin-left:5px;cursor:pointer',
          on: {
            click: function () {
              _self.PermissionIllustrateVisible = true
            },
            mouseout: function () {
              // _self.PermissionIllustrateVisible = false
            },
          },
        }),
      ])
    },
    //授权新人员
    authorizeNewPerson() {
      this.personDialogVisble = true
      this.$emit('update:permissionDialogVisble', false)
      if (!this.isZskSet && this.operationType == '') {
        this.queryPerson(0)
      } else if (this.isZskSet) {
        this.queryPerson(1)
      } else if (!this.isZskSet && this.operationType == 'leftFile') {
        this.queryPerson(2)
      }

    },
    async queryPerson(i) {
      if (i == 0) {
        var url = '/api/FileAuthorize/GetAuthorizeUsersData?IUID=' + this.fileIUID
      } else if (i == 1) {
        var url = '/api/KnowledgeBase/GetKnowledgeBaseAuthorizeUsersData?IUID=' + this.fileIUID
      } else {
        var url = '/api/FileAuthorize/GetProjectFileAuthorizeUsersData?IUID=' + this.fileIUID
      }
      var res = await documentFileApi.post(url)
      this.PersonData = res.data
      this.PersonData = this.PersonData.map((Element2) => {
        Element2.isChecked = false;
        Element2.isbit = false;
        this.fileData.forEach((Element1) => {
          if (Element2.userName === Element1.userName) {
            Element2.isbit = true
          }
        })
        return Element2
      })
    },
    closePersonDialog() {
      this.personDialogVisble = false
      this.$emit('update:permissionDialogVisble', true)
    },
    handelChange(e, index) {
      if (e == true) {
        this.PersonData[index].isChecked = true
      } else {
        this.PersonData[index].isChecked = false
      }
      this.personMultipleSelection = this.checkCodeList;
      this.dynamicTags = this.checkCodeList;
      this.num = this.dynamicTags.length;
    },
    surePerson() {
      for (let k in this.personMultipleSelection) {
        this.fileData.push({
          iuid: '',
          authorizename: '成员',
          mainIUID: '',
          lookbit: true,
          downloadbit: true,
          setupbit: true,
          movebit: false,
          editbit: false,
          deletebit: false,
          authorizebit: false,
          userID: this.personMultipleSelection[k].userID,
          userName: this.personMultipleSelection[k].userName,
          ddUserAvatar: '',
          bigBrotherbit: false,
          operateType: 'Add',
        })
      }
      this.personDialogVisble = false
      this.$emit('update:permissionDialogVisble', true)
      this.personMultipleSelection = []
      this.dynamicTags = []
      this.checkCodeList = []
      this.num = 0;
    },
    //删除
    deletePersonRow(index, row) {
      this.lilterData.push(this.fileData[index])
      if (row.operateType != 'Add') {
        row.operateType = 'Delete'
        this.deleteData.push(row)
      }
      this.fileData.splice(index, 1)
    },
    deletePerson(idArray) {
      this.lilterData = this.multipleSelection
      for (let k in this.lilterData) {
        this.lilterData[k].operateType = 'Delete'
        this.deleteData = this.deleteData.concat(this.lilterData[k])
      }
      this.$emit('choseItem', idArray)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    change(row) {
      if (row.downloadbit == true || row.movebit == true || row.deletebit == true) {
        row.lookbit = true
      }
      if (row.operateType != 'Add') {
        row.operateType = 'Update'
      }
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      this.num = this.dynamicTags.length;
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },

    //全选
    handleCheckAllChange(val) {
      if (this.checkAll) {
        this.PersonData.forEach(item => {
          if (item.isbit == false && item.isChecked == false) {
            this.checkCodeList.push(item)
          }
        })
        this.PersonData.map(i => {
          i.isChecked = true
        })
      } else {
        this.checkCodeList = []
        this.PersonData.map(i => {
          i.isChecked = false
        })
      }
      this.dynamicTags = this.checkCodeList;
      this.personMultipleSelection = this.checkCodeList
      this.isIndeterminate = false;
      this.num = this.dynamicTags.length;
    },
    handleCheckedCitiesChange(value) {
      let PersonData = value.length
      this.checkAll = PersonData === this.PersonData.length
      // this.isIndeterminate = PersonData > 0 && PersonData < this.PersonData.length
    },
  },
}
</script>
<style scoped>
.el-checkbox {
  margin-right: 15px !important;
}

.PermissionIllustrate p {
  margin: 0;
  line-height: 24px;
}

.PermissionIllustrate {
  width: 50%;
  background: #fff;
  position: absolute;
  top: 160px;
  padding: 15px;
  z-index: 99;
  left: 140px;
  border-radius: 4px;
  border: 1px solid #ddd;
  box-shadow: 3px 4px 7px #aaa;
}

/* .PermissionIllustrate::before {
  content: "";
  width: 0;
  height: 0;
  border: 20px solid;
  position: absolute;
  top: -40px;
  left: 20px;
  border-color: transparent transparent white;
}
.PermissionIllustrate::after {
  content: "";
  width: 0;
  height: 0;
  border: 20px solid;
  position: absolute;
  top: -38px;
  left: 20px;
  border-color: transparent transparent white;
} */
</style>
<style scoped>
.el-tooltip__popper {
  max-width: 20% !important;
}

.perssionDialog .el-dialog {
  height: calc(85vh - 50px);
}

/* .perssionDialog .el-dialog__body .selectedPeople {
  height: calc(100% - 150px);
  overflow: hidden;
  overflow-y: auto;
} */
.perssionDialog .el-dialog__body {
  height: calc(100% - 130px);
  overflow: hidden;
  overflow-y: auto;
}

.permission .el-tag+.el-tag {
  margin-left: 10px;
  margin-bottom: 6px;
  float: left;
}

.el-tag+.el-tag {
  margin-left: 5px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.el-tag {
  margin-bottom: 6px;
  margin-left: 10px;
}

.selectedPeople {
  min-height: 300px;
  overflow: auto;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.list_radio .formRadio {
  line-height: 40px;
}

.perssionDialog .el-checkbox {
  display: inline-block;
  /* line-height: 40px; */
  /* margin-left: 25px; */
}
</style>
