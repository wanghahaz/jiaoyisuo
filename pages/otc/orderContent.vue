<template>
  <view :class="status == 2 ? 'pt' : ''" class="orderContent">
    <view class="status_app"></view>
    <view class="header flex">
      <uni-icons @click="back_" color="#fff" class="icons" type="arrowleft" size="26" />
      <text class="header_name">{{ type == 0 ? '出售SC' : '购买SC' }}</text>
    </view>
    <!-- header -->
    <view class="status_header">
      <view v-if="status == 0" class="">
        <view>买家取消</view>
        <view>您已取消订单</view>
      </view>
      <view v-if="status == 1" class="">
        <view>交易完成</view>
        <view>资产已划转至您的账户</view>
      </view>
      <view v-if="status == 2 && type == 1" class="pending">
        <view>￥72.00</view>
        <view>
          <text>请在</text>
          7``20
          <text>内付款给商家</text>
        </view>
      </view>
      <view v-if="status == 2 && type == 0" class="pending">
        <view>￥72.00</view>
        <view>
          <text>预计</text>
          7``20
          <text>超时自动取消</text>
        </view>
      </view>
    </view>
    <!-- 购买 -->
    <view class="deal_centent buy_deal" v-if="type == 1 && status == 2">
      <view class="flex">
        <view>
          <text class="iconfont iconzfb icons"></text>
          <text>支付宝</text>
        </view>
        <view>
          <text>切换支付方式</text>
          <uni-icons color="#999" class="icons" type="arrowright" size="14" />
        </view>
      </view>
      <view>
        <text>收款姓名</text>
        <text>张三</text>
      </view>
      <view>
        <text>收款卡号</text>
        <text>3256 8564 2458 6412</text>
      </view>
      <view>
        <text>银行信息</text>
        <text>中信银行</text>
      </view>
      <view class="deal_tip">
        若要购买其他数字货币，请将
        <text>账户</text>
        资产划转至
        <text>币币账户</text>
        ，之后即可进行交易
      </view>
    </view>
    <!-- 交易详情 -->
    <view class="deal_centent" v-if="status == 0 || status == 1 || type == 0">
      <view>
        <text>交易总额</text>
        <text>￥100.00</text>
      </view>
      <view>
        <text>交易数量</text>
        <text>2.15SC</text>
      </view>
      <view>
        <text>交易单价</text>
        <text>￥200</text>
      </view>
      <view>
        <text>交易时间</text>
        <text>2020-05-14 12:00:00</text>
      </view>
      <view>
        <text>订单编号</text>
        <text>￥200</text>
      </view>
      <view v-if="status == 1 || type == 0" class="deal_tip">
        若要购买其他数字货币，请将
        <text>账户</text>
        资产划转至
        <text>币币账户</text>
        ，之后即可进行交易
      </view>
    </view>
    <view v-if="status == 2" :class="type == 0 ? 'top_top' : ''" class="deal_warn">
      <view>交易提醒</view>
      <view>
        <text class="darger">请勿备注任何信息</text>
        ，如：sc、荆山玉珏，以及其他数字资产名称于庄张备注，防止造成您的汇款被拦截，银行卡被冻结等问题。
      </view>
      <view>
        非工作时间
        <text class="dark">（节假日及工作日的17:00-8:00）</text>
        大于5W以上的跨行汇款，请分批支付
      </view>
      <view>请确保付款卡所属人与平台实名信息一致，若不一致致卖家有权不放币。请不要使用支付宝转银行卡等到账时间较长的付款方式。</view>
    </view>
    <!-- 交易明细 -->
    <view v-if="status == 1 || status == 2" class="deal_centent deal_detail">
      <view><text>交易明细</text></view>
      <view>
        <text>支付方式</text>
        <text>支付宝（186 3578 4592）</text>
      </view>
      <view v-if="type == 0">
        <text>收款金额</text>
        <text>￥200.00</text>
      </view>
      <view>
        <text>{{ type == 0 ? '收款' : '付款' }}名称</text>
        <text>沈怡</text>
      </view>
      <view>
        <text>支付时间</text>
        <text>2020-05-14 16:20:00</text>
      </view>
      <view>
        <text>{{ type == 0 ? '买家' : '卖家' }}昵称</text>
        <text>kyc3</text>
      </view>
    </view>

    <view v-if="status == 1" @click="toRouter('', {})" class="toMoney">划转资产</view>
    <view v-if="status == 2 && type == 0" class="sell_sub subs"><text>确认收款</text></view>
    <view v-if="status == 2 && type == 1" class="buy_sub subs blue"><text>已付款,请放币</text></view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/otc.js';
