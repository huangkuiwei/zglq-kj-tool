<template>
  <div>
    <comDom />
    <el-dialog title="提示" :visible.sync="bitpop" width="30%">
      <span>是否需要创建企业</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFn">{{ $t('base.button.cancel') }}</el-button>
        <el-button type="primary" @click="trueFn">{{ $t('base.button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import comDom from "./compends/comDom";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      hasCorp: false
    }
  },
  components: {
    comDom
  },
  computed: {
    ...mapGetters(["bitpop"]),
  },
  created() {
  },
  methods: {
    closeFn() {
      this.$store.commit("SET_BITPOP", false);
    },
    trueFn() {
      this.$router.push('/userCenter')
    }
  }
}
</script>
