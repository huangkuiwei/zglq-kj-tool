<template>
  <el-dialog v-dialogDrag title="已注册人员数" :visible.sync="dialogVisible" width="800px">
    <div style="margin-top: 15px;text-align:center">
      <div>
        <img :src="titleImage" class="corpSpaceDetailTitleImage_Revert" />
        <span class="corpSpaceDetailTitle">马上扩充使用人数</span>
        <img :src="titleImage" class="corpSpaceDetailTitleImage" />
      </div>
      <div style="font-size: 12px; color: #999999; margin-top: 7px">
        购买后随即生效，团队协作更高效
      </div>
    </div>
    <div style="margin-top: 20px">
      <div>
        <div style="
            width: 4px;
            height: 18px;
            background: rgb(50, 150, 250);
            border-radius: 2px;
            display: inline-block;
            vertical-align: text-bottom;
          "></div>
        <span style="
            color: #2a2a2a;
            margin-left: 7px;
            font-size: 16px;
            font-weight: 500;
          ">BIM Windows定价</span>
      </div>
      <el-table class="t-table" ref="multipleTable" :data="$systemPrice" stripe :header-cell-style="$thStyle" style="width: 100%; font-size: 13px; margin-top: 30px">
        <el-table-column prop="AAA" width="50px"> </el-table-column>
        <el-table-column prop="person" label="人数"> </el-table-column>
        <el-table-column prop="days" label="周期"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="remarks" :label="$t('base.button.remark')"></el-table-column>
      </el-table>
    </div>
    <div class="buyButton" style="" @click="$showPhoneNumber()">
      联系供应商购买
    </div>
    <div>
      <div style="
            width: 4px;
            height: 18px;
            background: rgb(50, 150, 250);
            border-radius: 2px;
            display: inline-block;
            vertical-align: text-bottom;
          "></div>
      <span style="
            color: #2a2a2a;
            margin-left: 7px;
            font-size: 16px;
            font-weight: 500;
          ">使用人员详情</span>
    </div>
    <el-table class="t-table" ref="multipleTable" :data="personData" stripe :header-cell-style="$thStyle" style="width: 100%; font-size: 13px; margin-top: 30px">
      <el-table-column prop="AAA" width="50px"> </el-table-column>
      <el-table-column type="index" :label="$t('base.button.index')" width="200px"> </el-table-column>
      <el-table-column prop="userName" :label="$t('base.label.name')"></el-table-column>
      <el-table-column prop="createTime" label="注册时间">
        <template slot-scope="scope">
          {{ $dayjs(scope.row.createTime, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import titleImage from "@/assets/corpDetailImg/形状结合.png";
import { mapGetters } from "vuex";
import postApi from "@/api/document/indexApi.js";

export default {
  computed: {
    ...mapGetters(["registedPersonContainerVisible"]),
  },
  watch: {
    registedPersonContainerVisible() {
      if (this.registedPersonContainerVisible) {
        this.loadPerson();
      } else {
        this.personData = null;
      }
      this.dialogVisible = this.registedPersonContainerVisible;
    },
    dialogVisible() {
      this.$store.state.app.registedPersonContainerVisible = this.dialogVisible;
    }
  },
  data() {
    return {
      personData: null,
      titleImage: titleImage,
      dialogVisible: false,
    };
  },
  methods: {
    async loadPerson() {
      var res = await postApi.get("/api/home/GetCorpUsers")
      this.personData = res.data
    }
  }
};
</script>

<style scoped>
.corpSpaceDetailTitle {
  color: #303133;
  font-size: 20px;
  font-weight: 400;
  margin-right: 10px;
  margin-left: 10px;
}

.buyButton:hover {
  cursor: pointer;
  width: 128px;
  height: 32px;
  background: linear-gradient(270deg, #3296FA 0%, #61C7FD 100%);
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  color: white;
  line-height: 32px;
  text-align: center;
  margin: 15px auto
}

.corpSpaceDetailTitleImage {
  width: 80px;
  height: 14px;
}

.corpSpaceDetailTitleImage_Revert {
  width: 80px;
  height: 14px;
  transform: rotateY(180deg);
}</style>
