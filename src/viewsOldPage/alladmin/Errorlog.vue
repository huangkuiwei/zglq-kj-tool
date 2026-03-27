<template>
  <div v-loading="loading" class="app-container background table-box">
    <el-container>
      <el-main>
        <el-container class="Hight100">
          <el-aside width="300px">
            <el-table :data="tableData" height="99.9%" :header-cell-style="$thStyle" style="width: 100%" @row-click='tableRowClick'>
              <el-table-column prop="Name" :label="$t('base.button.name')" align="center">
              </el-table-column>
            </el-table>
          </el-aside>
          <el-main>
            <p style="padding-left:10px;height:12%;overflow-y:scroll;">{{this.DataText}}</p>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        path: process.env.ZM_WebSocket,
        socket: "",
        loading: true,
        tableData: [],
        DataText: ""
      }
    },
    mounted() {
      // 初始化
      this.init()
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
        this.socket.send('GetError') //获取日志信息数据
      },
      error: function () {
        this.loading = false;
      },
      getMessage: function (msg) {
        var list = JSON.parse(msg.data)
        if (list.Top == "ErrorDATE") {
          this.tableData = list.Data;
          this.loading = false;
          console.log(JSON.parse(msg.data))
        } else if (list.Top == "ErrorDATEText") {
          this.DataText = list.Data;
          this.loading = false;
        }
      },
      close: function () {
        this.$message.error("转码服务已经关闭")
        this.loading = false;
      },
      tableRowClick(row) {
        this.socket.send("Error-" + row.Name)
      }
    },
    destroyed() {
      // 销毁监听
      this.socket.onclose = this.close
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
