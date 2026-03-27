<template>
  <div style="display: inline-block">
    <collectionLink :permission="permission" :rows="[row]" v-if="row.isChildFile != 1" :isZsk="isZsk" />
    <shareDialog :rowData="row" :visible.sync="shareDialogVisible" :isZsk="isZsk" v-if="shareDialogVisible" />
  </div>
</template>

<script>
import shareDialog from "@/components/Share/shareDialog";
import collectionLink from "@/components/PreViewAndlistComBtn/collectionButton"


export default {
  components: {
    shareDialog,
    collectionLink
  },
  props: {
    filePermissionCon:{
      type: Object,
      default: () => {}
    },
    row: {
      type: Object,
      default: null,
    },
    isZsk: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      permission:{},
      shareDialogVisible: false
    };
  },
  watch: {
    filePermissionCon(val) {
      this.permission = val;
    }
  },
  methods: {
    copyViewParth() {
      this.shareDialogVisible = true;
    },
  },
};
</script>
