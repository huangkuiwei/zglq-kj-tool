<!--  -->
<template>
<div class="flex" style="width: 100%; height: 100%; overflow: hidden;">
  <div class="table-box" style="width:355px">
    <!-- <el-button type="info" style="width: fit-content;" plain icon="el-icon-sort" size="small" @click="toggleExpandAll">展开/折叠</el-button> -->
    <div class="flex ai-center jc-between" style="margin-bottom: 10px;font-weight: bold;">
      {{ $t('base.label.organizationName') }}
    </div>
    <el-table class="dept-table" v-if="refreshTable" row-class-name="dept-row" :show-header="false" highlight-current-row
      :row-style="{ cursor: 'pointer' }" @row-click="handleClickRow" v-loading="!loading" :data="deptList" row-key="id"
      :default-expand-all="isExpandAll" :tree-props="{ children: 'children' }">
      <el-table-column prop="name" show-overflow-tooltip class-name="dept-name" :label="$t('base.button.organizationName')" width="240">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}({{ scope.row.usercount }}人)</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('base.formLabel.operation')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div class="dept-oper flex jc-center" style="height: 25px;">
            <el-tooltip effect="dark" :content="$t('base.button.add')" placement="top">
              <el-button size="small" type="text" icon="el-icon-plus" @click.stop="handleAdd(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('base.button.edit')" placement="top">
              <el-button size="small" type="text" icon="el-icon-edit-outline"
                @click.stop="handleUpdateCorp(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('base.button.delete')" placement="top">
              <el-button size="small" v-if="scope.row.isCorp == false" style="color:#F56C6C" type="text"
                icon="el-icon-delete" @click.stop="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <member-box style="margin-left: 5px;" :currentRow='currentRow' v-if="Number(currentRow.id) || isAdmin" :deptOptions="deptOptions" @loadDept="queryData"
    @addDeptUser="handleAddUser(currentRow)" @updateDeptList="queryData"></member-box>

  <!-- 编辑企业 -->
  <company-dialog :corpId="corpId" opeType="EDIT" @reload="queryData"
    :dialogVisible.sync="companyDialogVisible"></company-dialog>

  <!-- 添加或修改部门对话框 -->
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" width="480px" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="上级部门" prop="childlevel">
        <el-cascader style="width:100%" v-model="form.childlevel" :options="deptOptions"
          :props="{ label: 'name', value: 'childlevel', checkStrictly: 'true', emitPath: false }"
          @change="handleDeptChange"></el-cascader>
      </el-form-item>
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="显示排序" prop="number">
        <el-input-number v-model="form.number" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="部门状态">
        <el-radio-group v-model="form.isstop">
          <el-radio :label="false">正常</el-radio>
          <el-radio :label="true">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="open = false">{{ $t('base.button.cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ $t('base.button.confirm') }}</el-button>
    </div>
  </el-dialog>
  <!-- 成员管理 -->
  <member-picker :dialogVisible.sync="memberPickerVisible"        @submit="saveMember"
               :check-list="checkList"
               :member-list="memberList"
               @queryMember="queryMemberList"
               @cancelCheck="cancelCheck"
               dialog-title="选择成员"></member-picker>
</div>
</template>

<script>
import moment from 'moment'
import memberBox from '@/views/SystemSetting/member.vue'
import postApi from "@/api/document/indexApi.js";
import memberPicker from "@/components/memberPicker/index.vue"
import companyDialog from '@/views/superAdmin/dialog/companyDialog.vue'
export default {
  name: "Dept",
  components: {
    memberPicker,
    memberBox,
    companyDialog
  },
  data() {
    return {
      moment,
      // 遮罩层
      loading: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      corpId: '',
      companyDialogVisible: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,

      // 表单参数
      form: {
        name: '',
        childlevel: '',
        number: '',
        isstop: true,
      },
      row: {},
      // 表单校验
      rules: {
        childlevel: [
          { required: true, message: "上级部门不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        number: [
          { required: true, message: "显示排序不能为空", trigger: "blur" }
        ],
      },

      // 选择组件
      memberPickerVisible: false,
      memberList: [],
      checkList: [],

      // row点击
      currentRow: {},
      isAdmin: false
    };
  },
  async created() {
    this.queryData()

    this.$root.$on('changeLanguage', () => {
      this.queryData()
    });
  },
  methods: {
    handleClickRow(row) {
      this.currentRow = row
    },
    async queryData() {
      let res = await postApi.post('/api/Basedepartment/GetBasedepartmentData')
      if (res.code == 1) {
        if (Array.isArray(res.data)) {
          this.isAdmin = false
          this.currentRow = res.data[0]
          this.deptList = res.data
          this.deptOptions = res.data
        } else {
          this.isAdmin = true
          this.currentRow = res.data
          this.deptList = [res.data]
          this.deptOptions = [res.data]
        }

        this.corpId = res.data.id
      }
    },
    async queryDeptOptions(id) {
      if (id) {
        let form = new FormData()
        form.append('id', id)
        let res = await postApi.post('/api/Basedepartment/GetBasedepartmentData', form)
        if (res.code == 1) {
          if (Array.isArray(res.data)) {
            this.isAdmin = false
            this.deptOptions = res.data
          } else {
            this.isAdmin = true
            this.deptOptions = [res.data]
          }
        }
      } else {
        let res = await postApi.post('/api/Basedepartment/GetBasedepartmentData')
        if (res.code == 1) {
          if (Array.isArray(res.data)) {
            this.isAdmin = false
            this.deptOptions = res.data
          } else {
            this.isAdmin = true
            this.deptOptions = [res.data]
          }
        }
      }
    },
    async handleAddUser(row) {
      await this.queryCheckedList(row.id)
      await this.queryMemberList()
      this.memberPickerVisible = true;
      this.row = row
    },
    async handleAdd(row) {
      await this.queryDeptOptions()
      this.open = true;

      this.$nextTick(() => {
        this.$refs['form'].resetFields()
        this.title = this.$t('base.button.add');
        if (row.id) {
          let data = JSON.parse(JSON.stringify(row))
          this.form.id = null
          this.form.childlevel = data.childlevel
          this.form.name = ''
          this.form.number = 1
          this.form.isstop = false
        }
        console.log(this.form.childlevel);
        this.$forceUpdate()
      })
    },
    handleDeptChange(e) {
      this.form.childlevel = e
    },
    handleUpdateCorp(row) {
      if (row.parentlevel == null) {
        this.companyDialogVisible = true
      } else {
        this.handleUpdate(row)
      }
    },
    async handleUpdate(row) {
      this.title = this.$t('base.button.edit');
      await this.queryDeptOptions(row.id)
      let data = JSON.parse(JSON.stringify(row))
      this.form.id = data.id
      this.form.childlevel = data.parentlevel
      this.form.name = data.name
      this.form.number = data.number
      this.form.isstop = data.isstop
      this.open = true;

    },
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    cancelCheck(idx) {
      this.checkList.splice(idx, 1)
    },
    async queryMemberList(name) {
      let form = new FormData()
      if (name) form.append('username', name)
      let res = await postApi.post('/api/Basedepartment/GetAllUser', form)
      if (res.code == 1) {
        this.memberList = res.data
      }
    },
    async queryCheckedList(id) {
      let form = new FormData()
      form.append('departmentid', id)
      let res = await postApi.post('/api/Basedepartment/GetcheckedUser', form)
      if (res.code == 1) {
        this.checkList = res.data
      }
    },

    async saveMember() {
      let query = { departmentid: this.row.id, userID: this.checkList.map(item => item.userID) }
      let res = await postApi.post('/api/Basedepartment/Setupdepuser', query)
      if (res.code == 1) {
        this.queryData()
        this.$success(res.msg)
        this.memberPickerVisible = false
      }
    },
    handleDelete(row) {
      const h = this.$createElement;
      this.$msgbox({
        type: 'warning',
        title: '警告',
        center: true,
        message: h('div', null, [
          h('div', null, '确认删除此部门吗？'),
          h('div', null, '(此操作不可恢复)')
        ])
      }).then(async () => {
        let form = new FormData()
        form.append('id', row.id)
        var res = await postApi.post("/api/Basedepartment/BasedepartmentDel", form);
        if (res.code == 1) {
          this.queryData()
          if (row.id == row.id) {
            this.currentRow = this.deptList[0]
          }
          this.$success(res.msg);
        }
      })
    },
    submitForm() {
      this.$refs['form'].validate(async (v) => {
        if (v) {
          let form = new FormData()
          if (this.title == this.$t('base.button.edit')) {
            form.append('id', this.form.id)
          }
          form.append('childlevel', this.form.childlevel)
          form.append('name', this.form.name)
          form.append('number', this.form.number)
          form.append('isstop', this.form.isstop)
          let res = await postApi.post('/api/Basedepartment/BasedepartmentAddEdit', form)
          if (res.code == 1) {
            this.queryData()
            this.open = false;
            this.$success(res.msg)
          }

        }
      })
    },
  }
}

</script>

<style scoped>
.dept-row .dept-oper {
  display: none;
}

.dept-row:hover .dept-oper {
  display: flex;
}

.dept-table {
  flex-grow: 1;
  overflow: auto;
}
</style>
