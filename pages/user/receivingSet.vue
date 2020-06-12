<template>
  <view class="receivingSet">
    <view class="box zfb">
      <view class="flex">
        <view class="flex">
          <image src="../../static/images/otc/zfb.png" mode=""></image>
          <text>支付宝</text>
        </view>
        <view v-if="aliList.length == 0" @click="toRouter('/pages/wallet/addBank', { type: 1 })" class="flex">
          <text>添加</text>
          <uni-icons size="16" class="right" type="arrowright" />
        </view>
      </view>
      <view class="list"  @click="toRouter('/pages/wallet/addBank', { type: 1, edit: 1, id: item.id })" v-for="(item, ind) in aliList">
        <view class="flex">
          <text class="name_">CNY</text>
          <view class="infor flex">
            <view><text>{{item.userName}}</text></view>
            <view><text>{{item.account}}</text></view>
          </view>
        </view>
      </view>
    </view>
    <view class="bank box">
      <view class="flex">
        <view class="flex">
          <image src="../../static/images/otc/bank.png" mode=""></image>
          <text>银行卡</text>
        </view>
        <view v-if="bankList.length < 10" @click="toRouter('/pages/wallet/addBank', { type: 0 })" class="flex">
          <text>添加</text>
          <uni-icons size="16" class="right" type="arrowright" />
        </view>
      </view>
      <view class="list" v-for="item in bankList" @click="toRouter('/pages/wallet/addBank', { type: 0, edit: 1, id: item.id })" :key="item.id">
        <view class="flex">
          <text class="name_">CNY</text>
          <view class="infor flex">
            <view>
              <text>{{ item.userName }}</text>
              <text>{{ item.bankAddress }}</text>
            </view>
            <view>
              <text>{{ item.address }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import { toast, loading, model, fn } from '@/common/common.js';
import * as myAjax from '@/api/receiving.js';
export default {
  name: 'receivingSet',
  data() {
    return {
      aliList: [],
      bankList: []
    };
  },
  onLoad(e) {},
  async onShow() {
    this.aliList =[];
    this.bankList=[]
    let id = uni.getStorageSync('userinfo').userId;
    loading('1', '加载中');
    let ali = await myAjax.aliList();
    let bank = await myAjax.bankList();
    loading();
    if (ali.code == 1) this.aliList = ali.data;
    if (bank.code == 1) this.bankList = bank.data.list;
  },
  methods: {
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
view {
  box-sizing: border-box;
}
.flex {
  display: flex;
}
.receivingSet {
  font-size: 32upx;
  .box {
    margin: 1px 0 20px 0;
    background: #fff;
    > view {
      padding: 0 5%;
    }
    .list {
      border-top: 1px solid #f5f5f5;
      padding: 20px 5%;
      > view {
        padding: 40upx;
        background: #534dff;
        border-radius: 6px 6px 0 0;
        height: 180upx;
        color: #fff;
        .name_ {
          background: #ffc13b;
          height: 44upx;
          padding: 0 6px;
          border-radius: 12upx;
          line-height: 44upx;
          font-size: 30upx;
        }
        .infor {
          flex-direction: column;
          justify-content: space-between;
          margin-left: 10px;
          > view:nth-of-type(1) {
            font-size: 34upx;
          }
          > view:nth-of-type(2) {
            font-size: 28upx;
          }
          > view {
            display: flex;
            > text {
              margin-right: 20px;
            }
          }
        }
      }
    }
    > view:nth-of-type(1) {
      line-height: 90upx;
      justify-content: space-between;
      view {
        position: relative;
        align-items: center;
        .right {
          position: relative;
          top: 50%;
          transform: translateY(-50%);
        }
        image {
          width: 36upx;
          height: 36upx;
          margin: 0 3px 0 0;
        }
      }
    }
  }
}
</style>
