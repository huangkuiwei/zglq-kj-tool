<template>
  <div style="padding: 52px 360px">
    <div class="flex ai-center jc-between">
      <div class="flex ai-center">
        <img :src="kjPayCenterLogo" style="width: 272px;margin-top: -12px;" />
        <div class="titleText">支付中心</div>
      </div>
      <div>
        <!-- <img :src="corpSpaceModel.dDUserAvatar && corpSpaceModel.dDUserAvatar.length > 0 ? avatorUrl + encodeURIComponent(encrypt(corpSpaceModel.dDUserAvatar)) : defaultAvator" style=" width: 30px; height: 30px; border-radius: 50%; vertical-align: middle; " /> -->
        <span style="margin-left: 10px">{{ corpSpaceModel.username }} {{ corpSpaceModel.hasCorp ? " | " + corpSpaceModel.corpName : "" }}</span>
      </div>
    </div>
    <div class="corpPayContent" style="height: calc(100vh - 275px);margin-bottom: 63px">
      <div class="corpPayTitleContainer flex jc-center" style="align-items: flex-end;">
        <div class="corpPayTitleBottom">
          <div class="inlineBlock" :class="{ rectangleActived: item.actived, defaultRectangle: !item.actived, }" v-for="(item, index) in payCenterTabs" @click="handlePayCenterTabsChange(index)" :key="index">
            {{ item.title }}
          </div>
        </div>
      </div>
      <div class="corpPayBodyContainer">
        <!--版本升级-->
        <template v-if="payCenterTabsActivedIndex === 0">
          <div v-for="(item, index) in versionUpgradeTabs" :key="index" class="versionUpgradeTab" @click="handleVersionUpgradeTabsChange(index)" :class="{
            versionUpgradeTabActive: item.actived,
            versionUpgradeTabDefault: !item.actived,
          }">
            <template v-if="item.title === '个人版'">
              <i v-if="item.actived" style="font-size: 32px;display: inline-block;margin-top: 24px;margin-left: 70px;vertical-align: bottom;margin-right: 34px;float: left;" class="iconfont icon-gerenban-moren"></i>
              <div v-if="!item.actived" class="personalVersionDefault"></div>
            </template>
            <template v-else>
              <i v-if="item.actived" style="font-size: 32px;display: inline-block;margin-top: 24px;margin-left: 70px;vertical-align: bottom;margin-right: 34px;float: left;color: linear-gradient(180deg, #6be2ff 0%, #048fed 100%);" class="iconfont icon-qiyeban-moren"></i>
              <div class="companyVersionDefault" v-if="!item.actived"></div>
            </template>
            <div style="display: inline-block; float: left; margin-top: 20px">
              <div style="font-size: 20px; font-weight: 400">
                {{ item.title }}
              </div>
              <div style="font-size: 14px; margin-top: 6px">
                {{ item.remarks }}
              </div>
            </div>
          </div>
          <div class="versionUpgradePriceCardContainer">
            <div style="width: 100%; overflow: auto">
              <swiper class="swiper" :options="swiperOption" ref="mySwiper">
                <swiper-slide class="swiper-slide versionUpgradePriceCard" :style="{ background: item.canNotCheck ? 'gray' : '#ffffff', opacity: item.canNotCheck ? '0.4' : '1', }" :class="{ versionUpgradePriceCardBorder: item.actived }" v-for="(item, index) in versionPrices" :key="index">
                  <div style="width: 100%; height: 100%; padding-top: 31px" @click="!item.canNotCheck && handleVersionUpgradePriceCardChange(item, index, $event)">
                    <div style="font-size: 14px">{{ item.goodsText }}</div>
                    <div style="color: #ff6a00;font-size: 32px;font-weight: 600;margin-top: 14px;">
                      ¥{{ item.goodsPrice }}
                    </div>
                  </div>
                </swiper-slide>
                <div class="swiper-button-prev" slot="button-prev"></div>
                <div class="swiper-button-next" slot="button-next"></div>
              </swiper>
            </div>
            <div style="height: 180px;background: white;border-radius: 8px;margin-top: 30px;margin-bottom: 30px;">
              <vueQr style="float: left" ref="qrCode" :logoSrc="QRLogo" v-if="versionPrices[versionPricesActivedIndex].goodsPrice > 0" :text="payUrl" :size="180"></vueQr>
              <div style="float: left; margin-top: 16px" :style="{ 'margin-left': versionPrices[versionPricesActivedIndex].goodsPrice == 0 ? '20px' : '0', }">
                <span style="color: #333333; font-size: 14px">实付:</span>
                <span style="color: #ff6a00; font-size: 25px">{{ versionPrices[versionPricesActivedIndex].goodsPrice }}元
                </span>
                <div v-if="versionPrices[versionPricesActivedIndex].goodsPrice > 0" style="color: #333333; margin-top: 20px">
                  <img class="payImg" src="https://staticsns.cdn.bcebos.com/amis/2021-6/1623142062241/daeb82dda5a4568783ed28eae.png" />
                  <span>支付宝</span>
                  <img style="margin-left: 20px" class="payImg" src="https://staticsns.cdn.bcebos.com/amis/2021-6/1623141005470/%E5%BE%AE%E4%BF%A1.png" />
                  <span>微信</span>
                </div>
              </div>
              <div style="float: right; margin-top: 124px; margin-right: 25px" v-if="versionPrices[versionPricesActivedIndex].goodsPrice == 0">
                <el-button class="changeOrder" size="medium" @click="handleChangeVersionOrder">变更套餐</el-button>
              </div>
            </div>
          </div>
        </template>
        <!--容量套餐-->
        <template v-else>
          <div class="corpPayBodyContainer" style="padding-top: 0">
            <div class="versionUpgradePriceCardContainer" style="margin-top: 12px">
              <div style="width: 100%; overflow: auto">
                <swiper class="swiper" :options="swiperOption2" ref="mySwiper">
                  <swiper-slide class="versionUpgradePriceCard" style="box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.16)" v-for="(item, index) in spacePrices" :key="index" :style="{ background: item.canNotCheck ? 'gray' : '#ffffff', opacity: item.canNotCheck ? '0.4' : '1', }" :class="{ versionUpgradePriceCardBorder: item.actived }">
                    <div @click="!item.canNotCheck && handleSpaceUpgradePriceCardChange(item, index)" style="height: 100%; padding-top: 28px">
                      <div style="font-size: 28px;color: #2a2a2a;font-weight: 500;">
                        {{ item.goodsSpace >= 1024 ? item.goodsSpace / 1024 + "TB" : item.goodsSpace + "GB" }}
                      </div>
                      <div style="font-size: 16px; margin-top: 14px">
                        <span style="color: #3296fa">{{ item.goodsPrice }}元
                        </span>
                        <span style="color: #333333">/月起</span>
                      </div>
                    </div>
                  </swiper-slide>
                  <div class="swiper-button-prev" slot="button-prev"></div>
                  <div class="swiper-button-next" slot="button-next"></div>
                </swiper>
              </div>
              <div style="height: 180px;background: white;border-radius: 8px;margin-top: 30px;">
                <vueQr style="float: left" ref="qrCode" :logoSrc="QRLogo" :text="payUrl" :size="180"></vueQr>
                <div style="float: left; margin-top: 16px">
                  <span style="color: #333333; font-size: 14px">实付:</span>
                  <span style="color: #ff6a00; font-size: 25px">{{ spacePrices[spacePricesActivedIndex].goodsPrice }}元
                  </span>
                  <div style="color: #333333; margin-top: 20px">
                    <img class="payImg" src="https://staticsns.cdn.bcebos.com/amis/2021-6/1623142062241/daeb82dda5a4568783ed28eae.png" />
                    <span>支付宝</span>
                    <img style="margin-left: 20px" class="payImg" src="https://staticsns.cdn.bcebos.com/amis/2021-6/1623141005470/%E5%BE%AE%E4%BF%A1.png" />
                    <span>微信</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <a class="versionDetailHref" @click="bwPriceVisible = !bwPriceVisible">购买说明</a>
      </div>
    </div>
    <div style="text-align: center;width: 100%;color: rgb(153, 153, 153);font-size: 14px;height: 80px;line-height: 80px;">
      Copyright © 1999-2023 | 北京跨世纪软件技术有限公司 | 京ICP备2020036512号-2	
    </div>
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="购买说明" :visible.sync="bwPriceVisible" width="950px">
      <div style="color: #333333">
        <p>
          1.版本升级/降级规则：从一个版本升级或降级到另一个版本时，付款时会扣除已开通版本剩余时间段内的价值，如果剩余价值≥现在要开通版本的价格，系统会提示支付0元，多余的剩余价值将换算成新版的等值时长，付款成功后立即生效。
        </p>
        <p></p>
        <p>2.续费同一版本时将直接增加时长，不会执行扣除剩余价值的规则。</p>
        <p></p>
        <p>3.请注意购买成功后概不退款，购买前请确认好需要开通的版本。</p>
        <p></p>
        <p>4.版本价格表：</p>
      </div>
      <div style="width: 100%; height: 545px; color: #333333">
        <table class="priceTable">
          <tr style="background: rgba(228, 234, 245, 0.3)">
            <td width="155">人数</td>
            <td width="100">周期</td>
            <td>价格（元）</td>
            <td width="100">备注</td>
          </tr>
          <tr v-for="(item, index) in priceData" :key="index" :style="{ background: (index + 1) % 2 == 0 ? 'rgba(228, 234, 245, 0.3)' : 'unset', }">
            <td>{{ item.number }}</td>
            <template v-if="index + 1 == priceData.length">
              <td colspan="3">
                <div class="priceTableBtn" @click="$showPhoneNumber()">联系供应商</div>
              </td>
            </template>
            <template v-else>
              <td>{{ item.date }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.remarks }}</td>
            </template>
          </tr>
        </table>
        <div class="priceRemarks">
          <div class="priceRemarksItem" style="border-bottom: 1px solid #d8d8d8">
            <div style="margin-bottom: 13px">
              <img class="priceRemarksItemImg" src="../../assets/corpDetailImg/payCenterFileSpace.png" />
              <span>存储空间说明</span>
            </div>
            <span class="priceRemarksText">以上各版本的初始容量均为10G，储存容量达到上限后需扩容或者删掉部分文件才能继续上传新文件，扩容套餐价格请咨询服务商。</span>
          </div>
          <div class="priceRemarksItem">
            <div style="margin-bottom: 13px">
              <img class="priceRemarksItemImg" src="../../assets/corpDetailImg/payCenterfileShare.png" />
              <span>文件分享说明</span>
            </div>
            <span class="priceRemarksText">以上各版本的文件分享数量与对应的人数相关，分享文件数量上限=人数*5，如1人版分享上限为5个，5人版为25个，15人版为75个...以此类推，分享数量达到上限后需升级版本或者取消已分享的文件才能继续分享。</span>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- <div class="bwPriceContainer" v-if="bwPriceVisible">
      <div style="position: relative">
        <img :src="bwPrice" style="width: 500px; height: 860px" />
        <el-link icon="el-icon-circle-close" :underline="false" style=" position: absolute; right: -30px; top: 0px; color: white; font-size: 18px; " @click="bwPriceVisible = false"></el-link>
      </div>
    </div> -->
  </div>
