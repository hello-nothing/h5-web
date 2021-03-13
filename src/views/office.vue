<template>
  <div class="office-container" v-loading="listLoading">
    <div class="search-box">
      <i class="iconfont iconsearch1"></i>
      <el-input
        v-model="inputName"
        placeholder="输入律师名称或执业证号"
        clearable
        @input="nameChange"
        @blur="noFocus"
      ></el-input>
    </div>
    <div class="select-title-box">
      <div class="title-text" @click="areaChoose()">
        {{areaName}}
        <i class="iconfont icondown"></i>
        <!-- <i class="iconfont" :class="areaActive?'icondown':'iconup'"></i> -->
      </div>
      <div class="title-text" @click="orgTypeChoose()">
        {{orgTypeName}}
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
        <div class="area-box" v-if="type === 'orgType'">
          <div
            class="choose-list"
            :class="index === orgTypeActive?'active':''"
            @click="chooseOrgType(index)"
            v-for="(item,index) in orgTypeOptionsList"
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
  name: "office",
  data() {
    return {
      startNum: 0,

      inputName: '',
      listArray: [],

      params: Object,
      listType: 'office', // 列表类型

      chooseActive: false,
      areaOptionsList: [], // 区县列表
      orgTypeOptionsList: [], // 组织形式
      areaName: '所在区县', // 区县名称
      orgTypeName: '组织形式', // 业务领域

      areaCode: '', // 区县id
      orgTypeCode: '', //组织形式id

      orgTypeActive: 0,
      areaActive: 0,

      areaOriginArray: Object, // 区县原始数据
      orgTypeOriginArray: Object, //组织形式原始数据
      type: 'area', // 类型
      listLoading: true,

    }
  },
  methods: {
    ...mapActions([
    ]),
    // 失去焦点
    noFocus() {
      this.getLoadingData();
    },
    // 输入框值改变时
    nameChange(e) {
      this.startNum = 0;
      this.orgTypeCode = '';
      this.areaCode = '';
      this.params = {
        start: this.startNum,
        limit: 20,
        zoneCode: this.areaCode,
        businessArea: this.orgTypeCode,
        q: e
      }
      this.inputName = e;
      this.$router.push({
        query: merge({}, this.params)
      })
      this.getName();
      this.getLoadingData();
    },
    // 获取下拉加载值
    loading(data) {
      this.startNum = data;
      this.getOfficeList('update');
    },
    // 获取参数
    getParams() {
      // this.params = this.$route.query;
      const originParams = this.$route.query;
      console.log(originParams)

      this.params = originParams;
      this.startNum = originParams.start;
      this.areaCode = originParams.zoneCode;
      this.orgTypeCode = originParams.businessArea;
      this.inputName = originParams.q;
      this.getLoadingData();
    },
    // 数据加载显示动画
    getLoadingData() {
      this.listLoading = true;
      setTimeout(() => {
        this.getOfficeList('get');
        this.listLoading = false;
      }, 1000);
    },
    // 区县数据
    areaChoose() {
      this.chooseActive = true;
      this.type = 'area';
    },
    // 组织形式
    orgTypeChoose() {
      this.chooseActive = true;
      this.type = 'orgType';
    },
    // 选择区县
    chooseArea(index) {
      this.areaActive = index;
    },
    // 选择组织形式
    chooseOrgType(index) {
      this.orgTypeActive = index;
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
      if (this.orgTypeActive === 0) {
        this.orgTypeName = '组织形式'
      } else {
        this.orgTypeName = this.orgTypeOptionsList[this.orgTypeActive].name;

      }

      if (this.areaName === '全部') {
        this.areaCode = '';
      } else {
        this.areaCode = this.areaOriginArray[this.areaName];
      }
      if (this.orgTypeName === '全部') {
        this.orgTypeCode = '';
      } else {
        this.orgTypeCode = this.orgTypeOriginArray[this.orgTypeName];
      }
      this.params = {
        start: this.startNum,
        limit: 20,
        zoneCode: this.areaCode,
        businessArea: this.orgTypeCode,
        q: ''
      }
      this.$router.push({
        query: merge({}, this.params)
      });
      this.chooseActive = false;
      this.getLoadingData();
    },
    // 分享页面时获取携带参数
    getName() {
      this.inputName = this.params.q;
      this.areaCode = this.params.zoneCode;
      this.orgTypeCode = this.params.businessArea;
      if (!this.areaCode) {
        this.areaName = "所在区县"
      } else {
        console.log(this.areaActive)
        const newAreaList = this.areaOriginArray;
        let resultArea = [];
        for (let key in newAreaList) {
          let value = newAreaList[key]; // value 属性值
          [value, key] = [key, value]; // 交换属性名和属性值
          resultArea[key] = value; // 设置结果
        }
        this.areaName = resultArea[this.areaCode];
      }
      if (!this.orgTypeCode) {
        this.orgTypeName = "组织形式"
      } else {
        const newBussinessList = this.orgTypeOriginArray;

        let resultBussiness = [];

        for (let key in newBussinessList) {
          let value = newBussinessList[key]; // value 属性值
          [value, key] = [key, value]; // 交换属性名和属性值
          resultBussiness[key] = value; // 设置结果
        }
        this.orgTypeName = resultBussiness[this.orgTypeCode];
      }

    },
    // 获取数据列表
    getOfficeList(e) {
      const params = {
        start: this.startNum,
        limit: 20,
        zoneCode: this.areaCode,
        businessArea: this.orgTypeCode,
        q: this.inputName
      }
      api.getOfficeList(params).then(res => {
        const result = res.data;
        if (result.code === 'success') {
          if (e === 'update') {
            result.lawFirms.map(e => {
              const item = {
                id: e.id,
                address: e.address,
                assessment: e.assessment,
                imageUrl: e.imageUrl,
                dishonestyCount: e.dishonestyCount,
                name: e.name,
                licenseNumber: e.licenseNumber,
                practiceStatus: e.practiceStatus,
              }
              this.listArray.push(item);
            })
          } else {
            this.listArray = result.lawFirms;
          }
        }
      })
    },
    // 获取区县数据
    getArea() {
      api.getArea().then(res => {
        const listArea = res.data;
        this.areaOriginArray = listArea;
        this.areaOptionsList = Object.keys(listArea).map((item, index) => {
          return Object.assign({ name: item })
        })
        this.areaOptionsList.unshift({ name: '全部' })
      })
    },
    // 获取组织形式
    getOrgType() {
      api.getOrgType().then(res => {
        const listOrgType = res.data;
        this.orgTypeOriginArray = listOrgType;
        this.orgTypeOptionsList = Object.keys(listOrgType).map((item, index) => {
          return Object.assign({ name: item });
        });
        this.orgTypeOptionsList.unshift({ name: '全部' })
      })
    },

    // goBack() {
    //   this.$router.replace({ path: '/index' });
    //   //replace替换原路由，作用是避免回退死循环
    // },
  },
  watch: {
  },
  computed: {
    ...mapGetters([
    ])
  },
  created() {
    this.getParams();
    this.getArea();
    this.getOrgType();
    setTimeout(() => {
      this.getName();
      this.listLoading = false;
    }, 1000);
  },
  // destroyed() {
  //   window.removeEventListener('popstate', this.goBack, false);
  // },
  mounted() {
    // if (window.history && window.history.pushState) {
    //   history.pushState(null, null, document.URL)
    //   window.addEventListener('popstate', this.goBack, false);
    // }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
@import "../assets/scss/common.scss";

.office-container {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
</style>