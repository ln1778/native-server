
const useAxios=require("./axios_hooks").default;
const config=require("./config").default;
const commont=require("./commont").default;
 

const Index={useAxios,config,commont};
export {commont};
export {config};
export {useAxios};

module.exports.default=Index;