</template>

<script>
import kjPayCenterLogo from "@/assets/corpDetailImg/kj-logo.svg";
import defaultAvator from "@/assets/robot.svg";
import bwPrice from "@/assets/corpDetailImg/bwPrice.jpg";
import { mapGetters } from "vuex";
import commonApi from "@/api/common";
import postApi from "@/api/document/indexApi.js";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "vue-awesome-swiper/node_modules/swiper/dist/css/swiper.css";
import vueQr from "vue-qr";
import QRLogo from "@/assets/K-J.png";
import local from "@/utils/auth";
import { encrypt,decrypt } from '@/utils'

export default {
  computed: {
    ...mapGetters(["user", "clientHeight", "paySuccessData"]),
  },
  watch: {
    paySuccessData() {
      if (local.getToken() == this.paySuccessData.userToken) {
        localStorage.setItem("payCenterPaySuccessMesssage", "paySuccess");
        window.close();
      }
    },
  },
  components: {
    vueQr,
    swiper,
    swiperSlide,
  },
  async mounted() {
    var res = await commonApi.queryCorpSpace();
    if (res.code === 1) {
      this.corpSpaceModel = res.data;
      if (this.corpSpaceModel.hasCorp) {
        this.versionUpgradeTabs.splice(0, 1);
      } else {
        this.versionUpgradeTabs.splice(1, 1);
      }
    }

    this.queryGoods();
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 4,
        freeMode: true,
        spaceBetween: 24,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      swiperOption2: {
        slidesPerView: 4,
        freeMode: true,
        spaceBetween: 30,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      QRLogo: QRLogo,
      kjPayCenterLogo: kjPayCenterLogo,
      defaultAvator: defaultAvator,
      payCenterTabs: [
        { title: "版本升级", actived: true },
        { title: "容量套餐", actived: false },
      ],
      payCenterTabsActivedIndex: 0,
      versionUpgradeTabs: [
        { title: "个人版", remarks: "多种格式 秒速发布", actived: true },
        { title: "企业版", remarks: "云端协同 多人共享", actived: true },
      ],
      versionUpgradeTabsActivedIndex: 0,
      versionPrices: [
        { date: "******", price: "**", actived: true },
        { date: "******", price: "**", actived: false },
        { date: "******", price: "**", actived: false },
      ],
      versionPricesActivedIndex: 0,
      spacePrices: [
        { space: "******", price: "**", priceText: "******", actived: true },
        { space: "******", price: "**", priceText: "******", actived: false },
        { space: "******", price: "**", priceText: "******", actived: false },
        { space: "******", price: "**", priceText: "******", actived: false },
        { space: "******", price: "**", priceText: "******", actived: false },
      ],
      spacePricesActivedIndex: 0,
      bwPriceVisible: false,
      bwPrice: bwPrice,
      corpSpaceModel: {
        dDUserAvatar: null,
        username: null,
        corpName: null,
        minOfPeople: null,
        orderIsNull: true,
        isTryOut: null,
        minOfPeople: null,
        maxOfPeople: null,
        isPersonal: null,
        usedSpace: 0,
        usableSpace: 0,
        usedPercent: 0,
        registedUserCount: 0,
        hasCorp: false,
        personPercent: 0,
      },
      avatorUrl:
        process.env.BASE_API + "/api/home/GetimgFile?fileUrl=",

      payUrl: process.env.BASE_API + "/api/WebOrder/preUnifiedorder",
      priceData: [
        { number: "免费试用", date: "1个月", price: null, remarks: null },
        { number: "1（个人版）", date: "1个月", price: 18, remarks: null },
        { number: "1（个人版）", date: "3个月", price: 48, remarks: null },
        { number: "1（个人版）", date: "1年", price: 168, remarks: null },
        {
          number: "1-5（企业版）",
          date: "1个月",
          price: 198,
          remarks: "限购一次",
        },
        {
          number: "1-5（企业版）",
          date: "3个月",
          price: 888,
          remarks: "限购一次",
        },
        {
          number: "1-5（企业版）",
          date: "1年/2年",
          price: "5000/9000",
          remarks: null,
        },
        {
          number: "6-15（企业版）",
          date: "1年/2年",
          price: "10000/18000",
          remarks: null,
        },
        {
          number: "16-30（企业版）",
          date: "1年/2年",
          price: "20000/36000",
          remarks: null,
        },
        {
          number: "31-50（企业版）",
          date: "1年/2年",
          price: "30000/42000",
          remarks: null,
        },
        {
          number: "51-100（企业版）",
          date: "1年/2年",
          price: "50000/88000",
          remarks: null,
        },
        {
          number: "101-200（企业版）",
          date: "1年/2年",
          price: "80000/150000",
          remarks: null,
        },
        {
          number: "201-500（企业版）",
          date: "1年/2年",
          price: "150000/268000",
          remarks: null,
        },
        {
          number: "500人以上（企业版）",
          date: null,
          price: null,
          remarks: null,
        },
      ],
      encrypt
    };
  },
  methods: {
    async queryGoods() {
      var res = await postApi.get("/api/WebOrder/Goods");
      if (res.code === 1) {
        this.versionPrices = res.data.filter((item) => {
          return item.isVersionOrder;
        });
        this.versionPrice = this.versionPrices.map((item, index) => {
          if (index === 0) {
            item.actived = true;
          } else {
            item.actived = false;
          }
          return item;
        });

        this.spacePrices = res.data.filter((item) => {
          return !item.isVersionOrder;
        });
        this.spacePrices = this.spacePrices.map((item, index) => {
          if (index === 0) {
            item.actived = true;
          } else {
            item.actived = false;
          }
          return item;
        });
      }

      if (this.payCenterTabsActivedIndex === 0) {
        this.payUrl =
          this.payUrl +
          "?productId=" +
          this.versionPrice[0].goodsCode +
          "&accessToken=" +
          decrypt(local.getToken());
      } else {
        this.payUrl =
          this.payUrl +
          "?productId=" +
          this.spacePrices[0].goodsCode +
          "&accessToken=" +
          decrypt(local.getToken());
      }
      clg
    },
    handlePayCenterTabsChange(index) {
      this.payUrl = process.env.BASE_API + "/api/WebOrder/preUnifiedorder";
      this.payCenterTabsActivedIndex = index;
      var payCenterActivedTab = this.payCenterTabs.filter((item) => {
        return item.actived == true;
      })[0];
      payCenterActivedTab.actived = false;
      this.payCenterTabs[index].actived = true;
      if (this.payCenterTabsActivedIndex === 0) {
        this.payUrl =
          this.payUrl +
          "?productId=" +
          this.versionPrice[0].goodsCode +
          "&accessToken=" +
          decrypt(local.getToken());
      } else {
        this.payUrl =
          this.payUrl +
          "?productId=" +
          this.spacePrices[0].goodsCode +
          "&accessToken=" +
          decrypt(local.getToken());
      }
    },
    handleVersionUpgradeTabsChange(index) {
      this.versionUpgradeTabsActivedIndex = index;
      var versionUpgradeTab = this.versionUpgradeTabs.filter((item) => {
        return item.actived == true;
      })[0];
      versionUpgradeTab.actived = false;
      this.versionUpgradeTabs[index].actived = true;
    },
    handleVersionUpgradePriceCardChange(item, index, event) {
      console.log("event", event);
      this.payUrl = process.env.BASE_API + "/api/WebOrder/preUnifiedorder";
      this.versionPricesActivedIndex = index;
      var versionPrice = this.versionPrices.filter((a) => {
        return a.actived == true;
      })[0];
      versionPrice.actived = false;
      this.versionPrices[index].actived = true;

      //二维码变更
      this.payUrl =
        this.payUrl +
        "?productId=" +
        this.versionPrice[index].goodsCode +
        "&accessToken=" +
        decrypt(local.getToken());
    },
    handleSpaceUpgradePriceCardChange(item, index) {
      this.payUrl = process.env.BASE_API + "/api/WebOrder/preUnifiedorder";
      this.spacePricesActivedIndex = index;
      var payCenterActivedTab = this.spacePrices.filter((a) => {
        return a.actived == true;
      })[0];
      payCenterActivedTab.actived = false;
      this.spacePrices[index].actived = true;
      //二维码变更
      this.payUrl =
        this.payUrl +
        "?productId=" +
        this.spacePrices[index].goodsCode +
        "&accessToken=" +
        local.getToken();
    },
    handleChangeVersionOrder() {
      this.$confirm("确认要变更为此版本吗？变更后无法撤销!").then(async () => {
        var res = await postApi.post("/api/WebOrder/ChangeVersionOrder", {
          goodsCode:
            this.versionPrices[this.versionPricesActivedIndex].goodsCode,
        });
        if (res.code == 1) {
          localStorage.setItem("payCenterChangeMesssage", "changeSuccess");
          window.close();
        }
      });
    },
  },
};
</script>

