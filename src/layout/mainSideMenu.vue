<template>
  <el-aside width="60px" class="side-mainbar">
    <div class="top-leftaside flex jc-center ai-center" @mouseleave="isHover = false" @mouseover="isHover = true" v-if="toggleVisible" :class="{ collapse: !$store.state.app.isCollapse }" @click="handleLefeMenu">
      <img class="dbrIcon" :class="{ rotate: $store.state.app.isCollapse }" :src="isHover ? require('../assets/icon/dbr-w.svg') : require('../assets/icon/dbr.svg')" />
    </div>
    <div class="flex column ai-center" style="height:100%;padding-bottom: 15px;">
      <div v-for="(i, idx) in navAllList" v-if="permi.includes(i.permi)" :key="idx" :style="{ marginTop: i.name == 'setting' ? 'auto' : '20px' }" :class="activeItem(i.name) ? 'main-button-current' : 'main-button'" @click="setActiveTab(i.name, i)">
        <img class="image" :src="activeItem(i.name) ? i.actImgUrl : i.imgUrl" />
        <span class="title">{{ $t(`leftNavs.${i.name}`) }}</span>
      </div>
    </div>
  </el-aside>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "MainSideMenu",
  data() {
    return {
      hasCorp: false,
      isHover: false,
      permi: [],
      navAllList: [
        // {
        //   name: 'desktop',
        //   permi: 'desktop:*:*',
        //   path: "/clouddesktop",
        //   imgUrl: require(`@/assets/navBarIcon/工作台.svg`),
        //   actImgUrl: require(`@/assets/navBarIcon/工作台-act.svg`),
        // },
        {
          name: 'projects',
          permi: 'projects:*:*',
          imgUrl: require(`@/assets/navBarIcon/项目空间.svg`),
          actImgUrl: require(`@/assets/navBarIcon/项目空间-act.svg`),
        },
        // {
        //   name: 'teamwork',
        //   permi: 'teamwork:*:*',
        //   path: "/teamwork",
        //   imgUrl: require(`@/assets/navBarIcon/团队协作.svg`),
        //   actImgUrl: require(`@/assets/navBarIcon/团队协作-act.svg`),
        // },
        // {
        //   name: 'resource',
        //   permi: 'resource:*:*',
        //   path: "/commonBuildLibrary",
        //   imgUrl: require(`@/assets/navBarIcon/公共资源.svg`),
        //   actImgUrl: require(`@/assets/navBarIcon/公共资源-act.svg`),
        // }
      ],
    };
  },
  computed: {
    ...mapGetters(['user']),
    toggleVisible() {
      return ['teamwork', 'classonline', 'clouddesktop'].indexOf(this.$route.name) == -1
    },
    activeTab() {
      return this.$store.state.app.activeTab
    },
    message() {
      return "网管说这个页面你不能进......";
    },
  },
  created() {
    this.permi = localStorage.getItem('permi').split(',')

    // if (!this.$isRead) {
    //   this.navAllList.push({
    //     name: 'setting',
    //     permi: 'setting:*:*',
    //     path: "/systemSetting",
    //     imgUrl: require(`@/assets/navBarIcon/系统设置.svg`),
    //     actImgUrl: require(`@/assets/navBarIcon/系统设置-act.svg`),
    //   })
    // }
  },
  methods: {
    handleLefeMenu() {
      this.$store.dispatch("setLeftCollapse");
    },
    activeItem(item) {
      return item == this.activeTab
    },
    async setActiveTab(name, item) {
      console.log(this.$route.path);
      if (this.$route.path == '/projectFile' && name == 'projects') {
        this.$router.push({
          path: '/all',
        });
      } else if (name == this.activeTab) {
        return
      } else if (name == 'setting') {
        this.$router.push({
          path: item.path,
        });

        this.$root.$emit('activeSetting');
      } else {
        this.$store.commit("SET_ACTIVE_TAB", name);
        if (name == "projects") {
          this.$router.push({
            path: '/all',
          });
        } else {
          this.$router.push({
            path: item.path,
          });
        }
      }
    },
    linkToHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.dbrIcon {
  width: 15px;
  height: 15px;
}

.dbrIcon.rotate {
  transform: rotate(180deg);
}

.side-mainbar {
  overflow: visible !important;
  position: relative;
  z-index: 1499;
  height: calc(100vh - 51px);
  background-color: #101010;
  font-size: 4px;
  display: inline-block;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

.side-mainbar::-webkit-scrollbar {
  width: 0 !important;
}

.main-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 4px;
  margin-top: 20px;
  isolation: isolate;
  width: 60px;
  height: 60px;
  flex: none;
  order: 0;
  flex-grow: 0;
}

.main-button .image {
  height: 26px;
  width: 26px;
}

.main-button .image:hover {
  color: #ffffff;
}

.main-button .title {
  width: 60px;
  height: 15px;
  color: #98a2b4;
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.05em;
  flex: none;
  order: 1;
  flex-grow: 0;
  z-index: 1;
  text-align: center;
}

.main-button-current {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 4px;
  margin-top: 20px;
  isolation: isolate;
  width: 60px;
  height: 60px;
  flex: none;
  order: 0;
  flex-grow: 0;
  background: #484f63;
}

.main-button-current .image {
  height: 28px;
  width: 28px;
}

.main-button-current .title {
  width: 60px;
  height: 15px;
  color: #fff;
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.05em;
  flex: none;
  order: 1;
  flex-grow: 0;
  z-index: 1;
  text-align: center;
}

.main-button:hover {
  cursor: pointer;
  background: #484f63;
}

.assist0-button {
  position: absolute;
  bottom: 20px;
  left: 14px;
  width: 32px;
  height: 32px;
  display: inline-block;
}

.assist0-button:hover {
  cursor: pointer;
  background: #484f63;
}
</style>
