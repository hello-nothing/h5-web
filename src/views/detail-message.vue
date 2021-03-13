<template>
  <div class="index-container" v-loading="listLoading">
    <div class="type-name-box">
      <div class="back-text" @click="back()">返回</div>
      <div class="type-name-title">{{this.typeName}}</div>
    </div>
    <div class="message-box">
      <template v-if="typeName === '执业信息'">
        <template v-if="detailType === 'office'">
          <div class="message-module">
            <div class="one-list-module" v-for="(item,index) in oneOfficeList" :key="index">
              <div class="list-title">{{item.title}}</div>
              <div class="list-text">{{item.text}}</div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="message-module">
            <div class="one-list-module" v-for="(item,index) in oneLawyerList" :key="index">
              <div class="list-title">{{item.title}}</div>
              <div class="list-text">{{item.text}}</div>
            </div>
          </div>
        </template>
      </template>
      <template v-if="typeName === '考核信息'">
        <!-- <template v-if="detailType === 'office'"> -->
        <div class="two-list-module" v-for="(item,index) in twoList" :key="index">
          <div class="left-title-one">{{item.year}}年度考核信息</div>
          <div class="right-type">{{item.result}}</div>
          <div class="left-right-box">
            <div class="left-module">
              <div class="left-title-two">考核单位</div>
              <div class="text-name">{{item.org}}</div>
            </div>
            <div class="right-module">
              <div class="left-title-two">考核时间</div>
              <div class="text-name">{{item.date}}</div>
            </div>
          </div>
        </div>
        <!-- </template> -->
        <!-- <template v-else>
          <div class="two-list-module" v-for="(item,index) in twoList" :key="index">
            <div class="lawyer-module">{{item}}</div>
          </div>
        </template>-->
      </template>
      <template v-if="typeName === '行政许可'">
        <div class="three-list-module" v-for="(item,index) in threeList" :key="index">
          <div class="three-list-title">{{item.recordDescription}}</div>
          <div class="three-list-time">{{item.finishDate}}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import api from "../api/index";
