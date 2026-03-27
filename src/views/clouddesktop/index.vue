<template>
  <el-container
    v-if="user.corpIdbit"
    style="height:calc(100vh - 51px)"
  >
    <mainSideMenu />
    <el-aside
      style="width:calc(100vw - 60px);height:calc(100vh - 51px);padding: 10px;"
      class="flex"
    >
      <div
        class="flex column"
        style="width:calc(100vw - 425px);min-width: 900px;height:calc(100vh - 71px);margin-right: 10px;"
      >
        <div
          class="flex shrink jc-between"
          style="height: calc(56vh - 80px);margin-bottom: 10px;"
        >
          <div
            class="chart-block box-shadow"
            style="margin-right: 10px;"
          >
            <div class="progressTitle">
              {{ $t('desktop.distribution') }}
            </div>
            <div
              class="flex jc-center ai-center"
              style="width: 100%"
            >
              <div
                id="mapCharts"
                ref="mapCharts"
                style="height: calc(55vh - 140px)"
                class="mapCharts"
              />
            </div>
          </div>
          <div class="chart-block box-shadow">
            <div class="progressTitle">
              {{ $t('desktop.type') }}
            </div>
            <div
              style="position: absolute;bottom:30px;left: 5%;text-align: center;color: #333; font-size: 16px"
              class="flex"
            >
              <div>{{ $t('desktop.total') }}：</div>
              <div style="font-weight: bold;">
                {{ number }}
              </div>
            </div>
            <div
              id="categoryChartContainer"
              ref="categoryChartContainer"
              style="height: calc(55vh - 140px)"
            />
          </div>
        </div>
        <div class="flex grow jc-between">
          <div
            class="chart-block box-shadow"
            style="margin-right: 10px;"
          >
            <div class="progressTitle">
              {{ $t('desktop.recently.project') }}
            </div>
            <el-table
              :data="recentlyProjects"
              :show-header="false"
              height="calc(44vh - 159px)"
              :header-cell-style="$thStyle"
              stripe
            >
              <el-table-column
                :label="$t('projects.label.name')"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div
                    class="flex ai-center"
                    style="cursor: pointer;"
                    @click="linkToFilePage(scope.row)"
                  >
                    <el-image
                      style="height:58px;width: 90px;margin-right: 10px;flex-shrink: 0;"
                      :src="scope.row.images"
                    >
                      <img
                        slot="error"
                        src="../../assets/projectDefaultImg.png"
                        style="height:58px;margin-right: 10px;"
                      >
                    </el-image>
                    <div>{{ scope.row.projectName }}（{{ scope.row.projectTypeName }}）</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="最近打开时间"
                align="center"
                width="180"
                prop="browseDate"
              />
            </el-table>
          </div>
          <div class="chart-block box-shadow">
            <div class="progressTitle">
              {{ $t('desktop.recently.file') }}
            </div>
            <el-table
              :data="recentlyFiles"
              :show-header="false"
              height="calc(44vh - 159px)"
              stripe
            >
              <el-table-column
                :label="$t('base.button.fileName')"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div
                    style="cursor:pointer"
                    @click="openInApp(scope.row)"
                  >
                    <fileIconComponends
                      :visible="false"
                      :row="scope.row"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                width="44"
                prop="createTime"
              >
                <template slot-scope="scope">
                  <img
                    style="width: 24px;display: block;margin: 2px 0;cursor: pointer;"
                    :src="$appList.find(item => item.type == scope.row.application)?.logo"
                    alt=""
                    @click="openInApp(scope.row)"
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="最近打开时间"
                align="center"
                width="160"
                prop="createTime"
              />
            </el-table>
          </div>
        </div>
        <div
          v-if="!$isRead"
          class="flex ai-center jc-center appBox"
        >
          <div
            v-for="i in $appList"
            v-if="$hasPermi(`desktop:applist:${i.type}`)"
            class="flex column ai-center app"
            @click="openAppPage(i)"
          >
            <img
              class="app-icon"
              :src="i.logo"
              alt=""
            >
            <!--  v-if="$hasPermi(`desktop:applist:showTitle`)"  -->
            <div
              v-if="$showAppTitle"
              class="app-title"
              style="font-size: 12px;"
            >
              {{ i.title }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex column"
        style="width: 340px;flex-shrink: 0;height:calc(100vh - 71px);"
      >
        <div
          class="rround-background shrink box-shadow"
          style="padding:15px;height: 180px;margin-bottom: 10px;border-radius: 12px;"
        >
          <div style="display: flex;">
            <img
              style="margin-top: 9px; width:16px; height:16px"
              src="../../assets/最新公告.svg"
            >
            <span style="margin-left: 5px; margin-top: 8px; font-size: 16px; font-weight: 800">{{
              $t('desktop.noticeboard') }}</span>
            <el-button
              type="text"
              size="small"
              style="margin-left: auto;"
              @click="noticeListVisible = true"
            >
              {{
                $t('base.button.more') }}
            </el-button>
          </div>
          <div
            v-for="(i, idx) in noticeList"
            v-if="idx <= 3"
            :key="i.iuid"
            class="flex ai-center jc-between noticelist"
            @click="viewDetail(i)"
          >
            <div class="notice-title">
              <img
                v-if="i.puttop"
                src="../../assets/top.png"
                style="width: 16px;margin-bottom: -3px;"
                alt="置顶"
              >
              <span
                v-if="i.unread"
                style="font-weight: bold;color: #f56c6c;"
              >[未读]</span>
              <span v-if="!i.unread && !i.puttop">—</span>
              <span>{{ i.title }}</span>
            </div>
            <span>{{ i.createTime.split(' ')[0] }}</span>
          </div>
        </div>
        <el-dialog
          :title="$t('base.button.announcementList')"
          :visible.sync="noticeListVisible"
          width="600px"
        >
          <div
            v-for="(i, idx) in noticeList"
            :key="i.iuid"
            class="flex ai-center jc-between noticelist"
            style="padding:15px 5px;margin: 0;border-bottom: 1px solid #f5f7fa;"
            @click="viewDetail(i)"
          >
            <span
              class="notice-title"
              style="width: 410px;"
            > {{ idx + 1 }}.{{ i.title }}</span>
            <span>{{ i.createTime }}</span>
          </div>
          <div slot="footer">
            <el-button
              size="small"
              @click="noticeListVisible = false"
            >
              {{ $t('base.button.close') }}
            </el-button>
          </div>
        </el-dialog>

        <div
          class="rround-background grow box-shadow"
          style="padding-bottom: 0;border-radius: 12px;"
        >
          <div
            class="flex ai-center"
            style="padding: 15px;padding-bottom: 5px;"
          >
            <img
              style="width:16px; height:16px"
              src="../../assets/工作日程.svg"
            >
            <span style="margin-left: 5px;margin-top: 2px;font-size: 16px; font-weight: 800">{{
              $t('desktop.todolist.title') }}</span>
          </div>
          <div
            class="hide-scroll"
            style="overflow-y: auto;height: calc(100vh - 302px);"
          >
            <div style="margin-top:0px">
              <workcalendar
                :date.sync="date"
                :sdata="scheduleData"
                @scheduleAdd="scheduleAdd"
                @getScheduleData="getScheduleData"
              />
            </div>
            <li
              v-if="msgCount > 0"
              class="events-item approve"
            >
              <div class="events-item-left">
                <span
                  class="events-name"
                  style="margin-bottom: 0;"
                >{{ msgCount }}{{ $t('desktop.todolist.todoCount')
                }}</span>
              </div>
              <span
                class="events-tag btn approve"
                @click="toTeamwork"
              >{{ $t('desktop.todolist.toDeal') }}</span>
            </li>
            <li
              v-if="applyCount > 0"
              class="events-item apply"
            >
              <div class="events-item-left">
                <span
                  class="events-name"
                  style="margin-bottom: 0;"
                >{{ applyCount }}{{
                  $t('desktop.todolist.userApplyCount') }}</span>
              </div>
              <span
                class="events-tag btn apply"
                @click="showApplyDialog"
              >{{ $t('desktop.todolist.toDeal') }}</span>
            </li>
            <li
              v-for="(i, idx) in scheduleData"
              :key="idx"
              class="events-item"
              :class="{ 'ago': agoDate(i) }"
              @mouseenter="showClose(i)"
              @mouseleave="hideClose(i)"
            >
              <i
                v-show="i.hover"
                class="el-icon-error close-event"
                @click="scheduleDataDel(i)"
              />
              <div class="events-item-left">
                <span class="events-name">{{ i.eventname }}</span>
                <span class="events-date">{{ i.datestr }}</span>
              </div>
              <span
                class="events-tag"
                @click="scheduleEdit(i)"
              >{{ $t('base.button.edit') }}</span>
            </li>
          </div>
        </div>
      </div>
    </el-aside>
    <!-- 人员申请 -->
    <person-apply
      :apply-data="applyData"
      :show-apply.sync="showApply"
      @loadCompanyApplyPerson="loadCompanyApplyPerson"
    />
    <!-- 待办事项 -->
    <el-dialog
      :title="scheduleActType == 'ADD' ? $t('desktop.todolist.addTitle') : $t('desktop.todolist.editTitle')"
      :visible.sync="scheduleVisible"
      width="440px"
    >
      <el-form
        ref="scheduleForm"
        :model="scheduleForm"
        :rules="scheduleFormRules"
        label-width="60px"
        :inline="false"
        size="normal"
      >
        <el-form-item :label="$t('base.label.time')">
          <div
            class="flex ai-center"
            style="margin-left: 0;"
          >
            <div style="margin-right: 10px;">
              {{ scheduleForm.date }}
            </div>
            <el-time-picker
              v-model="scheduleForm.time"
              :default-value="scheduleForm.date + ' 09:00:00'"
              value-format="HH:mm:ss"
              size="normal"
              :clearable="false"
              placeholder="请选择时间点"
            />
          </div>
        </el-form-item>
        <el-form-item
          prop="eventname"
          :label="$t('desktop.todolist.things')"
        >
          <el-input
            v-model="scheduleForm.eventname"
            style="width: 303px;"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          size="small"
          @click="scheduleVisible = false"
        >
          {{ $t('base.button.cancel') }}
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="scheduleDataSubmit"
        >
          {{ $t('base.button.submit') }}
        </el-button>
      </div>
    </el-dialog>
    <!-- 查看公告 -->
    <el-dialog
      title="公告详情"
      append-to-body
      :visible.sync="detailVisible"
      width="800px"
    >
      <el-skeleton
        v-if="loading"
        :rows="6"
        animated
      />
      <div v-else>
        <div style="text-align: center;font-size: 18px;font-weight: 500;margin-bottom: 15px;">
          {{ currentNotice.title }}
        </div>
        <div style="text-align: right;font-size: 14px;color: #999;margin-right: 20px;margin-bottom: 20px;">
          {{
            currentNotice.createTime }}
        </div>
        <div
          v-if="!currentNotice.isIframe"
          class="ql-editor"
          v-html="currentNotice.contenttext"
        />
        <iframe
          v-else
          style="width: 100%;height: 450px;"
          :src="currentNotice.contenttext"
          frameborder="0"
        />
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters } from "vuex";
import postApi from "@/api/document/indexApi.js";
import articleApi from "@/api/article.js";
import projectApi from '@/api/project/all/index'
import fileIconComponends from "@/components/fileIcon";

