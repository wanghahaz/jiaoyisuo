<template>
	<view class="box">
		<QSTabs style="background-color: #fff;" :tabs="tabs" :current="currentTab" minWidth="120" activeColor="#534DFF" defaultColor="#000" :activeBold="false" animationMode="line1" space="20" @change="changeTab" ref="tabs"></QSTabs>
		<view class="table">
			<view class="thead">
				<text style="width: 30%;">名称</text>
				<text style="width: 30%;text-align: center;">最新</text>
				<text style="width: 24%;text-align: center">涨幅</text>
				<text style="width: 20%;text-align: right">自选</text>
			</view>
			<swiper :current="currentTab" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="(item, index) in tabsInfo" :key="index">
					<scroll-view scroll-y>
						<view class="item" v-for="item2 in item.marketInfos" :key="item2.marketId">
							<view class="maininfo" @click="selectCoin(item2.marketId)">
								<view class="exchange_count" style="width: 30%;">
										<text>{{item2.coinCnName}}</text>
										<text>{{item2.coinName}}</text>
								</view>
								<text style="width: 30%;text-align: center">{{item2.lastTradePrice.toFixed(2)}}</text>
								<!-- <text>¥{{item.cnyPrice}}</text> -->
								<view style="width:21%" class="rise_fall" :class="{rise: item2.incRate >= 0, fall: item2.incRate < 0}">{{item2.incRate >= 0 ? '+' + item2.incRate.toFixed(2) : item2.incRate.toFixed(2)}}%</view>
								<text style="width: 20%;display: block;text-align: right" class="iconfont iconshoucang4 active" @click.stop="cancel(item2.marketId)" v-if="item2.isCollection"></text>
								<text style="width: 20%;display: block;text-align: right;color: #ccc;" class="iconfont iconshoucang4" @click.stop="collection(item2.marketId)" v-else></text>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y class="mine">
						<view class="item" v-for="item in mineList" :key="item.marketId">
							<view class="maininfo" @click="selectCoin(item.marketId)">
								<view class="exchange_count" style="width: 30%;">
										<text>{{item.coinCnName}}</text>
										<text>{{item.coinName}}</text>
								</view>
								<text style="width: 30%;text-align: center">{{item.lastTradePrice.toFixed(2)}}</text>
								<!-- <text>¥{{item.cnyPrice}}</text> -->
								<view style="width:21%" class="rise_fall" :class="{rise: item.incRate >= 0, fall: item.incRate < 0}">{{item.incRate >= 0 ? '+' + item.incRate.toFixed(2) : item.incRate.toFixed(2)}}%</view>
								<text style="width: 20%;display: block;text-align: right" class="iconfont iconshoucang4 active" @click.stop="cancel(item.marketId)" v-if="item.isCollection"></text>
								<text style="width: 20%;display: block;text-align: right;color: #ccc;" class="iconfont iconshoucang4" @click.stop="collection(item.marketId)" v-else></text>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>
<script>
import QSTabs from '@/components/QS-tabs/QS-tabs'
import {indexPage} from '@/api/index_api'
import {saveCoin, cancelCoin} from '@/api/exchange_api'
import { toast, loading, model, fn } from '@/common/common.js';

