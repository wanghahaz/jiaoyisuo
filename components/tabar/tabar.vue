<template>
  <view class="tabar_box">
    <view class="border"></view>
    <view class="tabar_list">
      <view class="tabar_" v-for="(item, index) in tabatlist" :key="index" @click="switchTab(item.pagePath)">
        <image class="tabar_img" :src="current == index ? item.selectedIconPath : item.iconPath" mode=""></image>
        <text :class="current == index ? 'active_text' : ''" class="tabar_text">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    current: {
      type: Number
    }
  },
  watch: {
    current: {
      handler(newValue, old) {},
      immediate: true
    }
  },
  methods: {
    switchTab(path) {
      uni.switchTab({
        url: path
      });
    }
  },
  mounted() {},
  data() {
    return {
      tabatlist: [
        {
          pagePath: '/pages/basic/index',
          text: '行情',
          iconPath: '../../static/images/tabbar/tabbar_1-1.png',
          selectedIconPath: '../../static/images/tabbar/tabbar_1-2.png'
        },
        {
          pagePath: '/pages/my_select/index',
          text: '自选区',
          iconPath: '../../static/images/tabbar/tabbar_2-1.png',
          selectedIconPath: '../../static/images/tabbar/tabbar_2-2.png'
        },
        {
          pagePath: '/pages/wallet/index',
          text: '钱包',
          iconPath: '../../static/images/tabbar/tabbar_3-1.png',
          selectedIconPath: '../../static/images/tabbar/tabbar_3-2.png'
        },
        {
          pagePath: '/pages/contract/index',
          text: '合约',
          iconPath: '../../static/images/tabbar/contract.png',
          selectedIconPath: '../../static/images/tabbar/contract_act.png'
        },
        {
          pagePath: '/pages/user/index',
          text: '我的',
          iconPath: '../../static/images/tabbar/tabbar_4-1.png',
          selectedIconPath: '../../static/images/tabbar/tabbar_4-2.png'
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.tabar_box {
  height: 50px;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  background: #fff;
  .tabar_list {
    height: 100%;
    display: flex;
    .tabar_ {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .tabar_img {
        width: 26px;
        height: 26px;
      }
      .tabar_text {
        font-size: 22upx;
        color: #333;
      }
      .active_text {
        color: #534dff;
      }
    }
  }
  .border {
    height: 2upx;
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>
