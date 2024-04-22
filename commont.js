import React, { Component } from 'react';
import {
   Text,
   Dimensions,
   Image,
   Platform,
   NativeModules,
   CameraRoll,
   DeviceInfo,
   Linking
} from 'react-native';
import config from './config';
import AsyncStorage from "@react-native-community/async-storage";
let resolveAssetSource = Image.resolveAssetSource;


const { height, width } = Dimensions.get('window');
   
//获取url上的参数值 e为参数名称 
export function getQueryString(text,e) {
    var t = new RegExp("(^|/?|&)" + e + "=([^&]*)(&|$)");
    var a = text.substr(1).match(t);
    if (a != null) return a[2];
    return ""
}

export function delJSONData(keys, datas) {
    if(Object.keys(datas).length>0){
        Object.keys(datas).map((h)=>{ 
            if(typeof(keys)=="string"){
                delete datas[h];
            }else{
                if(keys.length>0){
                    keys.map((k)=>{if(h==k){
                        delete datas[h];
                    }})  
                }
            }
          }) 
    }else{
        datas=null;
    }
    return datas;
  }

export function html_encode(str)   
{   
  let s = "";   
  if (!str||str.length == 0) return "";   
  s = str.replace(/&/g, "&gt;");   
  s = s.replace(/</g, "&lt;");   
  s = s.replace(/>/g, "&gt;");   
  s = s.replace(/ /g, "&nbsp;");   
  s = s.replace(/\'/g, "&#39;");   
  s = s.replace(/\"/g, "&quot;");   
  s = s.replace(/\n/g, "<br>");   

  return s;   
}   
export function html_format(str)   
{   
  var s = "";   
  if (!str||str.length == 0) return ""; 
  if(typeof(str)=="number"){
    return String(str); 
  }  
  s = str.replace(/<br>/g,"");    
  s = s.replace(/<br.*?\/>/g,"");  
  s = s.replace(/<p.*?>/g,"");   
  s = s.replace(/<\/p>/g,"");   
  s = s.replace(/<img.*?\/>/g,"");   
  s = s.replace(/<img.*?>/g,"");  
  s = s.replace(/<h5>/g,""); 
  s = s.replace(/<\/h5>/g,""); 
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/<span.*?>/g,""); 
  s = s.replace(/<\/span>/g,"");
  s = s.replace(/<h1>/g,""); 
  s = s.replace(/<\/h1>/g,""); 
  s = s.replace(/<h2>/g,""); 
  s = s.replace(/<\/h2>/g,"");
  s = s.replace(/<h3>/g,""); 
  s = s.replace(/<\/h3>/g,"");  
  s = s.replace(/<h4>/g,""); 
  s = s.replace(/<\/h4>/g,""); 
  s = s.replace(/<a.*>.*<\/a>/g,""); 
  return s;   
} 

export function html_decode(str)   
{   
  var s = "";   
  if (!str||Array.from(str).length == 0) return "";   
  s = str.replace(/&gt;/g, "&");   
  s = s.replace(/&lt;/g, "<");   
  s = s.replace(/&gt;/g, ">");   
  s = s.replace(/&nbsp;/g, " ");   
  s = s.replace(/&#39;/g, "\'");   
  s = s.replace(/&quot;/g, "\"");   
  s = s.replace(/<br>/g, "\n");   
  return s;   
}

export function getStorage(key){
  return new Promise(function(resolve, reject) {
AsyncStorage.getItem(key,(err,value)=>{
  if(err||!value){
    resolve(false);
  }else{
      try{
        resolve(JSON.parse(value));
      }catch(err){
        resolve(value);
      }
  }
});
  })
} 
export function addStorage(key,value){
  return new Promise(function(resolve, reject) {
      let newvalue=JSON.stringify(value);
    AsyncStorage.setItem(key,newvalue).then((e)=>{
    resolve(e);
    },(error)=>{
    reject(error)
    })
  })
} 
export function deloneStorage(key){
      AsyncStorage.removeItem(key);
  } 
  export function delallStorage(){
      AsyncStorage.clear();
  } 

// 计算每个月的天数
function getCountDays(curDate) {
    if (typeof curDate == 'number' || typeof curDate == 'string') {
        if (curDate.length < 13) {
            const j = 13 - curDate.length;
            for (let i = 0; i < j; i++) {
                curDate = curDate + '0';
            }
        }
    }
        curDate = new Date(Number(curDate));
      
        /* 获取当前月份 */
        var curMonth = curDate.getMonth();
       /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
       curDate.setMonth(curMonth + 1);
       /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
       curDate.setDate(0);
       /* 返回当月的天数 */
       return curDate.getDate();
}

export function lastfiveday(){
       const calendar=[];
       for(let i=0;i<5;i++){
             let newyear=new Date().getFullYear();
         
   let newmonth=new Date().getMonth()+1;
           if(newmonth-i<1){
 if(newmonth-i==0){
            newmonth=12;
             newyear-=1;
        }else
      if(newmonth-i==-1){
            newmonth=11;
             newyear-=1;
        }else
      if(newmonth-i==-2){
            newmonth=10;
             newyear-=1;
        }else
      if(newmonth-i==-3){
            newmonth=9;
             newyear-=1;
        }
        }else{
             newmonth=newmonth-i;
             newyear=newyear; 
        }

           let matnewtitle=newyear+'年'+newmonth+'月';
               let matnewvalue=newmonth+'/'+ newyear;
               let matnewdate=newyear+'-'+newmonth;
               calendar.push({title:matnewtitle,value:matnewvalue,month:newmonth,date:matnewdate});
       }
            return calendar; 
}
export function lastfiveechart(){
       const calendar=[];
       for(let i=0;i<5;i++){
             let newyear=new Date().getFullYear();
   let newmonth=new Date().getMonth()+1;
           if(newmonth-i<1){
 if(newmonth-i==0){
            newmonth=12;
             newyear-=1;
        }else
      if(newmonth-i==-1){
            newmonth=11;
             newyear-=1;
        }else
      if(newmonth-i==-2){
            newmonth=10;
             newyear-=1;
        }else
      if(newmonth-i==-3){
            newmonth=9;
             newyear-=1;
        }
        }else{
             newmonth=newmonth-i;
             newyear=newyear; 
        }

           let matnewtitle=newmonth+'月';
               calendar.push({value:matnewtitle,textStyle:{fontSize:'14',fontWeight:'600',color:'#000'}});
       }
            return calendar.reverse(); 
}
// 压缩图片
export function canvasfn(imgsrc, truewidth,trueheight) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const cts = canvas.getContext('2d');
        const newimg = new Image();
        newimg.src = imgsrc;
        newimg.onload = function () {
            let _w = newimg.naturalWidth;
            let _h = newimg.naturalHeight;
            if(trueheight&&trueheight!=''){
                  canvas.width = truewidth?truewidth:_w;
                  canvas.height = trueheight;
            const y=Number(_h-trueheight)>0?Number(_h-trueheight)/2:Number(trueheight-_h)/2
            cts.drawImage(newimg, 0,y, _w, trueheight, 0, 0, truewidth?truewidth:_w, trueheight);
            resolve(canvas.toDataURL('images/png', 1));
            }else{
            let trueheight = _h / _w * truewidth;
            canvas.width = truewidth;
            canvas.height = trueheight;
            cts.drawImage(newimg, 0, 0, _w, _h, 0, 0, truewidth, trueheight);
            resolve(canvas.toDataURL('images/png',0.8));
            }
        }
    })
}




