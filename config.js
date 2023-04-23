const indexurl = ['https://chat.allianceshopping.cn/index/'];

let i=[0];

window.config={ indexurl:indexurl[i],setConfig:(data)=>{
  if(data){
    window.config=Object.assign({},window.config,data);
   }
}}



export default window.config;
