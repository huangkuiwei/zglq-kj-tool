<template>
  <div class="con">
    <div class="now-data-myself">
      <div class="now-data-myself-time">{{ today }}</div>
      <div class="now-data-myself-week">{{ week }}</div>
    </div>
    <Calendar ref="Calendar" :textTop="weekArr" :agoDayHide="agoDayHide" :markDate="markDate" v-on:choseDay="clickDay" v-on:changeMonth="changeDate" v-on:isToday="clickToday"></Calendar>
  </div>
</template>

<script>
/* eslint-disable */
import Calendar from 'vue-calendar-component';
import moment from 'moment'

export default {
  name: 'workcalendar',
  components: {
    Calendar
  },
  props: ['scheduleAdd', 'getScheduleData', 'sdata', 'date'],
  data() {
    return {
      today: "",
      agoDayHide: moment().subtract(1, 'days').format('X'),
    };
  },
  computed: {
    markDate() {
      let arr = []
      if (this.sdata) {
        arr = this.sdata.map(item => item.datestr.split(' ')[0])
      }
      return arr
    },
    weekArr() {
      return new Array(this.$t('base.weekSort.day1'), this.$t('base.weekSort.day2'), this.$t('base.weekSort.day3'), this.$t('base.weekSort.day4'), this.$t('base.weekSort.day5'), this.$t('base.weekSort.day6'), this.$t('base.weekSort.day7'))
    },
    week() {
      var now = new Date();
      let arr = new Array(this.$t('base.week.day1'), this.$t('base.week.day2'), this.$t('base.week.day3'), this.$t('base.week.day4'), this.$t('base.week.day5'), this.$t('base.week.day6'), this.$t('base.week.day7'))
      return arr[now.getDay() - 1]
    },
  },
  mounted() {
    var now = new Date();
    this.today = now.getDate(); //得到日期
  },
  methods: {
    clickDay(data) {
      let day = moment(data).format('YYYY-MM-DD');
      this.$emit('scheduleAdd', day)
    },
    changeDate(data) {
      this.$emit('update:date', moment(data).format('YYYY-MM'))
      this.$emit('getScheduleData')
    },
    clickToday() { }
  },
};
</script>

<style>
.now-data-myself {
  width: 31%;
  position: absolute;
  border-right: 1px solid rgba(227, 227, 227, 0.6);
}

.con .wh_content_all {
  background: transparent !important;
}

.wh_top_changge li {
  color: #F56C6C !important;
  font-size: 15px !important;
}

.wh_content_item,
.wh_content_item_tag {
  color: #303133 !important;
}

.wh_content_item .wh_isToday {
  background: #00d9865e !important;
  color: #fff !important;
}

.wh_item_date:hover {
  background: rgb(217, 236, 255) !important;
  border-radius: 100px !important;
  color: rgb(102, 177, 255) !important;
}

.wh_top_tag[data-v-2ebcbc83] {
  color: #409EFF;
  border-top: 1px solid rgba(227, 227, 227, 0.6);
  border-bottom: 1px solid rgba(227, 227, 227, 0.6);
}

.wh_container[data-v-2ebcbc83] {
  max-width: 280px;
}

.wh_top_changge[data-v-2ebcbc83] {
  display: flex;
  width: 60%;
  margin-left: 38%;
}

.now-data-myself-time {
  color: #F56C6C;
  font-size: 24px;
  height: 30px;
  font-family: "Helvetica Neue";
  text-align: center;
}

.now-data-myself-week {
  font-size: 10px;
  color: #909399;
  text-align: center;
}

.wh_top_changge .wh_content_li[data-v-2ebcbc83] {
  font-family: Helvetica;
}

.wh_isMark::after {
  content: '';
  width: 4px;
  height: 4px;
  background-color: #86D8C9;
  border-radius: 50%;
  position: absolute;
  bottom: 4px;
  left: 18px;
}
</style>
