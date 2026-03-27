<template>
  <div class="flex ai-center">
    <template v-if="$modelFileSuffix.concat($modelFileSuffix3).indexOf(scope.row.fileSuffix.toLowerCase()) > -1 || $otherVideoFileSuffix.indexOf(scope.row.fileSuffix.toLowerCase()) > -1
      || ($pptFileSuffix.indexOf(scope.row.fileSuffix.toLowerCase()) > -1 && $pptFileSizeToLarge(scope.row.fileSize))
      ">
      <template v-if="scope.row.statusType != '0'">
        <el-link :underline="false" type="warning" v-if="scope.row.statusType === '-1'">正在处理...</el-link>
        <el-link :underline="false" type="warning" v-if="scope.row.statusType === '1' || scope.row.statusType === '2'" class="uploadImgOld">正在发布...</el-link>
        <el-link :underline="false" type="primary" v-if="scope.row.statusType === '3'">已发布</el-link>
        <el-link :underline="false" type="danger" v-if="scope.row.statusType === '4'" class="upfileImg">发布失败</el-link>
      </template>
      <template v-else>
        <el-link :underline="false" type="warning" v-if="scope.row.actionType === '1'">上传中</el-link>
        <el-link :underline="false" type="primary" v-if="scope.row.actionType === '2'">已上传</el-link>
        <el-link :underline="false" type="warning" v-if="scope.row.actionType === '3'">上传完成/未解压</el-link>
        <el-link :underline="false" type="warning" v-if="scope.row.actionType === '4'">上传完成/已解压</el-link>
        <el-link :underline="false" type="danger" class="upfileImg" v-if="scope.row.actionType === '0'">上传失败</el-link>
      </template>
    </template>
    <template v-else-if="$ibimFileSuffix.indexOf(scope.row.fileSuffix.toLowerCase()) > -1">
      <el-link :underline="false" type="primary">已发布</el-link>
    </template>
    <template v-else>
      <el-link :underline="false" type="warning" v-if="scope.row.actionType === '1'">上传中</el-link>
      <el-link :underline="false" type="primary" v-if="scope.row.actionType === '2'">已上传</el-link>
      <el-link :underline="false" type="warning" v-if="scope.row.actionType === '3'">上传完成/未解压</el-link>
      <el-link :underline="false" type="warning" v-if="scope.row.actionType === '4'">上传完成/已解压</el-link>
      <el-link :underline="false" type="danger" class="upfileImg" v-if="scope.row.actionType === '0'">上传失败</el-link>
    </template>
    <template v-if="showExportTag(scope.row)">
      <span style="margin: 0 4px;">/</span>
      <el-link :type="exportType(scope.row)" :underline="false">{{ exportText(scope.row) }}</el-link>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    scope: {
      type: Object,
      default: null
    }
  },
  methods: {
    // 导出状态
    exportType(row) {
      if (row.generateType == '4' || row.exportType == '4') return 'danger'
      else if (row.generateType == '2' || row.exportType == '2') return 'warning'
      else if (row.generateType == '1' || row.exportType == '1') return 'info'
      else if (row.generateType == '3' || row.exportType == '3') return 'primary'
    },
    showExportTag(row) {
      return row.generateType || row.exportType
    },
    exportText(row) {
      if (row.generateType == '4' || row.exportType == '4') return '导出失败'
      else if (row.generateType == '2' || row.exportType == '2') return '正在导出'
      else if (row.generateType == '1' || row.exportType == '1') return '正在排队'
      else if (row.generateType == '3' || row.exportType == '3') return '导出完成'
    },
  }
};
</script>

