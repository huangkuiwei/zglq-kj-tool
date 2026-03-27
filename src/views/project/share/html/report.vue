<template>
  <div class="html-container">
    <div v-if="isPhone" class="html-content-phone">
      <el-skeleton :rows="10" animated :loading="htmlContents.length === 0">
        <el-carousel height="100vh" :autoplay="false" :indicator-position="'none'" :loop="false">
          <el-carousel-item v-for="(item, index) in htmlContents" :key="index">
            <div v-html="item" class="html-item-content"></div>
          </el-carousel-item>
        </el-carousel>
      </el-skeleton>

      <el-dialog title="模型文件" custom-class="html-model-dialog" fullscreen lock-scroll :modal="false" :visible.sync="dialogVisible">
        <iframe ref="htmlModelRef" frameborder="0" class="html-iframe" :src="iframeUrl" @load="sendFileData"></iframe>
      </el-dialog>
    </div>
    <div v-else class="html-content-web">

      <div class="html-report" id="htmlReport">

        <el-skeleton v-if="isTypeHtml !== 2" :rows="22" animated :loading="htmlContents.length === 0">
          <el-carousel height="100vh" :autoplay="false" :indicator-position="'none'" :loop="false">
            <el-carousel-item v-for="(item, index) in htmlContents" :key="index">
              <div v-html="item" class="html-item-content"></div>
            </el-carousel-item>
          </el-carousel>
        </el-skeleton>
        <div v-else class='editor-ppt-content'>
          <div class='ppt-iframe-content'>
            <iframe :src="pptSrc" :style="{ width: '100%', height: '100%', border: 0 }"></iframe>
          </div>
          <div class='ppt-relation-content'>
            <div class='relation-item-content'>
              <div class='relation-item' v-for="(item, index) in relationList" :key="index" @click="handleRelation(item.id)">
                {{ item.text }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="html-model" id="htmlModel">
        <iframe ref="htmlModelRef" frameborder="0" class="html-iframe" :src="iframeUrl" @load="sendFileData"></iframe>
      </div>
    </div>
  </div>
</template>
<script>
import Split from 'split.js';
import { encrypt, decrypt } from '@/utils';
import local from "@/utils/auth";

const FULL_SCREEN_SVG = '<svg viewBox="0 0 1024 1024"><path d="M133.705143 335.433143V133.851429h201.581714a29.622857 29.622857 0 0 0 29.622857-29.549715V68.754286a29.622857 29.622857 0 0 0-29.622857-29.622857H61.732571A22.893714 22.893714 0 0 0 38.765714 62.025143V335.725714c0 16.310857 13.238857 29.622857 29.622857 29.622857h35.547429a29.842286 29.842286 0 0 0 29.696-29.842285zM690.980571 133.851429h201.581715v201.654857c0 16.310857 13.238857 29.549714 29.622857 29.549714h35.547428a29.622857 29.622857 0 0 0 29.549715-29.549714V61.952a22.893714 22.893714 0 0 0-22.820572-22.893714h-273.554285a29.622857 29.622857 0 0 0-29.549715 29.622857v35.547428c0 16.310857 13.238857 29.696 29.622857 29.696zM335.286857 892.781714H133.705143V691.2a29.622857 29.622857 0 0 0-29.622857-29.622857H68.534857a29.622857 29.622857 0 0 0-29.549714 29.622857v273.554286c0 12.653714 10.24 22.893714 22.820571 22.893714h273.554286a29.622857 29.622857 0 0 0 29.696-29.622857v-35.547429a29.769143 29.769143 0 0 0-29.769143-29.696z m557.348572-201.581714v201.581714H690.907429a29.622857 29.622857 0 0 0-29.622858 29.622857v35.547429c0 16.310857 13.238857 29.622857 29.622858 29.622857h273.554285c12.580571 0 22.893714-10.313143 22.893715-22.893714V691.2a29.622857 29.622857 0 0 0-29.622858-29.622857h-35.547428a29.622857 29.622857 0 0 0-29.696 29.622857z"></path></svg>';

let loadingInstance = null;
export default {
  data() {
    return {
      baseUrl: process.env.BimWorksOrigin,
      dialogVisible: true,

      bimPath: '',
      htmlId: '',
      htmlContents: [],
      relationList: [],
      iframeUrl: '',
      pptSrc: 'https://developer.bimwindows.cn/project/sjk/ppt1/index.html',

      isSwitch: false,
      isTypeHtml: 1,
    }
  },
  computed: {
    isPhone() {
      if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    this.$iframeListener((res) => {
      console.log('外壳收到消息：', { ...res.data });
      let data = res.data;

      // 模型加载完成
      if (data.command === "onViewOpenCompleted" || res.data.cmd === "onViewOpenCompleted") {
        console.log('------------------onViewOpenCompleted------------------');
        // this.setViewBim();
        // 获取报告内容
        this.getHtmlContent();
      }

      // 页面报告数据获取成功
      if (data.command === "getHtmlDataSuccess" || data.cmd === "getHtmlDataSuccess") {
        console.log('------------------getHtmlDataSuccess------------------');
        console.log(data.data && data.data.htmlContent);
        if (data.data && data.data.htmlContent) {
          this.isTypeHtml = data.data.htmlType || 1;
          if (data.data.htmlType === 2) { // ppt外链模式
            // 获取所有关联数据
            this.relationList = data.data.relationList || [];
          }
          else {
            this.htmlContents = data.data.htmlContent;
            this.resetIframe();
          }

          if (!this.isSwitch) {
            this.switchModelHtml();
            this.isSwitch = true;
          }
        }
      }

      // 模型视图切换完成
      if (data.command === 'switchModelHtmlSuccess' || data.cmd === 'switchModelHtmlSuccess') {
        if (this.isPhone) {
          this.dialogVisible = false;
        }
        loadingInstance && loadingInstance.close();
      }
    });
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const path = this.$route.query.s;
      if (!path) {
        this.$message.error('地址参数有误');
        return;
      }
      let decodeParam = decodeURIComponent(decrypt(path));
      let pathArr = decodeParam.split('&');
      let bimPath = pathArr[0];
      let id = pathArr[1];
      if (!bimPath || !id) {
        this.$message.error('地址参数有误');
        return;
      }
      let url = this.baseUrl + "/?" + this.$turnEncryptParams(bimPath, 'forViewBim')

      this.bimPath = bimPath;
      this.htmlId = id;
      this.iframeUrl = url;

      if (this.isPhone) {

      } else {
        this.setWebResize();
      }

      this.addDocumentListener();
    },
    addDocumentListener() {
      // 绑定监听点击事件 .html-item-content [data-relationid]
      document.addEventListener('click', (e) => {
        // console.log('点击事件', e.target);
        if (!e.target) {
          return;
        }
        // e.target === strong标签
        if (e.target.tagName === 'STRONG') {
          // 往上找到父级 为span 属性为data-relationid的元素
          let parent = e.target.parentNode;
          if (parent.tagName === 'SPAN') {
            parent = parent.parentNode;
          }

          if (parent.tagName === 'SPAN' && parent.getAttribute('data-relationid')) {

          }
          else {
            return;
          }

          if (this.isPhone) {
            this.dialogVisible = true;
          }

          this.handleRelation(parent.getAttribute('data-relationid'))
        }
      });
    },
    // iframe标签添加全屏按钮
    resetIframe() {
      // 获取 .html-report 下所有的iframe标签
      let iframes = document.querySelectorAll('.html-report iframe');
      let iframeBtns = document.querySelectorAll('.html-report .iframe-btn');
      iframeBtns.forEach((iframeBtn) => {
        iframeBtn.remove();
      });
      // 遍历所有iframe 获取每个iframe的 offsetTop offsetLeft 创建一个悬浮定位的按钮
      iframes.forEach((iframe) => {
        let iframeButton = document.createElement('div');
        iframeButton.innerHTML = FULL_SCREEN_SVG;
        iframeButton.title = '全屏';
        iframeButton.class = 'iframe-button';
        iframeButton.addEventListener('click', () => {
          if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
          }
        });
        // 将iframeButton 插入到 当前iframe之前
        iframe.parentNode.insertBefore(iframeButton, iframe);
      });
    },
    sendFileData() {
      // this.setViewBim();
      this.setIframeLoadQuiet();
      if (loadingInstance) {
        return;
      }
      loadingInstance = this.$loading({
        lock: true,
        text: '模型加载中...',
        spinner: 'el-icon-loading',
        background: '#6696e2',
        target: this.isPhone ? document.body : document.querySelector('#htmlModel'),
        fullscreen: this.isPhone,
        customClass: 'html-model-loading'
      });
    },
    setIframeLoadQuiet() {
      this.$refs.htmlModelRef.contentWindow.postMessage(
        {
          command: 'onlyShowModel',
          Data: {
            onlyShowModel: true,
            fileOriginalUrl: process.env.BASE_API,
            token: local.getToken()
          },
        },
        this.baseUrl
      );
    },
    // 设置web端Resize
    setWebResize() {
      Split(['#htmlReport', '#htmlModel'], {
        sizes: [50, 50],
      });
    },
    // 设置纯净模式
    setViewBim() {
      console.log('设置纯净模式');
      this.$refs.htmlModelRef.contentWindow.postMessage(
        {
          command: 'onlyShowModel',
          Data: {
            showMenu: false,
          },
        },
        this.baseUrl
      );
    },
    switchModelHtml() {
      this.$refs.htmlModelRef.contentWindow.postMessage(
        {
          command: 'handleHtml',
          Data: {
            action: 'switchHtmlFrontstage',
          },
        },
        this.baseUrl
      );
    },
    getHtmlContent() {
      console.log('获取报告内容', this.htmlId);
      this.$refs.htmlModelRef.contentWindow.postMessage(
        {
          command: 'handleHtml',
          Data: {
            action: 'getHtmlData',
            id: this.htmlId
          },
        },
        this.baseUrl
      );
    },
    handleRelation(relationid) {
      this.$refs.htmlModelRef.contentWindow.postMessage(
        {
          command: 'handleHtml',
          Data: {
            action: 'clickRelationId',
            relationId: relationid,
          },
        },
        this.baseUrl
      );
    }
  },
}
</script>
<style lang="scss" scoped>
.html-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .html-content-web,
  .html-content-phone {
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .html-iframe {
      min-height: 100vh;
      border: none;
      width: 100%;
      box-sizing: border-box;
    }
  }

  .html-content-web {
    display: flex;
    flex-direction: row;

    .html-report,
    .html-model {
      display: block;
      height: 100vh;
    }

    .el-carousel.el-carousel--horizontal {
      height: 100vh;

      .html-item-content {
        padding: 10px 20px;
        height: 100vh;
        box-sizing: border-box;
        overflow-y: auto;
      }
    }

    .iframe-button {
      width: 20px;
      margin-left: 10px;
      cursor: pointer;
    }
  }

  .html-content-phone {
    .html-item-content {
      padding: 10px 20px;
      height: 100vh;
      box-sizing: border-box;
      overflow-y: auto;
    }
  }

  .editor-ppt-content {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .ppt-iframe-content {
      width: 100%;
      height: 100%;
    }

    .ppt-relation-content {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding-left: 20px;
      padding-bottom: 10px;
      box-sizing: border-box;

      .relation-item-content {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      .relation-item {
        padding: 2px 4px;
        background-color: #374b5b;
        margin-right: 6px;
        cursor: pointer;
        border-radius: 4px;
        color: #fff;
        font-weight: 400;
        font-size: 12px;
        border: 0;
      }

      .relation-item:hover {
        background-color: #ea7540;
        color: #FFF;
      }
    }
  }
}
</style>
<style>
.html-content-web .gutter {
  background-color: #eee;
  background-repeat: no-repeat;
  background-position: 50%;
}

.html-content-web .gutter.gutter-horizontal {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
  cursor: col-resize;
}

.html-content-web .gutter.gutter-vertical {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
  cursor: row-resize;
}

.html-content-web,
.html-content-phone .html-model-dialog .el-dialog__body {
  padding: 0;
}

.html-model-loading {
  background: #6696e2 !important;
  z-index: 99999 !important;
}

.html-model-loading .el-loading-spinner .el-loading-text {
  color: #FFF;
  margin: 10px 0;
  font-size: 16px;
}

.html-model-loading .el-loading-spinner i {
  font-size: 50px;
  color: #fff;
}
</style>
