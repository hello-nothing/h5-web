<template>
  <div class="lawyer-container" v-loading="listLoading">
    <div class="search-box">
      <i class="iconfont iconsearch1"></i>
      <el-input
        v-model="inputName"
        placeholder="输入律师名称或执业证号"
        clearable
        @input="nameChange"
        @blur="noFocus"
        @focus="getFocus"
        @change="enterChange"
      ></el-input>
      <div v-if="!listNone" class="delete-button" @click="delInputInfo">删除</div>
    </div>
    <template v-if="listNone">
      <div class="select-title-box">
        <div class="title-text" @click="areaChoose()">
          {{areaName}}
          <i class="iconfont icondown"></i>
          <!-- <i class="iconfont" :class="areaActive?'icondown':'iconup'"></i> -->
        </div>
        <div class="title-text" @click="bussinessChoose()">
          {{bussinessName}}
          <i class="iconfont icondown"></i>
        </div>
      </div>
      <template v-if="chooseActive">
        <div class="choose-list-box">
          <div class="area-box" v-if="type === 'area'">
            <div
              class="choose-list"
              :class="index === areaActive?'active':''"
              @click="chooseArea(index)"
              v-for="(item,index) in areaOptionsList"
              :key="index"
            >{{item.name}}</div>
          </div>
          <div class="area-box" v-if="type === 'bussiness'">
            <div
              class="choose-list"
              :class="index === bussinessActive?'active':''"
              @click="chooseBussiness(index)"
              v-for="(item,index) in bussinessOptionsList"
              :key="index"
            >{{item.name}}</div>
          </div>
          <div class="confirm-cancel-box">
            <div class="cancel-button" @click="cancel()">取消</div>
            <div class="cancel-button complete" @click="confirm()">完成</div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="content-list-box">
          <list :listArray="listArray" :listType="listType" @datanum="loading"></list>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="record-content">
        <div class="record-title" v-if="inputName === ''">
          <div class="record-text">历史记录</div>
          <div class="clear-button" @click="clearRecord">+</div>
        </div>
        <div class="result-text" v-else>所有"{{inputName}}"的搜索</div>
        <template v-if="!isHistory">
          <div
            class="record-list"
            v-for="(item,index) in recordList"
            :key="index"
            @click="getList(item.name)"
          >
            <p v-html="KeyRegExp(item.name, inputName)"></p>
          </div>
        </template>
        <template v-else>
          <div
            class="record-list"
            v-for="(item,index) in historyList"
            :key="index"
            @click="getList(item.name)"
          >{{item.name}}</div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import api from "../api/index";
import list from "../components/list"
import merge from 'webpack-merge'

