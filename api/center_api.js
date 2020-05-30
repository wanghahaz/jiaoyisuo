import request from '../common/request'

// 个人中心
const userCenter = function() {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/userCenter'
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
const myInvate = function() {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/myInvate'
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//国家列表
const countryCode = function() {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/countryCode/list'
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//身份验证
const identityAuthen = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/identityAuthen',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//修改密码
const changePwd = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/updateLoginPassword',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//交易对查询
const marketCategoryList = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/market/marketCategoryList',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//委托查询
const findListByPage = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/ordersRecord/findListByPage',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//委托记录
const findTradeOrderListByPage = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/ordersRecord/findTradeOrderListByPage',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//交易密码设置
const setTransactionPassword = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/setTransactionPassword',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//交易密码修改
const updateTransactionPassword = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/updateTransactionPassword',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//手机号修改
const updatePhone = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/updatePhone',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 发送手机验证码
const sendSms = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/sms/sendSms',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 判断手机是否被注册
const checkPhone = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/checkPhone/' + data.phone,
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 获取谷歌验证
const getGoogleQRBarcodeUrl = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/getGoogleQRBarcodeUrl',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 绑定或修改谷歌验证
const bindGoogleCode = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/bindGoogleCode',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 切换认证
const switchCheck = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/switchCheck',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 切换交易密码
const openOrCloseTradePassword = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/openOrCloseTradePassword',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 绑定手机
const bindPhone = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/bindPhone',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 校验短信验证码
const checkSms = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/sms/checkSms',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
export {userCenter, myInvate, countryCode, identityAuthen, changePwd, marketCategoryList, findListByPage, findTradeOrderListByPage, setTransactionPassword, updateTransactionPassword, updatePhone, sendSms, checkPhone, getGoogleQRBarcodeUrl, bindGoogleCode, switchCheck, openOrCloseTradePassword, bindPhone, checkSms}