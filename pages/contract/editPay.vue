<template>
  <view class="editPay">
    <view @click="edit('币币账户')" class="list flex">
      <view class="flex">
        <text>币币账户</text>
        <text>可用0.00124sc</text>
      </view>
      <uni-icons type="checkmarkempty" color="#524cff" size="30" />
    </view>
    <view @click="edit('法币账户')" class="list flex">
      <view class="flex">
        <text>法币账户</text>
        <text>可用0.00124sc</text>
      </view>
      <uni-icons type="checkmarkempty" color="#524cff" size="30" />
    </view>
    <view @click="edit('合约账户')" class="list flex">
      <view class="flex">
        <text>合约账户</text>
        <text>可用0.00124sc</text>
      </view>
      <uni-icons type="checkmarkempty" color="#524cff" size="30" />
    </view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/otc.js';
import { toast, loading, model, fn } from '@/common/common.js';
export default {
  name: 'editPay',
  data() {
    return {
      type: 0
    };
  },
  onLoad(e) {
    this.type = e.type;
  },
  onShow() {},
  methods: {
    edit(name) {
      var pages = getCurrentPages();
      var page = pages[pages.length - 2];
      // #ifdef APP-PLUS
      if (this.type == 1) {
        page.setData({
          leftName: name
        });
      } else {
        page.setData({
          rightName: name
        });
      }
      // #endif
      //#ifdef H5
      this.type == 1 ? (page._data.leftName = name) : (page._data.rightName = name);
      // #endif
      uni.navigateBack();
    }
  },
  computed: {},
  components: {
    uniIcons
  }
};
</script>

<style scoped lang="scss">
.flex {
  display: flex;
}
.list {
  margin-top: 1px;
  background-color: #fff;
  padding: 5% 40upx;
  align-items: center;
  justify-content: space-between;
  font-size: 32upx;
  > view {
    flex-direction: column;
    > text:nth-of-type(2) {
      font-size: 28upx;
      color: #999;
      margin-top: 4upx;
    }
  }
}
</style>
