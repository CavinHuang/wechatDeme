const koa = require('koa');

const app = new koa()
const sha1 = require('sha1');
const getRawBody = require('raw-body')

const util = require('./uitl')

const config = {
  wechat: {
    appId: 'wx64b330b843c003fb',
    appSecret: '219f8133456b27d8019d1329435ec8c5',
    token: 'badf98ec17b4c11e86'
  }
}


app.use(async ctx => {
  if(ctx.path == '/wechat-sign') {

    let {signature, timestamp, nonce, echostr} = ctx.query

    let str = [config.wechat.token, timestamp, nonce].sort().join('')

    let sha1Str = sha1(str)

    if(ctx.method === 'GET') {
      if(sha1Str === signature){
        ctx.body = echostr
      }else{
        ctx.body = 'fail'
      }
    }else if(ctx.method == 'POST') {

      // 微信公众号的消息
      let xmlData = await getRawBody(ctx.req, {
          length: this.length,
          limit: '1mb',
          encoding: this.charset
      })

      console.log(xmlData.toString());

      let content = await util.parseXMLAsync(xmlData)

      console.log(content);
      let message = util.formatMessage(content.xml)

      console.log(message);
      let date = Date.now()
      if(message.MsgType === 'text') {
        ctx.body = `<xml>
                      <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                      <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                      <CreateTime>${date}</CreateTime>
                      <MsgType><![CDATA[text]]></MsgType>
                      <Content><![CDATA[您发送的消息是${message.Content}]]></Content>
                    </xml>`
      }else if(message.MsgType == 'image') {
        ctx.status = 200
        ctx.type = 'application/xml'
        ctx.body = `<xml>
                    <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                    <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                    <CreateTime>${date}</CreateTime>
                    <MsgType><![CDATA[image]]></MsgType>
                    <Image>
                    <MediaId><![CDATA[${message.MediaId}]]></MediaId>
                    </Image>
                    </xml>`
      }

    }


  }
})

app.listen(3000)

console.log('3000 端口启动成功');
