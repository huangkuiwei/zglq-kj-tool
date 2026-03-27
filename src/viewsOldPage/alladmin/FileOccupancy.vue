<template>
  <div class="app-container background table-box">
    <el-row style="margin: 1px">
      <!-- <el-switch v-model="value1"
                 @change="changeData(value1)"
                 active-text="开启服务"
                 inactive-text="关闭服务">
      </el-switch> -->
      <el-button type="warning" @click="changeData">重启imodel</el-button>
      <el-button type="text" @click="dialogFormData">命令设置</el-button>
      <el-button type="text" @click="dialogVisibleData">命令窗口</el-button>
    </el-row>
    <!-- <el-row style="margin-top: 20px">
    </el-row> -->
    <el-row class="table">
      <el-table class="t-table" :data="tableData" v-loading="loading" height="100%" :header-cell-style="$thStyle" style="margin-top: 20px; font-size: 13px" stripe>
        <el-table-column prop="SystemName" label="系统名称" show-overflow-tooltip width="200">
        </el-table-column>
        <el-table-column prop="FilePath" label="文件路径">
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog title="命令设置" width="35%" :visible.sync="dialogFormVisible">
      <el-form :model="form" class="ProcessDialo">
        <el-form-item label="命令：" label-width="80px" style="display:flex">
          <el-input type="textarea" :rows="10" resize="none" placeholder="请输入内容" v-model="form.orderText">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('base.button.cancel') }}</el-button>
        <!-- <el-button type="primary"
                   @click="dialogFormsubmint">{{ $t('base.button.confirm') }}</el-button> -->
      </div>
    </el-dialog>
    <el-dialog title="命令窗口" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-input type="textarea" :rows="25" resize="none" placeholder="" v-model="$root.outputDataReceived">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import commonApi from "@/api/document/indexApi.js";
  export default {
    data() {
      return {
        path: process.env.ZM_WebSocket,
        value1: false,
        dialogFormVisible: false,
        dialogVisible: false,
        socket: "",
        DataorderText: "",
        loading: true,
        tableData: [],
        form: {
          orderText: ''
        }
      }
    },
    mounted() {
      // 初始化
      this.init()
      this.$root.outputDataReceived = localStorage.getItem('outputDataReceived')
    },
    methods: {
      init: function () {
        if (typeof (WebSocket) === "undefined") {
          alert("您的浏览器不支持socket")
        } else {
          // 实例化socket
          this.socket = new WebSocket(this.path)
          // 监听socket连接
          this.socket.onopen = this.open
          // 监听socket错误信息
          this.socket.onerror = this.error
          // 监听socket消息
          this.socket.onmessage = this.getMessage
          // 监听socket关闭消息
          this.socket.onclose = this.close
        }
      },
      open: function () {
        this.socket.send('Fileoccupancy') //获取现有队列数据
      },
      error: function () {},
      getMessage: function (msg) {
        var list = JSON.parse(msg.data)
        if (list.Top == "FileoccupancyDATE") {
          this.tableData = list.Data
          this.loading = false;
          console.log(JSON.parse(msg.data))
        }
      },
      close: function () {
        this.$message.error("转码服务已经关闭")
        this.loading = false;
      },
      async openimodel() {
        var res = await commonApi.get("/api/TaskManagement/openimodel", '');
        if (res.code == -1) {
          this.$message.error(res.msg)
        } else {
          this.dialogVisible = true;
        }
      },
      async changeData() {
        this.$confirm('重启可以强制释放被占用的文件，但重启过程中模型打开查看将受影响，请确认是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$root.outputDataReceived = ''
          this.openimodel();
        }).catch(() => {});
      },
      async dialogFormData() {
        var res = await commonApi.get("/api/TaskManagement/Getimodelorder", '');
        if (res.code == -1) {
          this.$message.error(res.msg)
        } else {
          this.dialogFormVisible = true
          console.log(res.data)
          this.form.orderText = res.data
        }
      },
      async dialogFormsubmint() {
        var formData = new FormData()
        formData.append('orderText', this.form.orderText)
        var res = await commonApi.post("/api/TaskManagement/Saveimodelorder", formData);
        if (res.code == -1) {
          this.dialogFormVisible = false
          this.$message.error(res.msg)
        } else {
          this.dialogFormVisible = false
          this.$success(res.msg)
        }
      },
      handleClose(done) {
        this.$confirm('确认关闭？').then(_ => {
          done();
        }).catch(_ => {});
      },
      async dialogVisibleData() {
        // var res = await commonApi.get(
        //   "/api/TaskManagement/Getimodelordertext", ''
        // );
        // if (res.code == -1) {
        //   this.$message.error(res.msg)
        // } else {
        //   this.DataorderText = res.data;
        this.dialogVisible = true;
        // }
      }
    },
    destroyed() {
      // 销毁监听
      this.socket.onclose = this.close
    }
  }
</script>
<style scoped lang="scss">
  .ProcessDialo ::v-deep .el-form-item__content {
    margin-left: 0 !important;
    width: 80%;
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
