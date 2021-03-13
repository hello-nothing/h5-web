<template>
  <div class="detail-container" v-loading="listLoading">
    <div class="back-button" @click="goNextBack()">
      <i class="iconfont icondown"></i>
    </div>
    <div class="white-back">
      <div class="image-box" :style="{'background-image': 'url('+ lawFirmInfo.imageUrl +')'}"></div>
      <div class="detail-title">{{lawFirmInfo.name}}</div>
      <template v-if="detailType === 'office'">
        <div class="detail-number">执业证号：{{lawFirmInfo.licenseNumber}}</div>
        <div class="detail-number bottom-number">通讯地址：{{lawFirmInfo.address}}</div>
      </template>
      <div class="three-module-box">
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
          <span>{{lawFirmInfo.dishonestyCount}}</span>
        </div>
      </div>
    </div>
    <div class="document-box">
      <div class="document-text">裁判文书(0)</div>
      <i class="iconfont iconarrow2"></i>
    </div>
    <div class="title-common">基本资料</div>
    <div class="eight-module-box">
      <div
        class="eight-list"
        v-for="(item,index) in materialList"
        :key="index"
        @click="goToDetail(item,item.name)"
      >
        <div class="list-num" v-if="index !== 0">{{item.num}}</div>
        <i class="iconfont" :class="item.icon"></i>
        <div class="list-name">{{item.name}}</div>
      </div>
    </div>
    <div class="title-common">执业历程</div>
    <div class="process-module-box">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in processList"
          :key="index"
          :icon="item.icon"
          :type="item.type"
          :color="item.color"
          :size="item.size"
          :timestamp="item.timestamp"
        >{{item.content}}</el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import api from "../api/index";
export default {
  components: {
  },
  name: "ListDetail",
  data() {
    return {
      listLoading: true,
      detailType: 'lawyer',
      processList: [], // 执业历程
      materialList: [{ // 基本资料
        name: '执业信息',
        icon: 'iconinternmanagement',
        num: 1
      },
      {
        name: '考核信息',
        icon: 'iconadministrativelicense',
        num: 1
      },
      {
        name: '行政许可',
        icon: 'iconinternmanagement',
        num: 1
      },
      {
        name: '奖惩信息',
        icon: 'iconadministrativelicense',
        num: 1
      },
      {
        name: '学术研究',
        icon: 'iconinternmanagement',
        num: 1
      },
      {
        name: '业务数据',
        icon: 'iconadministrativelicense',
        num: 1
      },
      {
        name: '社会兼职',
        icon: 'iconinternmanagement',
        num: 1
      },
      {
        name: '公益活动',
        icon: 'iconadministrativelicense',
        num: 1
      }],
      lawFirmInfo: {},
      allInfo: {},

    }
  },
  methods: {
    ...mapActions([
    ]),
    // 返回
    goNextBack() {
      this.$router.back(-1)
    },
    // 获取信息id
    getParamId() {
      const id = this.$route.query.id;
      const type = this.$route.query.listType;
      this.paramId = id;
      this.detailType = type;
      if (this.paramId) {
        this.listLoading = true;
        setTimeout(() => {
          this.getLawyerDetail(this.detailType);
          this.listLoading = false;
        }, 1000);
      }
    },
    // 获取详细信息
    getLawyerDetail(type) {
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
      this.materialList[1].num = dataInfo.annualAssessment.length;
      this.materialList[2].num = dataInfo.administrativeLicense.length;
      this.materialList[3].num = dataInfo.rewardAndPunish.length;
      this.materialList[4].num = dataInfo.annualCaseInfo.length;
      this.materialList[5].num = dataInfo.publication.length;
      this.materialList[6].num = dataInfo.socialCommonweal.length;
      this.materialList[7].num = dataInfo.publication.length;
      dataInfo.workExperience.map(ele => {
        const item = {
          icon: 'iconfont iconselected-copy',
          type: 'primary',
          color: '#37b9e4',
          size: 'large',
          timestamp: ele.date,
          content: ele.dis
        };
        this.processList.push(item);
      })
    },
    // 详情跳转
    goToDetail(index, name) {
      if (index.num === 0) {
        return
      } else {
        const detailParam = {
          name: name,
          id: this.paramId,
          type: this.detailType
        }
        this.$router.push({
          path: '/DetailMessage',
          query: detailParam
        })
      }

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

  mounted() {

  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
@import "../assets/scss/common.scss";

.detail-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #f5f5f5;
  .back-button {
    position: absolute;
    z-index: 10;
    left: 0.4rem;
    top: 0.4rem;
    width: 0.6rem;
    height: 0.6rem;
    text-align: center;
    line-height: 0.6rem;
    color: #ffffff;
    font-size: 0.4rem;
    background-color: #37b9e4;
    border-radius: 50%;
    transform: rotate(90deg);
  }
  .white-back {
    width: 100%;
    padding-top: 30px;
    margin-bottom: 10px;
    background-color: #ffffff;
  }
  .image-box {
    width: 1.6rem;
    height: 1.6rem;
    margin: 0 auto;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
  .detail-title {
    padding: 6px 0;
    font-size: 0.36rem;
    text-align: center;
    color: #333;
  }
  .detail-number {
    padding-bottom: 6px;
    text-align: center;
    font-size: 0.28rem;
  }
  .bottom-number {
    padding: 0 10px 10px;
    line-height: 16px;
  }
  .three-module-box {
    display: flex;
    justify-content: space-around;
    background-color: #f5fdff;
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
  .document-box {
    display: flex;
    justify-content: space-between;
    height: 0.88rem;
    padding: 0 15px;
    font-size: 0.32rem;
    color: #585858;
    line-height: 0.88rem;
    background-color: #ffffff;
    .document-text {
      flex: 1;
    }
  }
  .title-common {
    padding: 10px 15px;
    color: #999;
    font-size: 0.28rem;
  }
  .eight-module-box {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    padding: 0 10px;
    color: #585858;
    .eight-list {
      position: relative;
      width: 23%;
      height: 1.8rem;
      margin-bottom: 10px;
      text-align: center;
      background-color: #ffffff;
      &:nth-child(n + 4):nth-child(-n + 8) {
        margin-bottom: 0px;
      }
    }
    .list-num {
      position: absolute;
      top: 4px;
      right: 6px;
      font-size: 0.24rem;
      color: #37b9e4;
    }
    .list-name {
      font-size: 0.24rem;
      color: #585858;
    }
    .iconfont {
      display: block;
      padding-top: 14px;
      color: #37b9e4;
      font-size: 0.52rem;
    }
  }
  .process-module-box {
    padding: 20px 18px 0;
    background-color: #ffffff;
    /deep/ .el-timeline-item__tail {
      border-left: 1px solid #37b9e4;
    }
  }
}
</style>