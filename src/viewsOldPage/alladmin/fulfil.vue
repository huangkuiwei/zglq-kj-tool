<template>
  <div class="app-container background table-box">
    <!-- <el-row style="margin-top: 20px">
    </el-row> -->
    <el-row class="table">
      <el-table class="t-table" :data="tableData" v-loading="loading" height="100%" :header-cell-style="$thStyle" style="margin-top: 20px; font-size: 13px" stripe> > <el-table-column prop="SystemName" label="系统名称" show-overflow-tooltip width="200">
        </el-table-column>
        <el-table-column prop="FileName" :label="$t('base.button.fileName')">
        </el-table-column>
        <el-table-column prop="CorpName" label="组织" width="200"> </el-table-column>
        <el-table-column prop="UserName" :label="$t('base.label.name')" width="200"> </el-table-column>
        <el-table-column prop="TeamTime" label="入队时间" width="200"> </el-table-column>
        <el-table-column prop="OpeningTime" label="开始时间" width="200"> </el-table-column>
        <el-table-column prop="FinishTime" label="结束时间" width="200"> </el-table-column>
        <el-table-column prop="Datastatus" label="状态" width="200">
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        path: process.env.ZM_WebSocket,
        socket: "",
        loading: true,
        tableData: []
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
        this.socket.send('Getfulfil') //获取现有队列数据
      },
      error: function () {
        console.log("连接错误")
        this.loading = false;
      },
      getMessage: function (msg) {
        var list = JSON.parse(msg.data)
        if (list.Top == "FulfilDATE" || list.Top == "DELETE") {
          this.tableData = list.WData
          this.loading = false;
          console.log(JSON.parse(msg.data))
        }
      },
      close: function () {
        this.$message.error("转码服务已经关闭")
        this.loading = false;
      }
    },
    destroyed() {
      // 销毁监听
      this.socket.onclose = this.close
    }
  }
</script>
<style scoped lang="scss">
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
