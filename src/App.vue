<template>
  <div id="app">
    <ViewBox :body-padding-bottom="pdheight" ref="viewBox">
      <!-- <router-view /> -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </ViewBox>
    <tabbar slot="bottom" style="position:fixed;" v-if="tabberSwite">
      <tabbar-item
        :selected="item.isactive"
        :link="item.link"
        v-for="(item, index) in tabberinfo"
        :key="index"
      >
        <img slot="icon" :src="item.icon" />
        <img slot="icon-active" :src="item.iconactive" />
        <span slot="label">{{item.text}}</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>
<script>
import { ViewBox, Tabbar, TabbarItem } from 'vux';
import { mapGetters, mapActions } from "vuex";
export default {
  components: { ViewBox, Tabbar, TabbarItem },
  name: 'app',
  data() {
    return {
      pdheight: '0px',
      params: {
        start: 0,
        limit: 20,
        zoneCode: '',
        businessArea: '',
      },
      tabberinfo: [
        {
          text: '首页',
          icon: './images/tab_home_n.png',
          iconactive: './images/tab_home_s.png',
          link: '/index',
          navName: 'index',
          isactive: true,
        },
        {
          text: '律师',
          icon: './images/tab_business_n.png',
          iconactive: './images/tab_business_s.png',
          link: '/lawyer?start=' + 0 + '&limit=' + 20 + '&zoneCode=' + '&businessArea=' + '&q=',
          navName: 'lawyer',
          isactive: false,
        },
        {
          text: '律所',
          icon: './images/tab_directories_n.png',
          iconactive: './images/tab_directories_s.png',
          link: '/office?start=' + 0 + '&limit=' + 20 + '&zoneCode=' + '&businessArea=' + '&q=',
          navName: 'office',
          isactive: false,
        },
        {
          text: '信用规范',
          icon: './images/tab_policy_n.png',
          iconactive: './images/tab_policy_s.png',
          link: '/service',
          navName: 'service',
          isactive: false,
        },
      ]
    }
  },
  methods: {
    getNavName() {
      for (let i = 0; i < this.tabberinfo.length; i++) {
        if (this.tabberinfo[i].navName === this.navbarText) {
          // this.pdheight = '44px';
          this.tabberinfo[i].isactive = true;
        } else {
          // this.pdheight = '0';
          this.tabberinfo[i].isactive = false;
        }
      }
    },
  },
  watch: {
    navbarText() {
      this.getNavName();
    },
    tabberSwite(e) {
      if (e) {
        this.pdheight = '0';
      } else {
        this.pdheight = '0';
      }
    }
  },
  computed: {
    ...mapGetters(['navbarText', 'tabberSwite'])
  },
  mounted() {
    this.getNavName();
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
@import "assets/scss/common";
#app {
  width: 100%;
  height: 100%;
}
</style>

<style lang="less">
@import "~vux/src/styles/reset.less";
</style>