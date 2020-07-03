const fs = require('fs');
const path = require('path');
const stringRandom = require('string-random');
let {responseObj,errorResObj} =require("../utils/common");
let {db}=require("../middlewares/databases");

var upload_img = async (ctx, next) => {
  // 上传单个文件
  console.log(ctx.request.files.uploadImg, '==========================')
  const file = ctx.request.files.uploadImg // 获取上传文件
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  // let ip='http://localhost:80/public',path=`/upload/${file.name}`;
  // let filePath =ip+path;
  let name=stringRandom(16, { numbers: true })+'.png';
  let filePath = path.join(__dirname, '../public/upload/') + name;
  // let filePath = `${__dirname}/public/upload/${file.name}`
  // console.log(22,filePath);
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  return ctx.body = {
    code:200, 
    data:{
      path:`/upload/${name}`,
      name:file.name
    },
    message:"上传成功！"
  } ;
};

// app.post('/upload', function(req, res){
//   //接收前台POST过来的base64
//   var imgData = req.body.imgData;
//   //过滤data:URL
//   var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
//   var dataBuffer = new Buffer(base64Data, 'base64');
//   let name=uuidv4()+'.png';
//   fs.writeFile("../public/upload/"+name, dataBuffer, function(err) {
//   if(err){
//     res.send(err);
//   }else{
//     ctx.body = {
//       code:200, 
//       data:{
//         path:`/upload/${file.name}`,
//         name:file.name
//       },
//       message:"上传成功！"
//     } ;
//   }
//   });
//   });

var upload_baseImg = async (ctx, next) => {
  let  {imgData,imgName}=ctx.request.body;
  //过滤data:URL
  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  var dataBuffer = Buffer.from(base64Data, 'base64');
  let name=stringRandom(16, { numbers: true })+'.png';
  console.log('图',name);
  // let name='图.png';
  let filePath = path.join(__dirname, '../public/upload/') + `${name}`;
  return new Promise((res,rej)=>{
    fs.writeFile(filePath, dataBuffer, function(err) {
      console.log(111,err);
      if(err){
        res({...errorResObj})
      }else{
        res({
          ...responseObj,
          data:{
            path:`/upload/${name}`,
            name:imgName
          },
        })
      }
    });
  }).then(msg=>{
    ctx.response.body=msg;
  })
  
}

module.exports = {
  "POST /upload/img":upload_img,//上传图片
  "POST /upload/baseImg":upload_baseImg,//上传base64图片
  
};