import { decrypt } from "@/utils"
// quill富文本样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import personApply from "@/components/Dialog/personApply.vue"
import moment from 'moment'
import workcalendar from "./workcalendar.vue";

import chinaMap from '@/libs/mapJson/chinaMap.json'
import worldMap from "@/libs/mapJson/worldMap.json"
let mapJson = worldMap;
export default {
  components: {
    workcalendar,
    personApply,
    fileIconComponends
  },
  computed: {
    ...mapGetters(["user", "currApp"]),
    locale() {
      return localStorage.getItem('language') || 'zhCn'
    },
  },
  data() {
    return {
      mapJson,
      loading: false,
      categoryCharts: '',
      categoryChartContainer: '',

      recentlyProjects: [],
      recentlyFiles: [],
      imageOrigin: process.env.VUE_APP_BASE_API + "/api/home/GetimgFile?fileUrl=",


      number: 0,
      showApply: false,
      applyData: [],
      msgCount: 0,
      applyCount: 0,
      noticeList: [],
      noticeListVisible: false,
      scheduleData: [],
      scheduleActType: 'ADD',
      scheduleVisible: false,
      date: '',
      scheduleForm: {
        date: '',
        time: '',
        eventname: '',
      },
      scheduleFormRules: {
        eventname: [
          {
            required: true,
            message: '请输入待办事项',
            trigger: 'blur'
          }
        ],
      },
      detailVisible: false,
      currentNotice: {},
      permi: []
    }
  },
  async mounted() {
    this.permi = localStorage.getItem('permi').split(',')
    if (this.user.corpIdbit) {
      this.$nextTick(async () => {
        await this.initCategoryCharts()
        await this.initMapCharts()
        let _this = this
        window.addEventListener('resize', () => {
          if (_this.mapCharts != null) _this.mapCharts.resize();
          if (_this.categoryCharts != null) _this.categoryCharts.resize();
        });
      })
      this.getApproveContent()
      this.getNoticeList()
      this.date = moment().format('YYYY-MM')
      this.getScheduleData()
      this.queryRecentlyProjects()
      this.queryRecentlyFiles()
    }
  },
  beforeDestroy() {
    // 销毁echarts图回收内存
    if (this.categoryCharts != null) {
      this.categoryCharts.clear()
      this.categoryCharts = null
    }
    this.destroyMap()
  },
  methods: {
    agoDate(item) {
      return false
    },
    async queryRecentlyProjects() {
      var postData = new FormData();
      postData.append("page", 1);
      postData.append("rows", 3);
      postData.append("dataRule", 'lately');
      postData.append("Orderby", 'DESC');
      var res = await projectApi.queryProjectPageList(postData);
      if (res.code == 1) {
        res.data.forEach((item) => {
          item.images = this.imageOrigin + encodeURIComponent(item.imagesOriginal)
        });
        this.recentlyProjects = res.data;
      }
    },
    async queryRecentlyFiles() {
      var postData = new FormData();
      postData.append("rows", 5);
      var res = await postApi.post('/api/ProjectFile/GetFileBrowseData', postData);
      if (res.code == 1) {
        res.data.forEach((item) => {
          item.filePath = decrypt(item.filePath || "");
          item.turnPath = decrypt(item.turnPath || "");
        });
        this.recentlyFiles = res.data;
      }
    },
    async linkToFilePage(row) {
      this.$store.commit('SET_ACTIVE_TAB', 'projects')
      this.$router.push({
        path: "/projectFile",
        query: {
          projectId: row.iuid,
          projectName: row.projectName,
          path: "/all",
        },
      });
    },
    openAppPage(item) {
      var bimIframe = JSON.parse(localStorage.getItem(item.appName));
      let _this = this;
      const openApp = () => {
        _this.$openItwinApp({
          appName: item.title,
          appOrigin: item.origin,
          selectFile: true,
          appType: item.type,
          appImage: item.start,
        }, null, true);
      }
      if (bimIframe && item.appName !== 'Bridge Master') {
        this.$confirm(`${appName}` + "已打开，是否打开新的工作台？").then(({ value }) => {
          openApp()
        })
      } else {
        openApp()
      }
    },
    openInApp(row) {
      let item = this.$appList.filter(item => item.type == row.application)[0];
      if (item) {
        let iuid = row.iuid;
        var bimIframe = JSON.parse(localStorage.getItem(item.appName));
        let _this = this;
        const openApp = () => {
          _this.$openItwinApp({
            appName: item.title,
            appOrigin: item.origin,
            appType: item.type,
            appImage: item.start,
          }, iuid, true, row);
        }
        openApp()
      } else {
        this.$error('应用未授权')
      }
    },
    async initCategoryCharts() {
      var statisticsRes = await projectApi.getStatistics();
      if (statisticsRes.code == 1) {
        this.locationList = statisticsRes.data.location.length == 0 ? [{ number: 0, province: "", progress: 0 }] : statisticsRes.data.location;
        console.log(this.locationList);
        this.typeList = statisticsRes.data.type;
        this.number = statisticsRes.data.number; //项目总数
      }
      let scaleData = [];
      scaleData = this.typeList.map(item => {
        return {
          name: item.type,
          value: item.number
        }
      })
      // 项目分类
      this.categoryCharts = this.$echarts.init(this.$refs.categoryChartContainer);
      const data = [];
      for (let i = 0; i < scaleData.length; i++) {
        data.push({
          value: scaleData[i].value,
          name: scaleData[i].name,
        });
      }
      this.categoryCharts.setOption({
        legend: {
          width: 200,
          height: 120,
          data: data,
          orient: 'vertical', // 设置为垂直布局
          x: '70%', // 图例水平位置在右侧
          y: 'center', // 图例垂直位置在上部
        },
        tooltip: {
          trigger: 'item'
        },
        // graphic: [{
        //   type: 'text',
        //   left: '31%',
        //   top: '47%',
        //   style: {
        //     text: this.$t('desktop.total') + '\n' + this.number,
        //     textAlign: 'center',
        //     fill: '#000', // 文字颜色
        //     fontSize: 20 // 文字大小
        //   }
        // }],
        series: [{
          type: "pie",
          top: '0',
          right: "20%",
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: [0, 0, 4, 4],
            borderColor: '#fff',
            borderWidth: 2
          },
          emphasis: {
            itemStyle: {
              borderWidth: 15,
              borderColor: '#5470c611',
            },
          },
          label: {
            show: true,
            formatter: ['{title|{c}}', '{b}'].join('\n'),
            rich: {
              title: {
                align: "center",
                lineHeight: 26,
                fontWeight: 'bold',
                fontSize: 24
              }
            },
            fontSize: 14,
            color: 'inherit',
            fontWeight: "bold"
          },

          radius: ["40%", "70%"],
          labelLine: {
            show: true,
          },
          data: data.filter(item => item.value != 0),
        }],
      });
    },
    async initMapCharts() {
      // 项目分布map
      let max = Math.max(...this.locationList.map(item => item.number))
      if (max == 0) {
        max = 5
      }
      if (max % 5 != 0) {
        max = max + 5 - (max % 5);
      }
      this.mapCharts = this.$echarts.init(this.$refs.mapCharts);
      this.$echarts.registerMap("mapJson", this.mapJson);
      this.mapCharts.setOption({
        tooltip: {
          show: true,
          trigger: 'item',
          formatter(p, t, cb) {
            return p.name + '：' + (isNaN(p.value) ? 0 : p.value) + "个"
          }
        },
        visualMap: {
          left: '20',
          type: 'piecewise',
          max: max,
          align: 'left',
          showLabel: true,
          // text: [max, '无'],
          inRange: {
            color: ["#ffc946", '#73c0de', '#91cc75', '#ee6666', '#ff0000']
          },
        },
        series: [{
          type: 'map',
          map: 'mapJson',
          roam: true,
          zoom: 1.2,
          scaleLimit: {
            max: 20,
            min: 1
          },
          labelLine: {
            show: true,
          },
          label: {
            show: true,
            color: '#333',
            textBorderColor: '#fff',
            textBorderWidth: 1,
            position: 'inside',
            formatter: (data) => {
              return !!data.value ? data.value : ''
            }
          },

          itemStyle: {
            areaColor: '#f8e8c1',
            borderColor: 'rgba(0, 0, 0, 0.4)',
          },
          data: this.locationList.map(item => {
            return {
              name: item.city,
              value: item.number
            }
          })
        }]
      })
    },
    destroyMap() {
      if (this.mapCharts != null) {
        this.mapCharts.clear()
        this.mapCharts = null
      }
    },
    // 个人日程
    async getScheduleData() {
      let formdata = new FormData();
      formdata.append('datestr', this.date)
      let res = await articleApi.scheduleList(formdata)
      if (res.code == 1) {
        this.scheduleData = res.data.map(item => {
          return {
            ...item,
            hover: false
          }
        })
      }
    },
    // 添加日程
    scheduleAdd(date) {
      if (moment(moment().format('YYYY-MM-DD')).isSameOrBefore(date)) {
        this.scheduleForm = {
          date: date,
          time: '00:00:00',
          eventname: '',
        }
        this.scheduleActType = 'ADD';
        this.scheduleVisible = true;
      }

    },
    // 编辑日程
    scheduleEdit(row) {
      this.scheduleActType = 'EDIT';
      this.scheduleForm.iuid = row.iuid
      this.scheduleForm.eventname = row.eventname
      this.scheduleForm.date = row.datestr.split(' ')[0]
      this.scheduleForm.time = row.datestr.split(' ')[1] || '00:00:00'
      this.scheduleVisible = true;
    },
    async scheduleDataSubmit() {
      this.$refs['scheduleForm'].validate(async valid => {
        if (valid) {
          let formdata = new FormData();
          if (this.scheduleActType == 'EDIT') {
            formdata.append('IUID', this.scheduleForm.iuid)
          }
          formdata.append('datestr', this.scheduleForm.date + ' ' + this.scheduleForm.time)
          formdata.append('eventname', this.scheduleForm.eventname)
          formdata.append('eventcontent', '') //this.scheduleForm.eventcontent
          let res = await articleApi.scheduleAddOrUpdate(formdata)
          if (res.code == 1) {
            this.scheduleVisible = false
            this.getScheduleData()
            this.getNoticeList()
            this.$success(res.msg)
          }
        }
      })
    },
    showApplyDialog() {
      this.loadCompanyApplyPerson()
      this.showApply = true;
    },
    // 获取申请人员
    async loadCompanyApplyPerson() {
      var res = await postApi.get("/api/WebAccount/CheckCompanyApplyPerson");
      if (res.code === 1) {
        this.applyData = res.data;
      }
    },

    scheduleDataDel(row) {
      this.$confirm('确定要删除这条待办事项吗？').then(async r => {
        let formdata = new FormData();
        formdata.append('IUID', row.iuid)
        let res = await articleApi.scheduleDelete(formdata)
        if (res.code == 1) {
          this.getScheduleData()
          this.$success(res.msg)
        }
      })
    },
    async getNoticeList() {
      let formdata = new FormData();
      formdata.append('page', 1)
      formdata.append('rows', 20)
      let res = await articleApi.noticeList(formdata)
      if (res.code == 1) {
        this.noticeList = res.data
      }
    },
    async viewDetail(row) {
      this.detailVisible = true
      this.loading = true;
      let data = {
        IUID: row.iuid
      }
      let res = await articleApi.noticeDetail(this.$objectToFormData(data))
      this.loading = false
      if (res.code == 1) {
        row.unread = 0
        this.currentNotice = res.data;
        if (this.currentNotice.createTime !== '' && !!this.currentNotice.createTime) {
          this.currentNotice.createTime = this.currentNotice.createTime.replace('T', ' ').split('.')[0]
        }
      }
    },
    async getApproveContent() {
      // 获取未处理审核数量
      var res = await postApi.post("/api/WebCompanyApply/GetMessage");
      this.msgCount = res.data.checkmes.count;
      this.applyCount = res.data.usermes.count;
    },
    toTeamwork() {
      this.$store.commit("SET_ACTIVE_TAB", 'teamwork');
      this.$router.push({
        path: '/teamwork',
      })
    },
    showClose(item) {
      item.hover = true
      this.$forceUpdate()
    },
    hideClose(item) {
      item.hover = false
      this.$forceUpdate()
    },
  }
}
</script>

