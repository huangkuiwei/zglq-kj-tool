<template>
  <div style="background-color: #DCDFE6;">
    <el-header
      id="headerPage"
      style="height: 50px;z-index: 2000;line-height: 50px;background-color: white;"
    >
      <div
        style="display: flex; float: left"
        class="ksjLogo"
      >
        <img
          v-show="!$isOwner"
          :src="$headerLogo"
          style="height: 40px; margin: 5px 0 5px 10px"
          alt="跨~界 云空间"
        >
      </div>
    </el-header>
    <el-container style="height:calc(100vh - 51px)">
      <el-aside
        style="width:100vw;height:calc(100vh - 51px)"
        class="flex jc-between column"
      >
        <div
          class="flex ai-center jc-between shrink"
          style="min-width: 1400px;width:calc(100vw - 20px);margin:10px;"
        >
          <div
            class="bgwhite flex ai-center"
            style="background-color: #000;width: 60%;"
            @contextmenu.prevent="stopEvent"
          >
            <video-player
              ref="video"
              class="video-player vjs-custom-skin"
              style="width: 100%;"
              controlslist="nodownload"
              :options="playerOptions"
            />
          </div>
          <div
            class="bgwhite"
            style="width:39.5%;height:100%"
          >
            <div class="uploadBtn">
              <el-button
                v-if="user.isadministrator"
                size="mini"
                type="primary"
                plain
                icon="el-icon-plus"
                @click="addVideo"
              >
                添加视频
              </el-button>
            </div>
            <el-tabs
              v-model="activeTab"
              class="class-menu-tabs"
              type="border-card"
              @tab-click="changeTab"
            >
              <el-tab-pane
                label="学习视频"
                name="学习视频"
              />
              <el-tab-pane
                label="功能介绍"
                name="功能介绍"
              />
              <!-- <el-tab-pane label="项目案例" name="项目案例"></el-tab-pane> -->
              <el-scrollbar
                wrap-class="scrollbar-wrapper"
                style="background-color: white;"
              >
                <div
                  class="flex wrap hide-scroll"
                  :style="{ 'max-height': videoBoxHeight - 70 + 'px' }"
                  style="overflow: hidden;overflow-y: auto;"
                >
                  <div
                    v-if="videoList.length == 0"
                    class="flex ai-center jc-center"
                    style="width: 100%;margin-top: 30px;"
                  >
                    <i class="el-icon-loading" />
                    <span style="font-size: 12px;margin-left: 10px;">加载中</span>
                  </div>
                  <div
                    v-for="(item, index) in videoList"
                    v-else
                    class="video-box"
                    @click="handleClockVideo(item)"
                  >
                    <div class="videoList-btnBox">
                      <el-button
                        v-if="user.isadministrator"
                        class="btn"
                        circle
                        size="mini"
                        type="primary"
                        icon="el-icon-edit-outline"
                        @click.stop="editVideo(item)"
                      />
                      <el-button
                        v-if="user.isadministrator"
                        class="btn"
                        circle
                        size="mini"
                        type="danger"
                        icon="el-icon-delete"
                        @click.stop="deleteVideo(item)"
                      />
                    </div>
                    <el-image
                      class="video-image"
                      :src="item.frontcover"
                      fit="cover"
                    />
                    <div
                      class="describe"
                      style="display: flex; width: 100%;"
                    >
                      <div style="width: 100%; text-align: center; margin-top: 2px">
                        <span style="font-size: 14px; font-weight: 800; color: #303133"> {{ item.title }} </span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </el-tabs>
          </div>
        </div>
        <div
          class="flex ai-center jc-between grow"
          style="min-width: 1400px;width:calc(100vw - 20px);margin: 0 10px 10px;height:100%;overflow: hidden;"
        >
          <div
            v-for="(item, idx) in botItems"
            :key="idx"
            class="bgwhite bot-item"
            :style="{ width: idx == 2 ? '39.5%' : 'calc(30% - 5px)' }"
          >
            <div class="flex ai-center bot-title">
              <img
                class="bot-icon"
                :src="item.icon"
              >
              <span class="bot-name">{{ item.name }}</span>
              <template v-if="user.isadministrator && idx == 1">
                <div style="margin-left: auto;margin-right: 15px;">
                  <span v-if="manualProgress > 0 && manualProgress < 100">{{ manualProgress }}%</span>
                  <input
                    ref="manualUploader"
                    type="file"
                    style="display: none;"
                    @change="manualUpload"
                  >
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handleUploadManual"
                  >
                    {{ $t('base.button.upload') }}
                  </el-button>
                </div>
              </template>
            </div>
            <div
              v-if="item.name == '学习资料'"
              class="bot-content"
            >
              <div
                v-for="(item, idx) in currentFileList"
                :key="item.iuid"
                class="flex ai-center jc-between"
              >
                <file-icon
                  :row="item"
                  :visible="false"
                />
                <el-button
                  type="text"
                  size="default"
                  icon="el-icon-download"
                  @click="downLoadFile(item)"
                >
                  {{ $t('base.button.download') }}
                </el-button>
              </div>
            </div>
            <div
              v-if="item.name == '使用手册'"
              class="bot-content"
            >
              <div
                v-for="(item, idx) in manual"
                :key="idx"
                class="flex ai-center jc-between"
                style="height: 40px;"
              >
                <file-icon
                  :row="item"
                  :visible="false"
                />
                <div>
                  <el-button
                    type="text"
                    size="default"
                    icon="el-icon-download"
                    @click="downLoadFile(item)"
                  >
                    {{ $t('base.button.download') }}
                  </el-button>
                  <el-button
                    v-if="user.isadministrator"
                    type="text"
                    size="default"
                    style="color:#FF3300"
                    icon="el-icon-close"
                    @click="deleteManual(item)"
                  />
                </div>
              </div>
            </div>
            <div
              v-if="item.name == '常见问题'"
              class="bot-content"
            >
              <div
                v-for="item in FAQList"
                :key="item.iuid"
                class="FAQ-list"
                @click="viewDetail(item)"
              >
                <el-link> {{ item.row }}. {{ item.title }}</el-link>
              </div>
            </div>
          </div>
        </div>
      </el-aside>
      <!-- 查看 -->
      <el-dialog
        title="问题详情"
        :visible.sync="detailVisible"
        width="800px"
      >
        <div style="text-align: center;font-size: 18px;font-weight: 500;margin-bottom: 15px;">
          {{ currentFAQ.title }}
        </div>
        <div style="text-align: right;font-size: 14px;color: #999;margin-right: 20px;margin-bottom: 20px;">
          {{ currentFAQ.createTime }}
        </div>
        <div
          class="ql-editor"
          v-html="currentFAQ.contenttext"
        />
      </el-dialog>
      <!-- 视频上传 -->
      <el-dialog
        append-to-body
        width="740px"
        :title="dialogType"
        :visible.sync="dialogVisible"
        @close="resetVideoForm"
      >
        <el-form
          ref="form"
          class="material"
          :inline="true"
          :model="form"
          label-width="88px"
        >
          <el-form-item
            prop="title"
            label="视频标题："
          >
            <el-input
              v-model="form.title"
              style="width: 340px;"
              :placeholder="`请输入${activeTab}标题`"
            />
          </el-form-item>
          <el-form-item
            prop="sort"
            label="排序："
          >
            <el-input-number
              v-model="form.sort"
              style="width: 140px;"
              :min="1"
            />
          </el-form-item>
          <el-form-item
            prop="FilePath"
            label="上传视频："
          >
            <div
              v-if="form.filePath"
              class="videoBox flex column ai-center"
            >
              <video
                controls
                :src="form.videoUrl"
                controlslist="nodownload"
                class="poster"
                @contextmenu="stopEvent"
              />
              <el-button
                v-if="uploaded"
                type="text"
                @click="handleUploadVideo"
              >
                更换
              </el-button>
            </div>
            <div
              v-else
              class="avatar-uploader"
              @click="handleUploadVideo"
            >
              <i class="el-icon-plus avatar-uploader-icon" />
            </div>
            <div
              v-if="fileProgress > 0 && fileProgress < 100"
              class="flex ai-center"
              style="height: 40px;"
            >
              <el-progress
                style="width:240px"
                :percentage="parseInt(fileProgress)"
              />
              <!-- parseInt取整，否则会串行 -->
            </div>
            <input
              ref="videoUploader"
              type="file"
              accept="video/*"
              style="display: none;"
              @change="submitFile"
            >
          </el-form-item>
          <el-form-item
            prop="frontcover"
            label="视频封面："
          >
            <div
              v-if="form.thumbImg"
              class="videoBox flex column ai-center"
            >
              <img
                :src="form.thumbImg"
                class="poster"
              >
              <el-button
                v-if="uploaded"
                type="text"
                @click="handleUploadImage"
              >
                更换
              </el-button>
            </div>
            <div
              v-else
              class="avatar-uploader"
              @click="handleUploadImage"
            >
              <i class="el-icon-plus avatar-uploader-icon" />
            </div>
            <input
              ref="imageUploader"
              type="file"
              accept="image/*"
              :value="imgfile"
              style="display: none;"
              @change="thumbUpload"
            >
          </el-form-item>
          <el-form-item
            label="学习资料"
            style="width: 100%;"
            size="normal"
          >
            <div
              v-for="(item, idx) in fileList"
              :key="item.iuid"
              class="flex ai-center jc-between"
            >
              <div>{{ item.fileName }}</div>
              <el-button
                type="text"
                size="default"
                icon="el-icon-close"
                style="color: #FF3300;margin-left: 15px;"
                @click="deleteFile(item)"
              />
            </div>
            <div v-if="showUploading">
              正在上传...
            </div>
            <el-button
              size="mini"
              plain
              type="primary"
              @click="handleUploadFile"
            >
              {{ $t('base.button.upload') }}
            </el-button>
            <input
              ref="fileUploader"
              type="file"
              multiple
              style="display: none;"
              @change="fileUpload"
            >
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button
            size="small"
            @click="dialogVisible = false"
          >
            {{ $t('base.button.cancel') }}
          </el-button>
          <el-button
            size="small"
            style="margin-right: 10px;"
            type="primary"
            @click="submit"
          >
            {{ $t('base.button.confirm') }}
          </el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>
