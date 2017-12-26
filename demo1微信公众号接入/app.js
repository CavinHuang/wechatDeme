const koa = require('koa');

const app = new koa()
const sha1 = require('sha1');
const getRawBody = require('raw-body')

const util = require('./uitl')

app.use(async ctx => {
  if(ctx.path == '/wechat-sign') {

    let {signature, timestamp, nonce, echostr} = ctx.query

    let str = [config.wechat.token, timestamp, nonce].sort().join('')

    let sha1Str = sha1(str)

    if(ctx.me thod === 'GET') {
      if(sha1Str === signature){
        ctx.body = echostr
      }else{
        ctx.body = 'fail'
      }
    }else if(ctx.method == 'POST') {

      // 微信公众号的消息
      let xmlData = await getRawBody(ctx.req)

      console.log(xmlData.toString());

      let content = util.parseXMLAsync(xmlData)

      console.log(content);
      let message = util.formatMessage(content.xml)

      console.log(message);
      let date = Date.now()
      if(message.MsgType === 'text') {
        if(message.Content == '11') {
          ctx.body = `<xml>
                        <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                        <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                        <CreateTime>${date}</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content><![CDATA[您发送的消息是${message.Content}]]></Content>
                      </xml>`
        }
      }else if{}

    }


  }
})

app.listen(3000)

console.log('3000 端口启动成功');
