import request from '../common/request';


//  发布委托 
export function otcorder(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: '/otc/otcorder',
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 自选区列表
export function otcList(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: '/otc/otcorderquery',
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
/*-------------- 快捷区下单 */
// 下单
export function addOrder(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: '/otc/add/faster',
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 获取参考价格
export function referencePrice(type, qty) {
  return new Promise((resolve, reject) => {
    request.get({
      url: `/otc/referencePrice/${type}/${qty}`
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
/* ------------------自选区 下单*/
export function selfOrder(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: `/otc/buyorder`,
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
/*订单列表--------------------------------------*/
// 订单列表
export function orderList(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: `/otc/queryselforder`,
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 修改订单状态
export function editOrder(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: `/otc/changestatus`,
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 查询订单详情
export function getOrder(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: `/otc/getorderinfo`,
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 取消订单
export function cancelOrder() {
  return new Promise((resolve, reject) => {
    request.get({
      url: `/otc/cancel/${id}`
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 支付宝列表 
export function aliList() {
  return new Promise((resolve, reject) => {
    request.get({
      url: `/aliAddress/list`
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}




// 银行卡列表
export function bankList() {
  return new Promise((resolve, reject) => {
    request.post({
      url: `/coinAddress/list`,
      data: {}
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
