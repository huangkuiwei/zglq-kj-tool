<template>
  <div style="padding-top: 15px;">
    <!-- 提取码 -->
    <div class="passwordBox" v-if="verifyContainerVisible && !shareDataContainerVisible && !errorContainerVisible">
      <div class="flex">
        <div v-if="shareUserAvatarDivVisible" class="headNameImg">{{ splitPersonName }}</div>
        <img v-if="shareUserAvatarImgVisible" :src="shareUserAvatarImg" style="border-radius: 50%; width: 60px; height: 60px" />
        <div class="userInfo">
          <div class="headName">{{ shareUserName }}</div>
          <div class="headName">{{ corpName }}</div>
        </div>
      </div>
      <div style="margin-top:30px">
        <input class='passValue' type="text" placeholder="请输入提取码" v-model="sharePassword" />
        <button class="passValue" style="font-size:16px;background:rgba(9,170,255,1);color:#fff" @click="enterShareIndexPage">提取文件</button>
        <!-- <div class="effectiveDate">永久有效</div> -->
      </div>
    </div>
    <!-- 错误 -->
    <div v-if="errorContainerVisible" style="width: 100%;height: 20%;position:absolute;left:0;right:0;bottom:0;top:0;margin:auto;">
      <div style="text-align:center">
        <img :src="shareErrorImg" style="width: 50%;" />
        <div style="color: #909399; font-size: 15px">Sorry {{ errorText ? ',' + errorText : '' }}</div>
      </div>
    </div>

    <div class="fileBox" v-if="shareDataContainerVisible && !errorContainerVisible">
      <div class="flex" style="padding:0 20px">
        <div class="headNameImg" style="margin:0" v-if="shareUserAvatarDivVisible">{{ splitPersonName }}</div>
        <img v-if="shareUserAvatarImgVisible" :src="shareUserAvatarImg" style="border-radius: 50%; width: 60px; height: 60px" />
        <div class="userInfo" style="margin:auto 10px;height:40px;">
          <div class="headName">{{ shareUserName }}</div>
          <div class="headName" style="font-size: 14px;">{{ corpName }}</div>
        </div>
      </div>
      <div class="tabsContent" style="height:calc(100% - 89px)">
        <div style="font-size:16px;padding:15px 16px">
          <span style="color:#606266;font-weight:700" @click="folderMenuClick(true)"> 全部文件 /</span>
          <span style="color:#606266;" v-for="(item, index) in folderLists" :key="index"><a @click="folderMenuClick(false, item)">{{ item.name }}</a> <i style="color:#C0C4CC">/</i></span>
        </div>
        <div id="box">
          <div v-for="(item, index) in DataList" :key="index" :class="{ bagActive: item.isClick == true }">
            <div class="tabsCon flex" style="width:100%">
              <div class="flex width100" @click="$viewMode(item)" v-if="$preViewLinkCheck(item)">
                <fileIconComponends :scope="item" />
                <fileStatusComponends :scope="item" />
              </div>
              <div class="flex width100" @click="linkToFilePage(item)" v-else-if="item.fileSuffix.toLowerCase() == ''">
                <fileIconComponends :scope="item" />
                <fileStatusComponends :scope="item" />
              </div>
              <div class="flex width100" v-else @click="noView()">
                <fileIconComponends :scope="item" />
                <fileStatusComponends :scope="item" />
              </div>
            </div>
          </div>
          <div class="noData" v-if='DataList.length == 0'>
            <img style="" :src="require('@/assets/errorImg/nodata.png')" />
            <div class="noDataTit">{{ $t('base.button.noData') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import shareApi from "@/api/share";
import fileIconComponends from './fileIcon';
import fileStatusComponends from './fileStatus';
import shareErrorImg from "@/assets/errorImg/shareError.png";
import { decrypt, encrypt } from '@/utils'
import postApi from '@/api/document/indexApi'
export default ({
  name:'shareH5',
  components: {
    fileIconComponends,
    fileStatusComponends,
  },
  data() {
    return {
      shareErrorImg: shareErrorImg,
      shareUserName: null,
      splitPersonName: null,
      sharePassword: null,
      dowlondVisible: false,
      active: 'tab_container1',
      DataList: [],
      folderIuid: null,
      folderLists: [],
      show: true,
      arr: [],
      canDownload: false,
      shareIuid: null,
      fileOrFileFolderId: null,
      shareDataContainerVisible: false,
      verifyContainerVisible: false,
      shareUserAvatarDivVisible: false,
      shareUserAvatarImgVisible: false,
      shareUserAvatarImg: null,
      errorText: null,
      errorContainerVisible: false,
      corpName: null
    }

  },
  methods: {
    folderMenuClick(initMode, data) {
      if (initMode) {
        this.folderIuid = null
        this.folderLists = []
        this.loadData()
        return
      }
      this.folderIuid = data.value;
      this.loadFileFolderDetails()

      let index;
      for (var i = 0; i < this.folderLists.length; i++) {
        if (this.folderLists[i].value == this.folderIuid) {
          index = i;
        }
      }
      this.folderLists = this.folderLists.slice(0, index + 1);
    },
    selected(index, val, id) {
      //判断选中切换图片
      if (this.arr.includes(index)) {
        this.arr = this.arr.filter(function (ele) { return ele != index });
      } else {
        this.arr.push(index)
      }
      if (this.DataList[index].isClick == true) {
        this.DataList[index].isClick = false
        this.dowlondVisible = false
      } else if (this.DataList[index].isClick == false) {
        this.DataList[index].isClick = true;
        this.dowlondVisible = true
      }
    },
    async loadData() {
      var shareListRes = await shareApi.getShareList(this.shareIuid);
      if (shareListRes.code == 1) {
        shareListRes.data && shareListRes.data.forEach(item => {
          item.filePath = decrypt(item.filePath || '')
          item.turnPath = decrypt(item.turnPath || '')
        })

        this.DataList = shareListRes.data;
        this.DataList.map(i => {
          i.isClick = false
        })
      }
    },
    async enterShareIndexPage() {
      var res = await shareApi.verifySharePassword(
        this.shareIuid,
        this.sharePassword
      );
      if (res.code == 1) {
        this.$store.state.app.preViewDownloadBtnVisible = this.canDownload;
        this.shareDataContainerVisible = true; //显示分享数据容器
        this.loadData()
      }
    },
    linkToFilePage(data) {
      this.folderIuid = data.iuid;
      this.loadFileFolderDetails()
      this.folderLists.push({ name: data.fileName, value: data.iuid });
    },
    async loadFileFolderDetails() {
      var res = await shareApi.getShareListByFolderId(this.folderIuid);
      if (res.code == 1) {
        res.data && res.data.forEach(item => {
          item.filePath = decrypt(item.filePath || '')
          item.turnPath = decrypt(item.turnPath || '')
        })

        this.DataList = res.data;
        this.DataList.map(i => {
          i.isClick = false
        })
      }
    },
    loadMore() {
    },
    downlond() {
      this.$customToast('功能暂停，服务端未支持', 'error')
    }

  },
  async created() {
    document.title = this.$webTitle
    this.$store.state.app.shareMode = true
    this.shareIuid = Object.keys(this.$route.query)[0];

    postApi.get("/api/WebOrder/ServiceTimeVerify").then(async () => {
      var res = await shareApi.getShareInfo(this.shareIuid);
      if (res.code == 1) {
        this.canDownload = res.data.isallow == "1" ? true : false;
        this.shareUserName = res.data.userName;
        this.splitPersonName = (this.shareUserName.split("").reverse().join("").substring(0, 2)).split("").reverse().join("")
        // this.fileOrFileFolderId = res.data.mainIUID;
        this.shareUserAvatarImg = process.env.BASE_API +
            "/api/home/GetimgFile?fileUrl=" +
            encodeURIComponent(encrypt(res.data.ddUserAvatar));
        this.corpName = res.data.corpName;
        if (!res.data.sharebit) {
          this.errorText = "分享内容已过期"
          this.errorContainerVisible = true
        } else if (!res.data.isvisible) {
          this.verifyContainerVisible = true;
        } else {
          //直接通过、无需提取码
          this.$store.state.app.preViewDownloadBtnVisible = this.canDownload;
          this.shareDataContainerVisible = true; //显示分享数据容器
          this.loadData()
        }
        if (res.data.ddUserAvatar) {
          this.shareUserAvatarImgVisible = true;
        } else {
          this.shareUserAvatarDivVisible = true;
        }
      } else {
        this.errorText = "服务器繁忙"
        this.errorContainerVisible = true
      }
    }).catch(() => {
      localStorage.setItem('shareUrl', this.$route.fullPath)
    })
  },
})
</script>
<style>
.mint-cell-value {
  width: 100% !important;
}
</style>
<style scoped>
.passwordBox {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 80%;
  height: 80% !important;
  margin: auto;
  font-size: 14px;
}

.headNameImg {
  width: 60px;
  height: 60px;
  line-height: 60px;
  border-radius: 50%;
  text-align: center;
  color: #fff;
  margin: 0 auto 10px auto;
  font-size: 20px;
  background: rgba(0, 137, 255, 1);
}

.userInfo {
  width: 60%;
  margin: auto;
  text-align: left;
  line-height: 20px;
  font-size: 14px;
}

.headName {
  overflow: hidden;
  white-space: nowrap;
  font-size: 16px;
  margin-bottom: 5px;
  text-overflow: ellipsis;
}

.passValue {
  width: 100%;
  height: 40px;
  text-align: center;
  background: rgba(250, 250, 251, 1);
  border-radius: 30px;
  margin-right: 0;
  border: none;
  outline: none;
  margin: 20px 0;
}

.noData {
  width: 100%;
  text-align: center;
  /* display: flex;
	flex-direction: column; */
}

.noData img {
  width: 320px;
  height: 320px;
  margin: auto;
}

.noDataTit {
  text-align: center;
  font-size: 24px;
  font-weight: 400;
  color: #C0C4CC;
  margin-top: 10px;
}

.tabsCon {
  padding: 12px 16px;
  justify-content: space-between;
}
</style>
