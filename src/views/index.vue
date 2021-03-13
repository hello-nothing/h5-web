<template>
  <div class="index-container">
    <div class="title-background">上海市律师行业信用信息服务平台</div>
    <div class="search-content">
      <div class="background-box">
        <div class="select-title-box">
          <div
            class="tab-title-list"
            :class="index === isActive?'active':''"
            v-for="(item, index) in tabList"
            :key="index"
            @click="tabSelect(index)"
          >
            <span>{{item.title}}</span>
          </div>
        </div> 
        <div class="write-box">
          <template v-if="isActive === 0">
            <div class="input-list-box">
              <i class="iconfont iconuser_name"></i>
              <el-input v-model="lawyerName" placeholder="输入律师名称或执业证号"></el-input>
            </div>
          </template>
          <template v-else>
            <div class="input-list-box">
              <i class="iconfont iconziliaoku"></i>
              <el-input v-model="officeName" placeholder="输入律师事务所名称或执业证号"></el-input>
            </div>
          </template>
          <div class="input-list-box">
            <i class="iconfont icondizhi"></i>
            <el-select v-model="areaName" placeholder="请选择区县" @change="areaChange()">
              <el-option
                v-for="item in areaOptionsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          
          <template v-if="isActive === 0">
            <div class="input-list-box">
              <i class="iconfont icondynamic"></i>
              <el-select v-model="bussinessName" placeholder="请选择业务领域" @change="bussinessChange()">
                <el-option
                  v-for="item in bussinessOptionsList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </template>
          <template v-else>
            <div class="input-list-box">
              <i class="iconfont icondynamic"></i>
              <el-select v-model="orgTypeName" placeholder="请选择组织形式" @change="orgTypeChange()">
                <el-option
                  v-for="item in orgTypeOptionsList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </template>
          <div class="search-button" @click="goSearch()">立即搜索</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import api from "../api/index";
export default {
  components: {},
  name: "index",
  data() {
    return {
      tabList: [{
        title: '律师',
        isActive: true
      },
      {
        title: '律师事务所',
        isActive: false
      }],
      isActive: 0,
      areaOptionsList: [], // 区县
      bussinessOptionsList: [], // 业务领域
      orgTypeOptionsList: [], // 组织形式
      lawyerName: '', // 律师名称或执业证号
      areaName: '', // 区县
      bussinessName: '', // 业务领域
      orgTypeName: '', // 组织形式
      officeName: '', // 律师事务所名称或执业证号
      areaOriginArray: Object, // 区县原始数据
      areaCode: '', // 区县id
      bussinessOriginArray: Object, // 业务领域原始数据
      bussinessCode: '', // 业务领域id
      orgTypeOriginArray: Object, //组织形式原始数据
      orgTypeCode: '', //组织形式id
      startNum: 0, // 开始加载前数量
    }
  },
  methods: {
    ...mapActions([

    ]),
    // 搜索跳转
    goSearch() {
      if (this.isActive === 0) {
        const lawyerParams = {
          start: this.startNum,
          limit: 20,
          zoneCode: this.areaCode,
          businessArea: this.bussinessCode,
          q: ''
        };
        this.$router.push({
          path: '/lawyer',
          query: lawyerParams
        })
      } else {
        const officeParams = {
          start: this.startNum,
          limit: 20,
          zoneCode: this.areaCode,
          businessArea: this.orgTypeCode,
        };
        this.$router.push({
          path: '/office',
          query: officeParams
        })
      }

    },
    // 律师，律师事务所切换
    tabSelect(index) {
      this.isActive = index;
    },
    // 选择区县
    areaChange() {
      this.areaCode = this.areaOriginArray[this.areaName];
    },
    // 选择业务领域
    bussinessChange() {
      this.bussinessCode = this.bussinessOriginArray[this.bussinessName];
    },
    // 选择组织形式
    orgTypeChange() {
      this.orgTypeCode = this.orgTypeOriginArray[this.orgTypeName];
    },
    // 获取区县数据
    getArea() {
      api.getArea().then(res => {
        const listArea = res.data;
        this.areaOriginArray = listArea;
        this.areaOptionsList = Object.keys(listArea).map((item, index) => {
          return Object.assign({ label: item, value: item })
        })
      })
    },
    // 获取业务领域
    getBussiness() {
      api.getBussiness().then(res => {
        const listBussiness = res.data;
        this.bussinessOriginArray = listBussiness;
        this.bussinessOptionsList = Object.keys(listBussiness).map((item, index) => {
          return Object.assign({ label: item, value: item })
        });
      })
    },
    // 获取组织形式
    getOrgType() {
      api.getOrgType().then(res => {
        const listOrgType = res.data;
        this.orgTypeOriginArray = listOrgType;
        this.orgTypeOptionsList = Object.keys(listOrgType).map((item, index) => {
          return Object.assign({ label: item, value: item });
        });
      })
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters([
    ])
  },
  created() {
    this.getArea();
    this.getBussiness();
    this.getOrgType();
  },
  mounted() {
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
@import "../assets/scss/common.scss";

.index-container {
  width: 100%;
  height: 100%;
  color: $gray-base;
  background: #f5f5f5;
  .title-background {
    width: 100%;
    height: 50%;
    padding-top: 1rem;
    color: #fff;
    font-size: 0.44rem;
    text-align: center;
    background: linear-gradient(#617fe7, #37b9e4);
  }
  .search-content {
    width: 100%;
    height: 50%;
    .background-box {
      position: relative;
      top: -1.5rem;
      width: 94%;
      margin: 0 auto;
      background: #fff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
    }
  }
  .select-title-box {
    display: flex;
    padding-bottom: 0.6rem;
    font-size: 0.36rem;
    .tab-title-list {
      flex-grow: 1;
      text-align: center;
      line-height: 1rem;
    }
    span {
      border-bottom: 3px solid transparent;
    }
    .active {
      color: #37b9e4;
      span {
        padding-bottom: 2px;
        border-bottom: 3px solid #37b9e4;
      }
    }
  }
  .write-box {
    padding: 0 0.32rem 0.6rem;
  }
  .input-list-box {
    display: flex;
    border-bottom: 1px solid #e0e0e0;
    &:nth-child(3) {
      margin-bottom: 0.6rem;
    }
    .iconfont {
      width: 6%;
      line-height: 50px;
      font-size: 0.36rem;
      color: #bbbbbb;
    }
    /deep/ .el-input__inner {
      height: 50px;
      line-height: 50px;
      font-size: 0.32rem;
      border: none;
    }
    .el-select,
    .el-input {
      flex: 1;
    }
    /deep/ .el-select .el-input .el-select__caret {
      font-size: 0.36rem;
    }
  }
  .search-bottom {
    margin-bottom: 0.36rem;
  }
  .search-button {
    width: 100%;
    height: 0.88rem;
    text-align: center;
    line-height: 0.88rem;
    color: #fff;
    border-radius: 0.44rem;
    font-size: 0.36rem;
    background-color: #37b9e4;
  }
}
</style>