const config = require('./config')
const request = require('request-promise')
/**
 * 返回拉取code链接
 * @param  {[type]} url                    [授权地址]
 * @param  {String} [$scope='snsapi_base'] [snsapi_base静默授权， snsapi_userinfo手动授权]
 * @param  {String} [$state='']            [多余参数]
 * @return {[type]}                        [description]
 */
exports.redirectUrl = (url, scope = 'snsapi_base', state = '') => {
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.wechat.appId}&redirect_uri=${encodeURIComponent(url)}&response_type=code&scope=${scope}&state=${state}\#wechat_redirect`
}
/**
 * 获取信息的基础方法
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
const requestHandle = async (options) => {
  options = Object.assign({}, options, {
    json: true
  })
  try {
    const response = await request(options)
    return response
  }
  catch(error) {
    console.error(error)
  }
}
/**
 * 获取网页授权access_token
 * @param  {[type]} code [description]
 * @return {[type]}      [description]
 */
exports.getAccessToken = async (code) => {
  const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.wechat.appId}&secret=${config.wechat.appSecret}&code=${code}&grant_type=authorization_code`
  const data = await requestHandle({
    url: url
  })
  return data
}
/**
 * 获取用户信息
 * @param  {[type]}  accessToken [description]
 * @return {Promise}             [description]
 */
exports.getUserInfo = async (accessToken) => {
  let url = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${config.wechat.appId}&lang=zh_CN`
  const data = await requestHandle({
    url: url
  })
  return data
}
