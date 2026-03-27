<template>
  <el-dialog
      title="关联图纸文件"
      append-to-body
      class="link-model2-dialog"
      :visible.sync="visible"
      v-dialogDrag
      width="800px"
      @close="$emit('update:visible', false)"
  >
    <div class="content">
      <el-tree
          class="left-tree"
          show-checkbox
          check-strictly
          :data="localList"
          ref="elTree"
          node-key="iuid"
          highlight-current
          :props="folderTreeProps"
          @check-change="checkChange"
      >
      </el-tree>
      <div class="middle">
        <el-button size="medium" @click="joinFile">加入</el-button>
        <el-button size="medium" @click="remove">移除</el-button>
      </div>
      <el-tree
          class="right"
          show-checkbox
          check-strictly
          :data="selectFile"
          ref="elTree2"
          node-key="iuid"
          highlight-current
      >
      </el-tree>
    </div>

    <div style="margin-top: 20px; display: flex; align-items: center; justify-content: flex-end">
      <el-button size="medium" type="primary" @click="submit">{{ $t('base.button.confirm') }}</el-button>
      <el-button size="medium" @click="$emit('update:visible', false)">{{ $t('base.button.cancel') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default{
  name: 'LinkModel2Dialog.vue',

  props: {
    visible: {
      type: Boolean,
      required: true
    },

    list: {
      type: Array,
      default: () => []
    },

    linkModelFiles: {
      type: Array,
      default: () => []
    },

    openedProject: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      folderTreeProps: {
        label: "fileName",
      },
      selectFile: []
    }
  },

  computed: {
    localList() {
      // let cur = this.list.find(item => item.iuid === this.openedProject.projGuid)
      let copyList = JSON.parse(JSON.stringify(this.list))
      this.handledList(copyList)
      return copyList
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.linkModelFiles.forEach(item => {
        this.$refs.elTree2.append({
          fullPath: item,
          label: item.split('/')[item.split('/').length - 1],
          iuid: this.$NewGuid()
        })
      })
    })
  },

  methods: {
    handledList(list) {
      list.forEach(item => {
        item.disabled = !item.fileSuffix || item.fileSuffix.toLowerCase() !== '.dwg';

        if (item.children && item.children.length) {
          this.handledList(item.children)
        }
      })
    },

    checkChange() {},

    joinFile() {
      let items = this.$refs.elTree.getCheckedKeys()
      let nodes = []

      items.forEach(item => {
        nodes.push(this.$refs.elTree.getNode(item).data)
      })

      nodes.forEach(item => {
        if (!this.selectFile.find(item1 => item1.fullPath === item.turnPath)) {
          this.selectFile.push({
            fullPath: item.turnPath,
            label: item.filePath.split('\\')[item.filePath.split('\\').length - 1],
            iuid: item.iuid
          })
        }
      })
    },

    remove() {
      let items = this.$refs.elTree2.getCheckedKeys()

      items.forEach(item => {
        let data = this.selectFile.find(item1 => item1.iuid === item)
        this.$refs.elTree2.remove(data)
      })
    },

    submit() {
      this.$emit('linkModelSubmit', this.selectFile)
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss">
.link-model2-dialog {
  .content {
    height: 50vh;
    overflow: hidden;
    display: flex;

    .left-tree {
      width: 42%;
      height: 100%;
      overflow: auto;
      border: 1px solid #ccc;
    }

    .middle {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      button {
        margin: 10px 0;
      }
    }

    .right {
      width: 42%;
      height: 100%;
      overflow: auto;
      border: 1px solid #ccc;
    }
  }
}
</style>