<style scoped lang="scss">
.con {
  position: relative;
  border-radius: 5px;
  padding: 15px 20px 0;

  ::v-deep .wh_jiantou1 {
    border-top: 2px solid #909399;
    border-left: 2px solid #909399;
    width: 7px;
    height: 7px;
  }

  ::v-deep .wh_content_item {
    width: calc(100% / 7);

    &>.wh_isMark {
      background: transparent;
    }

    .wh_chose_day {
      background: transparent;

    }
  }

  ::v-deep .wh_jiantou2 {
    border-top: 2px solid #909399;
    border-right: 2px solid #909399;
    width: 7px;
    height: 7px;
  }

  ::v-deep .wh_item_date {
    width: 34px;
    height: 34px;
    color: #424588;
    font-weight: 900;
    -webkit-font-smoothing: antialiased;
    font-family: monospace;
    text-rendering: optimizeLegibility;
    font-size: 14px;
  }

  ::v-deep .wh_top_tag {
    color: #86D8C9;
    font-weight: 500;
  }
}
</style>

<style scoped>
.desktop-12row {
  display: grid;
  width: 100%;
  border-color: #e2e6ecea;
  background-color: #e2e6ecea;
  grid-row-gap: 0px;
  row-gap: 0px;
  grid-template-rows: 1fr 2fr;
  align-items: center;
}

