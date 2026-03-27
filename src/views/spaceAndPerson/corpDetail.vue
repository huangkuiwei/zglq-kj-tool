<template>
  <div class="corpSpaceDetail" style="overflow: auto; height: auto !important;">
    <div class="corpSpaceDetailHeader">
      <div style="text-align: left;overflow: hidden;">
        <img :src="user.avatar ? avatorUrl + encodeURIComponent(encrypt(user.avatar)) : defaultAvator" style=" width: 48px; height: 48px; border-radius: 50%; float: left; margin-top: 5px; " />
        <div class="avatarRightContainer">
          <div> {{ corpSpaceModel.username }} {{ corpSpaceModel.corpName ? "（" + corpSpaceModel.corpName + "）" : "" }} </div>
          <div style="margin-top: 15px" v-if="!$isOwner">
            <div class="corpVersion"> {{ corpSpaceModel.orderIsNull ? "0-无限制" : corpSpaceModel.isTryOut ? "试用版" : corpSpaceModel.isPersonal ? "个人版" : "企业版" }} </div>
            <span style="margin-left: 12px">{{ $t('base.button.validTo') }}：{{ $t('base.button.indefinitely') }}</span>
          </div>
        </div>
        <!-- <div class="corpOperateBtn" v-if="!corpSpaceModel.orderIsNull" @click="linkToPayCenter">续费升级</div> -->
      </div>
      <div style="margin-top: 30px">
        <div style=" height: 12px; border-radius: 10px; display: inline-block; width: 100%; vertical-align: middle; " :style="{ background: 'linear-gradient(90deg, #6DD400 ' + corpSpaceModel.usedPercent + '%, #ebeef5 0%)', }"></div>
      </div>
      <div style="margin-top: 10px">
        <span>{{ $t('base.button.used') }}：{{ corpSpaceModel.usedSpace }} / {{ corpSpaceModel.bwForPrivatization ? $t('base.button.unlimited') : corpSpaceModel.usableSpace + '(' + corpSpaceModel.usedPercent.toFixed(2) + '%)' }}</span>
      </div>
      <!-- <div style="margin-top: 25px">
        <el-link type="primary" @click="spaceDetail" :underline="false" style="color: white" >查看详情</el-link >
      </div> -->
    </div>
    <div class="corpSpaceDetailBody">
      <div class="corpRecordContainer" :style="{ height: clientHeight - 380 + 'px' }">
        <div class="corpRecordTableTabContainer">
          <div v-for="(item, index) in corpRecordTabList" :key="index" class="corpRecordTableTab">
            <div :class="{ corpRecordTabActived: item.active }" class="corpRecordTableTabA" @click="handleCorpRecordTabChange(index)"> {{ item.text }} </div>
          </div>
        </div>
        <template v-if="corpRecordTabActived == 999">
          <el-table class="t-table" ref="multipleTable" :data="tableData" stripe :height="clientHeight - 440 + 'px'" :header-cell-style="$thStyle" style="width: 100%">
            <el-table-column prop="AAA" width="30px">
            </el-table-column>
            <el-table-column prop="orderId" label="订单号"></el-table-column>
            <el-table-column prop="standardFee" label="标价（元）"></el-table-column>
            <el-table-column prop="payFee" label="付费金额"></el-table-column>
            <el-table-column prop="goodsName" label="购买商品"></el-table-column>
            <el-table-column prop="createTime" label="消费时间"></el-table-column>
          </el-table>
        </template>
        <template v-if="corpRecordTabActived == 9999">
          <el-table class="t-table" :height="clientHeight - 440 + 'px'" ref="multipleTable" :data="tableData" stripe :header-cell-style="$thStyle" style="width: 100%">
            <el-table-column prop="AAA" width="30px">
            </el-table-column>
            <el-table-column prop="spaceType" label="容量构成方式"></el-table-column>
            <el-table-column prop="standardFee" label="标价（元）"></el-table-column>
            <el-table-column prop="createTime" label="获得时间"></el-table-column>
            <el-table-column prop="goodsName" label="套餐名称"></el-table-column>
            <el-table-column prop="payFee" label="订单金额（元）"></el-table-column>
            <el-table-column prop="orderSpace" label="容量大小">
              <template slot-scope="scope"> {{ $getFileSize(scope.row.orderSpace) }} </template>
            </el-table-column>
            <el-table-column prop="usableSpace" label="总容量">
              <template slot-scope="scope"> {{ $getFileSize(scope.row.usableSpace) }} </template>
            </el-table-column>
            <el-table-column prop="serviceStopTime" label="有效期"></el-table-column>
          </el-table>
        </template>
        <template v-if="corpRecordTabActived == 0">
          <el-table class="t-table" :height="clientHeight - 440 + 'px'" ref="multipleTable" :data="tableData" stripe :header-cell-style="$thStyle" style="width: 100%">
            <el-table-column prop="AAA" width="30px">
            </el-table-column>
            <el-table-column prop="projectName" :label="$t('projects.label.name')" key="projectName">
              <template slot-scope="scope">
                <img src="@/assets/corpDetailImg/文件夹.png" style="width:14px;height:14px;vertical-align:text-top;margin-right:6px;" />
                <span>{{ scope.row.projectName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fileUsedSpace" key="fileUsedSpace" width="160" align="center" :label="$t('base.button.occupyingCapacity')"></el-table-column>
            <el-table-column prop="adminName" width="120" align="center" :label="$t('base.button.projectLeader')"></el-table-column>
            <el-table-column prop="projectType" width="180" align="center" :label="$t('projects.label.type')"></el-table-column>
            <el-table-column prop="createTime" width="180" align="center" :label="$t('base.button.createTime')"></el-table-column>
          </el-table>
        </template>
        <template v-if="corpRecordTabActived == 1">
          <el-table class="t-table" :max-height="clientHeight - 440 + 'px'" :height="clientHeight - 440 + 'px'" ref="multipleTable" :data="tableData" stripe :header-cell-style="$thStyle" style="width: 100%">
            <el-table-column :label="$t('base.button.index')" align="center" width="100" key="index">
              <template slot-scope="scope"> {{ scope.$index + 1 }} </template>
            </el-table-column>
            <el-table-column prop="phone" :label="$t('base.label.phone')" key="phone"></el-table-column>
            <el-table-column prop="userName" align="center" :label="$t('base.label.name')"></el-table-column>
            <el-table-column prop="registersTime" align="center" :label="$t('base.button.joinTime')">
              
            </el-table-column>
          </el-table>
        </template>

        <template v-if="corpRecordTabActived == 2">
          <el-table class="t-table" :max-height="clientHeight - 440 + 'px'" :height="clientHeight - 440 + 'px'" ref="multipleTable" :data="tableData" stripe :header-cell-style="$thStyle" style="width: 100%">
            <el-table-column :label="$t('base.button.index')" align="center" width="100" key="index">
              <template slot-scope="scope"> {{ scope.$index + 1 }} </template>
            </el-table-column>
            <el-table-column prop="phone" :label="$t('base.label.phone')" key="phone"></el-table-column>
            <el-table-column prop="userName" align="center" :label="$t('base.label.name')"></el-table-column>
            <el-table-column prop="registersTime" align="center" :label="$t('base.button.joinTime')">

            </el-table-column>
          </el-table>
        </template>

      </div>
      <pagination style="border: none" v-if="corpRecordTabActived != 3" :pageTotal="total" @handleCurrentChange="paginationCurrentChange" @handleSizeChange="handleSizeChange" :pageNumber="10"></pagination>
      <!--<div style=" text-align: center; width: 100%; color: #999999; font-size: 14px; height: 50px; line-height: 50px; "> Copyright © 1999-2023 | 北京跨世纪软件技术有限公司 | 京ICP备2020036512号-2 </div>-->
    </div>
    <el-dialog v-dialogDrag :modal="true" title="容量组成说明" :visible.sync="dialogVisible" width="850px" style="padding-bottom: 10px">
      <el-table class="t-table" ref="multipleTable" :data="spaceMakeUpData" stripe :header-cell-style="$thStyle" style="width: 100%; font-size: 13px" height="160px">
        <el-table-column prop="makeUpWay" label="容量构成方式"></el-table-column>
        <el-table-column prop="getDate" label="获得时间"></el-table-column>
        <el-table-column prop="orderName" label="套餐名称"></el-table-column>
        <el-table-column prop="orderAmount" label="订单金额"></el-table-column>
        <el-table-column prop="spaceNumber" label="容量大小"></el-table-column>
        <el-table-column prop="spaceAll" label="总容量"></el-table-column>
        <el-table-column prop="serviceStopTime" label="有效期"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import projectApi from "@/api/project/all/index";
import pagination from "@/components/pagination/index";
import titleImage from "@/assets/corpDetailImg/形状结合.png";
import defaultAvator from "@/assets/robot.svg";
import local from "@/utils/auth";
import commonApi from "@/api/common";
import postApi from "@/api/document/indexApi.js";
import { decrypt, encrypt } from '@/utils'
import moment from 'moment'

export default {
  computed: {
    ...mapGetters(["user", "clientHeight", "paySuccessData"]),
  },
  watch: {
    paySuccessData() {
      if (local.getToken() == this.paySuccessData.userToken) {
        this.$router.go(0)
      }
    }
  },
  components: {
    pagination,
  },
  data() {
    return {
      moment,
      titleImage: titleImage,
      pageIndex: 1,
      pageSize: 10,
      tableData: null,
      total: 0,
      dialogVisible: false,
      spaceMakeUpData: null,
      defaultAvator: defaultAvator,
      corpRecordTabList: [],
      corpRecordTabActived: 0,
      corpSpaceModel: {
        usedPercent: 0,
      },
      noTime: "无限制",
      avatorUrl: process.env.BASE_API + '/api/home/GetimgFile?fileUrl=',
      encrypt
    };
  },
  methods: {
    async loadProjectSpace() {
      var formData = new FormData();
      formData.append("page", this.pageIndex);
      formData.append("rows", this.pageSize);
      formData.append("Orderby", "desc");
      var res = await projectApi.queryProjectSpace(formData);

      // filePath 和 turnPath 解码
      res.data && res.data.forEach(item => {
        item.filePath = decrypt(item.filePath || '')
        item.turnPath = decrypt(item.turnPath || '')
      })

      this.tableData = res.data;
      this.total = res.count;
    },
    async queryOrderData() {
      var formData = new FormData();
      formData.append(
        "orderType",
        this.corpRecordTabActived == 9999 ? "space" : "none"
      );
      formData.append("page", this.pageIndex);
      formData.append("rows", this.pageSize);
      var res = await postApi.post("/api/WebOrder/List", formData);

      // filePath 和 turnPath 解码
      res.data && res.data.forEach(item => {
        item.filePath = decrypt(item.filePath || '')
        item.turnPath = decrypt(item.turnPath || '')
      })

      this.tableData = res.data;
      this.total = res.count;
    },
    async queryPersonData() {
      var formData = new FormData();
      formData.append("page", this.pageIndex);
      formData.append("rows", this.pageSize);

      if (this.corpRecordTabActived == 1) {
        formData.append("isOutuser", 0);
      }else if (this.corpRecordTabActived == 2) {
        formData.append("isOutuser", 1);
      }

      var res = await postApi.post("/api/Users/GetCorpUsersData", formData)

      this.total = res.count;
      this.tableData = res.data
    },
    linkToPayCenter() {
      let routeData = this.$router.resolve({
        path: "/payCenter"
      });
      window.open(routeData.href, "_blank");
    },
    paginationCurrentChange(val) {
      this.pageIndex = val;
      this.loadData()
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadData()
    },

    spaceDetail() {
      this.dialogVisible = true;
    },

    loadData() {
      if (this.corpRecordTabActived == 1 || this.corpRecordTabActived == 2) {
        this.queryPersonData()
      } else if (this.corpRecordTabActived == 0) {
        this.loadProjectSpace();
      }
      else {
        this.queryOrderData();
      }
    },
    handleCorpRecordTabChange(index) {
      this.pageIndex = 1;
      this.pageSize = 10;
      this.tableData = null;
      this.total = 0;
      this.corpRecordTabList.forEach((element) => {
        element.active = false;
      });

      this.corpRecordTabList[index].active = true;
      this.corpRecordTabActived = index;
      this.loadData()
    },
  },
  async mounted() {
    var _self = this
    window.addEventListener('storage', event => {
      if (event.key == "payCenterChangeMesssage") {
        _self.$success(res.msg)
        _self.handleCorpRecordTabChange(0)
        if (event.newValue) {
          localStorage.removeItem("payCenterChangeMesssage")
        }
      }
      if (event.key == "payCenterPaySuccessMesssage") {
        _self.$success(res.msg)
        _self.handleCorpRecordTabChange(0)
        if (event.newValue) {
          localStorage.removeItem("payCenterPaySuccessMesssage")
        }
      }
    })

    var res = await commonApi.queryCorpSpace();
    if (res.code == 1) {
      this.corpSpaceModel = res.data;
    }
    this.corpRecordTabList = [
      // { text: "购买记录", active: true },
      // { text: "扩容记录", active: false },
      { text: this.$t('base.button.storageDetails'), active: false },
    ]
    if (this.user.corpIdbit) {
      this.corpRecordTabList.push({ text: this.$t('base.button.memberDetails'), active: false })
      this.corpRecordTabList.push({ text: this.$t('base.button.outsourcedMember'), active: false })
    }
    this.spaceMakeUpData = [
      {
        makeUpWay: "长期容量",
        getDate: this.user.paidtime,
        orderName: "初始容量",
        orderAmount: "0元",
        spaceNumber: this.user.usableSpace,
        spaceAll: this.user.usableSpace,
        serviceStopTime: "长期有效",
      },
    ];
    var actived = local.getCorpRecordTabActived()
    if (!actived) {
      actived = 0
    }
    this.handleCorpRecordTabChange(actived)
    local.removeCorpRecordTabActived()
    // this.queryOrderData();
  },
};
</script>

<style scoped>
.corpSpaceDetail {
  font-size: 14px;
  background-color: white;
  //height: 100%;
  position: absolute;
  width: 100%;
}

.corpSpaceDetailHeader {
  padding: 45px 360px 20px 360px;
  background-image: url("../../assets/corpDetailImg/corpDetailTitle.png");
  height: 210px;
  color: white;
}

.avatarRightContainer {
  display: inline-block;
  margin-top: 3px;
  margin-left: 14px;
}

.corpVersion {
  display: inline-block;
  text-align: center;
  line-height: 18px;
  width: 98px;
  margin-top: 8px;
  height: 18px;
  background: #3296fa;
  border-radius: 11px;
  font-size: 12px;
  color: #ffffff;
  font-weight: 400;
}

.corpSpaceDetailBody {
  padding: 38px 360px 5px 360px;
}

.corpOperateBtn:hover {
  cursor: pointer;
  background: linear-gradient(90deg, #c29968 0%, #ce955f 100%);
  color: #ffffff;
}

.corpOperateBtn {
  margin-top: 10px;
  color: #774b04;
  display: inline-block;
  width: 128px;
  height: 38px;
  line-height: 38px;
  text-align: center;
  margin-left: 37px;
  background: linear-gradient(82deg, #efd8bd 0%, #dcb28a 100%);
  border-radius: 19px;
}

.corpRecordContainer {
  width: 100%;
  background: #ffffff;
  border-radius: 8px;
}

.corpSpaceDetailTitle {
  color: #333333;
  font-size: 16px;
  font-weight: 400;
  margin-right: 10px;
  margin-left: 8px;
}

.corpRecordTableTabContainer {
  width: 100%;
  margin-top: 16px;
}

.corpRecordTableTab {
  padding: 18px 30px;
  padding-bottom: 0;
  display: inline-block;
  color: #333333;
  font-size: 14px;
  font-weight: 400;
}

.corpRecordTableTabA {
  height: 30px;
}

.corpRecordTableTabA:hover {
  cursor: pointer;
  color: #3296fa;
}

.corpRecordTabActived {
  border-bottom: 4px solid #006fff;
}

.corpSpacePriceCard {
  width: 250px;
  height: 210px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.16);
  border-radius: 8px;
  display: inline-block;
  margin-right: 30px;
  padding-top: 39px;
  text-align: center;
}

.corpSpaceNumber {
  /* margin-top:39px; */
  color: #2a2a2a;
  font-size: 28px;
  font-weight: 500;
}

.corpSpacePrice {
  font-size: 16px;
  color: #3296fa;
  margin-top: 8px;
}

.corpSpacePirceCardBtn {
  margin: 41px auto 0 auto;
  width: 128px;
  height: 32px;
  line-height: 32px;
  border-radius: 22px;
  font-size: 12px;
  font-weight: 400;
  color: #3296fa;
  border: 1px solid #51c0f5;
}

.corpSpacePirceCardBtn:hover {
  border: 1px solid white;
  cursor: pointer;
  color: white;
  background: linear-gradient(270deg, #048fed 0%, #6be2ff 100%);
}
</style>
