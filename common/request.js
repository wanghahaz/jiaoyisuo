/**
 * 所有请求的拦截器
 * */

import $request from './$request'
        // 
const request = {
	get(reqData) {
		return new Promise((resolve, reject) => {
			$request({
				url: reqData.url,
				data: reqData.data,
				method: 'GET',
				header: reqData.header
			}).then(res => {
				resolve(res.data)
			}).catch(err => {
				uni.showToast({
				  title: err.data,
				  icon: 'none'
				})
				reject(err)
			})
		})
	},
	post(reqData) {
		return new Promise((resolve, reject) => {
			$request({
				url: reqData.url,
				data: reqData.data,
				method: 'POST',
        sslVerify: false,
				header: reqData.header
			}).then(res => {
				resolve(res.data)
			}).catch(err => {
				uni.showToast({
				  title: err.data.message||'网络出错',
				  icon: 'none'
				})
				reject(err)
			})
		})
	}
}

export default request