<template>
  <view class="bank">
    <view v-if="type == 0" class="cardBox" v-for="(item, index) in cardlist" :key="index">
      <view class="left" @click="black(index)">
        <text>银行卡号:{{ item.address }}</text>
        <text>开户银: {{ item.bankAddress }}</text>
      </view>
      <view class="del" @click="del(item.id)">删除</view>
    </view>
    <view v-if="type == 1" class="cardBox" v-for="(item, index) in cardlist" :key="index">
      <view class="left" @click="black(index)">
        <text>支付宝账号: {{ item.account }}</text>
        <text>用户名: {{ item.userName }}</text>
      </view>
      <!-- <view class="del" @click="del(item.id)">删除</view> -->
    </view>
    <view v-if="(type == 0 && loading) || (type == 1 && loading && this.cardlist.length == 0)" class="addBank" @click="jump('/pages/wallet/addBank', { type: type })">
      + {{ type == 0 ? '添加银行卡' : '添加支付宝账号' }}
    </view>
  </view>
</template>

<script>
import * as myAjax from '@/api/otc.js';
import { delBank } from '@/api/wallet_api.js';
import { toast, loading, model, fn } from '@/common/common.js';
export default {
  data() {
    return {
      loading: false,
      cardlist: [],
      type: 1 // 0 银行卡  1支付宝
    };
  },
  onLoad(e) {
    this.type = e.type;
    uni.setNavigationBarTitle({
      title: e.type == 1 ? '支付宝' : '银行卡'
    });
    loading(1, '加载中');
  },
  onShow() {
    if (this.type == 1) {
      this.getAlis();
    } else {
      this.getBank();
    }
  },
  methods: {
    getAlis() {
      myAjax.aliList().then(res => {
        loading(2);
        if (res.code == 1) {
          this.loading = true;
          this.cardlist = res.data;
        } else {
          toast({ text: res.msg || '网络出错' });
        }
      });
    },
    getBank() {
      myAjax
        .bankList({})
        .then(res => {
          loading(2);
          if (res.code == 1) {
            this.loading = true;
            this.cardlist = res.data.list;
          } else {
            toast({ text: res.msg || '网络出错' });
          }
        })
        .catch(err => {});
    },
    black(index) {
      let obj = this.cardlist[index];
      let that = this;
      var pages = getCurrentPages();
      var page = pages[pages.length - 2];
      // #ifdef APP-PLUS
      if (this.type == 0) {
        page.$vm.bank = {
          acount: '****' + obj.address.slice(obj.address.length - 6),
          id: obj.id
        };
        // page.setData({
        //   bank:{
        // acount:'****' + obj.address.slice(obj.address.length - 6),
        // id:obj.id
        //   }
        // });
      } else {
        page.$vm.alis = {
          acount: '****' + obj.account.slice(obj.account.length - 4),
          id: obj.id
        };
        // page.setData({
        // alis: {
        //   acount:'****' + obj.account.slice(obj.account.length - 4),
        //   id:obj.id
        // }
        // });
      }

      // // #endif
      //#ifdef H5
      if (this.type == 0) {
        page._data.bank.acount = '****' + obj.address.slice(obj.address.length - 6);
        page._data.bank.id = obj.id;
      } else {
        page._data.alis.acount = '****' + obj.account.slice(obj.account.length - 4);
        page._data.alis.id = obj.id;
      }

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
        delBank({ id: id })
          .then(res => {
            if (res.code == '1') {
              toast({ text: '删除成功' });
              this.getBank();
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
      padding-left: 50upx;
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
