<template>
	<view class="content">
		<view class="tabF bb">
			<view :class="{'activeF':typeF==0}" @click="clickTypeF(0)">
				当前委托
				<text></text>
			</view>
			<view :class="{'activeF':typeF==1}" @click="clickTypeF(1)">
				历史委托
				<text></text>
			</view>
			<view :class="{'activeF':typeF==2}" @click="clickTypeF(2)">
				委托记录
				<text></text>
			</view>
		</view>
		<!-- <view class="tabC bb">
			<view :class="{'activeC':typeC==0}" @click="clickTypeC(0)">全部<text></text></view>
			<view :class="{'activeC':typeC==1}" @click="clickTypeC(1)">成功<text></text></view>
			<view :class="{'activeC':typeC==2}" @click="clickTypeC(2)">审核<text></text></view>
			<view :class="{'activeC':typeC==3}" @click="clickTypeC(3)">失败<text></text></view>
		</view> -->
		<view class="tabC">
			<HMfilterDropdown ref="childFilter" :filterData="filterDataList" :type="tagType" :defaultSelected ="filterDropdownValue" @confirm="confirm"></HMfilterDropdown>
			<view class="date" @click="onShowDatePicker">
				<image src="../../static/images/date.png"></image>
			</view>
			<mx-date-picker :show="showPicker" :type="type" :show-tips="true" :begin-text="'开始'" :end-text="'结束'" @confirm="onSelected" @cancel="onSelected" />
		</view>
		<view class="list">
			<view class="listItem pd23 bb" v-for="(val, index) in list" :key="index">
				<view class="time">
					<view class="ft6">
						<text :style="{color: val.type == 1 ? '' : '#d754a1', background: val.type == 1 ? '' : '#FFE2F3'}">{{val.type == 1 ? "买入" : "卖出"}}</text>
						{{val.marketName}}
					</view>
					<view>{{val.createTime}}</view>
				</view>
				<view class="tab">
					<text>成交价格</text>
					<text>成交数量</text>
					<text>{{typeF == 2 ? "成交手续费" : "成交比例"}}</text>
				</view>
				<view class="number ft6">
					<text>{{val.price}}</text>
					<text>{{val.qty}}</text>
					<text>{{typeF == 2 ? val.fee : val.tradeRate}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="more"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
	import HMfilterDropdown from '@/components/HM-filterDropdown/HM-filterDropdown.vue';
	import filterData from '@/common/filterData.js';//筛选菜单数据
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import {findListByPage, marketCategoryList, findTradeOrderListByPage} from '@/api/center_api.js';
	export default {
		components: {
			uniLoadMore,
			HMfilterDropdown,
			MxDatePicker
		},
		data() {
			return {
				typeF: 0,
				typeC: 0,
				page: 0,
				isLast: false,
				more: "more",
				filterDataList: [],
				filterDropdownValue: [],
				showPicker: false, //是否显示日期
				type: "range", //日期类型
				list: [],
				tagType: 0,
				filterList: [{
						"type": 'hierarchy',
						"submenu": [
							{
								"name": '全部',
								"value": "全部",
								"submenu": [
								]
							},{
								"name": '买入',
								"value": "买入",
								"submenu": [
								]
							},{
								"name": '买出',
								"value": "买出",
								"submenu": [
								]
							},
						]
					},{
						"type": 'hierarchy',
						"submenu": [
							{
								"name": '全部',
								"value": "",
								"submenu": [
								]
							},{
								"name": '已撤单',
								"value": -1,
								"submenu": [
								]
							},{
								"name": '成交',
								"value": 3,
								"submenu": [
								]
							},
						]
					},
				],
				activeFilter: {
					index: [[0,0],0,0],
					value: [["全部", ""], "全部", ""]
				},
				status: "",
				beginDate: "",
				endDate: "",
			};
		},
		async onLoad() {
			// this.filterDataList = await filterData();
			let obj = {};
			let resData =  await marketCategoryList()
			// .then(res => {
				
			// });
			obj.type = "hierarchy";
			obj.submenu = [
				{
					"name": '全部',
					"value": "全部",
					"submenu": [
					]
				}
			];
			for (let i = 0; i < resData.data.length; i++) {
				obj.submenu[i+1] = {
						"name": resData.data[i].categoryName,
						"value": resData.data[i].categoryName,
						"submenu": [
						]
				}
				for (let j = 0; j < resData.data[i].marketCategoryList.length; j++) {
					obj.submenu[i+1].submenu[j] = {
						"name": resData.data[i].marketCategoryList[j].marketMame,
						"value": resData.data[i].marketCategoryList[j].marketId
					}
				}
			}
			this.filterList.unshift(obj);
			this.filterDataList = this.filterList;
			// console.log(this.filterDataList)
			let list = await findListByPage({
				status: "1"
			});
			this.list = list.data.list;
			console.log(list)
		},
    onReachBottom(){
        console.log(11)
    },
		methods: {
			//切换类型
			async clickTypeF(type){
			  if(this.typeF != type){
			    this.typeF = type;
				this.typeC = 0;
			    this.page = 1;
				this.tagType = type;
				this.filterDropdownValue = [[0,0],0,0];
				this.beginDate = "";
				this.endDate = "";
				if (type == 0) {
					let list = await findListByPage({
						status: "1"
					});
					this.list = list.data.list;
				} else if (type == 1) {
					let list = await findListByPage({
						// status: "-1,0,1,2,3"
					});
					this.list = list.data.list;
				} else {
					let list = await findTradeOrderListByPage({
						// status: "-1,0,1,2,3"
					});
					this.list = list.data.list;
				}
			  };
			  // if (type == 1) {
				 //  this.filterDataList = await filterData(1);
			  // }
			},
			//级联筛选
			async confirm(e) {
				console.log(e)
				this.activeFilter.value = e.value;
				this.activeFilter.index = e.index;
				console.log(this.activeFilter.value[0][1])
				console.log(this.activeFilter.index[1][0])
				console.log(this.activeFilter.value[2][0])
				console.log(this.activeFilter)
				this.status = this.activeFilter.value[2][0];
				if (this.typeF == 0) {
					this.status = 1
				}
				if (this.typeF == 0 || this.typeF == 1) {
					let list = await findListByPage({
						status: this.status,
						marketId: this.activeFilter.value[0][1],
						type: this.activeFilter.index[1][0],
						beginDate: this.beginDate,
						endDate: this.endDate,
					});
					this.list = list.data.list;
				} else {
					let list = await findTradeOrderListByPage({
						marketId: this.activeFilter.value[0][1],
						type: this.activeFilter.index[1][0],
						beginDate: this.beginDate,
						endDate: this.endDate,
					});
					this.list = list.data.list;
				}
			},
			onShowDatePicker(type){//显示
			    this.showPicker = true;
			    // this.value = this[type];
			},
			//日期
			async onSelected(e) {
				this.showPicker = false;
				if (e) {
					e.value.forEach((item, index) => {
						e.value[index] = item.replace(/\//g, '-');
					})
					this.beginDate = e.value[0];
					this.endDate = e.value[1];
					// this.status = this.activeFilter.value[2][0];
					if (this.typeF == 0) {
						this.status = 1
					} else {
						this.status = ""
					}
					console.log(this.status)
					if (this.typeF == 0 || this.typeF == 1) {
						let list = await findListByPage({
							status: this.status,
							beginDate: this.beginDate,
							endDate: this.endDate,
							marketId: this.activeFilter.value[0][1],
							type: this.activeFilter.index[1][0]
						});
						this.list = list.data.list;
					} else {
						let list = await findTradeOrderListByPage({
							marketId: this.activeFilter.value[0][1],
							type: this.activeFilter.index[1][0],
							beginDate: this.beginDate,
							endDate: this.endDate,
						});
						this.list = list.data.list;
					}
				} else {
					this.beginDate = "";
					this.endDate = "";
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	.tabF {
		display: flex;
		text-align: center;
		align-items: center;
		font-size: 28upx;
		justify-content: space-between;
		> view {
			width: 30%;
			padding: 20upx 0;
			text {
				display: block;
				width: 54upx;
				height: 4upx;
				background: #fff;
				margin: 10upx auto 0;
			}
		}
		.activeF {
			font-weight: 600;
			color: #5DC1CF;
			text {
				background: #5DC1CF;
			}
		}
	}
	.tabC {
		position: relative;
		border-bottom: 20upx solid #f5f5f5;
		.date {
			position: absolute;
			z-index: 998;
			right: 0;
			bottom: 0;
			padding: 30upx 30upx;
			image {
				width: 28upx;
				height: 24upx;
			}
		}
	}
	.list {
		.listItem {
			font-size: 24upx;
			.time, .tab, .number {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.tab, .number {
				text {
					width: 33%;
					text-align: center;
				}
				text:first-child {
					text-align: left;
				}
				text:last-child {
					text-align: right;
				}
			}
			.time {
				.ft6 {
					font-size: 28upx;
					text {
						padding: 0 10upx;
						color: #48BEA4;
						background: #D2FFF5;
						margin-right: 20upx;
						font-size: 24upx;
					}
				}
				view:last-child {
					color: #999;
				}
			}
			.tab {
				color: #999;
				margin: 30upx 0 20upx;
			}
			
		}
	}
	.HMfilterDropdown {
		position: static;
	}
</style>
