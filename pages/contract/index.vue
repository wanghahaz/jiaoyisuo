<template>
  <view class="contract">
    <view class="title">
      <text :class="titleIndex == ind ? 'titActive' : ''" @click="tab(ind, item.add)" v-for="(item, ind) in titleList" :key="ind">{{ item.name }}</text>
    </view>
    <!-- <keep-alive>
      <all-contract :is="componenWts_name"></all-contract>
      <deal-contract :is="components_name"></deal-contract>
      <entrust :is="components_name"></entrust>
      <hold-contract :is="components_name"></hold-contract>
    </keep-alive> -->
    <all-contract @editTab="editTab" @getId="getId" :headerInd="headerIndex" :parShow="parShow" v-if="components_name == 'allContract'"></all-contract>
    <deal-contract :socketId="id" :parShow="parShow" v-else-if="components_name == 'dealContract'"></deal-contract>
    <entrust-contract v-else-if="components_name == 'entrustContract'"></entrust-contract>
    <hold-contract v-else></hold-contract>
     <!-- <tab-bar :current="currentTabIndex"></tab-bar> -->
  </view>
</template>

<script>
import allContract from './components/all.vue';
import dealContract from './components/deal.vue';
import entrustContract from './components/entrust.vue';
import holdContract from './components/hold.vue';
export default {
  components: {
    allContract,
    dealContract,
    holdContract,
    entrustContract
  },
  data() {
    return {
      currentTabIndex:3,
      id: 0,
      headerIndex: 0,
      parShow: false,
      barHeight: 0,
      components_name: 'allContract',
      titleIndex: 0,
      titleList: [{ name: '全部期权', add: 'all' }, { name: '交易', add: 'deal' }, { name: '委托', add: 'entrust' }, { name: '持仓', add: 'hold' }]
    };
  },
  // 组件属性重置
  onShow() {
    this.parShow = false;
    this.headerIndex = 0;
  },
  onHide() {
    this.parShow = true;
    this.headerIndex = 4;
  },
  onLoad() {
     // uni.hideTabBar()
    //#ifdef APP-PLUS
    var height = plus.navigator.getStatusbarHeight();
    this.barHeight = height;
    // #endif
    // #ifdef H5
    this.barHeight = 44;
    // #endif
    if (uni.getStorageSync('id')) {
      this.titleIndex = 1; //如果id 存在的话 跳转交易模块并回显 名字
      this.components_name = 'dealContract';
      this.getId({ id: uni.getStorageSync('id') });
      uni.removeStorageSync('id');
    }
  },
  methods: {
    editTab(data) {
      this.tab(data.index, data.name);
    },
    // 设置交易页面id
    getId(data) {
      this.id = data.id;
    },
    tab(ind, add) {
      if (ind != this.titleIndex) {
        this.model_show = false;
        this.titleIndex = ind;
        this.components_name = `${add}Contract`;
      }
    }
  }
};
</script>

<style lang="scss">
$fs16: 32upx;
$fs14: 28upx;
$text_c: #534dff;
.contract {
  background: #fff;
  font-family: PingFangSC-Medium, PingFang SC;
  .all_contract,
  .entrust_contract,
  .hold_contract,
  .deal_contract {
    position: fixed;
    width: 100%;
    height: calc(100% - 92upx);
  }
  .title {
    margin-top: 1px;
    z-index: 99;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    padding: 0 30upx;
    justify-content: space-between;
    font-size: $fs16;
    line-height: 92upx;
    > text {
      position: relative;
    }
    .titActive {
      font-weight: bold;
      color: $text_c;
      &::before {
        position: absolute;
        content: '';
        width: 100%;
        height: 4upx;
        background: $text_c;
        bottom: 0;
      }
    }
  }
}
</style>
