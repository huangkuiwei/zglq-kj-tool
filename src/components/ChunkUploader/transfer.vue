<template>
  <div>
    <transitionComponents>
      <div class="uploderProgress" v-if="uploaderVisible === 'show'">
        <div class="uploaderProgressTitle" id="uploaderProgressTitle" v-drag>
          <span>{{ $t('base.button.fileTransfer') }}</span>
          <el-link icon="el-icon-close" class="uploaderProgressTitleBtn" style="float: right; margin-right: 20px; margin-top: 15px" @click="changeUploaderVisible('clear')"></el-link>
          <el-link icon="el-icon-minus" class="uploaderProgressTitleBtn" @click="changeUploaderVisible('hidden')"></el-link>
        </div>
        <div class="uploaderProgressTab">
          <div class="uploader-tabItem" :class="[uploaderTab_Index == 0 ? 'uploaderProgressTabActive' : '']" @click="transferSuccessTabClick"> {{ $t('base.button.transferFinish') }} </div>
          <div class="uploader-tabItem" :class="[uploaderTab_Index == 1 ? 'uploaderProgressTabActive' : '']" @click="tabClick(1)"> {{ $t('base.button.uploading') }}
            <el-badge style="position: absolute; margin-top: 6px; margin-left: 4px" :value="fileDataClone.length - fileDataClone.filter(item => item.progress == '100').length" v-if="fileDataClone.length > 0" :max="99" />
          </div>
          <div class="uploader-tabItem" :class="[uploaderTab_Index == 2 ? 'uploaderProgressTabActive' : '']" @click="tabClick(2)"> {{ $t('base.button.downloading') }}
            <el-badge style="position: absolute; margin-top: 6px; margin-left: 4px" :value="downLoad_in_progress_number" v-if="downLoad_in_progress_number > 0" :max="99" />
          </div>
        </div>
        <template v-if="uploaderTab_Index == 0">
          <div class="upload-thr">
            <div class="td w_30"> {{ $t('base.button.fileName') }} </div>
            <div class="td w_20 text-c"> {{ $t('base.button.fileSize') }} </div>
            <!-- <div class="uploaderProgress-successCol-fullpath uploaderProgress-col-fullpath"> 位置 </div> -->
            <div class="td w_25 text-c"> {{ $t('base.button.fileStatus') }} </div>
            <div class="td w_20 text-c">
              <el-button size="mini" type="danger" v-if="tableData.length > 0" plain @click="delSuccessFileUploadData(true)">{{ $t('base.button.clearAll') }}</el-button>
            </div>
          </div>
          <div class="upload-tdr">
            <ul class="uploaderProgressDataUl">
              <li v-for="(item, index) in tableData.concat(downLoadFileDataClone.filter(item => item.progress === 100))" :key="index">
                <el-tooltip effect="light" :content="item.fileName" placement="top">
                  <div class="td w_30">
                    <fileIconComponends :row="item" :visible="false" />
                  </div>
                </el-tooltip>
                <div class="td w_20 text-c">
                  {{ item.fileSize }}
                </div>
                <!-- <div class="td w_20 text-c">
                  <el-tag size="small" v-if="item.sourceType == '1'"> 项目 </el-tag>
                  <el-tag size="small" v-else-if="item.sourceType == '2'" type="warning"> 图档 </el-tag>
                  <el-tag size="small" v-else type="success"> 知识库 </el-tag>
                </div> -->
                <div class="td w_25 text-c">
                  <template v-if="item.isdownload">
                    <i class="el-icon el-icon-download" style="font-size: 13px; color: #f56c6c"></i>
                    <span style="color: #303133">{{ $t('base.button.downloaded') }}</span>
                  </template>

                  <template v-else>
                    <i class="font_family icon-arrowup" style="font-size: 13px; color: #f56c6c"></i>
                    <span style="color: #303133">{{ $t('base.button.uploaded') }}</span>
                  </template>
                </div>
                <div class="td w_20 text-c">
                  <el-button v-if="!item.isdownload" icon="el-icon-folder" size="mini" @click="locationFile(item)" circle></el-button>
                  <el-button type="danger" plain @click="delSuccessFileUploadData(false, item)" icon="el-icon-delete" size="mini" circle></el-button>
                </div>
              </li>
            </ul>
            <el-pagination v-if="total > 0" class="mt10" :total="total" :current-page.sync="page" :page-size="rows" @current-change="queryData" layout="prev, pager, next" style="text-align: center;position: absolute;bottom: 5px;width: 100%;"></el-pagination>
          </div>
        </template>
        <template v-if="uploaderTab_Index === 1">
          <div class="upload-thr">
            <div class="td w_30" style="width: 30%"> {{ $t('base.button.fileName') }} </div>
            <div class="td w_20 text-c">{{ $t('base.button.fileSize') }}</div>
            <!-- <div class="uploaderProgress-col-fullpath" style="width: 15%"> 位置 </div> -->
            <div class="td w_20 text-c">{{ $t('base.label.time') }}</div>
            <div class="td w_15 text-c">{{ $t('base.formLabel.status') }}</div>
            <div class="td w_10 text-c">{{ $t('base.formLabel.operation') }}</div>
          </div>
          <div class="upload-tdr">
            <ul class="uploaderProgressDataUl">
              <li v-for="(item, index) in fileDataClone" :key="index" :style="{ background: 'linear-gradient(90deg, #409eff ' + (item.progress == 100 ? 0 : item.progress) + '%, white 0%)', }">
                <el-tooltip effect="light" :content="item.fileName" placement="top">
                  <div class="td w_30" style="width: 30%">
                    {{ item.fileName }}
                  </div>
                </el-tooltip>
                <div class="td w_20 text-c">
                  {{ item.fileSize }}
                </div>
                <!-- <el-tooltip effect="light" :content="item.fullPath" placement="top">
                  <div class="uploaderProgress-col-fullpath" style="width: 15%">
                    {{ item.fullPath }}
                  </div>
                </el-tooltip> -->
                <div class="td w_20 text-c">
                  {{ item.uploadTime.split(' ')[1] }}
                </div>
                <div class="td w_15 text-c">
                  <span>
                    <el-tooltip effect="light" :content="'错误：' + item.errorMsg" placement="top" v-if="item.errorMsg">
                      <i style="color: red">错误: {{ item.errorMsg }}</i>
                    </el-tooltip>
                    <i v-else-if="item.progress != 100">{{ item.progress ? item.progress + "%" : "等待中..." }}</i>
                    <i v-else>完成</i>
                    <em v-if="item.progress == 100" class="successIcon"></em>
                  </span>
                </div>
                <div class="td w_10 text-c">
                  <el-link icon="el-icon-close" @click="cancelUpload(item)"></el-link>
                </div>
              </li>
            </ul>
          </div>
        </template>
        <template v-if="uploaderTab_Index === 2">
          <div class="upload-thr">
            <div class="td w_20"> {{ $t('base.button.fileName') }} </div>
            <div class="td w_20 text-c">{{ $t('base.button.fileSize') }}</div>
            <!-- <div class="td w_20 text-c" style="width: 25%"> 位置 </div> -->
            <div class="td w_20 text-c">{{ $t('base.button.downloadTime') }}</div>
             <div class="td w_20 text-c uploaderProgress-col-fileStatus">{{ $t('base.formLabel.status') }}</div>
            <div class="td w_20 text-c">{{ $t('base.formLabel.operation') }}</div>
          </div>
          <div class="upload-tdr">
            <ul class="uploaderProgressDataUl">
              <li v-for="(item, index) in downLoadFileDataClone.filter(item => item.progress !== 100)" :key="index" :style="{
                background:
                  'linear-gradient(90deg, #409eff ' +
                  (item.progress == 100 ? 0 : item.progress) +
                  '%, white 0%)',
              }">
                <el-tooltip effect="light" :content="item.fileName" placement="top">
                  <div class="td w_20" style="width: 20%">
                    {{ item.fileName }}
                  </div>
                </el-tooltip>
                <div class="td w_20 text-c">
                  {{ item.fileSize }}
                </div>
                <!-- <el-tooltip effect="light" :content="item.fullPath" placement="top">
                  <div class="td w_20 text-c" style="width: 25%">
                    {{ item.fullPath }}
                  </div>
                </el-tooltip> -->
                <div class="td w_20 text-c">
                  {{ item.downloadTime }}
                </div>
                <div class="td w_20 text-c uploaderProgress-col-fileStatus">
                  <span>
                    <el-tooltip effect="light" :content="'错误：' + item.errorMsg" placement="top" v-if="item.errorMsg">
                      <i style="color: red">错误: {{ item.errorMsg }}</i>
                    </el-tooltip>
                    <i v-else-if="item.progress != 100">{{ item.progress ? item.progress + "%" : "等待中..."}}</i>
                    <i v-else>完成</i>
                    <em v-if="item.progress == 100 && !item.errorMsg" class="successIcon"></em>
                  </span>
                </div>
                <div class="td w_20 text-c">
                  <el-link icon="el-icon-close" @click="cancelDownload(item)"></el-link>
                </div>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </transitionComponents>
    <div v-if="uploaderVisible === 'hidden'">
      <div class="uploderProgress uploderProgressReduce">
        <div class="uploaderProgressTitle">
          <span>{{ $t('base.button.fileTransfer') }}</span>
          <el-link icon="el-icon-close" class="uploaderProgressTitleBtn" @click="changeUploaderVisible('clear')"></el-link>
          <el-link class="uploaderProgressTitleBtn" icon="el-icon-full-screen" @click="changeUploaderVisible('show')">
          </el-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import commonApi from "@/api/common";
