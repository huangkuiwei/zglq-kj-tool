<!-- 流程流转（详情按钮） -->
<template>
  <el-dialog v-dialogDrag :close-on-click-modal='false' :visible="dialogVisible" :title="workflowInfo" width="70%" @opened='workflowManagementOPened' @close='closeDialog' append-to-body>
    <div class="track-rcol">
      <div class="track-left-list">
        <div class="stepItem" v-for="(item, index) in tableData" :key="index" :class="stepClass(item)">
          <div class="point" :class="stepClass(item)"></div>
        </div>
      </div>
      <el-table ref="recordTableId" :data="tableData" class="wf-table" :header-cell-style="$thStyle" :stripe="true" border style="width: 80%;">
        <el-table-column :label="$t('base.button.index')" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" align="left" width="200">
        </el-table-column>
        <el-table-column prop="undertakerName" label="经办人" align="center" width="120">
        </el-table-column>
        <el-table-column prop="fulfiltime" label="审批时间" align="center" width="200">
        </el-table-column>
        <el-table-column prop="resulttext" label="审批结论" align="center" width="150">
          <template slot-scope="scope">
            <div class="gray" v-if="!scope.row.resulttext"></div>
            <div class="green" v-if="scope.row.resulttext == '同意'">同意</div>
            <div class="gray" v-if="scope.row.resulttext == '撤回'">已撤回</div>
            <div class="green" v-if="scope.row.resulttext == '已修改'">已修改</div>
            <div class="red" v-if="scope.row.resulttext == '拒绝'">拒绝</div>
            <div class="gray" v-if="scope.row.resulttext == '不予修改'">不予修改</div>
            <div class="blue" v-if="scope.row.resulttext == '转交'">已转交</div>
            <div class="yellow" v-if="scope.row.resulttext == '修改再审'">修改再审</div>
            <div class="red" v-if="scope.row.resulttext == '重启流程'">重启流程</div>
          </template>
        </el-table-column>
        <el-table-column prop="opinion" label="审批意见" align="left">
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog" size="small">关 闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import documentFileApi from "@/api/document/indexApi.js";
import fileIconComponends from "@/components/fileIcon";
export default {
  name: 'workflowInfoManagement',
  props: {
    workflowIuid: {
      type: String,
      default: ''
    },
    projectId: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
  },
  components: {
    fileIconComponends,
  },
  data() {
    return {
      workflowInfo: '', // 流程信息
      tableData: [],
      peopleList: [], // 左列状态数组
      rowEleList: [], // 保存行高数组
    };
  },
  async mounted() { },
  methods: {
    stepClass(item) {
      let color = 'blue'
      switch (item.resulttext) {
        case '拒绝':
          color = 'red'
          break;
        // case '转交':
        case '修改再审':
        case '重启流程':
          color = 'yellow'
          break;
        case '同意':
        case '审批发起':
        case '审批结束':
        case '已修改':
          color = 'green'
          break;
        case '撤回':
        case '不予修改':
          color = 'gray'
          break;
      }
      return color
    },
    async workflowManagementOPened() {
      this.tableData = [];
      this.peopleList = [];
      this.rowEleList = [];
      let data = new FormData();
      data.append('iuid', this.workflowIuid);
      var res = await documentFileApi.post("/api/projectworkflow/workflowPathTabledetailsData", data); // 检查流转表
      if (res.code == 1) {
        this.tableData = res.data;
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].status == 1) // 待审批
            this.peopleList.push(1);
          else this.peopleList.push(2);
          this.rowEleList.push(48);
          //       alert(this.tableData[i].taskName);
        }
        //      this.setRowEleList();    // YGP: 这个没走通
        if (this.tableData.length > 0) this.workflowInfo = "流程流转信息： " + "[" + this.tableData[0].workflowName + "," + this.tableData[0].creatorName + "," + this.tableData[0].createTime + "]";
        else this.workflowInfo = "流程流转信息"
        if (this.tableData.length > 0 && (this.tableData[this.tableData.length - 1].status == 0 || this.tableData[this.tableData.length - 1].status == -1 || this.tableData[this.tableData.length - 1].status == -2)) { //  //0-待审批（缺省值） 1-通过 -1-拒绝 -2-打回，流程未审批完毕
          var wfID = this.tableData[this.tableData.length - 1].workflowGuid;
          var stepID = this.tableData[this.tableData.length - 1].taskID;
          while (true) { // 显示所有还未启动的流程任务
            var nextTasks = await this.getNextStep(wfID, stepID);
            if (nextTasks.length == 0) break;
            for (var i = 0; i < nextTasks.length; i++) {
              this.tableData.push({
                taskName: nextTasks[i].taskName,
                taskID: nextTasks[i].taskID,
                status: -100,
                undertakerName: nextTasks[i].undertakerName,
                fulfiltime: '',
                resulttext: '',
                opinion: ''
              });
              this.peopleList.push(3);
              this.rowEleList.push(48);
            }
            stepID = nextTasks[0].taskID;
          }
        }
        this.rowHeightList();
      }
    },
    async closeDialog() {
      //    this.dialogVisible = false;
      this.tableData = []
      this.$emit("update:dialogVisible", false)
    },
    async getNextStep(wfID, taskID) {
      let data = new FormData();
      data.append('type', 1); //1--同意 2-不同意
      data.append('wfID', wfID) // 流程ID
      data.append('stepID', taskID)
      var res = await documentFileApi.post("/api/Workflow/GetNextStepsNew", data);
      var nextTasks = [];
      if (res.code == 1) {
        var roles = await this.getAllUsersOfRole(res.data[0].roleIDs);
        for (var i = 0; i < roles.length; i++) {
          var nextTask;
          if (res.data[0].roleIDs[i].type == 1) { // 直接指定了人员
            nextTask = {
              wfID: wfID,
              taskID: res.data[0].id,
              taskName: res.data[0].stepName,
              undertakerName: roles[i].currentName
            };
          } else {
            nextTask = {
              wfID: wfID,
              taskID: res.data[0].id,
              taskName: res.data[0].stepName,
              undertakerName: roles[i].currentRole
            };
          }
          nextTasks.push(nextTask);
        }
      }
      return nextTasks;
    },
    async getAllUsersOfRole(roleIDs) {
      var roles = [];
      for (var i = 0; i < roleIDs.length; i++) {
        let queryForm = new FormData();
        queryForm.append('roleID', roleIDs[i].roleID);
        queryForm.append('ProjectIUID', this.projectId);
        var res = await documentFileApi.post('/api/Permission/GetUserDataByRole', queryForm);
        if (res.code == 1) {
          roles.push({});
          roles[i].currentRole = roleIDs[i].roleName;
          roles[i].roleNameList = res.data;
          if (roleIDs[i].type == 1) { // 直接指定了人员
            roles[i].currentName = roleIDs[i].roleUserName;
            roles[i].currentID = roleIDs[i].roleUserID;
            roles[i].roleNameList = [{
              userName: roles[i].currentName,
              userID: roles[i].currentID
            }];
          } else { // 指定了角色则选择第一个作为缺省
            roles[i].currentName = res.data[0].userName;
            roles[i].currentID = res.data[0].userID;
          }
        }
      }
      return roles;
    },
    // 设置记录列表行高的列表;
    setRowEleList() {
      if (!this.peopleList || this.peopleList.length == 0 || !this.$refs.recordTableId) {
        return
      }
      try {
        this.rowEleList = [];
        const rowEleList = this.$refs.recordTableId.$refs['bodyWrapper'].children[0].children[1].children;
        alert(this.rowEleList.length)
        for (let index = 0; index < rowEleList.length; index++) {
          this.rowEleList[index] = rowEleList[index].clientHeight;
          alert(this.rowEleList[index])
        }
      } catch (error) {
      } finally { }
    },
    rowHeightList() {
      this.rowEleList = []
      let temp = document.getElementsByClassName('el-table__row')
      for (let i = 0; i < temp.length; i++) {
        const item = temp[i]
        this.rowEleList.push(item.scrollHeight)
        document.styleSheets[0].addRule(`.row_${i}::after`, `margin-top: ${item.scrollHeight / 2 - 8}px !important`) // 隐藏伪类元素（阴影）
      }
      this.rowEleList.splice(0, 2); // YGP: 好像是表头
    }
  }
}
</script>
<style lang="scss">
.redCircle {
  width: 10px;
  height: 10px;
  margin: 5px;
  margin-top: 6px;
  margin-left: 20px;
  border: 1px solid #FF3300;
  background-color: #FF3300;
  border-radius: 5px;
}

