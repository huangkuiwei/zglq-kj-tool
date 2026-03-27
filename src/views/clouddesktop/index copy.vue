<template>
    <el-container style="height:calc(100vh - 51px)">
        <mainSideMenu />
        <el-aside style="width:calc(100vw - 60px);height:calc(100vh - 51px)" class="flex">
            <div class="flex column" style="width:calc(100vw - 400px);min-width: 900px;height:calc(100vh - 61px)">
                <div class="lround-background" :class="{ 'grow': $isOwner }">
                    <div style="margin: 20px 10px 0;">
                        <img style=" width:16px; height:16px" src="../../assets/跨界应用.svg" />
                        <span style="margin-left: 5px; font-size: 16px; font-weight: 800">{{ !$isOwner ? "跨~界" : "" }}云应用</span>
                    </div>
                    <div class="flex wrap jc-between hide-scroll" style="align-content: flex-start;padding:20px 10px 0;height:calc(100% - 40px) ;overflow-y: auto;">
                        <div class="app-purple" :style="{ height: $isOwner ? 'calc(33% - 15px)' : 'calc(50% - 15px)' }" v-for="(item, index) in appImages1" :key="index" @click="spaceRunApp(item)">
                            <img class="appImg" :src="item.image" fit="cover" />
                            <div class="flex ai-center" style="height:48px ; width: 100%;">
                                <img v-if="!$isOwner" style="width: 24px;margin: 0 5px 0 10px; " :src="item.logo" />
                                <div v-if="!$isOwner" style="flex-shrink: 0;">
                                    <span style="font-size: 14px; color: #303133"> {{ item.appName }} </span>
                                </div>
                                <div class="grow" :style="{ textAlign: !$isOwner ? 'right' : 'center' }" style="margin-right: 10px;font-size: 12px; font-weight: 800; color: #303133">
                                    {{ item.title }}
                                </div>
                            </div>
                        </div>
                        <!-- 补充flex定位 -->
                        <!-- <div class="app-purple" style="border: none;height: 0;"></div> -->
                        <!-- <div class="app-purple" style="border: none;height: 0;"></div> -->
                        <!--  -->
                    </div>
                </div>
                <div v-if="!$isOwner" class="lround-background grow">
                    <div style="display:flex; margin: 20px 10px;">
                        <img style="width:16px; height:16px" src="../../assets/应用工具.svg" />
                        <span style="margin-left: 5px; font-size: 16px; font-weight: 800">{{ "常用网站及工具" }}</span>
                        <!-- <el-button size="mini" class="el-icon-plus" style="margin-left: calc(100% - 250px)" @click="">添加</el-button> -->
                    </div>
                    <div class="flex wrap hide-scroll" style="width: 100%;height:calc(100% - 60px);overflow-y: auto;">
                        <a class="app-tools" v-for="(item, index) in $appTools" :key="index" :href="item.ref" target="_blank">
                            <img style="width: 64px; height: 64px; border: 1px solid rgba(235, 238, 245, 1)" :src="item.logo" />
                            <div style="text-align: center">
                                <span style="font-size: 12px; color: #303133"> {{ item.appName }} </span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <div class="flex column" style="width:340px;flex-shrink: 0;height:calc(100vh - 61px);overflow: hidden;">
                <div class="rround-background shrink" style="padding:15px;height: 170px;">
                    <div style="display: flex;padding-bottom: 5px;">
                        <img style="margin-top: 9px; width:16px; height:16px" src="../../assets/最新公告.svg" />
                        <span style="margin-left: 5px; margin-top: 8px; font-size: 16px; font-weight: 800">公告栏</span>
                    </div>
                    <div style="display: inline-block; margin:15px; font-size: 12px; font-weight: 300">
                        <el-link style="margin-bottom: 10px;" icon="el-icon-minus" v-for="i in noticeList" :key="i.iuid" @click="viewDetail(i)">
                            <span>{{ i.title }}</span>
                        </el-link>
                    </div>
                </div>
                <div class="rround-background grow" style="padding-bottom: 0;">
                    <div class="flex ai-center" style="padding: 15px;padding-bottom: 5px;">
                        <img style="width:16px; height:16px" src="../../assets/工作日程.svg" />
                        <span style="margin-left: 5px;margin-top: 2px;font-size: 16px; font-weight: 800">待办事项</span>
                    </div>
                    <div class="hide-scroll" style="overflow-y: auto;height: calc(100vh - 282px);">
                        <div style="margin-top:0px">
                            <WorkCalendar :sdata="ScheduleData" @scheduleAdd="scheduleAdd" @getScheduleData="getScheduleData" />
                        </div>
                        <li class="events__item approve" v-if="msgCount > 0">
                            <div class="events__item--left">
                                <span class="events__name" style="margin-bottom: 0;">{{ msgCount }}条审批待处理</span>
                            </div>
                            <span class="events__tag btn approve" @click="toTeamwork">去处理</span>
                        </li>
                        <li class="events__item apply" v-if="applyCount > 0">
                            <div class="events__item--left">
                                <span class="events__name" style="margin-bottom: 0;">{{ applyCount }}条人员申请待处理</span>
                            </div>
                            <span class="events__tag btn apply" @click="showApplyDialog">去处理</span>
                        </li>
                        <li class="events__item" v-for="(i, idx) in currentScheduleData" :key="idx" @mouseenter="showClose(i)" @mouseleave="hideClose(i)">
                            <i v-show="i.hover" @click="scheduleDataDel(i)" class="el-icon-error close-event"></i>
                            <div class="events__item--left">
                                <span class="events__name">{{ i.eventname }}</span>
                                <span class="events__date">{{ i.datestr }}</span>
                            </div>
                            <span class="events__tag" @click="scheduleEdit(i)">{{ $t('base.button.edit') }}</span>
                        </li>
                    </div>
                </div>

            </div>
        </el-aside>
        <!-- 人员申请 -->
        <person-apply :applyData="applyData" :showApply.sync="showApply" @loadCompanyApplyPerson="loadCompanyApplyPerson"></person-apply>
        <el-dialog :title="scheduleActType == 'ADD' ? $t('desktop.todolist.addTitle') : $t('desktop.todolist.editTitle')" :visible.sync="scheduleVisible" width="440px">
            <el-form :model="scheduleForm" ref="form" label-width="60px" :inline="false" size="normal">
                <el-form-item :label="$t('base.label.time')">
                    <div class="flex ai-center" style="margin-left: 0;">
                        <div style="margin-right: 10px;">{{ scheduleForm.date }}</div>
                        <el-time-picker v-model="scheduleForm.time" :default-value="scheduleForm.date + ' 09:00:00'" value-format="HH:mm:ss" size="normal" :clearable="false" placeholder="请选择时间点" />
                    </div>
                </el-form-item>
                <el-form-item label="事项">
                    <el-input style="width: 303px;" v-model="scheduleForm.eventname"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="scheduleVisible = false">{{ $t('base.button.cancel') }}</el-button>
                <el-button size="small" type="primary" @click="scheduleDataSubmit">{{ $t('base.button.submit') }}</el-button>
            </div>
        </el-dialog>
        <!-- 查看公告 -->
        <el-dialog title="公告详情" :visible.sync="detailVisible" width="800px">
            <div style="text-align: center;font-size: 18px;font-weight: 500;margin-bottom: 15px;">{{ currentNotice.title }}</div>
            <div style="text-align: right;font-size: 14px;color: #999;margin-right: 20px;margin-bottom: 20px;">{{ currentNotice.createTime }}</div>
            <div class="ql-editor" v-if="!currentNotice.isIframe" v-html="currentNotice.contenttext"></div>
            <iframe v-else style="width: 100%;height: 450px;" :src="currentNotice.contenttext" frameborder="0"></iframe>
        </el-dialog>
    </el-container>