export default {
  components: {},
  name: "DetailMessage",
  data() {
    return {
      typeName: '', // 类型名称
      paramId: '',
      detailType: '', // 页面类型
      listLoading: true,
      oneLawyerList: [
        {
          title: '姓名',
          text: '杨澜波',
          key: 'name'
        },
        {
          title: '执业证号',
          text: '099976050433',
          key: 'qualificationNumber'
        },
        {
          title: '性别',
          text: '女',
          key: 'gender'
        },
        {
          title: '年龄',
          text: '44',
          key: 'memberNumber'
        },
        {
          title: '民族',
          text: '汉族',
          key: 'nation'
        },
        {
          title: '学历',
          text: '本科',
          key: 'education'
        },
        {
          title: '执业类型',
          text: '专职',
          key: 'practiceType'
        },
        {
          title: '政治面貌',
          text: '团员',
          key: 'politic'
        },
        {
          title: '资格证号',
          text: '099976050433',
          key: 'qualificationNumber'
        },
        {
          title: '首次执业时间',
          text: '1999-11-15',
          key: 'firstLicenseDate'
        },
        {
          title: '资格证取得时间',
          text: '1999-05-19',
          key: 'qualificationDate'
        },
        {
          title: '所内身份',
          text: '执业律师',
          key: 'position'
        },
        {
          title: '主管司法局',
          text: '浦东新区司法局',
          key: 'justiceBureau'
        },
        {
          title: 'email',
          text: '1342342',
          key: 'email'
        },
      ],
      oneOfficeList: [ // 律所执业信息
        {
          title: '机构名称',
          text: '上海市欣隆律师事务所',
          key: 'name'
        },
        {
          title: '负责人',
          text: '王汝安',
          key: 'director'
        },
        {
          title: '批准时间',
          text: '1998-02-24',
          key: 'approveDate'
        },
        {
          title: '组织形式',
          text: '普通合伙',
          key: 'lawFirmType'
        },
        {
          title: '联系电话',
          text: '13636546414',
          key: 'phone'
        },
        {
          title: '联系传真',
          text: '60293510',
          key: 'fax'
        },
        {
          title: '网址',
          text: '上海市欣隆律师事务所',
          key: 'website'
        },
        {
          title: '主管司法局',
          text: '静安区司法局',
          key: 'justiceBureau'
        },
      ],
      twoList: [],// 考核信息
      threeList: [], // 行政许可

    }
  },
  methods: {
    ...mapActions([
    ]),
    // 返回
    back() {
      this.$router.back(-1)
    },
    // 获取参数
    getParamId() {
      const params = this.$route.query;
      this.detailType = params.type;
      this.paramId = params.id;
      this.typeName = params.name;
      if (this.paramId) {
        this.listLoading = true;
        setTimeout(() => {
          this.getDetail(this.detailType);
          this.listLoading = false;
        }, 1000);
      }
    },
    // 获取信息
    getDetail(type) {
      if (type === 'lawyer') {
        api.getLawyerDetail(this.paramId).then(res => {
          this.allInfo = res.data;
          this.lawFirmInfo = this.allInfo.lawyerInfo;
          this.getData(this.allInfo);
        })
      } else {
        api.getOfficeDetail(this.paramId).then(res => {
          this.allInfo = res.data;
          this.lawFirmInfo = this.allInfo.lawFirmInfo;
          this.getData(this.allInfo);
        })
      }
    },
    // 数据处理
    getData(dataInfo) {
      if (this.typeName === '执业信息') {
        if (this.detailType === 'lawyer') {
          const oneLawyerInfo = dataInfo.lawyerInfo;
          this.oneLawyerList.forEach(ele => {
            const { key } = ele;
            ele["text"] = oneLawyerInfo[key];
          })
        } else {
          const oneOfficeInfo = dataInfo.lawFirmInfo;
          this.oneOfficeList.forEach(ele => {
            const { key } = ele;
            ele["text"] = oneOfficeInfo[key];
          })
        }
      } else if (this.typeName === '考核信息') {
        this.twoList = dataInfo.annualAssessment;
      } else if (this.typeName === '行政许可') {
        this.threeList = dataInfo.administrativeLicense;
      }
    },
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
    this.getParamId();
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
  color: #585858;
  background-color: #f5f5f5;
  .type-name-box {
    width: 100%;
    height: 60px;
    padding: 0 16px;
    margin-bottom: 14px;
    line-height: 60px;
    font-size: 0.36rem;
    color: #ffffff;
    background-color: #37b9e4;
    .back-text {
      float: left;
    }
    .type-name-title {
      width: 100%;
      text-align: center;
    }
  }
  .message-box {
    height: calc(100% - 74px);
    overflow-y: auto;
    .message-module {
      padding: 0 14px;
      background-color: #ffffff;
    }
  }
  .one-list-module {
    display: flex;
    font-size: 0.32rem;
    border-bottom: 1px solid #e0e0e0;
    &:last-child {
      border: none;
    }
    .list-title {
      width: 34%;
      color: #333333;
      line-height: 50px;
    }
    .list-text {
      flex: 1;
      padding: 12px 0;
      color: #969faf;
      text-align: right;
    }
  }
  .two-list-module {
    position: relative;
    padding: 10px 15px 15px;
    margin-bottom: 15px;
    background-color: #ffffff;
    .lawyer-module {
      height: 100px;
      line-height: 100px;
      text-align: center;
      font-size: 0.32rem;
    }
    .left-title-one {
      max-width: 86%;
      padding-bottom: 16px;
      font-size: 0.32rem;
    }
    .left-title-two {
      padding-bottom: 10px;
      font-size: 0.3rem;
    }
    .text-name {
      padding-bottom: 10px;
      color: #969faf;
      font-size: 0.3rem;
    }
    .right-type {
      position: absolute;
      top: 16px;
      right: 15px;
      min-width: 40px;
      height: 24px;
      padding-left: 10px;
      padding-right: 10px;
      color: #37b9e4;
      text-align: center;
      line-height: 22px;
      font-size: 0.26rem;
      border-radius: 5px;
      border: 1px solid #37b9e4;
    }
    .left-right-box {
      display: flex;
    }
    .left-module {
      width: 60%;
      border-right: 1px solid #e0e0e0;
    }
    .right-module {
      flex: 1;
      padding-left: 14px;
    }
  }
  .three-list-module {
    padding: 10px 14px;
    margin-bottom: 20px;
    background-color: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    .three-list-title {
      padding-bottom: 10px;
      font-size: 0.32rem;
    }
    .three-list-time {
      font-size: 0.28rem;
      color: #969faf;
    }
  }
}
</style>