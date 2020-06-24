<template>
  <view class="">
    <!-- 遮罩层 -->
    <view @click="closeMask" v-if="model_show" class="maskBox"></view>
    <view v-if="model_show" class="maskContent">
      <view class="mask_header">
        <image class="bg_mask" src="../../../static/images/contract/mask_head.png" mode=""></image>
        <text class="text_mask">{{ headerType[subType] }}</text>
      </view>
      <view class="mask_sell" v-if="subType == 1 || subType == 2">
        <view class="mask_l">
          <text class="dark">价格</text>
          <text>{{ fromData.price }}</text>
        </view>
        <view class="mask_l">
          <text class="dark">数量</text>
          <text>{{ fromData.qty }}</text>
        </view>
        <view class="maskSub">
          <text class="cacel" @click="closeMask">取消</text>
          <text class="sure" @click="goSub">确认</text>
        </view>
      </view>
      <view class="mask_sell" v-if="subType == 3 || subType == 4 || subType == 5">
        <view class="mask_tip" v-if="subType == 4">
          <text>需求开通</text>
          <text class="potence">卖方权限</text>
        </view>
        <view class="mask_tip" v-if="subType == 3"><text>您的账户余额不足,请您先去充值</text></view>
        <view class="mask_tip" v-if="subType == 5"><text>您确认撤销吗?</text></view>
        <view class="maskSub">
          <text class="cacel" @click="closeMask">取消</text>
          <text v-if="subType == 3 || subType == 4" class="sure" @click="toRouter(subType)">前往{{ subType == 3 ? '充值' : '开通' }}</text>
          <text v-else class="sure" @click="sub">确认</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { toast, loading, model, fn } from '@/common/common.js';
import * as myAxios from '@/api/contract_api.js';
import maskBox from './model.vue';
let type = {
  '1': '买入',
  '2': '卖出',
  '3': '下单失败',
  '4': '下单失败',
  '5': '撤销'
};
export default {
  name: 'maskBox',
  props: {
    // 撤单id
    orderId: {
      type: Number
    },
    // 是否需要密码
    pwd: {
      type: Number
    },
    model_show: {
      type: Boolean,
      default: false
    },
    // subType 1:买入 2：卖出  3:买入下单失败  4:卖出下单失败  5：撤销
    subType: {
      type: Number,
      default: 1
    },
    // 卖出数量 和价钱
    fromData: {
      type: Object
    }
  },
  data() {
    return {
      headerType: type
    };
  },
  methods: {
    toRouter(type) {
      let url = type == 3 ? '/pages/contract/moneyMove' : '/pages/contract/sellPotence',
        data = { type: type };
      uni.navigateTo({
        url: url + fn.params(data)
      });
    },
    // 确认买卖
    async goSub() {
      //  需要判断买入卖出条件成立不成立  判断是否开启交易密码  如果没有开启 去设置  开启后输入密码
      let that = this;
      let res = await myAxios.getPower();
      if (res.code != '1') {
        toast({ text: '网络出错' });
        return;
      }
      // res.data.transactionPasswordIsNull  是否设置过交易密码 0：设置过  1：需要设置
      // res.data.needTransactionPassword    是否需要填写交易密码 0：不需要 1：需要
      if (res.data.needTransactionPassword == 0) {
        this.$emit('editType', { type: 2 });
      } else {
        if (res.data.transactionPasswordIsNull == 1) {
          uni.showModal({
            content: '您还没有设置交易密码，请您先去设置交易密码',
            success: function(res) {
              // console.log(res)
              if (res.confirm) {
                that.jump('/pages/user/changePwd', { type: 1 });
              }
            }
          });
        } else {
          this.$emit('editType', { type: 1 });
        }
      }
    },
    jump(url, data) {
      uni.navigateTo({
        url: url + fn.params(data)
      });
    },
    closeMask() {
      this.$emit('callBack', { type: 0 });
    },
    // 撤单操作
    sub() {
      loading('1', '加载中');
      myAxios.cancelOrder(this.orderId).then(res => {
        loading(2);
        this.closeMask();
        if (res.code == 1) {
          toast({ text: '撤单成功' });
          this.$emit('callBack', { type: 1 });
        } else {
          toast({ text: '撤单失败' });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.maskContent {
  position: fixed;
  z-index: 10;
  width: 76%;
  left: 12%;
  top: 50%;
  transform: translateY(-50%);
  .maskSub {
    display: flex;
    justify-content: space-between;
    .cacel,
    .sure {
      width: 46%;
      text-align: center;
      line-height: 72upx;
      box-sizing: border-box;
    }
    .cacel {
      color: #534dff;
      border: 1px solid #534dff;
    }
    .sure {
      background: #534dff;
      color: #fff;
      border-radius: 6upx;
    }
  }
  .mask_sell {
    font-size: 32upx;
    background: #fff;
    display: flex;
    flex-direction: column;
    padding: 60upx 30upx 40upx 30upx;
    border-radius: 0 0 10upx 10upx;
    .mask_tip {
      text-align: center;
      margin-bottom: 50upx;
      .potence {
        color: #fa3354;
      }
    }
    .mask_l {
      display: flex;
      justify-content: space-between;
      margin-bottom: 50upx;
      .dark {
        color: #999999;
      }
    }
  }
  .mask_header {
    width: 100%;
    height: 120upx;
    text-align: center;
    position: relative;
    .text_mask {
      position: relative;
      color: #fff;
      text-align: center;
      display: inline-block;
      margin-top: 20upx;
      z-index: 20;
      font-size: 40upx;
      &::before {
        position: absolute;
        left: 20%;
        bottom: -16upx;
        content: '';
        width: 60%;
        height: 4upx;
        background: #fff;
      }
    }
    .bg_mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
  }
}
.maskBox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.6);
}
</style>
