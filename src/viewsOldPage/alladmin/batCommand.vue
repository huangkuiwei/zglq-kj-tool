<template>
  <div class="app-container background table-box">
    <el-container>
      <el-main>
        <el-container class="Hight100">
          <el-aside width="300px">
            <el-table :data="tableData" height="99.9%" :header-cell-style="$thStyle" style="width: 100%" @row-click='tableRowClick'>
              <el-table-column prop="name" :label="$t('base.button.name')" align="center">
              </el-table-column>
            </el-table>
          </el-aside>
          <el-main>
            <el-input type="textarea" :rows="20" resize="none" :disabled="disabledbit" placeholder="请输入内容" v-model="textarea">
            </el-input>
            <el-button type="warning" :disabled="!disabledbit" @click="disabledbit = false" round>编辑bat</el-button>
            <el-button type="primary" :disabled="disabledbit" @click="SaveText" round>保存bat</el-button>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import commonApi from "@/api/document/indexApi.js";
import { async } from 'q';
import { decrypt, encrypt } from '@/utils'

export default {
  data() {
    return {
      tableData: [],
      DataText: "",
      textarea: "",
      fullPath: null,
      disabledbit: true
    }
  },
  mounted() {
    this.GetbatData();
  },
  methods: {
    async GetbatData() {
      var res = await commonApi.get(
        "/api/TaskManagement/Getbat", ''
      );
      if (res.code == -1) {
        this.$message.error(res.msg)
      } else {
        // filePath 和 turnPath 解码
        res.data && res.data.forEach(item => {
          item.filePath = decrypt(item.filePath || '')
          item.turnPath = decrypt(item.turnPath || '')
        })

        this.tableData = res.data
        this.tableRowClick(res.data[0])
      }
    },
    async tableRowClick(row) {
      this.disabledbit = true;
      this.fullPath = row.fullPath.replace(/\//g, '//');
      var formData = new FormData()

      let fullPath = row.fullPath.replace(/\//g, '//')

      formData.append('fullPath', encrypt(fullPath))
      var res = await commonApi.post(
        "/api/TaskManagement/GetbatText", formData
      );
      if (res.code == -1) {
        this.$message.error(res.msg)
      } else {
        this.textarea = res.data
      }
    },
    async SaveText() {
      this.disabledbit = true
      var formData = new FormData()
      formData.append('fullPath', this.fullPath)
      formData.append('fullPathText', this.textarea)

      var res = await commonApi.post(
        "/api/TaskManagement/GetSavebatText", formData
      );
      if (res.code == -1) {
        this.$message.error(res.msg)
      } else {
        this.$success(res.msg)
      }
    }
  }

}
</script>
<style scoped lang="scss">
.Hight100 {
  height: 100%;
}

.icluude {
  padding: 15px 0;
  font-size: 13px;
  cursor: pointer;

  div {
    font-weight: 700;
    text-decoration: none;
    transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    color: #303133;
  }

  .list:last-child {
    font-weight: 400;
    color: #606266;
    cursor: text;
  }

  span {
    margin: 0 9px;
    font-weight: 700;
    color: #c0c4cc;
  }
}

.allfile {
  position: absolute;
  height: 100%;
  background: #fff;
  border: 1px solid #e6e6e6;
  padding: 10px;
  width: 100%;
  overflow: auto;
}

.right {
  justify-content: flex-end;
}
</style>
<style>
.bg-purple {
  height: 99%;
}

html {
  overflow: hidden;
}
</style>
