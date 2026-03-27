<!--  -->
<template>
  <div class="container">
    <div class="left">
      <div class="top">
        <el-select remote :remote-method="searchUser" filterable v-model="searchText" placeholder="搜索用户" size="default" @change="createChat" clearable style="width: 100%;">
          <template slot="prefix">
            <span style="padding-left: 5px;">
              <i class="el-icon-search"></i>
            </span>
          </template>
          <el-option v-for="user in searchResult" :key="user.iuid" :label="user.userName" :value="user.userID"></el-option>
        </el-select>
      </div>
      <div class="people hide-scroll">
        <div class="person flex ai-center" :class="{ 'active': item.act }" v-for="(item, idx) in userMsgList" :key="item.iuid" @click="showDetail(item)">
          <img :src="getUserAvatar(item.receiverAvatar)" alt="" />
          <div class="flex column jc-between" style="width: calc(100% - 50px);">
            <div>
              <span class="name">{{ item.receiverName }}</span>
              <span class="time">{{ timeFormat(item.latelytime) }}</span>
            </div>
            <span class="preview">{{ item.latelymes ? item.latelymes : '没有消息' }}</span>
          </div>
          <el-badge :value="item.isreadcount" :max="99" :is-dot="false" v-if="item.isreadcount != 0" class="badge" type="danger"></el-badge>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top flex jc-between ai-center">
        <span class="name">{{ current.userName }}</span>
        <el-button type="text" style="color: #999;font-size: 20px;" icon="el-icon-close" @click="$emit('close')"></el-button>
      </div>
      <div class="chat active-chat hide-scroll" ref="chatbox">
        <div style="margin: 20px 0;text-align: center;width: 100%;color: #999;font-size: 14px;" v-if="current.msgList.length == 0">暂无消息</div>
        <div class="bubble" v-for="item in current.msgList" :key="item.iuid" :class="item.initiator == user.userID ? 'me' : 'you'">
          <div class="chat-time">{{ timeFormat(item.initiatortime) }}</div>
          <span style="white-space: pre-wrap;">{{ item.message }}</span>
        </div>
        <div style="cursor: pointer;margin: 20px 0;text-align: center;width: 100%;color: #409eff;font-size: 14px;" v-if="current.msgList.length != 0 && current.msgList.length < count" @click="getPrevMsg">加载历史消息</div>
      </div>
      <div class="write flex ai-end">
        <el-input type="textarea" style="height: 100%;" ref="textarea" resize="none" rows="5" v-model="sendText" @keydown.native="keyEnter" :placeholder="current.userID ? '输入消息' : '请选择用户'" size="normal"></el-input>
        <el-button type="text" v-if="current.userID && sendText != ''" size="default" @click.stop="send" style="margin-right: 15px;color: #409eff;">发送</el-button>
      </div>
    </div>
  </div>
</template>


<script>
import chatApi from "@/api/chat.js";
import { encrypt } from "@/utils/index";
import moment from 'moment';
import local from "@/utils/auth";

moment.locale('zh-cn');
moment.relativeTimeThreshold('ss', 10); //几秒前
moment.relativeTimeThreshold('s', 59);  //s秒前
moment.relativeTimeThreshold('m', 59);  //s分钟前
moment.relativeTimeThreshold('h', 23);
moment.relativeTimeThreshold('d', 30);
moment.relativeTimeThreshold('M', 12);
import {
  mapGetters
} from "vuex";

