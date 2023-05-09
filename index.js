
const axios_hooks=require("./axios_hooks").default;
const config=require("./config").default;
const commont=require("./commont").default;
 

const Index={useAxios,config,commont};
export {commont};
export {config};
export {axios_hooks};

module.exports.default=Index;