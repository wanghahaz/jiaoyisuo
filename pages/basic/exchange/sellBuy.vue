<template>
  <view v-if="marketInfo.coinCnName" class="exchangeBox">
    <view class="titleTop">
      <text :class="type == 1 ? 'active' : ''" @click="changetab(1)">买入</text>
      <text :class="type == 2 ? 'active' : ''" @click="changetab(2)">卖出</text>
    </view>
    <view class="name">
      <view>{{ marketInfo.coinCnName }}</view>
      <view>{{ marketInfo.coinName }}</view>
    </view>
    <view class="pay">
      <view>委托方式</view>
      <view class="noBorder">限价交易</view>
    </view>
    <view class="chartBox">
      <view class="title">
        <view>
          <view>
            <text class="label">涨停：</text>
            <text class="up">{{ addMarket }}</text>
          </view>
          <view>
            <text class="label">跌停：</text>
            <text class="down">{{ oddMarket }}</text>
          </view>
        </view>
        <button type="default" @click="gotoDetail">
          <image mode="widthFix" src="../../../static/images/btn_icon.png"></image>
          详情图表
        </button>
      </view>
      <view class="chart"><index-uchart class="chartdetail" :chartData="chartData"></index-uchart></view>
    </view>
    <view class="entrustPrice">
      <view>
        <text>委托价格</text>
        <input placeholder="委托价格" v-model="data.price" type="number" />
      </view>
      <!-- <view>≈0.00</view> -->
    </view>
    <view class="entrust">
      <view class="top">
        <view class="">委托数量</view>
        <view class="">
          <text class="odd" @click="addOdd(1)">-</text>
          <input type="number" placeholder="委托数量" v-model="data.qty" />
          <text class="add" @click="addOdd(2)">+</text>
        </view>
      </view>
      <view class="btm">
        <view class=""></view>
        <view class="">
          <text @click="entrust('25')">25%</text>
          <text @click="entrust('50')">50%</text>
          <text @click="entrust('75')">75%</text>
          <text @click="entrust('100')">100%</text>
        </view>
      </view>
    </view>
    <view class="pay surplus">
      可用{{ type == 1 ? 'SC' : marketInfo.coinCnName }}：{{ type == 1 ? userInfo.coinBalance.rightCoinBalance : userInfo.coinBalance.leftCoinBalance }}
    </view>
    <view class="pay sellNum">
      <view>交易量</view>
      <view>
        <view class="">{{ payNum ? payNum : '交易量' }}</view>
        <text>{{ type == 1 ? 'SC' : marketInfo.coinCnName }}</text>
      </view>
    </view>
    <view class="submit">
      <view class="sub" @click="sub" :class="type == 1 ? 'buySub' : 'sellSub'">{{ type == 1 ? '现货买入' : '现货卖出' }}</view>
    </view>
    <view class="mask" v-show="maskShow" @click="closeMask"></view>
    <view class="popUp" :class="maskShow ? 'popUpActive' : ''">
      <view class="popTitle">
        <text>{{ type == 1 ? '付款详情' : '交易金额' }}</text>
        <uni-icons @click="closeMask" class="icons_close" type="closeempty" size="32"></uni-icons>
      </view>
      <view class="paynum">{{ payNum ? payNum.toFixed(2) : '' }}</view>
      <view class="pwd">
        <text>输入交易密码</text>
        <view style="display: flex;">
          <input :password="pwd" type="passWord" placeholder="请输入交易密码" maxlength="10" v-model.number="data.transactionPassword" />
          <!-- <image class="pwd_img" src="../../../static/images/eye_2.png" @click="edit_pwd()"></image> -->
        </view>
      </view>
      <view v-if="type == 1" class="tip">应付金额{{ payNum ? payNum.toFixed(2) : '' }}，实付金额{{ payNum ? (payNum/1+(payNum*(fee/100))).toFixed(2) : '' }},手续费 {{payNum ? (payNum*(fee/100)).toFixed(2):''}}</view>
      <view class="popSub" @click="popSub">立即支付</view>
    </view>
  </view>
</template>

