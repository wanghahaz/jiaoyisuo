<template>
	<view class="content">
		<view class="listItem pd23 bb" v-for="(val,index) in coinList" :key="index">
			<view class="dry">
				<view class="info">
					<image :src="val.image"></image>
					<view>
						{{val.shortName}}<!--<text>比特币</text>-->
					</view>
				</view>
				<view class="tag">
					<view @click="jumpExchange(val.id)">交易</view>
					<view @click="jumpGetM(val.id, val.maxOutQty,val.shortName)">提现</view>
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
</template>

<script>
	import {propertyList} from '@/api/wallet_api.js';
	export default {
		data() {
			return {
				coinList: [], //资产列表
			};
		},
		async onLoad() {
			let data = await propertyList({
				type: 1
			});
			// this.total = data.data.total;
			this.coinList = data.data.coinList;
		},
		methods: {
			// 充值
			jumpPay(id, name) {
				uni.navigateTo({
					url: "./payCode?id=" + id + "&name=" + name
				})
			},
			// 提现
			jumpGetM(id, max,name) {
				uni.navigateTo({
					url: "./getMoney?id=" + id + "&max=" + max + "&name=" + name
				})
			},
			// 交易
			jumpExchange(id) {
				uni.switchTab({
					url: "../exchange/index?id" + id
				})
			},
		}
	}
</script>

<style lang="scss">
	@import './assets.css';
</style>
