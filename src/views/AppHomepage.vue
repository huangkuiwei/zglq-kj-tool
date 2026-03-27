<template>
  <div> </div>
</template>

<script>

export default {
  name: 'AppHomepage',
  computed: {
    message() {
      return '网管说这个页面你不能进......'
    }
  },

  mounted() {
    //   document.title = this.$route.query.name;
    //   window.addEventListener('beforeunload', e => this.beforeunloadHandler(e));
    this.startApp();
  },
  destroyed() {
    /*   alert(document.title);
       localStorage.setItem(document.title, null); // 必须清除
       window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e));*/
  },
  methods: {
    /*  beforeunloadHandler(e) {
        console.log('关闭窗口之后')
        localStorage.setItem(document.title, null); // 必须清除
      },*/
    startApp() {
      var item = this.$route.query.appType;
      var iuid = this.$route.query.iuid;
      this.$runItwinApp({ appName: this.$route.query.name, appType: item }, iuid);
    },
    linkToHome() {
      window.open('http://www.bimwindows.cn')
    },
  }
}
</script>


<style lang="scss">
.home {
  background-color: white;

  .title {
    font-size: 40px;
    letter-spacing: 2px;
  }
}
</style>
