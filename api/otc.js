import request from '../common/request';


// 合约时间列表 
export function contractTime(){
  return new Promise((resolve, reject) => {
  	request.get({
  		url: '/optionContract/list/contractTime',
  	}).then(res => {
  		resolve(res)
  	}).catch(err => {
  		reject(err)
  	})
  })
}