</template>
<script>
import {
    mapGetters
} from "vuex";
import AppMain from "./";
import postApi from "@/api/document/indexApi.js";
import articleApi from "@/api/article.js";
import projectAllApi from '@/api/project/all/index'
// quill富文本
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import personApply from "@/components/Dialog/personApply.vue"
import moment from 'moment'
import WorkCalendar from "./workcalendar";
export default {
    components: {
        AppMain,
        WorkCalendar,
        personApply
    },
    computed: {
        ...mapGetters(["currApp"]),
    },
    data() {
        return {
            showApply: false,
            applyData: [],
            msgCount: 0,
            applyCount: 0,
            rows: [0, 1],
            appImages1: [
                ...this.$appList
            ],
            noticeList: [],
            ScheduleData: [],
            currentScheduleData: [],
            scheduleActType: 'ADD',
            scheduleVisible: false,
            scheduleForm: {
                date: '',
                time: '',
                eventname: '',
            },
            detailVisible: false,
            currentNotice: {},
            toolsApp: '',
            cropId: '',
        }
    },
    async mounted() {
        // space环境显示演示项目需要清除projectInfo
        if (this.$isSpace) {
            localStorage.setItem('projectInfo', '')
        } else {
            this.queryMyDocument()
        }
        let corpRes = await postApi.get('/api/WebAccount/BaseInfo')
        if (corpRes.code == 1) {
            this.cropId = corpRes.data.corpCode
        }

        this.getApproveContent()
        this.getNoticeList()
        this.getScheduleData()
        let formdata = new FormData();
        formdata.append('datestr', '')
        let res = await articleApi.scheduleList(formdata)
        if (res.code == 1) {
            this.currentScheduleData = res.data.map(item => {
                return {
                    ...item,
                    hover: false
                }
            })
        }
    },
    methods: {

        // 个人日程
        async getScheduleData(day) {
            let formdata = new FormData();
            formdata.append('datestr', day ? day : moment().format('YYYY-MM'))
            let res = await articleApi.scheduleList(formdata)
            if (res.code == 1) {

                this.ScheduleData = res.data.map(item => {
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
                    time: '',
                    eventname: '',
                }
                this.scheduleActType = 'ADD';
                this.scheduleVisible = true;
            }

        },
        // 编辑日程
        scheduleEdit(row) {
            this.scheduleActType = 'EDIT';
            this.scheduleForm = JSON.parse(JSON.stringify(row))
            this.scheduleForm.date = this.scheduleForm.datestr.split(' ')[0]
            this.scheduleForm.time = this.scheduleForm.datestr.split(' ')[1]
            this.scheduleVisible = true;
        },
        async scheduleDataSubmit() {
            let formdata = new FormData();
            if (this.scheduleActType == 'EDIT') {
                formdata.append('IUID', this.scheduleForm.iuid)
            }
            formdata.append('datestr', this.scheduleForm.date + ' ' + this.scheduleForm.time)
            formdata.append('eventname', this.scheduleForm.eventname)
            formdata.append('eventcontent', '') //this.scheduleForm.eventcontent
            let res = await articleApi.scheduleAddOrUpdate(formdata)
            if (res.code == 1) {
                this.$success(res.msg)
                this.scheduleVisible = false
                this.getScheduleData()
            }
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
            formdata.append('rows', 4)
            let res = await articleApi.noticeList(formdata)
            if (res.code == 1) {
                this.noticeList = res.data
            }
        },
        viewDetail(row) {
            this.currentNotice = row;
            // this.currentNotice.isIframe = JSON.parse(row.isIframe)
            this.$nextTick(r => {
                this.detailVisible = true
            })
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
        async queryMyDocument() {
            // var postData = new FormData()
            // var token = local.getToken();
            var projectId = "";
            var projectName = "";
            // postData.append('userInfoToken', token);
            var res = await projectAllApi.queryMyDocument();
            if (res.code == 1) { // 切换到“文档资料”
                projectId = res.data[0].iuid;
                projectName = res.data[0].projectName; // "文档资料"
                localStorage.setItem('projectInfo', JSON.stringify(res.data[0]))
            }
        },
        async spaceRunApp(item) {
            // if (this.$isSpace) {
            //     let useable = false
            //     let res = await postApi.post('/api/WebAccount/GetAppliedAuthCorp')
            //     if (res.code == 1) {
            //         let whiteList = res.data.map(item=>item.corpCode)
            //         if (whiteList.indexOf(this.cropId) > -1) {
            //             useable = true
            //         }
            //         if (item.appName != 'BIM Windows' && !useable) {
            //             this.$warning('暂不开放试用，有需要请与销售联系')
            //         } else {
            //             this.runApp(item)
            //         }
            //     }
            // } else {
            this.runApp(item)
            // }
        },
        runApp(item) {
            var bimIframe = JSON.parse(localStorage.getItem(item.appName));
            if (bimIframe) {
                this.$confirm(`${item.appName}` + "已打开，是否打开新的工作台？").then(({ value }) => {
                    this.openApp(item)
                })
            } else {
                this.openApp(item)
            }
        },
        openApp(item) {
            this.$openItwinApp({
                appName: this.$isOwner ? item.title : item.appName,
                appType: item.type,
                selectFile: true,   //模型内是否打开文件选择
                appImage: item.start,
                appLogo: item.logo,
                projectIuid:'',
            }, null, true);
        },
        runToolsApp(item) { }

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
<style>
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

.events__item {
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

.close-event {
    cursor: pointer;
    color: #F56C6C;
    position: absolute;
    top: -6px;
    right: -5px;
}

.events__item.approve {
    border-left: 8px solid #f96;
}

.events__item.apply {
    border-left: 8px solid #FDCA40;
}

.events__item--left {
    width: calc(100% - 76px);
}

.events__name {
    font-size: 12px;
    font-weight: 700;
    color: #222741;
    display: block;
    margin-bottom: 6px;
}

.events__date {
    font-size: 12px;
    color: #9FAAB7;
    display: inline-block;
}

.events__title {
    color: #BEC1CA;
    display: inline-block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
}

.events__tag {
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

.events__tag.approve {
    padding: 5px 8px;
    background: #ff9966;
}

.events__tag.apply {
    padding: 5px 8px;
    background: #FDCA40;
}


.events__tag:hover {
    opacity: .7;
}

.events__tag--highlighted {
    background: #FDCA40;
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
</style>
