<template>
  <view class="buyOtc" v-if="order && order.order">
    <view class="status_app"></view>
    <view class="header flex">
      <uni-icons @click="back_" color="#fff" class="icons" type="arrowleft" size="26" />
      <text class="header_name">{{ buy_pay == 0 ? '购买SC' : '出售SC' }}</text>
    </view>
    <view class="otc_header">
      <view>
        <text>￥{{ order.order.price.toFixed(2) }}</text>
        <text>/SC</text>
      </view>
      <view>还剩{{ s }}s，超时自动取消</view>
    </view>
    <view class="from">
      <view class="input flex">
        <input type="text" v-model="from.qty" placeholder="请输入想要购买总数量" />
        <text class="name">SC</text>
        <text class="all">全部</text>
      </view>
      <view class="input flex">
        <input type="text" v-model="sums" disabled placeholder="请输入想要购买总金额" />
        <text class="name">CNY</text>
        <text class="all">全部</text>
      </view>
    </view>
    <view v-if="buy_pay == 1" class="pay flex">
      <view>收款方式</view>
      <view>
        <view @click="toRouter('/pages/otc/payList', { type: 1})">
          <text>支付宝</text>
          <text class="account">{{ alis.acount }}</text>
          <text class="iconfont iconxialabeifen"></text>
        </view>
        <view @click="toRouter('/pages/otc/payList', { type: 0 })">
          <text>银行卡</text>
          <text class="account">{{ bank.acount }}</text>
          <text class="iconfont iconxialabeifen"></text>
        </view>
      </view>
    </view>
    <view class="content">
      <view>
        <text>{{ buy_pay == 0 ? '卖家信息' : '买家信息' }}</text>
        <text></text>
      </view>
      <view>
        <text>{{ buy_pay == 0 ? '卖家昵称' : '买家昵称' }}</text>
        <text>{{ order.order.userName }}</text>
      </view>
      <view class="no_bt">
        <text>放币时效</text>
        <text>0`30</text>
      </view>
    </view>
    <view :class="from.qty && sums ? 'subs_active' : ''" class="subs" v-if="buy_pay == 0" @click="sub">购买</view>
    <view :class="from.qty && sums && (bank.id || alis.id) ? 'subs_active' : ''" class="subs" v-else @click="sub">购买</view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/otc.js';
import { toast, loading, model, fn } from '@/common/common.js';
let timers = null;
export default {
  name: 'buyOtc',
  data() {
    return {
      s: 60,
      id: '',
      order: null,
      buy_pay: 0, //1 购买 0 出售
      bank: {
        id: '',
        acount: ''
      },
      alis: {
        id: '',
        acount: ''
      },
      from: {
        qty: ''
      }
    };
  },
  onLoad(e) {
    this.buy_pay = e.type;
    this.id = e.id;
    this.getOrder();
    // timers=setInterval(()=>{
    //     this.s--;
    //     if(this.s==0){
    //       clearInterval(timers)
    //       this.back_()
    //     }
    // },1000)
  },
  onHide() {
    if (timers) {
      clearInterval(timers);
    }
  },
  methods: {
    getOrder() {
      loading(1, '加载中....');
      myAxios
        .selfOrder({ orderId: this.id })
        .then(res => {
          loading(2);
          // console.log(res);
          if (res.code == 1) {
            this.order = res.data;
          } else {
            toast({ text: res.msg || '加载失败' });
          }
        })
        .catch(err => {});
    },
    async sub() {
      if (this.sums == '') {
        toast({ text: '请输入您要购买的数量' });
        return false;
      }
      if (this.buy_pay == 1) {
        if (this.bank.id == '' && this.alis.id == '') {
          toast({ text: '请至少选择一种收款方式' });
          return false;
        }
      }
      loading(1, '加载中');
      let data = { type: this.buy_pay == 0 ? 1 : 2, price: this.order.order.price, qty: this.from.qty, othersideOrderId: this.id, othersideUserId: this.order.order.userId };
      if (this.buy_pay == 1) {
        data.bankId = this.bank.id;
        data.aliId = this.alis.id;
      }
      let res =await myAxios.addOrder(data)
      // console.log(res)
      if(res.code ==1){
        toast({text:'操作成功'})
        setTimeout(()=>{
           this.toRouter('/pages/otc/orderContent', { id: res.data, type: 1, status: 1 });
        },1500)
      }else{
        toast({text:res.msg||'操作失败'})
      }
      loading(2);
    },
    toRouter(url, data) {
      uni.navigateTo({
        url: url + fn.params(data)
      });
    },
    back_() {
      uni.navigateBack({
        delta: 1
      });
    }
  },
  computed: {
    sums() {
      if (isNaN(this.from.qty) || this.from.qty == '') {
        return '';
      } else {
        return (this.from.qty * this.order.order.price).toFixed(2);
      }
    }
  },
  components: {
    uniIcons
  }
};
</script>

<style scoped lang="scss">
@import './index.scss';
.buyOtc {
  padding-bottom: 130upx;
  font-size: 32upx;
  .otc_header {
    /* #ifdef APP-PLUS */
    margin-top: var(--status-bar-height);
    /* #endif */
    font-size: 32upx;
    color: #fff;
    background: $active;
    padding: 50px 5% 100upx 5%;
    > view:nth-of-type(1) {
      margin-bottom: 6upx;
      text:nth-of-type(1) {
        font-size: 40upx;
      }
      text:nth-of-type(2) {
        font-size: 30upx;
        margin-left: 4upx;
      }
    }
  }
  .content,
  .from,
  .pay {
    width: 92%;
    margin: -60upx 4% 0 4%;
    background: #fff;
    box-sizing: border-box;
    padding: 40upx 30upx;
    border-radius: 4px;
  }
  .content {
    margin-top: 40upx;
    > view {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20upx;
      > text:nth-of-type(1) {
        color: #999;
      }
    }
    .no_bt {
      margin-bottom: 0;
    }
  }
  .from {
    .input {
      position: relative;
      height: 90upx;
      margin-bottom: 30upx;
      width: 100%;
      input {
        box-sizing: border-box;
        position: absolute;
        width: 100%;
        padding: 0 40% 0 20upx;
        height: 100%;
        border: 1px solid #f5f5f5;
        border-radius: 4px;
      }
      .all {
        right: 20upx;
        color: $active;
      }
      .name {
        right: 120upx;
      }
      .name,
      .all {
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
      }
    }
  }
  .pay {
    justify-content: space-between;
    margin-top: 40upx;
    > view:nth-of-type(1) {
      color: #999;
    }
    > view:nth-of-type(2) {
      > view:nth-of-type(1) {
        margin-bottom: 5px;
      }
      view {
        justify-content: flex-end;
        display: flex;
        align-items: center;
      }
    }
    .account {
      color: #999;
      font-size: 30upx;
      margin: 0 0 0 5px;
    }
    .iconxialabeifen {
      margin-top: 2px;
      margin-left: 2px;
      font-size: 26upx;
    }
  }
  .subs {
    position: fixed;
    bottom: 40upx;
    width: 90%;
    left: 5%;
    line-height: 90upx;
    text-align: center;
    background: #e8e8e8;
    color: #fff;
    border-radius: 4px;
  }
  .subs_active {
    background: $active;
  }
}
</style>
