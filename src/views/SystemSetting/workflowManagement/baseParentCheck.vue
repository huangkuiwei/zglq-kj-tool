<!-- 树状选择器 -->
<template>
  <el-popover ref="popover" :placement="placement" :disabled="ParentChooseDisabled" trigger="click" @show="onShowPopover" @hide="onHidePopover">
    <el-tree
        ref="tree"
        class="select-tree"
        highlight-current
        :style="`min-width: ${treeWidth}`"
        :data="data"
        :default-checked-keys="defaultChecked"
        :props="props"
        :node-key="props.value"
        :show-checkbox="showCheckbox"
        :expand-on-click-node="false"
        :check-strictly="checkStrictly"
        :filter-node-method="filterNode"
        :default-expand-all="defaultExpandAll"
        @node-click="onClickNode"
        @check="check">
    </el-tree>
    <el-input slot="reference" readonly ref="input" v-model="labelModel" :disabled="ParentChooseDisabled" :style="`width: ${width}px`" :class="{ 'rotate': showStatus }" suffix-icon="el-icon-arrow-down" :placeholder="placeholder" />
  </el-popover>
</template>
<script>
  export default {
    name: 'parentCheck',
    props: {
      // 接收绑定参数
      value: [String, Number],
      // 输入框宽度
      width: String,
      // 选项数据
      options: {
        type: Array,
        required: true,
      },
      // 是否禁用
      ParentChooseDisabled: {
        type: Boolean,
        default: () => false
      },
      //只能选择子节点
      onlyChilren: {
        type: Boolean,
        default: false,
      },
      isParentData: {
        type: Boolean,
        default: false,
      },
      // 是否展开
      defaultExpandAll: {
        type: Boolean,
        default: false,
      },
      //父子节点是否关联
      checkStrictly: {
        type: Boolean,
        default: true,
      },
      // 输入框占位符
      placeholder: {
        type: String,
        required: false,
        default: '请选择(默认第一级)',
      },
      //是否显示 checkbox
      showCheckbox: {
        type: Boolean,
        default: false,
      },
      // 树节点配置选项
      props: {
        type: Object,
        required: false,
        default: () => ({
          parent: 'parentId',
          value: 'rowGuid',
          label: 'areaName',
          children: 'children',
          typeName: 'typeName',
        }),
      },
      // 父节点默认字段
      ParentCode: {
        type: String,
        default: () => '0'
      },
      //动态设置该组件位置（有些地方在浏览器最下方会看不到弹框）
      placement: {
        type: String,
        default: 'bottom-start'
      }
    },
    // 设置绑定参数
    model: {
      prop: 'value',
      event: 'selected',
    },
    watch: {
      labelModel(val) {},
      value: {
        handler(newName, oldName) {
          // 传入的newName可能是：1[1212234434](父节点ID+姓名ID)，处理掉父节点ID，by YGP
          if(newName) {
            // debugger
            var values = newName.split(',');
            var fatherIds = [];
            for (var i = 0; i < values.length; i++) {
              fatherIds.push("-1");
              var index1 = values[i].indexOf('[');
              if (index1 != -1) {
                var index2 = values[i].lastIndexOf(']');
                fatherIds[i] = values[i].substring(0, index1);
                values[i] = values[i].substring(index1 + 1, index2);
              }
            }
            newName = values.join(','); // userID
            let labelModel = [...new Set(this.queryTree(this.data, newName, fatherIds))];
            let valueModel = [...new Set(this.queryTreeValue(this.data, newName, fatherIds))];
            this.labelModel = labelModel.join(',')
            this.valueModel = newName
            console.log(valueModel);
            if (valueModel.length > 0) {
              this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys(valueModel)
              })
            } else {
              this.defaultChecked = []
              this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys([''])
              })
            }
          }
          // this.$forceUpdate()
        },
        deep: true,
        immediate: true
      },
    },
    computed: {
      value1() {
        return this.value
      },
      // 是否为树状结构数据
      dataType() {
        const jsonStr = JSON.stringify(this.options);
        return jsonStr.indexOf(this.props.children) !== -1;
      },
      // 若非树状结构，则转化为树状结构数据
      data() {
        return this.dataType ? this.options : this.switchTree();
      },
    },
    data() {
      return {
        // 树状菜单显示状态
        showStatus: false,
        // 菜单宽度
        treeWidth: 'auto',
        // 输入框显示值
        labelModel: '',
        // 实际请求传值
        valueModel: '',
        treeDataLit: [],
        defaultChecked: []
      };
    },
    created() {
      // this.labelModel = ''
      // this.valueModel = ''
      // // 检测输入框原有值并显示对应 label
      // if (this.value) {
      // }
      // // 获取输入框宽度同步至树状菜单宽度
      // this.$nextTick(() => {
      //   this.treeWidth = `${(this.width || this.$refs.input.$refs.input.clientWidth) - 24}px`;
      // });
    },
    methods: {
      // 节点改变：  对角色人员选择，可以选择角色，也可以选择人员
      check(checkedNodes, checkedKeys) {
        let checkList = checkedKeys.checkedNodes;
        let labelList = []
        let valueList = []
        let roleList = []; // 人员时所属的角色id
        for (let item in checkList) {
          if (!this.isParentData) {
            //不需要父级数据
            if (!checkList[item].children) {
              labelList.push(checkedKeys.checkedNodes[[item]][this.props.label])
              valueList.push(checkedKeys.checkedNodes[[item]][this.props.value])
            } else {
              if (checkList[item].children.length == 0) {
                labelList.push(checkedKeys.checkedNodes[[item]][this.props.label])
                valueList.push(checkedKeys.checkedNodes[[item]][this.props.value])
              }
            }
          } else {
            //需要父级数据
            labelList.push(checkedKeys.checkedNodes[[item]][this.props.label])
            valueList.push(checkedKeys.checkedNodes[[item]][this.props.value])
            // 保存父节点ID
            if (!checkList[item].typeName == '人员') roleList.push('99999999'); // 特殊处理没有专业没有角色的人员
            else {
              if (!checkList[item].children) roleList.push(checkList[item].ParentID) // 子节点则保存其父节点ID
              else roleList.push('');
            }
          }
        }
        labelList = [...new Set(labelList)];
        valueList = [...new Set(valueList)];
        roleList = [...new Set(roleList)];
        this.labelModel = labelList.join(',')
        var value = "";
        for (var i = 0; i < valueList.length; i++) { // 特殊处理用户id, 在其前加入父节点id, by YGP
          if (roleList[i] == '') value += valueList[i];
          else value += roleList[i] + '[' + valueList[i] + ']';
          if (i != valueList.length - 1) value += ',';
        }
        this.valueModel = value; //valueList.join(',')
        // alert(this.labelModel)
        // alert(this.valueModel)
        //此事件用于单独处理表单验证（因多选框选择值并没有赋值，而是等弹框隐藏才赋值，所以表单验证还是会有提示）
        this.$emit('change', this.valueModel);
      },
      // 单击节点
      onClickNode(node) {
        if (!this.onlyChilren) {
          if (!this.showCheckbox) {
            this.labelModel = node[this.props.label];
            this.valueModel = node[this.props.value];
            this.onCloseTree();
          }
        } else {
          if (!this.showCheckbox) {
            if (!node.children) {
              this.labelModel = node[this.props.label];
              this.valueModel = node[this.props.value];
              this.onCloseTree();
            }
          }
        }
      },
      // 偏平数组转化为树状层级结构
      switchTree() {
        return this.cleanChildren(this.buildTree(this.options, this.ParentCode));
      },
      // 隐藏树状菜单
      onCloseTree() {
        this.$refs.popover.showPopper = false;
      },
      // 显示时触发
      onShowPopover() {
        this.showStatus = true;
        this.$refs.tree.filter(false);
        this.$emit('onShowPopover', this)
      },
      // 隐藏时触发
      onHidePopover() {
        this.showStatus = false;
        this.$refs['input'].blur();
        this.$emit('selected', this.valueModel);
      },
      // 树节点过滤方法
      filterNode(query, data) {
        if (!query) return true;
        return data[this.props.label].indexOf(query) !== -1;
      },
      //目录树拆解
      toggleTreeData(rows) {
        if (rows) {
          rows.forEach(row => {
            this.treeDataLit.push(row)
            if (row[this.props.children]) {
              this.toggleTreeData(row[this.props.children])
            }
          });
        }
      },
      // 搜索树状数据中的label
      queryTree(tree, id, fatherIds) {
        if (id) {
          if (this.showCheckbox) {
            var idList = id.split(',')
          } else {
            var idList = [id]
          }
        }
        this.treeDataLit = []
        let list = []
        let stark = [];
        stark = stark.concat(tree);
        this.toggleTreeData(stark)
        var parentId = "";
        for (let key in this.treeDataLit) {
          if (this.treeDataLit[key][this.props.typeName] == '角色') parentId = this.treeDataLit[key][this.props.value]
          for (var item = 0; item < idList.length; item++) {
            if (this.treeDataLit[key][this.props.value] == idList[item] && (fatherIds[item] == "-1" || fatherIds[item] == parentId)) {
              list.push(this.treeDataLit[key][this.props.label])
            }
          }
        }
        return list
      },
      queryTreeValue(tree, id, fatherIds) {
        if (id) {
          if (this.showCheckbox) {
            var idList = id.split(',')
          } else {
            var idList = [id]
          }
        }
        this.treeDataLit = []
        let list = []
        let stark = [];
        stark = stark.concat(tree);
        this.toggleTreeData(stark)
        var parentId = "";
        for (let key in this.treeDataLit) {
          if (this.treeDataLit[key][this.props.typeName] == '角色') parentId = this.treeDataLit[key][this.props.value]
          for (var item = 0; item < idList.length; item++) {
            if (this.treeDataLit[key][this.props.value] == idList[item] && (fatherIds[item] == "-1" || fatherIds[item] == parentId)) {
              list.push(this.treeDataLit[key][this.props.value])
            }
          }
        }
        return list
      },
      // 将一维的扁平数组转换为多层级对象
      buildTree(data, id = this.ParentCode) {
        const fa = (parentId) => {
          const temp = [];
          for (let i = 0; i < data.length; i++) {
            const n = data[i];
            if (n[this.props.parent] === parentId) {
              n.children = fa(n.rowGuid);
              temp.push(n);
            }
          }
          return temp;
        };
        return fa(id);
      },
      // 清除空 children项
      cleanChildren(data) {
        const fa = (list) => {
          list.map((e) => {
            if (e.children.length) {
              fa(e.children);
            } else {
              delete e.children;
            }
            return e;
          });
          return list;
        };
        return fa(data);
      },
      initData() {
        this.$nextTick(() => {
          this.labelModel = ''
          this.defaultChecked = []
          this.$refs.tree.setCheckedKeys([]);
        })
      }
    },
  };
</script>
<style>
  .el-input.el-input--suffix {
    cursor: pointer;
    overflow: hidden;
  }

  .el-input.el-input--suffix.rotate .el-input__suffix {
    transform: rotate(180deg);
  }

  .select-tree {
    max-height: 350px;
    overflow-y: scroll;
  }

  /* 菜单滚动条 */
  .select-tree::-webkit-scrollbar {
    z-index: 11;
    width: 6px;
  }

  .select-tree::-webkit-scrollbar-track,
  .select-tree::-webkit-scrollbar-corner {
    background: #fff;
  }

  .select-tree::-webkit-scrollbar-thumb {
    border-radius: 5px;
    width: 6px;
    background: #b4bccc;
  }

  .select-tree::-webkit-scrollbar-track-piece {
    background: #fff;
    width: 6px;
  }
</style>
