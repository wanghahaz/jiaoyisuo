<template>
  <view class="container" @scroll="scrolling">
    <view class="myswiperBox">
      <uni-swiper-dot :info="bannerList" :current="current" class="myswiper">
        <swiper class="swiper-box" @change="change">
          <swiper-item v-for="(item, index) in bannerList" :key="index" @click="gotoout(item.url)"><image :src="item.image" class="swiper-item"></image></swiper-item>
        </swiper>
      </uni-swiper-dot>
    </view>
    <view class="noticebarBox">
      <uni-notice-bar
        :speed="50"
        :text="notice"
        single="true"
        scrollable="true"
        showIcon="true"
        @getmore="goto('/pages/notice/index')"
        :showGetMore="true"
        moreText="更多"
      ></uni-notice-bar>
    </view>
    <view class="ad" @click="goto('/pages/basic/recruit')">
      <view><image src="../../static/images/ad.png" mode="widthFix"></image></view>
    </view>
    <view class="tabsBox">
      <view class="tabs">
        <view>
          <QSTabs
            :tabs="tabs"
            :current="currentTab"
            minWidth="120"
            activeColor="#534DFF"
            defaultColor="#000"
            :activeBold="false"
            animationMode="line3"
            space="20"
            @change="changeTab"
            ref="tabs"
          ></QSTabs>
        </view>
        <text class="iconfont iconsystem-serchbx" @click="search"></text>
      </view>
      <view class="swiper">
        <view class="thead">
          <view style="width:30%;"><text style="text-align: left">名称</text></view>
          <view @click="getIndex('最新', '1')" class="center" :class="sortName == '最新' ? 'activeTab' : ''" style="width:25%;">
            <text>最新</text>
            <uni-icons size="14" :type="sortName == '最新' && sort == 1 ? 'arrowthindown' : 'arrowthinup'" :color="sortName == '最新' ? '#534dff' : ''"></uni-icons>
          </view>
          <view @click="getIndex('涨跌', '1')" class="center" :class="sortName == '涨跌' ? 'activeTab' : ''" style="width:24%;">
            <text>涨跌</text>
            <uni-icons size="14" :type="sortName == '涨跌' && sort == 1 ? 'arrowthindown' : 'arrowthinup'" :color="sortName == '涨跌' ? '#534dff' : ''"></uni-icons>
          </view>
          <view @click="getIndex('涨幅', '1')" class="right" :class="sortName == '涨幅' ? 'activeTab' : ''" style="width:21%;">
            <text>涨幅</text>
            <uni-icons size="14" :type="sortName == '涨幅' && sort == 1 ? 'arrowthindown' : 'arrowthinup'" :color="sortName == '涨幅' ? '#534dff' : ''"></uni-icons>
          </view>
        </view>
        <swiper :current="currentTab" @transition="transition" @animationfinish="animationfinish">
          <swiper-item class="swiper-item" v-for="(item, index) in tabsInfo" :key="index" :style="{ overflow: overflow ? 'scroll' : 'visible' }">
            <scroll-view scroll-y>
              <view class="item" v-for="item2 in item.marketInfos" :key="item2.marketId">
                <view class="maininfo" @click="gotoExchange(item2.marketId)">
                  <view class="name" style="width:30%;text-align: left">
                    <text>{{ item2.coinCnName }}</text>
                    <text>{{ item2.coinName }}</text>
                  </view>
                  <text style="width:25%">{{ item2.lastTradePrice.toFixed(2) }}</text>
                  <text style="width:24%">{{ item2.zhangdie > 0 ? '+' + item2.zhangdie.toFixed(2) : item2.zhangdie.toFixed(2) }}</text>
                  <view style="width:21%" class="rise_fall" :class="{ rise: item2.incRate >= 0, fall: item2.incRate < 0 }">
                    {{ item2.incRate >= 0 ? '+' + item2.incRate.toFixed(2) : item2.incRate.toFixed(2) }}%
                  </view>
                </view>
              </view>
            </scroll-view>
          </swiper-item>
        </swiper>
      </view>
    </view>
    <!-- <tab-bar :current="currentTabIndex"></tab-bar> -->
  </view>
</template>

<script>
import uniSwiperDot from '@/components/uni-ui/uni-swiper-dot/uni-swiper-dot';
import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar';
import QSTabs from '@/components/QS-tabs/QS-tabs';
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import indexUchart from '@/components/my-uchart/index-uchart';
import { indexPage } from '@/api/index_api';
import { toast, loading, fn } from '@/common/common.js';

