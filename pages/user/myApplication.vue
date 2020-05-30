<template>
	<view class="box">
		<view class="item" v-for="item in list" :key="item.id">
			<view>
				<text class="title">申请成为合伙人</text>
				<text class="content">预约人姓名：{{item.name}}</text>
				<text class="content">手机号：{{item.phone}}</text>
				<text class="content">身份证号：{{item.idcard}}</text>
				<text class="content">申请时间：{{item.createTime}}</text>
				<text class="res" v-if="item.status == 1">恭喜您申请成为合伙人已通过审核！</text>
				<text class="res" v-if="item.status == 0">资料正在审核中，预计1个工作日内审核完毕！</text>
				<text class="res" v-if="item.status == -1">{{item.reason}}</text>
			</view>
			<view>
				<text v-if="item.status == 1" class="success">申请成功</text>
				<text v-if="item.status == 0">申请中</text>
				<text v-if="item.status == -1">申请失败</text>
			</view>
		</view>
		<view v-if="list.length == 0" class="none">暂无申请记录</view>
	</view>
</template>

<script>
	import {myApplication} from '@/api/user_api'
	
	export default {
		data() {
			return {
				list: []
			}
		},
		methods: {
			getData() {
				myApplication().then(res => {
					this.list = res.data
				})
			}
		},
		onLoad() {
			this.getData()
		}
	}
</script>

<style lang="scss">
.box{
	min-height: 100%;
	background-color: #fff;
	.item{
		padding: 15px;
		display: flex;
		background-color: #fff;
		border-top: 1px solid #f5f5f5;
		>view:nth-of-type(1){
			flex: 1;
			>.title{
				display: block;
				font-size: 14px;
				margin-bottom: 18px;
				font-weight: bold;
			}
			>.content{
				display: block;
				font-size: 14px;
				margin-bottom: 10px;
			}
			>.res{
				display: block;
				font-size: 14px;
				font-weight: bold;
			}
		}
		>view:nth-of-type(2){
			font-size: 14px;
			font-weight: bold;
		}
		.success{
			color: #FFC13B;
		}
	}
	.item:last-of-type{
		border-bottom: 1px solid #f5f5f5;
	}
	.none{
		padding: 30px;
		text-align: center;
		font-size: 14px;
		font-weight: bold;
	}
}
</style>
