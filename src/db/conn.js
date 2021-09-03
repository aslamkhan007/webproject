const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/data",{
   useUnifiedTopology:true,
    useNewUrlParser:true,
    useCreateIndex:true
}).then(()=>{
    console.log("connection is setup");

}).catch((e)=>{
console.log(e);
})