export default {
  components: {
    uniSwiperDot,
    uniNoticeBar,
    QSTabs,
    indexUchart,
    uniIcons
  },
  onLoad(){
  },
  // 监听右上角按钮
  onNavigationBarButtonTap() {
    uni.navigateTo({url:"/pages/user/index"})
  },
  data() {
    return {
      currentTabIndex:0,
      sort: 1,
      sortName: '最新',
      overflow: false,
      bannerList: [], // banner图
      notice: '', //公告文字
      tabs: [],
      current: 0,
      currentTab: 0, // 当前标签页
      tabsInfo: [], // tab页所有数据
      currentMarketId: 0 // 当前点击的交易对id
    };
  },
  methods: {
    scrolling() {
      uni
        .createSelectorQuery()
        .in(this)
        .select('.tabsBox')
        .boundingClientRect(data => {
          this.overflow = data.top == 0 ? true : false;
        })
        .exec();
    },
    change(e) {
      this.current = e.detail.current;
    },
    // 点击公告上的更多
    goto(url) {
      uni.navigateTo({
        url
      });
    },
    // 切换tab标签
    changeTab(index) {
      this.currentTab = index;
      this.sort = 1;
      this.sortName = '最新';
    },
    transition({ detail: { dx } }) {
      this.$refs.tabs.setDx(dx);
    },
    animationfinish({ detail: { current } }) {
      this.$refs.tabs.setFinishCurrent(current);
      this.currentTab = current;
    },
    // 点击tab标签上的搜索按钮
    search() {
      uni.navigateTo({
        url: '/pages/basic/search'
      });
    },
    // 点击去交易
    gotoExchange(id) {
      uni.navigateTo({
        url: '/pages/basic/exchange/index?marketId=' + id
      });
    },
    gotoout(url) {
      if (url) {
        plus.runtime.openURL(url);
      }
    },
    async getIndex(sortName, sort) {
      if (sortName) {
        this.sort = this.sortName == sortName ? (this.sort == 1 ? (this.sort = '-1') : (this.sort = 1)) : (this.sort = 1);
        this.sortName = sortName;
      }
      loading(1, '加载中');
      let indexData = await indexPage({ sort: this.sort, sortName: this.sortName });
      loading(2);
      this.bannerList = indexData.data.bannerList;
      this.tabs = indexData.data.marketSortInfoList.map(item => item.sortName);
      this.tabsInfo = indexData.data.marketSortInfoList;
      this.notice = indexData.data.articleList[0].name;
    }
  },
  onShow() {
    uni.startPullDownRefresh();
    this.getIndex();
  },
  onPullDownRefresh() {
    this.getIndex();
    // 获取数据后停止刷新动画
    uni.stopPullDownRefresh();
  },
  // 点击当前tab页
  onTabItemTap({ index, pagePath, text }) {
    uni.startPullDownRefresh();
  }
};
</script>

<style lang="scss" scoped>
.container {
  overflow: auto;
  height: 100%;
  .myswiperBox {
    background-color: #fff;
    padding-bottom: 10px;
    border-radius: 8px;
    .myswiper {
      box-shadow: 0px 6px 6px -4px #a4a4bb;
      display: block;
      width: 94%;
      margin: 0 auto;
      border-radius: 8px;
      image {
        border-radius: 8px;
      }
    }
  }
  .noticebarBox {
    padding: 10rpx;
    background-color: #fff;
    margin-bottom: 1px;
  }
  .ad {
    background-color: #fff;
    margin-bottom: 10px;
    padding-top: 10px;
    view {
      image {
        width: 95%;
        display: block;
        margin: 0 auto;
      }
    }
  }
}
.swiper-box {
  width: 100%;
  height: 340rpx;
}
.swiper-item {
  width: 100%;
  height: 340rpx;
}
.tabsBox {
  height: 100%;
  display: flex;
  flex-direction: column;
  .tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    view {
      width: 660rpx;
    }
    text {
      margin-right: 20rpx;
      display: block;
    }
  }
  .swiper {
    flex: 1;
    display: flex;
    flex-direction: column;
    .thead {
      display: flex;
      padding: 0rpx 28rpx;
      background-color: #fff;
      margin-top: 2rpx;
      .arrows {
        margin-left: 4upx;
        width: 10upx;
        height: 15upx;
      }
      view {
        height: 60upx;
        display: flex;
        align-items: flex-end;
      }
      .center {
        justify-content: center;
      }
      .right {
        justify-content: flex-end;
      }
      .activeTab {
        text {
          color: #534dff;
        }
      }
      text {
        color: #999;
        font-size: 28rpx;
        text-align: center;
        display: block;
      }
    }
    swiper {
      width: 100%;
      background-color: #fff;
      flex: 1;
      swiper-item {
        padding: 0 30rpx;
        box-sizing: border-box;
        // overflow: scroll;
        .item {
          .maininfo {
            display: flex;
            align-items: flex-start;
            padding: 24rpx 0;
            color: #333;
            > .name {
              text {
                font-size: 16px;
                display: block;
              }
              text:nth-of-type(1) {
                font-weight: 600;
              }
              text:nth-of-type(2) {
                font-size: 12px;
                color: #999;
              }
            }
            > text {
              font-weight: 600;
              font-size: 15px;
              display: block;
              text-align: center;
            }
            .rise_fall {
              color: #fff;
              text-align: right;
              font-size: 15px;
              height: 54rpx;
              line-height: 54rpx;
              text-align: center;
              border-radius: 2px;
            }
            .rise_fall.rise {
              background-color: #00c188;
            }
            .rise_fall.fall {
              background-color: #fa3354;
            }
          }
          .info {
            > view {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20rpx;
              > view {
                display: flex;
                font-size: 24rpx;
                > view:nth-of-type(1) {
                  margin-right: 30rpx;
                  > text:nth-of-type(1) {
                    display: block;
                    color: #999;
                    margin-bottom: 6rpx;
                  }
                  > text:nth-of-type(2) {
                    display: block;
                    color: #fa3354;
                  }
                }
                > view:nth-of-type(2) {
                  margin-right: 30rpx;
                  > text:nth-of-type(1) {
                    display: block;
                    color: #999;
                    margin-bottom: 6rpx;
                  }
                  > text:nth-of-type(2) {
                    display: block;
                    color: #00c188;
                  }
                }
                > view:nth-of-type(3) {
                  margin-right: 30rpx;
                  > text:nth-of-type(1) {
                    display: block;
                    color: #999;
                    margin-bottom: 6rpx;
                  }
                  > text:nth-of-type(2) {
                    display: block;
                    color: #333;
                  }
                }
              }
              button {
                width: 150rpx;
                height: 68rpx;
                border-radius: 4px;
                border: 1px solid #00c188;
                background-color: #fff;
                text-align: center;
                line-height: 68rpx;
                color: #00c188;
                font-size: 30rpx;
                margin: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