export default {
  name: "chatBox",
  props: ['close'],
  data() {
    return {
      searchText: '',
      signalrmes: {},
      sendText: '',
      count: 0,
      userMsgList: [],
      searchResult: [],
      current: {
        userName: '',
        userID: '',
        msgList: [],
      },
      detail: [],
    };
  },
  watch: {
    'current.msgList'(val) {
      console.log(val);
    }
  },
  computed: {
    ...mapGetters(["user"]),
  },
  created() {
    this.signalr.off("acceptchatAsync");
    this.signalr.off("beonlinechatAsync");
    this.signalr.on("beonlinechatAsync", (res) => {

    })
    this.signalr.on("acceptchatAsync", (res) => {
      if (res.initiator == this.current.userID) {
        if (res.initiator) {
          this.current.msgList.unshift({
            initiator: res.initiator,
            initiatortime: res.receivertime,
            message: res.message,
            iuid: moment().format('x'),
            receiver: this.user.userID
          })
        }
      }
      this.getChatList('refresh')
    });
  },
  mounted() {
    this.getChatList()
  },
  destroyed() {
    this.signalr.off('beonlinechatAsync')
  },
  methods: {
    timeFormat(e) {
      if (e) {
        let format = '';
        if (moment(e).isBefore(new Date(), 'year')) {
          format = 'YYYY-MM-DD HH:mm'
        } else if (moment(e).isBefore(new Date(), 'month')) {
          format = 'MM-DD HH:mm'
        } else if (moment(e).isBefore(new Date(), 'day')) {
          format = 'MM-DD HH:mm'
        } else if (moment(e).isSame(new Date(), 'day')) {
          format = 'HH:mm'
        }
        return moment(e).format(format)
      }
    },
    // 获取头像
    getUserAvatar(avatar) {
      let avatarImg = avatar ? process.env.BASE_API + '/api/home/GetimgFile?fileUrl=' + encodeURIComponent(encrypt(avatar)) : require('../../assets/robot.svg')
      return avatarImg
    },
    // 获取聊天列表
    async getChatList(type) {
      let res = await chatApi.getDialogue();
      if (res.code == 1) {
        this.userMsgList = res.data
        this.setSearchResult()
        if (type != 'refresh') {
          this.showDetail(res.data[0])
        } else {
          this.userMsgList.filter(item => item.receiver == this.current.userID)[0].act = true
        }
        this.readMsg()
        this.userMsgList.filter(item => item.receiver == this.current.userID)[0].isreadcount = 0
      }
    },
    // 创建聊天
    async createChat(e) {
      let formdata = new FormData()
      formdata.append('receiver', e)
      let res = await chatApi.setupDialogue(formdata)
      if (res.code == 1) {
        this.searchText = ''
        this.getChatList()
      }
    },
    // 查询用户
    async searchUser(e) {
      if (e != '') {
        let formdata = new FormData()
        formdata.append('UserName', e)
        let res = await chatApi.getUserData(formdata)
        if (res.code == 1) this.searchResult = res.data
      }
    },
    setSearchResult() {
      this.searchResult = this.userMsgList.map(item => {
        return {
          iuid: item.iuid,
          userName: item.receiverName,
          userID: item.receiver
        }
      })
    },
    async showDetail(i, type) {

      this.current.msgList = []
      this.current.userName = i.receiverName
      this.current.userID = i.receiver

      if (type != 'refresh') {
        this.userMsgList.forEach(item => {
          item.act = false;
        })
        this.userMsgList.filter(item => item.receiver == this.current.userID)[0].act = true
      }

      this.readMsg()
      this.getDialogueData()
    },
    getPrevMsg() {
      this.getDialogueData(this.current.msgList[this.current.msgList.length - 1].iuid)
    },
    async getDialogueData(iuid) {
      let formdata = new FormData()
      formdata.append('receiver', this.current.userID)
      if (!!iuid) {
        formdata.append('iuid', iuid)
      }
      formdata.append('rows', iuid ? 7 : 14)
      let res = await chatApi.getDialogueData(formdata)
      if (res.code == 1) {
        this.count = res.count
        if (!!iuid) {
          res.data.forEach(item => {
            this.current.msgList.push(item)
          })
        } else {
          this.current.msgList = res.data
          this.$nextTick(() => {
            this.$refs['chatbox'].scrollTop = 0
          })
        }
      }

    },
    // 消息已读
    async readMsg() {
      let formdata1 = new FormData()
      formdata1.append('receiver', this.current.userID)
      let res = await chatApi.getFetchDialogue(formdata1)
      if (res.code == 1) {
        this.userMsgList.filter(item => item.receiver == this.current.userID)[0].isreadcount = 0
      }
    },
    // 发送消息
    keyEnter(e) {
      console.log(1);
      let oEvent = e || event
      if (oEvent.ctrlKey && oEvent.keyCode === 13) {
        this.sendText = this.sendText + '\n'
      }
      if (oEvent.ctrlKey === false && oEvent.keyCode === 13) {
        oEvent.preventDefault()
        this.send()
      }
    },
    send() {
      if (this.sendText.replace(/\n/g, '') != '') {
        if (this.current.userID) {
          this.signalrmes.UserID = this.current.userID;
          this.signalrmes.message = this.sendText;
          this.signalr.invoke("beonlinechatAsync", local.getToken(), this.signalrmes).then(() => {
            this.current.msgList.unshift({
              initiator: this.user.userID,
              initiatortime: moment(),
              iuid: moment().format('x'),
              message: this.sendText,
              receiver: this.current.userID,
            })
            this.sendText = ''
            this.$nextTick(() => {
              this.$refs['chatbox'].scrollTop = 0
            })
            this.getChatList('refresh')
          })
        }
      }
    }
  }
}

