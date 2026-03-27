<template>
  <div class="conCenter">
    <div class="top" style="margin-bottom: 2px;">
      <div class="numNorwap">{{ scope.fileName }}</div>
    </div>
    <div class="top flex">
      <div class="status" v-if="tabId != 3">
        <!-- <div v-if="
        $modelFileSuffix.indexOf(scope.fileSuffix) > -1 || $otherVideoFileSuffix.indexOf(scope.fileSuffix) > -1
        || ($pptFileSuffix.indexOf(scope.fileSuffix) > -1 && !$pptFileSizeToLarge(scope.fileSize))
      "> -->
        <div v-if="$modelFileSuffix.indexOf(scope.fileSuffix) > -1 || $otherVideoFileSuffix.indexOf(scope.fileSuffix) > -1
          || ($pptFileSuffix.indexOf(scope.fileSuffix) > -1 && $pptFileSizeToLarge(scope.fileSize))
          ">
          <div v-if="scope.statusType != '0'">
            <div class="statusWait" v-if="scope.statusType === '0' || scope.statusType === '1' || scope.statusType === '2'">正在发布...</div>
            <div class="statusFinsh" v-if="scope.statusType === '3'">已发布</div>
            <div class="statusError" v-if="scope.statusType === '4'" style="">发布失败</div>
          </div>
          <div v-else>
            <div class="statusError" v-if="scope.actionType === '0'">上传失败</div>
            <div class="statusWait" v-if="scope.actionType === '1'">上传中</div>
            <div class="statusWait" v-if="scope.actionType === '2'">已上传</div>
          </div>
        </div>
        <div v-else>
          <div class="statusError" v-if="scope.actionType === '0'">上传失败</div>
          <div class="statusWait" v-if="scope.actionType === '1'">上传中</div>
          <div class="statusFinsh" v-if="scope.actionType === '2'">已上传</div>
        </div>
      </div>
      <div class="status">
        <div class="statusError" v-if="scope.shareText === '已过期'">已过期</div>
        <div class="statusFinsh" v-if="scope.shareText === '正常'">正常</div>
      </div>
      <div style="margin-left: 5px;">
        <i class="iconfont icon-shoucang" style="color:#FFE039" v-if="scope.collectbit == true && tabId != 3"></i>
        <i class="iconfont icon-shoucang" style="color:#FFE039" v-if="tabId == 1"></i>
      </div>
      <div class="bottom" v-if="tabId == 3">{{ scope.shareTime }}</div>
      <div class="bottom" v-else>{{ scope.createTime }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    scope: {
      type: Object,
      default: null
    },
    tabId: {
      type: Number
    }
  },
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {

  }
};
</script>

<style scoped>
.conCenter {
  margin-left: 14px;
}

.conCenter .top {
  font-size: 16px;
  color: #303133;
  line-height: 22px;
}

.conCenter .bottom {
  font-size: 14px;
  color: #C0C4CC;
  line-height: 19px;
  margin-left: 4px;
}
/* 文件状态 */
.status {
  /* margin-right: 0.06rem; */
  white-space: nowrap;
  font-size: 12px;
}

.statusWait {
  background: #f5f7fa;
  color: #409eff;
  padding: 0 4px;
}

.statusFinsh {
  background: #f5f5f5;
  color: #606266;
  padding: 0 4px;
}

.statusError {
  background: #fbf3f3;
  color: #f56c6c;
  padding: 0 4px;
}
</style>