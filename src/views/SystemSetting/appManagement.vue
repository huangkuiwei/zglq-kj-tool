<!-- 应用管理 -->
<template>
  <el-table :data="$appList" class="t-table" border :header-cell-style="$thStyle" :height="'calc(100vh - 160px)'" style="margin-top: 20px; font-size: 13px" stripe>
    <el-table-column prop="title" label="应用名称"></el-table-column>
    <el-table-column prop="type" label="应用类型"></el-table-column>
    <el-table-column prop="logo" align="center" width="100" label="LOGO图片">
      <template slot-scope="scope">
        <img :src="scope.row.logo" style="width: 40px" alt="" />
      </template>
    </el-table-column>
    <el-table-column prop="appName" label="LOGO名称"></el-table-column>
    <el-table-column prop="image" align="center" width="180" label="应用图片">
      <template slot-scope="scope">
        <img :src="scope.row.image" style="height: 44px" alt="" />
      </template>
    </el-table-column>
    <el-table-column prop="start" align="center" width="180" label="启动图片">
      <template slot-scope="scope">
        <img :src="scope.row.start" style="height: 44px" alt="" />
      </template>
    </el-table-column>
    <el-table-column prop="enabled" align="center" width="120" label="是否启用">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.enabled" :active-value="true" :inactive-value="false" @change=""></el-switch>
      </template>
    </el-table-column>
    <el-table-column prop="name" align="center" width="100" :label="$t('base.formLabel.operation')">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="">{{ $t('base.button.edit') }}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "appmanagement",
  data() {
    return {
    };
  },
};
</script>
<style></style>
