<template>
  <el-container :style="{ height: clientHeight - 58 + 'px' }">
    <mapComponents
      :projetList="projectList"
      v-if="mapVisible"
      ref="mapComponents"
    />
    <div class="topContainer">
      <div style="float: right">
        <el-input
          placeholder="请输入项目名称"
          prefix-icon="el-icon-search"
          v-model="searchRules.projectName"
          size="mini"
          style="width: 240px"
        >
        </el-input>
        <el-button
          type="primary"
          size="mini"
          style="margin-left: 8px"
          @click="handleSearch"
          >搜索</el-button
        >
        <!-- <el-button
          icon="shareBtn icon-share"
          size="mini"
          style="margin-left: 8px"
          >分享</el-button
        > -->
      </div>
    </div>
    <div class="areaStatisticsDataContainer" style="height: 100%">
      <div style="height: 40%">
        <div class="progressTitle">项目区域分布排行榜</div>
        <div>
          <div
            v-for="(item, index) in locationList"
            :key="index"
            class="progressItem"
            :style="{
              color: colorFormatter(index),
            }"
          >
            <div class="progressFont">
              <span class="dot">●</span
              ><span class="sort">{{
                9 > index >= 0 ? "0" + (index + 1) : index + 1
              }}</span
              ><span>{{ item.province }}</span>
            </div>
            <el-progress
              :percentage="item.progress"
              :color="colorFormatter(index)"
              class="progress"
            ></el-progress>
            <div class="number">{{ item.number }}</div>
          </div>
        </div>
      </div>
      <div style="height: 50%">
        <div class="progressTitle" style="margin-bottom: 15px">项目分类</div>
        <div
          style="
            position: absolute;
            width: 100%;
            margin-left: -17px;
            margin-top: 30%;
            text-align: center;
          "
        >
          <div style="color: white; font-size: 28px; margin-bottom: 5px">
            {{ number }}
          </div>
          <div style="color: #aec9db; font-size: 14px">项目总数</div>
        </div>
        <div
          style="height: 500px"
          ref="pieChartContainer"
          id="pieChartContainer"
        ></div>
      </div>
    </div>
  </el-container>
</template>

<script>
import { mapGetters } from "vuex";
import mapComponents from "@/components/2DMap";
import projectApi from "@/api/project/all/index";

export default {
  computed: {
    ...mapGetters(["clientHeight"]),
    colorFormatter() {
      return function (index) {
        let color;
        switch (index) {
          case 0:
            color = "#d84431";
            break;
          case 1:
            color = "#ef702a";
            break;
          case 2:
            color = "#e3ab21";
            break;
          default:
            color = "#AEC9DB";
        }

        return color;
      };
    },
  },
  components: {
    mapComponents,
  },
  data() {
    return {
      projectList: null,
      mapVisible: false,
      searchRules: {
        projectName: null,
      },

      locationList: null,
      typeList: null,
      number: 0,
    };
  },
  async mounted() {
    var res = await projectApi.getAllProject();
    this.projectList = res.data;
    this.mapVisible = true;

    var statisticsRes = await projectApi.getStatistics();
    this.locationList = statisticsRes.data.location;
    this.typeList = statisticsRes.data.type;
    this.number = statisticsRes.data.number;

    const colorList = [
      ["#17AEE2"],
      ["#AEC9DB"],
      ["#D84431"],
      ["#E3AB21"],
      ["#1FDC5E"],
    ];
    const scaleData = [];
    this.typeList.forEach((element) => {
      scaleData.push({ name: element.type, value: element.number });
    });
    const holderValue =
      scaleData.reduce((a, b) => {
        return a + b.value;
      }, 0) * 0.01;
    const occupiedHolderStyle = {
      value: holderValue,
      itemStyle: {
        normal: {
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          color: "rgba(0, 0, 0, 0)",
          borderColor: "rgba(0, 0, 0, 0)",
        },
      },
    };
    const legendOption = {
      top: "60%",
      orient: "vertical",
      icon: "rect",
      itemGap: 30,
      itemWidth: 18,
      itemHeight: 8,
      textStyle: {
        fontSize: 12,
        rich: {
          name: {
            color: "#bed3f8",
            fontSize: 12,
            width: 60,
          },
          percent1: {
            color: "#53A8F0",
            fontSize: 12,
          },
          percent2: {
            color: "#D893FA",
            fontSize: 12,
          },
          percent3: {
            color: "#F9FCFF",
            fontSize: 12,
          },
          percent4: {
            color: "#E6B747",
            fontSize: 12,
          },
          percent5: {
            color: "#D6F44F",
            fontSize: 12,
          },
          percent6: {
            color: "#74FAD7",
            fontSize: 12,
          },
        },
      },
      formatter: (name) => {
        const idx = scaleData.findIndex((v) => v.name === name);
        if (idx < 0) {
          return "";
        }
        return `\r{name|${scaleData[idx].name}}\r\r{percent${idx + 1}|${
          scaleData[idx].value
        }}`;
      },
    };
    const data = [];
    for (let i = 0; i < scaleData.length; i++) {
      data.push(
        {
          value: scaleData[i].value,
          name: scaleData[i].name,
          itemStyle: {
            color: colorList[i][0],
          },
        },
        occupiedHolderStyle
      );
    }

    var legend = [];
    for (var i = 0; i < this.typeList.length; i++) {
      legend.push({
        data: [this.typeList[i].type],
        top: "" + (50 + i * 4) + "%",
        legendOption,
      });
    }

    console.log(legend);

    // 基于准备好的dom，初始化echarts实例
    let myChart = this.$echarts.init(this.$refs.pieChartContainer);
    myChart.setOption({
      legend: legend,
      color: colorList,
      series: [
        {
          type: "pie",
          radius: ["42%", "47%"],
          center: ["30%", "25%"],
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          width: "150%",
          data: data,
        },
      ],
    });
    window.onresize = function () {
      myChart.resize();
    };
  },
  methods: {
    handleSearch() {
      this.$refs.mapComponents.mapQueryByProjectName(
        this.searchRules.projectName
      );
    },
  },
};
</script>

<style>
.el-progress-bar {
  padding-right: 0;
}
.el-progress-bar__inner {
  border-radius: 0 !important;
}
.el-progress-bar__outer {
  border-radius: 0 !important;
  height: 8px !important;
  background-color: #2b426c !important;
}
.el-progress__text {
  display: none;
}
.progress {
  margin-bottom: 23px;
  display: inline-block;
  width: 162px;
}
.progressTitle {
  color: white;
  font-size: 16px;
  letter-spacing: 1px;
  margin-bottom: 26px;
}
.progressItem {
  font-size: 14px;
  color: #aec9db;
}
.progressFont {
  width: 117px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  margin-top: 1px;
  margin-right: 10px;
}
.dot {
  margin-right: 11px;
}
.sort {
  margin-right: 25px;
}

.number {
  margin-left: 15px;
  display: inline-block;
}

.topContainer {
  position: absolute;
  margin-top: 24px;
  margin-right: 20px;
  right: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0);
}

.shareBtn {
  font-family: "iconfont" !important;
  margin-right: 2px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
}

.areaStatisticsDataContainer {
  position: absolute;
  height: 40%;
  margin-top: 100px;
  right: 0;
  width: 330px;
  background-color: rgba(255, 255, 255, 0);
}

.statisticsDataContainer {
  bottom: 0;
  position: fixed;
  height: 50%;
  right: 0;
  width: 330px;
  background-color: rgba(255, 255, 255, 0);
}
</style>