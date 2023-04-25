const indexurl = ['https://www.allianceshopping.cn/'];

let i=[0];



window.config={ indexurl:indexurl[i],};
window.setConfig=function(data){
  if(data){
    window.config=Object.assign({},window.config,data);
   }
}


if(!newconfig){
  newconfig=config;
}

export default newconfig;
