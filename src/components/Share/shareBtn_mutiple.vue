<template>
  <div style="display:inline-block">
    <el-button v-if="type!='list'" style="width:79px" size="small" @click="handleShare">
      <i class="iconfont icon-share"></i>{{$t('base.button.share')}}
    </el-button>
    <i v-else class="iconfont icon-share shrink" @click="handleShare" style="color: #8f9ab4;font-size: 18px;cursor: pointer" />
    <shareDialog :rowData="rows" :visible.sync="shareDialogVisible" v-if="shareDialogVisible" @shareWorkflow="shareWorkflow" />

    <applyWorkflowShare
        v-if="applyWorkflowDialogVisible"
        :shareId="shareId"
        :dialogVisible.sync="applyWorkflowDialogVisible"
        :rowData="rows"
        :currentProject="projectId"
        @refresh="$emit('loadData', 'clearSelect', false)"
        @reload="$emit('loadWorkflow')"
    />
  </div>
</template>
<script>
  import shareDialog from "@/components/Share/shareDialog";
  import applyWorkflowShare from "@/components/applyWorkflowShare.vue";

  export default {
    components: {
      shareDialog,
      applyWorkflowShare
    },
    props: {
      type: {
        type: String
      },
      rows: {
        type: Array
      },
      projectId: {
        type: String,
      }
    },
    data() {
      return {
        shareDialogVisible: false,
        applyWorkflowDialogVisible: false,
        shareId: null,
      };
    },
    methods: {
      handleShare() {
        this.shareDialogVisible = true;
      },

      shareWorkflow($event) {
        this.shareId = $event
        this.shareDialogVisible = false
        this.applyWorkflowDialogVisible = true
      }
    }
  }
</script>
