<template>
  <comDom :btnShow="user.iscorpadmin" />
</template>

<script>
import { mapGetters } from "vuex";
import comDom from "../compends/comKnowledge";

export default {
  components: {
    comDom
  },
  computed: {
    ...mapGetters(["user"]),
  },
}
</script>