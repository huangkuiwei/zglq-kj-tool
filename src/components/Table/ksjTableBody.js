export default {
  name: 'ksj-table-body',
  computed: {
    table() {
      return this.$parent
    }
  },
  props: {
    store: {
      require: true
    },
    tableData: {
      type: Array | null
    }
  },
  watch: {
    tableData: {
      handler() {
      },
      deep: true
    }
  },
  methods: {
    getBodyCellStyle(column) {
      if (column.width && column.width > 0) {
        return {
          width: column.width + 'px',
          'text-align': column.align
        }
      }
    },
    checkboxClick(index) {
      this.tableData[index].checkBoxChecked = !this.tableData[index].checkBoxChecked
      this.$emit("update:tableData", this.tableData)
      this.$emit("checked", null)
    },

    clickRow(index) {
      let row = this.tableData[index]
      this.$emit("clickRow", row)
    }
  },
  render(h) {
    return (
      <table style="width:100%">
        <tbody>
          {(this.tableData && this.tableData.length > 0) ? this.tableData.map((row, index) =>
            <tr class={[index % 2 ? 'ksj-table-column-stripe ksj-table-column' : 'ksj-table-column', row.selected ? 'selected' : '']} onClick={() => this.clickRow(index)}>
              {this.table.columns.map(column =>
                column.visible ?
                  <td style={this.getBodyCellStyle(column)}>
                    {column.type == "selection" ?
                      (row.checkBoxChecked ?

                        <el-checkbox type="checkbox" checked value={row.checkBoxChecked} onChange={() => this.checkboxClick(index)} style="line-height: 30.5px;" />
                        : <el-checkbox type="el-checkbox" value={row.checkBoxChecked} onChange={() => this.checkboxClick(index)} style="line-height: 30.5px;" />)
                      :
                      column.renderCell(row, index, column)}
                  </td> :
                  ""
              )}
            </tr>)
            :
            <tr></tr>
          }
        </tbody>
      </table >
    )
  }
}
