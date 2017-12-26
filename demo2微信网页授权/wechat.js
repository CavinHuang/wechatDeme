const config = require('./config')

/**
 * 返回拉取code链接
 * @param  {[type]} url                    [授权地址]
 * @param  {String} [$scope='snsapi_base'] [snsapi_base静默授权， snsapi_userinfo手动授权]
 * @param  {String} [$state='']            [多余参数]
 * @return {[type]}                        [description]
 */
exports.redirectUrl = (url, $scope = 'snsapi_base', $state = '') => {
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.wechat.appId}&redirect_uri=${url}&response_type=code&scope=${scope}&state=${state}\#wechat_redirect`
}
