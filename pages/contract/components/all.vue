<template>
  <view class="all_contract">
    <view @click="toRouter('/pages/contract/simple', {})" class="simple">
      <image class="toImg" src="../../static/images/contract/simple.png" mode=""></image>
      <view class="toText">
        <text>期权简选</text>
        <uni-icons size="16" color="#534dff" type="forward"></uni-icons>
      </view>
    </view>
    <!--  -->
    <view class="header_t">
      <view class="header_c">
        <!-- //@click="headerTab(1)" -->
        <text class="header_n">{{ this.subData.contractName || '锦绣山河' }}</text>
        <uni-icons size="14" :type="headerIndex == 1 ? 'arrowdown' : 'arrowup'"></uni-icons>
      </view>
      <view class="header_c" @click="headerTab(2)">
        <text class="header_n">{{ this.subData.contractType ? this.subData.contractType : '看涨&看跌' }}</text>
        <uni-icons size="14" :type="headerIndex == 2 ? 'arrowdown' : 'arrowup'"></uni-icons>
      </view>
      <view class="header_c" @click="headerTab(3)">
        <text class="header_n">{{ this.subData.contractTime || '到期时间' }}</text>
        <uni-icons size="14" :type="headerIndex == 3 ? 'arrowdown' : 'arrowup'"></uni-icons>
      </view>
    </view>
    <!--  -->
    <view class="list_tit">
      <text class="tit_flex ">执行价格</text>
      <text class="tit_flex ">最新</text>
      <text class="tit_flex ">买一</text>
      <text class="tit_flex ">卖一</text>
      <text class="tit_flex">类型</text>
    </view>
    <scroll-view class="scrollView" :scroll-y="'true'" @scrolltolower="scroll">
      <view @click="editType(item)" v-for="(item, ind) in dataList" :key="ind" class="list_tit">
        <text class="tit_flex boid ">{{ item.contractPrice.toFixed(2) }}</text>
        <text class="tit_flex ">{{ item.tradePrice.toFixed(2) }}</text>
        <text class="green tit_flex ">{{ item.buyOne.toFixed(2) }}</text>
        <text class="red tit_flex ">{{ item.sellOne.toFixed(2) }}</text>
        <text class="tit_flex">看涨</text>
      </view>
      <view class="noMore">{{ dataList.length == 0 ? '暂时没有数据' : dataList.length != 0 && noMore ? '没有更多了' : '加载更多' }}</view>
      <view class="clear"></view>
    </scroll-view>

    <view v-if="model_show" class="model" @click="close_mask">
      <view v-if="headerIndex == 1" class="moder_header">
        <!-- <text @click="getlist('锦绣山河', 'reset')" class="m_h_text" :class="subData.contractName == '锦绣山河' ? 'actText' : ''">锦绣山河</text> -->
        <!-- <text>春去秋来</text>
        <text>荆山玉环</text> -->
      </view>
      <view v-else-if="headerIndex == 2" class="moder_header">
        <text @click="getlist('看涨', 'reset')" class="m_h_text" :class="subData.contractType == '看涨' ? 'actText' : ''">看涨</text>
        <text @click="getlist('看跌', 'reset')" class="m_h_text" :class="subData.contractType == '看跌' ? 'actText' : ''">看跌</text>
      </view>
      <view v-else-if="headerIndex == 3" class="moder_header">
        <template v-for="(item, ind) in timelist">
          <text class="m_h_text" :class="item == subData.contractTime ? 'actText' : ''" @click="getlist(item, 'reset')" :key="ind">{{ item }}</text>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/contract_api.js';
