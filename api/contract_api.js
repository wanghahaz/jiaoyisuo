
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

// 合约列表
export function contract_list(data){
  return new Promise((resolve, reject) => {
  	request.post({
  		url: '/optionContract/list',
      data
  	}).then(res => {
  		resolve(res)
  	}).catch(err => {
      console.log(err)
  		reject(err)
  	})
  })
}
// 下单  POST
export function addOrder(data){
  return new Promise((resolve, reject) => {
  	request.post({
  		url: '/optionContract/orders/add',
      data
  	}).then(res => {
  		resolve(res)
  	}).catch(err => {
      console.log(err)
  		reject(err)
  	})
  })
}
// 撤单 GET
export function cancelOrder(id){
  return new Promise((resolve, reject) => {
  	request.get({
  		url: `/optionContract/cancel/${id}`,
  	}).then(res => {
  		resolve(res)
  	}).catch(err => {
      console.log(err)
  		reject(err)
  	})
  })
}
// 获取用户资金余额
export function getPower(){
  return new Promise((resolve, reject) => {
  	request.get({
  		url: `/optionContract/account`,
  	}).then(res => {
  		resolve(res)
  	}).catch(err => {
      console.log(err)
  		reject(err)
  	})
  })
}
// 币币账户到合约账户资金转移 POST
export function moenyMove(data){
  return new Promise((resolve, reject) => {
  	request.post({
  		url: `/optionContract/coinAccountToContractAccount`,
      data
  	}).then(res => {
  		resolve(res)
  	}).catch(err => {
      console.log(err)
  		reject(err)
  	})
  })
}
// 8.获取用户当前委托
export function getPrincipalList(id){
  return new Promise((resolve, reject) => {
  	request.get({
  		url: `/optionContract/orders/list/${id}`,
  	}).then(res => {
  		resolve(res)
  	}).catch(err => {
      console.log(err)
  		reject(err)
  	})
  })
}
// 委托列表
export function entrustList(data){
  return new Promise((resolve, reject) => {
  	request.post({
  		url: `/user/contracttradequery`,
      data
  	}).then(res => {
  		resolve(res)
  	}).catch(err => {
      console.log(err)
  		reject(err)
  	})
  })
}

// 持仓列表
export function getQuery(data){
  return new Promise((resolve, reject) => {
  	request.post({
  		url: `/user/getQueryAccount`,
      data
  	}).then(res => {
  		resolve(res)
  	}).catch(err => {
      console.log(err)
  		reject(err)
  	})
  })
}
// 获取指数
export function getIndex(){
  return new Promise((resolve, reject) => {
  	request.get({
  		url: `/optionContract/index `,
  	}).then(res => {
  		resolve(res)
  	}).catch(err => {
      console.log(err)
  		reject(err)
  	})
  })
}