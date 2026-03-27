<template>
  <el-container>
    <el-container
      v-if="shareDataContainerVisible && !errorContainerVisible"
      style="position: static"
    >
      <el-header
        id="headerPage"
        style="height: 50px;z-index: 2000;line-height: 50px;background-color: white;"
      >
        <div
          v-if="$headerLogo"
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
      <el-container style="background-color: #f2f5fa; position: relative">
        <el-main style="margin: 20px;border-radius: 8px; overflow-y: unset">
          <div
            class="app-container background"
            style="height: calc(100vh - 90px)"
          >
            <div class="table-box">
              <div
                v-if="loaded"
                class="flex jc-between ai-center"
                style="margin-bottom: 15px;"
              >
                <div>
                  <div class="flex">
                    <img
                      src="@/assets/corpDetailImg/文件夹.png"
                      style="width: 20ox;height: 20px;margin-right: 5px;"
                      alt=""
                    >
                    <span>
                      {{ shareInfo.projectName }}
                    </span>
                  </div>
                  <div
                    class="flex"
                    style="margin-top: 20px;"
                  >
                    <div> <i class="el-icon-time" /> {{ shareInfo.shareTime }}</div>
                    <div style="margin-left: 40px;">
                      {{ shareType }}
                    </div>
                  </div>
                </div>
                <downloadBtn
                  v-if="canDownload"
                  :rows="tableSelection"
                  :full-path="getFolderFullPath"
                />
              </div>
              <el-row v-if="folderLists.length > 0">
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item v-if="folderLists.length > 0">
                    <a @click="folderMenuClick(true)">全部文件</a>
                  </el-breadcrumb-item>
                  <el-breadcrumb-item v-else>
                    <span>全部文件</span>
                  </el-breadcrumb-item>
                  <el-breadcrumb-item
                    v-for="(item, index) in folderLists"
                    :key="index"
                  >
                    <span v-if="index == folderLists.length - 1">{{ item.name }}</span>
                    <a
                      v-else
                      @click="folderMenuClick(false, item)"
                    >{{ item.name }}</a>
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </el-row>
              <el-row class="table">
                <el-table
                  v-show="tableVisible"
                  ref="multipleTable"
                  class="t-table"
                  :data="tableData"
                  stripe
                  :header-cell-style="$thStyle"
                  :style="{ 'margin-top': canDownload ? '15px' : '0' }"
                  style="width: 100%; font-size: 13px"
                  height="100%"
