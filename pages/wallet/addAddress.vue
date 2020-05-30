<template>
	<view class="content pd23">
		<view class="address">
			<view>
				<view class="ft6">选择提现种类</view>
				<!-- <view @click="showPicker">{{addressText}}</view> -->
			</view>
			<view class="flexv">
				<input class="bb" type="text" disabled v-model="bType" placeholder="选择种类"/>
				<view class="down" @click.stop="down"><text>请选择</text>
					<image src="../../static/images/down_1.png"></image>
					<view class="downItem" v-if="showChooseB">
						<view class="bb" @click.stop="choose(val.coinId, val.coinName)" v-for="(val,index) in list" :key="index">{{val.coinName}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="remark">
			<view>
				<view class="ft6">提现地址</view>
			</view>
			<input class="bb" type="text" v-model="address" placeholder="提现地址" />
		</view>
		<view class="getMoney">
			<view>
				<view class="ft6">备注</view>
			</view>
			<input class="bb" type="text" v-model="text" placeholder="备注信息" />
			<!-- <view class="all" @click="all">全部提现</view> -->
		</view>
		<view class="tips">
			<view>温馨提示： </view>
			<view>* 请不要在提现地址中输入特殊字符 </view>
			<view>* 请妥善备注好自己的提现地址备注便于提现识别 </view>
			<view>* 有要求填写地址标签的提现地址请务必填写标签以防转出丢失 </view>
			<view>* 请确保所填地址无误，如个人原因造成丢失平台将不承担损失</view>
		</view>
		<button :loading="loading" @click="submit">提交</button>
		<!-- <view>
		    <view class="example-title">向 content 里插入输入框</view>
		    <button type="default" @click="bindClick('4')">打开模态弹窗</button> -->
		    <neil-modal :show="showModel" @close="closeModal" title="请输入验证码" @confirm="bindBtn('confirm')">
		        <view class="input-view">
		            <view class="input-name pd23">
		                <view>验证码{{phone}}</view>
		                <input type="text" v-model="code" placeholder="请输入验证码" />
		            </view>
		        </view>
		    </neil-modal>
		<!-- </view> -->
		<!-- <w-picker
		    mode="region"
		    :level="3"
		    @confirm="onConfirm"
		    ref="picker"
		    themeColor="#5DC1CF"
		></w-picker> -->
		<!-- <chunLei-popups v-model="valuePupup" :popData="data" @tapPopup="tapPopup" :x="344" :y="20" placement="top-end">
		        </chunLei-popups> -->
	</view>
</template>

<script>
	// import wPicker from "@/components/w-picker/w-picker.vue";
	import {userCoinList, coinAddressAdd} from '@/api/wallet_api.js';
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import {sendSms} from '@/api/center_api.js';
	// import chunLeiPopups from "@/components/chunLei-popups/chunLei-popups.vue";
	export default {
		components: {
		  // wPicker,
		  // chunLeiPopups
		  neilModal
		},
		data() {
			return {
				bType: "",
				// valuePupup: false,
				address: "",
				text: "",
				loading: false,
				showChooseB: false,
				list: [],
				id: "",
				showModel: false,
				code: "",
				phone: ""
				// data:[{title:'复制',disabled:true},{title:'转发'},{title:'回复'},{title:'删除'}]
			};
		},
		async onLoad() {
			let list = await userCoinList();
			console.log(list)
			this.list = list.data;
			this.phone = uni.getStorageSync("userinfo").phone;
		},
		methods: {
			//地区联动回调
			// onConfirm(res) {
			// 	this.addressText = "";
			// 	for(var i = 0; i < res.checkArr.length; i++) {
			// 		this.addressText += res.checkArr[i] + "/"
			// 	}
				
			// 	this.addressText = this.addressText.replace(/(.*)\//, '$1')
			// 	console.log(res)
			// },
			//显示地区联动
			// showPicker() {
			// 	this.$refs.picker.show();
			// },
			//全部提现
			// all() {
			// 	console.log("all")
			// },
			closeModal(){
				this.showModel = false;
			},
			async bindBtn() {
				if (this.code == "") {
					uni.showToast({
						title: "请填写相关信息",
						icon: "none"
					})
					return
				}
				await coinAddressAdd({
					coinId: this.id,
					address: this.address,
					remark: this.text || "",
					smsCode: this.code
				}).then(res=> {
					uni.showToast({
						title: res.msg,
						icon: "none"
					})
					if(res.code == 1) {
						setTimeout( ()=> {
							uni.navigateBack({
								delta:1
							})
						},1500)
					}
				})
			},	
			//选择币种
			down() {
				this.showChooseB = !this.showChooseB;
			},
			choose(id,name) {
				this.showChooseB = !this.showChooseB;
				this.id = id;
				this.bType = name;
			},
			async submit() {
				if (this.bType == "" || this.id == "" || this.address == "") {
					uni.showToast({
						title: "请填写相关信息",
						icon: "none"
					})
					return
				}
				let res = await sendSms({
					phone: uni.getStorageSync("userinfo").phone,
					type: 7
				})
				if(res.code == 1) {
					this.showModel = true;
				}
			}
			
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	.flexv {
		display: flex;
		align-items: center;
	}
	.address, .remark, .getMoney {
		position: relative;
		> view:first-child {
			display: flex;
			justify-content: space-between;
			align-items: center;
			// view:last-child {
			// 	font-size: 24upx;
			// 	padding: 20upx 0;
			// }
			view:first-child {
				font-size: 28upx;
				padding: 20upx 0;
			}
		}
		.down {
			position: relative;
			// right: 0;
			// bottom: -20upx;
			width: 30%;
			input {
				flex: 1;
			}
			height: 90upx;
			padding: 20upx 0 20upx 60upx;
			font-size: 24upx;
			image {
				width: 14upx;
				height: 8upx;
				margin-left: 8upx;
				vertical-align: middle;
			}
			// > view {
			// 	position: absolute;
			// 	top: 20upx;
			// 	right: 0;
			// 	transform: translate(20upx, 20upx);
			// }
		}
		.downItem {
			z-index: 10;
			padding: 0 30upx;
			background: #f5f5f5;
			position: absolute;
			transform: translateY(100%);
			right: 0;
			bottom: 0;
			view {
				border-bottom: 1px solid #fff;
				padding: 10upx 20upx;
				border-radius: 8upx;
				font-size: 28upx;
			}
		}
	}
	
	.all {
		font-size: 28upx;
		color: #5DC1CF;
		position: absolute;
		right: 0;
		bottom: 0;
		padding: 20upx 0 20upx 20upx;
	}
	input {
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
		color: #fff;
		background: #5DC1CF;
		border-radius: 0;
		height: 80upx;
		font-size: 28upx;
		position: fixed;
		bottom: 40upx;
		width: 690upx;
		box-sizing: border-box;
		line-height: 80upx;
	}
</style>
