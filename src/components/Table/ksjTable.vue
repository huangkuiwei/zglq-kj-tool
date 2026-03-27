<template>
  <div :style="{ height: height + 'px' }">
    <!-- <el-button @click="removeFirstRow">删除一行</el-button> -->
    <div class="ksjTableFilterContainer" v-if="columnsFilters.length > 0"> 过滤条件： <template v-for="(item, index) in columnsFilters">
        <el-tag style="margin-right: 10px" closable v-if="!item.filterClear" :key="index" @close="handleFilterClose(item)">
          {{ formartFilterText(item) }}
        </el-tag>
      </template>
    </div>
    <div class="ksjTableContainer" style="position: relative; overflow-x: auto; overflow-y: hidden" :style="{
        height: (columnsFilters.length > 0 ? height - 40 : height) + 'px',
      }">
      <div id="hDiv" style="width: 100%; height: 39px; position: absolute">
        <table class="ksjTable" style="position: absolute">
          <thead>
            <tr>
              <template v-for="(column, index) in columns">
                <th v-if="column.visible" :key="`th-${column.label}${column.prop}${index}`" :style="getHeaderCellStyle(column)" class="ksjTableTh">
                  <div class="header-container" :class="{
                      'sort-asc': column.order === 'ascending',
                      'sort-desc': column.order === 'descending',
                      'filter-actived': column.filterable,
                    }">
                    <span class="sort-clickable" v-if="column.sortable" @click="sortChange(column)">
                      <i>
                        <svg _ngcontent-sft-c165="" width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                          <defs _ngcontent-sft-c165="">
                            <circle _ngcontent-sft-c165="" id="sort-svg-path-1" cx="8" cy="8" r="8"></circle>
                            <filter _ngcontent-sft-c165="" x="-34.4%" y="-21.9%" width="168.8%" height="168.8%" filterUnits="objectBoundingBox" id="filter-2">
                              <feOffset _ngcontent-sft-c165="" dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                              <feGaussianBlur _ngcontent-sft-c165="" stdDeviation="1.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                              <feColorMatrix _ngcontent-sft-c165="" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.085309222 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
                            </filter>
                          </defs>
                          <g _ngcontent-sft-c165="" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <use _ngcontent-sft-c165="" fill-rule="evenodd" xlink:href="#sort-svg-path-1"></use>
                            <polygon _ngcontent-sft-c165="" points="8 4 11 7 5 7"></polygon>
                            <polygon _ngcontent-sft-c165="" points="8 12 5 9 11 9"></polygon>
                          </g>
                        </svg>
                      </i>
                    </span>
                    <el-popover popper-class="filterCheboxPopover" style="margin-top: 0; width: inherit; min-width: inherit" placement="bottom" width="160" v-model="column.filterContainerVisible" v-if="
                        (column.filterCheckBoxData &&
                          column.filterCheckBoxData.length > 0) ||
                        column.filterRangeBoxable || column.timeRangeBoxable
                      ">
                      <template v-if="
                          column.filterCheckBoxData &&
                          column.filterCheckBoxData.length > 0
                        ">
                        <el-checkbox :indeterminate="column.cheboxIsIndeterminate" v-model="column.cheboxCheckAll" @change="(val) => handleCheckAllChange(val, column)">全选</el-checkbox>
                        <div style="max-height:200px;overflow:auto;margin-top:10px">
                          <el-checkbox-group v-model="column.cheboxChecked" @change="(value) => handleCheckedChange(value, column)">
                            <el-checkbox class="filterCheckbox" v-for="(item, index) in column.filterCheckBoxData" :label="item.key" :key="index">{{ item.value }}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </template>
                      <template v-if="column.filterRangeBoxable">
                        <el-input v-model="column.rangeStart" style="width: 50px" size="mini"></el-input> - <el-input v-model="column.rangeEnd" style="width: 50px" size="mini"></el-input>
                      </template>
                      <template v-if="column.timeRangeBoxable">
                        <el-date-picker v-model="column.timeRange" type="datetimerange" :picker-options="timeRangeBoxOptions" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" align="right">
                        </el-date-picker>
                      </template>
                      <div style="
                          margin-top: 10px;
                          text-align: center;
                          padding-top: 5px;
                          border-top: 1px solid #ebeef5;
                        ">
                        <el-button size="mini" type="text" @click="handleFilterChange(column, true)">{{ $t('base.button.reset') }}</el-button>
                        <el-button type="text" size="mini" @click="handleFilterChange(column)">{{ $t('base.button.confirm') }}</el-button>
                      </div>
                      <span class="filter-clickable" slot="reference">
                        <svg _ngcontent-otf-c119="" width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                          <g _ngcontent-otf-c119="" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g _ngcontent-otf-c119="">
                              <polygon _ngcontent-otf-c119="" id="Triangle-3" points="10.0085775 7 10.0085775 15 6 13 6 7 2 3 2 1 14 1 14 3"></polygon>
                            </g>
                          </g>
                        </svg>
                      </span>
                    </el-popover>
                    <!-- <el-checkbox v-if="column.type === 'selection'" v-model="tableAllSelected"></el-checkbox> -->
                    <span class="title">{{ column.label }}</span>
                    <span class="resize-handle" v-drag="{ column }"></span>
                    <div class="overlay"></div>
                  </div>
                </th>
              </template>
            </tr>
          </thead>
        </table>
      </div>
      <div id="bodyDiv" style="position: absolute; top: 39px; overflow-y: auto" :style="{ height: columnsFilters.length > 0 ? height - 88 + 'px':height - 39 +'px' }">
        <ksj-table-body :store="store" @checked="tableChecked(false)" :tableData.sync="tableDataInside" @clickRow="$emit('clickRow', $event)"></ksj-table-body>
      </div>
      <slot />
      <ksjTableColumnSet :visible.sync="columnSetVisibleData" :columns.sync="columns" />
    </div>
  </div>