.task-file {
  font-size: 12px;
  font-weight: 200;
  margin: 10px;
}

::v-deep .el-table {
  max-height: 500px;
  overflow: auto;

  &::before {
    height: 0px !important;
  }
}

/*
.wf-table td,
.wf-table th.is-leaf {
  border-bottom: 1px solid #E5EEFF;
}*/
.track-left-list {
  margin-top: 41px;
  padding: 0 20px;
  position: relative;

  .stepItem {
    position: relative;
    height: 48px;
    width: 24px;
    margin: 24px 0 -24px 0;
    // border-left: 2px solid #fff;
    border-left: 2px solid #33CC99;
    color: #999;

    &:last-child {
      height: 24px;
      border-left: 2px solid #fff !important;
      ;
    }

    &.green {
      border-left: 2px solid #33CC99;
    }

    &.blue {
      border-left: 2px solid #409eff;
    }

    &.yellow {
      border-left: 2px solid #FF9900;
    }


    &.red {
      border-left: 2px solid #FF3300;
    }

    &.gray {
      border-left: 2px solid gray;
    }

    .point {
      width: 14px;
      height: 14px;
      line-height: 14px;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      border-radius: 50%;
      position: absolute;
      left: -8px;
      top: -8px;
      z-index: 2;

      &.blue {
        background: #409eff;
      }

      &.yellow {
        background: #FF9900;
      }

      &.green {
        background: #33CC99;
      }

      &.red {
        background: #FF3300;
      }

      &.gray {
        background: gray;
      }
    }
  }
}

