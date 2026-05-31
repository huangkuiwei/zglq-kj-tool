<template>
  <div>
    <transitionComponents>
      <div class="uploderProgress" v-if="uploaderVisible === 'show'">
        <div class="uploaderProgressTitle" id="uploaderProgressTitle" v-drag>
          <span>{{ $t('base.button.fileTransfer') }}</span>
          <el-link icon="el-icon-close" class="uploaderProgressTitleBtn" style="float: right; margin-right: 20px; margin-top: 15px" @click="changeUploaderVisible('clear')"></el-link>
          <!--<el-link icon="el-icon-minus" class="uploaderProgressTitleBtn" @click="changeUploaderVisible('hidden')"></el-link>-->
        </div>

        <div class="" style="padding: 0 20px; flex-grow: 1; overflow: hidden; display: flex; flex-direction: column">
          <div style="flex-shrink: 0">
           <el-tabs v-model="type">
             <el-tab-pane label="下载" name="1"></el-tab-pane>
             <el-tab-pane label="上传" name="2"></el-tab-pane>
           </el-tabs>
          </div>

          <div style="flex-shrink: 0; flex-grow: 1; overflow: auto; height: 100px">
            <el-table v-show="type === '1'" :data="downloads">
              <el-table-column label="文件名" prop="filename" show-overflow-tooltip></el-table-column>
              <el-table-column label="大小" prop="totalSizeText"></el-table-column>
              <el-table-column label="进度" prop="progress"></el-table-column>
              <el-table-column label="状态" prop="status">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 'downloading'">下载中</span>
                  <div style="display: flex; align-items: center; gap: 10px" v-if="scope.row.status === 'completed'">
                    <span>下载完成</span>
                    <i class="el-icon el-icon-success" style="color: #00B83F"></i>
                  </div>
                  <span v-if="scope.row.status === 'paused'">已暂停</span>
                  <div style="display: flex; align-items: center; gap: 10px" v-if="scope.row.status === 'error'">
                    <span>{{ scope.row.error || '下载失败' }}</span>
                    <i class="el-icon el-icon-error" style="color: #ff4545"></i>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="160px">
                <template slot-scope="scope">
                  <div style="display: flex; align-items: center">
                    <el-button size="mini" v-if="scope.row.status === 'downloading'" @click="paused(scope.row)">暂停</el-button>
                    <el-button size="mini" v-if="scope.row.status === 'paused'" @click="download(scope.row)">下载</el-button>
                    <el-button size="mini" v-if="scope.row.status === 'completed'" @click="openFile(scope.row)">打开</el-button>
                    <el-button size="mini" type="danger" @click="deleteFile(scope.row)">删除</el-button>
                    <!-- <el-button size="mini" v-if="scope.row.status === 'error'" @click="reDownload(scope.row)"> -->
                    <!--   重新下载 -->
                    <!-- </el-button> -->
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <el-table v-show="type === '2'" :data="fileDataClone">
              <el-table-column label="文件名" prop="fileName" show-overflow-tooltip></el-table-column>
              <el-table-column label="大小" prop="fileSize"></el-table-column>
              <el-table-column label="进度" prop="progress">
                <template slot-scope="scope">
                  <span>{{ scope.row.progress }}%</span>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.progress != 100">上传中</span>
                  <div style="display: flex; align-items: center; gap: 10px" v-if="scope.row.progress == 100">
                    <span>上传完成</span>
                    <i class="el-icon el-icon-success" style="color: #00B83F"></i>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px" v-if="scope.row.errorMsg">
                    <span>{{ scope.row.errorMsg || '上传失败' }}</span>
                    <i class="el-icon el-icon-error" style="color: #ff4545"></i>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </transitionComponents>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import transitionComponents from "@/utils/transition";
import { ipcRenderer, shell } from 'electron'
import { TaskStatus } from '@/utils/taskStorage'

const fs = require("fs");

export default {
  data() {
    return {
      type: '1',
    };
  },

  components: {
    transitionComponents,
  },

  directives: {
    drag: {
      inserted: function (el) {
        el.onmousedown = (e) => {
          let disX = e.clientX - el.parentNode.offsetLeft;
          let disY = e.clientY - el.parentNode.offsetTop;
          let left = "";
          let top = "";
          document.onmousemove = (e) => {
            left = e.clientX - disX;
            top = e.clientY - disY;
            el.parentNode.style.left = left + "px";
            el.parentNode.style.top = top + "px";
          };
          document.onmouseup = (e) => {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      },
    },
  },

  computed: {
    ...mapGetters(["uploaderVisible"]),
    downloads() {
      return this.$store.state.downloadData.downloads;
    },
    fileDataClone() {
      return this.$store.state.app.fileDataClone
    }
  },

  watch: {
    downloads: {
      handler(value) {
        localStorage.setItem("downloads", JSON.stringify(value));
      },
      deep: true
    },

    fileDataClone: {
      handler(value) {
        console.log('fileDataClone', value)
        localStorage.setItem("fileDataClone", JSON.stringify(value));
      },
      deep: true
    }
  },

  mounted() {
    let fileDataClone = localStorage.getItem("fileDataClone");

    if (fileDataClone) {
      fileDataClone = JSON.parse(fileDataClone);
      // this.fileData = fileData;
    }
  },

  methods: {
    changeUploaderVisible(type) {
      this.$store.dispatch("ChangeUploderVisible", type);
    },

    paused(row) {
      ipcRenderer.invoke('pause-download', row.id)
    },

    download(row) {
      ipcRenderer.invoke('resume-download', row.id)
    },

    async openFile(row) {
      try {
        fs.statSync(row.filePath)
        shell.showItemInFolder(row.filePath)
      } catch (err) {
        row.status = 'error';
        row.error = '文件被移除';
      }
    },

    deleteFile(row) {
      ipcRenderer.invoke('pause-download', row.id)

      let index = this.$store.state.downloadData.downloads.findIndex(x => x.id === row.id);

      if (index > -1) {
        this.$store.state.downloadData.downloads.splice(index, 1);
      }
    },

    reDownload(row) {
      const task = {
        ...row,
        downloaded: 0,
        progress: 0,
        status: TaskStatus.DOWNLOADING,
        speed: 0,
        error: undefined,
      }

      let index = this.$store.state.downloadData.downloads.findIndex(x => x.id === row.id);

      if (index > -1) {
        ipcRenderer.invoke('perform-download', task)
        this.$store.state.downloadData.downloads.splice(index, 1, task);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.uploderProgress {
  width: 700px;
  height: 445px;
  position: fixed;
  z-index: 2009;
  bottom: 0;
  right: 0;
  margin-right: 30px;
  background-color: white;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  border: 1px solid #e2e2e2;
  box-shadow: 0 0 10px #ccc;
  display: flex;
  flex-direction: column;
}

.uploaderProgressTitle:hover {
  cursor: move;
}

.uploaderProgressTitle {
  flex-shrink: 0;
  border-bottom: 1px solid #ebeef5;
  line-height: 40px;
  color: #303133;
  font-size: 14px;
  padding-left: 15px;
  background-color: #e4eaf5;
}

.uploaderProgressTitleBtn {
  float: right;
  margin-right: 20px;
  margin-top: 15px;
}
</style>
