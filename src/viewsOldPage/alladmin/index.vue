<template>
  <div class="app-container background table-box">
    <el-row style="margin: 1px">
      <el-switch v-model="value1" @change="changeData(value1)" active-text="开启服务" inactive-text="关闭服务">
      </el-switch>
      <el-button type="text" @click="dialogFormData">参数设置</el-button>
    </el-row>
    <!-- <el-row style="margin-top:20px"></el-row> -->
    <el-row class="table">
      <el-table class="t-table" :data="tableData" v-loading="loading" height="100%" :header-cell-style="$thStyle" style="margin-top:20px;font-size:13px" stripe>
        <el-table-column prop="SystemName" label="系统名称" show-overflow-tooltip width="200">
        </el-table-column>
        <el-table-column prop="FileName" :label="$t('base.button.fileName')"> </el-table-column>
        <el-table-column prop="CorpName" label="组织"> </el-table-column>
        <el-table-column prop="UserName" :label="$t('base.label.name')" width="200">
        </el-table-column>
        <el-table-column prop="Id" label="进程Id" width="200">
        </el-table-column>
        <el-table-column prop="TeamTime" label="入队时间" width="200">
        </el-table-column>
        <el-table-column prop="OpeningTime" label="开始时间" width="200">
        </el-table-column>
        <el-table-column prop="Datastatus" label="状态" width="100">
        </el-table-column>
        <el-table-column fixed="right" :label="$t('base.formLabel.operation')" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click.native.prevent="
                columnDelete($event, scope.$index, scope.row)
              " size="small">删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog title="参数设置" width="35%" :visible.sync="dialogFormVisible">
      <el-form :model="form" class="ProcessDialo">
        <el-form-item label="并发数量：" :label-width="formLabelWidth">
          <el-input-number v-model="form.processQuantity" :min="1" :max="100" label="并发数量"></el-input-number>
          <!-- <el-input v-model="form.ProcessQuantity"
                    autocomplete="off"></el-input> -->
        </el-form-item>
        <el-form-item label="WebSocket连接地址：" :label-width="formLabelWidth" style="display:flex">
          <el-input v-model="form.webSocket"></el-input>
        </el-form-item>
        <el-form-item label="转码日志存放路径：" :label-width="formLabelWidth" style="display:flex">
          <el-input v-model="form.logText"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('base.button.cancel') }}</el-button>
        <el-button type="primary" @click="dialogFormsubmint">{{ $t('base.button.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import commonApi from "@/api/document/indexApi.js";
  export default {
    data() {
      return {
        path: process.env.ZM_WebSocket,
        socket: "",
        value1: false,
        loading: true,
        dialogFormVisible: false,
        tableData: [],
        form: {
          processQuantity: 0,
          webSocket: "",
          logText: ""
        },
        formLabelWidth: "150px"
      };
    },
    mounted() {
      // 初始化
      this.init();
    },
    methods: {
      init: function () {
        if (typeof WebSocket === "undefined") {
          alert("您的浏览器不支持socket");
        } else {
          // 实例化socket
          this.socket = new WebSocket(this.path);
          // 监听socket连接
          this.socket.onopen = this.open;
          // 监听socket错误信息
          this.socket.onerror = this.error;
          // 监听socket消息
          this.socket.onmessage = this.getMessage;
          // 监听socket关闭消息
          this.socket.onclose = this.close;
        }
      },
      open: function () {
        this.value1 = true;
        this.socket.send("Getqueue"); //获取现有队列数据
      },
      error: function () {
        this.value1 = false;
        this.loading = false;
      },
      getMessage: function (msg) {
        var list = JSON.parse(msg.data);
        if (list.Top == "QueueDATE" || list.Top == "INSERT" || list.Top == "UPDATE" || list.Top == "DELETE") {
          this.tableData = list.Data;
          this.loading = false;
          console.log(JSON.parse(msg.data));
        }
      },
      close: function () {
        this.$message.error("转码服务已经关闭");
        this.value1 = false;
        this.loading = false;
      },
      async changeData(row) {
        const loading = this.$loading({
          lock: true,
          text: row == true ? "正在开启转码服务" : "正在关闭转码服务",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        var res = await commonApi.get("/api/TaskManagement/GetserviceType?Toolbit=" + row + "", "");
        setTimeout(() => {
          loading.close();
          if (res.code == -1) {
            this.$message.error(res.msg);
          } else {
            this.$success(res.msg);
          }
          if (row) {
            this.init();
          }
        }, 3000);
      },
      async dialogFormData() {
        var res = await commonApi.get("/api/TaskManagement/GetProcessQuantity", "");
        if (res.code == -1) {
          this.$message.error(res.msg);
        } else {
          this.dialogFormVisible = true;
          console.log(res.data);
          this.form = res.data;
        }
      },
      async dialogFormsubmint() {
        var formData = new FormData();
        formData.append("ProcessQuantity", this.form.processQuantity);
        formData.append("WebSocket", this.form.webSocket);
        formData.append("LogText", this.form.logText);
        var res = await commonApi.post("/api/TaskManagement/SetupProcessQuantity", formData);
        if (res.code == -1) {
          this.dialogFormVisible = false;
          this.$message.error(res.msg);
        } else {
          this.dialogFormVisible = false;
          this.$success(res.msg);
        }
      },
      columnDelete(event, index, row) {
        this.$confirm("是否确认删除？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          var res = commonApi.get("/api/TaskManagement/DeleteProcess?IUID=" + row.IUID + "", "");
          // if (res.code == -1) {
          //   this.$message.error(res.msg)
          // } else {
          //   this.$success(res.msg)
          // }
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      }
    },
    destroyed() {
      // 销毁监听
      this.socket.onclose = this.close;
    }
  };
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
