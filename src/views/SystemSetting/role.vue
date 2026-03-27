<template>
  <div class="flex">
    <div class="role-list flex column ai-center">
      <el-input v-model="roleName" :placeholder="$t('base.label.inputRoleName')" size="small" clearable @change="handleSearch"></el-input>
      <el-button type="primary" size="mini" style="margin: 10px 0" @click="addRole">{{ $t('base.label.addRole') }}</el-button>
      <div class="role-item" :class="{ act: role.act }" v-for="(role, idx) in roleList" @click="chooseRole(idx)"
        :key="role.id">
        <div class="flex ai-center jc-between">
          <div>{{ role.roleName }}</div>

          <template v-if="role.editable">
            <div v-if="role.roleName != '普通用户'">
              <el-button type="text" size="mini" @click.stop="roleEdit(role)">{{
                  $t("base.button.edit")
                }}</el-button>
              <el-button type="text" size="mini" style="color: #f56c6c" @click.stop="roleDelete(role)">{{
                  $t("base.button.delete") }}</el-button>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="permission-list">
      <template v-for="(menu, idx) in menuData">
        <div v-if="idx <= 2" class="list-item flex ai-center">
          <div class="menuCol">
            <el-checkbox v-model="menu.isselect" :indeterminate="isIndeterminate(menu)"
              @change="chooseB(...arguments, menu)" :label="menu.name">{{ menu.name
              }}</el-checkbox>
          </div>
          <div style="width: 100%;">
            <div v-for="page in menu.children" :key="page.id" class="flex pageRow">
              <div class="pageCol">
                <el-checkbox v-model="page.isselect" :indeterminate="isIndeterminate(page)" :label="page.name"
                  @change="chooseB(...arguments, page, menu)">{{ page.name }}</el-checkbox>
              </div>
              <div class="btnCol flex">
                <template v-for="button in page.children">
                  <el-checkbox style="padding-left: 15px; margin-right: 10px"
                    @change="chooseC(...arguments, page)" v-model="button.isselect" :label="button.name">{{ button.name
                    }}</el-checkbox>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div v-if="idx > 2" class="list-item flex ai-center">
          <div class="menuCol">
            <el-checkbox v-model="menu.isselect" @change="chooseB(...arguments, menu)" :label="menu.name">{{
              menu.name }}</el-checkbox>
          </div>
          <div class="pageRow2 flex">
            <template v-for="page in menu.children">
              <el-checkbox style="padding-left: 15px; width: 120px; margin-right: 0"
                @change="chooseC(...arguments, menu)" v-model="page.isselect" :label="page.name">{{ page.name
                }}</el-checkbox>
            </template>
          </div>
        </div>
      </template>

      <el-button style="float: right; margin-top: 10px" type="primary" size="" @click="updateMenu">{{ $t('base.label.update') }}</el-button>
    </div>
    <el-dialog :title="roleDialogTitle" :visible.sync="roleDialogVisible" width="420px">
      <el-form :model="roleForm" :rules="roleRules" ref="form" label-width="80px" :inline="false" size="normal">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="roleDialogVisible = false">{{
          $t("base.button.cancel")
        }}</el-button>
        <el-button type="primary" @click="roleSubmit">{{
          $t("base.button.save")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import postApi from "@/api/document/indexApi.js";

export default {
  data() {
    return {
      activeNames: [],
      roleDialogVisible: false,
      roleDialogTitle: "",
      actRole: 0,
      roleList: [],
      roleForm: {},
      roleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      roleName: "",
      menuData: [],
      // tableData: [],
    };
  },
  mounted() {
    this.getRoles();
  },
  computed: {
    // menuDataLength() {
    //   let arr = this.menuData.map((item) => {
    //     return item.children.length;
    //   });
    //   return arr;
    // },
  },
  methods: {
    // 表格合并
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   let n = 0;
    //   for (let i = 0; i <= this.menuDataLength.length; i++) {
    //     let length = this.menuDataLength[i];
    //     n = n + length;
    //     if (columnIndex == 0) {
    //       if (rowIndex == 0) return [1, 1];
    //       if (rowIndex == 1) return [5, 1];
    //       if (rowIndex > 1 && rowIndex < 6) return [0, 1];
    //       if (rowIndex == 6) return [1, 1];
    //       if (rowIndex == 7) return [5, 1];
    //       if (rowIndex > 7 && rowIndex < 12) return [0, 1];
    //       if (rowIndex == 12) return [7, 1];
    //       if (rowIndex > 12 && rowIndex < 19) return [0, 1];
    //     }
    //   }
    // },
    // 判断是否全选
    isIndeterminate(arr) {
      if (arr.children == undefined || arr.children.length == 0) {
        return false
      } else {
        return arr.children.filter(item => item.isselect).length > 0 && arr.children.filter(item => item.isselect).length < arr.children.length
      }
    },
    chooseB(e, dom, item, parent) {
      if (item.children) {
        if (e == true) {
          item.children.forEach((i) => {
            i.isselect = true;
            if (i.children) {
              i.children.forEach((i) => {
                i.isselect = true;
              });
            }
          });
        } else if (e == false) {
          item.children.forEach((i) => {
            i.isselect = false;
            if (i.children) {
              i.children.forEach((i) => {
                i.isselect = false;
              });
            }
          });
        }
      }
      if (parent) {
        if (parent.children.filter(item => item.isselect).length == 0) {
          parent.isselect = false
        } else if (parent.children.filter(item => item.isselect).length > 0) {
          parent.isselect = true
        };
      }
    },
    chooseC(e, dom, parent) {
      if (parent) {
        if (parent.children.filter(item => item.isselect).length == 0) {
          parent.isselect = false
        } else if (parent.children.filter(item => item.isselect).length > 0) {
          parent.isselect = true
        };
      }
    },
    async getRoles(name) {
      let form = new FormData();
      if (name) {
        form.append("roleName", name);
      }
      let res = await postApi.post("/api/BaseRole/GetBaseRoleData", form);
      if (res.code == 1) {
        this.roleList = res.data.map((item) => {
          if (item.roleName === '默认角色' || item.roleName === '办事处管理员') {
            return {
              act: false,
              ...item,
              editable: false,
            };
          } else {
            return {
              act: false,
              ...item,
              editable: true,
            };
          }
        });
        this.roleList[this.actRole].act = true;
        this.chooseRole(this.actRole);
      }
    },
    chooseRole(idx) {
      this.actRole = idx;
      this.roleList.forEach((item) => {
        item.act = false;
      });
      this.roleList[idx].act = true;
      this.queryMenuData(this.roleList[idx]);
    },
    async queryMenuData(r) {
      let form = new FormData();
      this.menuData = [];
      form.append("roleid", r.id);
      var res = await postApi.post("/api/BaseRole/GetBasemenuData", form);
      if (res.code == 1) {
        this.activeNames = res.data
          .filter((item) => item.children != null)
          .map((item) => item.id);
        this.menuData = res.data;
        console.log(this.menuData);

        // this.tableData = [];

        // this.menuData.forEach((item) => {
        //   item.children &&
        //     item.children.forEach((a) => {
        //       this.tableData.push({
        //         ...a,
        //         pId: item.id,
        //         pIsselect: item.isselect,
        //         pName: item.name,
        //       });
        //     });
        // });
      }
    },
    addRole() {
      this.roleDialogVisible = true;
      this.roleDialogTitle = "角色新增";
      this.roleForm = {
        roleName: "",
      };
    },
    roleEdit(row) {
      this.roleDialogVisible = true;
      this.roleDialogTitle = "角色编辑";
      this.roleForm = JSON.parse(JSON.stringify(row));
    },
    roleDelete(row) {
      const h = this.$createElement;
      this.$msgbox({
        type: "warning",
        title: "警告",
        center: true,
        message: h("div", null, [
          h("div", null, "确认删除此角色吗？"),
          h("div", null, "(此操作不可恢复)"),
        ]),
      }).then(async () => {
        let form = new FormData();
        form.append("id", row.id);
        var res = await postApi.post("/api/BaseRole/BaseRoleDel", form);
        if (res.code == 1) {
          this.getRoles();
          if (
            row.id == this.roleList.filter((item) => item.act == true)[0].id
          ) {
            this.chooseRole(0);
          }
          this.$success(res.msg);
        }
      });
    },
    handleSearch(e) {
      this.getRoles(e);
    },
    roleSubmit() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          let form = new FormData();
          if (this.roleDialogTitle == "角色编辑") {
            form.append("id", this.roleForm.id);
          }
          form.append("roleName", this.roleForm.roleName);
          var res = await postApi.post("/api/BaseRole/BaseRoleAddEdit", form);
          if (res.code == 1) {
            this.$success(res.msg);
            this.roleDialogVisible = false;
            this.getRoles();
          }
        }
      });
    },
    async updateMenu() {
      let arr = JSON.parse(JSON.stringify(this.menuData));
      arr = this.concatChild(arr)
        .filter((item) => item.isselect == true)
        .map((item) => item.id);
      let query = { roleid: this.roleList[this.actRole].id, menuid: arr };
      let res = await postApi.post("/api/BaseRole/SetupRolemenu", query);
      if (res.code == 1) {
        this.$success(res.msg);
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
    },
  },
};
</script>
<style lang="scss" scoped>
.role-list {
  width: 220px;
  flex-shrink: 0;
  height: calc(100vh - 81px);
  margin-right: 15px;

  .role-item {
    width: 100%;
    padding: 0 5px;
    line-height: 40px;
    cursor: pointer;

    &:hover {
      background-color: #ecf5ff;
    }

    &.act {
      background-color: #d9ecff;
    }
  }
}