<style scoped>
.titleText {
  padding-left: 20px;
  margin-left: 20px;
  font-size: 18px;
  font-weight: bold;
  height: 24px;
  color: #666;
  border-left: 2px solid #d2d2d2;
}

.changeOrder {
  background-color: #ff6a00;
  border-color: #ff6a00;
  color: white;
}

.changeOrder:hover {
  opacity: 0.8;
}

.payImg {
  height: 20px;
  width: 20px;
  vertical-align: middle;
}

.corpPayContent {
  margin-top: 30px;
  color: white;
  font-size: 14px;
  background: #f5f6fa;
}

.corpPayTitleContainer {
  height: 120px;
  padding-top: 16px;
  background: url('../../assets/corpDetailImg/corpDetailTitle.png') no-repeat;
  background-size: 100% 120px;
}

.inlineBlock {
  display: inline-block;
}

.corpPayTitleBottom {
  margin-top: 14px;
  line-height: 60px;
}

.rectangleActived {
  height: 60px;
  width: 300px;
  background: url('../../assets/corpDetailImg/payCenterRectangleActive.png') no-repeat;
  color: #774b04;
  font-size: 20px;
  font-weight: 500;
  background-size: 300px 60px;
  text-align: center;
  line-height: 60px;
}

.rectangleActived:hover,
.defaultRectangle:hover {
  cursor: pointer;
}

