<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="20%">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-form">
        <el-form-item v-if="data.typeName == '人员'" label="角色成员：">
          <el-input v-model="form.name" disabled>
            <el-button slot="append" icon="el-icon-plus" @click="checkPerson"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item v-else this.data.typeName label="名称：" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述：" prop="desc">
          <el-input v-model="form.desc" resize="none" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button class="pull-right" type="primary" @click="submitForm()">{{ $t('base.button.confirm') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-dialogDrag title="选择角色成员" :close-on-click-modal="false" width="425px" :visible.sync="companyMemberDialogVisible">
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="companyMemberChecked" class="select-person-container">
        <div style="padding: 0px 8px; margin: 0px; display:flex; align-items: center; height: 30px" v-for="(item, index) in companyPersonData">
          <el-checkbox class="person-option" style="display:block;margin-top:10px" :value="item.userId" :label="item.userId" :key="index">{{ item.userName }}</el-checkbox>
        </div>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleCheckCompanyMember" size="small">{{ $t('base.button.cancel') }}</el-button>
        <el-button type="primary" @click="confirmCheckCompanyMember" size="small">{{ $t('base.button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import postApi from '@/api/document/indexApi.js'
export default {
  data() {
    return {
      dialogVisible: false,
      title: '',
      form: {
        name: '',
        desc: ''
      },
      rules: {
        name: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }],
        desc: [{
          required: false,
          message: '请输入描述',
          trigger: 'blur'
        }]
      },
      isEdit: false,
      ParentID: '',
      parentName: '',
      data: {},
      companyPersonData: [],
      companyMemberDialogVisible: false,
      companyMemberChecked: [],
    }
  },
  methods: {
    /**
     * @description 打开弹窗
     * @param { Boolean } isEdit 是否是修改状态 true 修改 / false 新增
     * @param { String } parentId 父级id,新增时默认选中父级时使用
     * @param { Object } data 表单数据，编辑时使用
     */
    async openDialog(isEdit, parentId, data) {
      this.isEdit = isEdit
      this.ParentID = parentId
      if (!isEdit) {
        this.data.ParentID = data.ID;
        this.data.ID = "";
      } else {
        this.data.ParentID = data.ParentID;
        this.data.ID = data.ID;
      }
      this.parentName = (!isEdit) ? data.RoleName : '';
      this.title = isEdit ? this.$t('base.button.edit') : this.$t('base.button.add')
      if (data.typeName == '专业') {
        this.title += isEdit ? '专业' : '角色';
        this.data.typeName = isEdit ? '专业' : '角色';
      } else if (data.typeName == '角色') {
        this.title += isEdit ? '角色' : '人员';
        this.data.typeName = isEdit ? '角色' : '人员';
      }
      this.initFormData()
      if (!isEdit && this.data.typeName == '人员') { // 直接添加人员
        await this.checkPerson();
        this.companyMemberChecked = data.children.map(item => item.ID)
      } else this.dialogVisible = true
      if (this.isEdit) {
        this.$nextTick(() => {
          this.form.name = data.RoleName;
        })
      }
    },
    // 初始化表单数据
    initFormData() {
      this.form = {
        name: '',
        desc: ''
      }
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          //         const formData = JSON.parse(JSON.stringify(this.form))
          var formData = {};
          formData.RoleName = this.form.name;
          formData.desc = this.form.desc;
          formData.ParentID = this.data.ParentID;
          formData.typeName = this.data.typeName;
          formData.parentName = this.parentName;
          formData.users = this.form.users;
          formData.ID = this.data.ID;
          if (this.isEdit) {
            this.$emit('editData', formData)
          } else {
            this.$emit('addData', formData)
          }
          this.closeDialog()
        }
      })
    },
    // 关闭当前弹窗
    closeDialog() {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    async checkPerson() {
      this.companyMemberChecked = [];
      //查询企业内部人员
      var res = await postApi.get('/api/WebAccount/QueryCompanyPerson')
      if (res.code === 1) {
        this.companyPersonData = res.data
        this.companyMemberDialogVisible = true
      }
    },
    cancleCheckCompanyMember() {
      this.companyMemberChecked = []
      this.companyMemberDialogVisible = false
    },
    confirmCheckCompanyMember() {
      this.companyMemberDialogVisible = false
      let query = {
        RoleId: this.data.ParentID,
        UserList: this.companyMemberChecked,
        typeName: this.data.typeName
      }
      this.$emit('addData', query)
      return
      var users = []
      this.form.name = "";
      this.companyMemberChecked.forEach((item) => {
        var checkedUser = this.companyPersonData.find((e) => {
          return e.userId === item
        })
        if (checkedUser !== undefined) {
          if (users.filter(item => item.UserID == checkedUser.userId).length == 0) {
            users.push({
              UserID: checkedUser.userId,
              UserName: checkedUser.userName
            });
            // this.form.name += checkedUser.userName + ";"
          }
        }
      })
      this.form.users = users;
      this.companyMemberDialogVisible = false
      var formData = {};
      formData.RoleName = this.form.name;
      formData.desc = this.form.desc;
      formData.ParentID = this.data.ParentID;
      formData.typeName = this.data.typeName;
      formData.parentName = this.parentName;
      formData.users = this.form.users;
      formData.ID = "";
      this.$emit('addData', formData)
    },
  }
}
</script>
<style scoped>
.pull-right {
  float: right
}
</style>
