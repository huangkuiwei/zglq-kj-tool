<!-- 最近项目模块  备份文件 -->
<template>
  <div v-if="!isInTeamwork()" style="display: none;" class="remember">
    <div class="flex">
      <div class="left shrink">
        <div class="logo">
          <img src="@/assets/csc/tumuhejianzhu.png" alt="">
        </div>
        <span class="tip">最近项目：</span><!-- {{compensateCount}} -->
        <!--span class="name" @click="linkToFilePage(lastProjectInfo)">{{ lastProjectInfo.projectName || '无' }}</span-->
        <el-link @click="$router.push(`/projectFile?projectId=${lastProjectInfo.mainIUID}&projectName=${lastProjectInfo.projectName}&projectIsPictureMode=true&path=%2Fall`)" :underline="true">
          {{ lastProjectInfo.projectName || '无' }}
        </el-link>
      </div>
      <div class="right grow" v-if="lastProjectInfo.projectName">
        <div @click="showTransferView('bimwindows')">
          <img src="@/assets/csc/浏览.svg" alt="">
          <span>浏览</span>
        </div>
        <!--div @click="jump('/presentation')">
      <img src="@/assets/csc/icon1.svg" alt="">
      <span>施工模型</span>
    </div-->
        <div @click="showTransferView('presentation')">
          <img src="@/assets/csc/ditu.svg" alt="">
          <span>抖图</span>
        </div>
        <!--div @click="jump('/cscschedule')">
      <img src="@/assets/csc/ziyuan25.svg" alt="">
      <span>进度管理</span>
    </div-->
        <!--<div>-->
        <!--  <img src="@/assets/icon1.png" alt="">-->
        <!--  <span>智慧工地</span>-->
        <!--</div>-->
      </div>
    </div>
    <div class="flex">
      <div class="left shrink">
        <div class="logo">
          <img src="@/assets/csc/Vector.png" alt="">
        </div>
        <span>最近文件：</span>
        <el-tooltip effect="dark" :content="lastProjectInfo.fileName || '无'" placement="bottom">
          <div class="flex">
            <span class="lastFile">{{recentFile}}</span>
            <span v-if="lastProjectInfo.fileName">{{recentFileSuffix}}</span>
          </div>
        </el-tooltip>
      </div>
      <div class="right grow" v-if="lastProjectInfo.fileName">
        <div @click="showTransferView('bimwindows', `${lastProjectInfo.fileIUID}`)">
          <img src="@/assets/csc/浏览.svg" alt="">
          <span>{{ $t('base.button.view') }}</span>
        </div>
        <div @click="showTransferView('cscmodeler', `${lastProjectInfo.fileIUID}`)">
          <img src="@/assets/csc/编辑.svg" alt="">
          <span>{{ $t('base.button.edit') }}</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
</script>

<style>
</style>
