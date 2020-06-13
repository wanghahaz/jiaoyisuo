<template>
  <view v-if="total.scBanlance" class="editPay">
    <view v-if="leftName!='币币账户'||type==1" @click="edit('币币账户',total.scBanlance.toFixed(2))" class="list flex">
      <view class="flex">
        <text>币币账户</text>
        <text>可用余额 {{total.scBanlance.toFixed(2)}}</text>
      </view>
      <!-- <uni-icons type="checkmarkempty" color="#524cff" size="30" /> -->
    </view>
    <view v-if="leftName=='币币账户'||type==1" @click="edit('OTC账户',total.otcAccountBalances.toFixed(2))" class="list flex">
      <view class="flex">
        <text>OTC账户</text>
        <text>可用余额 {{total.otcAccountBalances.toFixed(2)}}</text>
      </view>
      <!-- <uni-icons type="checkmarkempty" color="#524cff" size="30" /> -->
    </view>
    <view v-if="leftName=='币币账户'||type==1" @click="edit('期权合约账户',total.contractAccountBalances)" class="list flex">
      <view class="flex">
        <text>期权合约账户</text>
        <text>可用余额 {{total.contractAccountBalances}}</text>
      </view>
      <!-- <uni-icons type="checkmarkempty" color="#524cff" size="30" /> -->
    </view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import { propertyList } from '@/api/wallet_api.js';
import { toast, loading, model, fn } from '@/common/common.js';
export default {
  name: 'editPay',
  data() {
    return {
      total:{},
      type: 0,
      leftName: ''
    };
  },
  onLoad(e) {
    this.type = e.type;
    this.leftName = e.leftName;
  },
  onShow() {
    this.propertyList()
  },
  methods: {
    propertyList() {
      loading(1, '加载中');
      propertyList({ type: 2 }).then(res => {
        loading(2);
        if (res.code == 1) {   
          this.total = res.data.total;
        }
      });
    },
    edit(name,moeny) {
      var pages = getCurrentPages();
      var page = pages[pages.length - 2];
      // #ifdef APP-PLUS
      if (this.type == 1) {
        page.$vm.leftName =name;
        page.$vm.moeny =moeny;
        // page.setData({
        //   leftName: name,
        //   moeny:moeny
        // });
      } else {
        page.$vm.rightName =name;
        // page.$vm.moeny =moeny;
        // page.setData({
        //   rightName: name
        // });
      }
      // #endif
      //#ifdef H5
      this.type == 1 ? (page._data.leftName = name) : (page._data.rightName = name);
      if(this.type==1) page._data.money =moeny
      // #endif
      uni.navigateBack();
    }
  },
  computed: {},
  components: {
    uniIcons
  }
};
</script>

<style scoped lang="scss">
.flex {
  display: flex;
}
.list {
  margin-top: 1px;
  background-color: #fff;
  padding: 5% 40upx;
  align-items: center;
  justify-content: space-between;
  font-size: 32upx;
  > view {
    flex-direction: column;
    > text:nth-of-type(2) {
      font-size: 28upx;
      color: #999;
      margin-top: 4upx;
    }
  }
}
</style>
