<template>
	<view v-if="marketInfo.maxPrice" class="chartDetailBox">
		<view class="klineBox">
			<view class="coinInfo" v-if="marketInfo">
				<view @click="selectCoin" v-if="marketInfo">
					<!-- <text>{{marketInfo.coinName}}/{{marketInfo.marketCoinName}}</text> -->
					<text>{{marketInfo.coinCnName}}</text>
          <text>{{marketInfo.coinName}}</text>
					<!-- <text class="iconfont iconlujing1"></text> -->
				</view>
				<view>
					<text :class="{up: marketInfo.incRate >= 0, down: marketInfo.incRate < 0}">￥{{marketInfo.lastTradePrice}}</text>
          <!--<view @click="collection">
						<text class="iconfont iconshoucang5"></text>
						<text>添加自选</text>
					</view> -->
				</view>
				<view>
					<view class="">						
						<text>≈{{cnyprice * marketInfo.lastTradePrice}}CNY</text>
						<text :class="{up: marketInfo.incRate >= 0, down: marketInfo.incRate < 0}" v-if="marketInfo">{{marketInfo.incRate}}%</text>
					</view>
					<text>最高 {{marketInfo.maxPrice}}</text>
				</view>
				<view>
					<text>24H量 {{marketInfo.tradeQty}}</text>
					<text>最低 {{marketInfo.minPrice}}</text>
				</view>
			</view>
			<view class="kline">
				<QSTabs :tabs="tabs" :current="currentTab" minWidth="120" activeColor="#D65A34" defaultColor="#B6BEC8" :activeBold="false" animationMode="line1" space="20" @change="changeTab"></QSTabs>
				<full-uchart :klineList="klineList"></full-uchart>
			</view>
		</view>
		<view class="deepBox">
			<QSTabs class="qsTabs" :tabs="tabs2" :current="currentTab2" minWidth="120" activeColor="#D65A34" defaultColor="#B6BEC8" :activeBold="false" animationMode="line1" space="20" @change="changeTab2"></QSTabs>
			<view class="deepDetail" v-if="currentTab2 == 0">
				<view class="percent">
					<text>买 81.84%</text>
					<text>18.16% 卖</text>
					<view></view>
					<view></view>
				</view>
				<view class="deepList">
					<view class="buy">
						<view class="title">买</view>
						<view class="list">
							<view class="item" v-for="(item, index) in buydeepList" :key="index">
								<view class="progress" :style="{width: item.qty/(Math.max.apply(null, selldeepList.map(item=>item.qty))) * 100 + '%'}"></view>
								<text>{{index + 1}}</text>
								<text>{{item.price}}</text>
								<text>{{item.qty}}</text>
							</view>
						</view>
					</view>
					<view class="sell">
						<view class="title">卖</view>
						<view class="list">
							<view class="item" v-for="(item, index) in selldeepList" :key="index">
								<view class="progress" :style="{width: item.qty/(Math.max.apply(null, buydeepList.map(item=>item.qty))) * 100 + '%'}"></view>
								<text>{{index + 1}}</text>
								<text>{{item.price}}</text>
								<text>{{item.qty}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="bargainDetail" v-if="currentTab2 == 1">
				<view class="title">
					<text>时间</text>
					<text>价格</text>
					<text>交易量</text>
				</view>
				<view class="detail">
					<view class="item" v-for="(item, index) in newDealList" :key="index">
						<text>{{item.createTime}}</text>
						<view>
							<text>{{item.price}}</text>
							<text>≈18.18 CNY</text>
						</view>
						<view>
							<text>{{item.qty}}</text>
							<text>≈405.995 CNY</text>
						</view>
					</view>
				</view>
			</view>
		</view>
<!-- 		<view class="footer">
			<view class="buybtn" @click="go">现货买入</view>
			<view class="sellbtn" @click="go">现货卖出</view>
		</view> -->
	</view>
</template>

<script>
import QSTabs from '@/components/QS-tabs/QS-tabs'
import fullUchart from '@/components/my-uchart/full-uchart'
import {indexPage} from '@/api/index_api'
import {saveCoin, cancelCoin} from '@/api/exchange_api'
import { toast, loading} from '@/common/common.js';
	
export default {
	components: {
		QSTabs,
		fullUchart
	},
	data() {
		return {
			marketId: 0,
			tabs: ['1分钟', '5分钟', '10分钟', '30分钟', '1小时', '4小时', '1天', '1周', '1月'],
			tabs2: ['深度', '成交'],
			currentTab: 1,
			currentTab2: 0,
			selldeepList: [],
			buydeepList: [],
			newDealList: [],
			klineList: [],
			marketInfo: {},
			cnyprice: 1 // 美元对cny的汇率
		}
	},
	methods: {
		// 切换k线图时间类型
		changeTab(index) {
			this.currentTab = index
			
			let time = null
			switch (index) {
				case 0:
					time = 1;
					break;
				case 1:
					time = 5;
					break;
				case 2:
					time = 10;
					break;
				case 3:
					time = 30;
					break;
				case 4:
					time = 60;
					break;
				case 5:
					time = 240;
					break;
				case 6:
					time = 1440;
					break;
				case 7:
					time = 10080;
					break;
				case 8:
					time = 43200;
			}
			uni.closeSocket()
			uni.onSocketClose(() => {
				console.log(time)
				this.initSocket(time)
			})
		},
		changeTab2(index) {
			this.currentTab2 = index
		},
		// 跳转到选择页面
		selectCoin() {
			// 由于tabbar页面无法传参,需要storage里设置一个值,在selectCoin页面做相应处理,这里不是tabbar页所以设置为false
			uni.setStorageSync('tab', false)
			uni.navigateTo({
				url: '/pages/exchange/selectCoin?redirect=/pages/exchange/chartDetail'
			})
		},
		go() {
			uni.switchTab({url:'/pages/exchange/index'})
		},
		
		// 初始化socket连接并处理接收的数据
		initSocket(time) {
			let userinfo = uni.getStorageSync('userinfo')
			uni.connectSocket({
				url: `ws://${this.socketURL}/websocket/topic/tradeListAndMarketOrders/${this.marketId}/${time?time:'5'}/${userinfo ? userinfo.userId + '' : null}`,
				method: 'POST',
				header: {
					lang: 'cn',
					userId: userinfo ? userinfo.userId : '',
					accessToken: userinfo ? userinfo.accessToken : ''
				}
			})
			console.log(`ws://${this.socketURL}/websocket/topic/tradeListAndMarketOrders/${this.marketId}/${time?time:'5'}/${userinfo ? userinfo.userId + '' : null}`)
			// 处理接收到的数据
			uni.onSocketMessage(res => {
        loading(2)
				let data = JSON.parse(res.data)
				this.selldeepList = data.sellList
				this.buydeepList = data.buyList
				this.newDealList = data.tradeList
				this.klineList = data.klineList
				this.marketInfo = data.marketInfo
				this.cnyprice = data.marketInfo.cnyPrice
			})
			uni.onSocketOpen(res => {
        // loading(2)
			  console.log('WebSocket连接已打开！');
			})
			uni.onSocketError(err => {
        // loading(2)
			  console.log('WebSocket连接打开失败，请检查！', err);
			})
			uni.onSocketClose(function (res) {
        // loading(2)
			  console.log('WebSocket 已关闭！');
			});
		}
	},
	onLoad(option) {
    loading(1,'加载中')
		this.marketId = option.marketId
		this.initSocket()
	}
}
</script>

<style lang="scss" scoped>
	.chartDetailBox{
		min-height: 100%;
		background-color: #131B27;
		.klineBox{
			background-color: #17202E;
			.coinInfo{
				padding: 14rpx 18rpx;
				>view:nth-of-type(1){
					margin-bottom: 10rpx;
					text:nth-of-type(1){
						color: #fff;
						margin-right: 8rpx;
					}
					text:nth-of-type(2){
						color: #fff;
						font-size: 24rpx;
						vertical-align: middle;
					}
				}
				>view:nth-of-type(2){
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 24rpx;
					margin-bottom: 8rpx;
					>text{
						font-size: 42rpx;
					}
					>text.up{
						color: rgb(54,174,90);
					}
					>text.dwon{
						color: #D65A34;
					}
					>view{
						color: #B6BEC8;
						>text:nth-of-type(1){
							font-size: 20rpx;
							margin-right: 6rpx;
						}
					}
				}
				>view:nth-of-type(3){
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 24rpx;
					margin-bottom: 8rpx;
					color: #B6BEC8;
					>view{
						>text:nth-of-type(1){
							margin-right: 16rpx;
						}
						>text.up{
							color: rgb(54,174,90);
						}
						>text.dwon{
							color: #D65A34;
						}
					}
					>text{
						display: block;
						width: 210rpx;
					}
				}
				>view:nth-of-type(4){
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 24rpx;
					margin-bottom: 8rpx;
					color: #B6BEC8;
					>text:nth-of-type(2){
						display: block;
						width: 210rpx;
					}
				}
			}
		}
		.deepBox{
			margin-top: 30rpx;
			background-color: #17202E;
			.qsTabs{
				border-bottom: 1px solid #444;
			}
			.deepDetail{
				padding: 14rpx 20rpx 0 20rpx;
				.percent{
					font-size: 28rpx;
					color: #fff;
					display: flex;
					position: relative;
					height: 35px;
					text:nth-of-type(1){
						position: absolute;
						top: 0;
						left: 10px;
						line-height: 35px;
					};
					text:nth-of-type(2){
						position: absolute;
						top: 0;
						right: 10px;
						line-height: 35px;
					};
					>view:nth-of-type(1){
						width: 81.84%;
						background-color: rgba(214,91,48,.3);
					}
					>view:nth-of-type(2){
						width: 18.16%;
						background-color: rgba(54,174,90,.3);
					}
				}
				.deepList{
					display: flex;
					.buy{
						width: 50%;
						.title{
							font-size: 24rpx;
							color: #5E6168;
							margin-bottom: 20rpx;
						}
						.list{
							padding-right: 10rpx;
							.item{
								font-size: 24rpx;
								height: 50rpx;
								display: flex;
								justify-content: flex-start;
								align-items: center;
								position: relative;
								.progress{
									max-width: 100%;
									height: 50rpx;
									position: absolute;
									top: 0;
									right: 0;
									background-color: rgba(213,91,56,.3);
								}
								>text:nth-of-type(1){
									color: rgb(213,91,56);
									margin-right: 30rpx;
								}
								>text:nth-of-type(2){
									color: #5E6168;
								}
								>text:nth-of-type(3){
									flex: 1;
									text-align: right;
									color: rgb(213,91,56);
								}
							}
						}
					}
					.sell{
						width: 50%;
						.title{
							font-size: 24rpx;
							color: #5E6168;
							margin-bottom: 20rpx;
						}
						.list{
							padding-left: 10rpx;
							.item{
								height: 50rpx;
								position: relative;
								font-size: 24rpx;
								display: flex;
								justify-content: flex-end;
								align-items: center;
								.progress{
									max-width: 100%;
									height: 50rpx;
									position: absolute;
									top: 0;
									left: 0;
									background-color: rgba(45,178,93,.3);
								}
								>text:nth-of-type(1){
									color: rgb(45,178,93);
									flex: 1;
									text-align: left;
								}
								>text:nth-of-type(2){
									color: #5E6168;
									margin-right: 30rpx;
								}
								>text:nth-of-type(3){
									color: rgb(45,178,93);
								}
							}
						}
					}
				}
			}
			.bargainDetail{
				padding: 14rpx 20rpx 0 20rpx;
				color: #B6BEC8;
				font-size: 24rpx;
				.title{
					display: flex;
					justify-content: space-between;
					height: 60rpx;
				}
				.detail{
					.item{
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding-bottom: 30rpx;
						>text{
							display: block;
							width: 33.3%;
						}
						>view:nth-of-type(1){
							width: 33.3%;
							text:nth-of-type(1){
								display: block;
								color: rgb(213,91,56);
							}
							text:nth-of-type(2){
								display: block;
							}
						}
						>view:nth-of-type(2){
							width: 33.3%;
							text-align: right;
							text:nth-of-type(1){
								color: #666;
								display: block;
							}
							text:nth-of-type(2){
								display: block;
							}
						}
					}
				}
			}
		}
		.footer{
			width: 100%;
			height: 120rpx;
			background-color: #333B45;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 100;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			.buybtn{
				width: 45%;
				height: 86rpx;
				line-height: 90rpx;
				margin-right: 20rpx;
				border-radius: 4px;
				background-color: #48BEA4;
				text-align: center;
			}
			.sellbtn{
				width: 45%;
				height: 86rpx;
				line-height: 90rpx;
				border-radius: 4px;
				background-color: #DA4EA0;
				text-align: center;
			}
		}
	}
	.chartDetailBox:after{
		content: '';
		display: block;
		height: 120rpx;
	}
</style>
