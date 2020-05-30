<template>
  <view class="bank">
    <view class="cardBox" v-for="(item, index) in cardlist" :key="index">
      <view class="left" @click="black(index)">
        <text>银行卡号:{{ item.address }}</text>
        <text>{{ item.bankAddress }}</text>
      </view>
      <view class="del" @click="del(item.id)">删除</view>
    </view>
    <view class="addBank" @click="jump('/pages/wallet/addBank', { coinId: coinId })">+ 添加银行卡</view>
  </view>
</template>

<script>
import { delBank, coinAddress } from '@/api/wallet_api.js';
import { toast, loading, model, fn } from '@/common/common.js';
export default {
  data() {
    return {
      coinId: '',
      cardlist: []
    };
  },
  onLoad(e) {
    this.coinId = e.coinId;
  },
  onShow() {
    this.getList();
  },
  methods: {
    getList() {
      loading(1, '加载中');
      coinAddress({})
        .then(res => {
          loading(2);
          if (res.code == 1) {
            this.cardlist = res.data.list;
          }
        })
        .catch(err => {});
    },
    toast(type, obj) {
      type == 1 ? uni.showToast(obj) : type == 2 ? uni.showLoading(obj) : uni.hideLoading();
    },
    black(index) {
      let obj = this.cardlist[index];
      let that = this;
      // address: '',
      // qty: '',
      // bankAdress: ''
      var pages = getCurrentPages();
      var page = pages[pages.length - 2];
      // #ifdef APP-PLUS
      let msg={'address': obj.address,'bankAdress':obj.bankAddress}
      page.setData({
        'bankObj':msg,
      });
      // #endif
      //#ifdef H5
      page._data.bankObj.address = obj.address;
      page._data.bankObj.bankAdress = obj.bankAddress;
      // #endif
      uni.navigateBack();
    },
    jump(url, data) {
      uni.navigateTo({
        url: url + fn.params(data)
      });
    },
    async del(id) {
      const is = await model({ title: '提示', text: '您确认要删除么' });
      if (is) {
        console.log(1);
        delBank({ id: id })
          .then(res => {
            if (res.code == '1') {
              toast({ text: '删除成功' });
              this.getList();
            }
          })
          .catch(err => {});
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bank {
  height: calc(100% - 2px);
  margin-top: 2px;
  background-color: $uni-bg-color;
  .cardBox {
    width: 94%;
    margin: 0 auto;
    padding: 40upx 0;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    justify-content: space-between;
    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
      text:nth-child(1) {
        font-size: 32upx;
        line-height: 32upx;
        color: $uni-text-color;
      }
      text:nth-child(2) {
        margin-top: 30upx;
        height: 24upx;
        font-size: 24upx;
        color: $uni-text-color-grey;
      }
    }
    .del {
      flex-shrink: 1;
      width: 124upx;
      height: 48upx;
      line-height: 48upx;
      background: #fa3354;
      text-align: center;
      font-size: 28upx;
      color: #fff;
      border-radius: 4upx;
      box-shadow: 0upx 8upx 8upx -2upx #ffb7cd;
    }
  }
  .addBank {
    position: fixed;
    width: 92%;
    left: 4%;
    text-align: center;
    bottom: 2.5%;
    line-height: 90upx;
    border-radius: 6upx;
    border: 1px solid #524dff;
    font-size: 14px;
    color: #534dff;
  }
}
</style>
