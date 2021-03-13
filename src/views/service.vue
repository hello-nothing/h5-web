<template>
  <div class="index-container">
    <div class="page-title">上海市律师行业信用信息管理规定（试行）</div>
    <div class="word-list-box" v-for="(item,index) in wordList" :key="index">
      <div class="word-title">{{item.title}}</div>
      <div class="word-texts">{{item.words}}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import api from "../api/index";
export default {
  components: {},
  name: "service",
  data() {
    return {
      wordList: [
        {
          title: '第一条：（目的依据）',
          words: '为进一步推进诚信执业，促进社会信用体系建设，加强律师行业组织建设、行业自律、促进信息透明对称，推动市场良性竞争，推进律师行业规范、健康有序发展，根据《上海市公共信用信息归集和使用管理办法》及有关规定制定本规定。'
        },
        {
          title: '第二条：（适用范围）',
          words: '本规定适用于本市执业律师、律师事务所、本市申请律师执业人员。'
        },
        {
          title: '第三条：（原则）',
          words: '律师行业信用信息的归集和使用应合法、客观、公正、审慎。信息管理部门不得泄露国家秘密，不得侵犯商业秘密和个人隐私。'
        }
      ]
    }
  },
  methods: {
    ...mapActions([
    ]),
    
    goBack() {
      this.$router.replace({ path: '/index' });
      //replace替换原路由，作用是避免回退死循环
    },
  },
  watch: {
  },
  computed: {
    ...mapGetters([
    ])
  },
  created() {
  },
  destroyed() {
    window.removeEventListener('popstate', this.goBack, false);
  },
  mounted() {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.goBack, false);
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
@import "../assets/scss/common.scss";

.index-container {
  width: 100%;
  height: 100%;
  padding: 1rem 0.32rem 2rem;
  color: #585858;
  background-color: #ffffff;
  .page-title {
    padding-bottom: 10px;
    text-align: center;
    font-size: 0.4rem;
    font-weight: bold;
  }
  .word-list-box {
    .word-title {
      padding-bottom: 6px;
      font-size: 0.32rem;
      font-weight: bold;
    }
    .word-texts {
      font-size: 0.3rem;
      text-indent: 2em;
    }
  }
}
</style>