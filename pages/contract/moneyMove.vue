<template>
  <view class="money_move">
    <view class="header_explain">
      <text>币种</text>
      <text>SC</text>
    </view>
    <view class="move">
      <view @click="toRouter('/pages/contract/editPay', { type: 1,leftName:leftName })">
        <text>SC</text>
        <text>{{ leftName }}</text>
      </view>
      <image src="../../static/images/contract/mo_tab.png" mode=""></image>
      <view @click="toRouter('/pages/contract/editPay', { type: 2 ,leftName:leftName})">
        <text>SC</text>
        <text>{{ rightName }}</text>
      </view>
    </view>
    <!-- from -->
    <view class="from_">
      <text>数量</text>
      <input type="text" v-model="from.money" placeholder="请填写划转数量" value="" />
    </view>
    <view class="from_tip">
      <text>最多可转出{{ money }}sc，</text>
      <text @click="all">全部划转</text>
    </view>
    <view class="btn" :class="btnActive ? 'btn_Active' : ''" @click="btn">确定</view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/contract_api.js';
import { toast, loading, model, fn } from '@/common/common.js';
//1.期权合约账户 2.永续合约账户 3.交割合约账户 4.币币账户 5.法币账户
let type ={
  '期权合约账户':'1',
  '永续合约账户':'2',
  '交割合约账户':'3',
  '币币账户':'4',
  '法币账户':'5'
}
export default {
  name: 'moneyMove',
  data() {
    return {
      back: 1,
      money: 0,
      leftName: '币币账户',
      rightName: '期权合约账户',
      from: {
        transactionPassword: '',
        money: ''
      }
    };
  },
  computed: {
    btnActive: function() {
      let bol = !isNaN(this.from.money) && this.from.money != '';
      return bol;
    }
  },
  onLoad(e) {
    if (e.type) {
      this.back = 1;
    } else {
      this.back = 2;
    }
    this.getMoney();
  },
  onShow() {
  },
  methods: {
    getMoney() {
      myAxios.getPower().then(res => {
        this.money = res.data.scBalances;
      });
    },
    all() {
      this.from.money = this.money;
    },
    btn() {
      if (!this.btnActive) return;
      if (this.money <= this.from.money) {
        toast({text:'请填写正确的金额'})
        return;
      }
      myAxios.moenyMove(Object.assign(this.from,{fromType:type[this.leftName],toType:type[this.rightName]})).then(res => {
        if (res.code == 1) {
          toast({ text: '划转成功' });
          setTimeout(() => {
            this.goBack(this.back);
          }, 1500);
        } else {
          toast({ text: '资金划转失败' });
        }
      });
      //
    },
    toRouter(url, data) {
      uni.navigateTo({
        url: url + fn.params(data)
      });
    },
    goBack(level) {
      uni.navigateBack({
        delta: level
      });
    }
  }
};
</script>

<style lang="scss">
.money_move {
  margin-top: 1px;
  background-color: #fff;
  color: #333;
  height: calc(100% - 1px);
  font-size: 32upx;
  > view {
    padding: 0 4%;
  }
  .btn {
    position: fixed;
    width: 92%;
    left: 4%;
    bottom: 50upx;
    color: #999999;
    line-height: 90upx;
    text-align: center;
    border-radius: 6upx;
    background: #f3f3f3;
  }
  .btn_Active {
    color: #fff;
    background: #534dff;
    box-shadow: 0px 8px 10px -8px #534dff;
  }
  .from_tip {
    font-size: 24upx;
    border-bottom: 20upx solid #f5f5f5;
    line-height: 104upx;
    text:nth-of-type(1) {
      color: #999;
    }
    text:nth-of-type(2) {
      color: #524cff;
    }
  }
  .from_ {
    height: 160upx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-bottom: 1px solid #f5f5f5;
    input {
      margin-top: 10upx;
    }
  }
  .move {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 168upx;
    border-bottom: 1px solid #f5f5f5;
    > image {
      width: 56upx;
      height: 56upx;
    }
    > view {
      display: flex;
      flex-direction: column;
      text:nth-of-type(1) {
        color: #999;
      }
      text:nth-of-type(2) {
        margin-top: 8upx;
        font-size: 28upx;
      }
    }
  }
  .header_explain {
    line-height: 100upx;
    display: flex;
    justify-content: space-between;
    border-bottom: 20upx solid #f5f5f5;
    > text:nth-of-type(1) {
      color: #999;
    }
  }
}
</style>
