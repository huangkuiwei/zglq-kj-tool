<!--  -->

<template>
  <div class="app-container">
    <el-divider direction='horizontal' content-position="left">菜单权限配置</el-divider>
    <el-row :gutter="10" style="margin-bottom: 15px;">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">{{ $t('base.button.create')
        }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-check" size="mini" @click="selectAll(menuData)">{{
          $t('base.button.allPick') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
    </el-row>
    <el-table v-if="refreshTable" :header-cell-style="$thStyle" stripe cell-class-name="cellStyle" v-loading="!loading"
      :height="'calc(100vh - 220px)'" :data="menuData" row-key="id" :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children' }">
      <!-- <el-table-column type="selection" align="center"></el-table-column> -->
      <el-table-column width="100">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isselect"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="项"></el-table-column>
      <el-table-column align="center" :label="$t('base.label.type')">

      </el-table-column>
      <el-table-column prop="id" align="center" label="排序"></el-table-column>
      <el-table-column prop="code" align="center" label="编码"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="">编辑</el-button>
          <el-button type="text" size="small" @click="">添加</el-button>
          <el-button type="text" size="small" @click="deleteMenu(scope.row)">{{ $t('base.button.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" style="width: 250px;margin: 15px auto;display: block;" @click="updateMenu">{{
      $t('base.button.save') }}</el-button>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-width="100px">
        <el-form-item label="上级结构" prop="childlevel">
          <el-cascader style="width:100%" v-model="form.childlevel" :options="menuOptions"
            :props="{ label: 'name', value: 'childlevel', checkStrictly: 'true', emitPath: false }"
            @change="handleMenuChange"></el-cascader>
        </el-form-item>
        <el-form-item label="被控项名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="被控项编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="显示排序" prop="number">
          <el-input-number v-model="form.number" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="被控项类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">功能</el-radio>
            <el-radio :label="3">按钮</el-radio>
          </el-radio-group>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('base.button.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('base.button.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import postApi from "@/api/document/indexApi.js";

export default {
  name: "menu",
  components: {},
  data() {
    return {
      corpId: '',
      moment,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      menuData: [],
      // 部门树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        menuName: undefined,
        status: undefined
      },
      menuId: '',
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级部门不能为空", trigger: "blur" }
        ],
        menuName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示排序不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
    };
  },
  computed: {
    token() {
      return localStorage.getItem('adminToken') || ''
    }
  },
  async created() {
    this.querCorp()
  },
  methods: {
    async querCorp() {
      let res = await postApi.post('/api/Adminsetup/GetCorptop', null, process.env.BASE_API, this.token)
      if (res.code == 1) {
        this.corpId = res.data.CorpId
        this.queryData()

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
    // api/Basemenu/BasementDel
    async deleteMenu(row) {
      this.$confirm('确认删除菜单?', '提示', {
        type: 'warning'
      }).then(async () => {
        let form = new FormData()
        form.append('id', row.id)
        let res = await postApi.post('/api/Basemenu/BasementDel', form, process.env.BASE_API, this.token)
        if (res.code == 1) {
          this.$success(res.msg)
          this.queryData()
        }
      }).catch(() => {
      });
    },
    resetQuery() { },
    handleAdd() {
      this.open = true;
      this.title = this.$t('base.button.add')
    },
    handleUpdate() {
      this.open = true;
      this.title = this.$t('base.button.edit')
    },
    handleMenuChange(e) {
      this.form.childlevel = e
    },
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    selectAll(data) {
      data.forEach(item => {
        item.isselect = true;
        if (item.children) {
          this.selectAll(item.children)
        }
      })
    },
    submitForm() { },
    cancel() { },
    async updateMenu() {
      let arr = JSON.parse(JSON.stringify(this.menuData))
      arr = this.concatChild(arr).filter(item => item.isselect == true).map(item => item.id)
      // 9641b7a7-c622-443d-91da-5f9dce33033a
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
    }
  }
}

</script>

<style scoped lang="scss">
::v-deep .el-table {
  td {
    &.cellStyle {
      padding: 7px 0;
    }
  }
}

.bold {
  font-weight: 500;
}
</style>
