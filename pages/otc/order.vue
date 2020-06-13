<template>
  <view class="otc_order">
    <view class="tab flex">
      <text :class="tab_index == 0 ? 'tabActive' : ''" @click="tab(0)">全部</text>
      <text :class="tab_index == 1 ? 'tabActive' : ''" @click="tab(1)">未完成</text>
      <text :class="tab_index == 2 ? 'tabActive' : ''" @click="tab(2)">已完成</text>
      <text :class="tab_index == 3 ? 'tabActive' : ''" @click="tab(3)">已取消</text>
    </view>
    <scroll-view scroll-y="true" class="scroll_box" @scrolltolower="scroll">
      <view
        class="item"
        v-for="(item,ind) in list"
        :key="ind"
        @click="toRouter('/pages/otc/orderContent', { type_order: item.orderType, id: item.id, type: item.type == 1 ? '1' : '0' })"
      >
        <view class="top flex">
          <view class="left">
            <view class="flex">
              <view class="name flex">
                <text class="icon" :class="item.type == 2 ? 'sell' : 'buy'">{{ item.type == 2 ? '卖出' : '买入' }}</text>
                <text>SC/CNY</text>
              </view>
              <text class="creattime">{{ item.time }}</text>
            </view>
            <view>
              <view>
                <text>价格</text>
                <text>{{ item.price.toFixed(2) }}</text>
              </view>
              <view>
                <text>数量</text>
                <text>{{ item.qty }}</text>
              </view>
            </view>
          </view>
          <view class="right">
            <text v-if="item.orderType == 'order'"></text>
            <text v-if="item.type == 1 && item.orderType == 'trade'">{{ item.status == 0 ? '待付款' :item.status == 1? '等待卖方发币':item.status == 2?'已完成':'已取消' }}</text>
            <text v-if="item.type == 2 && item.orderType == 'trade'">{{ item.status == 0 ? '等待买方付款' :item.status == 1? '待发币':item.status == 2?'已完成':'已取消' }}</text>
            <view class="flex">
              <view class="flex">
                <text>{{ (item.qty * item.price).toFixed(2) }}</text>
                <text>SC</text>
              </view>
              <text class="text_right">总金额</text>
            </view>
          </view>
        </view>
        <view class="btm flex">
          <text>{{ tab_status[item.status] }}</text>
          <!-- <text>16:20</text> -->
        </view>
      </view>
      <view v-if="loading && list.length == 0" class="nomore">加载中....</view>
      <view v-else-if="!loading && list.length == 0" class="nomore">您还没有订单</view>
      <view v-else class="nomore">{{ loading ? '加载更多...' : '已加载全部' }}</view>
    </scroll-view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/otc.js';
import { toast, loading, model, fn } from '@/common/common.js';
import { timestampToTime,diffTime } from '@/common/timestampToTime.js';
export default {
  name: '',
  data() {
    return {
      loading: true,
      tab_index: 0,
      list: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      tab_status: {
        '2': '已完成',
        '-1': '已取消',
        '1': '进行中',
        '0': '进行中'
      }
    };
  },
  onLoad(e) {
    this.getList();
  },
  onShow() {
    this.list = [];
    this.loading = true;
    this.getList();
  },
  methods: {
    getList() {
      loading(1, '加载中....');
      let data = this.page;
      data['status'] = this.tab_index;
      if (this.tab_index == 0) delete data.status;
      myAxios.orderList(data).then(res => {
        loading(2);
        this.list = [...this.list, ...res.data.list];
        this.list.forEach(item => {
          this.$set(item, 'time', timestampToTime(item.createTime));
        });
        if (this.list.length >= res.data.total) {
          this.loading = false;
        }
      });
    },
    scroll() {
      if (this.loading) {
        this.page.pageNum = this.page.pageNum + 1;
        this.getList();
      }
    },
    tab(index) {
      if (index != this.tab_index) {
        this.tab_index = index;
        this.list = [];
        this.loading = true;
        this.getList();
      }
    },
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
@import './index.scss';
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
        .left > view:nth-of-type(2),
        .right > view {
          margin-top: 40upx;
        }
        .left {
          flex: 1.5;
          > view:nth-of-type(1) {
            align-items: flex-end;
            .name {
              align-items: center;
            }
            .icon {
              text-align: center;
              font-size: 18upx;
              width: 68upx;
              line-height: 34upx;
              color: #fff;
              margin-right: 6upx;
              border-radius: 2px;
            }
            .sell {
              background: #fa3354;
            }
            .buy {
              background: #00c188;
            }
            .creattime {
              font-size: 26upx;
              padding-bottom: 6upx;
              margin-left: 20upx;
            }
          }
          > view:nth-of-type(2) {
            color: #333;
            font-size: 32upx;
            view {
              margin-top: 16upx;
              text {
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
            .text_right {
              padding-right: 46upx;
              color: #999;
            }
            > text {
              margin-top: 16upx;
            }
            text {
              color: #999;
            }
          }
          > text,
          .text_right {
            display: inline-block;
            box-sizing: border-box;
            width: 100%;
            text-align: right;
            color: $active;
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
      color: $active;
      position: relative;
    }
    .tabActive::before {
      content: '';
      position: absolute;
      bottom: -10upx;
      left: 0;
      width: 100%;
      height: 2px;
      background: $active;
    }
  }
}
</style>
