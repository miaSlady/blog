const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body')
const static = require('koa-static');//配置静态资源

app.use(koaBody({
  multipart: true
}));//该post请求中间件需在router之前注册到app.js里头,支持图片上传

app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  await next();
});

//跨域
const cors = require('./middlewares/koa-cors'); //跨域处理文件koa-cors.js
app.use(cors);

const {connectDb}=require('./middlewares/databases')
connectDb();

// 导入controller middleware:
const controller = require('./controller');//对路由分模块处理
controller(app);

//设置静态资源路径
app.use(static(
  path.join(__dirname, 'public'),{    //静态文件所在目录
      maxage: 30*24*60*60*1000        //指定静态资源在浏览器中的缓存时间
  }
));


app.listen(3000);