export default {
  components: {
    list
  },
  name: "lawyer",
  data() {
    return {

      fixed: false,
      startNum: 0,

      inputName: '',
      listArray: [],

      params: Object,

      listType: 'lawyer', // 列表类型
      chooseActive: false,
      areaOptionsList: [], // 区县列表
      bussinessOptionsList: [], // 业务领域
      areaName: '所在区县', // 区县名称
      bussinessName: '业务领域', // 业务领域

      areaCode: '', // 区县id
      bussinessCode: '', // 业务领域id

      areaActive: 0,
      bussinessActive: 0,
      areaOriginArray: Object, // 区县原始数据
      bussinessOriginArray: Object, // 业务领域原始数据
      type: 'area', // 类型

      listLoading: true,
      listNone: true,
      recordList: [],// 搜索记录
      historyList: [],// 历史记录
      isHistory: true,
      listHistory: [],// 缓存数据
    }
  },

  methods: {
    ...mapActions([
    ]),
    // 清楚历史记录
    clearRecord() {
      if (this.historyList) {
        this.historyList = [];
        localStorage.removeItem('historyRecord');
      }
    },
    // 删除输入框内容
    delInputInfo() {
      this.inputName = '';
      this.listNone = true;
      this.isHistory = true;

    },
    // 获取焦点时
    getFocus() {
      this.listNone = false;
      if (!this.inputName) {
        this.isHistory = true;
        const list = JSON.parse(localStorage.getItem('historyRecord'));
        this.historyList = list;
      }
    },
    // 失去焦点
    noFocus() {
      this.getLoadingData();
    },
    // 输入框值改变时
    nameChange(e) {
      if (e) {
        this.startNum = 0;
        this.bussinessCode = '';
        this.areaCode = '';
        this.params = {
          start: this.startNum,
          limit: 20,
          zoneCode: this.areaCode,
          businessArea: this.bussinessCode,
          q: e
        }
        this.inputName = e;
        this.isHistory = false;

        this.$router.push({
          query: merge({}, this.params)
        })
        this.recordList = [];
        this.getNameList();
      } else {
        this.isHistory = true;
      }

      // this.getName();
      // this.getLoadingData();
    },
    // 回车
    enterChange(e) {
      this.startNum = 0;
      this.bussinessCode = '';
      this.areaCode = '';
      this.params = {
        start: this.startNum,
        limit: 20,
        zoneCode: this.areaCode,
        businessArea: this.bussinessCode,
        q: e
      }
      this.inputName = e;

      this.$router.push({
        query: merge({}, this.params)
      })
      this.listNone = true;
      this.getName();
      this.getLoadingData();
    },
    // 搜索名称获取列表
    getList(name) {
      this.params = {
        start: this.startNum,
        limit: 20,
        zoneCode: this.areaCode,
        businessArea: this.bussinessCode,
        q: name
      }
      this.inputName = name;
      this.$router.push({
        query: merge({}, this.params)
      })
      if (name) {
        const item = {
          name: name
        }
        const list = JSON.parse(localStorage.getItem('historyRecord'));
        this.historyList = list;
        this.listHistory.push(item);
        localStorage.setItem('historyRecord', JSON.stringify(this.listHistory))
        this.listNone = true;
        this.getLoadingData();
      }
    },
    // 获取下拉加载值
    loading(data) {
      this.startNum = data;
      this.getLawyerList('update');
    },
    // 获取参数
    getParams() {
      const originParams = this.$route.query;
      console.log(originParams)
      this.params = originParams;
      this.startNum = originParams.start;
      this.areaCode = originParams.zoneCode;
      this.bussinessCode = originParams.businessArea;
      this.inputName = originParams.q;
      this.getLoadingData();
    },
    // 区县数据
    areaChoose() {
      this.chooseActive = true;
      this.type = 'area';
    },
    // 业务领域
    bussinessChoose() {
      this.chooseActive = true;
      this.type = 'bussiness';
    },

    // 选择区县
    chooseArea(index) {
      this.areaActive = index;
    },
    // 选择业务领域
    chooseBussiness(index) {
      this.bussinessActive = index;
    },

    // 取消
    cancel() {
      this.chooseActive = false;
    },
    // 确认
    confirm() {
      if (this.areaActive === 0) {
        this.areaName = '所在区县'
      } else {
        this.areaName = this.areaOptionsList[this.areaActive].name;
      }
      if (this.bussinessActive === 0) {
        this.bussinessName = '业务领域'
      } else {
        this.bussinessName = this.bussinessOptionsList[this.bussinessActive].name;

      }
      if (this.areaName === '全部') {
        this.areaCode = '';
      } else {
        this.areaCode = this.areaOriginArray[this.areaName];
      }
      if (this.bussinessName === '全部') {
        this.bussinessCode = '';
      } else {
        this.bussinessCode = this.bussinessOriginArray[this.bussinessName];
      }
      this.params = {
        start: this.startNum,
        limit: 20,
        zoneCode: this.areaCode,
        businessArea: this.bussinessCode,
        q: ''
      }
      this.$router.push({
        query: merge({}, this.params)
      })
      this.chooseActive = false;
      this.getLoadingData();

    },
    // 获取区县数据
    getArea() {
      api.getArea().then(res => {
        const listArea = res.data;
        this.areaOriginArray = listArea;
        this.areaOptionsList = Object.keys(listArea).map((item, index) => {
          return Object.assign({ name: item })
        })
        this.areaOptionsList.unshift({ name: '全部', })
      })
    },
    // 获取业务领域
    getBussiness() {
      api.getBussiness().then(res => {
        const listBussiness = res.data;
        this.bussinessOriginArray = listBussiness;
        this.bussinessOptionsList = Object.keys(listBussiness).map((item, index) => {
          return Object.assign({ name: item })
        });
        this.bussinessOptionsList.unshift({ name: '全部' })
      })
    },
    // 数据加载显示动画
    getLoadingData() {
      this.listLoading = true;
      setTimeout(() => {
        this.getLawyerList('get');
        this.listLoading = false;
      }, 1000);
    },
    // 获取数据列表
    getLawyerList(e) {
      const params = {
        start: this.startNum,
        limit: 20,
        zoneCode: this.areaCode,
        businessArea: this.bussinessCode,
        q: this.inputName
      }
      console.log(params)
      api.getLawyerList(params).then(res => {
        const result = res.data;
        if (result.code === 'success') {
          if (e === 'update') {
            result.lawyers.map(e => {
              const item = {
                id: e.id,
                assessment: e.assessment,
                dishonestyCount: e.dishonestyCount,
                imageUrl: e.imageUrl,
                licenseNumber: e.licenseNumber,
                name: e.name,
                practiceOrg: e.practiceOrg,
                practiceOrgId: e.practiceOrgId,
                practiceScope: e.practiceScope,
                practiceScopeArr: e.practiceScopeArr,
                practiceStatus: e.practiceStatus
              }
              this.listArray.push(item);
            })
          } else {
            this.listArray = result.lawyers;
          }
        }
      })
    },
    // 获取名称列表
    getNameList(e) {
      const params = {
        start: this.startNum,
        limit: 20,
        zoneCode: this.areaCode,
        businessArea: this.bussinessCode,
        q: this.inputName
      }
      api.getLawyerList(params).then(res => {
        const result = res.data;
        if (result.code === 'success') {
          result.lawyers.map(e => {
            const item = {
              id: e.id,
              name: e.name
            }
            this.recordList.push(item);
          })
        }
      })
    },
    // 关键字高亮
    KeyRegExp(val, keyword) {
      val = val + '';
      if (val.indexOf(keyword) !== -1 && keyword !== '') {
        return val.replace(keyword, '<font color="#333">' + keyword + '</font>')
      } else {
        return val
      }
    },
    // 分享页面时获取携带参数
    getName() {

      this.inputName = this.params.q;
      this.areaCode = this.params.zoneCode;
      this.bussinessCode = this.params.businessArea;
      if (!this.areaCode) {
        this.areaName = "所在区县"
      } else {
        const newAreaList = this.areaOriginArray;
        let resultArea = [];
        for (let key in newAreaList) {
          let value = newAreaList[key]; // value 属性值
          [value, key] = [key, value]; // 交换属性名和属性值
          resultArea[key] = value; // 设置结果
        }
        this.areaName = resultArea[this.areaCode];

      }
      if (!this.bussinessCode) {
        this.bussinessName = "业务领域"
      } else {
        console.log(this.bussinessActive, this.bussinessCode)
        const newBussinessList = this.bussinessOriginArray;
        let resultBussiness = [];

        for (let key in newBussinessList) {
          let value = newBussinessList[key]; // value 属性值
          [value, key] = [key, value]; // 交换属性名和属性值
          resultBussiness[key] = value; // 设置结果
        }
        this.bussinessName = resultBussiness[this.bussinessCode];
      }
    },
    handleScroll() {
      const top =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop; //兼容不同的浏览器
      console.log(top);
    }
  },
  watch: {


  },
  computed: {
    ...mapGetters([
    ]),

  },
  created() {
    this.getParams();
    this.getArea();
    this.getBussiness();
    setTimeout(() => {
      this.getName();
      this.listLoading = false;
    }, 1000);

  },
  destroyed() {
    window.removeEventListener("scroll", this.windowScroll, true);
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true); //监听滚动事件
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
@import "../assets/scss/common.scss";

.lawyer-container {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
.fixed {
  position: fixed !important;
  top: 0;
  left: 0;
}
</style>