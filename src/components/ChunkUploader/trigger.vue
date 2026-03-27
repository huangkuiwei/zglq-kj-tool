<template>
  <div>
    <div style="position: fixed; z-index: 999" class="uploader-example" v-if="uploadDialogVisble">
      <div :style="{ height: clientHeight + 'px', 'line-height': clientHeight + 'px' }" style="text-align: center;font-size: 45px;opacity: 0.4;background-color: white;border: 3px dashed #000;">
        <span>上传文件到当前目录下</span>
      </div>
    </div>
    <sameFileCom :sameFileSureVisible.sync="sameFileSure" v-if="sameFileSure" :sameFileData="sameData" :submitFileData="fileData" @callBack="callBack"></sameFileCom>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import commonApi from "@/api/common";
import local from "@/utils/auth";
import sameFileCom from "@/components/DeleteRemindAndImodelVersions/sameFileSure"
import projectFileApi from "@/api/document/indexApi.js";
export default {
  components: {
    sameFileCom
  },
  computed: {
    ...mapGetters(["clientHeight", "fileDataClone"]),
  },
  props: {
    folderIuid: {
      type: String,
    },
    projectLeftMenuActiveIuid: {
      type: String,
    },
    isProject: {
      type: Boolean,
      default: false,
    },
    isVersion: {
      type: Boolean,
      default: false,
    },
    isZsk: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      uploaderVisible: "clear",
      uploadDialogVisble: false,
      fileData: [],
      sameData: [],
      sameFileSure: false,
      failTaskList: [],
      taskIsFail: false
    };
  },
  // watch:{
  //   'fileDataClone.length': {
  //       handler(newValue, oldValue) {
  //         debugger
  //         var postingDataIndex = this.fileDataClone.findIndex((item)=>{
  //           return item.httpStatus == 'OnPosting'
  //         })
  //         if(postingDataIndex > -1){
  //           return
  //         }
  //         this.handleChuankUpload()
  //       }
  //   },
  // },
  methods: {
    showUploadDialog() {
      this.uploadDialogVisble = true;
    },
    hideUploadDialog() {
      this.uploadDialogVisble = false;
    },
    callBack() {

      //文件数据时间排序
      this.fileData.sort(this.$compare("lastModifiedData"));
      //触发vuex中的数据变化
      this.$store.dispatch("UpdateFileDataClone", this.fileData);
      this.$store.commit('CHANGE_UPLOADERTAB_INDEX', 1)
      this.$store.dispatch("ChangeUploderVisible", "show");
      this.handleChuankUpload();
    },
    //文件落下【dataTransferItems:dataTransfer.Items; folderFullPath:列表文件夹总路径】
    fileDrop(dataTransferItems, folderFullPath) {
      this.fileData = [];
      var _self = this;
      for (let i = 0; i < dataTransferItems.length; i++) {
        let item = dataTransferItems[i].webkitGetAsEntry();
        if (item) {
          this.scanFiles(item, folderFullPath);
        }
      }
      setTimeout(async () => {
        await _self.uploadDragFile();
      }, 100);
    },
    async querySameFile() {
      this.fileData.forEach((i, idx) => {
        if (this.fileDataClone.map(item => item.fileName).indexOf(i.fileName) > 0) {
          this.$warning(`文件${i.fileName}正在上传`)
          this.fileData.splice(idx, 1)
        }
      })
      if (!this.isProject) {
        var res = await projectFileApi.post('/api/Drawing/DrawingFilesList', this.fileData);
      } else {
        var res = await projectFileApi.post('/api/ProjectFile/ProjectFilesList', this.fileData);
      }
      this.sameData = res.data
      for (var y = 0; y < this.sameData.length; y++) {
        for (var i = 0; i < this.fileData.length; i++) {
          if (this.fileData[i].fileName == this.sameData[y].fileName) {
            this.$set(this.fileData[i], 'sameNameSign', true)
            this.$set(this.fileData[i], 'sign', null)
          }
        }
      }
      if (this.sameData.length > 0) {
        this.sameFileSure = true
      } else {
        //文件数据时间排序
        this.fileData.sort(this.$compare("lastModifiedData"));
        //触发vuex中的数据变化
        this.$store.dispatch("UpdateFileDataClone", this.fileData);
        this.$store.commit('CHANGE_UPLOADERTAB_INDEX', 1)
        this.$store.dispatch("ChangeUploderVisible", "show");
        this.handleChuankUpload();
      }
    },
    scanFiles(item, folderFullPath) {
      var _self = this;
      console.log(item);
      if (item.isFile) {
        item.file(function (file) {
          let fullPath;
          if (item.name == item.fullPath.substr(1)) {
            fullPath = folderFullPath;
          } else {
            fullPath = folderFullPath + item.fullPath;
          }
          //每读取到文件添加文件对象到文件集合中
          //这里以fileData数组的属性存储是为了并发考虑
          _self.fileData.push({
            fileName: item.name,
            relativePath: item.fullPath.substr(1),
            fullPath: fullPath,
            file: file,
            fileSize: _self.$getFileSize(file.size),
            lastModifiedData: _self.$dayjs(file.lastModifiedDate, "YYYY-MM-DD HH:mm:ss"),
            progress: 0,
            fileSuffix: item.name.substring(item.name.lastIndexOf('.')), //用于重名文件图片显示
            uploadTime: _self.$dayjs(new Date(), "YYYY-MM-DD HH:mm:ss"),
            folderIuid: _self.folderIuid,
            menuDefaultActive: _self.projectLeftMenuActiveIuid,
            isProject: _self.isProject,
            isVersion: _self.isVersion,
            isZsk: _self.isZsk,
            Operatingstate: 0, //重名操作（为所有文件执行此操作）
            Operationmode: 0, //重名操作（每次询问）
            sign: null
          });
        });
      }
      if (item.isDirectory) {
        let directoryReader = item.createReader();
        directoryReader.readEntries(function (entries) {
          entries.forEach(async function (entry) {
            console.log(entry);
            await _self.scanFiles(entry, folderFullPath);
          });
        });
      }
    },
    async uploadDragFile() {
      if (this.fileData && this.fileData.length > 0) {
        if (!this.isProject) {
          this.callBack()
          return
        } else {
          await this.querySameFile()
        }
        // //文件数据时间排序
        // this.fileData.sort(this.$compare("lastModifiedData"));
        // //触发vuex中的数据变化
        // this.$store.dispatch("UpdateFileDataClone", this.fileData);
        // this.$store.state.app.uploaderTab_Index = 1;
        // this.$store.dispatch("ChangeUploderVisible", "show");
        // this.handleChuankUpload();
      }
    },
    async handleChuankUpload() {
      for (var i = 0; i < this.fileDataClone.length; i++) {
        if (this.fileDataClone[i].httpStatus != "OnPosting") {
          this.fileDataClone[i].httpStatus = "OnPosting";
          var iuid = this.$NewGuid();
          this.fileDataClone[i].iuid = iuid;

          await this.chunkUpload(
            this.fileDataClone[i].file, 
            this.fileDataClone[i].fileIuid, //只有版本上传时用到
            this.fileDataClone[i].fileType, //只有版本上传时用到
            this.$route.name, //只有知识库上传时用到
            0, 
            this.fileDataClone[i].iuid, 
            typeof this.fileDataClone[i].folderIuid == "undefined" ? "" : this.fileDataClone[i].folderIuid, 
            true, 
            this, 
            this.fileDataClone[i].menuDefaultActive, //
            this.fileDataClone[i].relativePath, 
            this.fileDataClone[i].isProject, 
            this.fileDataClone[i].isVersion, 
            this.fileDataClone[i].isZsk, 
            this.fileDataClone[i].Operatingstate, //重名操作（为所有文件执行此操作）
            this.fileDataClone[i].Operationmode, //重名操作（每次询问）
            this.fileDataClone[i].sign,
            this.fileDataClone[i].versionNumber, //只有版本上传时用到
            this.fileDataClone[i].reason, //只有版本上传时用到
            this.fileDataClone[i].contenttext, //只有版本上传时用到
            )
        }
      }
    },
    async chunkUpload(
      file,
      fileIUID, //只有版本上传时用到
      fileType, //只有版本上传时用到
      KnowledgeBaseType, //只有知识库上传时用到
      i,
      DebrisIUID,
      iuid,
      indexTrue,
      that,
      mainIUID, //
      relativePath,
      isProject,
      isVersion,
      isZsk,
      Operatingstate, //重名操作（为所有文件执行此操作）
      Operationmode, //重名操作（每次询问）
      sign,
      versionNumber,
      reason,
      contenttext
    ) {
      try {
        var index = this.fileDataClone.findIndex(
          (element) => {
            return element.iuid == DebrisIUID;
          });
        var cancelUpload = this.fileDataClone[index].cancelUpload;
        if (cancelUpload) {
          //请求分片文件删除接口
          return false;
        }
        var name = file.name, //文件名
          size = file.size, //总大小shardSize = 2 * 1024 * 1024,
          shardSize = 1 * 1024 * 1024, //以1MB为一个分片
          shardCount = Math.ceil(size / shardSize) //总片数
        // if (i > shardCount) {
        //   return
        // }
        function getFormData() {
          //计算每一片的起始与结束位置
          var start = i * shardSize,
            end = Math.min(size, start + shardSize)
          //构造一个表单，FormData是HTML5新增的
          var form = new FormData()
          form.append('data', file.slice(start, end)) //slice方法用于切出文件的一部分
          form.append('lastModified', file.lastModified)
          form.append('DebrisIUID', DebrisIUID)
          form.append('Operatingstate', Operatingstate)
          form.append('Operationmode', Operationmode)
          if (isVersion) {
            form.append('IUID', fileIUID)
            form.append('MainFileType', fileType)
            form.append('VersionNumber', versionNumber)
            form.append("reason", reason);
            form.append("contenttext", contenttext);

          } else if (isZsk) {
            form.append('IUID', iuid)
            form.append('KnowledgeBaseType', KnowledgeBaseType)
            form.append('relativePath', relativePath)
          } else {
            form.append('IUID', iuid)
            form.append('relativePath', relativePath)
            form.append('sign', sign)
          }
          form.append('totalSize', size)
          form.append('fileName', name)
          if (isProject) {
            form.append('mainIUID', mainIUID) //项目-左侧文件夹id
          }
          form.append('totalChunks', shardCount == 0 ? 1 : shardCount) //总片数
          form.append('chunkNumber', i + 1) //当前是第几片
          i++
          return form
        }
        let _this = this

        function downloadResource(api, count, isLast, originalParams) {
          // 参数做本地保存，失败的任务重试
          let paramsList = []
          if (isLast) {
            const params = originalParams || getFormData()
            // 保证最后一次分片上传是最后一次调用完
            return api(params, isProject).then(async res => {
              if (res.code === -1) {
                _this.$message.error(res.msg)
                handlerRes(res)
              } else if (res.code == -100) {
                _this.$message.error(res.msg)
                this.fileData.splice(idx, 1)
              } else if (res.code !== 0) {
                console.log(res);
                await downloadResource(api, count, true, params)
              } else {
                handlerRes(res)
              }
            })
          } else {
            const uploadList = Array.from({
              length: count
            }).map(() => {
              const params = getFormData()
              paramsList.push(params)
              return api(params, isProject)
            })
            return Promise.all(uploadList).then(async resList => {
              for (let i = 0; i < resList.length; i++) {
                if (resList[i].code === -1) {
                  _this.taskIsFail = true
                  _this.$message.error(resList[i].msg)
                  handlerRes(resList[i])
                } else if (resList[i].code !== 0) {
                  await downloadResource(api, count, true, paramsList[i])
                } else {
                  handlerRes(resList[i])
                }
              }
            })
          }
        }

        async function handlerRes(res) {

          if (res.code == 0) {
            var _index = _this.fileDataClone.findIndex(element => element.iuid == res.debrisIUID)
            _this.fileDataClone[_index].progress = res.progress
            _this.$set(_this.fileDataClone, _index, _this.fileDataClone[_index])
          } else {
            //请求失败
            var $index = _this.fileDataClone.findIndex(element => element.iuid == DebrisIUID)
            _this.fileDataClone[$index].errorMsg = res.msg
            _this.$set(_this.fileDataClone, $index, _this.fileDataClone[$index])
          }
          if (res.code == 0 && res.mergeOk) {
            let suffix = res.savePathText.substring(res.savePathText.lastIndexOf("."))
            if (['.ppt', '.PPT', '.pptx', '.PPTX'].indexOf(suffix) > -1) {
              _this.$message('正在为超过100M大小的PPT文件自动生成PDF文件中')
              let data = new FormData()
              data.append("IUID", res.debrisIUID)
              await projectFileApi.post('/api/TaskManagement/otherchange', data)
            }
            _this.$emit('reloadData')
            let s_index = _this.fileDataClone.findIndex(element => element.iuid == res.debrisIUID)
            console.log(_this.fileDataClone);

            if (s_index + 1 == _this.fileDataClone.length) {
              _this.$store.commit('CHANGE_UPLOADERTAB_INDEX', 0)
              _this.$store.commit('REMOVE_FILEDATA_CLONE',)
            }
            // this.$getCorpSpace()         取消容量数据获取 【2021/4/22 creator: MengLiu】
          } else if (res.code == 0 && !res.mergeOk) {
            // i = res.number++
            // await this.chunkUpload(
            //     file,
            //     fileIUID, //只有版本上传时用到
            //     fileType, //只有版本上传时用到
            //     KnowledgeBaseType, //只有知识库上传时用到
            //     i,
            //     res.debrisIUID,
            //     iuid,
            //     false,
            //     this,
            //     mainIUID,
            //     relativePath,
            //     isProject,
            //     isVersion,
            //     isZsk,
            //     Operatingstate,
            //     Operationmode,
            //     sign
            // )
          }
        }
        async function startDownload(api) {
          // 并发次数
          let concurrentCount = 1
          let averageCount = 0
          if (shardCount <= concurrentCount) {
            await downloadResource(api, shardCount - 1)
            await downloadResource(api, 1, true)
          } else {
            averageCount = Math.ceil(shardCount / concurrentCount)
            for (let j = 0; j < averageCount; j++) {
              if (_this.taskIsFail) {
                _this.taskIsFail = false
                break
              }
              if (j === averageCount - 1) {
                await downloadResource(api, shardCount % concurrentCount === 0 ? (concurrentCount - 1) : shardCount % concurrentCount - 1)
                if (_this.taskIsFail) {
                  _this.taskIsFail = false
                  break
                }
                await downloadResource(api, 1, true)
              } else {
                await downloadResource(api, concurrentCount)
              }
            }
          }
        }
        if (isVersion) {
          // var res = await commonApi.versionChunkUploadFile(getFormData())
          await startDownload(commonApi.versionChunkUploadFile)
        } else if (isZsk) {
          // var res = await commonApi.zskChunkUploadFile(getFormData())
          await startDownload(commonApi.zskChunkUploadFile)
        } else {
          // var res = await commonApi.chunkUploadFile(form, isProject);
          await startDownload(commonApi.chunkUploadFile)
        }
      } catch (ex) {
        console.log(ex);
      }
    }
  }
}
</script>
<style scoped>
.uploader-example {
  width: 100%;
  font-size: 12px;
  top: 0;
  left: 0;
}

.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