.permission-list {
  flex-grow: 1;

  .list-item {
    width: 100%;
    border: 1px solid #ccc;
    box-sizing: border-box;
    border-top: 0;

    &:first-child {
      border-top: 1px solid #ccc;
    }

    .menuCol {
      width: 120px;
      flex-shrink: 0;
      text-align: center;
      height: 50px;
      line-height: 50px;
    }

    .pageRow {
      .pageCol {
        width: 180px;
        height: 50px;
        padding-left: 15px;
        line-height: 50px;
        border: 1px solid #ccc;
        border-bottom: 0;
        flex-shrink: 0;
      }

      .btnCol {
        width: 100%;
        height: 50px;
        line-height: 50px;
        border-top: 1px solid #ccc;
      }

      &:first-child {
        .pageCol {
          border-top: 0;
        }

        .btnCol {
          border-top: 0;
        }
      }
    }

    .pageRow2 {
      border-left: 1px solid #ccc;
      height: 50px;
      line-height: 50px;
    }
  }

  .permission {
    height: calc(100vh - 120px);
    overflow: auto;
  }

  ::v-deep .el-collapse-item__header {
    background-color: #f2f5f7;
    padding-left: 15px;
  }

  .pd15 {
    padding: 15px;
    padding-bottom: 0;
  }
}
</style>
