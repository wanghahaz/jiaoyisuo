<template>
	<view class="content">
		<view class="listItem bb" @click="jumpDetails(val.id)" v-for="(val, index) in list" :key="index">
			<view>{{val.name}}</view>
			<text>{{val.releaseTime}}</text>
		</view>
	</view>
</template>

<script>
	import {noticeList} from '@/api/content_api.js';
	export default {
		data() {
			return {
				list: [],
			};
		},
		methods: {
			jumpDetails(id) {
				uni.navigateTo({
					url: "../notice/details?id=" + id
				})
			},
		},
		async onLoad() {
			let listData = await noticeList();
			this.list = listData.data.newCoinList;
			this.list = this.list.concat(listData.data.newNoticeList);
		},
		async onPullDownRefresh() {
			let listData = await noticeList();
			this.list = listData.data.newCoinList;
			this.list = this.list.concat(listData.data.newNoticeList);
			
			uni.stopPullDownRefresh()
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	.content {
		padding: 0 30upx;
	}
	.listItem {
		font-size: 28upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 40upx 0;
		view {
			flex: 1;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}
		text {
			color: #999;
		}
	}
</style>
