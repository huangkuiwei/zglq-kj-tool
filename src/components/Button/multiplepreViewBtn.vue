<template>
  <div style="display: inline-block">
    <el-button type="primary" plain size="mini" @click="openMultiplepreView">打开</el-button>
    <div style="
        position: fixed;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
        z-index: 1000;
      " v-if="preViewVisible">
      <template v-for="(item, index) in dialogDataList">
        <div :key="index" class="mutiplepreViewDialog" @click="preposeClickSign && preposeDialog(item, index)" :style="{
            left:item.left,
            top: item.top,
            width: item.width,
            height: item.height,
            'z-index': item.zIndex 
          }" v-if="item.dialogVisible">
          <div class="mutiplepreViewDialogTitle" v-drag>
            <span>{{ item.fileName }}</span>
            <div class="mutiplepreViewDialogBtn">
              <el-button v-if="renderStatus == 'stack'" size="mini" @click.stop.native="changeRenderStatus('tile')">平铺</el-button>
              <el-button v-else size="mini" @click.stop.native="changeRenderStatus('stack')">层叠</el-button>
              <el-link icon="iconfont icon-suoxiao" v-if="item.isFullScreen" @click="resetMutiplepreViewDialog(item, index, $event)">
              </el-link>
              <el-link icon="el-icon-full-screen" v-if="!item.isFullScreen" @click="maximizeMutiplepreViewDialog(item, index, $event)">
              </el-link>
              <el-link icon="el-icon-close" @click="closeMutiplepreViewDialogVisible(item, index, $event)">
              </el-link>
            </div>
          </div>
          <div class="mutiplepreViewDialogBody">
            <div @click="preposeClickSign &&  preposeDialog(item, index)" style="position: absolute; width: 100%; height: calc(100% - 41px)" v-if="renderStatus == 'stack' && item.hasMask" :style="{ 'z-index': item.zIndex + 100 }"></div>
            <div class="iframe" v-if="
                $modelFileSuffix
                  .concat($ibimFileSuffix)
                  .indexOf(item.fileSuffix.toLowerCase()) > -1
              " style="
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #f7f7f7;
              ">
              <iframe v-if="$supportWebGL()" v-show="item.iframeLoaded" :src="modelPreViewInitUrl(item)" class="iframe" ref="imodelIframe" @load="sendFileData(item, index, $event)" style="background-color: white"></iframe>
              <div style="width: inherit; height: inherit" v-else>
                <img style="width: inherit; height: inherit" :src="notSupportWebGLImg" />
              </div>
              <div style="color: #409eff; font-size: 20px" v-show="!item.iframeLoaded && $supportWebGL()">
                <i class="el-icon-loading" style="font-size: 22px"></i> Imodel加载中，请稍后...
              </div>
            </div>
            <div class="iframe" v-if="
                $videoFileSuffix
                  .concat($otherVideoFileSuffix)
                  .indexOf(item.fileSuffix.toLowerCase()) > -1
              ">
              <video :src="
                  $videoFileSuffix.indexOf(item.fileSuffix.toLowerCase()) > -1
                    ? videoPath(item)
                    : videoReturnPath(item)
                " controls autoplay style="width: 100%; height: 100%; background-color: black"></video>
            </div>
            <template v-if="
                $officeFileSuffix.indexOf(item.fileSuffix.toLowerCase()) > -1 &&
                ($pptFileSuffix.indexOf(item.fileSuffix.toLowerCase()) === -1 ||
                  ($pptFileSuffix.indexOf(item.fileSuffix.toLowerCase()) > -1 &&
                    !item.pptFileSizeTooLarge))
              ">
              <div class="iframe" @click="preposeClickSign && preposeDialog(item, index)">
                <iframe ref="microsoftOfficeWindow" :src="
                    'https://view.officeapps.live.com/op/view.aspx?src=' +
                    encodeURIComponent(filePath(item))
                  " class="iframe"></iframe>
              </div>
            </template>
            <div class="iframe" v-if="
                item.fileSuffix.toLowerCase() === '.pdf' ||
                ($pptFileSuffix.indexOf(item.fileSuffix.toLowerCase()) > -1 &&
                  item.pptFileSizeTooLarge)
              ">
              <iframe :src="
                  assetsPath + '/static/web/viewer.html?file=' +
                  encodeURIComponent(
                    item.fileSuffix.toLowerCase() === '.pdf'
                      ? filePath(item)
                      : pptTooLargeFilePath(item)
                  )
                " class="iframe"></iframe>
            </div>
            <div class="iframe" v-if="item.fileSuffix.toLowerCase() === '.txt'" style="background-color: white; padding-top: 50px; overflow: auto">
              <div id="txtContainer">{{ getTxtText(item) }}</div>
            </div>
            <div class="iframe" v-if="$imageFileSuffix.indexOf(item.fileSuffix.toLowerCase()) > -1" style="background-color: white;display: flex;justify-content: center;align-items: center;">
              <img :src="filePath(item)" style="max-width: 50%; max-height: 50%" />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import _ from "lodash";
  import notSupportWebGLImg from "@/assets/webGL支持.png";
  import {
    encrypt
  } from '@/utils'
  export default {
    props: {
      rows: {
        type: Array,
      },
    },
    watch: {
      preViewVisible() {
        if (!this.preViewVisible) {
          this.renderStatus = "stack"
        } else {
          this.changeRenderStatus('stack')
        }
      },
      renderStatus() {
        setTimeout(() => {
          if (this.renderStatus == 'stack') {
            this.preposeClickSign = true
          } else {
            this.preposeClickSign = false
          }
        }, 500)
      },
      rows: {
        handler() {
          this.dialogDataList = _.cloneDeep(this.rows);
          this.dialogDataList.forEach((item, index) => {
            item.left = 'calc( 20% + ' + index * 65 + 'px)'
            item.top = 100 + index * 55 + 'px'
            item.width = '80%'
            item.height = '80%'
            item.zIndex = 1000
            item.dialogVisible = true;
            if (this.$pptFileSuffix.indexOf(item.fileSuffix.toLowerCase()) > -1) {
              item.pptFileSizeTooLarge = this.$pptFileSizeToLarge(item.fileSize);
            } else {
              item.pptFileSizeTooLarge = false;
            }
            if (index + 1 < this.dialogDataList.length) {
              item.hasMask = true;
            } else {
              item.hasMask = false;
            }
          });
        },
        immediate: true,
      },
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
    data() {
      return {
        preViewVisible: false,
        dialogDataList: [],
        notSupportWebGLImg: notSupportWebGLImg,
        initZIndex: 1001,
        dialogPosition: {
          top: null,
          left: null,
          width: null,
          height: null,
          zIndex: null
        },
        renderStatus: "stack", //  ['stack','tile'] 层叠、平铺
        preposeClickSign: true,
        assetsPath: process.env.ASSET_PATH
      };
    },
    mounted() {
      this.$iframeListener(this.messageReceived);
    },
    methods: {
      changeRenderStatus(status) {
        if (status == 'stack') {
          this.dialogDataList.forEach((element, index) => {
            element.left = 'calc( 20% + ' + index * 65 + 'px)'
            element.top = 100 + index * 55 + 'px'
            element.width = '80%'
            element.height = '80%'
            element.zIndex = 1000
            this.$set(this.dialogDataList, index, element)
          });
        } else {
          let width = 0
          let height = 0
          if (this.dialogDataList.length <= 3) {
            width = (document.documentElement.clientWidth - 4) / this.dialogDataList.length
            height = '100%'
            this.dialogDataList.forEach((element, index) => {
              element.left = index * (width + 2) + 'px'
              element.top = 0
              element.width = width + 'px'
              element.height = height
              element.zIndex = 1000
              this.$set(this.dialogDataList, index, element)
            })
          } else if (this.dialogDataList.length === 4) {
            width = (document.documentElement.clientWidth - 2) / 2
            height = (document.documentElement.clientHeight - 2) / 2
            this.dialogDataList.forEach((element, index) => {
              if (index <= 1) {
                element.left = index * (width + 2) + 'px'
                element.top = 0
              } else {
                element.top = height + 2 + 'px'
                element.left = (index - 2) * (width + 2) + 'px'
              }
              element.width = width + 'px'
              element.height = height + 'px'
              element.zIndex = 1000
              this.$set(this.dialogDataList, index, element)
            })
          } else if (this.dialogDataList.length === 5) {
            width = (document.documentElement.clientWidth - 4) / 3
            height = (document.documentElement.clientHeight - 2) / 2
            this.dialogDataList.forEach((element, index) => {
              if (index <= 1) {
                element.left = index * (width + 2) + 'px'
                element.top = 0
                element.width = width + 'px'
                element.height = height + 'px'
              } else if (index > 1 && index < 4) {
                element.top = height + 2 + 'px'
                element.left = (index - 2) * (width + 2) + 'px'
                element.width = width + 'px'
                element.height = height + 'px'
              } else {
                element.top = 0
                element.height = document.documentElement.clientHeight + 'px'
                element.width = width + 'px'
                element.left = (index - 2) * (width + 2) + 'px'
              }
              element.zIndex = 1000
              this.$set(this.dialogDataList, index, element)
            })
          } else {
            width = (document.documentElement.clientWidth - 4) / 3
            height = (document.documentElement.clientHeight - 2) / 2
            this.dialogDataList.forEach((element, index) => {
              if (index < 3) {
                element.top = 0
                element.left = index * (width + 2) + 'px'
              } else {
                element.top = height + 2 + 'px'
                element.left = (index - 3) * (width + 2) + 'px'
              }
              element.width = width + 'px'
              element.height = height + 'px'
              element.zIndex = 1000
              this.$set(this.dialogDataList, index, element)
            })
          }
        }
        this.renderStatus = status
      },
      messageReceived(res) {
        // console.log("res:", res);
        if (res.data.command == "ImodelClose") {
          var data = this.dialogDataList.find((item) => {
            return item.iuid == res.data.data;
          });
          data.dialogVisible = false;
          var index = this.dialogDataList.findIndex((item) => {
            return item.iuid == res.data.data;
          });
          this.$set(this.dialogDataList, index, data);
          var closeAll = this.dialogDataList.every((item) => {
            return item.dialogVisible === false;
          });
          if (closeAll) {
            this.preViewVisible = false;
          }
        }
      },
      maximizeMutiplepreViewDialog(item, index, el) {
        this.initZIndex += 1
        this.dialogPosition.top = this.dialogDataList[index].top
        this.dialogPosition.left = this.dialogDataList[index].left
        this.dialogPosition.zIndex = this.dialogDataList[index].zIndex
        this.dialogPosition.width = this.dialogDataList[index].width
        this.dialogPosition.height = this.dialogDataList[index].height
        this.dialogDataList[index].top = "0px";
        this.dialogDataList[index].left = "0px";
        this.dialogDataList[index].height = "100%";
        this.dialogDataList[index].width = "100%";
        this.dialogDataList[index].zIndex = "" + this.initZIndex + "";
        item.isFullScreen = true;
        this.$set(this.dialogDataList, index, item);
      },
      resetMutiplepreViewDialog(item, index, el) {
        this.dialogDataList[index].top = this.dialogPosition.top;
        this.dialogDataList[index].left = this.dialogPosition.left;
        this.dialogDataList[index].height = this.dialogPosition.height;
        this.dialogDataList[index].width = this.dialogPosition.width;
        this.dialogDataList[index].zIndex = this.dialogPosition.zIndex;
        item.isFullScreen = false;
        this.$set(this.dialogDataList, index, item);
      },
      preposeDialog(item, index) {
        console.log('prepose')
        this.initZIndex += 1;
        item.zIndex = this.initZIndex;
        this.$set(this.dialogDataList, index, item);
        this.dialogDataList.forEach((element, index) => {
          if (element.zIndex != this.initZIndex) {
            element.hasMask = true;
          } else {
            element.hasMask = false;
          }
          this.$set(this.dialogDataList, index, element);
        });
      },
      filePath(row) {
        return row ? process.env.BASE_API + "/api/home/GetUploadPictureFileZip?IUID=" + row.iuid + '&fileType=' + row.fileType + '&getFileFolderName=' + row.getFileFolderName : null;
      },
      openMultiplepreView() {
        this.preViewVisible = true;
        this.dialogDataList.forEach((item, index) => {
          item.dialogVisible = true;
        });
      },
      closeMutiplepreViewDialogVisible(item, index, el) {
        if (this.$modelFileSuffix.concat(this.$ibimFileSuffix).indexOf(item.fileSuffix.toLowerCase()) > -1 && item.iframeLoaded) {
          var target = el.target.parentNode.parentNode.parentNode.children[1].children[item.zIndex == this.initZIndex ? 0 : 1].children[0];
          if (target && target.contentWindow) {
            this.$iframePostMes(target.contentWindow, "ImodelClose", null);
          }
        } else {
          item.dialogVisible = false;
          this.$set(this.dialogDataList, index, item);
          var closeAll = this.dialogDataList.every((item) => {
            return item.dialogVisible === false;
          });
          if (closeAll) {
            this.preViewVisible = false;
          }
        }
      },
      sendFileData(row, index, el) {
        row.iframeLoaded = true;
        this.$iframePostMes(this.$refs.imodelIframe[index].contentWindow, "CurrentFile", row);
      },
      modelPreViewInitUrl(row) {
        let file = this.$ibimFileSuffix.indexOf(row.fileSuffix.toLowerCase()) > -1 ? row.filePath : row.turnPath
        return (process.env.GisIframeOrigin + "/?" + this.$turnEncryptParams(file));
      },
      videoReturnPath(row) {
        return row ? process.env.BASE_API + "/api/home/GetVideoFile?fileUrl=" + encodeURIComponent(encrypt(row.turnPath)) : null;
      },
      videoPath(row) {
        return row ? process.env.BASE_API + "/api/home/GetVideoFile?fileUrl=" + encodeURIComponent(encrypt(row.filePath)) : null;
      },
      pptTooLargeFilePath(row) {
        return row ? process.env.BASE_API + "/api/home/GetUploadPictureFileZip?IUID=" + row.iuid + '&fileType=' + row.fileType + '&getFileFolderName=' + row.getFileFolderName : null;
      },
      getTxtText(row) {
        var xmlhttp;
        try {
          xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
          try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (e) {}
        }
        if (!xmlhttp) xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState == 4) {
            var s = xmlhttp.responseText;
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            document.getElementById("txtContainer").innerText = s;
            xmlhttp = null;
          }
        };
        xmlhttp.open("GET", this.filePath(row), true);
        xmlhttp.send(null);
      },
    },
  };
</script>
<style scoped>
  .iframe {
    height: 100%;
    width: 100%;
    border: none;
  }

  .mutiplepreViewDialog {
    position: fixed;
    z-index: 1001;
    left: 20%;
    top: 100px;
    margin-right: 30px;
    background-color: white;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
    border: 1px solid #e2e2e2;
    box-shadow: 0 0 10px #ccc;
  }

  .mutiplepreViewDialogTitle:hover {
    cursor: move;
  }

  .mutiplepreViewDialogTitle {
    border-bottom: 1px solid #ebeef5;
    line-height: 40px;
    color: #303133;
    font-size: 14px;
    padding-left: 15px;
    background-color: #e4eaf5;
  }

  .mutiplepreViewDialogBtn {
    float: right;
    margin-right: 10px;
  }

  .mutiplepreViewDialogBtn a {
    margin-right: 10px;
  }

  .mutiplepreViewDialogBtn button {
    margin-right: 15px;
  }

  .mutiplepreViewDialogBody {
    height: calc(100% - 41px);
  }
</style>
