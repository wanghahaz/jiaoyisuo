import request from '../common/request'

// 获取手机区号列表
const getCountryCode = function() {
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
// 校验登录密码
const checkLoginPassword = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/checkLoginPassword',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 登录
const login = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/login',
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
		request.get({
			url: '/user/checkPhone/' + data.phone
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
// 校验手机验证码
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
// 判断邮箱是否被注册
const checkEmail = function(data, header) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/checkEmail',
			data,
			header
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 发送邮箱验证码
const sendEmailCode = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/email/sendEmailCode',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 重置手机登录密码
const forgetPasswordPhone = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/forgetPasswordPhone',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 重置邮箱登录密码
const forgetPasswordEmail = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/forgetPasswordEmail',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 手机注册
const phoneRegister = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/phoneRegister',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 邮箱注册
const emailRegister = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/emailRegister',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 退出登录
const logout = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/logout',
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 我的申请
const myApplication = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/bonusquery',
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

export {getCountryCode, checkLoginPassword, login, checkPhone, sendSms, checkSms, checkEmail, sendEmailCode, forgetPasswordPhone, forgetPasswordEmail, phoneRegister, emailRegister, logout, myApplication}