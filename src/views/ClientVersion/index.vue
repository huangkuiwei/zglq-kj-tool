<template>
  <el-container
    class="flex"
    :style="{ 'min-height': 'calc(100vh - 51px)' }"
  >
    <mainSideMenu />
    <div class="flex jc-between teamwork grow">
      <version-manage></version-manage>
    </div>
  </el-container>
</template>
<script>
import VersionManage from "./VersionManage.vue";

export default {
  name: "ClientVersion",
  data() {
    return {};
  },
  components: {
    VersionManage,
  },
  computed: {
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>
