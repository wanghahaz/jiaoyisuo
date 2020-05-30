<template>
	<view class="content">
		<view class="list pd23 bb" v-for="(val,index) in list" :key="index" @click="choose(val.address)">
			<view><text class="ft6">{{val.coinName}}</text>{{val.address}}</view>
			<view>
				<view>备注：{{val.remark}}</view>
				<view @click="deleteItem(val.id)">删除</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {coinAddressList, deleteById} from '@/api/wallet_api.js';
	export default {
		data() {
			return {
				list: [],
			};
		},
		async onLoad() {
			// let listData = await coinAddressList({
			// 	pageIndex: 1,
			// 	pageSize: 10,
			// });
			// this.list = listData.data.list;
			// console.log(listData)
			 
		},
		async onShow() {
			let listData = await coinAddressList({
				pageIndex: 1,
				pageSize: 10,
			});
			this.list = listData.data.list;
			console.log(listData)
		},
		// 监听右上角按钮
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: "./addAddress"
			})
		},
		methods: {
			choose(address) {
				// var pages=getCurrentPages(), prevPage=null;
				// console.log(pages)
				//  if(pages.length>1){
				//      prevPage=pages[pages.length-2];
				//  }
				//  if(prevPage){
				//      prevPage.$data.dAddress=address;
				// 	 uni.navigateBack({
				// 	 	delta:1
				// 	 })
				//  }
				uni.setStorageSync("isBack","true");
				uni.setStorageSync("address",address);
					 uni.navigateBack({
					 	delta:1
					 })
			},
			//删除
			async deleteItem(id) {
				let listData = await deleteById({
					id: id
				}).then(res=> {
					uni.showToast({
						title: res.msg,
						icon: "none"
					})
					if(res.code == 1) {
						setTimeout(async ()=> {
							let listData = await coinAddressList({
								pageIndex: 1,
								pageSize: 10,
							});
							this.list = listData.data.list;
						},1500)
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.list {
		background: #fff;
		font-size: 28upx;
		text {
			margin-right: 40upx;
		}
		> view:first-child {
			overflow: hidden;
			text-overflow: ellipsis;
		}
		view:last-child {
			margin-top: 20upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			view:last-child {
				padding: 2upx 6upx;
				font-size: 24upx;
				color: #EC5754;
				background: #FFE7E7;
				border-radius: 4upx;
			}
		}
	}
</style>
