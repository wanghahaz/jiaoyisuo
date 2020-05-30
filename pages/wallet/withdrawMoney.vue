<template>
  <view class="wm">
    <view class="row">
      <view class="top">
        <text>银行卡号</text>
        <text @click="jump('/pages/user/cardList', { coinId: data.coinId })">选择银行卡</text>
      </view>
      <view><input type="text" disabled placeholder="请选择银行卡号" v-model="bankObj.address" /></view>
    </view>
    <view class="row">
      <view class="top"><text>开户行</text></view>
      <view><input type="text" disabled placeholder="请选择开户行" v-model="bankObj.bankAdress" /></view>
    </view>
    <view class="row">
      <view class="top"><text>提现数量</text></view>
      <view class="bt">
        <input type="text" placeholder="请填写提现数量" v-model="data.qty" />
        <text class="surplus">剩余可提现金额{{ surplus}}</text>
      </view>
    </view>
    <view class="tip">
      <view>温馨提示：</view>
      <view>说明文字，对提现的限制描述</view>
    </view>
    <view class="sub" @click="submit">提现</view>
  </view>
</template>

<script>
import { withdrawal } from '@/api/wallet_api.js';
import { toast, loading, fn } from '@/common/common.js';
export default {
  data() {
    return {
      surplus: '',
      bankObj:{ address: '', bankAdress: ''},
      data: {
        coinId: '',
        qty: ''
      }
    };
  },
  onLoad(e) {
    this.data.coinId = e.coidId;
    this.surplus = e.qty=='null'?'0':e.qty;
  },
  onShow() {
    // #ifdef APP-PLUS
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
 
    if (currPage.data.bankObj.bankAdress == undefined || currPage.data.bankObj.bankAdress == '') {
    } else {
      this.bankObj.address = currPage.data.bankObj.address;
      this.bankObj.bankAdress = currPage.data.bankObj.bankAdress;
    }
    // #endif
  },
  methods: {
    jump(url, data) {
      uni.navigateTo({
        url: url + fn.params(data)
      });
    },
    submit() {
      for (let i in this.data) {
        if (!this.data[i]) {
          toast({ text: '请您输入正确的格式' });
          return;
        }
      }
      if (this.surplus == 0 || this.data.qty > this.surplus) {
        toast({ text: this.surplus == 0 ? '提现金额为0' : '提现金额不得大于可提现金额' });
        return;
      }
      loading(1, '提现中，请等待');
      withdrawal(Object.assign(this.data,this.bankObj))
        .then(res => {
          if (res.code == 1) {
            toast({ icon: 'success', text: '提现成功' });
            setTimeout(() => {
              uni.navigateBack();
            }, 2000);
          } else {
            toast({ text: res.msg });
          }
        })
        .catch(err => {
          loading(2);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.wm {
  height: calc(100% - 2px);
  margin-top: 2px;
  background-color: $uni-bg-color;
  .sub {
    width: 92%;
    position: fixed;
    left: 4%;
    bottom: 2.5%;
    text-align: center;
    font-size: 28upx;
    color: rgba(255, 255, 255, 1);
    line-height: 90upx;
    border-radius: 6upx;
    background: rgba(83, 77, 255, 1);
    box-shadow: 0upx 8upx 8upx -2upx #c9d1ff;
  }
  .tip {
    width: 92%;
    margin: 90upx auto;
    height: 148upx;
    background: rgba(245, 245, 245, 1);
    border-radius: 8upx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    view {
      margin-left: 32upx;
      font-size: 28upx;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 40upx;
    }
  }
  .row {
    width: 92%;
    margin: 0 auto;
    padding: 40upx 0 30upx 0;
    border-bottom: 1px solid rgba(245, 245, 245, 1);
    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 28upx;
      text:nth-child(1) {
        font-size: 32upx;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 32upx;
      }
      text:nth-child(2) {
        font-size: 24upx;
      }
    }
    .bt {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      text {
        margin-bottom: 2px;
        font-size: 20upx;
        color: rgba(51, 51, 51, 1);
      }
    }
    input {
      font-size: 32upx;
    }
  }
}
</style>
