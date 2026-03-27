<template>
  <div v-if="row && row.fileSuffix.toLowerCase() == ''" class="fileTypeIcon" @click="linkToPage(row)" :style="{ cursor: visible ? 'pointer' : 'normal' }">
    <div class="flex ai-center">
      <img class="tableLinkIcon" style="margin-right: 8px;" src="@/assets/button/liangchang.svg" />
      <!-- <svg class="tableLinkIcon" aria-hidden="true">
        <use xlink:href="#icon-wenjian"></use>
      </svg> -->
    </div>
    <!--el-tooltip effect="light" content="单击打开文件夹" placement="top"-->
    <el-link :underline="false" style="font-size:14px !important;">
      {{ row.fileName ? row.fileName : row.name }}
    </el-link>
    <!--/el-tooltip-->
  </div>
  <div v-else-if="row" class="fileTypeIcon flex ai-center" @click="showPreView" :style="{ cursor: visible ? 'pointer' : 'normal' }">
    <svg v-if="$ibimFileSuffix.indexOf(row.fileSuffix.toLowerCase()) > -1" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-BIMwenjian"></use>
    </svg>
    <svg v-if="$imageFileSuffix.indexOf(row.fileSuffix.toLowerCase()) > -1" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-tupian"></use>
    </svg>
    <svg v-if="row.fileSuffix.toLowerCase() == '.txt'" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-text"></use>
    </svg>
    <svg v-if="$videoFileSuffix.indexOf(row.fileSuffix.toLowerCase()) > -1 || $otherVideoFileSuffix.indexOf(row.fileSuffix.toLowerCase()) > -1" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-shipin"></use>
    </svg>
    <svg v-if="row.fileSuffix.toLowerCase() == '.doc' || row.fileSuffix.toLowerCase() == '.docx'" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-word"></use>
    </svg>
    <svg v-if="row.fileSuffix.toLowerCase() == '.xls' || row.fileSuffix.toLowerCase() == '.xlsx'" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-excel"></use>
    </svg>
    <svg v-if="row.fileSuffix.toLowerCase() == '.dgn'" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-DGN"></use>
    </svg>
    <svg v-if="row.fileSuffix.toLowerCase() == '.skp'" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-skpwenjian"></use>
    </svg>
    <svg v-if="row.fileSuffix.toLowerCase() == '.dxf'" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-a-DXFwenjian_huaban1"></use>
    </svg>
    <svg v-if="row.fileSuffix.toLowerCase() == '.nwd'" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-a-NWDwenjian_huaban1"></use>
    </svg>
    <svg v-if="row.fileSuffix.toLowerCase() == '.obj'" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-objwenjian"></use>
    </svg>
    <svg v-if="row.fileSuffix.toLowerCase() == '.fbx'" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-fbxwenjian"></use>
    </svg>
    <svg v-if="row.fileSuffix.toLowerCase() == '.dwg'" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-DWG"></use>
    </svg>
    <svg v-if="row.fileSuffix.toLowerCase() == '.ifc'" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-IFC"></use>
    </svg>
    <svg v-if="row.fileSuffix.toLowerCase() == '.rvt'" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-RVT"></use>
    </svg>
    <svg v-if="row.fileSuffix.toLowerCase() == '.cel'" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-Celwenjian"></use>
    </svg>
    <img src="../assets/iconworld/3dxml.svg" style="margin-right: 8px;" v-if="row.fileSuffix.toLowerCase() == '.3dxml'" class="tableLinkIcon">
    <img src="../assets/iconworld/3ds.svg" style="margin-right: 8px;" v-if="row.fileSuffix.toLowerCase() == '.3ds'" class="tableLinkIcon">
    <img src="../assets/iconworld/3dm.svg" style="margin-right: 8px;" v-if="row.fileSuffix.toLowerCase() == '.3dm'" class="tableLinkIcon">
    <img src="../assets/iconworld/shp.svg" style="margin-right: 8px;" v-if="row.fileSuffix.toLowerCase() == '.shp'" class="tableLinkIcon">
    <img src="../assets/iconworld/pid.svg" style="margin-right: 8px;" v-if="row.fileSuffix.toLowerCase() == '.pid'" class="tableLinkIcon">
    <img src="../assets/iconworld/nwc.svg" style="margin-right: 8px;" v-if="row.fileSuffix.toLowerCase() == '.nwc'" class="tableLinkIcon">
    <img src="../assets/iconworld/rfa.png" style="margin-right: 8px;" v-if="row.fileSuffix.toLowerCase() == '.rfa'" class="tableLinkIcon">
    <svg v-if="row.fileSuffix.toLowerCase() == '.dgnlib'" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-DGNLIBwenjian"></use>
    </svg>
    <svg v-if="row.fileSuffix.toLowerCase() == '.ppt' || row.fileSuffix.toLowerCase() == '.pptx'" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-ppt"></use>
    </svg>
    <svg v-if="row.fileSuffix.toLowerCase() == '.pdf'" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-pdf"></use>
    </svg>
    <svg v-if="$zipFileSuffix.indexOf(row.fileSuffix.toLowerCase()) > -1" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-yasuo"></use>
    </svg>
    <svg v-if="$allfileType.indexOf(row.fileSuffix.toLowerCase()) === -1" class="tableLinkIcon" aria-hidden="true">
      <use xlink:href="#icon-weizhiwenjian"></use>
    </svg>
    <!--el-tooltip effect="light" content="单击浏览文件" placement="top"-->
    <div class="fileIconName hover" v-if="$preViewLinkCheck(row)">
      {{ row.fileName }}
    </div>
    <div v-else class="fileIconName" :style="{ color: visible ? '#aaa' : '#333' }">{{ row.fileName }}</div>
    <!--/el-tooltip-->
  </div>