<script>
import indexUchart from '@/components/my-uchart/index-uchart';
import { findListByMarketId } from '@/api/index_api';
import { userCenter } from '@/api/center_api.js';
import { exchange } from '@/api/exchange_api.js';
import { getFee } from '@/api/otc.js';
import { toast, loading, fn, model } from '@/common/common.js';
import uniIcons from '@/components/uni-icons/uni-icons.vue';
export default {
  components: {
    indexUchart,
    uniIcons
  },
  data() {
    return {
      fee:0,
      addMarket: '',
      oddMarket: '',
      status: {},
      maskShow: false,
      start: true,
      data: { qty: '', price: '', transactionPassword: '' },
      type: 1,
      market: [],
      marketId: 0, // 当前所选的交易对id
      userInfo: {}, // 交易页面用户相关数据
      marketInfo: {}, // 当前交易对信息
      selldeepList: [], // 卖出深度数据
      buydeepList: [], // 买入深度数据
      entrustList: [], // 当前委托数据
      tradeList: [], // 最新成交数据
      myDealList: [], // 我的成交数据
      klineList: {}, // k线图数据
      currentTab: '0',
      chartData: {},
      pwd: true
    };
  },
  computed: {
    payNum() {
      // console.log(this.data);
      if (this.data.qty && this.data.price) return (this.data.qty / 1) * (this.data.price / 1);
      return 0;
    }
  },
  methods: {
    getFee(){
      getFee('otcFeeRate').then( res=>{
        // console.log(res)
        if(res.code==1){
          this.fee =res.data
        }
      })
    },
    edit_pwd() {
      this.pwd = !this.pwd;
    },
    closeMask() {
      this.maskShow = false;
    },
    addOdd(type) {
      if (type == 1) {
        this.data.qty > 0 ? this.data.qty-- : 0;
      } else {
        this.data.qty++;
      }
    },
    changetab(type) {
      // console.log(1);
      this.type = type;
      if (this.type != type) {
        (this.data.qty = ''), (this.data.price = '');
      }
    },
    async popSub() {
      if (!this.data.transactionPassword && this.status.needTransactionPassword == 1) {
        toast({ text: '请输入交易密码' });
        return;
      }
      loading(1, '加载中');
      let data = Object.assign(this.data, { marketId: this.marketId }, { type: this.type });
      loading(2);
      if (this.status.needTransactionPassword == 0) delete data.transactionPassword;
      let res = await exchange(data);
      if (res.code == 1) {
        this.data.transactionPassword = '';
        toast({ text: '提交成功' });
        this.maskShow = false;
      } else {
        toast({ text: res.msg });
      }
    },
    entrust(num) {
      this.data.qty = num;
    },
    async sub() {
      if (!this.data.price || !this.data.qty) {
        toast({ text: !this.data.price ? '请输入正确的委托价格' : '请输入正确的委托数量' });
        return;
      }
      if (this.data.qty * this.data.price > this.userInfo.coinBalance.rightCoinBalance && this.type == 1) {
        toast({ text: `买入交易量不得大于可用SC` });
        return;
      }
      if (this.data.qty > this.userInfo.coinBalance.leftCoinBalance && this.type == 2) {
        toast({ text: `卖入交易量不得大于可用${this.marketInfo.coinCnName}` });
        return;
      }

      let status = await userCenter();
      this.$set(this.status, 'transactionPasswordIsNull', status.data.usercenter.transactionPasswordIsNull); //是否设置过交易密码 0：设置过  1：需要设置
      this.$set(this.status, 'needTransactionPassword', status.data.usercenter.needTransactionPassword); // 是否需要填写交易密码 0：不需要 1：需要
      if (this.status.needTransactionPassword) {
        if (this.status.transactionPasswordIsNull == 1) {
          model({ text: '您还没有设置交易密码，请您先设置交易密码' }).then(res => {
            if (res) this.jump('/pages/user/changePwd', { type: 1 });
          });
        } else {
          this.maskShow = true;
        }
      } else {
        this.popSub();
      }
    },
    jump(url, data) {
      uni.navigateTo({
        url: url + fn.params(data)
      });
    },
    goto(url) {
      uni.switchTab({
        url: url
      });
    },
    // 初始化socket连接并处理接收的数据
    initSocket(time) {
      if (this.start) {
        loading(1, '加载中');
      }
      let userinfo = uni.getStorageSync('userinfo');
      uni.connectSocket({
        url: `ws://${this.socketURL}/websocket/topic/tradeListAndMarketOrders/${this.marketId}/5/${userinfo ? userinfo.userId + '' : null}`,
        method: 'POST',
        header: {
          lang: 'cn',
          userId: userinfo ? userinfo.userId : '',
          accessToken: userinfo ? userinfo.accessToken : ''
        }
      });
      // 处理接收到的数据
      uni.onSocketMessage(res => {
        if (this.start) {
          loading(2);
        }
        this.start = false;
        let data = JSON.parse(res.data);
        this.chartData = data;
        this.userInfo = data.userData;
        this.selldeepList = data.sellList;
        this.buydeepList = data.buyList;
        this.tradeList = data.tradeList;
        this.klineList = data.klineList;
        this.marketInfo = data.marketInfo;
      });
      uni.onSocketOpen(res => {
        console.log('WebSocket连接已打开！');
      });
      uni.onSocketError(err => {
        console.log('WebSocket连接打开失败，请检查！', err);
      });
      uni.onSocketClose(function(res) {
        console.log('WebSocket 已关闭！');
      });
    },
    gotoDetail() {
      uni.navigateTo({
        url: '/pages/basic/exchange/chartDetail?marketId=' + this.marketId
      });
    }
  },
  onNavigationBarButtonTap() {
    uni.navigateTo({
      url: '/pages/basic/exchange/selectCoin'
    });
  },
  onLoad(opt) {
    this.marketId = opt.marketId;
    this.type = opt.type;
    this.getFee()
    findListByMarketId({ marketId: this.marketId, minType: '30' }).then(res => {
      this.market = res.data[res.data.length - 1];
      this.addMarket = (this.market.close * 1.1).toFixed(2);
      this.oddMarket = (this.market.close * 0.9).toFixed(2);
      console.log(this.addMarket, this.oddMarket);
    });
  },
  onShow() {
    this.initSocket();
    // #ifdef H5
    window.onbeforeunload = () => {
      uni.closeSocket();
    };
    // #endif
  },
  onHide() {
    uni.closeSocket();
  },
  onUnload() {
    uni.closeSocket();
  }
};
</script>
<style lang="scss" scoped>
.mask {
  z-index: 10;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(#000, 0.6);
}
.popUp {
  font-size: 32upx;
  color: #333;
  box-sizing: border-box;
  padding: 40upx 30upx 80upx 30upx;
  z-index: 11;
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  background: #fff;
  transform: translateY(110%);
  -webkit-transform: translateY(110%);
  transition: all 0.3s ease;
  -webkit-transition: all 0.3s ease;
  .popTitle {
    position: relative;
    text-align: center;
  }
  .icons_close {
    position: absolute;
    right: 0;
    top: -15upx;
  }
  .payNum {
    margin-top: 50upx;
    font-weight: 600;
    font-size: 72upx;
    text-align: center;
  }
  .tip {
    margin-top: 30upx;
    color: #999;
    font-size: 28upx;
  }
  .pwd {
    @extend .bt;
    position: relative;
    padding: 60upx 0 40upx 0;
    display: flex;
    justify-content: space-between;
    input {
      text-align: right;
    }
    .pwd_img {
      margin: auto 20px;
      width: 28upx;
      height: 20upx;
      z-index: 10;
    }
  }
  .popSub {
    color: #fff;
    border-radius: 8upx;
    margin-top: 120upx;
    font-size: 28upx;
    text-align: center;
    line-height: 96upx;
    background: #534dff;
    height: 96upx;
    box-shadow: 0px 6px 10px -4px #534dff;
  }
}
.popUpActive {
  transform: translateY(0);
  -webkit-transform: translateY(0);
}
.bt {
  border-bottom: 1px solid #f5f5f5;
}
.exchangeBox {
  margin-top: 1px;
  background: $uni-bg-color;
  .entrustPrice {
    font-size: 32upx;
    padding: 40upx 26upx 0 26upx;
    view:nth-of-type(2) {
      margin-top: 20upx;
      font-size: 28upx;
      text-align: right;
    }
    view:nth-of-type(1) {
      line-height: 72upx;
      display: flex;
      align-items: center;
      text {
        flex: 1;
      }
      input {
        flex: 4;
        padding-left: 10upx;
        height: 72upx;
        font-size: 28upx;
        border: 1px solid #f5f5f5;
      }
    }
  }
  .entrust {
    @extend .bt;
    padding: 40upx 26upx;
    font-size: 32upx;
    .top,
    .btm {
      display: flex;
    }
    .btm {
      view:nth-of-type(1) {
        flex: 1;
      }
      view:nth-of-type(2) {
        margin-top: 40upx;
        flex: 4;
        display: flex;
        justify-content: space-between;
        text {
          text-align: center;
          border: 1px solid #f5f5f5;
          line-height: 72upx;
          width: 20%;
        }
      }
    }
    .top {
      display: flex;
      align-items: center;
      input {
        flex: 1;
        font-size: 28upx;
        padding: 0 10upx;
      }
      .odd,
      .add {
        font-size: 36upx;
        width: 72upx;
        text-align: center;
      }
      .add {
        border-left: 1px solid #f5f5f5;
      }
      .odd {
        border-right: 1px solid #f5f5f5;
      }
      view:nth-of-type(1) {
        flex: 1;
      }
      view:nth-of-type(2) {
        display: flex;
        align-items: center;
        height: 72upx;
        line-height: 72upx;
        flex: 4;
        border: 1px solid #f5f5f5;
        display: flex;
      }
    }
  }
  .pay {
    height: 106upx;
    height: 152upx;
    display: flex;
    font-size: 32upx;
    align-items: center;
    padding: 0 26upx;
    @extend .bt;
    input {
      flex: 1;
      font-size: 28upx;
    }
    view:nth-of-type(1) {
      flex: 1;
      flex-shrink: 0;
    }
    view:nth-of-type(2) {
      box-sizing: border-box;
      margin-left: 10upx;
      padding: 0 20upx;
      flex: 4;
      height: 72upx;
      line-height: 72upx;
      border: 1px solid #f0f0f2;
      font-size: 24upx;
      color: #999999;
    }
    .noBorder {
      border: none !important;
      font-size: 30upx !important;
    }
  }
  .surplus {
    height: 102upx;
  }
  .sellNum {
    border-top: 20upx solid #f5f5f5;
    view:nth-of-type(2) {
      display: flex;
      align-items: center;
    }
  }
  .name {
    height: 106upx;
    padding: 20upx 26upx 0 26upx;
    @extend .bt;
    view:nth-of-type(1) {
      font-size: 32upx;
    }
    view:nth-of-type(2) {
      font-size: 24upx;
      color: #999999;
    }
  }
  .titleTop {
    padding: 0 26upx;
    font-size: 32upx;
    color: #333333;
    display: flex;
    align-items: center;
    @extend .bt;
    text {
      height: 94upx;
      line-height: 94upx;
      position: relative;
      width: 140upx;
    }
    .active {
      color: #534dff;
    }
    .active:after {
      content: '';
      width: 54upx;
      height: 4upx;
      position: absolute;
      bottom: 15%;
      left: 3%;
      background: #534dff;
    }
  }
  .submit {
    border-top: 52upx solid #f5f5f5;
    padding: 50upx 0;
    .sub {
      color: #fff;
      border-radius: 8upx;
      font-size: 28upx;
      text-align: center;
      line-height: 96upx;
      width: 92%;
      margin-left: 4%;
      height: 96upx;
    }
    .buySub {
      background: #02c189;
      box-shadow: 0px 6px 10px -4px #02c189;
    }
    .sellSub {
      background-color: #ea4662;
      box-shadow: 0px 6px 10px -4px #ea4662;
    }
  }
  .chartBox {
    background-color: #fff;
    padding: 10px 13px;
    margin-top: 10px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
      > view {
        display: flex;
        > view:nth-of-type(1) {
          margin-right: 50rpx;
        }
        text {
          font-size: 12px;
        }
        text:nth-of-type(2) {
          font-weight: bold;
        }
        text.up {
          color: #00c188;
        }
        text.down {
          color: #fa3354;
        }
      }
      button {
        margin: 0;
        padding: 0;
        width: 180rpx;
        height: 60rpx;
        line-height: 60rpx;
        font-size: 14px;
        background-color: #eeedff;
        border: 1px solid #534dff;
        color: #534dff;
        > image {
          display: inline-block;
          width: 20rpx;
          margin-right: 4rpx;
        }
      }
    }
  }
}
</style>