export default {
	components: {
		QSTabs
	},
	data() {
		return {
			redirect: '', // 选择后要重定向回去的页面地址
			tabs: [],
			tabsInfo: null ,// tab页所有数据
			currentTab: 0, // 当前标签页
			currentMarketId: 0 ,// 当前选择的交易对id
			mineList: null // 自选标签数据
		}
	},
	methods: {
		// 切换tab标签
		changeTab(index) {
			this.currentTab = index
		},
		// 选择交易对
		selectCoin(id) {
			uni.navigateTo({
				url: '/pages/basic/exchange/index?marketId=' + id
			})
		},
		transition({detail: {dx}}) {
			this.$refs.tabs.setDx(dx);
		},
		animationfinish({detail: {current}}) {
			this.$refs.tabs.setFinishCurrent(current);
			this.currentTab = current;
		},
		// 把当前交易对添加到自选
		collection(marketId) {
			saveCoin({
				marketId: marketId
			}).then(res => {
				console.log(res)
				if(!res.success) {
					let pages = getCurrentPages()
					let route = pages[pages.length - 1].route
					uni.navigateTo({
						url: '/pages/login_register/login?redirect=/' + route
					})
				} else {
					this.initData()
				}
			})
		},
		// 把当前交易对取消自选
		async cancel(marketId, ) {
			let res = await cancelCoin({
				marketId: marketId
			})
			this.initData()
		},
		async initData() {
      loading(1,'加载中')
			let indexData = await indexPage()
      loading(2)
			this.tabs = indexData.data.marketSortInfoList.map(item => item.sortName)
			this.tabsInfo = indexData.data.marketSortInfoList
			this.mineList = indexData.data.userMaketList
		}
	},
	onNavigationBarButtonTap(e) {
		uni.navigateTo({
			url: '/pages/basic/search'
		})
	},
	onLoad(option) {
		// 判断是否是tabbar页面要切换coin
		uni.getStorage({
		    key: 'tab',
		    success: (res) => {
		        this.istab = res.data
				if(!res.data) {
					this.redirect = option.redirect
				}
		    }
		})
		this.initData()
	}
}
</script>
<style lang="scss" scoped>
.box{
	display: flex;
	flex-direction: column;
	height: 100%;
	.table{
		flex: 1;
		background-color: #fff;
		overflow: scroll;
		display: flex;
		flex-direction: column;
		.thead{
			display: flex;
			padding: 10rpx 28rpx;
			margin-top: 2rpx;
			text{
				color: #999;
				font-size: 32rpx;
			}
		}
		swiper{
			width: 100%;
			background-color: #fff;
			flex: 1;
			swiper-item{
				padding: 0 30rpx;
				box-sizing: border-box;
				.item{
					.maininfo{
						display: flex;
						justify-content: space-between;
						padding: 10rpx 0;
						.exchange_count{
							text{
								font-size: 16px;
								display: block;
								text-align: left;
							}
							text:nth-of-type(2){
								font-size: 12px;
								color: #999;
							}
						}
						text{
							font-size: 18px;
							display: block;
							text-align: center;
						}
						.price{
							width: 150rpx;
							display: flex;
							flex-direction: column;
							text:nth-of-type(1){
								font-size: 24rpx;
							}
							text:nth-of-type(2){
								color: #999;
								font-size: 24rpx;
								margin-top: 4rpx;
							}
						}
						.rise_fall{
							color: #fff;
							text-align: right;
							font-size: 15px;
							height: 54rpx;
							line-height: 54rpx;
							text-align: center;
							border-radius: 2px;
						}
						.rise_fall.rise{
							background-color: #00C188;
						}
						.rise_fall.fall{
							background-color: #FA3354;
						}
						text.active {
							color: #534DFF;
						}
					}
					.info{
						>view{
							display: flex;
							justify-content: space-between;
							margin-bottom: 20rpx;
							>view{
								display: flex;
								font-size: 24rpx;
								>view:nth-of-type(1){
									margin-right: 30rpx;
									>text:nth-of-type(1){
										display: block;
										color: #999;
										margin-bottom: 6rpx;
									}
									>text:nth-of-type(2){
										display: block;
										color: #DC4DA1;
									}
								}
								>view:nth-of-type(2){
									margin-right: 30rpx;
									>text:nth-of-type(1){
										display: block;
										color: #999;
										margin-bottom: 6rpx;
									}
									>text:nth-of-type(2){
										display: block;
										color: #48BEA4;
									}
								}
								>view:nth-of-type(3){
									margin-right: 30rpx;
									>text:nth-of-type(1){
										display: block;
										color: #999;
										margin-bottom: 6rpx;
									}
									>text:nth-of-type(2){
										display: block;
										color: #333;
									}
								}
							}
							button{
								width: 150rpx;
								height: 68rpx;
								border-radius: 4px;
								border: 1px solid #48BEA4;
								background-color: #fff;
								text-align: center;
								line-height: 68rpx;
								color: #48BEA4;
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
