<template>
  <view class="sell_potence">
    <view style="height:20px"></view>
    <view class="head_img">
      <image src="../../static/images/contract/potence.png" mode=""></image>
      <text>亲爱的用户，为了保证您更好地控制期权净空带来的风险，需要您的资产达到一定的标准，才能开通卖方权限</text>
    </view>
    <view class="tip">
      <text>* 开通期权卖方权限，要求期权账户的账户权益</text>
      <text>不低于 2000SC</text>
    </view>
    <view class="money">
      <text>当前账户权益</text>
      <text>{{money}}sc</text>
    </view>
    <view class="sub">
      <text @click="goBack">返回期权首页</text>
      <text @click="toRouter('/pages/contract/moneyMove',{})">去资金划转</text>
    </view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/contract_api.js';
import { toast, loading, model, fn } from '@/common/common.js';
export default {
  name: '',
  data() {
    return {
      money:null
    };
  },
  onLoad(e) {},
  onShow() {
     this.getMoney()
  },
  methods: {
    getMoney(){
      myAxios.getPower().then( res =>{
        this.money =res.data.scBalances
      })
    },
    toRouter(url,data){
      uni.navigateTo({
        url: url + fn.params(data)
      });
    },
    goBack(){
      uni.navigateBack({
        
      })
    }
  }
};
</script>

<style lang="scss">
.sell_potence {
  font-size: 28upx;
  color: #333;
  margin-top: 1px;
  background: #fff;
  height: calc(100% - 1px);
  .money {
    border-bottom: 20upx solid #f5f5f5;
    border-top: 20upx solid #f5f5f5;
    display: flex;
    justify-content: space-between;
    padding: 0 4%;
    line-height: 114upx;
    font-size: 32upx;
    text:nth-of-type(2) {
      color: #fa3354;
    }
  }
  .head_img {
    position: relative;
    width: 92%;
    height: 354upx;
    margin: 0 4%;
    image {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
    text {
      display: inline-block;
      width: 90%;
      position: absolute;
      z-index: 10;
      left: 5%;
      bottom: 24upx;
    }
  }
  .tip {
    font-size: 24upx;
    padding: 0 4%;
    margin: 64upx 0 40upx 0;
    > text:nth-of-type(1) {
      color: #999;
    }
  }
  .sub {
    position: fixed;
    width: 92%;
    left: 4%;
    bottom: 4%;
    display: flex;
    justify-content: space-between;
    > text {
      text-align: center;
      box-sizing: border-box;
      width: 46%;
      line-height: 76upx;
      border-radius: 8upx;
    }
    > text:nth-of-type(1) {
      color: #534dff;
      border: 1px solid #534dff;
    }
    > text:nth-of-type(2) {
      background: #534dff;
      color: #fff;
      border-radius: 6upx;
    }
  }
}
</style>
