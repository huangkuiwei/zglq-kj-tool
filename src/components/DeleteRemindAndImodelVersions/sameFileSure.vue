<template>
  <!-- 重名文件 -->
  <el-dialog title="文件重复提醒" :visible.sync="sameFileSureVisible" :before-close="closeDialog" width="700px" class="same">
    <div class="topTitle">此文件夹中已有重名文件，请选择处理方式：</div>
    <div>
      <div class="bottomCon" v-for="(item, index) in listData" :key="index">
        <div style="padding:15px 0">
          <el-radio-group v-model="item.Operatingstate" size="small">
            <el-radio :label="3">创建为新版本</el-radio>
            <el-radio :label="5">替换文件(继承数据)</el-radio>
            <el-radio :label="1">生成新文件</el-radio>
            <el-radio :label="4">跳过</el-radio>
            <!-- <el-radio :label="2">覆盖文件</el-radio> -->
          </el-radio-group>
        </div>
        <div class="flex" style="border-bottom:1px solid #eee;padding: 0 15px 15px 15px;">
          <div class="existing">
            <div style="color: #409eff;">已有的文件</div>
            <fileIconComponends :row="item" class="fontStyle" />
            <div class="fileInfo">
              <span>{{ item.fileSize }}</span>
              <span class="fileInfo">{{ item.createTime }}</span>
            </div>
          </div>
          <div class="existing">
            <div style="color: #409eff;">正在上传的文件：</div>
            <fileIconComponends :row="item" class="fontStyle" />
            <div class="fileInfo">
              <span>{{ item.fileSize }}</span>
              <span class="fileInfo">{{ item.createTime }}</span>
            </div>
          </div>
        </div>


        <div style="margin-top: 10px;display:flex;justify-content:space-between;align-items: center;">
          <div style="padding:5px 0">
            <el-radio-group v-model="item.Operationmode" size="small">
              <el-radio :label="1">为后面的所有文件执行此操作</el-radio>
              <el-radio :label="2">每个文件都要询问我</el-radio>
            </el-radio-group>
          </div>
          <el-button type="primary" @click="replaceSure">{{ $t('base.button.confirm') }}</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import fileIconComponends from "@/components/fileIcon";
export default {
  components: {
    fileIconComponends,
  },
  watch: {

  },
  props: {
    sameFileSureVisible: {
      type: Boolean,
      default: false
    },
    sameFileData: {
      type: Array | Object,
    },
    submitFileData: {
      type: Array | Object,
    }
  },

  data() {
    return {
      dataIndex: 0,
      listData: [],
      allSameFile: []
    }
  },
  mounted() {
    this.screenSameFile()
  },
  methods: {
    screenSameFile() {
      this.submitFileData.map(item => {
        if (item.sameNameSign == true) {
          this.allSameFile.push(item)
        }
      })
      console.log(this.submitFileData)
      this.dataIndex = 0
      this.listData = [this.allSameFile[this.dataIndex]]
      this.allSameFile[this.dataIndex].Operatingstate = 3
      this.allSameFile[this.dataIndex].Operationmode = 1
    },
    replaceSure() {
      var allFile   //用来判断是否点击了都执行了此操作
      if (this.allSameFile[this.dataIndex].Operationmode == 1 || this.allSameFile[this.dataIndex].Operationmode == 0) {
        allFile = true
        //为后面所有文件都执行此操作
        for (var k = 0; k < this.allSameFile.length; k++) {
          if (this.allSameFile[k].Operatingstate == 1) {
            this.submitFileData[k].Operatingstate = 1
            this.submitFileData[k].Operationmode = 0
          } else (this.allSameFile[k].Operatingstate == 0 && this.allSameFile[k].Operationmode == 0)
          {
            this.allSameFile[k].Operatingstate = this.allSameFile[this.dataIndex].Operatingstate
            this.allSameFile[k].Operationmode = this.allSameFile[this.dataIndex].Operationmode
          }
        }
      } else {
        //每次询问
        if (this.dataIndex != this.sameFileData.length - 1) {
          this.allSameFile[this.dataIndex + 1].Operatingstate = 3
          this.allSameFile[this.dataIndex + 1].Operationmode = 1
        }
        this.listData = [this.allSameFile[this.dataIndex + 1]]
      }

      if (this.dataIndex == this.sameFileData.length - 1 || allFile) {
        for (var i = 0; i < this.allSameFile.length; i++) {
          //标记第一个生成副本的文件传给后台，后台需要判断副本文件放在一个文件夹下面
          if (this.allSameFile[i].Operatingstate == 1) {
            this.allSameFile[i].sign = 1
            break;
          }
        }
        this.$emit('update:submitFileData', this.listData)
        this.$emit("callBack")
        this.$emit('update:sameFileSureVisible', false)
      }
      this.dataIndex++
    },
    closeDialog() {
      this.$emit('update:sameFileSureVisible', false)
    },
  }
}
</script>
<style scoped lang="scss">

.existing {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ::v-deep .fileTypeIcon {
    margin: 10px 0 5px;
    width: fit-content;
    align-items: center;
  }

  ::v-deep .fileIconName {
    flex-grow: 1;
  }
}



.existingTit {
  justify-content: space-around;
  color: rgba(64, 158, 255, 1);
  padding-top: 17px;
}
</style>