.app-tools {
  display: block;
  width: 74px;
  height: 114px;
  margin: 0 20px 20px;
  padding: 5px;
  /* margin-left: 40px; */
  border-radius: 4px;
}

.app-tools:hover {
  cursor: pointer;
  background-color: rgba(64, 158, 255, .4);
  border-color: rgba(64, 158, 255, .4);
}

.events-item {
  background: #fff;
  position: relative;
  border-left: 8px solid #86D8C9;
  border-radius: 5px;
  box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.06);
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px;
}

.noticelist {
  width: 100%;
  font-size: 13px;
  margin: 12px 0;
  border-bottom: 1px solid transparent;
  padding: 0 5px;
}

.noticelist:hover {
  color: #409eff;
  border-bottom: 1px solid #409eff;
  cursor: pointer;
}

.notice-title {
  width: 210px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

}

.close-event {
  cursor: pointer;
  color: #F56C6C;
  position: absolute;
  top: -6px;
  right: -5px;
}

.events-item.approve {
  border-left: 8px solid #f96;
}

.events-item.apply {
  border-left: 8px solid #FDCA40;
}

.events-item-left {
  width: calc(100% - 76px);
}

.events-name {
  font-size: 12px;
  font-weight: 700;
  color: #222741;
  display: block;
  margin-bottom: 6px;
}

