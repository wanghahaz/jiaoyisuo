<template>
	<view class="content pd23">
		<view class="address">
			<view>
				<view class="ft6">选择国家</view>
				<!-- <view @click="showPicker">{{addressText}}</view> -->
			</view>
			<picker class="bb" @change="bindPickerChange" :value="index" :range="array">
			    <view class="uni-input">{{array[index]}}</view>
				<view class="down">请选择
					<image src="../../static/images/down_1.png"></image>
				</view>
			</picker>	
			<!-- <input class="bb" type="text" disabled v-model="country" value="country" placeholder="选择国家"/> -->
		</view>
		<view class="remark">
			<view>
				<view class="ft6">姓名</view>
			</view>
			<input class="bb" type="text" v-model="name" value="" placeholder="请填写" />
		</view>
		<view class="getMoney">
			<view>
				<view class="ft6">证件类型</view>
			</view>
			<!-- <input class="bb" type="digit" v-model="number" value="" placeholder="备注信息" /> -->
			<!-- <view class="all" @click="all">全部提现</view> -->
			<picker class="bb" :value="index" :range="array1">
			    <view class="uni-input">{{array1[index1]}}</view>
				<view class="down">请选择
					<image src="../../static/images/down_1.png"></image>
				</view>
			</picker>	
		</view>
		<view class="remark">
			<view>
				<view class="ft6">证件号码</view>
			</view>
			<input class="bb" type="text" v-model="number" value="" placeholder="请填写" />
		</view>
		<button :loading="loading" @click="jumpUpPic" hover-class="none">下一步</button>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	// import chunLeiPopups from "@/components/chunLei-popups/chunLei-popups.vue";
	import {countryCode} from '@/api/center_api.js';
	export default {
		components: {
		  wPicker,
		  // chunLeiPopups
		},
		data() {
			return {
				country: "中国",
				// valuePupup: false,
				name: "",
				number: "",
				loading: false,
				showChooseB: false,
				index: 0,
				index1: 0,
				array: [],
				cityData: {},
				array1: ['身份证'],
				// data:[{title:'复制',disabled:true},{title:'转发'},{title:'回复'},{title:'删除'}]
			};
		},
		async onLoad() {
			let cityData = await countryCode();
			
			this.cityData = cityData.data;
			console.log(this.cityData)
			this.cityData.forEach((item, index) => {
				this.array.push(item.cnName)
			})
		},
		methods: {
			//地区联动回调
			onConfirm(res) {
				this.addressText = "";
				for(var i = 0; i < res.checkArr.length; i++) {
					this.addressText += res.checkArr[i] + "/"
				}
				
				this.addressText = this.addressText.replace(/(.*)\//, '$1')
				console.log(res)
			},
			//显示地区联动
			showPicker() {
				this.$refs.picker.show();
			},
			//全部提现
			all() {
				console.log("all")
			},
			//选择币种
			downC() {
				this.showChooseB = !this.showChooseB;
			},
			//选择国家
			bindPickerChange: function(e) {
			    console.log('picker发送选择改变，携带值为', e.target.value)
			    this.index = e.target.value;
				this.country = this.array[e.target.value];
			},
			jumpUpPic() {
				if (this.name == "" || this.number == "") {
					uni.showToast({
						title: '请填写相关信息',
						icon: 'none'
					})
					return
				}
				this.upInfoData.idName = this.name;
				this.upInfoData.cardType = 1;
				this.upInfoData.cardNo = this.number;
				this.upInfoData.country = this.country;
				console.log(this.upInfoData)
				uni.navigateTo({
					url: "./upPic"
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	.address, .remark, .getMoney {
		position: relative;
		> view {
			display: flex;
			justify-content: space-between;
			align-items: center;
			view:last-child {
				font-size: 24upx;
				padding: 20upx 0;
			}
			view:first-child {
				font-size: 28upx;
				padding: 20upx 0;
			}
		}
		.down {
			position: absolute;
			right: 0;
			bottom: 0;
			padding: 20upx 0 20upx 20upx;
			font-size: 24upx;
			image {
				width: 14upx;
				height: 8upx;
				margin-left: 8upx;
				vertical-align: middle;
			}
			> view {
				position: absolute;
				top: 0;
				left: 0;
				transform: translate(20upx, 20upx);
			}
			.downItem {
				// padding: 0;
				view {
					background: red;
					padding: 0;
				}
			}
		}
	}
	// picker {
	// 	font-size: 28upx;
	// }
	.all {
		font-size: 28upx;
		color: #5DC1CF;
		position: absolute;
		right: 0;
		bottom: 0;
		padding: 20upx 0 20upx 20upx;
	}
	input, picker {
		width: 100%;
		padding: 20upx 0;
		font-size: 28upx;
		box-sizing: border-box;
		height: 68upx;
		margin-bottom: 20upx;
	}
	.tips {
		border-radius: 8upx;
		background: #F5F5F5;
		padding: 20upx 40upx;
		font-size: 20upx;
		line-height: 30upx;
		margin-top: 80upx;
	}
	button {
		color: #534DFF;
		background: #fff;
		border: 1px solid #534DFF;
		outline: none;
		border-radius: 0;
		height: 80upx;
		font-size: 28upx;
		position: fixed;
		bottom: 40upx;
		width: 690upx;
		box-sizing: border-box;
		line-height: 80upx;
	}
	button:after {
		border: none;
	}
</style>
