const koa = require('koa2');
const app = new koa();
const config = {
  wechat: {
    appId: 'wx64b330b843c003fb',
    appSecret: '219f8133456b27d8019d1329435ec8c5',
    token: 'badf98ec17b4c11e86'
  }
}
const wechat = require('./wechat')
const site_url = 'http://ows7ph2.hk1.mofasuidao.cn'
console.log(wechat);
app.use(async (ctx) => {
  console.log('path', ctx.path);
  if(ctx.path == '/') {
    let url = wechat.redirectUrl(site_url + '/oauth_callback', 'snsapi_userinfo')
    ctx.redirect(url)
  }
  else if(ctx.path == '/oauth_callback') {
    let code = ctx.query.code
    let accessToken = await wechat.getAccessToken(code)
    console.log(accessToken);
    let userInfo = await wechat.getUserInfo(accessToken.access_token)
    console.log('userInfo', userInfo);
    ctx.body = userInfo
  }
  //ctx.body = 'hello word'
})
app.listen(3000)
console.log('3000 服务启动成功');
