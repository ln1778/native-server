const indexurl = ['https://www.allianceshopping.cn/'];

let i=[0];



window.config={ indexurl:indexurl[i],};
window.config.setConfig=function(data){
  if(data){
    window.config=Object.assign({},window.config,data);
   }
}

export default window.config;
