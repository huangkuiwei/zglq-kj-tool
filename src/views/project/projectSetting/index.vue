<!--  -->
<template>
  <div>
    <!-- 右侧按钮 -->
    <!-- <div class="close flex ai-center">
      <div style="margin-right: 15px">{{ projectData.projectName }}</div>
      <el-button type="primary" plain size="small" icon="el-icon-arrow-left" @click="close">{{ this.$t("projects.operation.backToList") }}</el-button>
      <el-button type="primary" plain size="small" icon="el-icon-position" v-if="type != 'ADD'" @click="$emit('openProject')">{{ this.$t("projects.operation.enterProject") }}</el-button>
    </div> -->
    <!-- 基础信息 -->
    <el-dialog v-dialogDrag :title="$t('projects.nav.base')" :visible.sync="baseInfoVisible" :width="'510px'"
      :close-on-click-modal="false" @close="handleClose" v-if="baseInfoVisible">
      <base-info @loadData="refreshData" @close="handleClose" :ProjectIUID="projectData.iuid"
        :projectTypeOptions="projectTypeOptions" :ProjectDesignPhaseOptions="ProjectDesignPhaseOptions"
        :type="type"></base-info>
    </el-dialog>
    <!-- 成员管理 -->
    <el-dialog v-dialogDrag :title="$t('projects.nav.member')" :visible.sync="memberVisible" :width="'1200px'"
      :close-on-click-modal="false" @close="handleClose">
      <member-box ref="member" parentPage="project" :ProjectIUID="projectData.iuid"></member-box>
    </el-dialog>
    <!-- 权限 -->
    <el-dialog v-dialogDrag :title="$t('projects.nav.permission')" :visible.sync="permissionVisible" :top="'6vh'"
      :width="'90vw'" :close-on-click-modal="false" @close="handleClose">
      <permissions-set :ProjectIUID="projectData.iuid" @close="handleClose"
        :isBridgeMaster="projectData.projectTypeName === '桥梁大师项目'"></permissions-set>
    </el-dialog>
    <!-- 流程 -->
    <el-dialog v-dialogDrag :title="$t('projects.nav.workflow')" :visible.sync="workflowVisible" :top="'6vh'"
      :width="'90vw'" :close-on-click-modal="false" @close="handleClose">
      <workflow-box v-if="workflowVisible" :ProjectIUID="projectData.iuid"  @close="handleClose" parentPage="project"></workflow-box>
    </el-dialog>
  </div>
</template>

<script>
import baseInfo from "@/views/project/projectSetting/baseInfo";
import workflowBox from "@/views/SystemSetting/workflowManagement";
import memberBox from "@/views/SystemSetting/member.vue";
import permissionsSet from "@/views/project/projectSetting/permission";
export default {
  name: "projectSetting",
  props: {
    projectData: Object,
    type: String,
    loadData: Function,
    openProject: Function,
    projectTypeOptions: Array,
    ProjectDesignPhaseOptions: Array,
  },
  components: {
    workflowBox,
    memberBox,
    baseInfo,
    permissionsSet,
  },
  data() {
    return {
      baseInfoVisible: false,
      memberVisible: false,
      permissionVisible: false,
      workflowVisible: false,
    };
  },
  watch: {
    type(val) {
      switch (val) {
        case 'close':
          this.baseInfoVisible = false;
          this.workflowVisible = false;
          this.memberVisible = false;
          this.permissionVisible = false;
          break;
        case 'ADD':
          this.baseInfoVisible = true;
          break;
        case 'base':
          this.baseInfoVisible = true;
          break;
        case 'member':
          this.memberVisible = true;
          break;
        case 'permission':
          this.permissionVisible = true;
          break;
        case 'workflow':
          this.workflowVisible = true;
          break;
      }
    },
  },
  methods: {
    handleClose() {
      this.$emit("update:type", 'close');
    },
    refreshData() {
      this.$emit("loadData");
    },
  },
};
</script>
<style scoped>
.project-setting-box {
  position: fixed;
  background: #fff;
  z-index: 1500;
  padding: 0 15px;
  width: calc(100vw - 60px);
  height: calc(100vh - 51px);
  left: 60px;
  top: 50px;
}

.close {
  position: absolute;
  cursor: pointer;
  text-align: center;
  z-index: 1001;
  /* width: 40px; */
  right: 20px;
  top: 8px;
}

::v-deep .el-tab-pane {
  height: calc(100vh - 113px);
}</style>
