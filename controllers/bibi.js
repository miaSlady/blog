let {responseObj} =require("../utils/common")
let {db}=require("../middlewares/databases")

var bibi_getBibi = async (ctx, next) => {
  let {current,size,type} = ctx.query;//type 1后台使用  2前端展示可以显示部分
  let num1=(current-1)*size,num2=size;
  return new Promise((res,rej)=>{//提交用户信息  
    if(type==1){//后台获取
      db.query(`select * from bibilist order by createTime desc limit ${num1},${num2}`,function(err,data){
        if(err){
          rej(err)
        }else{
          res(data)
        }
      })
    }else{//前端获取
      db.query(`select * from bibilist where isShow=1 order by createTime desc `,function(err,data){
        if(err){
          rej(err)
        }else{
          res(data)
        }
      })
    }
  }).then(list=>{
    return new Promise((res,rej)=>{
      db.query(`select count(bid) from bibilist;`,function(err,data){
        if(err){
          rej(err)
        }else{
          ctx.response.body={...responseObj,data:{list,total:data[0]['count(bid)']}}
          res()
        }
      })
    })
  })
}

var bibi_AddBibi = async (ctx, next) => {
  let {name,link,imgurl,isShow} =ctx.request.body;
  let createTime=new Date();
  return new Promise((res,rej)=>{//提交用户信息  
    db.query(`INSERT INTO bibilist SET ?`,{name,link,imgurl,isShow,createTime},function(err,data){
      if(err){
        rej(err)
      }else{
        ctx.response.body={...responseObj}
        res()
      }
    })
  })
}
var bibi_updateBibi = async (ctx, next) => {
  let {bid,name,link,imgurl,isShow} =ctx.request.body;
  return new Promise((res,rej)=>{//提交用户信息  
    db.query(`update bibilist SET ? where bid = ?`,[{name,link,imgurl,isShow},bid],function(err,data){
      if(err){
        rej(err)
      }else{
        ctx.response.body={...responseObj}
        res()
      }
    })
  })
}
var bibi_deleteBibi = async (ctx, next) => {
  let {bids} =ctx.request.body;
  return new Promise((res,rej)=>{//提交用户信息  
    db.query(`delete from bibilist where bid in (${bids})`,function(err,data){
      if(err){
        rej(err)
      }else{
        ctx.response.body={...responseObj}
        res()
      }
    })
  })
}
var bibi_isShowBibi = async (ctx, next) => {
  let {bid,isShow} =ctx.request.body;
  return new Promise((res,rej)=>{//提交用户信息  
    db.query(`update bibilist SET ? where bid = ?`,[{isShow},bid],function(err,data){
      if(err){
        rej(err)
      }else{
        ctx.response.body={...responseObj}
        res()
      }
    })
  })
}
module.exports = {
  "GET /bibi/getBibi":bibi_getBibi,//获取逼逼叨列表
  "POST /bibi/AddBibi":bibi_AddBibi,//新增逼逼叨
  "PUT /bibi/updateBibi":bibi_updateBibi,//修改逼逼叨
  "POST /bibi/deleteBibi":bibi_deleteBibi,//删除逼逼叨
  "POST /bibi/isShowBibi":bibi_isShowBibi,//是否显示逼逼叨
  
};