import { toast, loading, model, fn } from '@/common/common.js';
export default {
  name: '',
  data() {
    return {
      type: 0,
      status: 0 //0 :取消  1：完成 2：进行中
    };
  },
  onLoad(e) {
    this.type = e.type;
    this.status = e.status;
    console.log(e);
  },
  onShow() {},
  methods: {
    back_() {
      uni.navigateBack({
        delta: 1
      });
    },
    toRouter(url, data) {
      uni.navigateTo({
        url: url + fn.params(data)
      });
    }
  },
  computed: {},
  components: {
    uniIcons
  }
};
</script>

<style scoped lang="scss">
@import './index.scss';
.orderContent {
  padding-bottom: 30upx;
  font-size: 32upx;
  /* #ifdef APP-PLUS */
  padding-top: var(--status-bar-height);
  /* #endif */
  .deal_warn {
    width: 92%;
    margin: 0 4%;
    margin-top: -30upx;
    box-sizing: border-box;
    background: #fff;
    border-radius: 4px;
    padding: 40upx 0upx;
    margin-bottom: 50upx;
    view {
      padding: 0 30upx;
    }
    > view:nth-of-type(1) {
      padding-bottom: 30upx;
      border-bottom: 1px solid #f5f5f5;
    }
    > view:not(:nth-of-type(1)) {
      margin-top: 30upx;
      font-size: 26upx;
      line-height: 1.5;
      .dark {
        color: #999;
      }
      .darger {
        color: #fa3354;
      }
    }
  }
  .deal_centent {
    position: relative;
    top: -34px;
    width: 92%;
    margin: 0 4%;
    box-sizing: border-box;
    background: #fff;
    border-radius: 4px;
    padding: 40upx 30upx;
    > view {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30upx;
      > text:nth-of-type(1) {
        color: #999;
      }
      .icons {
        margin-top: 4upx;
      }
    }
    .deal_tip {
      box-sizing: border-box;
      flex-wrap: wrap;
      background-color: #f5f5f5;
      font-size: 28upx;
      padding: 20upx 30upx;
      border-radius: 4px;
      margin-bottom: 0;
      justify-content: flex-start;
      color: #999;
      text {
        color: #333 !important;
      }
    }
  }
  .deal_detail {
    top: -10px;
  }
  .top_top {
    top: -10px;
  }
  .buy_deal {
    > view:nth-of-type(1) {
      align-items: center;
      border-bottom: 1px solid #f5f5f5;
      padding-bottom: 30upx;
      color: #999;
      > view {
        display: flex;
        align-items: center;
        .icons {
          color: #1296db;
          font-size: 20px;
          margin-right: 10upx;
        }
      }
    }
  }
  .status_header {
    padding: 0upx 5%;
    box-sizing: content-box;
    /* #ifdef APP-PLUS */
    padding-top: var(--status-bar-height);
    /* #endif */
    margin-top: 44px;
    background: $active;
    height: 240upx;
    > view:nth-of-type(1) {
      padding: 10upx 0;
      view:nth-of-type(1) {
        color: #fff;
        font-size: 40upx;
      }
      view:nth-of-type(2) {
        margin-top: 10upx;
        color: #ffc13b;
        text {
          color: #fff;
        }
      }
    }
  }
  .header {
    position: fixed;
    width: 100%;
    height: 44px;
    align-items: center;
    background: $active;
    top: 0;
    left: 0;
    color: #fff;
    z-index: 99;
    /* #ifdef APP-PLUS */
    top: var(--status-bar-height);
    /* #endif */
    justify-content: center;
    font-size: 32upx;
    .icons {
      position: absolute;
      left: 2%;
    }
  }
  .toMoney {
    width: 92%;
    margin: 40upx 4% 30upx 4%;
    line-height: 90upx;
    color: #fff;
    background: $active;
    text-align: center;
    border-radius: 4px;
    box-shadow: 0px 6px 16px -6px $active;
  }
  .subs {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 170upx;
    display: flex;
    box-sizing: border-box;
    background: #fff;
    padding: 0 5%;
    text {
      border-radius: 4px;
      color: #fff;
      margin-top: 30upx;
      height: 90upx;
      line-height: 90upx;
      text-align: center;
      width: 100%;
      background: #e9e9e9;
    }
  }
  .blue {
    text {
      background: $active;
      @extend  .blue_shadow;
    }
  }
}
.pt {
  padding-bottom: 180upx;
}
</style>
