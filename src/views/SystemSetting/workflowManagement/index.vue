<template>
  <div class="containers flex">
    <div v-show="!viewMode" class="canvasMask" id="canvasMask"></div>

    <div v-if="viewMode" class="flex column">
      <div class="wf-list-box">
        <div class="flex jc-between ai-center" style="height: 48px;">
          <div class="wf-title">{{ $t('base.label.approvalProcess') }}</div>
          <div class="wf-btn" v-if="isOpen">
            <template v-if="parentPage == 'project'">
              <el-button type="text" size="small" @click="addWorkflow(ProjectIUID)">{{
                $t('base.button.new') }}</el-button>
              <el-button type="text" size="small" @click="chooseTemplate">{{ $t('base.button.select') }}</el-button>
            </template>
            <template v-else>
              <el-button type="text" size="small" @click="addWorkflow('SystemWorkflows')">{{
                $t('base.button.new') }}</el-button>
            </template>
          </div>
        </div>
        <div class="wf-list">
          <!-- 公司流程模版 -->
          <div v-if="parentPage != 'project'" class="wf-item flex jc-between ai-center"
            v-for="(item, idx) in templateWorkflow" :key="item.id">
            <img src="../../../assets/company.png" style="width:28px" alt="">
            <div class="wf-name" :class="{ 'active': tableRow.id == item.id }"
              @click="showThisWF(item, 'SystemWorkflows')">{{
                item.wfName }}</div>
            <el-button type="text" icon="el-icon-edit-outline" size="small"
              @click="editWorkflow(item, 'SystemWorkflows')"></el-button>
            <el-button type="text" icon="el-icon-delete" size="small" style="color:#f56c6c"
              @click="deleteWorkflows(item)"></el-button>
          </div>
          <!-- 项目流程管理 -->
          <div v-if="parentPage == 'project'" class="wf-item flex jc-between ai-center"
            v-for="(item, idx) in projectWorkflow" :key="item.iuid">

            <template v-if="item.projectId == 'SystemWorkflows'">
              <img src="../../../assets/company.png" style="width:28px" alt="">
              <div class="wf-name" :class="{ 'active': tableRow.id == item.id }" @click="showThisWF(item, 'proj')">{{
                item.wfName }}</div>
            </template>

            <template v-else>
              <img src="../../../assets/projectWf.png" style="width:28px" alt="">
              <div class="wf-name" :class="{ 'active': tableRow.id == item.id }" @click="showThisWF(item, 'proj')">{{
                item.wfName }}</div>
              <el-button type="text" icon="el-icon-edit-outline" size="small"
                @click="editWorkflow(item, ProjectIUID)"></el-button>
            </template>
            <el-button type="text" icon="el-icon-delete" size="small" style="color:#f56c6c"
              @click="deleteWorkflows(item)"></el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 流程图模块 -->

    <div v-show="isOpen" :class="viewMode ? 'canvas' : 'canvas-dialog'" id="canvas" ref="canvas"></div>
    <!-- 操作按钮 -->
    <div v-show="viewMode && isOpen" class="toolbar flex ai-center" style="height: 40px;justify-content: flex-end;">
      <div class="saveBtn" style="margin-left: auto;">
        <el-button type="primary" size="small" :disabled="disabled && isSaving" v-loading="isSaving"
          v-if="parentPage == 'project' && projId != 'SystemWorkflows'" @click="save">{{ $t('base.button.saveProcess') }}</el-button>
        <el-button type="primary" plain size="small" :disabled="disabled && isSaving" v-loading="isSaving"
          v-if="parentPage != 'project'" @click="save">{{ $t('base.label.saveTemplate') }}</el-button>
      </div>
    </div>
    <!-- 右侧表单模块 -->
    <PropertyPanel v-show="isOpen" ref="panel" :class="viewMode ? 'panel' : 'panel-dialog'" :xmlStr='xmlStr'
      :isEditable="isEditableA" :nodeFormList="nodeFormList" :element="element" :disabled="disabled"
      :enableChange="viewMode" v-bind="$attrs" v-on="$listeners" :modeler="bpmnModeler" />
    <div v-if="!isOpen" style="width: 80%;;margin-top: 25vh; text-align: center;">
      <div style="font-size: 18px;color: #999;font-weight: bold;">{{ $t('base.button.noData') }}</div>
      <div style="font-size: 13px;margin: 15px 0 20px;color: #666;">{{ $t('base.button.createProcess') }}</div>
      <div>
        <el-button type="primary" plain size="small" @click="addWorkflow(ProjectIUID)">{{ $t('base.button.createNewProcess') }}</el-button>
        <el-button type="primary" plain v-if="parentPage == 'project'" size="small" @click="chooseTemplate">{{ $t('base.button.chooseTemplate') }}</el-button>
      </div>
    </div>
    <!-- 选择模版 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('base.button.selectEnterpriseTemplate')" :visible.sync="templateVisible" width="320px"
      append-to-body>
      <el-checkbox-group v-model="tempWfSelect" size="normal" @change="" class="flex column">
        <el-checkbox v-for="item in templateWorkflow" :key="item.wfCode" :label="item.wfCode"
          style="padding: 10px;display: block;border-bottom: 1px solid #e0e0e0;margin-right: 0;">
          {{ item.wfName }}
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="templateVisible = false">{{ $t('base.button.cancel') }}</el-button>
        <el-button size="small" type="primary" @click="saveTempToProject">{{ $t('base.button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 新增编辑流程弹窗 -->
    <el-dialog v-dialogDrag :close-on-click-modal='false' :title="dialogTitle" :visible.sync="dialogVisible"
      width="420px" append-to-body>
      <el-form ref="tableForm" :model="tableForm" label-width="140px" :rules="rules">
        <el-form-item :label="$t('base.button.processName')" prop="wfName">
          <el-input v-model="tableForm.wfName" style="margin-left: 10px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
        <el-button size="small" type="primary" @click="submitForm">{{ $t('base.button.confirm') }}</el-button>
      </span>
    </el-dialog>

    <div v-show="false">
      <a title="download">{{ $t('base.button.download') }}</a>
      <a ref="saveDiagram" href="javascript:" title="download BPMN diagram">BPMN</a>
      <a ref="saveSvg" href="javascript:" title="download as SVG image">SVG</a>
    </div>
  </div>
</template>

<script>
import postApi from "@/api/document/indexApi.js";
import BpmnModeler from 'bpmn-js/lib/Modeler';

import PropertyPanel from './PropertyPanel.vue' // 属性面板
import BpmData from './BpmData'
import customTranslateModule from './bpmn-config/customTranslate'
import bpmdData from './xmlMode'
export default {
  name: 'workflow',
  inheritAttrs: true,
  props: {
    parentPage: {
      type: String,
      default: 'setting'
    },
    xmlModel: {
      type: Function
    },
    xmlData: {
      type: String
    },
    ProjectIUID: {
      type: String,
      default: 'SystemWorkflows'
    },
    isEditable: {
      type: Boolean,
      default: true
    },
    viewMode: {
      //是否显示保存版本按钮
      type: Boolean,
      default: true
    },
    isLeftBpmn: {
      //生成配置实例
      type: Array,
      default: () => [customTranslateModule]
    },
    tableRowData: {
      //传递过来显示的数据
      type: Object,
    },
    close: {
      type: Function
    },
    workflowName: '',
  },

  computed: {
    isOpen() {
      if (this.viewMode == false) {
        return true;
      }
      else if (this.parentPage == 'project') {
        return this.projectWorkflow.length != 0
      } else {
        return this.templateWorkflow.length != 0
      }
    },
    isEditableA() {
      return this.isEditable
    }
  },
  data() {
    return {
      tableRow: {},
      WfID: '',
      projId: '', //模版流程传SystemWorkflows  项目流程传项目id
      bpmnXmlStr: '<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" targetNamespace="http://bpmn.io/schema/bpmn" id="Definitions_1"><bpmn:process id="Process_1" isExecutable="false"><bpmn:startEvent id="StartEvent_1"/></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"><dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>',
      bpmnXmlStrCopy: '<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" targetNamespace="http://bpmn.io/schema/bpmn" id="Definitions_1"><bpmn:process id="Process_1" isExecutable="false"><bpmn:startEvent id="StartEvent_1"/></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"><dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>',
      xmlJsonOutput: '',
      tempWfSelect: [],
      projWfSelect: [],
      nodeFormList: [],
      isSystemTemplate: '',
      element: [],
      nodesGateway: [],
      templateWorkflow: [],
      projectWorkflow: [],
      value: '',
      isSaving: false,
      disabled: true,
      bpmnModeler: {},
      element: null,
      bpmData: new BpmData(),
      xmlStr: '',
      //
      templateVisible: false,

      //
      isAdd: false,
      dialogVisible: false,
      dialogTitle: '',
      tableForm: {
        wfCode: '',
        wfName: '',
        TableName: '',
        FormPath: '',
        ReportPath: ''
      },
      rules: {
        wfName: [{
          required: true,
          message: '请填写工作流名称',
          trigger: 'blur'
        }],
      }
    }
  },
  components: {
    PropertyPanel
  },
  mounted() {
    this.queryData()
    // 生成实例
    this.bpmnModeler = new BpmnModeler({
      container: '#canvas',
      additionalModules: this.isLeftBpmn
    })
    console.log(this.bpmnModeler);

    this.aLinkInit()
    this.shapeRemove()      //清理表单，监听移除元素
    this.shapeAdd()         //初始化表单，监听添加元素
    this.nodeActive()       //监听添加元素点击高亮
    this.nodeNameChange()   //监听任务名称改变
  },
  beforeDestroy() {
    this.bpmnModeler = {}
  },
  watch: {
    ProjectIUID() {
      this.$nextTick(() => {
        this.queryData()
      })
    }
  },
  methods: {
    queryData() {
      if (this.viewMode) {
        this.queryWorkflow('SystemWorkflows');
        if (this.parentPage == 'project') {
          this.queryCheckedTemp()
          this.queryProjectWf();
        }
      }
    },
    refreshData() {
      if (this.parentPage == 'project') {
        this.queryProjectWf()
      } else {
        this.queryWorkflow('SystemWorkflows');
      }
    },
    async queryCheckedTemp() {
      let data = {
        ProjectIUID: this.ProjectIUID
      };
      let res = await postApi.post('/api/projectworkflow/GetuniteProjectWork', this.$objectToFormData(data));
      if (res.code == 1) {
        this.tempWfSelect = JSON.parse(JSON.stringify(res.data.workflowCode));
      }
    },
    async queryProjectWf() {
      this.projectWorkflow = []
      let data = {
        rows: 99,
        page: 1,
        type: 'all',
        projectId: this.ProjectIUID
      };
      var res = await postApi.post('/api/Workflow/getWorkflowList', this.$objectToFormData(data));
      if (res.code == 1) {
        res.data.forEach(item => {
          item.xmlJson = item.xmlJson || item.xMLJson
        })

        this.projectWorkflow = res.data;
        if (res.count > 0) {
          this.showThisWF(this.projectWorkflow[0]);
        }
      }
    },
    async queryWorkflow(id) {
      this.templateWorkflow = []
      let queryForm = new FormData();
      queryForm.append('rows', 99);
      queryForm.append('page', 1);
      queryForm.append('projectId', id);

      var res = await postApi.post('/api/Workflow/getWorkflowList', queryForm);
      if (res.code == 1) {

        res.data.forEach(item => {
          item.xmlJson = item.xmlJson || item.xMLJson
        })

        this.templateWorkflow = res.data;
        if (this.parentPage != 'project') {
          if (res.count > 0) {
            this.showThisWF(this.templateWorkflow[0]);
          }
        }
      }
    },

    async saveTempToProject() {
      if (this.tempWfSelect.length == 0) {
        this.$warning('请选择要使用的模版')
      } else {
        let data = {
          ProjectIUID: this.ProjectIUID,
          workflowCode: this.tempWfSelect
        };
        let res = await postApi.post('/api/projectworkflow/SetupProjectWorkflow', data);
        if (res.code == 1) {
          this.$success(res.msg);;
          this.templateVisible = false
          this.refreshData()
        }
      }
    },
    aLinkInit() {
      // 获取a标签dom节点
      const downloadLink = this.$refs.saveDiagram;
      const downloadSvgLink = this.$refs.saveSvg;
      // 监听流程图改变事件
      const _this = this;
      // 新增流程定义
      this.$nextTick(async () => {
        await this.saveSVG((err, svg) => {
          this.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
        });
        await this.saveDiagram((err, xml) => {
          this.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
        });
        this.createNewDiagram();
      });
      _this.bpmnModeler.on('commandStack.changed', async (r) => {
        _this.disabled = false;
        await _this.saveSVG(function (err, svg) {
          _this.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
        });
        await _this.saveDiagram(function (err, xml) {
          _this.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
        });
      });
    },
    async chooseTemplate() {
      await this.queryCheckedTemp()
      this.templateVisible = true;
    },


    nodeNameChange() {
      this.bpmnModeler.on('element.changed', (r) => {
        this.nodeFormList.forEach(item => {
          if (item.id == r.element.id) {
            item.name = r.element.businessObject.name;
          }
        });
        this.element.forEach(item => {
          if (item.id == r.element.id) {
            item = r.element;
          }
        });
      });
    },
    nodeActive() {
      this.bpmnModeler.on('selection.changed', (r) => {
        if (r.newSelection.length == 1) {
          this.nodeFormList.forEach(item => {
            if (item.id == r.newSelection[0].id) {
              item.act = true;
            } else {
              item.act = false;
            }
          });
        } else {
          this.nodeFormList.forEach(item => item.act = false);
        }
      });
    },
    bpmnDragable(bool) {
      this.bpmnModeler.on('element.click', function (event) {
        var element = event.element;
        element.draggable = bool;
        console.log(event);
      });
    },
    showDialogWf() {
      this.shapeRemove();
      this.createNewDiagram(); //流程图重绘

    },
    showThisWF(row, type) {
      this.projId = type;
      if (type == 'SystemWorkflows') {
        this.bpmnDragable(true)
      } else {
        if (row.projectId == 'SystemWorkflows') {
          this.bpmnDragable(false)
        } else {
          this.bpmnDragable(true)
        }
      }
      this.shapeRemove();
      this.tableRow = row;
      this.WfID = row.id;
      if (row.whether && row.whether != 'null') {
        this.bpmnXmlStr = row.xmlJson;
      } else {
        this.bpmnXmlStr = this.bpmnXmlStrCopy;
      }
      this.$nextTick(() => {
        this.createNewDiagram(); //流程图重绘
        this.disabled = true; //保存默认不能点击
        this.value = ''; // 模板清空
      });
    },
    shapeRemove() {
      this.bpmnModeler.on('shape.removed', (r) => {
        let element = r.element;
        this.nodeFormList.forEach((item, idx) => {
          if (item.id == element.id) {
            this.nodeFormList.splice(idx, 1);
          }
        });
      });
    },
    shapeAdd() {
      this.bpmnModeler.on('shape.added', (r) => {
        if (r.element.type == 'bpmn:Task') {
          let element = r.element;
          var form = {
            name: element.businessObject.name || '',
            id: element.businessObject.id,
            type: element.type,
            act: false,
            stepsType: 'task',
            OperationPerson: element.businessObject.$attrs.OperationPerson || ''
          };

          // if (form.userType === 'candidateUsers') {
          //     form.candidateUsers = form.candidateUsers.split(',') || []
          // }
          this.nodeFormList.push(form);
          this.element.push(element);
        }
      });
    },
    selectChange(data) {
      this.$emit('xmlModel', bpmdData[data].xml);
      this.disabled = false;
    },
    async createNewDiagram() {
      // 将字符串转换成图显示出来
      this.nodeFormList = []; //流程图重绘
      this.element = []; //流程图重绘
      try {
        await this.bpmnModeler.importXML(this.bpmnXmlStr);
        this.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto');
        this.adjustPalette();
      } catch (err) {
        // console.log(err);
      }
    },
    // 调整左侧工具栏排版
    adjustPalette() {
      try {
        // 获取 bpmn 设计器实例
        const canvas = this.$refs.canvas;
        const pane = canvas.children[0].children[1].children[5];
        var paneStyle = {
          width: '48px',
          height: '244px',
          background: '#fafafa',
          left: '15px',
        };
        for (var key in paneStyle) {
          pane.style[key] = paneStyle[key];
        }
        //  原样式设置
        /*  const djsPalette = canvas.children[0].children[1].children[5]
         var djsPalStyle = {
             width: '130px',
             height: '480px',
             padding: '5px',
             background: '#fafafa',
             left: '15px',
             borderRadius: '8px',
         }
         for (var key in djsPalStyle) {
             djsPalette.style[key] = djsPalStyle[key]
         }
         if (!this.viewMode) djsPalette.style['display'] = 'none';
         const palette = djsPalette.children[0]
         const allGroups = palette.children
         console.log(allGroups);
         allGroups[0].style['display'] = 'none'
         // 修改控件样式
         for (var gKey in allGroups) {
             const group = allGroups[gKey]
             for (var cKey in group.children) {
                 const control = group.children[cKey]
                 const controlStyle = {
                     display: 'flex',
                     justifyContent: 'flex-start',
                     alignItems: 'center',
                     width: '100%',
                     padding: '5px'
                 }
                 if (control.className && control.dataset && control.className.indexOf('entry') !== -1) {
                     const controlProps = this.bpmData.getControl(control.dataset.action)
                     control.innerHTML = `<div style='font-size: 14px;font-weight:500;margin-left:15px;'>${controlProps['title']}</div>`
                     for (var csKey in controlStyle) {
                         control.style[csKey] = controlStyle[csKey]
                     }
                 }
             }
         } */
      } catch (e) {
        console.log(e);
      }
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    async saveSVG(done) {
      // 把传入的done再传给bpmn原型的saveSVG函数调用
      // await this.bpmnModeler.saveSVG(done)
      try {
        const result = await this.bpmnModeler.saveSVG(done);
        const { svg } = result;
        done(svg);
      } catch (err) {
        done(err);
      }
    },
    // 下载为XML格式,done是个函数，调用的时候传入的
    async saveDiagram(done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      // await this.bpmnModeler.saveXML({
      //     format: true
      // }, function (err, xml) {
      //     done(err, xml)
      // })
      try {
        const result = await this.bpmnModeler.saveXML(done);
        const { xml } = result;
        done(xml);
      } catch (err) {
        done(err);
      }
    },
    save(type) {
      if (this.isSaving) {
        this.$message.warning('正在保存中，请稍后操作');
        return;
      }
      if (this.$refs.panel.fromValidate()) {
        this.submitWorkflow(this.xmlStr);
      } else {
        this.$confirm('节点信息填写未完善，是否保存？').then(() => {
          this.submitWorkflow(this.xmlStr);
        });
      }
    },
    xmlStr2XmlObj(xmlStr) {
      var xmlObj = {};
      if (document.all) {
        var xmlDom = new ActiveXObject("Microsoft.XMLDOM");
        xmlDom.loadXML(xmlStr);
        xmlObj = xmlDom;
      } else {
        xmlObj = new DOMParser().parseFromString(xmlStr, "text/xml");
      }
      return xmlObj;
    },
    xml2json(xml) {
      try {
        var obj = {};
        if (xml.children.length > 0) {
          for (var i = 0; i < xml.children.length; i++) {
            var item = xml.children.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
              obj[nodeName] = this.xml2json(item);
            } else {
              if (typeof (obj[nodeName].push) == "undefined") {
                var old = obj[nodeName];
                obj[nodeName] = [];
                obj[nodeName].push(old);
              }
              obj[nodeName].push(this.xml2json(item));
            }
          }
        } else {
          obj = xml.textContent;
        }
        return obj;
      } catch (e) { }
    },
    xmlObj2json(xml) {
      var xmlObj = this.xmlStr2XmlObj(xml);
      var jsonObj = {};
      if (xmlObj.childNodes.length > 0) {
        jsonObj = this.xml2json(xmlObj);
      }
      return jsonObj;
    },
    xmlStrToJsonObj(xmlStr) {
      var xmlObj = this.xmlStrToXmlObj(xmlStr);
      var jsonObj = {};
      if (xmlObj.childNodes.length > 0) {
        jsonObj = this.xmlObjToJsonObj(xmlObj.childNodes);
      }
      return jsonObj;
    },
    xmlStrToXmlObj(xmlStr) {
      var xmlObj = {};
      if (document.all) {
        var xmlDom = new ActiveXObject("Microsoft.XMLDOM");
        xmlDom.loadXML(xmlStr);
        xmlObj = xmlDom;
      } else {
        xmlObj = new DOMParser().parseFromString(xmlStr, "text/xml");
      }
      return xmlObj;
    },
    xmlObjToJsonObj(xmlNodes) {
      var obj = {};
      var list = [];
      var listGateway = [];
      var sequenceFlow = [];
      if (xmlNodes.length == 0) {
        obj = '';
      } else {
        for (var i = 0; i < xmlNodes.length; i++) {
          var node = xmlNodes[i];
          if (node.tagName == "bpmn:task") {
            // obj = node.nodeValue;
            list.push(node);
            this.nodes = list;
          }
          if (node.tagName == "bpmn:exclusiveGateway") {
            listGateway.push(node);
            this.nodesGateway = listGateway;
          }
          if (node.tagName == "bpmn:sequenceFlow") {
            sequenceFlow.push(node);
            this.sequenceFlow = sequenceFlow;
          } else {
            var key = node.tagName;
            var value = this.xmlObjToJsonObj(node.childNodes);
            obj[key] = value;
          }
        }
      }
      return obj;
    },
    async submitWorkflow(xmlJson, wfID) {
      this.isSaving = true;
      if (!xmlJson) {
        this.$warning('流程未更改');
        this.isSaving = false;
      }
      else {
        this.xmlJsonOutput = this.xmlObj2json(xmlJson);
        var obj = new Object();
        obj.WfID = wfID ? wfID : this.WfID; // 流程ID
        obj.xmlJson = xmlJson; // 流程图
        obj.nodes = [];
        obj.exclusiveGateway = [];
        if (xmlJson) {
          obj.xmlJson = xmlJson;
        } else {
          obj.xmlJson = this.bpmnXmlStr;
        }
        this.nodes = [];
        var nodesList = [];
        this.xmlStrToJsonObj(obj.xmlJson);
        for (let key in this.nodes) {
          var objNode = {};
          for (var i = 0, atts = this.nodes[key].attributes, n = atts.length, arr = []; i < n; i++) {
            objNode[atts[i].nodeName] = this.nodes[key].getAttribute(atts[i].nodeName);
          }
          nodesList.push(objNode);
        }
        var nodesGateway = [];
        for (let key in this.nodesGateway) {
          var objNode = {};
          for (var i = 0, atts = this.nodesGateway[key].attributes, n = atts.length, arr = []; i < n; i++) {
            objNode[atts[i].nodeName] = this.nodesGateway[key].getAttribute(atts[i].nodeName);
          }
          nodesGateway.push(objNode);
        }
        var sequenceFlow = [];
        for (let key in this.sequenceFlow) {
          var objNode = {};
          for (var i = 0, atts = this.sequenceFlow[key].attributes, n = atts.length, arr = []; i < n; i++) {
            objNode[atts[i].nodeName] = this.sequenceFlow[key].getAttribute(atts[i].nodeName);
          }
          sequenceFlow.push(objNode);
        }
        var ot0 = 'bpmn:definitions';
        var ot1 = 'bpmn:exclusiveGateway';
        var ot2 = 'bpmn:task';
        var ot3 = 'bpmn:incoming';
        var ot4 = 'bpmn:outgoing';
        var ot5 = 'bpmn:process';
        // 拼数据
        // console.log(this.xmlJsonOutput);
        let task = this.xmlJsonOutput['bpmn:definitions']['bpmn:process']['bpmn:task'];
        nodesList.forEach((item, key) => {
          item.incoming = [];
          item.outgoing = [];
          if (nodesList.length == 1) {
            item.incoming.push(task[ot3]);
            item.outgoing.push(task[ot4]);
          } else if (nodesList.length > 1) {
            item.incoming.push(task[key][ot3]);
            item.outgoing.push(task[key][ot4]);
          }
          // if (Array.isArray(this.xmlJsonOutput[ot0][ot5][ot2][key][ot4])) {
          //   item.outgoing = this.xmlJsonOutput[ot0][ot5][ot2][key][ot4]
          // } else {
          //   item.outgoing.push(this.xmlJsonOutput[ot0][ot5][ot2][key][ot4])
          // }
        });
        obj.nodes = JSON.stringify(nodesList);
        nodesGateway.forEach((item, key) => {
          item.incoming = [];
          item.outgoing = [];
          if (nodesList.length > 1) {
            item.incoming = this.xmlJsonOutput[ot0][ot5][ot1][key][ot3];
            item.outgoing = this.xmlJsonOutput[ot0][ot5][ot1][key][ot4];
          } else {
            item.incoming = this.xmlJsonOutput[ot0][ot5][ot1][ot3];
            item.outgoing = this.xmlJsonOutput[ot0][ot5][ot1][ot4];
          }
        });
        // 对象转数组对象
        nodesGateway.forEach((item) => {
          if (!Array.isArray(item.incoming)) {
            item.incoming = [item.incoming];
          }
          if (!Array.isArray(item.outgoing)) {
            item.incoming = [item.outgoing];
          }
        });
        if (!this.xmlJsonOutput[ot0][ot5]['bpmn:startEvent']) {
          this.$error('缺少开始节点');
          this.isSaving = false;
          return;
        } else if (!this.xmlJsonOutput[ot0][ot5]['bpmn:endEvent']) {
          this.$error('缺少结束节点');
          this.isSaving = false;
          return;
        } else {
          obj.startEvent = this.xmlJsonOutput[ot0][ot5]['bpmn:startEvent'][ot4];
          obj.endEvent = this.xmlJsonOutput[ot0][ot5]['bpmn:endEvent'][ot3];
          var formData = new FormData();
          formData.append('WfID', obj.WfID);
          formData.append('xmlJson', obj.xmlJson);
          formData.append('nodes', obj.nodes);
          formData.append('startEvent', obj.startEvent);
          formData.append('endEvent', obj.endEvent);
          formData.append('exclusiveGateway', JSON.stringify(nodesGateway));
          formData.append('sequenceFlow', JSON.stringify(sequenceFlow));
          var res = await postApi.post('/api/Workflow/SaveEditCustomWF', formData);
          this.isSaving = false;
          if (res.code == 1) {
            this.$success(res.msg);
            if (this.ProjectIUID) {
              this.$emit('close')
            }
            this.WfID = res.data;
            this.refreshData()
          }
        }

      }
    },
    saveToTemplate() {
      if (this.isSaving) {
        this.$message.warning('正在保存中，请稍后操作');
        return;
      }
      if (this.$refs.panel.fromValidate()) {
        this.$emit('saveToTemplate', this.xmlStr);
      } else {
        this.$confirm('节点信息填写未完善，是否保存？').then(() => {
          this.$emit('saveToTemplate', this.xmlStr);
        });
      }
    },
    // 当图发生改变的时候会调用这个函数，这个data就是图的xml
    setEncoded(link, name, data) {
      // 把xml转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data);
      // 获取到图的xml，保存就是把这个xml提交给后台
      this.xmlStr = data;
      // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
      if (data) {
        link.className = 'active';
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData;
        link.download = name;
      }
    },
    init() {
      this.$refs['panel'].init();
    },
    addWorkflow(id) {
      this.isAdd = true;
      this.projId = id;
      this.dialogVisible = true;
      this.initForm()
      this.dialogTitle = (id == 'SystemWorkflows' ? this.$t('base.button.createTemplateProcess') : this.$t('base.button.createProjectProcess'));
    },
    editWorkflow(row, id) {
      this.isAdd = false;
      this.projId = id;
      this.dialogTitle = this.$t('base.button.editProcess');
      this.dialogVisible = true;

      this.tableForm.wfName = row.wfName;
      this.tableForm.wfCode = row.wfCode;
      this.tableForm.TableName = row.tableName;
      this.formID = row.id;
    },
    initForm() {
      this.$nextTick(() => {
        this.tableForm = {
          wfCode: '',
          wfName: '',
          TableName: '',
          FormPath: '',
          ReportPath: ''
        };
        this.$refs['tableForm'].resetFields();
      });
    },
    async submitForm() {
      this.$refs['tableForm'].validate(async (valid) => {
        if (valid) {
          var url = '/api/Workflow/saveWfInfo?formID=' + (this.isAdd ? '0' : this.formID);
          var formData = this.$objectToFormData(this.tableForm);
          formData.append('projectId', this.projId);
          var res = await postApi.post(url, formData);
          if (res.code == 1) {
            this.$success(res.msg);
            this.dialogVisible = false;
            this.refreshData()
          }
        }
      });
    },
    async cancelUse(item) { },
    async deleteWorkflows(item) {
      this.$confirm('确定删除该流程吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var obj = {}
        let url = ''
        if (this.parentPage == 'project' && item.projectId == 'SystemWorkflows') {
          obj = {
            ProjectIUID: this.ProjectIUID,
            WorkflowCode: item.wfCode
          }
          url = '/api/Workflow/delWFByUniteProjectWork'
        } else {
          obj = {
            ids: [item.id]
          }
          url = '/api/Workflow/delWF'
        }
        if (this.ProjectIUID) {
        }
        var res = await postApi.post(url, this.$objectToFormData(obj));
        if (res.code == 1) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.refreshData()
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
      });
    },
  },
}
</script>

<style lang="scss">
@import 'bpmn-js/dist/assets/diagram-js.css';
@import './bpmn-config/hide-bpmn-item.scss';
@import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
@import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
@import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

.containers {
  width: 100%;
  height: 80vh;
  position: relative;

  .canvasMask {
    position: absolute;
    z-index: 9;
    width: 100%;
    height: 100%;
    user-select: none;
    cursor: not-allowed;
  }

  .dailog {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 300px;
  }

  .wf-list-box {
    width: 240px;
    height: calc(100vh - 120px);
    overflow-y: auto;
    position: relative;
    z-index: 1001;
    border-right: 1px solid #ddd;

    .wf-title {
      margin-left: 10px;
    }

    .wf-btn {
      margin-right: 10px;
    }

    .wf-list {
      .wf-item {
        height: 48px;
        padding: 0 10px;
        border-bottom: 1px solid #eee;

        .wf-name {
          cursor: pointer;
          font-size: 15px;
          flex-grow: 1;
          margin-left: 10px;

          &:hover {
            color: #409eff;
          }

          &.active {
            color: #409eff;
            font-weight: bold;
          }
        }
      }
    }

  }

  .canvas {
    width: calc(100% - 500px);
    // height: calc(100% - 40px);
    background-color: #ffffff;
  }

  .canvas-dialog {
    position: absolute;
    top: 0px;
    left: 0px;
    width: calc(100% - 300px);
    height: calc(100% - 0px);
    background-color: #ebeef5;
    //   border: 1px solid #ebeef5;
  }

  .panel {
    // position: absolute;
    right: 0;
    // top: 40px;
    width: 300px;
    height: calc(100% - 40px);
    background-color: #ffffff;
  }

  .panel-dialog {
    position: absolute;
    right: 0;
    top: 80px;
    width: 300px;
    height: calc(100% - 80px);
  }

  .bjs-powered-by {
    display: none;
  }

  .toolbar-select {
    position: absolute;
    top: 10px;
    left: 200px;
  }

  .saveBtn {
    position: absolute;
    top: 0;
    right: 30px;
  }

  .toolbar {
    position: absolute;
    display: flex;
    align-items: center;
    right: 300px;

    a {
      text-decoration: none;
      cursor: pointer;
      margin: 5px;
      color: #ebeef5;
    }

    .active {
      color: #409eff;
    }
  }

  .toolbar-dialog {
    position: absolute;
    top: 50px;
    display: flex;
    align-items: center;
    right: 10px;

    a {
      text-decoration: none;
      cursor: pointer;
      margin: 5px;
      color: #ebeef5;
    }

    .active {
      color: #409eff;
    }
  }
}
</style>

<style>
.djs-palette {
  /* height: calc(100% - 30px); */
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
