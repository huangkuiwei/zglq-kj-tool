<template>
  <transition name="el-zoom-in-top">
    <div class="tableColumnPage" v-if="visible">
      <div class="tableColumnContainer">
        <div style="height: 30px">
          <el-link
            class="tableColumnPageCloseBtn"
            icon="el-icon-close"
            @click="closeDialog"
          ></el-link>
        </div>
        <div class="tableColumnHeader">设置列表显示字段</div>
        <div class="tableColumnBaseContainer">
          <div class="inline tableColumnBaseLeft">
            <div class="tableColumnBaseHeader">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                size="mini"
                >全选</el-checkbox
              >
            </div>
            <div class="tableColumnBaseContent">
              <el-checkbox-group
                v-model="checkedColumns"
                @change="checkColumnsChange"
              >
                <template v-for="item in columnsInside">
                  <el-checkbox
                    :label="item.columnId"
                    :key="item.columnId"
                    style="margin-top: 15px; width: 146px"
                    >{{ item.label }}</el-checkbox
                  >
                </template>
              </el-checkbox-group>
            </div>
          </div>
          <div class="inline tableColumnBaseRight">
            <div class="tableColumnBaseHeader">当前选定字段</div>
            <div style="padding-top: 13px">
              <draggable
                v-model="columnsInside"
                chosenClass="chosen"
                forceFallback="true"
                group="people"
                animation="200"
                style="height: 400px; overflow: auto"
              >
                <transition-group>
                  <template v-for="item in columnsInside">
                    <div
                      class="item"
                      v-if="item.visible"
                      :key="item.columnId"
                    >
                      <img
                        style="
                          width: 14px;
                          height: 14px;
                          margin-right: 5px;
                          vertical-align: text-top;
                        "
                        src="../../assets/shunxu.svg"
                      />
                      {{ item.label }}
                      <el-link
                        icon="el-icon-close"
                        @click.stop="removeItem(item)"
                        style="float: right; margin-right: 18px"
                      ></el-link>
                    </div>
                  </template>

                </transition-group>
              </draggable>
            </div>
          </div>
          <div style="clear: both"></div>
        </div>
        <div class="operateBtnContainer">
          <el-button type="primary" size="small" @click="confirm"
            >{{ $t('base.button.confirm') }}</el-button
          >
          <el-button size="small" @click="closeDialog">{{ $t('base.button.cancel') }}</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import draggable from "vuedraggable";
import _ from 'lodash'

export default {
  components: {
    draggable,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    //初始列(Array) data:
    columns: {
      type: Array,
    },
    // //经过更改的列数据【回传给父页面】
    // columnsChanged:{
    //   type:Array
    // }
  },
  data() {
    return {
      checkedColumns: this.columns.map((item) => {
        return item.columnId;
      }),
      checkAll: true,
      isIndeterminate: false,
      columnsCheckList: [],
      columnsInside:[]
    };
  },
  mounted(){
    this.columnsInside =  _.cloneDeep(this.columns)  // JSON.parse(JSON.stringify(this.columns))
  },
  watch:{
    columns(){
      this.columnsInside =  _.cloneDeep(this.columns) // JSON.parse(JSON.stringify(this.columns))
    },
    checkedColumns(){
      this.columnsInside.forEach(item=>{
        if(this.checkedColumns.find(checkedItem=>{return item.columnId == checkedItem}) === undefined){
          item.visible = false
        }
        else{
          item.visible = true
        }
      })
    }
  },
  methods: {
    closeDialog() {
      this.$emit("update:visible", false);
    },
    removeItem(item) {
      item.visible = false
      this.checkedColumns.splice(this.checkedColumns.indexOf(item.columnId), 1);
    },
    checkColumnsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.columnsInside.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.columnsInside.length;
    },
    handleCheckAllChange(val) {
      this.checkedColumns = val
        ? this.columnsInside.map((item) => {
            return item.columnId;
          })
        : [];
      this.isIndeterminate = false;


      this.columnsInside.forEach(item=>{
        val? item.visible = true : item.visible = false
      })
    },
    confirm() {
      // var _self = this;
      // var checkedColumns;

      // if (this.checkedColumns && this.checkedColumns.length > 0) {
      //   checkedColumns = this.checkedColumns.map((element) => {
      //     return _self.columnsInside.find((item) => {
      //       return item.columnId == element;
      //     });
      //   });
      // }

      this.$emit("update:columns", this.columnsInside);
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style scoped>
.tableColumnPageCloseBtn {
  float: right;
  margin-top: 15px;
}
.tableColumnPage {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.tableColumnContainer {
  width: 1065px;
  background: white;
  padding: 0 30px 0 30px;
  border: 1px solid #d8d8d8;
  margin: 0 auto;
  margin-top: 200px;
}

.tableColumnHeader {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 18px;
}
.tableColumnBaseContainer {
  font-size: 0;
  /* height:450px; */
  border: 1px solid #d8d8d8;
}
.operateBtnContainer {
  height: 70px;
  line-height: 70px;
  text-align: center;
}
.inline {
  display: inline-block;
  /* float:left; */
  /*   height: 300px; */
}
.tableColumnBaseLeft {
  /* border-right: 1px solid #d8d8d8; */
  width: 750px;
  height: 100%;
}
.tableColumnBaseRight {
  font-size: 14px;
  color: #606266;
  width: 250px;
  float: right;
  border-left: 1px solid #d8d8d8;
}
.tableColumnBaseHeader {
  padding-left: 20px;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #d8d8d8;
}
.tableColumnBaseContent {
  padding: 20px;
  padding-top: 5px;
  height: 400px;
  overflow: auto;
}

/*被拖拽对象的样式*/
.item {
  padding: 7px 0 7px 15px;
  background-color: #fdfdfd;
  cursor: move;
}
.item:hover {
  background: #f0f2f5;
}
/*选中样式*/
.chosen {
  border: solid 1px #3089dc !important;
}
</style>
