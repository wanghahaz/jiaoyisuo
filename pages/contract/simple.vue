<template>
  <view class="simple" v-if="index">
    <view class="header">
      <image class="fixed" src="../../static/images/contract/simpleBg.png" mode=""></image>
      <text>当前锦绣山河 300103 指数</text>
      <text>{{index}}</text>
    </view>
    <view class="box_content">
      <image src="../../static/images/contract/simple_.png" mode=""></image>
      <text>您认为锦绣山河 300103 接下来会上涨还是下跌？</text>
      <view class="">
        <text @click="toRouter('/pages/contract/simpleList', { type: 1 ,index:index})">上涨</text>
        <text @click="toRouter('/pages/contract/simpleList', { type: 2 ,index:index})">下跌</text>
      </view>
    </view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/contract_api.js';
import { toast, loading, model, fn } from '@/common/common.js';
export default {
  name: 'simple',
  data(){
    return{
        index:'0'
    }
  },
  mounted(){
    this.getIndex()
  },
  methods: {
    getIndex(){
      loading(1,'加载中')
      myAxios.getIndex().then(res=>{
        loading(2,{})
        if(res.code == 1){
            this.index=(res.data/1).toFixed(2)
        }else{
          toast({text:res.msg||'网络出错'})
        }
        
      })
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
$fs15: 30upx;
.simple {
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
      font-size: $fs15;
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
    border-radius:4upx ;
    display: flex;
    flex-direction: column;
    image {
      width: 180upx;
      height: 180upx;
      margin: 60upx auto 40upx auto;
    }
    > text {
      font-size: $fs15;
      margin: 0 auto;
    }
    > view {
      margin: 40upx 0;
      box-sizing: border-box;
      padding: 0 50upx;
      display: flex;
      justify-content: space-around;
      > text {
        width: 220upx;
        line-height: 76upx;
        text-align: center;
        font-size: $fs15;
        color: #fff;
        border-radius: 6upx;
      }
      text:nth-of-type(1) {
        background: #00c188;
        box-shadow: 0upx 14upx 18upx -12upx #00c188;
      }
      text:nth-of-type(2) {
        background: #fa3354;
        box-shadow: 0upx 14upx 14upx -12upx #fa3354;
      }
    }
  }
}
</style>