</script>
<style lang="scss" scoped>
$white: #fff;
$black: #000;
$bg: #f8f8f8;
$grey: #999;
$dark: #1a1a1a;
$light: #e6e6e6;
$wrapper: 1000px;
$blue: #409eff;

.container {
  position: fixed;
  right: 100px;
  left: 0;
  top: 50px;
  bottom: 0;
  opacity: 0;
  width: 0;
  height: 0;
  margin: auto;
  background-color: $white;
  overflow: hidden;
  -webkit-animation-name: openDialog;
  animation-name: openDialog;
  -webkit-animation-duration: .3s;
  animation-duration: .3s;
  animation-fill-mode: forwards;

  .left {
    float: left;
    width: 37.6%;
    height: 100%;
    border: 1px solid $light;
    background-color: $white;

    .top {
      position: relative;
      width: 100%;
      height: 66px;
      padding: 15px 30px;

      &:after {
        position: absolute;
        bottom: 0;
        left: 50%;
        display: block;
        width: 80%;
        height: 1px;
        content: "";
        background-color: $light;
        transform: translate(-50%, 0);
      }
    }

    ::v-deep() input {
      width: 100%;
      height: 32px;
      padding: 0 15px 0 30px;
      border: 1px solid $light;
      background-color: #f5f7fa;
      border-radius: 21px;
      font-weight: 400;
    }

    .people {
      line-height: 1.5;
      padding-left: 15px;
      padding-right: 10px;
      height: calc(75vh - 76px);
      overflow: hidden;
      overflow-y: auto;

      .person {
        position: relative;
        border-radius: 6px;
        margin-bottom: 2px;
        padding: 12px 10px 10px;
        cursor: pointer;
        background-color: $white;

        img {
          float: left;
          width: 40px;
          height: 40px;
          margin-right: 12px;
          border-radius: 50%;
          -o-object-fit: cover;
          object-fit: cover;
        }

        .name {
          font-size: 14px;
          line-height: 22px;
          color: $dark;
          font-weight: 600;
        }

        .time {
          font-size: 14px;
          position: absolute;
          top: 12px;
          right: 10%;
          color: $grey;
          background-color: $white;
          clear: both;
        }

        .preview {
          font-size: 12px;
          display: inline-block;
          overflow: hidden !important;
          width: 80%;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: $grey;
        }

        &:after {
          position: absolute;
          bottom: 0;
          left: 50%;
          display: block;
          width: 80%;
          height: 1px;
          content: "";
          background-color: $light;
          transform: translate(-50%, 0);
        }

        .badge {
          position: absolute;
          right: 25px;
          bottom: 5px;

          .el-badge__content {
            border: 0 none;
          }
        }

        &:hover,
        &.active {
          padding-top: 12px;
          border: 0;
          background-color: $blue;

          span {
            color: $light;
            background: transparent;
          }

          &:after {
            color: $light;
            background: transparent;
          }
        }
      }
    }

  }

  .right {
    position: relative;
    line-height: 1.5;
    float: left;
    width: 62.4%;
    height: 100%;

    .top {
      width: 100%;
      height: 50px;
      line-height: 50px;
      padding: 15px 15px 15px 30px;
      background-color: #f5f7fa;

      span {
        &.name {
          color: $black;
          font-weight: 600;
        }
      }



    }

    .chat {
      position: relative;
      overflow-y: scroll;
      overflow-x: hidden;
      padding: 0 25px;
      border-width: 1px 0px 1px 0;
      border-style: solid;
      border-color: $light;
      height: calc(75vh - 220px);
      display: flex;
      flex-direction: column-reverse;

      &.active-chat .bubble {
        transition-timing-function: cubic-bezier(0.4, -0.04, 1, 1);

        &:nth-of-type(6) {
          -webkit-animation-duration: 0.15s;
          animation-duration: 0.15s;
        }

        &:nth-of-type(5) {
          -webkit-animation-duration: 0.3s;
          animation-duration: 0.3s;
        }

        &:nth-of-type(4) {
          -webkit-animation-duration: 0.45s;
          animation-duration: 0.45s;
        }

        &:nth-of-type(3) {
          -webkit-animation-duration: 0.6s;
          animation-duration: 0.6s;
        }

        &:nth-of-type(2) {
          -webkit-animation-duration: 0.75s;
          animation-duration: 0.75s;
        }

        &:nth-of-type(1) {
          -webkit-animation-duration: 0.9s;
          animation-duration: 0.9s;
        }
      }
    }

    .write {
      position: absolute;
      bottom: 14px;
      left: 14px;
      height: 142px;
      padding-left: 8px;
      border: 1px solid $light;
      background-color: #fbfbfb;
      width: calc(100% - 28px);
      border-radius: 5px;

      ::v-deep() textarea {
        font-size: 16px;
        float: left;
        width: calc(100% - 10px);
        height: 100%;
        padding: 10px;
        color: $dark;
        border: 0;
        outline: none;
        background-color: transparent;
        font-weight: 400;
      }

      .write-link {
        &.attach {
          &:before {
            display: inline-block;
            width: 20px;
            height: 42px;
            content: "";
            background-image: url("https://www.jq22.com/tp/6376164890811955399970741.png");
            background-repeat: no-repeat;
            background-position: center;
          }
        }

        &.smiley:before {
          display: inline-block;
          width: 20px;
          height: 42px;
          content: "";
          background-image: url("https://www.jq22.com/tp/6376164894340082397158331.png");
          background-repeat: no-repeat;
          background-position: center;
        }

        &.send:before {
          display: inline-block;
          width: 20px;
          height: 42px;
          margin-left: 11px;
          content: "";
          background-image: url("https://www.jq22.com/tp/6376164898351016376770672.png");
          background-repeat: no-repeat;
          background-position: center;
        }
      }
    }

    .bubble {
      font-size: 16px;
      position: relative;
      display: inline-block;
      clear: both;
      max-width: 90%;
      min-width: 40px;
      margin-top: 18px;
      margin-bottom: 8px;
      padding: 10px 14px;
      vertical-align: top;
      border-radius: 5px;

      &:before {
        position: absolute;
        top: 19px;
        display: block;
        width: 8px;
        height: 6px;
        content: "";
        transform: rotate(29deg) skew(-35deg);
      }

      .chat-time {
        width: 100px;
        position: absolute;
        top: -18px;
        font-size: 12px;
        min-width: 60px;
        color: #999;
      }

      &.you {
        float: left;
        color: $light;
        background-color: $blue;
        align-self: flex-start;
        -webkit-animation-name: slideFromLeft;
        animation-name: slideFromLeft;

        .chat-time {
          left: 0;
        }

        &:before {
          left: -3px;
          background-color: $blue;
        }
      }

      &.me {
        float: right;
        color: $dark;
        background-color: #eceff1;
        align-self: flex-end;
        -webkit-animation-name: slideFromRight;
        animation-name: slideFromRight;

        .chat-time {
          right: 0;
          text-align: right;
        }

        &:before {
          right: -3px;
          background-color: #eceff1;
        }
      }
    }

    .conversation-start {
      position: relative;
      width: 100%;
      margin-bottom: 27px;
      text-align: center;

      span {
        font-size: 14px;
        display: inline-block;
        color: $grey;

        &:before,
        &:after {
          position: absolute;
          top: 10px;
          display: inline-block;
          width: 30%;
          height: 1px;
          content: "";
          background-color: $light;
        }

        &:before {
          left: 0;
        }

        &:after {
          right: 0;
        }
      }
    }
  }
}

