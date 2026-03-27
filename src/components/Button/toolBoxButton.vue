<template>
  <button :class="[btnSign ? btnClickClass : '', btnClass]" @click="btnClick">
    <i :class="[icon]"></i>
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
    },
    btnClass: {
      type: String,
      default: "toolBox",
    },
    btnClickClass: {
      type: String,
      default: "toolBoxclick",
    },
  },
  data() {
    return {
      btnSign: this.checked,
    };
  },
  methods: {
    btnClick() {
      this.btnSign = !this.btnSign;
      this.$emit("click");
    },
    setCheckedFalse() {
      this.btnSign = false;
    },
  },
};
</script>

<style>
.imodelIconCom {
  font-size: 24px;
}
</style>