.track-left-list li.first {
  color: #999;
  padding-top: 0;
  width: 100%;
  text-align: left;
  border-left: 1px solid #33CC99;
}

.track-left-list li.last {
  border: 0px !important;
}

.track-left-list li.first3 {
  color: #999;
  padding-top: 0;
  width: 100%;
  text-align: left;
  border-left: 1px solid #F56C6C;
}

.track-left-list li .node-icon {
  position: absolute;
  left: -5.5px;
  border-radius: 5px;
  width: 10px;
  height: 10px;
  top: 0;
  background-color: #d9d9d9;
}

.track-left-list li.first .node-icon {
  background-position: 0-72px;
  background-color: #33CC99;
  width: 20px;
  z-index: 2;
  height: 20px;
  position: absolute;
  left: -10px;
  top: 0;
  border-radius: 10px;
}

.track-left-list li.first2 .node-icon {
  background-position: 0-72px;
  background-color: #33CC99;
  width: 20px;
  z-index: 2;
  height: 20px;
  position: absolute;
  left: -10px;
  top: 0;
  border-radius: 10px;
}

.track-left-list li.first3 .node-icon {
  background-position: 0-72px;
  background-color: #F56C6C;
  width: 20px;
  z-index: 2;
  height: 20px;
  position: absolute;
  left: -10px;
  top: 0;
  border-radius: 10px;
}

.track-rcol {
  display: flex;
  margin-top: 0px;
  position: relative;
}

.red {
  color: #F56C6C;
  font-weight: 500
}

.green {
  color: #33CC99;
  font-weight: 500
}

.blue {
  color: #409eff;
  font-weight: 500
}

.yellow {
  color: #FF9900;
  font-weight: 500
}

.gray {
  color: gray;
  font-weight: 500
}
</style>