.defaultRectangle {
  height: 60px;
  width: 300px;
  font-size: 20px;
  font-weight: 500;
  background: url('../../assets/corpDetailImg/payCenterRectangle.png') no-repeat;
  background-size: 300px 60px;
  text-align: center;
  line-height: 60px;
}

.companyVersionDefault {
  height: 32px;
  width: 32px;
  display: inline-block;
  margin-top: 24px;
  margin-left: 70px;
  vertical-align: bottom;
  margin-right: 34px;
  background-size: 32px 32px;
  background: url('../../assets/corpDetailImg/qiyeban-xuanzhong.svg') no-repeat;
}

.personalVersionDefault {
  height: 32px;
  width: 32px;
  display: inline-block;
  margin-top: 24px;
  margin-left: 70px;
  vertical-align: bottom;
  margin-right: 34px;
  background-size: 32px 32px;
  background: url('../../assets/corpDetailImg/gerenbanActive.svg') no-repeat;
}

.versionDetailHref {
  color: #666;
  text-align: center;
  width: 100%;
  display: inline-block;
}

.versionDetailHref:hover {
  text-decoration: underline;
}

.corpPayBodyContainer {
  padding: 17px 25px;
}

.versionUpgradeTabActive {
  color: white;
  background: linear-gradient(136deg, #6be2ff 0%, #048fed 100%);
}

.versionUpgradeTabDefault {
  color: #333333;
  background: #fff;
}

.versionUpgradeTab {
  cursor: pointer;
  width: 336px;
  height: 80px;
  display: inline-block;
  border-radius: 8px;
}

.versionUpgradePriceCardContainer {
  margin-top: 30px;
}

.versionUpgradePriceCard {
  height: 138px;
  background: #ffffff;
  border-radius: 8px;
  text-align: center;
  color: #333333;
  display: inline-block;
}

.versionUpgradePriceCard:hover {
  cursor: pointer;
}

.versionUpgradePriceCardBorder {
  border: 3px solid #006fff;
  height: 132px;
}

.bwPriceContainer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-button-prev,
.swiper-button-next {
  height: 40px;
  width: 20px;
}

.swiper-button-next {
  background-image: url('../../assets/corpDetailImg/向右.svg');
  background-repeat: no-repeat;
  right: 0;
}

.swiper-button-prev {
  background-image: url('../../assets/corpDetailImg/向左.svg');
  background-repeat: no-repeat;
  left: 0;
}

.priceTable {
  border-collapse: collapse;
  width: 428;
  float: left;
}

.priceTable td {
  padding-left: 14px;
}

.priceTable tr {
  border: 1px solid #d8dce6;
  height: 32px;
  line-height: 30px;
}

.priceRemarks {
  width: 410px;
  height: 290px;
  background: #f9f9f9;
  float: left;
  border-radius: 4px;
  margin-left: 15px;
}

.priceRemarksItem {
  height: 50%;
  padding: 23px 15px 10px 20px;
}

.priceRemarksItem img {
  width: 18px;
  height: 17px;
  vertical-align: bottom;
}

.priceRemarksItemImg {
  margin-right: 7px;
}

.priceRemarksText {
  line-height: 20px;
}

.priceTableBtn {
  width: 96px;
  height: 24px;
  background: linear-gradient(270deg, #3296fa 0%, #61c7fd 100%);
  border-radius: 16px;
  color: white;
  line-height: 24px;
  text-align: center;
  margin-left: 140px;
}

.priceTableBtn:hover {
  opacity: 0.7;
  cursor: pointer;
}
</style>