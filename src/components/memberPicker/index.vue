<!-- 选择企业人员 -->

<template>
  <el-dialog
    :title="dialogTitle"
    append-to-body
    top="10vh"
    :visible.sync="dialogVisible"
    :before-close="close"
    width="840px"
  >
    <div
      class="flex"
      style="height: 500px;"
    >
      <!-- 待选人员 -->
      <div class="left-area">
        <el-input
          v-model="userName"
          style="width:calc(100% - 20px)"
          placeholder="请输入人员姓名"
          size="small"
          suffix-icon="el-icon-search"
          clearable
          @change="handleChange"
        />
        <div
          v-if="false"
          class="flex ai-center jc-center"
          style="margin: 10px 0;"
        >
          <el-button
            type="primary"
            size="mini"
            disabled
            plain
            @click="checkType = 'dept'"
          >
            按架构选
          </el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            @click="checkType = 'member'"
          >
            按成员选
          </el-button>
        </div>
        <div
          v-if="checkType == 'member'"
          v-loading="loading"
          class="member-list"
        >
          <div
            v-for="i in memberListData"
            class="flex ai-center member"
            :class="(i.disabled || (isMultiple && checkListData.length > 0)) ? 'noPoint' : ''"
            @click="handleCheck(i, ...arguments)"
          >
            <div
              class="mycheckbox"
              :class="{ disabled: i.disabled || (isMultiple && checkListData.length > 0), active: i.checked }"
            >
              <img
                v-if="i.checked"
                style="width: 10px;margin: 1px 0 0 1px;display: block;"
                src="../../assets/iconImg/check.svg"
              >
            </div>
            <img
              v-if="i.disabled || (isMultiple && checkListData.length > 0)"
              class="noPoint"
            >
            <img
              :src="!!i.ddUserAvatar ? imageUrl + encodeURIComponent(i.ddUserAvatar) : require('../../assets/robot.svg')"
              class="member-avatar"
              alt=""
            >
            <span>{{ i.userName }}</span>
          </div>
        </div>
        <div
          v-if="checkType == 'dept'"
          class="member-list"
        >
          <div class="flex ai-center jc-between">
            <el-button
              type="text"
              icon="el-icon-arrow-left"
              @click="handelPrevLevel"
            />
            <span>{{ currentLevel.name }}</span>
            <span />
          </div>
          <el-checkbox-group
            v-model="checkList"
            size="normal"
          >
            <el-checkbox
              v-for="item in memberList"
              :key="item.id"
              class="member-item"
              :label="item"
            >
              <div
                class="flex ai-center"
                style="width: 100%;"
              >
                <i class="el-icon-share" />
                <span>
                  {{ item.name }}{{ item.usercount ? '(' + item.usercount + ')' : '' }}
                </span>
                <el-button
                  v-if="item.type != 2"
                  type="text"
                  style="margin-left: auto;"
                  @click="handleNextLevel(item)"
                >
                  下级
                </el-button>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <!-- 已选人员 -->
      <div style="padding:0 20px;">
        <div>已选择{{ checkListData.length }}人</div>
        <div class="check-list flex ai-center wrap">
          <div
            v-for="(item, idx) in checkListData"
            :key="item.userID"
          >
            <div class="flex ai-center check-item">
              <img
                src="../../assets/robot.svg"
                style="width: 24px;height: 24px;margin-right: 3px;"
                alt=""
              >
              <span>{{ item.userName }}</span>
              <el-button
                type="text"
                size="small"
                icon="el-icon-close"
                style="margin:0 3px;"
                @click="remove(item, idx)"
              />
            </div>
          </div>
        </div>
        <div style="margin-top: 20px;">
          <el-button
            size="small"
            @click="close"
          >
            {{ $t('base.button.cancel') }}
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="$emit('submit', checkListData)"
          >
            {{ $t('base.button.confirm') }}
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "MemberPicker",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: '选择成员'
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    memberList: {
      type: Array,
      default: () => []
    },
    checkList: {
      type: Array,
      default: () => []
    },
    cancelCheck: {
      type: Function
    },
    queryMember: {
      type: Function
    },
    submit: {
      type: Function
    }
  },
  data() {
    return {
      userName: '',
      visible: false,
      checkListData: [],
      memberListData: [],
      checkType: 'member',
      loading: true,
      currentLevel: {},
      prevLevel: {},
      imageUrl: process.env.VUE_APP_BASE_API + "/api/home/GetimgFile?fileUrl="
    };
  },
  watch: {
    memberList(val) {
      this.memberListData = this.memberList.map(item => {
        return {
          ...item,
          checked: this.checkListData.map(i => i.userID).includes(item.userID)
        }
      })
      this.loading = false
      this.$forceUpdate()
    },
    dialogVisible(val) {
      if (val) {
        this.checkListData = this.checkList
        this.memberListData = this.memberList.map(item => {
          return {
            ...item,
            checked: this.checkListData.map(i => i.userID).includes(item.userID)
          }
        })
        this.loading = false
        this.$forceUpdate()
      } else if (!val) {
        this.userName = ''
        this.checkListData = []
        this.memberListData = []
      }
    }
  },
  methods: {
    handleChange(e) {
      this.loading = true;
      this.$emit('queryMember', e)
    },
    handleCheck(item, e) {
      if (item.disabled || (this.isMultiple && this.checkListData.length > 0)) {
        return
      } else {
        const index = this.checkListData.findIndex(i => i.userID === item.userID)
        if (item.checked) {
          this.checkListData.splice(index, 1)
        } else {
          this.checkListData.push(item)
        }
        if (e.target.nodeName != 'INPUT') {
          item.checked = !item.checked
        }
        this.$forceUpdate()
      }
    },
    remove(item, idx) {
      const index = this.memberListData.findIndex(i => i.userID === item.userID)
      if (index > -1) {
        this.memberListData[index].checked = false
      }
      this.$emit('cancelCheck', idx)
    },
    handelPrevLevel() {
    },
    handleNextLevel(item) {
    },
    close() {
      this.$emit('update:dialogVisible', false)
    },
  }
}

</script>

<style lang="scss" scoped>
.left-area {
  width: 40%;
  border-right: 1px solid #dedede;
  flex-shrink: 0;
}

.member-list {
  padding: 10px 0;
  height: 410px;
  overflow-y: auto;

  .member {
    height: 40px;
    padding: 0 10px;
    cursor: pointer;
    margin-bottom: 5px;

    &:hover {
      background-color: #f5f7fa;
    }

    &.noPoint {
      cursor: not-allowed
    }

    .mycheckbox {
      display: inline-block;
      position: relative;
      border: 1px solid #DCDFE6;
      border-radius: 2px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 14px;
      height: 14px;
      background-color: #FFF;
      z-index: 1;
      user-select: none;

      &:hover {
        border-color: #409EFF;
      }

      &.active {
        border-color: #409EFF;
      }

      &.disabled {
        background-color: #F5F7FA;
        border-color: #DCDFE6;
      }

    }

    .member-avatar {
      width: 30px;
      height: 30px;
      border-radius: 5px;
      margin-left: 10px;
      margin-right: 5px;
    }
  }
}

.check-item {
  background-color: #e5ebf6;
  padding: 2px;
  margin: 10px;
  border-radius: 5px;
  margin-left: 0;
  margin-bottom: 0;
}
</style>
