<template>
  <div
    class="list-container"
    infinite-scroll-delay="1000"
    infinite-scroll-immediate="false"
    v-infinite-scroll="load"
  >
    <template v-if="listArray.length > 0">
      <div
        class="list-content"
        v-for="(item, index) in listArray"
        :key="index"
        @click="goDetail(item.id)"
      >
        <div class="first-box">
          <div class="image-box">
            <div class="image" :style="{'background-image': 'url('+item.imageUrl+')'}"></div>
          </div>
          <div class="right-module">
            <div class="name">{{item.name}}</div>
            <div class="after-text">执业证号：{{item.licenseNumber}}</div>
            <div class="after-text" v-if="listType === 'lawyer'">执业机构：{{item.practiceOrg}}</div>
            <div class="after-text" v-else>通讯地址：{{item.address}}</div>
          </div>
        </div>
        <div class="two-box">
          <div class="three-list">
            执业状态
            <i class="iconfont iconweekly"></i>
          </div>
          <div class="three-list">
            年度考核
            <i class="iconfont iconfeedback"></i>
          </div>
          <div class="three-list">
            失信信息
            <span>{{item.dishonestyCount}}</span>
          </div>
        </div>
      </div>
      <div class="loading-text" v-if="loading && listArray.length !== 0 ">加载中...</div>
    </template>
    <template v-else>
      <div class="no-data">暂无数据</div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import api from "../api/index";


export default {
  components: {},
  name: "list",
  props: ["listArray", "listType"],
  data() {
    return {
      dataCount: 0,
      loading: false,
    }
  },
  methods: {
    ...mapActions([
    ]),
    // 下拉加载
    load() {
      this.loading = true;
      setTimeout(() => {
        this.dataCount += 20;
        this.$emit('datanum', this.dataCount);
        this.loading = false;
      }, 1000)
    },
    // 跳转至详情页
    goDetail(id) {
      this.$router.push({ path: '/ListDetail', query: { id: id, listType: this.listType } })
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters([
    ]),
  },
  created() {
  },
  mounted() {
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
@import "../assets/scss/common.scss";

.list-container {
  width: 100%;
  height: calc(100% - 54px);
  background-color: #f5f5f5;
  overflow-y: auto;
  .list-content {
    padding-top: 16px;
    margin-bottom: 10px;
    background-color: #ffffff;
    &:first-child {
      margin-top: 10px;
    }
  }
  .first-box {
    display: flex;
    width: 100%;
    padding-bottom: 16px;
    border-bottom: 1px solid #e0e0e0;
    .image-box {
      width: 30%;
    }
    .image {
      width: 1.5rem;
      height: 1.5rem;
      margin: 0 auto;
      border-radius: 50%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
  }
  .right-module {
    width: 70%;
    padding-right: 16px;
    .name {
      padding-bottom: 4px;
      font-size: 0.36rem;
      color: #333;
    }
    .after-text {
      padding-bottom: 2px;
      font-size: 0.26rem;
      color: #969faf;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .two-box {
    display: flex;
    justify-content: space-around;
    .three-list {
      line-height: 0.88rem;
      font-size: 0.3rem;
      color: #585858;
    }
    span {
      color: #348ac7;
    }
    .iconfont {
      font-size: 0.32rem;
      color: #348ac7;
    }
  }
  .loading-text {
    font-size: 0.26rem;
    text-align: center;
  }
  .no-data {
    height: 100%;
    padding-top: 200px;
    font-size: 0.36rem;
    text-align: center;
  }
}
</style>