.avatarImage {
  float: left;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}


@keyframes openDialog {
  0% {
    right: 100px;
    top: 50px;
    left: 0;
    bottom: 0;

    opacity: 0;
    width: 0;
    height: 0;
    margin: auto;
  }

  100% {
    right: 0;
    left: 0;
    top: 50px;
    bottom: 0;

    opacity: 1;
    width: 800px;
    height: 75vh;
    margin: auto;
  }
}

@-webkit-keyframes openDialog {
  0% {
    right: 100px;
    top: 50px;
    left: 0;
    bottom: 0;

    opacity: 0;
    width: 0;
    height: 0;
    margin: auto;
  }

  100% {
    right: 0;
    left: 0;
    top: 50px;
    bottom: 0;

    opacity: 1;
    width: 800px;
    height: 75vh;
    margin: auto;
  }
}

@keyframes slideFromLeft {
  0% {
    margin-left: -200px;
    opacity: 0;
  }

  100% {
    margin-left: 0;
    opacity: 1;
  }
}

@keyframes slideFromLeft {
  0% {
    margin-left: -200px;
    opacity: 0;
  }

  100% {
    margin-left: 0;
    opacity: 1;
  }
}

@keyframes slideFromRight {
  0% {
    margin-right: -200px;
    opacity: 0;
  }

  100% {
    margin-right: 0;
    opacity: 1;
  }
}

@-webkit-keyframes slideFromRight {
  0% {
    margin-right: -200px;
    opacity: 0;
  }

  100% {
    margin-right: 0;
    opacity: 1;
  }
}
</style>
