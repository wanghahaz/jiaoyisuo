let list = ['ETH-USDT', 'BTC-USDT', 'ETC-USDT'];
const Ajax0 = function() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://www.okex.me/api/spot/v3/instruments/ETH-USDT/ticker',
      method: 'get',
      success: res => {
        resolve(res.data)
      }
    });
  })
}
const Ajax1 = function() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://www.okex.me/api/spot/v3/instruments/BTC-USDT/ticker',
      method: 'get',
      success: res => {
        resolve(res.data)
      }
    });
  })
}

const Ajax2 = function() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://www.okex.me/api/spot/v3/instruments/ETC-USDT/ticker',
      method: 'get',
      success: res => {
        resolve(res.data)
      }
    });
  })
}
const Ajax3 = function() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://www.okex.me/api/spot/v3/instruments/LTC-USDT/ticker',
      method: 'get',
      success: res => {
        resolve(res.data)
      }
    });
  })
}
const Ajax4 = function() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://www.okex.me/api/spot/v3/instruments/GAS-USDT/ticker',
      method: 'get',
      success: res => {
        resolve(res.data)
      }
    });
  })
}
const Ajax5 = function() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://www.okex.me/api/spot/v3/instruments/EOS-USDT/ticker',
      method: 'get',
      success: res => {
        resolve(res.data)
      }
    });
  })
}

const Ajax6 = function() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://www.okex.me/api/spot/v3/instruments/NULS-USDT/ticker',
      method: 'get',
      success: res => {
        resolve(res.data)
      }
    });
  })
}
const Ajax7 = function() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://www.okex.me/api/spot/v3/instruments/NAS-USDT/ticker',
      method: 'get',
      success: res => {
        resolve(res.data)
      }
    });
  })
}
const Ajax8 = function() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://www.okex.me/api/spot/v3/instruments/ATOM-USDT/ticker',
      method: 'get',
      success: res => {
        resolve(res.data)
      }
    });
  })
}
const Ajax9 = function() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://www.okex.me/api/spot/v3/instruments/SC-USDT/ticker',
      method: 'get',
      success: res => {
        resolve(res.data)
      }
    });
  })
}
const Ajax10 = function() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://www.okex.me/api/spot/v3/instruments/GTO-USDT/ticker',
      method: 'get',
      success: res => {
        resolve(res.data)
      }
    });
  })
}
const Ajax11 = function() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://www.okex.me/api/spot/v3/instruments/LEO-USDT/ticker',
      method: 'get',
      success: res => {
        resolve(res.data)
      }
    });
  })
}
export {
  Ajax0,
  Ajax1,
  Ajax2,
  Ajax3,
  Ajax4,
  Ajax5,
  Ajax6,
  Ajax7,
  Ajax8,
  Ajax9,
  Ajax10,
  Ajax11
}
// Promise.all([Ajax0, Ajax1, Ajax2]).then((res) => {
//   //所有请求都成功后执行函数
// }).catch(() => {
//   //// 异常处理
// })
// }
