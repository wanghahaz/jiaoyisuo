<template>
  <view class="deal_contract">
    <view class="deal_header">
      <view class="left">
        <view class="name_">
          <text class="name_user">{{ contractName }}</text>
        </view>
        <text class="name_tip">看涨</text>
        <!-- <text class="name_code">300133</text> -->
        <view class="input">
          <input class="input_text" type="text" placeholder="价格" v-model="data.price" value="" />
          <text>sc</text>
        </view>
        <view class="input">
          <input class="input_text" type="text" placeholder="数量" v-model="data.qty" value="" />
          <text>个</text>
        </view>
        <text class="usable">可用{{ power && power.accountBalances }}sc</text>
        <view class="buy b_s" @click="sub(1)">买入</view>
        <view class="sell b_s" @click="sub(2)">卖出</view>
        <!-- <text class="deposit">开仓所需保证金：5%</text> -->
      </view>
      <view class="right">
        <view class="top_ btm_">
          <view class="btm_list btm_left">
            <text class="b_l_text right_head">价格</text>
            <text class="b_l_text" v-for="(item, ind) in socketList.buyList" :key="ind">{{ item.price.toFixed(2) }}</text>
          </view>
          <view class="btm_list btm_right">
            <text class="right_head b_l_text">数量</text>
            <text class="b_l_text" v-for="(item, ind) in socketList.buyList" :key="ind">{{ item.qty }}</text>
          </view>
        </view>
        <text class="solid"></text>
        <view class="btm_">
          <view class="btm_list btm_left">
            <text class="btm_text" v-for="(item, ind) in socketList.sellList" :key="ind">{{ item.price.toFixed(2) }}</text>
          </view>
          <view class="btm_list btm_right">
            <text class="btm_text" v-for="(item, ind) in socketList.sellList" :key="ind">{{ item.qty }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="blank"></view>
    <view class="deal_list">
      <view class="deal_tab">
        <text class="deal_text" @click="tab(1)" :class="tabIndex == 1 ? 'tabActive' : ''">当前委托</text>
        <text class="deal_text" @click="tab(2)" :class="tabIndex == 2 ? 'tabActive' : ''">当前成交</text>
      </view>
      <scroll-view class="scrollView" :scroll-y="'true'">
        <template v-if="tabIndex == 1">
          <view @click="toRouter('/pages/contract/entrustContent', { id: item.id })" v-for="item in principalList" :key="item.id" class="list">
            <view class="box_content">
              <view class="left_content">
                <text>{{ item.contractName }}</text>
                <image v-if="item.type == 1" class="img_" src="../../../static/images/wallet/buy.png"></image>
                <image v-else class="img_" src="../../../static/images/wallet/sell.png"></image>
              </view>
              <text @click.stop="back_(true, 5, item.id)" class="text_ cancel">撤单</text>
            </view>
            <text class="time">{{ item.createTime }}</text>
            <view class="num_content mb">
              <text class="num_text left">委托总量 {{ item.qty }}张</text>
              <text class="num_text">委托价格 {{ item.price }}sc</text>
            </view>
            <view class="num_content">
              <text class="num_text left">已成交量 {{ item.tradeQty }}张</text>
            </view>
          </view>
          <view v-if="principalList.length == 0 && principalMore" class="no_more">暂时没有记录~</view>
        </template>
        <template v-if="tabIndex == 2">
          <view v-for="(item, ind) in socketList.contractTradeList" :key="ind" class="list">
            <view class="box_content">
              <view class="left_content">
                <text class="contractName">{{ item.contractName }}</text>
                <image class="img_" src="../../../static/images/wallet/buy.png" mode=""></image>
              </view>
            </view>
            <text class="time">{{ item.createTime }}</text>
            <view class="num_content">
              <text class="num_text left">已成交量 0张</text>
              <text class="num_text">成交均价 0sc</text>
            </view>
          </view>
          <view v-if="socketList.contractTradeList.length == 0" class="no_more">暂时没有记录~</view>
        </template>
      </scroll-view>
    </view>
    <view class="mask" v-show="pop_show" @click="closeMask"></view>
    <view class="popUp" :class="pop_show ? 'popUpActive' : ''">
      <view class="popTitle">
        <text>{{ deal_type == 1 ? '付款详情' : '交易金额' }}</text>
        <uni-icons @click="closeMask" class="icons_close" type="closeempty" size="32"></uni-icons>
      </view>
      <!-- <view class="paynum">{{ payNum ? payNum.toFixed(2) : '' }}</view> -->
      <view class="pwd">
        <text>输入交易密码</text>
        <view style="display: flex;">
          <input class="pwd_text" password="true" type="passWord" placeholder="请输入交易密码" maxlength="10" v-model.number="data.transactionPassword" />
          <!-- <image class="pwd_img" src="../../../static/images/eye_2.png" @click="edit_pwd()"></image> -->
        </view>
      </view>
      <view v-if="deal_type == 1" class="tip">应付金额{{ payNum ? payNum.toFixed(2) : '' }}，实付金额{{ payNum ? payNum.toFixed(2) : '' }}</view>
      <view class="popSub" @click="addOrder">立即支付</view>
    </view>
    <mask-box :orderId="orderId" :pwd="1" @callBack="callBack" @editType="editType" :model_show="model_show" :subType="subType" :fromData="data"></mask-box>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/contract_api.js';
import { toast, loading, model, fn } from '@/common/common.js';
import maskBox from './model.vue';
export default {
  name: 'dealContract',
  components: {
    maskBox,
    uniIcons
  },
  props: {
    socketId: {
      type: Number
    },
    parShow: {
      default: false,
      type: Boolean
    }
  },
  watch: {
    socketId: {
      handler(newValue, old) {
        if (newValue != old && old != 0 && newValue != 0) {
          this.marketId = newValue;
        }
      },
      immediate: true
    },
    parShow: {
      handler(newValue) {
        this.model_show = newValue;
      },
      immediate: true
    }
  },
  computed: {
    payNum() {
      if (!isNaN(this.data.qty) && !isNaN(this.data.price)) return this.data.qty * this.data.price;
      return 0;
    }
  },
  data() {
    return {
      contractName: '',
      power: null, //权限 控制 、
      deal_type: 1, //买入or卖出
      pop_show: false, // 密码输入弹框
      marketId: 0, //id
      model_show: false, // 组件弹窗
      tabIndex: 1, // 列表切换
      subType: 0, // 弹框类型  1 买入 2卖出 3买入失败  4  卖出失败
      orderId: 0, // 列表数据id
      principalList: [], //当前委托列表
      principalMore: false,
      socketList: {},
      data: {
        price: '',
        qty: '',
        transactionPassword: ''
      }
    };
  },
  beforeDestroy() {
    uni.closeSocket();
  },
  mounted() {
    this.contractName = uni.getStorageSync('contractName');
    this.getPower();
    this.initSocket();
    this.getPrincipalList(this.socketId);
  },
  methods: {
    initSocket() {
      let userinfo = uni.getStorageSync('userinfo');
      uni.connectSocket({
        url: `ws://${this.socketURL}/websocket/topic/contractOrdersAndTrades/${this.socketId}/${userinfo.userId}`,
        method: 'POST'
      });
      uni.onSocketMessage(res => {
        this.socketList = JSON.parse(res.data);
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
    //当前委托
    getPrincipalList(id) {
      if (!this.principalMore) loading('1');
      myAxios.getPrincipalList(id).then(res => {
        loading('2');
        this.principalMore = true;
        if (res.code == 1) {
          this.principalList = res.data;
        }
      });
    },
    // 获取权限
    getPower() {
      myAxios.getPower().then(res => {
        this.power = res.data;
      });
    },
    closeMask() {
      this.pop_show = !this.pop_show;
    },
    // 组件回调
    callBack(e) {
      if (e.type == 0) {
        this.model_show = false;
      } else {
        this.getPrincipalList(this.socketId);
        this.getPower();
      }
    },
    editType(e) {
      if (e.type == 1) {
        this.pop_show = true;
        this.model_show = false;
      } else {
        this.model_show =false;
        this.addOrder()
      }
    },
    //  撤单弹框
    back_(bol, type, orderId) {
      if (orderId) {
        this.orderId = orderId;
      }
      if (bol) (this.subType = type), (this.model_show = true);
    },
    // 立即支付
    addOrder() {
      loading(1, '加载中..');
      let data = JSON.parse(JSON.stringify(this.data));
      data.contractId = this.socketId;
      data.type = this.deal_type;
      data.contractAccountType = 1;
      data.contractType = 1; //需要接口获取
      console.log(data);
      myAxios.addOrder(data).then(res => {
        loading(2);
        if (res.code == 1) {
          toast({ text: res.msg });
          this.data.price = '';
          this.data.qty = '';
          this.data.transactionPassword = '';
          this.getPrincipalList(this.socketId);
          this.getPower();
          this.pop_show = false;
        } else {
          if (res.msg == '保证金不足') {
            this.back_(true, this.deal_type == 1 ? 3 : 4);
            this.pop_show = false;
            return;
          }
          toast({ text: res.msg });
        }
      });
    },

    // 买卖按钮加判断
    sub(type) {
      if (isNaN(this.data.price) || isNaN(this.data.qty) || this.data.price == '' || this.data.qty == '') {
        toast({ text: '请您输入正确的格式' });
        return;
      }

      this.deal_type = type;
      this.back_(true, type);
    },
    tab(type) {
      if (type != this.tabIndex) {
        this.tabIndex = type;
      }
    },

    toRouter(url, data) {
      uni.navigateTo({
        url: url + fn.params(data)
      });
    }
  }
};
</script>

<style lang="scss">
$fs14: 28upx;
$col99: #999;
$col33: #333;
$colAc: #524cff;
.mask {
  z-index: 10;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(#000, 0.6);
}
.deal_contract {
  overflow-y: auto;
  padding: 20upx 0 0 0;
  background: #fff;
  font-size: $fs14;
  .no_more {
    text-align: center;
    color: #c3c3c3;
    margin: 20upx 0;
  }
  .popUp {
    font-size: 32upx;
    color: #333;
    box-sizing: border-box;
    padding: 40upx 30upx 50upx 30upx;
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
      border-bottom: 1px solid #f5f5f5;
      position: relative;
      padding: 60upx 0 40upx 0;
      display: flex;
      justify-content: space-between;
      .pwd_text {
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
  .blank {
    height: 20upx;
    background: #f5f5f5;
  }
  .deal_header {
    padding-bottom: 20upx;
    width: 92%;
    margin-left: 4%;
    display: flex;
    .left {
      font-size: 32upx;
      color: $col33;
      flex: 1.2;
      display: flex;
      flex-direction: column;
      .deposit,
      .b_s,
      .name_code,
      .input,
      .usable {
        margin-bottom: 20upx;
      }
      .deposit {
        font-size: 24upx;
        color: $col99;
      }
      .b_s {
        width: 90%;
        line-height: 64upx;
        text-align: center;
        color: #fff;
        border-radius: 8upx;
        font-size: $fs14;
      }
      .sell {
        background: #fa3354;
      }
      .buy {
        background: #00c188;
      }
      .name_code {
        color: $col99;
        font-size: 24upx;
      }
      .name_ {
        display: flex;
        font-weight: 700;
        align-items: center;
      }
      .name_tip {
        margin: 10upx 20upx 24upx 0;
        width: 68upx;
        height: 32upx;
        line-height: 32upx;
        text-align: center;
        background: #00c188;
        color: #fff;
        font-size: 20upx;
        border-radius: 4upx;
      }
      .input {
        border: 1px solid #f0f0f2;
        line-height: 72upx;
        display: flex;
        align-items: center;
        font-size: $fs14;
        width: 80%;
        box-sizing: border-box;
        padding: 0 30upx;
        .input_text {
          font-size: $fs14;
        }
      }
    }
    .right {
      .solid {
        display: inline-block;
        width: 80%;
        margin: 16upx 10%;
        border-top: 1px #f5f5f5 solid;
      }
      .b_l_text {
        margin-bottom: 10upx;
        text-align: center;
      }
      font-size: $fs14;
      flex: 1;
      .btm_ {
        display: flex;
        justify-content: space-around;
        .btm_left {
          .btm_text {
            text-align: center;
            color: #fa3354;
          }
        }
        .btm_list {
          display: flex;
          flex-direction: column;
          .btm_text {
            text-align: center;
            margin-bottom: 10upx;
          }
        }
      }
      .top_ {
        .btm_left {
          .b_l_text {
            color: #00c188;
          }
        }
        .btm_list {
          .right_head {
            color: $col99;
          }
        }
      }
      .btm_,
      .top_ {
        justify-content: center;
        .btm_list {
          width: 40%;
        }
        .btm_left {
          margin-right: 10%;
          .b_l_text,
          .btm_text {
            text-align: left;
          }
        }
        .btm_right {
          .b_l_text,
          .btm_text {
            text-align: right;
          }
        }
      }
    }
  }
  .deal_list {
    .scrollView {
      height: 100%;
    }
    .list {
      padding: 40upx 30upx;
      border-bottom: 1px solid #f5f5f5;
      margin-top: 1px;
      background: #fff;
      display: flex;
      flex-direction: column;
      .box_content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .img_ {
          margin-left: 10upx;
          width: 68upx;
          height: 32upx;
        }
        .left_content {
          display: flex;
          align-items: center;
          color: #333333;
          font-size: 32upx;
          font-weight: 700;
        }
        .text_ {
          width: 120upx;
          text-align: right;
          font-size: 24upx;
          color: #999999;
        }
        .cancel {
          color: #524cff;
          font-size: 28upx;
        }
      }
      .time {
        margin: 20upx 0 30upx 0;
        font-size: 24upx;
        color: #999999;
      }
      .mb {
        margin-bottom: 10upx;
      }
      .num_content {
        font-size: 28upx;
        display: flex;
        .left {
          width: 40%;
        }
      }
    }
    .deal_tab {
      display: flex;
      border-bottom: 1px solid #ececed;
      .deal_text {
        flex: 1;
        text-align: center;
        line-height: 80upx;
        color: $col33;
      }
      .tabActive {
        color: #fff;
        background: $colAc;
      }
    }
  }
}
</style>
