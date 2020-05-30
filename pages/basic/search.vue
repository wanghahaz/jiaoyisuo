<template>
	<view class="searchBox">
		<view class="searchInput">
			<view class="input">
				<text class="iconfont iconsystem-serchbx"></text>
				<input type="text" v-model="keyword" placeholder="请输入要查询的代码或名称" />
			</view>
			<text @click="doSearch">搜索</text>
		</view>
		<view class="content">
			<view class="thead" v-if="searched">
				<text style="width: 30%;">交易对</text>
				<text style="width: 30%;">价格(USDT)</text>
				<text style="width: 24%;text-align: center">涨幅</text>
				<text style="width: 20%;text-align: right">自选</text>
			</view>
			<view class="list" v-if="resData.length && searched">
				<view class="item" v-for="item in resData" :key="item.marketId">
					<view class="maininfo" @click="gotoExchange(item.marketId)">
						<view class="exchange_count" style="width: 30%;">
							<text>{{item.coinCnName}}</text>
							<text>{{item.coinName}}</text>
						</view>
						<text style="width: 30%;text-align: center">{{item.lastTradePrice.toFixed(2)}}</text>
						<!-- <text>¥{{item.cnyPrice}}</text> -->
						<view style="width:24%" class="rise_fall" :class="{rise: item.incRate > 0, fall: item.incRate <= 0}">{{item.incRate >= 0 ? '+' + item.incRate.toFixed(2) : item.incRate.toFixed(2)}}%</view>
						<text style="width: 20%;display: block;text-align: right" class="iconfont iconshoucang4 active" @click.stop="cancel(item.marketId)" v-if="item.isCollection"></text>
						<text style="width: 20%;display: block;text-align: right" class="iconfont iconshoucang4" @click.stop="collection(item.marketId)" v-else></text>
					</view>
				</view>
			</view>
			<view class="noData" v-if="!resData.length && searched">暂无数据</view>
		</view>
	</view>
</template>

<script>
	import {
		search
	} from '@/api/index_api'
	import {
		saveCoin,
		cancelCoin
	} from '@/api/exchange_api'

	export default {
		data() {
			return {
				keyword: '',
				searched: false,
				resData: [], // 搜索结果
			}
		},
		methods: {
			async doSearch() {
				if (!this.keyword) return
				let res = await search({
					coinName: this.keyword
				})
				console.log(res)
				this.resData = res.data
				this.searched = true
			},
			// 把当前交易对添加到自选
			async collection(marketId) {
				let userinfo = uni.getStorageSync('userinfo')
				let pages = getCurrentPages()
				let route = pages[pages.length - 1].route
				if (!userinfo) {
					uni.navigateTo({
						url: `/pages/login_register/login?redirect=/${route}`
					})
					return
				}
				let res = await saveCoin({
					marketId: marketId
				})
				this.doSearch()
			},
			// 把当前交易对取消自选
			async cancel(marketId, ) {
				let res = await cancelCoin({
					marketId: marketId
				})
				this.doSearch()
			},
			// 点击去交易
			gotoExchange(id) {
				uni.navigateTo({
					url: '/pages/basic/exchange/index?marketId=' + id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.searchBox {
		display: flex;
		flex-direction: column;
		height: 100%;

		.searchInput {
			background-color: #fff;
			width: 100%;
			height: 100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			position: fixed;
			/* #ifdef APP-PLUS */
			top: 0;
			/* #endif */
			/* #ifdef H5 */
			top: 44px;
			/* #endif */
			left: 0;
			padding: 20rpx 30rpx;
			border-bottom: 1px solid #f5f5f5;

			.input {
				background-color: #F5F5F5;
				display: flex;
				align-items: center;
				flex: 1;
				height: 100%;
				border-radius: 60rpx;

				text {
					margin-right: 30rpx;
				}

				input {
					flex: 1;
					height: 100%;
					font-size: 14px;
				}
			}

			text {
				padding-left: 20rpx;
				font-size: 32rpx;
			}
		}

		.content {
			flex: 1;
			background-color: #fff;

			.thead {
				display: flex;
				padding: 10rpx 28rpx;
				margin-top: 2rpx;

				text {
					color: #999;
					font-size: 32rpx;
				}
			}

			.list {
				.item {
					padding: 0 15px;
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

			.noData {
				text-align: center;
				margin-top: 100rpx;
			}
		}
	}

	.searchBox:before {
		content: '';
		display: block;
		height: 100rpx;
	}
</style>