// 添加 图片到相册
export function saveImage(imgsrc){
    return new Promise((resolve, reject) => {
        let imgpath=imgsrc;
        const {saveImage}=NativeModules.LnsshModule;
        saveImage(imgpath,(result)=>{
            console.log("onSavePhotoresult",result);
            if(result&&result=="true"){
                resolve('已保存到相册');
            }else{
                if(Platform.OS=="android"){
                    reject("权限未开启");
                }
            }
        });
            });
}

function swap(items, firstIndex, secondIndex){
    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}
export function bubbleSort(items){
    var len = items.length,
        i, j, stop;
    for (i=0; i < len; i++){
        for (j=0, stop=len-i; j < stop; j++){
            if (Number(items[j])> Number(items[j+1])){
                swap(items, j, j+1);
            }
        }
    }
    return items;
}


export function isIphoneX(){
    const X_WIDTH = 375;
    const X_HEIGHT = 812;
const { PlatformConstants  } = NativeModules;
const { minor} = PlatformConstants.reactNativeVersion || {};
    if (Platform.OS === 'web') return false;
    if (minor >= 50) {
        return DeviceInfo.isIPhoneX_deprecated;
    }
    return (
        Platform.OS === 'ios' &&
        ((width === X_HEIGHT && height === X_WIDTH) ||
            (height === X_WIDTH && width === X_HEIGHT))
    );
}

export function randomArray(arr){
             for(var i=0,len=arr.length;i<len;i++){
                var a=parseInt(Math.random()*len);
                 var temp=arr[a];
                 arr[a]=arr[i];
                 arr[i]=temp;
             }
             return arr;
 }
   

//把时间戳格式化成标准格式 第一个参数为时间戳，第二个参数为格式例如 ‘Y-m-d h:M:s'
export function formatDate(date, format = 'Y-m-d h:M') {
    const days = [
        '周日',
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
        '周六'
    ];
    if (typeof date == 'number' || typeof date == 'string') {
        date = String(date);
        if (date.length < 13) {
            const j = 13 - date.length;
            for (let i = 0; i < j; i++) {
                date = date + '0';
            }
        }
        date = new Date(window.MyNumber(date));
    } else if (typeof date === 'undefined') {
        return '';
    }
    if (!format) {
        format = 'Y-m-d';
    }
    if (window.MyNumber(date.getHours()) < 10) {
        var hour = '0' + String(date.getHours());
    }
    else {
        var hour = date.getHours();
    }
    if (window.MyNumber(date.getMinutes()) < 10) {
        var Minute = '0' + String(date.getMinutes());
    }
    else {
        var Minute = date.getMinutes();
    }
    if (window.MyNumber(date.getSeconds()) < 10) {
        var Seconds = '0' + String(date.getSeconds());
    }
    else {
        var Seconds = date.getSeconds();
    }
    if (window.MyNumber((date.getMonth()) + 1) < 10) {
        var month = '0' + String(date.getMonth() + 1);
    } else {
        var month = date.getMonth() + 1;
    }
    if (window.MyNumber(date.getDate()) < 10) {
        var day = '0' + String(date.getDate());
    } else {
        var day = date.getDate();
    }
    format = format.replace('Y', date.getFullYear())
        .replace('m', month)
        .replace('d', day)
        .replace('h', hour)
        .replace('M', Minute)
        .replace('D', days[date.getDay()])
        .replace('s', Seconds);
    return format;
};     

 const commont={getCountDays,formatDate,delallStorage,lastfiveday,lastfiveechart,canvasfn,getQueryString,html_encode,html_format,delJSONData,html_decode,getStorage,addStorage,deloneStorage,isIphoneX,randomArray,swap,bubbleSort,saveImage};

 export default commont;