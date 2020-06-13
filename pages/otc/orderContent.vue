<template>
  <view :class="status == 0 ? 'pt' : ''" class="orderContent">
    <view class="status_app"></view>
    <view class="header flex">
      <uni-icons @click="back_" color="#fff" class="icons" type="arrowleft" size="26" />
      <text class="header_name">{{ type == 0 ? '出售SC' : '购买SC' }}</text>
    </view>
    <!-- header -->
    <view v-if="content" class="status_header">
      <view v-if="status == 3 || status == '-1'" class="">
        <view>买家取消</view>
        <view>已取消订单</view>
      </view>
      <view v-if="status == 2 && type_order != 'order'" class="">
        <view>交易完成</view>
        <view>资产已划转至{{ type == 0 ? '对方' : '您' }}的账户</view>
      </view>
      <view v-if="status == 0 && type == 1 && type_order != 'order'" class="pending">
        <view>￥{{ (content.otcOrdersDetailsInfo.price * content.otcOrdersDetailsInfo.qty).toFixed(2) }}</view>
        <view v-if="s">
          <text>请在</text>
          {{ s.minutes }}m {{ s.seconds }}s
          <text>内付款给商家</text>
        </view>
      </view>
      <view v-if="status == 1 && type == 1 && type_order != 'order'" class="pending">
        <view>￥{{ (content.otcOrdersDetailsInfo.price * content.otcOrdersDetailsInfo.qty).toFixed(2) }}</view>
        <view><text>已付款，等待卖家放币</text></view>
      </view>
      <view v-if="type_order == 'order'" class="pending">
        <view>￥{{ (content.otcOrdersDetailsInfo.price * content.otcOrdersDetailsInfo.qty).toFixed(2) }}</view>
        <!-- <view><text>已付款，等待卖家放币</text></view> -->
      </view>
      <view v-if="status == 0 && type == 0" class="pending">
        <view>￥{{ (content.otcOrdersDetailsInfo.price * content.otcOrdersDetailsInfo.qty).toFixed(2) }}</view>
        <view>
          <text>等待买家付款</text>
          <!-- <text>预计</text>
           {{s.minutes}}``{{s.seconds}}
          <text>超时自动取消</text> -->
        </view>
      </view>
      <view v-if="status == 1 && type == 0" class="pending">
        <view>￥{{ (content.otcOrdersDetailsInfo.price * content.otcOrdersDetailsInfo.qty).toFixed(2) }}</view>
        <view><text>买家已付款，请放币</text></view>
      </view>
    </view>
    <!-- 购买 -->
    <view class="deal_centent buy_deal" v-if="type == 1 && status == 0 && content">
      <view class="flex">
        <view>
          <image class="icon_pay" v-if="pay_type == 1" src="../../static/images/otc/zfb.png" mode=""></image>
          <image class="icon_pay" v-else src="../../static/images/otc/bank.png" mode=""></image>
          <text>{{ pay_type == 1 ? '支付宝' : '银行卡' }}</text>
        </view>
        <view v-if="content.aliAddressInfo && content.withdrawAddressInfo" @click="payStatus">
          <text>切换支付方式</text>
          <uni-icons color="#999" class="icons" type="arrowright" size="14" />
        </view>
      </view>
      <view v-if="content.aliAddressInfo || content.withdrawAddressInfo">
        <text>收款姓名</text>
        <text>{{ pay_type == 1 ? content.aliAddressInfo.userName : content.withdrawAddressInfo.userName }}</text>
      </view>
      <view v-if="content.aliAddressInfo || content.withdrawAddressInfo" class="icon_copy">
        <text>{{ pay_type == 1 ? '支付宝账号' : '收款卡号' }}</text>
        <text>{{ pay_type == 1 ? content.aliAddressInfo.account : content.withdrawAddressInfo.address }}</text>
        <text @click="copy(pay_type == 1 ? content.aliAddressInfo.account : content.withdrawAddressInfo.address)" class="iconfont iconfuzhi"></text>
      </view>
      <view v-if="pay_type == 2">
        <text>银行信息</text>
        <text>{{ content.withdrawAddressInfo.bankAddress }}</text>
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
    <view class="deal_centent" v-if="(status == 3 || status == '-1' || status == 2 || status == 1 || type == 0) && content">
      <view>
        <text>交易总额</text>
        <text>￥{{ (content.otcOrdersDetailsInfo.price * content.otcOrdersDetailsInfo.qty).toFixed(2) }}</text>
      </view>
      <view>
        <text>交易数量</text>
        <text>{{ content.otcOrdersDetailsInfo.qty }}SC</text>
      </view>
      <view>
        <text>交易单价</text>
        <text>￥{{ content.otcOrdersDetailsInfo.price.toFixed(2) }}</text>
      </view>
      <view>
        <text>交易时间</text>
        <text>{{ toTime(content.otcOrdersDetailsInfo.createTime) }}</text>
      </view>
      <!--  <view class="icon_copy">
        <text>订单编号</text>
        <text>154654651564</text>
        <text @click="copy('123415456')" class="iconfont iconfuzhi"></text>
      </view> -->
      <view v-if="status == 3 || status == '-1' || status == 1 || type == 0" class="deal_tip">
        若要购买其他数字货币，请将
        <text>账户</text>
        资产划转至
        <text>币币账户</text>
        ，之后即可进行交易
      </view>
    </view>
    <view v-if="(status == 0 || status == 1) && content && type_order != 'order'" :class="type == 0 ? 'top_top' : ''" class="deal_warn">
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
    <!--  <view v-if="status == 1" class="deal_centent deal_detail">
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
    </view> -->
    <!-- @click="toRouter('/pages/contract/moneyMove', { coidId: total.coidId, qty: total.scBanlance })" -->
    <view v-if="status == 2 && content" @click="toRouter('/pages/contract/moneyMove', { coidId: 1, qty: 0 })" class="toMoney">划转资产</view>
    <!-- 切换支付方式 -->
    <view v-if="pay_show" @click="payStatus" class="mask"></view>
    <view :class="pay_show ? 'mask_content' : ''" class="pay_box">
      <view class="pay_title">支付方式</view>
      <view>
        <view @click="editPay(1)" class="pay_list">
          <view>
            <image src="../../static/images/otc/zfb.png" mode=""></image>
            <text>支付宝</text>
          </view>
          <uni-icons v-if="pay_type == 1" class="icon_uni" color="#534dff" size="28" type="checkmarkempty" />
        </view>
        <view @click="editPay(2)" class="pay_list">
          <view>
            <image src="../../static/images/otc/bank.png" mode=""></image>
            <text>银行卡</text>
          </view>
          <uni-icons v-if="pay_type == 2" class="icon_uni" color="#534dff" size="28" type="checkmarkempty" />
        </view>
      </view>
    </view>
    <!-- subs 按钮 -->
    <view v-if="status == 1 && type == 0 && content && type_order != 'order'" class="sell_sub subs"><text @click="sell_subs" class="blue">确认收款</text></view>
    <view v-if="status == 0 && type == 1 && content" class="buy_sub subs">
      <text @click="buy_subs(0)">取消订单</text>
      <text @click="buy_subs(1)" class="blue">已付款,请放币</text>
    </view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/otc.js';