<script>
import {
  mapGetters
} from "vuex";
import postApi from "@/api/document/indexApi.js";

// quill富文本
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import articleApi from '@/api/article'

import fileIcon from '@/components/fileIcon'

export default {
  components: {
    fileIcon
  },
  computed: {
    ...mapGetters(["currApp", "user"]),
  },
  data() {
    return {
      botItems: [
        {
          name: '学习资料',
          icon: require('../../assets/主页.svg'),
        },
        {
          name: '使用手册',
          icon: require('../../assets/主页.svg'),
        }, {
          name: '常见问题',
          icon: require('../../assets/帮助.svg'),
        }
      ],
      // 分片上传
      detailVisible: false,
      currentFAQ: {},
      FAQList: [],
      showUploading: false,
      videoBoxHeight: 0,
      manual: [],
      manualProgress: 0,

      coverSuccess: false,
      fileSuccess: false,
      disabled: '',
      imgfile: '',  //封面
      fileList: [],         //编辑窗口的学习资料
      currentVideo: {},
      currentFileList: [],   //展示的学习资料
      DebrisIUID: '',
      fileProgress: 0,
      showMask: true,
      // 视频播放器配置
      dialogType: '添加',
      form: {
        sort: 1,
      },
      dialogVisible: false,
      uploadPlayerOptions: {
        width: '230px',
        aspectRatio: '16:9',
        sources: []
      },
      playerOptions: {
        height: '100%',
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false,
        muted: false, // 静音
        loop: false,
        preload: 'auto',
        language: 'zh-CN',
        aspectRatio: '16:9',
        fluid: false, // 流体大小
        sources: [],
        poster: '',
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      },
      rows: [0, 1],
      uploaded: true,
      videoList: [],
      activeTab: '学习视频',
    }
  },
  mounted() {
    this.getSharematerialData()
    this.getFAQList()
    this.getManualList()

    // 视频高度是不固定的，视频列表需要适应高度
    this.$nextTick(() => {
      this.setHeight()
      window.onresize = () => {
        return (() => {
          this.setHeight()
        })()
      }
    })
  },
  methods: {
    deleteManual(item) {
      this.$alert('确认删除本条数据？', { type: 'warning' }).then(async r => {
        let data = [item.iuid]
        let res = await postApi.post('/api/Sharematerial/UsermanualFileDataDelete', data)
        if (res.code == 1) {
          this.getManualList()
          this.$success(res.msg);
        }
      })
    },
    async getManualList() {
      let res = await postApi.post('/api/Sharematerial/GetUsermanualFileData')
      if (res.code == 1) {
        this.manual = res.data
      }
    },
    stopEvent(e) {
      if (e) e.preventDefault();
      else window.event.returnValue = false;
      return false
    },
    setHeight() {
      this.videoBoxHeight = this.$refs['video'].$el.offsetHeight
    },
    // 学习资料
    async getFileList(iuid, type = 'show') {
      let formdata = new FormData()
      formdata.append('IUID', iuid)
      formdata.append('page', 1)
      formdata.append('rows', 50)
      let res = await postApi.post('/api/Sharematerial/GetSharematerialdetailedData', formdata)
      if (res.code == 1) {
        let data = res.data.map(item => {
          return {
            ...item,
            fileSize: '' + item
          }
        })
        if (type == 'edit') {
          this.fileList = data
        } else {
          this.currentFileList = data
        }
      }
    },
    async deleteFile(item) {
      let iuids = [item.iuid]
      let res = await postApi.post('/api/Sharematerial/MaterialdetailedDelete', iuids)
      if (res.code == 1) {
        this.$success(res.msg)
        this.getFileList(this.form.iuid, 'edit')
        if (this.form.iuid == this.currentVideo.iuid) {
          this.getFileList(this.form.iuid)
        }
      }
    },
    downLoadFile(item) {
      // let filePath = encodeURIComponent(encrypt(item.filePath))
      const downloadUrl = process.env.VUE_APP_BASE_API + "/api/home/GetUploadPictureFile?IUID=" + item.iuid;
      let aLink = document.createElement("a");
      aLink.download = item.fileName;
      aLink.style.display = "none";
      aLink.setAttribute("target", "_blank");
      aLink.href = downloadUrl;
      document.body.appendChild(aLink);
      aLink.click();/*  */
      document.body.removeChild(aLink);
    },

    // 常见问题
    async getFAQList() {
      let formdata = new FormData();
      formdata.append('page', 1)
      formdata.append('rows', 40)
      let res = await articleApi.FAQList(formdata)
      if (res.code == 1) {
        this.FAQList = res.data
      }
    },
    viewDetail(row) {
      this.currentFAQ = row;
      this.$nextTick(r => {
        this.detailVisible = true
      })
    },

    // 视频编辑
    addVideo() {
      this.dialogVisible = true
      this.form.sort = this.videoList.length + 1
    },
    editVideo(item) {
      this.dialogType = this.$t('base.button.edit');
      this.getFileList(item.iuid, 'edit')
      this.form = JSON.parse(JSON.stringify(item))
      this.form.thumbImg = this.form.frontcover
      let videoUrl = process.env.VUE_APP_BASE_API + '/api/home/GetVideoFile?fileUrl=' + encodeURIComponent(item.filePath)
      this.form.videoUrl = videoUrl
      this.$nextTick(() => {
        this.dialogVisible = true
      })
    },
    async deleteVideo(item) {
      this.$confirm('是否要删除本条视频？').then(async r => {
        if (r) {
          let res = await postApi.post('/api/Sharematerial/MaterialDelete', [item.iuid])
          if (res.code == 1) {
            this.$message.success(res.msg)
            this.getSharematerialData()
          }
        }
      })
    },


    changeTab(tab) {
      this.activeTab = tab.name
      this.getSharematerialData()
      this.setHeight()
    },
    playEditingVideo() {
      this.showMask = false
    },
    // 触发上传 视频
    handleUploadVideo() {
      this.uploaded = false
      this.$refs['videoUploader'].dispatchEvent(new MouseEvent('click'))
    },
    // 触发上传  封面图
    handleUploadImage() {
      this.$refs['imageUploader'].dispatchEvent(new MouseEvent('click'))
    },
    // 触发上传  学习资料
    handleUploadFile() {
      this.$refs['fileUploader'].dispatchEvent(new MouseEvent('click'))
    },
    // 触发上传  用户手册
    handleUploadManual() {
      this.$refs['manualUploader'][0].dispatchEvent(new MouseEvent('click'))
    },

    async manualUpload(file) {
      var files = file.target.files;
      for (let i = 0; i < files.length; i++) {
        let DebrisIUID = this.$NewGuid()
        console.log(files[i]);
        await this.fileSubt(files[i], 0, 'manual', DebrisIUID)
      }
    },
    async fileUpload(file) {
      var files = file.target.files;
      this.showUploading = true
      for (let i = 0; i < files.length; i++) {
        let DebrisIUID = this.$NewGuid()
        await this.fileSubt(files[i], 0, 'file', DebrisIUID)
      }
    },
    thumbUpload(file) {
      this.form.frontcover = ''
      var files = file.target.files
      this.form.frontcover = files[0]
      this.coverSuccess = true
      var URL = window.URL || window.webkitURL;
      // 通过 file 生成目标 url
      var imgURL = URL.createObjectURL(files[0]);
      this.form.thumbImg = imgURL
      this.$forceUpdate()
      this.imgfile = ''
    },
    //上传文件
    async submitFile(file) {
      this.form.filePath = ''
      var files = file.target.files
      this.form.fileName = files[0].name
      this.form.fileSize = files[0].size
      let DebrisIUID = this.$NewGuid()
      await this.fileSubt(files[0], 0, 'video', DebrisIUID)
      if (this.fileProgress == 100.00) {
        let videoUrl = process.env.VUE_APP_BASE_API + '/api/home/GetVideoFile?fileUrl=' + encodeURIComponent(this.form.filePath)
        this.form.videoUrl = videoUrl
        this.disabled = false
        this.uploaded = true
        this.fileSuccess = true
      }
    },
    async fileSubt(file, i, type, DebrisIUID) {
      if (type != 'manual') {
        if (this.dialogVisible == false) {
          //请求分片文件删除接口
          this.form.filePath = ''
          this.fileProgress = 0
          return false;
        }
      }

      var name = file.name, //文件名
        size = file.size, //总大小shardSize = 2 * 1024 * 1024,
        shardSize = 1 * 1024 * 1024, //以1MB为一个分片
        shardCount = Math.ceil(size / shardSize); //总片数
      if (i > shardCount) {
        return;
      }
      //计算每一片的起始与结束位置
      var start = i * shardSize,
        end = Math.min(size, start + shardSize);
      //构造一个表单，FormData是HTML5新增的
      var form = new FormData();
      form.append("data", file.slice(start, end)); //slice方法用于切出文件的一部分
      form.append("totalSize", size);
      form.append("fileName", name);
      form.append("totalChunks", shardCount == 0 ? 1 : shardCount); //总片数
      form.append("chunkNumber", i + 1); //当前是第几片
      form.append("DebrisIUID", DebrisIUID);
      if (type == 'file') {
        form.append("IUID", this.form.iuid);
      }
      let url = type == 'video' ? '/api/Sharematerial/MaterialFileAdd'
        : type == 'file' ? '/api/Sharematerial/MaterialFileDataAdd' : '/api/Sharematerial/UsermanualFileDataAdd'
      var res = await postApi.post(url, form);
      if (type == 'video') {
        if (res.code == 0 && res.progress == '100.00') {
          this.fileProgress = Number(res.progress)
          this.form.filePath = res.filePath
        } else if (res.code == 0 && !res.mergeOk) {
          i = res.number++;
          this.fileProgress = Number(res.progress)
          this.form.filePath = res.filePath
          await this.fileSubt(file, i, type, DebrisIUID)
        }
      } else if (type == 'file') {
        if (res.code == 0 && res.progress == '100.00') {
          this.getFileList(this.form.iuid, 'edit')
          this.showUploading = false
          this.$forceUpdate()
          if (this.form.iuid == this.currentVideo.iuid) {
            this.getFileList(this.form.iuid)
          }
        } else if (res.code == 0 && !res.mergeOk) {
          i = res.number++;
          await this.fileSubt(file, i, type, DebrisIUID)
        }
      } else if (type == 'manual') {
        if (res.code == 0 && res.progress == '100.00') {
          this.manualProgress = Number(res.progress)
          this.getManualList()
          this.$success(res.msg)
        } else if (res.code == 0 && !res.mergeOk) {
          i = res.number++;
          this.manualProgress = Number(res.progress)
          await this.fileSubt(file, i, type, DebrisIUID)
        }
      }
    },
    async submit(type) {
      let data = this.form
      let formData = new FormData()
      if (this.dialogType == this.$t('base.button.edit')) {
        formData.append('iuid', data.iuid)
      }
      formData.append('typename', this.activeTab)
      formData.append('title', data.title)
      formData.append('FileName', this.fileSuccess ? data.fileName : '')
      formData.append('FileSize', this.fileSuccess ? data.fileSize : '')
      formData.append('FilePath', this.fileSuccess ? data.filePath : '')
      formData.append('frontcover', this.coverSuccess ? data.frontcover : '')
      formData.append('sort', data.sort)
      let res = await postApi.post('/api/Sharematerial/MaterialAdd', formData)
      if (res.code == 1) {
        this.coverSuccess = false
        this.fileSuccess = false
        this.$message.success(res.msg)
        this.dialogVisible = false;
        this.getSharematerialData()
      }
    },
    async getSharematerialData() {
      this.videoList = []
      var postData = new FormData()
      postData.append('page', 1);
      postData.append('rows', 20);
      postData.append('typename', this.activeTab);
      let res = await postApi.post('/api/Sharematerial/GetSharematerialData', postData)
      this.videoList = res.data
      this.handleClockVideo(this.videoList[0])
    },

    resetVideoForm() {
      this.form = {
        sort: 1
      }
      this.form.frontcover = ''
      this.form.thumbImg = ''
    },
    handleClockVideo(item) {
      let url = encodeURIComponent(item.filePath)
      this.getFileList(item.iuid)
      this.currentVideo = item
      let videoUrl = process.env.VUE_APP_BASE_API + '/api/home/GetVideoFile?fileUrl=' + url
      this.playerOptions.sources = []
      this.playerOptions.poster = item.frontcover
      this.playerOptions.sources.push({
        src: videoUrl,
        type: 'video/' + item.fileSuffix.toLowerCase().replace('.', '')
      });
    }
  }
}
</script>
<style scoped lang="scss">
.downloadManual {
  font-size: 14px;
  line-height: 40px;
  color: #409eff;
  font-weight: 500;
}

