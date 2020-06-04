<template>
  <view class="wm">
    <view class="tip"><text>请您填写真实的信息，概不负责</text></view>
    <view v-if="type == 0">
      <view class="row">
        <view class="top"><text>开户人</text></view>
        <view class="bt"><input type="text" placeholder="请填写开户人姓名" v-model="data.money" /></view>
      </view>
      <view class="row">
        <view class="top"><text>银行卡号</text></view>
        <view><input type="text" placeholder="请填写银行卡号" v-model="data.address" /></view>
      </view>
      <view class="row">
        <view class="top"><text>开户行</text></view>
        <view><input type="text" placeholder="请填写开户行" v-model="data.bankAddress" /></view>
      </view>
    </view>
    <view v-else>
      <view class="row">
        <view class="top"><text>真实姓名</text></view>
        <view><input type="text" placeholder="请填写真实姓名" v-model="data.bankAddress" /></view>
      </view>
      <view class="row">
        <view class="top"><text>支付宝账号</text></view>
        <view><input type="text" placeholder="请填写支付宝账号" v-model="data.bankAddress" /></view>
      </view>
    </view>
    <view class="sub" @click="submit">确认</view>
  </view>
</template>

<script>
import { addBank } from '@/api/wallet_api.js';
import { toast, loading } from '@/common/common.js';
export default {
  data() {
    return {
      data: {
        coinId: '',
        address: '',
        bankAddress: ''
      }
    };
  },
  onLoad(e) {
    this.type = e.type || 0;
    this.data.coinId = e.coinId;
    uni.setNavigationBarTitle({
      title: e.type==1?'添加支付宝':'添加银行卡'
    });
  },
  methods: {
    jump(url) {
      uni.navigateTo({
        url: url
      });
    },
    submit() {
      for (let i in this.data) {
        if (!this.data[i]) {
          toast({ text: '请填写正确的信息' });
          return;
        }
      }
      loading(1, '添加中');
      addBank(this.data)
        .then(res => {
          loading(2);
          if (res.code == 1) {
            toast({ icon: 'success', text: '添加成功' });
            setTimeout(() => {
              uni.navigateBack();
            }, 2000);
          } else {
            toast({ text: '添加失败' });
          }
        })
        .catch(err => {});
      console.log(this.data);
    }
  }
};
</script>

<style lang="scss" scoped>
.wm {
  height: calc(100% - 2px);
  margin-top: 2px;
  background-color: $uni-bg-color;
  .tip {
    padding: 20upx 5%;
    font-size: 32upx;
    background: #fffbf2;
    color: #ffc13b;
  }
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