</template>
<script>
  import ksjTableStore from "./ksjTableStore";
  import ksjTableBody from "./ksjTableBody";
  import ksjTableColumnSet from "./ksjTableColumnPropertiesSet";
  import _ from 'lodash'
  let tableIdSeed = 0;
  export default {
    name: "ksjTable",
    components: {
      ksjTableBody,
      ksjTableColumnSet,
    },
    props: {
      tableData: {
        type: Array,
        default: () => [],
      },
      defaultSort: {
        type: Object,
      },
      height: {
        type: Number | String,
        default: "300",
      },
      columnSetVisible: {
        type: Boolean,
      },
    },
    watch: {
      tableData() {
        // this.tableDataInside = _.cloneDeep(this.tableData)
        this.tableDataInside = this.tableData
        this.tableDataInside.forEach((item) => {
          item.checkBoxChecked = false
        })
      },
      columnSetVisibleData() {
        this.$emit("update:columnSetVisible", this.columnSetVisibleData);
      },
      columnSetVisible() {
        this.columnSetVisibleData = this.columnSetVisible;
      },
      tableAllSelected() {
        if (this.tableAllSelected) {
          this.tableDataInside.forEach(element => {
            element.checkBoxChecked = true
          });
          this.tableChecked(true)
        } else {
          this.tableDataInside.forEach(element => {
            element.checkBoxChecked = false
          });
          this.tableChecked(false)
        }
      }
    },
    data() {
      return {
        timeRangeBoxOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        store: null,
        columns: [],
        columnsCacheData: [],
        tTD: {
          mouseDown: false,
          oldX: null,
          oldWidth: null,
        },
        visible: false,
        checkAll: false,
        isIndeterminate: true,
        columnSetVisibleData: false,
        columnsFilters: [],
        tableAllSelected: false,
        tableDataInside: []
      };
    },
    created() {
      // let store = new ksjTableStore(this.tableId)
      // this.store = store
    },
    mounted() {
      //this.columns = this.store.getColumns()
      this.$nextTick(() => {
        if (this.defaultSort) {
          this.initSortColumn();
        }
      })
    },
    computed: {
      tableId() {
        return "tableId-" + tableIdSeed++;
      },
      getSortClass() {
        return function(order) {
          if (order === "descending") {
            return "sort-desc";
          } else if (order === "ascending") {
            return "sort-asc";
          }
        };
      },
    },
    directives: {
      drag: function(el, binding) {
        let dragBox = el;
        dragBox.onmousedown = (e) => {
          var targetE = e;
          var tTD = e.target.parentNode.parentNode;
          tTD.className = "";
          var tableHeight = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.clientHeight;
          var tableThHeight = tTD.clientHeight;
          var tableResizehandleHeight = e.target.clientHeight;
          e.target.nextElementSibling.style.height = tableHeight - tableThHeight + "px";
          e.target.nextElementSibling.style.display = "block";
          e.target.nextElementSibling.style.top = tableResizehandleHeight + "px";
          e.target.style.display = "none";
          tTD.mouseDown = true;
          tTD.oldX = e.x;
          tTD.oldWidth = tTD.offsetWidth;
          document.onmousemove = (e) => {
            if (tTD === undefined) tTD = e.target.parentNode.parentNode;
            //调整宽度
            if (tTD.mouseDown != null && tTD.mouseDown === true) {
              if (tTD.oldWidth + (e.x - tTD.oldX) > 0) {
                binding.value.column.width = tTD.oldWidth + (e.x - tTD.oldX);
              }
            }
          };
          document.onmouseup = (e) => {
            //结束宽度调整
            targetE.target.nextElementSibling.style.display = "none";
            targetE.target.style.display = "inline-block";
            if (tTD === undefined) tTD = targetE.target.parentNode.parentNode;
            tTD.className = "ksjTableTh";
            tTD.mouseDown = false;
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      },
    },
    methods: {
      removeFirstRow() {
        this.tableDataInside.shift()
      },
      tableChecked(checkAll) {
        var checkList
        if (checkAll) {
          checkList = this.tableData
        } else {
          var checkIndexList = []
          for (let index = 0; index < this.tableDataInside.length; index++) {
            const element = this.tableDataInside[index].checkBoxChecked;
            if (element) {
              checkIndexList.push(index)
            }
          }
          var checkList = checkIndexList.map((item) => {
            return this.tableData[item]
          })
        }
        this.$emit("selection-change", checkList)
      },
      removeColumn() {
        this.columns.splice(0, 1);
        this.columns.splice(2, 1);
      },
      getHeaderCellStyle(column) {
        if (column.width && column.width > 0) {
          return {
            width: column.width + "px",
            'text-align': column.align
          };
        }
      },
      initSortColumn() {
        var sortColumn = this.columns.find((item) => {
          return item.prop === this.defaultSort.prop;
        });
        if (sortColumn) {
          sortColumn.order = this.defaultSort.order;
        }
      },
      sortChange(column) {
        if (column.order === "descending") {
          column.order = null;
        } else if (column.order === "ascending") {
          column.order = "descending";
          this._setOtherColumnOrderNull(column.prop);
        } else if (column.order === null) {
          column.order = "ascending";
          this._setOtherColumnOrderNull(column.prop);
        }
        this._replaceColumn(column);
        this.$emit("sort-change", column, column.prop, column.order);
      },
      _setOtherColumnOrderNull(beforeColumnprop) {
        const orderColumn = this.columns.find((item) => {
          return item.prop != beforeColumnprop && item.order != null;
        });
        if (orderColumn) {
          orderColumn.order = null;
          this._replaceColumn(orderColumn);
        }
      },
      handleCheckAllChange(val, column) {
        column.cheboxChecked = val ? column.filterCheckBoxData.map((item) => {
          return item.key;
        }) : [];
        column.cheboxIsIndeterminate = false;
        this._replaceColumn(column);
      },
      handleCheckedChange(value, column) {
        let checkedCount = column.cheboxChecked.length; //此处不可拿value作为选中值，el-chebox中v-model绑定的数组中对象，在el内部未改变其值。
        column.cheboxCheckAll = checkedCount === column.filterCheckBoxData.length;
        column.cheboxIsIndeterminate = checkedCount > 0 && checkedCount < column.filterCheckBoxData.length;
        this._replaceColumn(column);
      },
      _replaceColumn(column) {
        this.columns.splice(this.columns.findIndex((item) => {
          return item.prop == column.prop;
        }), 1, column);
      },
      handleFilterChange(column, isReset = false) {
        var filterClear = false;
        var callBackData;
        //多选框过滤相关
        if (column.filterCheckBoxData && column.filterCheckBoxData.length > 0) {
          if (column.cheboxChecked.length === 0) {
            column.filterable = false;
            filterClear = true;
          }
          if (column.cheboxChecked.length > 0) {
            column.filterable = true;
          }
          if (isReset) {
            this.filterResetTransfer(column, true);
            filterClear = true;
          }
          this.columnsFiltersDealTransfer(column, filterClear, true);
          callBackData = this.callBackDataTransfer(column, true);
        }
        //区域框过滤相关
        if (column.filterRangeBoxable) {
          if (column.rangeStart || column.rangeEnd) {
            column.filterable = true;
          } else {
            column.filterable = false;
            filterClear = true;
          }
          if (isReset) {
            this.filterResetTransfer(column, false, true);
            filterClear = true;
          }
          column.rangeCache = {
            rangeStart: column.rangeStart,
            rangeEnd: column.rangeEnd,
          };
          this.columnsFiltersDealTransfer(column, filterClear, false, true);
          callBackData = this.callBackDataTransfer(column, false, true);
        }
        if (column.timeRangeBoxable) {
          if (column.timeRange) {
            column.filterable = true
          } else {
            column.filterable = false
            filterClear = true;
          }
          if (isReset) {
            this.filterResetTransfer(column, false, false, true);
            filterClear = true;
          }
          this.columnsFiltersDealTransfer(column, filterClear, false, false, true);
          callBackData = this.callBackDataTransfer(column, false, false, true);
        }
        column.filterContainerVisible = false;
        this._replaceColumn(column);
        this.$emit("filter-change", {
          key: column.prop,
          value: callBackData
        });
      },
      callBackDataTransfer(column, isCheckBox, isRangeBox, isDateRangeBox) {
        var callBackData;
        if (isRangeBox) {
          callBackData = {
            rangeStart: column.rangeStart,
            rangeEnd: column.rangeEnd,
          };
        }
        if (isCheckBox) {
          callBackData = column.cheboxChecked;
        }
        if (isDateRangeBox) {
          callBackData = column.timeRange
        }
        return callBackData;
      },
      filterResetTransfer(column, isCheckBox, isRangeBox, isDateRangeBox) {
        if (isCheckBox) {
          column.cheboxChecked = [];
          column.cheboxCheckAll = false;
          column.cheboxIsIndeterminate = null;
          column.filterable = false;
        }
        if (isRangeBox) {
          column.rangeStart = null;
          column.rangeEnd = null;
          column.filterable = false;
        }
        if (isDateRangeBox) {
          column.timeRange = null
          column.filterable = false
        }
      },
      formartFilterText(filterItem) {
        var filterText;
        if (filterItem.isRangeBox) {
          filterText = (filterItem.value.rangeStart ? filterItem.value.rangeStart : 0) + " ~ " + (filterItem.value.rangeEnd ? filterItem.value.rangeEnd : "无限");
        }
        if (filterItem.isCheckBox) {
          filterText = filterItem.value.join(", ");
        }
        if (filterItem.isDateRangeBox) {
          filterText = filterItem.value.join(" ~ ");
        }
        return filterItem.label + "：" + filterText;
      },
      handleFilterClose(filterItem) {
        var column = this.columns.find((item) => {
          return item.prop == filterItem.prop;
        });
        this.filterResetTransfer(column, filterItem.isCheckBox, filterItem.isRangeBox, filterItem.isDateRangeBox);
        var callBackData = this.callBackDataTransfer(column, filterItem.isCheckBox, filterItem.isRangeBox, filterItem.isDateRangeBox);
        this.columnsFilters.splice(this.columnsFilters.findIndex((item) => {
          return item.prop == filterItem.prop;
        }), 1);
        this.$emit("filter-change", {
          key: column.prop,
          value: callBackData
        });
      },
      columnsFiltersDealTransfer(column, filterClear, isCheckBox, isRangeBox, isDateRangeBox) {
        var columnFilter;
        var filterHasSign = this.columnsFilters.find((item) => {
          return item.prop == column.prop;
        });
        if (isCheckBox) {
          columnFilter = {
            isCheckBox: true,
            value: column.cheboxChecked.map((checkItem) => {
              return column.filterCheckBoxData.find((item) => {
                return item.key == checkItem;
              }).value;
            }),
            filterClear,
            label: column.label,
            prop: column.prop,
          };
        }
        if (isRangeBox) {
          columnFilter = {
            isRangeBox: true,
            value: {
              rangeStart: column.rangeStart,
              rangeEnd: column.rangeEnd
            },
            label: column.label,
            filterClear,
            prop: column.prop,
          };
        }
        if (isDateRangeBox) {
          columnFilter = {
            isDateRangeBox: true,
            value: column.timeRange,
            label: column.label,
            filterClear,
            prop: column.prop,
          };
        }
        this.columnsFiltersDataTransfer(columnFilter, filterHasSign);
      },
      columnsFiltersDataTransfer(columnFilter, filterHasSign) {
        if (columnFilter.filterClear) {
          var index = this.columnsFilters.findIndex((item) => {
            return item.prop == columnFilter.prop;
          })
          if (index == -1) {
            return
          }
          this.columnsFilters.splice(index, 1);
        } else {
          if (filterHasSign === undefined) {
            this.columnsFilters.push(columnFilter);
          } else {
            this.columnsFilters.splice(this.columnsFilters.findIndex((item) => {
              return item.prop == columnFilter.prop;
            }), 1, columnFilter);
          }
        }
      },
    },
  };
</script>
<style>
  .ksjTableFilterContainer {
    height: 40px;
    line-height: 32px;
    font-size: 13px;
    white-space: nowrap;
    overflow-x: unset;
    overflow-y: auto;
  }

  .ksjTableContainer table {
    border-collapse: collapse;
    table-layout: fixed;
  }

  .ksjTableContainer table td,
  .ksjTableContainer table th,
  .ksjTableContainer .title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .header-container .title {
    padding-left: 20px;
    user-select: none;
  }

  .ksjTable {
    /* margin-top: 10px; */
    height: 37px;
    /* padding-top: 10px; */
    width: 100%;
    bottom: 0;
  }

  .filterCheckbox {
    display: block !important;
  }

  .filterCheboxPopover {
    margin-top: 0 !important;
    width: inherit !important;
    min-width: inherit !important;
    padding-bottom: 5px !important;
  }

  /* .header-container:hover {
  background: #f2f5fc;
} */
  .header-container:hover .resize-handle {
    border-right: 3px solid#adb0b8;
  }

  .header-container:hover svg[_ngcontent-sft-c165] g[_ngcontent-sft-c165] use[_ngcontent-sft-c165],
  .header-container:hover svg[_ngcontent-otf-c119] g[_ngcontent-otf-c119] {
    fill: #dfe1e6;
    /* fill:#5e7ce0 */
  }

  .filter-clickable {
    position: absolute;
    right: 0px;
    padding-top: 5px;
    transform: translateX(-50%);
    /* padding: 8px 0; */
    cursor: pointer;
    top: 0;
  }

  .sort-clickable:hover svg[_ngcontent-sft-c165] g[_ngcontent-sft-c165] use[_ngcontent-sft-c165],
  .sort-desc svg[_ngcontent-sft-c165] use[_ngcontent-sft-c165],
  .sort-asc svg[_ngcontent-sft-c165] use[_ngcontent-sft-c165],
  .sort-desc:hover svg[_ngcontent-sft-c165] g[_ngcontent-sft-c165] use[_ngcontent-sft-c165],
  .sort-asc:hover svg[_ngcontent-sft-c165] g[_ngcontent-sft-c165] use[_ngcontent-sft-c165],
  .filter-clickable:hover svg[_ngcontent-otf-c119] g[_ngcontent-otf-c119],
  .filter-actived .filter-clickable svg[_ngcontent-otf-c119] g[_ngcontent-otf-c119] {
    fill: #409eff;
  }

  .sort-asc .sort-clickable:hover svg[_ngcontent-sft-c165] g[_ngcontent-sft-c165] use[_ngcontent-sft-c165],
  .sort-desc .sort-clickable:hover svg[_ngcontent-sft-c165] g[_ngcontent-sft-c165] use[_ngcontent-sft-c165] {
    fill: #1989fa;
  }

  .sort-asc,
  .sort-desc,
  .filter-actived {
    background: #f2f5fc;
  }

  .header-container:hover svg[_ngcontent-sft-c165] g[_ngcontent-sft-c165] polygon[_ngcontent-sft-c165],
  .sort-clickable:hover svg[_ngcontent-sft-c165] g[_ngcontent-sft-c165] polygon[_ngcontent-sft-c165],
  .sort-asc svg[_ngcontent-sft-c165] g[_ngcontent-sft-c165] polygon[_ngcontent-sft-c165],
  .sort-desc svg[_ngcontent-sft-c165] g[_ngcontent-sft-c165] polygon[_ngcontent-sft-c165],
  .sort-asc:hover svg[_ngcontent-sft-c165] g[_ngcontent-sft-c165] polygon[_ngcontent-sft-c165],
  .sort-desc:hover svg[_ngcontent-sft-c165] g[_ngcontent-sft-c165] polygon[_ngcontent-sft-c165] {
    fill: #fff;
  }

  .sort-asc svg[_ngcontent-sft-c165] g[_ngcontent-sft-c165] polygon[_ngcontent-sft-c165]:last-of-type,
  .sort-asc:hover svg[_ngcontent-sft-c165] g[_ngcontent-sft-c165] polygon[_ngcontent-sft-c165]:last-of-type,
  .sort-desc svg[_ngcontent-sft-c165] g[_ngcontent-sft-c165] polygon[_ngcontent-sft-c165]:first-of-type,
  .sort-desc:hover svg[_ngcontent-sft-c165] g[_ngcontent-sft-c165] polygon[_ngcontent-sft-c165]:first-of-type {
    opacity: 0.3;
  }

  .header-container {
    margin-top: 6px;
    position: relative;
    display: flex;
    align-items: center;
    /* padding-left: 10px;
  padding-right: 8px; */
  }

  .ksjTableContainer tr th {
    width: calc(100% - 16px - 2px);
    padding: 0;
    line-height: 36px;
    vertical-align: middle;
    /* white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden; */
    /* font-size: 12px; */
    font-weight: 700;
    color: #252b3a;
    background: #e4e7ed;
  }

  .ksjTableContainer table td {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 14px;
    /* padding: 8.5px 10px; */
    height: 44px;
    /* 表格行高*/
    line-height: 44px;
    /* 表格行高*/
    min-width: 0;
    box-sizing: border-box;
    vertical-align: middle;
    position: relative;
    text-align: left;
    color: #606266;
  }

  .ksjTableContainer table tr {
    border-bottom: 1px solid #ebeef5;
  }

  .overlay {
    position: absolute;
    background: #adb0b8;
    display: none;
    width: 2px;
    /* top:36px; */
    right: 0;
    z-index: 666;
  }

  .resize-handle {
    border-right: 1px solid #fff var(--devui-line, #adb0b8);
    display: inline-block;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    cursor: col-resize;
  }

  .sort-clickable {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px;
    padding-bottom: 8px;
    height: 16px;
    cursor: pointer;
  }

  input {
    outline: none;
  }
</style>
<style lang="scss">
  //表格斑马纹效果
  .ksj-table-column-stripe {
    background: #ffffff; //#f5f7fa;
  }

  //表格点击当前行高亮
  .ksj-table-column.selected {
    background: #d3d7d4;
  }

  //表格鼠标放上去当前行高亮
  .ksj-table-column {
    &:hover {
      background: #e4e7ed;
    }
  }
</style>