import { toast, loading, model, fn } from '@/common/common.js';
import { timestampToTime, diffTime } from '@/common/timestampToTime.js';
let timers = null;
export default {
  name: '',
  data() {
    return {
      s: null,
      type_order: '',
      content: null,
      pay_show: false,
      pay_type: 1, //1 zfb  2 bank
      type: 0, // 0. sell 1. buy
      status: 0 //0 :取消   1：完成 2：进行中 ( 0 :进行中  1：进行中 2：已完成  3.已取消)
    };
  },
  onLoad(e) {
    this.id = e.id;
    this.type = e.type;
    this.type_order = e.type_order;
    // this.status = e.status;
    console.log(e);
    this.get_order(e.type_order);
  },
  onUnload: function() {
    if (timers) {
      clearInterval(timers);
      timers = null;
    }
  },
  onHide() {
    if (timers) {
      clearInterval(timers);
      timers = null;
    }
  },
  onShow() {},
  methods: {
    get_order(types) {
      let type = types == 'trade' ? 'tradeId' : 'orderId';
      let data = {};
      data[type] = this.id;
      data.type = this.type;
      loading(1, '加载中...');
      myAxios.getOrder(data).then(res => {
        loading(2);
        console.log(res);
        this.status = res.data.otcOrdersDetailsInfo.status;
        this.content = res.data;
        this.pay_type = res.data.aliAddressInfo ? 1 : 2;
        if (this.status == 0 && res.data.otcOrdersDetailsInfo.cancelTime && new Date().getTime() < res.data.otcOrdersDetailsInfo.cancelTime) {
          timers = setInterval(() => {
            let time = new Date().getTime();
            this.s = diffTime(time, res.data.otcOrdersDetailsInfo.cancelTime);
            console.log(this.s);
            if (this.s.seconds == '00' && this.s.minutes == '00') {
              clearInterval(timers);
              this.get_order(this.type_order);
            }
          }, 1000);
        }
      });
    },
    editPay(type) {
      this.pay_type = type;
      this.payStatus();
    },
    payStatus() {
      this.pay_show = !this.pay_show;
    },
    copy(e) {
      console.log(e);
      uni.setClipboardData({
        data: e,
        success: function() {
          console.log('success');
        }
      });
    },
    back_() {
      uni.navigateBack({
        delta: 1
      });
    },
    toRouter(url, data) {
      uni.navigateTo({
        url: url + fn.params(data)
      });
    },
    async buy_subs(type) {
      let obj = {};
      type == 0 ? (obj = { title: '取消订单', text: '您确认取消订单么？' }) : (obj = { title: '确认付款' });
      model(obj).then(res => {
        if (res) {
          if (type == 0) {
            myAxios.editOrder({ status: '-1', tradeId: this.id }).then(r => {
              console.log(r);
              if (r.code == 1) {
                toast({ text: '操作成功' });
                setTimeout(() => {
                  this.get_order(this.type_order);
                }, 1500);
              } else {
                toast({ text: r.msg || '操作失败' });
              }
            });
          } else {
            myAxios.editOrder({ status: '1', tradeId: this.id }).then(r => {
              console.log(r);
              if (r.code == 1) {
                toast({ text: '操作成功' });
                setTimeout(() => {
                  this.get_order(this.type_order);
                }, 1500);
              } else {
                toast({ text: r.msg || '操作失败' });
              }
            });
          }
        }
      });
    },
    sell_subs() {
      model({ title: '确认收款', text: '', stext: '确认收款' }).then(res => {
        if (res) {
          myAxios.editOrder({ status: '2', tradeId: this.id }).then(r => {
            console.log(r);
            if (r.code == 1) {
              toast({ text: '操作成功' });
              setTimeout(() => {
                this.get_order(this.type_order);
              }, 1500);
            } else {
              toast({ text: r.msg || '操作失败' });
            }
          });
        }
      });
    }
  },
  computed: {
    toTime() {
      return function(time) {
        return timestampToTime(time, 'dateTime');
      };
    }
  },
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
  .pay_box {
    position: fixed;
    left: 0;
    bottom: 0;
    background: #fff;
    width: 100%;
    z-index: 100;
    padding-bottom: 80upx;
    box-sizing: border-box;
    transform: translateY(100%);
    transition: all 0.4s;
    > view {
      padding: 0 5%;
    }
    .pay_title {
      text-align: center;
      line-height: 100upx;
      border-bottom: 1px solid #f5f5f5;
    }
    .pay_list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > view {
        margin-top: 40upx;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .icon_uni {
        margin-top: 12px;
      }
    }
    image {
      margin-right: 5px;
      width: 46upx;
      height: 46upx;
    }
  }
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
  .icon_copy {
    padding-right: 40upx;
    position: relative;
    .iconfuzhi {
      position: absolute;
      right: 0;
      top: 3px;
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
    .icon_pay {
      width: 40upx;
      height: 40upx;
      margin-right: 4px;
    }
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
    height: 160upx;
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
      background: #fff;
    }
    .blue {
      background: $active;
      @extend .blue_shadow;
    }
  }
  .buy_sub {
    justify-content: space-between;
    text:nth-of-type(1) {
      color: #333;
      border: 1px solid #f0f0f2;
    }
    text {
      width: 45%;
    }
  }
}
.pt {
  padding-bottom: 180upx;
}
</style>
