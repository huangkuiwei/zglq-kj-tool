
let columnIdSeed = 0
export default {
    name: 'ksj-table-column',
    computed: {
        tableColumnId () {
            return 'columnId-' + (columnIdSeed++)
        },
        table () {
            return this.$parent
        }
    },
    props: {
        label: String,
        prop: String,
        width: String,
        align: String,
        type: String,
        sortable:Boolean,
        filterRangeBoxable:Boolean,
        filterCheckBoxData:Array,
        timeRangeBoxable:Boolean
    },
    watch:{
        filterCheckBoxData(){   
            const column = this.getSelfColumn()
            this.table._replaceColumn(column)
        }
    },
    methods: {
        getSelfColumn(){
            return {
                tableId: this.table.tableId,
                columnId: this.tableColumnId,
                order: null,
                label: this.label,
                prop: this.prop,
                originWidth: this.width,
                width: this.width,
                slots: this.$slots.default,
                align: this.align,
                renderCell: this.renderCell,
                type: this.type,
                sortable:this.sortable,

                //列显示属性
                visible:true,

                // 筛选多选框属性
                filterContainerVisible:false,
                filterCheckBoxData:this.filterCheckBoxData,
                cheboxIsIndeterminate:false,
                cheboxCheckAll:false,
                cheboxChecked:[],

                //筛选区域框属性
                filterRangeBoxable:this.filterRangeBoxable,
                rangeStart: null,
                rangeEnd: null,
                rangeCache:{rangeStart:null,rangeEnd: null},

                //筛选时间区域框属性
                timeRangeBoxable:this.timeRangeBoxable,
                timeRange:null
            }
        },
        renderCell (data, index,column) {
            let curIndex = index + 1
            if (this.type === 'index') {
                column.width = 50
                return curIndex
            }
            if (this.$scopedSlots.default) return this.$scopedSlots.default({
                $index: curIndex,
                row: data
            })
            return data[this.prop]
        }
    },
    created () {
        let column = this.getSelfColumn()
        //this.table.store.insertColumn(column)
        this.table.columns.push(column)
        this.table.columnsCacheData.push(column)
    },
    render (h) {
        return h('div', this.$slots.default)
    }
}