import postApi from "@/api/document/indexApi"
import {
  mapGetters
} from "vuex";
import local from '@/utils/auth'
import transitionComponents from "@/utils/transition";
import fileIconComponends from "@/components/fileIcon";
import {
  decrypt
} from '@/utils'
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      rows: 6,
      total: 0,
      upload_in_progress_number: 0,
      downLoad_in_progress_number: 0,
    };
  },
  components: {
    transitionComponents,
    fileIconComponends,
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
    ...mapGetters(["uploaderVisible", "fileDataClone", "downLoadFileDataClone", "uploaderTab_Index",]), //uploaderVisible 三种状态 hidden clear show
  },
  watch: {
    uploaderVisible() {
      if (this.uploaderVisible == "show" && this.uploaderTab_Index == 0) {
        this.queryData();
      }
    },
    uploaderTab_Index(val, oval) {
      if (val != oval) {
        this.queryData();
      }
    },
    fileDataClone() {
      var _self = this;
      _self.upload_in_progress_number = 0;
      this.fileDataClone.forEach((element) => {
        if (element.progress >= 0 && element.progress < 100 && !element.errorMsg) {
          _self.upload_in_progress_number = _self.upload_in_progress_number + 1;
        }

      });
    },
    downLoadFileDataClone: {
      handler() {
        var _self = this;
        _self.downLoad_in_progress_number = 0;
        this.downLoadFileDataClone.forEach((element) => {
          if (element.progress >= 0 && element.progress < 100 && !element.errorMsg) {
            _self.downLoad_in_progress_number = _self.downLoad_in_progress_number + 1;
          }
        });
      },
      deep: true
    },
  },
  mounted() {
    this.queryData()
  },
  methods: {
    transferSuccessTabClick() {
      this.tabClick(0);
      this.queryData();
    },
    changeUploaderVisible(type) {
      this.$store.dispatch("ChangeUploderVisible", type);
    },
    tabClick(index) {
      this.$store.commit('CHANGE_UPLOADERTAB_INDEX', index)
      // this.$store.state.app.uploaderTab_Index = index;
    },
    // 该函数中不能使用VUE框架的router.push,避免相同界面无法进行参数传递问题。
    locationFile(item) {
      var randomParam = this.$NewGuid()
      if (item.sourceType == '2') {
        location.href = "/#/myDocument?pageMode=location&iuid=" + item.mainIUID + "&fileType=" + item.sourceType + "&randomParam=" + randomParam;
      } else if (item.sourceType == '1') {
        location.href = "/#/projectFile?pageMode=location&iuid=" + item.mainIUID + "&projectIsPictureMode=true&path=all&fileType=" + item.sourceType + "&randomParam=" + randomParam; //默认定位时历史项目列表界面为卡片模式，并处于全部项目界面之中。
      } else if (item.sourceType == '3' && item.knowledgeBaseType === 'StandardInfo') {
        location.href = "/#/standardData?pageMode=location&fileType=" + item.sourceType + "&iuid=" + item.mainIUID + "&randomParam=" + randomParam;
      } else if (item.sourceType == '3' && item.knowledgeBaseType === 'Company') {
        location.href = "/#/companyKnowledgeBase?pageMode=location&fileType=" + item.sourceType + "&iuid=" + item.mainIUID + "&randomParam=" + randomParam;
      } else if (item.sourceType == '3' && item.knowledgeBaseType === 'Mine') {
        location.href = "/#/myKnowledgeBase?pageMode=location&fileType=" + item.sourceType + "&iuid=" + item.mainIUID + "&randomParam=" + randomParam;
      }
    },
    async queryData() {
      if (!local.getToken()) {
        return
      } else {
        var formData = new FormData();
        formData.append("page", this.page);
        formData.append("rows", this.rows);
        var res = await commonApi.getSuccessFileUploadData(formData);
        this.allList = res.data;
        this.total = res.count;
        // filePath 和 turnPath 解码
        res.data && res.data.forEach(item => {
          // 接口数据未加密
          // item.filePath = decrypt(item.filePath || '')
          // item.turnPath = decrypt(item.turnPath || '')
        })
        this.tableData = res.data.filter((item) => item.fileType == "2");
      }
    },
    cancelDownload(item) {
      var index = this.$store.state.app.downLoadFileDataClone.findIndex(element => element.iuid == item.iuid);
      this.$store.state.app.downLoadFileDataClone[index].canCelDownload = true;
      this.$store.commit('REMOVE_DOWNLOAD_FILEDATA_CLONE', index)
    },
    cancelUpload(item) {
      var index = this.$store.state.app.fileDataClone.findIndex(element => element.iuid == item.iuid);
      this.$store.state.app.fileDataClone[index].cancelUpload = true;
      postApi.get('/api/Home/Getfragmentdelete?IUID=' + item.iuid)
      this.$store.commit('REMOVE_FILEDATA_CLONE', index)
    },
    delSuccessFileUploadData(isAll, item) {
      this.$confirm("确定要删除" + (isAll ? "所有上传记录" : "这条记录") + "吗？").then(async () => {
        var res;
        console.log('item', item)

        if (isAll) {
          res = await commonApi.delAllSuccessFileUploadData();
          this.$store.state.app.downLoadFileDataClone.splice(0, this.$store.state.app.downLoadFileDataClone.length)

          if (res.code == 1) {
            this.$success(res.msg);
            this.queryData();
          }
        } else {
          if (item.isdownload) {
            let index = this.$store.state.app.downLoadFileDataClone.findIndex(element => element.downloadTime === item.downloadTime);

            if (index !== -1) {
              this.$store.state.app.downLoadFileDataClone.splice(index, 1)
            }
          } else {
            res = await commonApi.delSuccessFileUploadDataById(item.iuid);

            if (res.code == 1) {
              this.$success(res.msg);
              this.queryData();
            }
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.uploderProgress {
  .td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 10px;

    &.text-c {
      text-align: center;
    }

    &.w_10 {
      width: 10%;
      float: left;
    }

    &.w_15 {
      width: 15%;
      float: left;
    }

    &.w_20 {
      width: 20%;
      float: left;
    }

    &.w_25 {
      width: 25%;
      float: left;
    }

    &.w_30 {
      width: 30%;
      float: left;
    }
  }


}
</style>
<style scoped>
.successIcon {
  float: left;
  margin-top: 13px;
  margin-right: 3px;
  display: block;
  width: 16px;
  height: 16px;
  background-image: url(https://pannss.bdstatic.com/m-static/disk-system/widget/plugin/uploader/images/operate-sure_dd4be1f.png);
}

.uploderProgress {
  width: 522px;
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
}

.uploaderProgressTitle:hover {
  cursor: move;
}

.uploderProgress.uploderProgressReduce {
  height: 40px;
}

.uploaderProgressTitle {
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

.upload-thr {
  font-size: 13px;
  color: #424e67;
  line-height: 40px;
  height: 40px;
  padding-left: 15px;
  border-bottom: 1px solid #ebeef5;
  color: #303133;
}

.upload-tdr {
  height: 315px;
  overflow: auto;
  color: #606266;
  font-size: 13px;
}

.uploaderProgressDataUl {
  list-style: none;
  margin: 0;
  padding: 0;
}

.uploaderProgressDataUl li {
  line-height: 45px;
  height: 45px;
  border-bottom: 1px solid #ebeef5;
  padding-left: 15px;
  overflow: hidden;
}

.uploaderProgressTab {
  width: 100%;
  height: 48px;
  padding-left: 15px;
  font-size: 14px;
  color: #606266;
  border-bottom: 1px solid #ebeef5;
}

.uploaderProgressTabActive {
  color: #303133;
  border-bottom: 2px solid #409eff;
}

.uploader-tabItem {
  line-height: 48px;
  width: 100px;
  text-align: center;
  display: inline-block;
  margin-right: 5px;
}

.uploader-tabItem:hover {
  color: #303133;
  cursor: pointer;
}
</style>
