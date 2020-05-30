<template>
	<view class="content">
		<view class="upPic ft6">
			<view>本人双手手持身份证正面照片</view>
			<image :src="cardImg1" @click="upImg(1)"></image>
			<view>本人双手手持身份证反面照片</view>
			<image :src="cardImg2" @click="upImg(2)"></image>
		</view>
		<view class="tipPic pd23">
			<view>示意图</view>
			<image src="../../static/images/user_10.png"></image>
			<image src="../../static/images/user_11.png"></image>
			<view class="tips">
				<view>温馨提示： </view>
				<view>照片要求：jpg/png格式，大小不超过2M，信息清晰: </view>
				<view>1.请上传您本人【双手手持】身份证正面的照片+Super Culture UID+【手写当天认证日期】，请参考示例图。 </view>
				<view>2.请上传您本人【双手手持】身份证反面的照片务必保证证件上所有信息清晰可见，不允许任何修改或遮挡，否则影响您的身份认证。 </view>
				<view>3.申请失败，则请您根据提示信息重新提交申请。</view>
				<view>4.证件需在有效期内。</view>
			</view>
		</view>
		<view class="btn" @click="clickUpData">确认提交</view>
	</view>
</template>

<script>
	import {identityAuthen} from '@/api/center_api.js';
	export default {
		data() {
			return {
				cardImg1:"../../static/images/user_12.png",//身份证正面
				cardImg2:"../../static/images/user_12.png",//身份证反面
			};
		},
		methods: {
			//上传图片
			upImg(type){
				let userinfo = uni.getStorageSync('userinfo')
				uni.chooseImage({
					count:1,
					success:(file)=>{
					  uni.uploadFile({
						url: this.baseURL+"/fileUpload/uploadPic", 
						filePath: file.tempFilePaths[0],
						header: {
							lang: 'cn',
							userId: userinfo ? userinfo.userId : '',
							accessToken: userinfo ? userinfo.accessToken : ''
						},
						name: 'cardImg',
						formData: {
							name: "image",
							fileName: "cardImg"
						},
						success: (res) => {
							console.log(res)
							res.data = JSON.parse(res.data);
							if (res.data.code == 1) {
								if(type==1){
									this.cardImg1 = res.data.data[0];
								}else if(type==2){
									this.cardImg2 = res.data.data[0];
								};
								console.log(this.cardImg1)
							} else{
								uni.showToast({
								  title:res.data.message,
								  icon:"none"
								})
							};
						}
			      });
			    }
			  })
			},
			//提交验证信息
			async clickUpData(){
				if(this.cardImg1 == "../../static/images/user_12.png" || this.cardImg2 == "../../static/images/user_12.png"){
					uni.showToast({
						title:"请上传图片",
						icon:"none"
					})
					return
				}
				this.upInfoData.idImageA = this.cardImg1;
				this.upInfoData.idImageB = this.cardImg2;
				uni.showLoading({
					title:"加载中..."
				})
				await identityAuthen(this.upInfoData).then(res => {
					console.log(res)
					if (res.code == 1) {
						uni.showToast({
							title: "上传成功",
							icon: "none"
						})
						setTimeout(() => {
							uni.switchTab({
							    url: '/pages/user/index'
							});
						}, 1500)
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
		padding-bottom: 40upx;
	}
	.upPic {
		font-size: 28upx;
		border-bottom: 20upx solid #F5F5F5;
		text-align: center;
		padding-bottom: 40upx;
		view {
			margin-top: 40upx;
		}
		image {
			width: 690upx;
			height: 340upx;
			margin-top: 20upx;
		}
	}
	.tipPic {
		> view:first-child {
			font-size: 28upx;
		}
		image {
			width: 690upx;
			height: 428upx;
			margin-top: 20upx;
		}
		.tips {
			border-radius: 8upx;
			background: #f5f5f5;
			padding: 20upx 40upx;
			font-size: 20upx;
			line-height: 34upx;
			margin-top: 80upx;
		}
	}
	.btn {
		color: #fff;
		background: #5DC1CF;
		// border: 1px solid #5DC1CF;
		outline: none;
		border-radius: 0;
		height: 80upx;
		font-size: 28upx;
		// position: fixed;
		// bottom: 40upx;
		width: 690upx;
		box-sizing: border-box;
		line-height: 80upx;
		text-align: center;
		margin: 60upx auto 0;
		// left: 30upx;
	}
</style>