import { toast, loading, model, fn } from '@/common/common.js';
export default {
  name: 'allContract',
  props: {
    // 切换选择条件 bol
    parShow: {
      default: false,
      type: Boolean
    },
    //  切换选择条件 index
    headerInd: {
      default: 0,
      type: Number
    }
  },
  components: {
    uniIcons
  },
  mounted() {
    this.contractTime();
    this.getlist('', '');
  },
  watch: {
    headerInd: {
      handler(newValue, old) {
        this.headerIndex = newValue;
      },
      immediate: true
    },
    parShow: {
      handler(newValue, old) {
        this.model_show = newValue;
      },
      immediate: true
    }
  },
  data() {
    return {
      subData: {
        contractName: null,
        contractType: '',
        contractTime: null,
        pageNum: 1,
        pageSize: 10
      },
      noMore: false,
      dataList: [],
      model_show: false,
      headerIndex: 0,
      titleIndex: 0,
      titleList: ['全部期权', '交易', '委托', '持仓'],
      timelist: []
    };
  },
  methods: {
    // 跳转 交易页面 传入数据id
    editType(e) {
      this.$emit('editTab', { index: 1, name: 'deal' });
      uni.setStorageSync('contractName',e.contractName)
      this.setId(e.id);
    },
    getlist(type, reset) {
      loading(1, '加载中');
      if (reset == 'reset') {
        this.subData.pageNum = 1;
        if (this.headerInd != 1) {
          this.dataList = [];
        }
      } else if (reset == 'add') {
        this.subData.pageNum = this.subData.pageNum + 1;
      }
      if (this.headerIndex == 1) {
        this.subData.contractName = type;
        loading(2);
        return;
      } else if (this.headerIndex == 2) {
        this.subData.contractType = type;
      } else if (this.headerIndex == 3) {
        this.subData.contractTime = type;
      }
      this.close_mask();
      let data = JSON.parse(JSON.stringify(this.subData));
      data.contractType = data.contractType == '看涨' ? '1' : data.contractType == '看跌' ? '2' : null;
      myAxios.contract_list(data).then(res => {
        loading(2);
        this.dataList = [...this.dataList, ...res.data.list];
        if (this.subData.pageNum == 1) {
          this.setId(this.dataList[0].id);
          uni.setStorageSync('contractName',this.dataList[0].contractName)
        }
        if (res.data.total <= this.dataList.length) {
          this.noMore = true;
        }
      });
    },
    close_mask() {
      this.model_show = false;
      this.headerIndex = 0;
    },
    // 获取筛选时间
    contractTime() {
      myAxios.contractTime().then(res => {
        this.timelist = res.data;
      });
    },
    // 设置交易 页面id
    setId(id) {
      this.$emit('getId', { id: id });
    },
    scroll() {
      if (this.noMore) return;
      let data = JSON.parse(JSON.stringify(this.subData));
      this.getlist('', 'add');
      // this.
    },
    // 筛选条件切换
    headerTab(ind) {
      if (ind != this.headerIndex) {
        this.model_show = true;
        this.headerIndex = ind;
      } else {
        this.model_show = false;
        this.headerIndex = 0;
      }
    },
    tab(ind) {
      if (ind != this.titleIndex) {
        this.titleIndex = ind;
      }
    },
    toRouter(url, data) {
      uni.navigateTo({
        url: url + fn.params(data)
      });
    }
  }
};
</script>

<style lang="scss">
$fs16: 32upx;
$fs14: 28upx;
$fs15: 30upx;
$text_c: #534dff;
.b_t {
  border-top: 1px solid #f5f5f5;
}
.all_contract {
  position: relative;
  overflow-y: auto;
  background: #fff;
  font-family: PingFangSC-Medium, PingFang SC;
  .model {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 358upx);
    //#ifdef H5
    height: calc(100% - 446upx);
    // #endif
    background: rgba(0, 0, 0, 0.6);
    .moder_header {
      background: #fff;
      display: flex;
      max-height: 300upx;
      overflow-y: auto;
      font-size: $fs15;
      flex-direction: column;
      .m_h_text {
        line-height: 84upx;
        padding: 0 6%;
        @extend .b_t;
      }
      .actText {
        color: #534dff;
      }
    }
  }
  .header_t {
    height: 108upx;
    @extend .b_t;
    align-items: center;
    display: flex;
    padding: 0 30upx;
    justify-content: space-between;
    font-size: $fs15;
    .header_c {
      justify-content: center;
      align-items: center;
      .header_n {
        margin-left: 4upx;
      }
    }
  }
  .scrollView {
    background: #fff;
    height: calc(100% - 332upx);
    .clear {
      //#ifdef H5
      height: 90px;
      // #endif
    }
    .tit_flex {
      font-size: $fs15;
    }
    .boid {
      font-weight: 700;
    }
    .list_tit {
      line-height: 112upx;
      background: #fff;
      color: #333;
      border-bottom: 1px solid #f5f5f5;
      .green {
        color: #00c188;
      }
      .red {
        color: #fa3354;
      }
    }
  }
  .list_tit {
    padding: 0upx 30upx;
    line-height: 72upx;
    display: flex;
    justify-content: space-between;
    font-size: $fs14;
    color: #999999;
    background: #f5f5f5;
    .tit_flex {
      flex: 1;
      // overflow: hidden;
      // white-space: nowrap;
      // text-overflow: ellipsis;
      text-align: center;
    }
    .text_left{
      text-align: left;
    }
  }
  .noMore {
    text-align: center;
    font-size: 30upx;
    margin: 20upx 0;
    color: #c6c6c6;
  }
  .simple {
    display: flex;
    height: 166upx;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .toImg {
      margin-bottom: 16upx;
      width: 56upx;
      height: 56upx;
    }
    .toText {
      font-weight: 650;
      font-size: $fs14;
      color: $text_c;
    }
  }
}
</style>
