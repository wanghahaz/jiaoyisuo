<template>
  <view class="simple_list">
    <view class="header">
      <image class="fixed" src="../../static/images/contract/simpleBg.png" mode=""></image>
      <text>当前锦绣山河 300103 指数</text>
      <text>{{ index }}</text>
    </view>
    <view class="box_content">
      <image src="../../static/images/contract/simple_.png" mode=""></image>
      <text>您认为锦绣山河 300103 接下来多少时间会{{ type == 1 ? '上涨' : '下跌' }}？</text>
      <view class="box_list">
        <!-- jump('/pages/contract/contractList', { id: item.id }) -->
        <view @click="reLaunch('/pages/contract/index',item.id,item.contractName)" v-for="(item, ind,) in list" :key="ind">
          <template v-if="ind < 4">
            <view class="content">
              <view>
                <image class="circle" src="../../static/images/contract/circle.png" mode=""></image>
                <text style="line-height: 1.5;">{{ item.contractName }}会在{{ item.time }}之前{{ type == 1 ? '上涨' : '下跌' }}</text>
              </view>
              <!-- <text>{{ item.time }}</text> -->
            </view>
            <view class="days">{{ item.day }}天内</view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/contract_api.js';
import { toast, loading, model, fn, downDays } from '@/common/common.js';
export default {
  name: 'simpleList',
  data() {
    return {
      loading: false,
      type: 0,
      index: 0,
      list: []
    };
  },
  methods: {
    getList() {
      loading(1, '加载中');
      let data = {
        contractName: null,
        contractTime: null,
        contractType: this.type,
        pageNum: 1,
        pageSize: 10
      };
      myAxios.contract_list(data).then(res => {
        loading(2);
        this.list = res.data.list;
        this.list.forEach(item => {
          this.$set(item, 'time', `${item.contractTime.slice(5, 7)}月${item.contractTime.slice(8, 10)}日`);
          this.$set(item, 'day', downDays(item.contractTime));
        });
      });
    },
    reLaunch(url,id,contractName) {
      uni.setStorageSync('id', id);
      uni.setStorageSync('contractName', contractName);
      uni.reLaunch({
        url: url
      });
    },
    jump(url, data) {
      return;
      uni.navigateTo({
        url: url + fn.params(data)
      });
    }
  },
  onLoad(opt) {
    this.type = opt.type;
    this.index = opt.index;
    this.getList();
  },
  onShow() {}
};
</script>

<style lang="scss">
$fs14: 30upx;
.simple_list {
  .box_list {
    > view {
      margin: 40upx 0 0 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-size: $fs14;
      .content {
        width: 60%;
        .circle {
          flex-shrink: 0;
          width: 26upx;
          height: 26upx;
          margin-right: 20upx;
        }
        > view {
          display: flex;
          align-items: center;
          > image {
            width: 26upx;
            height: 26upx;
          }
        }
        display: flex;
        flex-direction: column;
        > text {
          margin: 20upx 0 0 40upx;
          width: 160upx;
          height: 50upx;
          text-align: center;
          line-height: 50upx;
          background: #f5f5f5;
          border-radius: 30upx;
        }
      }
      .days {
        border-radius: 50%;
        width: 110upx;
        height: 110upx;
        text-align: center;
        line-height: 110upx;
        background: #534dff;
        color: #fff;
        box-shadow: 0upx 14upx 16upx -12upx #534dff;
      }
    }
  }
  .header {
    position: relative;
    height: 390upx;
    text-align: center;
    display: flex;
    flex-direction: column;
    > text:nth-of-type(1) {
      margin: 60upx 0 10upx 0;
    }
    > text:nth-of-type(2) {
      font-size: 68upx;
    }
    text {
      position: relative;
      z-index: 9;
      font-size: $fs14;
      color: #fff;
    }
    image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .box_content {
    position: fixed;
    left: 4%;
    bottom: 0;
    width: 92%;
    // #ifdef APP-PLUS
    height: calc(100% - 16%);
    // #endif
    // #ifdef H5
    height: calc(100% - 26%);
    // #endif
    background: #fff;
    border-radius: 4upx;
    display: flex;
    flex-direction: column;
    > image {
      width: 180upx;
      height: 180upx;
      margin: 60upx auto 40upx auto;
    }
    > text {
      font-size:28upx;
      margin: 0 auto;
    }
  }
}
</style>
