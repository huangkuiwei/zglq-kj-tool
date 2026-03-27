<template>
  <el-dialog v-dialogDrag :close-on-click-modal='false' :visible="dialogVisible" title="流程详情" @opened='openWorkflow' width="80%" @close='closeDialog' class="workflowManagement-dialog t-zhe-from-box" append-to-body>
    <workflowManagement :viewMode='false' :tableRowData='tableRow' ref="workflowManagements" :isEditable="isEditableA" @xmlModel='xmlModel' :xmlData='bpmnXmlStr'></workflowManagement>
    <!--span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog" size="small">关  闭</el-button>
      </span-->
  </el-dialog>
</template>
<script>
import workflowManagement from "@/views/SystemSetting/workflowManagement/index.vue";
import postApi from "@/api/document/indexApi.js";
export default {
  props: {
    isEditable: {
      type: Boolean,
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    projectId: {
      type: String,
      default: '',
      require: true,
    },
    workflowName: {
      type: String,
      default: '',
      require: true,
    },
  },
  computed: {
    isEditableA() {
      return this.isEditable
    },
  },
  components: {
    workflowManagement
  },
  data() {
    return {
      tableRow: null,
      init: false,
      bpmnXmlStr: '<?xml version="1.0" encoding="UTF-8"?>' + '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' + 'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' + 'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' + 'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' + 'targetNamespace="http://bpmn.io/schema/bpmn" ' + 'id="Definitions_1">' + '<bpmn:process id="Process_1" isExecutable="false">' + '<bpmn:startEvent id="StartEvent_1"/>' +
        '</bpmn:process>' + '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' + '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' + '<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">' + '<dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>' + '</bpmndi:BPMNShape>' + '</bpmndi:BPMNPlane>' + '</bpmndi:BPMNDiagram>' + '</bpmn:definitions>',
    };
  },
  watch: {
    dialogVisible(newVal, old) {
      if (newVal == true && this.init == false) {
        this.init = true;
        this.openWorkflow();
      }
    }
  },
  methods: {
    async openWorkflow() {
      let queryForm = new FormData();
      queryForm.append('projectId', this.projectId)
      queryForm.append('type', 'all')
      var res = await postApi.post('/api/Workflow/getWorkflowList', queryForm);
      var row = null;
      if (res.code == 1) {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].wfName && res.data[i].wfName == this.workflowName) {
            row = res.data[i];
          }
        }
      }
      if (!row) return;
      this.tableRow = row;
      this.$nextTick(() => {
        if (row.whether && row.whether != 'null') {
          this.$refs['workflowManagements'].bpmnXmlStr = row.xmlJson //流程图重绘
        }
        this.$refs['workflowManagements'].createNewDiagram() //流程图重绘
        this.$refs['workflowManagements'].disabled = true //保存默认不能点击
        this.$refs['workflowManagements'].value = '' // 模板清空
      })
    },
    xmlModel(data) {
      this.bpmnXmlStr = data
      this.$nextTick(() => {
        this.$refs['workflowManagements'].createNewDiagram() //流程图重绘
      })
    },
    async closeDialog() {
      this.$emit("update:dialogVisible", false)
    },
  }
}
</script>
<style lang="less">
.workflowManagement-dialog {
  .el-dialog {
    height: 68%;
  }

  .el-dialog__body {
    height: 85%;
  }

  .property-panel {
    height: calc(100% - 100px);
    overflow-y: auto;
    top: 0%;
    padding-right: 10px;
  }
}
</style>
<style>
.t-zhe-from-box .el-dialog__body {
  overflow-y: auto;
}

.x-zhe-from-box .el-dialog {
  height: calc(100% - 15vh - 50px);
}

.el-table .warning-row {
  background: #afeeee;
}

.el-table .success-row {
  background: #fff;
}

.workflow:hover {
  cursor: pointer;
}
</style>
