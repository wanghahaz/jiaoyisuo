import request from '../common/request'

// 检测更新
const checkUpdata = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/app/checkVersion',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

export {checkUpdata}