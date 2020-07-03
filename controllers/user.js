let {responseObj} =require("../utils/common")
let {db}=require("../middlewares/databases")

var user_getUserinfo = async (ctx, next) => {
  return new Promise((res,rej)=>{//提交用户信息  
    db.query('select * from userinfo where uid =?',[1],function(err,data){
      if(err){
        rej(err)
      }else{
        ctx.response.body={...responseObj,data:data[0]}
        res()
      }
    })
  })
};

var user_submitUserinfo = async (ctx, next) => {
  let {name,slogan,tags,imgurl,github,weibo,wechat,qq}=ctx.request.body;
  return new Promise((res,rej)=>{//提交用户信息  
    db.query('update userinfo set name=?,slogan=?,tags=?,imgurl=?,github=?,weibo=?,wechat=?,qq=?  where uid =?',[name,slogan,tags,imgurl,github,weibo,wechat,qq,1],function(err,data){
      if(err){
        rej(err)
      }else{
        ctx.response.body={...responseObj}
        res()
      }
    })
  })
};


module.exports = {
  "GET /user/getUserinfo":user_getUserinfo,//获取用户信息
  "POST /user/submitUserinfo":user_submitUserinfo,//提交用户信息
  
};