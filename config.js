const indexurl = ['http://localhost:7000/android/','https://gc.dz520.fun/android/'];

let i=[0];

let newconfig=null;
function SettingConfig(){

}


let config=new SettingConfig();
config.config={ indexurl:indexurl[i],};
config.setConfig=function(data){
  if(data){
    config.config=data;
   }
}


if(!newconfig){
  newconfig=config;
}

export default newconfig;
