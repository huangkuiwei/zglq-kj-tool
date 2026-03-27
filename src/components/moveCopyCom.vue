<template>
  <div>
    <!-- //移动复制 -->
    <el-dialog :title="moveCopyType === 'move' ? '移动到' : '复制到'" :visible.sync="moveCopyDialogVisble"
      :before-close="closeDialog" :width="isResources ? '50%' : '30%'">
      <el-container style="height: 500px; border: 1px solid #eee" v-loading="loading">
        <el-aside v-if="isResources" width="150px" style="background-color: rgb(238, 241, 246);overflow:hidden">

          <el-menu :default-openeds="['0', '1', '2']" style="height:100%" v-if="isResources">
            <el-submenu index="0" style="border-bottom:1px solid #eee">
              <el-menu-item @click="TreeData(0, 'StandardInfo')"
                :class="{ active: activityindex == 0 }">{{$t('comLib.nav.standard')}}</el-menu-item>
            </el-submenu>
            <el-submenu index="1" style="border-bottom:1px solid #eee">
              <el-menu-item @click="TreeData(1, 'Company')" :class="{ active: activityindex == 1 }">{{$t('comLib.nav.companyKnowledge')}}</el-menu-item>
            </el-submenu>
            <el-submenu index="2" style="border-bottom:1px solid #eee">
              <el-menu-item @click="TreeData(2, 'Mine')" :class="{ active: activityindex == 2 }">{{$t('comLib.nav.myKnowledge')}}</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <!-- 资源库树 -->
            <el-tree :data="isResources ? treeData : Data" :props="defaultProps" @node-click="handleNodeClick">
              <span class="custom-tree-node" slot-scope="{data}">
                <span>
                  <i class="iconfont icon-wenjian" style="padding-right:10px"></i>{{ data.name }}
                </span>
              </span>
            </el-tree>
          </el-main>
        </el-container>
      </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addFolder" style="float:left;padding:11px 15px">
          <i class="el-icon-folder-add"></i>新建文件夹
        </el-button>

        <el-button type="primary" v-loading="isloading" @click="moveCopySure">{{ $t('base.button.confirm') }}</el-button>
        <el-button @click="closeDialog">{{ $t('base.button.cancel') }}</el-button>
      </span>
    </el-dialog>
    <!-- 重名文件 -->
    <el-dialog :title="moveCopyType === 'move' ? '移动文件' : '复制文件'" :visible.sync="sameFileDialogVisible" width="30%"
      class="same">
      <div class="topTitle">
        <span v-if="moveCopyType != 'move'">复制的位置已经包含了同名的文件，请选择你的操作：</span>
        <span v-if="moveCopyType === 'move'">移动的位置已经包含了同名的文件，请选择你的操作：</span>
      </div>
      <div>
        <div class="flex existingTit" style="">
          <div>已有的文件</div>
          <div>正在 <span v-if="moveCopyType != 'move'">复制的</span>
            <span v-if="moveCopyType === 'move'">移动的</span>文件：
          </div>
        </div>
        <div class="bottomCon" v-for="(item, index) in sameFileData" :key="index">
          <div class="flex" style="border-bottom:1px solid #eee;padding: 0 15px 15px 15px;" v-for="(Data, i) in item.data"
            :key="i">
            <div class="existing">
              <div class="flex">
                <span>
                  <fileIconComponends :row="Data" class="fontStyle" />
                </span>
              </div>
              <div class="fileInfo">
                <span>{{ Data.fileSize }}</span>
                <span class="fileInfo">{{ Data.createTime }}</span>
              </div>
            </div>
            <div class="existing">
              <div class="flex">
                <span>
                  <fileIconComponends :row="Data" class="fontStyle" />
                </span>
              </div>
              <div class="fileInfo">
                <span>{{ Data.fileSize }}</span>
                <span class="fileInfo">{{ Data.createTime }}</span>
              </div>
            </div>
          </div>
          <div v-if="item.code == '-1'" style="display:flex;justify-content:center;color:red">{{ item.msg }}</div>
          <div style="width:70%;margin:auto;padding:15px 0">
            <el-checkbox-group v-model="item.checkedList" v-if="sameFileData.length > 1 && item.code != '-1'">
              <el-checkbox v-for="opt in danoptions" :key="opt.label" :label="opt.label"
                @change="radioChanges(opt.label)">{{ opt.value }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer flex" style="justify-content:space-between">
        <div style="margin:auto 0;" v-if="this.cfData.length != 0">
          <el-checkbox-group v-model="allRadio">
            <el-checkbox v-for="opt in danoptions" :key="opt.label" :label="opt.label"
              @change="allRadioChanges(opt.label)">{{ opt.value }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div style="flex:1">
          <el-button @click="sameFileDialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
          <el-button type="primary" @click="replaceSure">{{ $t('base.button.confirm') }}</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 新建文件夹 -->
    <el-dialog title="新建文件夹" :visible.sync="newFloderDialogVisible" width="30%">
      <el-input v-model="inputFileName"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newFloderDialogVisible = false">{{ $t('base.button.cancel') }}</el-button>
        <el-button type="primary" @click="sure">{{ $t('base.button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import conversionApi from "@/api/document/indexApi.js";
import projectFileApi from "@/api/project/file";
import fileIconComponends from "@/components/fileIcon";
export default {
  components: {
    fileIconComponends,
  },
  props: {
    moveCopyDialogVisble: {
      type: Boolean,
      default: false,
    },
    moveCopyType: {
      type: String,
      default: null
    },
    rowData: {
      type: [Array, Object],
      default: null
    },
    isResources: {
      type: Boolean,
    }
  },
  data() {
    return {
      activityindex: 0,
      loading: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      newFloderDialogVisible: false,
      sameFileDialogVisible: false,
      inputFileName: '',
      slectedClick: '',
      positionType: '',
      sameFileData: [],
      allRadio: [],
      isloading: false,
      moveCopyData: {
        IUID: [],
        FileType: [],
        Operationtype: '',
        TargetIUID: '',
        Parentlevel: '',
        Operatingstate: [],
        KnowledgeBaseType: '',
        TargetFileType: ''
      },
      danoptions: [{
        label: "1",
        value: '跳过本组'
      }, {
        label: "2",
        value: '生成副本'
      }, {
        label: "3",
        value: '覆盖文件'
      },],
      checkedList: [],
      Data: [],
      leftFileIuid: '',
      leftFileMainIuid: '',
      treeIsvisible: null,
      zyData: [],
      cfData: []
    }
  },
  watch: {
    moveCopyDialogVisble() {
      if (this.moveCopyDialogVisble && this.isResources) {
        this.activityindex = 0
        this.queryTree('StandardInfo')
      } else if (this.moveCopyDialogVisble && !this.isResources) {
        this.activityindex = 0
        this.queryTree(0)
      }
    },
    sameFileDialogVisible() {
      if (this.sameFileDialogVisible) {
        this.allRadio = []
      }
    },
    moveCopyType() {
      if (this.moveCopyType == 'move') {
        this.moveCopyData.Operationtype = 'YD'
      } else {
        this.moveCopyData.Operationtype = 'FZ'
      }
    }
  },
  mounted() { },
  methods: {
    TreeData(index, typeVal) {
      this.activityindex = index;
      this.positionType = typeVal;
      this.queryTree(typeVal)
    },
    async queryTree(type) {
      this.loading = true
      if (this.isResources) {
        var res = await conversionApi.get("/api/Home/KnowledgeBaseTreeData?KnowledgeBaseType=" + type, '');
        this.treeData = [res.data]
        this.loading = false
      } else {
        if (type == 0) {
          var res = await conversionApi.post("/api/Home/ProjectTreeData", "");
          this.Data = res.data;
          this.loading = false
        } else {
          this.Data = [];
          var res = await conversionApi.post("/api/Home/IndividualTreeData", "");
          this.Data.push(...res.data);
          this.loading = false
        }
      }
    },
    async myTree(index) {
      this.activityindex = index
      this.queryTree(index)
    },
    async moveCopyPost() {
      this.isloading = true

      var formData = new FormData()
      formData.append("IUID", JSON.stringify(this.moveCopyData.IUID));
      formData.append("FileType", JSON.stringify(this.moveCopyData.FileType));
      formData.append("Operatingstate", JSON.stringify(this.moveCopyData.Operatingstate));
      formData.append("Operationtype", this.moveCopyData.Operationtype);
      formData.append("TargetIUID", this.moveCopyData.TargetIUID);
      formData.append("TargetFileType", this.moveCopyData.TargetFileType);
      formData.append("Parentlevel", this.moveCopyData.Parentlevel);
      if (this.isResources) {
        formData.append("KnowledgeBaseType", this.moveCopyData.KnowledgeBaseType);
      }
      var res = await projectFileApi.moveCopyProTree(formData)
      this.isloading = false
      if (res.data.findIndex(target => target.code === 1) != -1 && res.data.findIndex(target => target.code === -1) == -1) {
        this.$emit('update:moveCopyDialogVisble', false)
        this.$emit('shiftData')
        this.$message({
          message: res.msg,
          type: 'success'
        });
      } else if (res.data.length == 0) {
        this.sameFileDialogVisible = false
        this.$emit('update:moveCopyDialogVisble', false)
        return false
      } else {
        this.sameFileData = res.data.filter((item) => item.code == "2" || item.code == '-1');
        this.zyData = res.data.filter((item) => item.code == '-1')
        this.cfData = res.data.filter((item) => item.code == "2");
        this.sameFileDialogVisible = true;
        //给重名数据数组添加一个放选中值的属性数组
        for (let k in this.sameFileData) {
          this.$set(this.sameFileData[k], 'checkedList', this.checkedList)
        }
      }
    },
    moveCopySure() {
      if (this.slectedClick != 1) {
        this.$message({
          message: "请选择目标文件",
        });
      } else {
        this.moveCopyData.IUID = []
        this.moveCopyData.FileType = []
        this.moveCopyData.Operatingstate = []
        for (let key in this.rowData) {
          this.moveCopyData.IUID.push(this.rowData[key].iuid)
          this.moveCopyData.FileType.push(this.rowData[key].fileType)
          this.moveCopyData.Operatingstate.push(0)
        }
        this.moveCopyData.KnowledgeBaseType = this.positionType
        this.moveCopyPost()
      }
    },
    handleNodeClick(data) {
      this.slectedClick = 1
      this.moveCopyData.TargetIUID = data.iuid
      this.moveCopyData.TargetFileType = data.fileType;
      this.moveCopyData.Parentlevel = data.parentlevel;
      this.treeIsvisible = data.isvisible;
      if (data.parentlevel == '0') {
        this.leftFileIuid = data.iuid;
        this.leftFileMainIuid = '';
      } else {
        this.leftFileMainIuid = data.iuid
      }
    },
    closeDialog() {
      this.$emit('update:moveCopyDialogVisble', false)
    },
    //新建文件夹
    addFolder() {
      if (this.slectedClick != 1) {
        this.$message({
          message: "请选择目标文件",
        });
      } else {
        this.newFloderDialogVisible = true
      }
    },
    async sure() {
      // isResources 资源库
      if (this.isResources) {
        var formData = new FormData()
        formData.append('KnowledgeBaseType', this.positionType)
        formData.append('Name', this.inputFileName)
        formData.append('IUID', this.moveCopyData.TargetIUID)
        var res = await conversionApi.post("/Api/KnowledgeBase/KnowledgeBaseAdd", formData);
        if (res.code == 1) {
          this.newFloderDialogVisible = false;
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.queryTree(this.positionType)
        }
      } else {
        // activityindex 0:项目空间   1:文档资料
        // if (this.activityindex == 1) {
        //   var formData = new FormData();
        //   formData.append("IUID", this.moveCopyData.TargetIUID);
        //   formData.append("name", this.inputFileName);
        //   var res = await conversionApi.post("/api/Drawing/DrawingFileAdd", formData);
        //   if (res.code == 1) {
        //     this.newFloderDialogVisible = false;
        //     this.$message({
        //       message: res.msg,
        //       type: 'success'
        //     });
        //     this.queryTree(1)
        //   }
        // } else if (this.activityindex == 0) {
        if (this.treeIsvisible != false) {
          var formData = new FormData();
          formData.append("name", this.inputFileName);
          formData.append("MainIUID", this.leftFileIuid);
          formData.append("IUID", this.leftFileMainIuid);
          var res = await conversionApi.post("/api/ProjectFile/ProjectFileAdd", formData);
        } else {
          var formData = new FormData();
          formData.append("MainIUID", this.moveCopyData.TargetIUID);
          formData.append("Name", this.inputFileName);
          var res = await conversionApi.post("/api/ProjectManagement/ProjectFileAdd", formData);
        }
        if (res.code == 1) {
          this.newFloderDialogVisible = false;
          // this.$emit('refresh')
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.queryTree(this.activityindex)
        }
        // }
      }
      this.inputFileName = ''
    },
    //全选
    allRadioChanges(val) {
      if (this.allRadio.length > 1) {
        this.allRadio.shift()
      }
      for (let y in this.sameFileData) {
        this.sameFileData[y].checkedList = []
        if (this.sameFileData[y].code == 2) {
          this.sameFileData[y].checkedList.push(val)
        }
        if (this.allRadio.length == 0) {
          this.sameFileData[y].checkedList = []
        } else {
          if (this.sameFileData[y].checkedList.length > 1) {
            this.sameFileData[y].checkedList.shift()
          }
        }
      }
    },
    replaceSure() {
      //判断选中多条覆盖或生成副本需清空之前的iuid和fileType
      this.moveCopyData.IUID = []
      this.moveCopyData.FileType = []
      this.moveCopyData.Operatingstate = []
      //判断生成副本还是覆盖文件
      for (let key in this.rowData) {
        for (let k in this.sameFileData) {
          for (let y in this.sameFileData[k].data) {
            if (this.rowData[key].fileName == this.sameFileData[k].data[y].fileName) {
              if (this.sameFileData[k].checkedList[0] == '2') {
                this.moveCopyData.Operatingstate.push(1);
                this.moveCopyData.IUID.push(this.rowData[key].iuid)
                this.moveCopyData.FileType.push(this.rowData[key].fileType);
              } else if (this.sameFileData[k].checkedList[0] == '3') {
                this.moveCopyData.Operatingstate.push(2);
                this.moveCopyData.IUID.push(this.rowData[key].iuid)
                this.moveCopyData.FileType.push(this.rowData[key].fileType);
              }
            }
          }
        }
      }
      this.moveCopyPost()
      this.sameFileDialogVisible = false;
      this.allRadio = []
    },
    //单项选择
    radioChanges(val, i) {
      for (let k in this.sameFileData) {
        if (this.sameFileData[k].checkedList.length > 1) {
          this.sameFileData[k].checkedList.shift()
        }
      }
    },
  }
}
</script>
<style scoped lang="scss">
.active {
  background: rgba(228, 233, 240, 1) !important;
}

.existing {
  flex: 1;
  padding-top: 17px;
}

.existingTit {
  justify-content: space-around;
  color: rgba(64, 158, 255, 1);
  padding-bottom: 17px;
}

.fileInfo {
  padding-left: 15px;
  line-height: 33px;
  color: gray;
}</style>
