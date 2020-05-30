<template>
  <view class="otc_order">
    <view class="tab flex">
      <text :class="tab_index == 0 ? 'tabActive' : ''" @click="tab(0)">全部</text>
      <text :class="tab_index == 1 ? 'tabActive' : ''" @click="tab(1)">未完成</text>
      <text :class="tab_index == 2 ? 'tabActive' : ''" @click="tab(2)">已完成</text>
      <text :class="tab_index == 3 ? 'tabActive' : ''" @click="tab(3)">已取消</text>
    </view>
    <scroll-view scroll-y="true" class="scroll_box" @scrolltolower="scroll">
      <view class="item" v-for="item in 10" :key="item"  @click="toRouter('/pages/otc/orderContent',{type:item % 2,status:item % 3})">
        <view class="top flex">
          <view class="left">
            <view class="flex">
              <view class="name flex">
                <text class="icon" :class="item % 2 == 0 ? 'sell' : 'buy'">{{ item % 2 == 0 ? '卖出' : '买入' }}</text>
                <text>SC/SNY</text>
              </view>
              <text class="creattime">2020-05-20</text>
            </view>
            <view>
              <view>
                <text>价格</text>
                <text>75.01</text>
              </view>
              <view>
                <text>数量</text>
                <text>1.20</text>
              </view>
            </view>
          </view>
          <view class="right">
            <text>等待对方放币</text>
            <view class="flex">
              <view class="flex">
                <text>10.14</text>
                <text>SC</text>
              </view>
              <text class="text_right">总金额</text>
            </view>
          </view>
        </view>
        <view class="btm flex">
          <text>{{ tab_status[item % 3] }}</text>
          <text>16:20</text>
        </view>
      </view>
    </scroll-view>
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
      tab_index: 0,
      tab_status: {
        '0': '已完成',
        '1': '已取消',
        '2': '剩余时间'
      }
    };
  },
  onLoad(e) {},
  onShow() {},
  methods: {
    scroll() {
      console.log(1);
    },
    tab(index) {
      this.tab_index = index;
    },
    toRouter(url,data){
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
$text: #534dff;
$time: #fa3354;
.flex {
  display: flex;
}
.otc_order {
  height: calc(100% - 1px);
  margin-top: 1px;
  background: #fff;
  .scroll_box {
    height: calc(100% - 94upx);
    .item {
      padding: 40upx 0 0 0;
      border-bottom: 20upx solid #f5f5f5;
      > view {
        padding: 0 4%;
        width: 100%;
      }
      .top {
        padding-bottom: 30upx;
        .left>view:nth-of-type(2),.right>view{
          margin-top: 40upx;
        }
        .left {
          flex: 1.5;
           >view:nth-of-type(1){
             align-items: flex-end;
             .name{
               align-items: center;
             }
             .icon{
               text-align: center;
               font-size: 18upx;
               width: 68upx;
               line-height: 34upx;
               color: #fff;
               margin-right: 6upx;
               border-radius: 2px;
             }
             .sell{
               background: #FA3354;
             }
             .buy{
               background: #00C188;
             }
             .creattime{
               font-size: 26upx;
               padding-bottom: 6upx;
               margin-left: 20upx;
             }
           }
          >view:nth-of-type(2){
            color: #333;
            font-size: 32upx;
            view{
              margin-top: 16upx;
              text{
                margin-right: 20upx;
              }
            }
          }
        }
        .right {
          flex: 0.7;
          text {
            font-size: 26upx;
          }
          > view {
            flex-direction: column;
            .flex {
              justify-content: flex-end;
              align-items: flex-end;
              > text:nth-of-type(1) {
                font-size: 32upx;
                color: #333;
              }
              > text:nth-of-type(2) {
                padding-bottom: 2upx;
                margin-left: 14upx;
              }
            }
            .text_right{
              padding-right: 46upx;
              color: #999;
            }
            >text{
              margin-top: 16upx;
            }
            text {
              color: #999;
            }
          }
          > text,.text_right {
            display: inline-block;
            box-sizing: border-box;
            width: 100%;
            text-align: right;
            color: $text;
          }
        }
      }
      .btm {
        border-top: 1px solid #f5f5f5;
        justify-content: flex-end;
        font-size: 28upx;
        line-height: 80upx;
        text {
          color: #999999;
        }
        > text:nth-of-type(2) {
          color: $time;
          margin-left: 10upx;
        }
      }
    }
  }
  .tab {
    font-size: 32upx;
    justify-content: space-around;
    align-items: center;
    height: 92upx;
    border-bottom: 1px solid #f5f5f5;
    .tabActive {
      color: $text;
      position: relative;
    }
    .tabActive::before {
      content: '';
      position: absolute;
      bottom: -10upx;
      left: 0;
      width: 100%;
      height: 2px;
      background: $text;
    }
  }
}
</style>
