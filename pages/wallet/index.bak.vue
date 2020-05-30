<template>
	<view class="content">
		<view class="tabs">
			<QSTabs :tabs="tabs" :current="currentTab" minWidth="120" activeColor="#5DC1CF" defaultColor="#000" :activeBold="false" animationMode="line1" space="20" @change="changeTab" ref="tabs"></QSTabs>
		</view>
		<view class="bg">
			<image src="../../static/images/bg_3.png"></image>
			<view class="assets">
				<view class="bill" @click="jumpBill">
					<image src="../../static/images/bill_1.png"></image><text>账单</text>
				</view>
				<view class="txt">
					<text>账户总资产</text>
				</view>
				<view class="txt txtBtc">28389300 RMB</view>
				<view class="myinfo">
					<view>
						<text>资金余额</text>
						<text>2434.0</text>
					</view>
					<view>
						<text>市值</text>
						<text>2434.0</text>
					</view>
					<view>
						<text>资金可取</text>
						<text>2434.0</text>
					</view>
				</view>
			</view>
		</view>
		<view class="list bcf">
			<view class="line bb">
				<view class="ft6">资产列表</view>
				<view class="pd23" @click="jumpAdd"><uni-icons type="plusempty" size="15"></uni-icons><text>添加资产</text></view>
			</view>
			<view class="listItem pd23 bb" v-for="(val,index) in coinList" :key="index">
				<view class="dry">
					<view class="info">
						<image :src="val.image"></image>
						<view>
							{{val.shortName}} <!--<text>比特币</text>-->
						</view>
					</view>
					<view class="tag">
						<view @click="jumpExchange(val.id)">交易</view>
						<view @click="jumpGetM(val.id,val.maxOutQty,val.shortName)">提现</view>
						<view class="red" @click="jumpPay(val.id,val.shortName)">充值</view>
					</view>
				</view>
				<view class="num">
					<view class="tal">
						<view>持有总量</view>
						<text>{{val.totalBanlance}}</text>
					</view>
					<view>
						<view>持有可用</view>
						<text>{{val.banlance}}</text>
					</view>
					<view>
						<view>持有冻结</view>
						<text>{{val.freezingBanlance}}</text>
					</view>
					<view class="tar">
						<view>锁定数量</view>
						<text>{{val.totalBanlance}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	import {propertyList} from '@/api/wallet_api.js';
	import QSTabs from '@/components/QS-tabs/QS-tabs'
	
	export default {
		components: {
			uniIcons,
			QSTabs
		},
		data() {
			return {
				tabs: ['持仓', '买入', '卖出', '撤单', '查询'],
				currentTab: 0,
				data: {},
				total: {},//资产详情
				coinList: [], //资产列表
			};
		},
		async onLoad() {
			let data = await propertyList({
				type: 2
			});
			this.total = data.data.total;
			this.coinList = data.data.coinList;
		},
		// 监听右上角按钮
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: "./listAddress"
			})
		},
		methods: {
			changeTab(index) {
				this.currentTab = index
			},
			// 添加资产
			jumpAdd() {
				uni.navigateTo({
					url: "./addAssets"
				})
			},
			// 充值
			jumpPay(id, name) {
				uni.navigateTo({
					url: "./payCode?id=" + id + "&name=" + name
				})
			},
			// 提现
			jumpGetM(id, max, name) {
				uni.navigateTo({
					url: "./getMoney?id=" + id + "&max=" + max + "&name=" + name
				})
			},
			// 交易
			jumpExchange(id) {
				uni.navigateTo({
					url: "/pages/basic/exchange/index?id=" + id
				})
			},
			//账单
			jumpBill() {
				uni.navigateTo({
					url: "./bill"
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
@import './assets.css';
.content{
		height: 100%;
	.tabs{
		background-color: #fff;
	}
	.bg {
		position: relative;
		z-index: 1;
		margin-bottom: 20upx;
		>image {
			position: absolute;
			width: 100%;
			height: 100%;
			z-index: -1;
		}
		.assets {
			width: 100%;
			height: 100%;
			padding: 10px 15px 15px 15px;
			.bill {
				font-size: 30upx;
				color: #fff;
				text-align: right;
				// margin-bottom: 20upx;
				image {
					width: 22upx;
					height: 24upx;
					margin-right: 16upx;
				}
			}
			.txt {
				// margin-bottom: 10upx;
				color: #fff;
				font-size: 24upx;
				text-align: center;
				image {
					width: 30upx;
					height: 20upx;
					margin-left: 6upx;
					padding: 0 20upx;
				}
			}
			.txtBtc {
				font-size: 48upx;
			}
			.myinfo{
				margin-top: 20px;
				display: flex;
				justify-content: center;
				color: #fff;
				font-size: 14px;
				view{
					text{
						display: block;
						text-align: center;
					}
				}
				view:nth-of-type(2){
					margin: 0 120rpx;
				}
			}
		}
	}
	.list {
		.line {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 28upx;
			padding-left: 30upx;
			text {
				margin-left: 6upx;
				font-size: 20upx;
			}
		}
	}
}
</style>