</template>
<script>
import request from '@/utils/request'
import postApi from "@/api/document/indexApi.js";
import store from '@/store'

export default {
  props: {
    row: {
      type: Object,
      default: null,
    },
    fullPath: {
      type: Function | Object,
      default: null
    },
    isBimWorks: {
      type: Function | Object,
      default: null
    },
    isInTable: {
      type: Boolean,
      default: null
    },
    visible: {
      type: Boolean,
      default: true
    },
    linkToFilePage: {
      type: Function,
      default: null
    },
    linkModelDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async linkToPage(row) {
      this.$emit("linkToFilePage", row);

      if (this.$route.path === '/projectFile') {
        let projectInfo = await store.dispatch('queryRecentlyProject');

        // 文件夹查看日志
        let formData = new FormData();
        formData.append('Filename', row.fileName)
        formData.append('logtype', 'folderviewing')
        formData.append('projectname', projectInfo.projectName)
        request.post('api/Log/AddFileviewing', formData)
      }
    },
    async recordRecentlyFile(type) {
      let form = new FormData()
      form.append('IUID', this.row.iuid);
      form.append('application', type);
      await postApi.post('/api/ProjectFile/AddFileBrowseData', form)
    },
    showPreView() {
      if (this.linkModelDialog) return
      if (this.isBimWorks) {
        this.recordRecentlyFile('bimWorks')
        this.$openItwinApp({
          appName: 'Bim Works',
          appType: 'bimWorks',
          appImage: require(`../../public/desktop-2023/${this.$appImgFolder}/总模王.png`)
        }, this.row.iuid, true, this.row)
      } else {
        if (this.visible == false) {
          return
        } else if (this.row.lookbit == true) {
          if (this.$route.path === '/blueprintData' ||
              this.$route.path === '/standardData' ||
              this.$route.path === '/companyKnowledgeBase' ||
              this.$route.path === '/myKnowledgeBase'
          ) {
            if (this.$modelFileSuffix.concat(this.$ibimFileSuffix).indexOf(this.row.fileSuffix.toLowerCase()) !== -1) {
              this.$viewMode(this.row)
            }

            let logtype = ''

            if (this.$route.path === '/blueprintData') {
              logtype = 'Gg_blueprint_data'
            } else if (this.$route.path === '/standardData') {
              logtype = 'Gg_StandardInfo_data'
            } else if (this.$route.path === '/companyKnowledgeBase') {
              logtype = 'Gg_Company_data'
            } else if (this.$route.path === '/myKnowledgeBase') {
              logtype = 'Gg_Mine_data'
            }

            // 日志
            let formData = new FormData();
            formData.append('Filename', this.row.fileName)
            formData.append('logtype', logtype)
            request.post('api/Log/AddFileviewing', formData)
          }

          if (this.fullPath) {
            this.row.fullPath = this.fullPath()
          }
          if (this.$route.path != '/s' && this.$modelFileSuffix.concat(this.$ibimFileSuffix).indexOf(this.row.fileSuffix.toLowerCase()) !== -1) {
            this.recordRecentlyFile('bimwindows')
            // let formData = new FormData()
            // formData.append('FileIUID', this.row.iuid)
            // formData.append('MainIUID', this.row.mainIUID)
            // request.post('/api/ProjectFile/UserProjectFileInforAdd', {}, formData)
          }

          if (this.$modelFileSuffix.concat(this.$ibimFileSuffix).indexOf(this.row.fileSuffix.toLowerCase()) !== -1) {
            if (this.$route.path != '/s') {
              this.recordRecentlyFile('bimwindows')
            } else {
              this.showTransferView(this.$appList.find((item) => item.type == 'bimwindows'), this.row)
            }

            // added by YGP， 如果上次打开了浏览窗口，则不重新启动imodel, 直接打开文件即可
            // if (this.row.turnPath == "") this.row.turnPath = 'http://bw3.ksj.com.cn/?E%3A%2F360Api%2FFiles%2Fa7d2286b_ee88_489e_a1b6_2303f441d045%2F%E6%A8%A1%E5%9E%8B%2F%E5%9C%BA%E5%B8%83.bim'; // by YGP, 不知道为什么有时turnPath为空？
            // if (this.row.turnPath == "") this.row.turnPath = this.row.filePath; // by YGP, 不知道为什么有时turnPath为空？
            // this.$iframePostMes(document.getElementById("bim-iframe").contentWindow, 'OpenCurrentFile', this.row)
          } else {
            this.$viewMode(this.row)
          }
        } else {
          this.$message({
            message: "您没有查看权限，请联系管理员开通此权限",
          });
        }
      }
    },

    async showTransferView(item, row, mainfile) {
      let _this = this;
      const openApp = () => {
        _this.$openItwinApp(
            {
              appName: item.title,
              appType: item.type,
              appOrigin: item.origin,
              appImage: item.start,
              mainfile: mainfile,
            },
            row.iuid,
            true,
            row
        );
      };
      openApp();

      let projectInfo = await store.dispatch('queryRecentlyProject');

      // 模型文件查看日志
      let formData = new FormData();
      formData.append('Filename', row.fileName)
      formData.append('projectname', projectInfo.projectName)
      formData.append('logtype', 'ProjectFileviewing')

      request.post('api/Log/AddFileviewing', formData)
    },
  },
};
</script>

<style scoped>
.fileIconName {
  width: 100%;
  color: #606266;
  overflow: hidden;
  word-break: keep-all;
  display: inline-block;
  text-overflow: ellipsis;
  font-size: 14px !important;
  font-weight: 500;
}

.task-file .fileIconName {
  max-width: 260px;
  display: block;
}

.hover:hover {
  color: #409eff;
}

.tableLinkIcon {
  width: 16px;
  flex-shrink: 0;
  height: 16px;
  font-size: 16px;
  display: flex;
  align-items: center;
  /* vertical-align: -5px; */
  /* margin-right: 4px; */
}
</style>
