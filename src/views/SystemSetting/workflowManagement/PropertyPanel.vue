<template>
  <div class="property-panel hide-scroll" ref="propertyPanel">
    <template v-for="(form, idx) in nodeFormList">
      <el-form :model="form" ref="form" v-show="form.stepsType != 'state'" :rules="rules" label-width="108px" style="padding-top:20px;border-radius: 6px; margin: 3px 3px 0;border: 1px solid #ccc;" :style="{ 'background': (form.act ? '#ecf5ff' : '#fff') }" size="small">
        <el-form-item :label="$t('base.button.nodeName')" prop="name" style="height: 43px;margin-left:8px">
          <el-input v-model="form.name" :disabled="!isEditable" :placeholder="$t('base.button.inputNodeName')" @input="nameChange(...arguments, idx)" class="property-item"></el-input>
        </el-form-item>
        <!-- 角色 -->
        <el-form-item :label="$t('base.button.roleType')" prop="OperationPerson" style="height: 43px;margin-left:8px">
          <el-select class="property-item" :disabled="!enableChange" v-model="form.OperationPerson" :placeholder="$t('base.button.selectRoleType')" clearable @change="selected(...arguments, idx)">
            <el-option v-for="item in UserstreeData" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>

          <!-- <ParentCheck @selected="selected(...arguments, idx)" :props="treeDefaultProps" /> -->
        </el-form-item>
        <el-form-item :label="$t('base.button.stepType')" v-show="0" style="height: 43px;margin-left:8px">
          <el-select disabled v-model="form.stepsType" class="property-item" :placeholder="$t('base.button.pleaseSelect')" @change="stepsTypeChange(...arguments, idx)">
            <el-option value="task" :label="$t('base.button.taskNode')"></el-option>
            <el-option value="state" :label="$t('base.button.stateNode')"></el-option>
            <el-option value="fork" :label="$t('base.button.forkNode')"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <!-- <div style="text-align: right; padding-right: 16px; padding-top: 20px;" v-if="!newWoker">
        <el-button type="primary" size="mini" :disabled='disabled' v-if="!disabled" @click="updateStep">保存流程</el-button>
    </div> -->
  </div>
</template>
<script>
import postApi from "@/api/document/indexApi";

export default {
  name: 'PropertyPanel',
  inheritAttrs: true,
  props: {
    isEditable: {
      type: Boolean,
      default: true
    },
    modeler: {
      type: Object,
      required: true
    },
    newWoker: {
      type: Boolean,
      default: true
    },
    WfID: {
      type: Number,
      default: 0
    },
    xmlStr: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: true
    },
    enableChange: {
      type: Boolean,
      default: true
    },
    nodeFormList: {
      type: Array,
      default: []
    },
    element: {
      type: Array,
      default: []
    },
    nodeActive: {
      type: Function,
      default: null
    },

  },
  computed: {
    userTask() {
      if (!this.element.length > 0) {
        return
      }
      return this.element.type === 'bpmn:UserTask'
    },
    sequenceFlow() {
      if (!this.element.length > 0) {
        return
      }
      return this.element.type === 'bpmn:SequenceFlow'
    }
  },
  components: {},
  data() {
    return {
      isDisabled: false,
      UserstreeData: [],
      UserTableNameData: [],
      treeDefaultProps: {
        parent: 'ParentID', // 父级唯一标识
        value: 'ID', // 唯一标识
        label: 'RoleName', //'OrganizeName', // 标签显示
        children: 'children', // 子级
        typeName: 'typeName',
        disabled: function (data, node) { // 使“专业”不可选
          if (data.typeName == '专业') {
            return true; // !data.leaf
          }
        }
      },
      rules: {
        name: [
          { required: true, message: '请输入节点名称', trigger: 'blur' },
        ],
        OperationPerson: [
          { required: true, message: '请选择角色类型', trigger: 'blur' },
        ],
        stepsType: [
          { required: true, message: '请输入步骤类型', trigger: 'blur' },
        ],
      },
      tableDefaultProps: {
        parent: 'ParentID', // 父级唯一标识
        value: 'column_name', // 唯一标识
        label: 'columns_chn_name', // 标签显示
        children: 'children', // 子级
        typeName: 'typeName'
      },
    }
  },
  async created() {
    // this.handleModeler()
    this.queryUserstreeData()
  },
  methods: {
    async queryUserstreeData(){
      let queryForm = new FormData();
      queryForm.append('projectId', 'SystemWorkflows');
      var res = await postApi.post('/api/Permission/GetRoleList', queryForm);
      if (res.code === 1) {
        this.UserstreeData = res.data;
      }
    },
    async updateStep() { // 保存当前流程，不改变流程的ID
      this.form.WfID = this.WfID
      this.form.xmlStr = this.xmlStr
      if (this.form.IsApp == 'undefined') {
        this.form.IsApp = false
      }
      var res = await postApi.post('/api/WorkFlow/UpdateStep', this.$objectToFormData(this.form));
      if (res.code == 1) {
        this.$message({
          message: '成功',
          type: 'success'
        })
      }
      this.$emit('referData', {})
    },

    init() {
      this.$refs['form'].resetFields()
    },
    // 属性面板名称，更新回流程节点
    nameChange(name, idx) {
      const modeling = this.modeler.get('modeling')
      modeling.updateLabel(this.element[idx], name)
    },
    //步骤类型
    stepsTypeChange(name, idx) {
      this.updateProperties({
        stepsType: name
      }, idx)
    },
    //选择角色
    selected(lable, idx) {
      this.updateProperties({
        OperationPerson: lable
      }, idx)
    },
    // 在这里我们封装一个通用的更新节点属性的方法
    updateProperties(properties, idx) {
      const modeling = this.modeler.get('modeling')
      modeling.updateProperties(this.element[idx], properties)
    },
    fromValidate() {
      var is = 0
      this.$refs['form'].forEach(item => {
        item.validate((valid) => {
          if (valid) {
            return
          } else {
            is += 1
          }
        })
      })
      return is == 0
    }
  }
}
</script>
<style lang="scss" scoped>
.property-panel {
  position: absolute;
  right: 0px;
  border-left: 1px solid #cccccc;
  margin: 0px;
  width: 288px;
  height: calc(100vh - 91px);
  overflow-y: scroll;
}

.property-item {
  // margin-left: 10px;
  width: 160px;
  height: 32px;
}
</style>
<style>
.property-panel .personItem .el-form-item__error {
  margin-top: -10px;
}
</style>
