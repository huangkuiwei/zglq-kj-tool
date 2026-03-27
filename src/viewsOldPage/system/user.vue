<template>
  <section class="app-container">
    <div class="tool-bar mb10">
      <el-form ref="queryForm" :model="query" inline>
        <el-form-item prop="username">
          <el-input  v-model="query.username" :placeholder="$t('base.label.name')" clearable></el-input>
        </el-form-item>
        <el-form-item prop="state">
          <el-select v-model="query.state" placeholder="用户状态" clearable >
            <el-option v-for="item in userStates" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="startTime">
          <el-date-picker v-model="query.startTime" value-format="yyyy-MM-dd" type="date" placeholder="开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item prop="endTime">
          <el-date-picker v-model="query.endTime" value-format="yyyy-MM-dd" type="date" placeholder="结束时间"></el-date-picker>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="loadUsers">{{ $t('base.button.query') }}</el-button>
        <el-button type="info" icon="el-icon-refresh" @click="handleQueryReset">{{ $t('base.button.reset') }}</el-button>
      </el-form>
      <el-button v-if="$permitted('btnAddUser')" type="primary" icon="el-icon-plus" @click="handleAddUser">创建用户</el-button>
    </div>

    <el-table :header-cell-style="$thStyle" :data="list" :v-loading="loading" border class="mt10">
      <el-table-column label="用户ID" prop="adminUserId"></el-table-column>
      <el-table-column :label="$t('base.label.name')" prop="username"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == -1" type="danger">禁用</el-tag>
          <el-tag v-else type="success">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" prop="contact"></el-table-column>
      <el-table-column :label="$t('base.button.createTime')" prop="createdTime"></el-table-column>
      <el-table-column :label="$t('base.formLabel.operation')" min-width="150px">
        <template slot-scope="scope">
          <el-button v-if="isPermitted(scope.row, 'btnEditUser')" type="text" icon="el-icon-edit-outline" @click="handleEditUser(scope.row)">编辑信息</el-button>
          <!-- 超级管理员不允许禁用 -->
          <el-button v-if="isPermitted(scope.row, 'btnDisableUser')" type="text" @click="handleDisable(scope.row)"
            :icon="scope.row.state == 0 ? 'el-icon-circle-close' : 'el-icon-circle-check'">
              {{ scope.row.state == 0 ? '停用' : '启用' }}
          </el-button>

          <!-- 超级管理员的密码，只有自己登录后才能修改，不列入权限控制范围内 -->
          <el-button v-if="isPermitted(scope.row, 'btnChangePwd')" type="text" @click="handleChangePwd(scope.row)"> <svg-icon icon-class="password" /> 修改密码</el-button>

          <!-- 超级管理员不需要角色分配功能 -->
          <el-button v-if="!isAdmin(scope.row) && $permitted('btnEditRoles')" type="text" @click="handleEditRole(scope.row)"> <svg-icon icon-class="role" /> 分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-if="total > 0"
      class="mt10"
      :total="total"
      :current-page.sync="query.page"
      :page-size.sync="query.size"
      :page-sizes="[10, 20, 50, 100]"
      @current-change="loadUsers"
      @size-change="handleSizeChanged"
      layout="total, sizes, prev, pager, next">
    </el-pagination>

    <el-dialog :title="editFormTitle" :visible.sync="editFormVisible">
        <el-alert
          v-if="editModel.adminUserId == 0"
          title="新创建的账号，其默认密码是：123456"
          type="success"
          :closable="false"
          class="pwd-alert"
        ></el-alert>
      <el-form ref="editForm" :model="editModel" :rules="rules" label-position="right" label-width="120px">
        <el-form-item :label="$t('base.label.name')" prop="username">
          <el-input v-model="editModel.username" placeholder="不超过 15 个字" :readonly="editModel.adminUserId > 0"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="contact">
          <el-input v-model="editModel.contact"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button :loading="saving" type="default" @click="editFormVisible = false">{{ $t('base.button.cancel') }}</el-button>
        <el-button :loading="saving" type="primary" @click="handleSave">{{ $t('base.button.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!-- 修改密码 -->
    <el-dialog :title="`修改用户 ${userOfChanging.username} 的密码`" :visible.sync="changePwdDialogVisible">

      <el-form ref="changePwdForm" :model="pwdModel" :rules="pwdRules" label-position="right" label-width="120px">
        <el-form-item label="新密码：" prop="password">
          <el-input v-model="pwdModel.password" :placeholder="$t('base.button.inputPasswordOf6-20Digits')" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="confirm">
          <el-input v-model="pwdModel.confirm" :placeholder="$t('base.button.inputPasswordOf6-20Digits')" type="password"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="default" :loading="pwdSaving" @click="changePwdDialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
        <el-button type="primary" :loading="pwdSaving" @click="handleSavePwd">{{ $t('base.button.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色"
      :visible.sync="editRoleDialogVisible"
      v-loading.fullscreen.lock="rolesLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
    >
      <div v-if="roles.length > 0">
        <el-checkbox-group v-model="selectedRoleIds">
          <el-checkbox class="role-item" v-for="r in roles" :label="r.roleId" :key="r.roleId" size="medium">{{ r.name }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div v-else>
        <span>目前还没有角色可供分配，点击<router-link to="/system/role">去创建角色</router-link></span>
      </div>

      <div slot="footer">
        <el-button type="default" :loading="rolesSaving" @click="editRoleDialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
        <el-button type="primary" :loading="rolesSaving" @click="handleSaveRoles">{{ $t('base.button.confirm') }}</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
import { mapGetters } from 'vuex'

const emptyUser = {
  adminUserId: 0,
  username: '',
  contact: '',
  password: '',
  state: 0,
}
const rules = {
  username: [
    { required: true, message: '姓名不能为空' },
    { pattern: /^[\da-zA-Z_\u4e00-\u9fa5]{1,20}$/, message: '姓名只能用 1-20 位字母、数字或汉字组成' }
  ]
}

export default {
  data() {
    return {
      list: [],
      userStates: [],
      loading: false,
      total: 0,
      query: {
        page: 1,
        size: 10,
        username: '',
        state: '',
        startTime: '',
        endTime: '',
      },

      editFormVisible: false,
      saving: false,
      editFormTitle: '',
      editModel: Object.assign({}, emptyUser),
      rules: rules,
      editingUser: null,

      roles: [],
      rolesLoading: false,
      editRoleDialogVisible: false,
      rolesSaving: false,
      selectedRoleIds: [],

      changePwdDialogVisible: false,
      pwdSaving: false,
      userOfChanging: {},
      pwdModel: {
        userId: 0,
        password: '',
        confirm: '',
      },
      pwdRules: {
        password: [
          { required: true, message: '密码不能为空' },
          { min: 6, message: '密码长度不能低于 6 位' },
          { max: 20, message: '密码长度不能多于 20 位' },
        ],
        confirm: [
          { required: true, message: '密码不能为空' },
          { min: 6, message: '密码长度不能低于 6 位' },
          { max: 20, message: '密码长度不能多于 20 位' },
        ]
      }
    }
  },

  computed: {
    ...mapGetters([
      'user'
    ])
  },

  methods: {
    selfLogin(u) {
      return u.adminUserId == this.user.adminUserId
    },

    isAdmin(user) {
      return user.username === 'admin'
    },

    isPermitted(user, btnId) {
      const { isAdmin } = this
      // 对于超级管理员信息，非超级管理员不允许修改
      if (isAdmin(user)) {
        return false
      }
      return this.$permitted(btnId)
    },

    getQueryParams() {
      var q = Object.assign({}, this.query)
      if (q.startTime) {
        q.startTime = q.startTime + ' 00:00:00'
      }
      if (q.endTime) {
        q.endTime = q.endTime + ' 23:59:59'
      }
      return q
    },

    async loadUsers() {
      this.$progress.start()
      this.loading = true
      const query = this.getQueryParams()
      const res = await userApi.getList(query)
      this.$progress.done()

      this.loading = false
      this.total = res.data.total
      this.list = res.data.list
    },

    handleQueryReset() {
      this.$refs.queryForm.resetFields()
      this.loadUsers()
    },

    handleSizeChanged() {
      this.query.page = 1
      this.loadUsers()
    },

    handleAddUser() {
      const m = Object.assign({}, emptyUser)
      this.editModel = m
      this.editFormTitle = '创建用户'
      this.editFormVisible = true
      this.$refs.editForm.clearValidate()
    },

    handleEditUser(user) {
      this.editingUser = user
      this.editModel = Object.assign({}, user)
      this.editFormTitle = '修改用户信息'
      this.editFormVisible = true
      this.$refs.editForm.clearValidate()
    },

    async handleEditRole(user) {
      this.selectedUser = user
      // 设置角色时，需要实时获取当前所有角色
      // 列表，和当前用户所具有的角色列表
      this.rolesLoading = true
      this.$progress.start()
      const roles = (await roleApi.getAll()).data || []
      const relations = (await roleApi.getUserRelations(user.adminUserId)).data || []
      this.$progress.done()
      this.rolesLoading = false

      this.roles = roles
      this.selectedRoleIds = relations.map(r => r.roleId)
      this.editRoleDialogVisible = true
    },

    handleDisable(user) {
      let data = Object.assign({}, user)
      data.state = data.state == 0 ? -1 : 0
      userApi.updateUser(data).then(res => {
        if (res.success) {
          this.$success(res.msg)
          user.state = data.state
        } else {
          this.$error('操作失败，请联系管理员')
        }
      })
    },

    handleChangePwd(user) {
      this.userOfChanging = user
      this.pwdModel.userId = user.adminUserId
      this.pwdModel.password = ''
      this.pwdModel.confirm = ''
      this.changePwdDialogVisible = true
      setTimeout(() => {
        this.$refs.changePwdForm.clearValidate()
      }, 0);
    },

    handleSave() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const postData = Object.assign(this.editModel)
          const request = postData.adminUserId > 0 ? userApi.updateUser : userApi.addUser
          this.saving = true
          this.$progress.start()
          request(postData).then(res => {
            this.$progress.done()
            this.saving = false
            if (res.success) {
              this.editFormVisible = false
              this.$success(res.msg);
              this.loadUsers()
            } else {
              this.$error(res.message || '提交失败，请联系管理员')
            }
          })
        }
      })
    },

    handleSavePwd() {
      this.$refs.changePwdForm.validate(async (valid) => {
        if (valid) {
          const postData = Object.assign({}, this.pwdModel)
          if (postData.password !== postData.confirm) {
            this.$error('两次输入的密码不一致')
          } else {
            this.pwdSaving = true
            this.$progress.start()
            const res = await userApi.updatePwd(postData.userId, postData.password)

            this.$progress.done()
            this.pwdSaving = false
            if (res.success) {
              this.$success(res.msg)
              this.changePwdDialogVisible = false
            } else {
              this.$error('密码修改失败，请联系管理员')
            }
          }
        }
      })
    },

    async handleSaveRoles() {
      this.rolesSaving = true
      const { success } = await roleApi.updateUserRelations(this.selectedUser.adminUserId, this.selectedRoleIds)
      this.rolesSaving = false
      if (success) {
        this.editRoleDialogVisible = false
        this.$success(res.msg);
      } else {
        this.$error('保存失败，请稍后重试')
      }
    },

  }, // end methods

  async mounted() {
    const res = await commonApi.getUserStates()
    this.$log.debug('[info] user states', res)
    this.userStates = res.data

    this.loadUsers()
  }
}
</script>

<style lang="scss">
  .role-item {
    display: inline-block;
    width: 20%;
    margin-left: 0 !important;
    padding: 8px 0;
  }
  .pwd-alert {
    padding-left: 48px;
    margin-bottom: 16px;
  }
</style>
