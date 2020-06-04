<template>
  <view class="wallet_box ">
    <view v-if="total" class="header flex">
      <image class="bg" src="../../static/images/wallet/bg.png" mode=""></image>
      <text class="white">账户总资产</text>
      <view class="white all" >
        <text>{{total.totalBanlance || 0}}</text>
        <text>SC</text>
      </view>
      <view class="bill flex">
        <view>
          <text>资产余额</text>
          <text>{{ total&&total.scTotalBanlance.toFixed(2) }}</text>
        </view>
        <view>
          <text>币币余额</text>
          <text>2434.00</text>
        </view>
        <view>
          <text>合约余额</text>
          <text>{{ total&&total.contractAccountBalances.toFixed(2) }}</text>
        </view>
      </view>
      <view class="router flex">
        <view @click="toRouter('/pages/wallet/bill',{})" class="flex"><image src="../../static/images/wallet/bill.png" mode=""></image><text>账单</text></view>
        <view @click="toRouter('/pages/contract/moneyMove', { coidId: total.coidId, qty: total.scBanlance })" class="flex"><image src="../../static/images/wallet/zhuan.png" mode=""><text>划转</text></view>
      </view>
    </view>
    <view class="scroll">
       <view class="list_header flex">
         <text class="text_left">名称/代码</text>
         <text>产品数量/可卖数量</text>
         <text class="text_right">现价</text>
       </view>
       <view class="list flex" v-for="(item,index)  in  coinList" :key="index">
        <view class="name" style="width: 30%">
          <text>{{ item.coinCnName }}</text>
          <text>{{ item.shortName }}</text>
        </view>
        <text class="ellips" style="width: 40%;text-align: center;">{{ item.totalBanlance }}/{{ item.banlance }}</text>
        <text style="width: 30%;text-align: right;">{{ item.lastTradePrice }}</text>
      </view>
    </view>
    <view class="nomore">
      {{status_=='loading'?'加载中...':status_ =='no_leng'?'您还没有数据...':'已加载全部'}}
    </view>
   <!-- <scroll-view class="scroll" scroll-y="true" >
      
    </scroll-view> -->
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import { propertyList } from '@/api/wallet_api.js';
import { toast, loading, model, fn } from '@/common/common.js';
export default {
  name: '',
  data() {
    return {
      status_:'loading',
      coinList:[],
      total:null,
      
    };
  },
  onNavigationBarButtonTap() {
    this.toRouter('/pages/wallet/withdrawMoney', { coidId: this.total.coidId, qty: this.total.scBanlance || '0' });
  },
  onLoad(e) {
    this.propertyList()
  },
  onShow() {},
  methods: {
    propertyList() {
      loading(1, '加载中');
      propertyList({ type: 2 }).then(res => {
        loading(2);
        if (res.code == 1) {
          this.status_ =res.data.total>0?'noMore':'no_leng'
          this.total = res.data.total;
          this.coinList = res.data.coinList;
        }
      });
    },
   toRouter(url, data) {
     uni.navigateTo({
       url: url + fn.params(data)
     });
   },
  },
  computed: {},
  components: {
    uniIcons
  }
};
</script>

<style scoped lang="scss">
$text:#534DFF;
.nomore{
    line-height: 90upx;
    text-align: center;
    color: #c3c3c3;
    background: #fff;
    font-size: 30upx;
 }
.flex {
  display: flex;
}
.white{
  color: #fff;
}
.text_right{
  text-align: right !important;
 }
.text_left{
   text-align: left !important;
 }
.ellips {
    overflow: hidden;
    text-overflow: ellipsis;
}

.wallet_box {
 
  .scroll{
    background: #fff;
    >view{
      padding: 0 5%;
      border-bottom: 1px solid #F5F5F5;
    }
    .list{
      font-size: 32upx;
      padding: 20upx 5%;
      .name {
        > text:nth-of-type(1) {
          display: block;
          font-weight: bold;
        }
        > text:nth-of-type(2) {
          display: block;
          color: #999;
          font-size: 12px;
        }
      }
    }
    .list_header{
      line-height: 80upx;
      font-size: 30upx;
      color: #999999;
      >text{
        flex:1;
        text-align: center;
      }
      >text:nth-of-type(2){
        flex: 1.5;
      }
    }
    // position: fixed;
    // height: calc(100% - 460upx);
    // width: 100%;
    // background: yellow;
  }
  .header {
    position: relative;
    width: 100%;
    height: 460upx;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding-top: 30upx;
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    >text{
      font-size: 30upx;
    }
    .all{
      margin: 10upx 0 20upx 0;
      text:nth-of-type(1){
        font-size: 60upx;
      }
      text:nth-of-type(2){
        margin-left: 6upx;
        font-size: 32upx;
      }
    }
    .bill{
      width: 86%;
      margin: 0 7%;
      background-color: #fff;
      border-radius: 5px 5px  0 0;
      >view{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding:30upx 0;
        border-bottom: 1px solid #F5F5F5;
        >text:nth-of-type(1){
          font-size: 24upx;
        }
        >text:nth-of-type(2){
          margin-top: 6upx;
          font-size: 38upx;
          font-weight: 700;
        }
      }
    }
    .router{
      background: #fff;
       border-radius:0 0 5px 5px;
       width: 86%;
       margin: 0 7%;
       font-size: 32upx;
       >view:nth-of-type(1){
         border-right: 1px solid #F5F5F5 ;
       }
      >view{
         padding: 18upx 0;
        flex: 1;
        align-items: center;
        justify-content: center;
        image{
          width: 20upx;
          height: 24upx;
          margin-right: 4px;
        }
      }
    }
    .bill,.router{
      color: $text;
    }
    >view,>text{
      z-index: 9;
    }
  }
}
</style>