@selection-change="handleSelectionChange"
                >
                  <!-- @sort-change="sortChange"
                  :default-sort="{ prop: 'createTime', order: 'descending' }" -->
                  <el-table-column
                    type="selection"
                    width="55"
                  />
                  <el-table-column
                    prop="fileName"
                    :label="$t('base.button.fileName')"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <fileIconComponends
                        :full-path="getFolderFullPath"
                        :row="scope.row"
                        @linkToFilePage="linkToFilePage"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="fileSize"
                    :label="$t('base.button.fileSize')"
                    width="200"
                  />
                  <el-table-column
                    prop="createTime"
                    :label="$t('base.button.createTime')"
                    width="200"
                  />
                </el-table>
              </el-row>
              <pagination
                :page-total="total"
                @handleCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"
              />
            </div>
          </div>
        </el-main>
        <el-aside class="userAside">
          <div class="userBg">
            <div style="text-align: center">
              <div
                v-if="shareUserAvatarDivVisible"
                class="shareHeadLeft"
              >
                {{ shareUserName }}
              </div>
              <img
                v-if="shareUserAvatarImgVisible"
                :src="shareUserAvatarImg"
                class="shareManAvator"
              >
              <div class="shareManDescription">
                {{ shareUserName }}
              </div>
              <div class="shareManDescription com">
                {{ corpName }}
              </div>
            </div>
          </div>
        </el-aside>
      </el-container>
    </el-container>
    <div
      v-if="errorContainerVisible"
      style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;padding-top: 140px;"
    >
      <div style="text-align: center">
        <img
          :src="shareErrorImg"
          style="width: 50%"
        >
        <div style="color: #909399; font-size: 15px">
          Sorry {{ errorText ? "," + errorText : "" }}
        </div>
      </div>
    </div>
    <div
      v-if="verifyContainerVisible && !shareDataContainerVisible && !errorContainerVisible"
      class="passDailog"
    >
      <div
        style="width: 38%; margin: 0 auto 50px auto;"
        class="flex ai-center jc-between"
      >
        <!--<img :src="defaultLogo" style="height: 46px" />-->
        <!--<span style="font-size: 28px;font-weight: bold;color: #555;">跨~界云空间</span>-->
      </div>
      <div style="border: 1px solid #ddd; border-radius: 15px;box-shadow: 1px 1px 5px #ccc;">
        <div class="shareHeader">
          <div class="shareHeadCon">
            <div
              v-if="shareUserAvatarDivVisible"
              class="shareHeadLeft1"
            >
              {{ shareUserName }}
            </div>
            <img
              v-if="shareUserAvatarImgVisible"
              :src="shareUserAvatarImg"
              style="border-radius: 8px; width: 60px; height: 60px"
            >
            <div class="shareHeadRight">
              <div>{{ shareUserName }}</div>
              <div>{{ corpName }}</div>
            </div>
          </div>
        </div>
        <div class="shareBottom">
          <div class="shareBottomTit">
            请输入分享密码：
          </div>
          <div class="flex jc-between ai-center">
            <el-input
              v-model="sharePassword"
              class="passValue"
              size="default"
            />
            <el-button
              type="primary"
              style="width:20%"
              size="default"
              @click="enterShareIndexPage"
            >
              {{ $t('base.button.confirm') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="unauthorized === 1 || unauthorized === 2 || unauthorized === 3 || unauthorized === 4"
      class="share-unauthorized"
    >
      <div class="share-unauthorized-contain">
        <template v-if="unauthorized === 1">
          <el-form label-width="100px">
            <el-form-item label="申请人：">
              <el-input
                v-model="corpSpaceModel.usertext"
                placeholder="请输入申请人"
              />
            </el-form-item>

            <el-form-item label="使用场景：">
              <el-input
                v-model="scene"
                rows="6"
                type="textarea"
                placeholder="请输入使用场景"
              />
            </el-form-item>
          </el-form>

          <div style="text-align: right">
            <el-button
              type="primary"
              :loading="loading"
              @click="submit"
            >
              提交
            </el-button>
          </div>
        </template>

        <template v-if="unauthorized === 2">
          <el-form label-width="100px">
            <el-form-item label="申请人：">
              <el-input
                v-model="corpSpaceModel.usertext"
                placeholder="请输入申请人"
                disabled
              />
            </el-form-item>

            <el-form-item label="申请状态：">
              <span>申请中</span>
            </el-form-item>
          </el-form>
        </template>

        <template v-if="unauthorized === 3">
          <el-form label-width="100px">
            <el-form-item label="申请人：">
              <el-input
                v-model="corpSpaceModel.usertext"
                placeholder="请输入申请人"
                disabled
              />
            </el-form-item>

            <el-form-item label="申请状态：">
              <span>已拒绝</span>
            </el-form-item>
          </el-form>

          <div style="text-align: right">
            <el-button
              type="primary"
              @click="reset"
            >
              重新申请
            </el-button>
          </div>
        </template>

        <template v-if="unauthorized === 4">
          <el-form label-width="100px">
            <el-form-item label="申请人：">
              <el-input
                v-model="corpSpaceModel.usertext"
                placeholder="请输入申请人"
                disabled
              />
            </el-form-item>

            <el-form-item label="申请状态：">
              <span>已同意</span>
            </el-form-item>
          </el-form>

          <div style="text-align: right">
            <el-button
              type="primary"
              @click="reviewData"
            >
              查看
            </el-button>
          </div>
        </template>
      </div>
    </div>
  </el-container>
</template>
<script>
import shareApi from "@/api/share";
import defaultLogo from "@/assets/K-J.png";
import QRLogo from "@/assets/robot.svg";
import shareErrorImg from "@/assets/errorImg/shareError.png";
import { mapGetters } from "vuex";
import pagination from "@/components/pagination/index";
import fileIconComponends from "@/components/fileIcon";
import downloadBtn from "@/components/PreViewAndlistComBtn/downloadButton";
import { decrypt, encrypt } from "@/utils";
import postApi from '@/api/document/indexApi'
import commonApi from '@/api/common'
import request from '@/utils/request'
import local from '@/utils/auth'
export default {
  components: {
    pagination,
    fileIconComponends,
    downloadBtn,
  },
  data() {
    return {
      // isMobile
      loaded: false,
      QRLogo: QRLogo,
      defaultLogo: defaultLogo,
      shareErrorImg: shareErrorImg,
      folderIuid: null,
      folderLists: [],
      tableData: null,
      tableSelection: [],
      tableVisible:false,
      total: 0,
      shareInfo: '',
      pageIndex: 1,
      pageSize: 20,
      shareIuid: null,
      shareUserAvatarDivVisible: false,
      shareUserName: null,
      shareUserAvatarImgVisible: false,
      shareUserAvatarImg: null,
      corpName: null,
      sharePassword: null,
      canDownload: false,
      verifyContainerVisible: false,
      shareDataContainerVisible: false,
      errorContainerVisible: false,
      errorText: null,
      avatorUrl: process.env.VUE_APP_BASE_API + "/api/home/GetimgFile?fileUrl=",
      showModelTree: undefined,
      unauthorized: 0,
      corpSpaceModel: {
        usertext: null
      },
      loading: false,
      scene: null
    };
  },
  computed: {
    ...mapGetters(["clientHeight"]),
    shareType() {
      let q = this.shareInfo != '' ? this.shareInfo.shareType : ''
      if (q == 'true') {
        return '有效期至' + this.shareInfo.effectiveDate
      } else if (q == 0) {
        return '永久有效'
      } else if (q == -1) {
        return '分享已失效'
      } else {
        return `有效期${q}天`
      }
    }
  },
  watch: {
    "$route"(e) {
      this.shareIuid = Object.keys(this.$route.query)[0];
      this.initShareInfo()
    }
  },
  async created() {
    this.$store.state.app.shareMode = true;
    this.shareIuid = Object.keys(this.$route.query)[0];
    this.showModelTree = this.$route.query.showModelTree;

    this.signalr.on("shareDay", async (res) => {
      const userId = res.applyiuid
      const localUserId = localStorage.getItem("applyiuid");

      this.initShareInfo(userId === localUserId, true)
    });

    var ua = navigator.userAgent;
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      isAndroid = ua.match(/(Android)\s+([\d.]+)/),
      isMobile = isIphone || isAndroid;
    if (isMobile) {
      location.href = this.$shareUrlH5 + "?" + this.shareIuid;
      return;
    } else {
      this.initShareInfo()
    }
  },

  destroyed() {
    this.signalr.off("shareDay");
  },

  methods: {
    reset() {
      localStorage.removeItem('applyiuid')
      this.unauthorized = 1
    },

    submit() {
      if (!this.corpSpaceModel.usertext) {
        this.$message.warning('请先输入申请人')
        return
      }

      this.loading = true;
      let formData = new FormData();
      formData.append('shareTaskId', this.shareIuid)
      formData.append('scene', this.scene || '')
      formData.append('usertext', this.corpSpaceModel.usertext)

      request.post('api/Home/Addshareapply', formData).then((res) => {
        this.$message('申请成功')
        localStorage.setItem('applyiuid', res.twodata)
        this.unauthorized = 2
      }).finally(() => {
        this.loading = false;
      })
    },

    reviewData() {
      this.unauthorized = 0
      this.initShareInfo()
    },

    async initShareInfo(share = false, signalr = false){
      // postApi.get("/api/WebOrder/ServiceTimeVerify").then(async () => {
      //
      // }).catch(() => {
      //   localStorage.setItem('shareUrl', this.$route.fullPath)
      // });

      var res = await shareApi.getShareInfo(this.shareIuid, localStorage.getItem("applyiuid"));
      if (res.code == 1) {
        if (share) {
          this.unauthorized = 4
          return
        }

        if (signalr) {
          return
        }

        this.canDownload = res.data.isallow == "1" ? true : false;
        this.shareUserName = res.data.userName;
        this.shareUserAvatarImg = res.data.ddUserAvatar
            ? this.avatorUrl + encodeURIComponent(encrypt(res.data.ddUserAvatar))
            : undefined;
        this.corpName = res.data.corpName;
        if (!res.data.sharebit) {
          this.errorText = "分享内容已过期";
          this.errorContainerVisible = true;
        } else if (!res.data.isvisible) {
          this.verifyContainerVisible = true;
        } else {
          //直接通过、无需提取码
          this.shareDataContainerVisible = true; //显示分享数据容器
          this.$store.state.app.preViewDownloadBtnVisible = this.canDownload;
          this.loadShareData();
        }
        if (res.data.ddUserAvatar) {
          this.shareUserAvatarImgVisible = true;
        } else {
          this.shareUserAvatarDivVisible = true;
        }
      } else {
        if (res.code == -2) {
          this.unauthorized = 1
          return
        } else if (res.code == -3) {
          // 申请中
          this.unauthorized = 2
          return
        } else  if (res.code == -4) {
          // 已拒绝
          this.unauthorized = 3
          localStorage.removeItem('applyiuid');
          return
        }

        this.errorText = res.msg;
        this.errorContainerVisible = true;
      }
    },
    async enterShareIndexPage() {
      var res = await shareApi.verifySharePassword(
        this.shareIuid,
        this.sharePassword
      );
      if (res.code == 1) {
        this.shareDataContainerVisible = true; //显示分享数据容器
        this.$store.state.app.preViewDownloadBtnVisible = this.canDownload;
        this.loadShareData();
      } else if (res.code == -1) {
        this.$error(res.msg)
      }
    },
    async loadShareData() {
      var shareListRes = await shareApi.getShareList(this.shareIuid, localStorage.getItem("applyiuid"));
      if (shareListRes.code == 1) {
        let formData = new FormData();
        formData.append('applyiuid', localStorage.getItem("applyiuid"));
        request.post('/api/Home/Editshareapply', formData).finally(() => {
          localStorage.removeItem('applyiuid');
        })

        shareListRes.data &&
          shareListRes.data.forEach((item) => {
            item.filePath = decrypt(item.filePath || "");
            item.turnPath = decrypt(item.turnPath || "");
          });
        this.tableData = shareListRes.data;
        this.shareInfo = shareListRes.data[0];
        this.total = shareListRes.count;

        // if (shareListRes.data && shareListRes.data.length === 1) {
        //   let item = shareListRes.data[0]
        //
        //   if (this.$modelFileSuffix.concat(this.$ibimFileSuffix).indexOf(item.fileSuffix) > -1) {
        //     this.$viewMode(item, undefined, this.showModelTree)
        //     setTimeout(() => {
        //       this.tableVisible = true
        //     })
        //   }else{
        //     this.tableVisible = true
        //   }
        // } else {
        //   this.tableVisible = true
        // }
        //

        this.tableVisible = true
        this.loaded = true
      } else if (shareListRes.code == -2) {
        this.shareDataContainerVisible = false
        this.unauthorized = 1
      }
    },
    getFolderFullPath() {
      let folderFullPath = "";
      this.folderLists.forEach((element) => {
        folderFullPath = folderFullPath + "/" + element.name;
      });
      return folderFullPath;
    },
    folderMenuClick(initMode, data) {
      if (initMode) {
        this.folderIuid = null;
        this.folderLists = [];
        this.loadShareData();
        return;
      }
      this.pageIndex = 1;
      this.folderIuid = data.value;
      this.loadFileFolderDetails();
      let index;
      for (var i = 0; i < this.folderLists.length; i++) {
        if (this.folderLists[i].value == this.folderIuid) {
          index = i;
        }
      }
      this.folderLists = this.folderLists.slice(0, index + 1);
    },
    linkToFilePage(row) {
      this.pageIndex = 1;
      this.folderIuid = row.iuid;
      this.loadFileFolderDetails();
      this.folderLists.push({
        name: row.fileName,
        value: row.iuid,
      });
    },
    async loadFileFolderDetails() {
      var res = await shareApi.getShareListByFolderId(this.folderIuid);
      if (res.code == 1) {
        // filePath 和 turnPath 解码
        res.data &&
          res.data.forEach((item) => {
            item.filePath = decrypt(item.filePath || "");
            item.turnPath = decrypt(item.turnPath || "");
          });
        this.tableData = res.data;
      }
    },
    handleSelectionChange(val) {
      this.tableSelection = val;
    },
    paginationCurrentChange(val) {
      this.pageIndex = val;
      this.loadShareData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadShareData();
    },
    sortChange(column) {
      if (column.order === null) {
        this.orderBy === "DESC"
          ? (column.order = "ascending")
          : (column.order = "descending");
        column.column.order = column.order;
      }
      this.orderBy = column.order == "ascending" ? "ASC" : "DESC";
      this.loadShareData();
    },
  },
};
</script>
<style scoped>
.passDailog {
  width: 30%;
  position: absolute;
  top: 20%;
  left: 35%;

}

.shareHeader {
  padding: 20px 50px;
  border-bottom: solid 1px #e6e6e6;
}

.shareHeadCon {
  display: -webkit-box;
  background: #fff;
  padding: 8px 10px;
}

.shareHeadLeft1 {
  width: 60px;
  height: 60px;
  line-height: 60px;
  background: rgba(0, 137, 255, 1);
  text-align: center;
  border-radius: 8px;
  color: #fff;
}

.shareHeadRight {
  color: rgba(135, 135, 135, 1);
  margin-top: 5px;
  line-height: 25px;
  font-size: 16px;
  margin-left: 15px;
}

.shareBottom {
  padding: 70px 50px;
}

.shareBottomTit {
  color: rgba(135, 135, 135, 1);
  margin-bottom: 40px;
}

.passValue {
  width: 75%;
  /* border: 1px solid #ccc; */
  opacity: 1;
  /* height: 46px; */
  margin-right: 15px;
}

.pass {
  background: rgba(9, 170, 255, 1);
  color: #fff;
  padding: 10px 30px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
}

.pass:hover {
  cursor: pointer;
  background: rgba(0, 137, 255, 1);
}

.shareHeadLeft {
  margin: 53px auto 12px;
  width: 60px;
  display: inline-block;
  height: 60px;
  line-height: 60px;
  background: rgba(0, 137, 255, 1);
  text-align: center;
  border-radius: 8px;
  color: #fff;
}

.userAside {
  margin: 20px;
  border-radius: 8px;
  width: 210px;
  margin-left: 0;
  background-color: rgb(245, 247, 250);
}

.userBg {
  height: 100%;
  background-image: url('../../../assets/sharebg.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.shareManAvator {
  width: 61px;
  height: 61px;
  margin: 53px auto 12px;
  border-radius: 80px;
  box-shadow: 0px 4px 4px rgba(95, 0, 0, 0.12);
}

.shareManDescription {
  color: #000;
  font-size: 14px;
  margin: 10px auto;
}

.shareManDescription.com {
  font-size: 12px;
}

.share-unauthorized {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .share-unauthorized-contain {
    width: 500px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px #ccc;
  }
}
</style>