.downloadManual {
  &:hover {
    color: #66b1ff;
  }
}

.tableLinkIcon {
  width: 16px;
  height: 16px;
}

.FAQ-list {
  margin: 10px 0 0;
}

.bgwhite {
  position: relative;

  .uploadBtn {
    position: absolute;
    right: 10px;
    top: 5px;
    z-index: 200;
  }
}


.bot-item {
  height: 100%;
  overflow: hidden;

  .bot-title {
    height: 28px;
    margin-left: 20px;
    margin-top: 15px;

    .bot-icon {
      width: 16px;
      height: 16px;
    }

    .bot-name {
      margin-left: 5px;
      font-size: 16px
    }
  }

  .bot-content {
    height: calc(100% - 55px);
    padding: 0 20px;
    overflow-y: auto;
  }
}

.material {
  .video-btn {
    color: #fff;
    margin: 0 15px;
    cursor: pointer;
    font-weight: 500;

    &:hover {
      color: #409eff
    }
  }

  .videoBox {
    width: 240px;
    // height: 135px;
    position: relative;

    .poster {
      width: 240px;
      height: 135px;
      background-color: #000;
      object-fit: contain;
    }
  }

  .avatar-uploader,
  .avatar-uploader-icon {
    width: 240px;
    height: 135px;
    line-height: 135px;
  }
}
</style>
<style lang="scss">
.class-menu-tabs {
  border-radius: 10px;
  border: 0 none;
  box-shadow: none;

  .el-tabs__nav-wrap {
    &:after {
      display: none;
    }
  }

  .el-tabs__nav-scroll {
    display: flex;
    align-items: left;

    .el-tabs__nav {
      display: flex;
      align-items: left;

      .el-tabs__item {
        vertical-align: bottom;
        border-radius: 4px;
        text-align: left;
        background: #F5F7FA;
        border-bottom: 1px solid #d6dae3;
        font-weight: 800;

        &.is-active {
          color: black;
          background: #c1c5ccea; //#ffffff;
          // border-top: 2px solid #409EFF;
        }
      }

      .el-tabs__active-bar {
        display: none;
      }
    }
  }

  .el-menu {
    background-color: #f5f7fa !important;
  }

  .menu-wrapper {
    background: #f5f7fa;
    margin: 0;
  }

  .video-box {
    // margin-left: 13px;
    width: 31.6%;
    margin-right: 2%;
    height: 145px;
    margin-bottom: 10px;
    border: 1px solid #eee;
    background: rgba(255, 255, 255, 1);
    border-radius: 5px;
    overflow: hidden;
    // border: 1px solid rgba(193, 198, 210, 0.64);
    position: relative;

    &:hover {
      &:before {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 998;
        right: 0;
        top: 0;
        background-color: #00000044;
      }
    }

    .videoList-btnBox {
      position: absolute;
      z-index: 999;
      right: 5px;
      top: 0;

      .btn {
        display: block;
        margin: 0;
        margin-top: 5px;
      }
    }

    .video-image {
      width: 100%;
      height: 110px;
      border-bottom: 1px solid rgba(235, 238, 245, 1)
    }
  }

  .video-box:nth-child(3n) {
    margin-right: 0;
  }

  .video-box:hover {
    cursor: pointer;
    // transform: translateY(-3px);
    box-shadow: 2px 0px 6px 1px rgba(0, 0, 0, 0.2);
  }
}

.video-js {
  .vjs-big-play-button {
    top: calc(50% - 0.81666em);
    left: calc(50% - 1.5em);
    line-height: 1.63332em;
  }
}
</style>
