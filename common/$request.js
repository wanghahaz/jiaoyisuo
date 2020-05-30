import Vue from 'vue'

const $request = function(reqData) {
	if (!reqData.header) reqData.header = {}
	return new Promise((resolve, reject) => {
		let userinfo = uni.getStorageSync('userinfo')
		uni.request({
			url: Vue.prototype.baseURL + reqData.url,
			data: reqData.data,
			method: reqData.method,
			timeout: 30000,
			header: Object.assign({
				lang: 'cn',
				userId: userinfo ? userinfo.userId : '',
				accessToken: userinfo ? userinfo.accessToken : ''
			}, reqData.header),
			success(data) {
				if(data.statusCode === 200) {
					if(data.data.code == -1) {
						uni.reLaunch({
						    url: '../login_register/login'
						});
					}
					resolve(data)
				} else {
          console.log(data)
					reject(data)
				}
			}
		})
	})
}

export default $request