.events-date {
  font-size: 12px;
  color: #9FAAB7;
  display: inline-block;
}

.events-title {
  color: #BEC1CA;
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}

.events-tag {
  background: #86D8C9;
  border: 2px solid #FEFEFE;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  width: fit-content;
  padding: 5px 10px;
  text-align: center;
  cursor: pointer;
}

.events-tag.approve {
  padding: 5px 8px;
  background: #ff9966;
}

.events-tag.apply {
  padding: 5px 8px;
  background: #FDCA40;
}


.events-tag:hover {
  opacity: .7;
}

.appImg {
  width: 100%;
  display: block;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  height: calc(100% - 44px);
  max-height: 200px;
  min-height: 50px;
  border-bottom: 1px solid rgba(235, 238, 245, 1)
}

.chart-block {
  height: 100%;
  overflow: hidden;
  width: 50%;
  border-radius: 12px;
  position: relative;
  border: .5px solid #f2f5f7;
  display: inline-block;
  background: white;
}

.appBox {
  margin-top: 15px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 12px;
  border: .5px solid #f2f5f7;
  background-color: #fff;
  box-shadow: 0px 5px 10px 0px #ddd, 0px 5px 12px 0px #ddd;
}

.app {
  cursor: pointer;
  margin: 0 15px;
  font-weight: bold;
}

.app-icon {
  width: 44px;
  height: 44px;
  margin-bottom: 6px;
  border-radius: 6px;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
}

.app:hover .app-icon {
  box-shadow: 0px 2px 4px #1774d155;
}


.app:hover .app-title {
  color: #409eff;
}

.box-shadow {
  box-shadow: 0px 5px 10px 0px #ddd, 0px 5px 12px 0px #ddd;
}

.progressTitle {
  display: flex;
  /* border-bottom: 1px solid #d2d2d2; */
  align-items: center;
  color: black;
  font-weight: bold;
  font-size: 15px;
  font-family: '微软雅黑';
  padding: 15px;
  position: relative;
}

.progressTitle i {
  font-size: 20px;
  color: #999;
  margin-right: 5px;
}

.mapCharts {
  width: 100%;
  /* background-color: #409eff33; */
}</style>
