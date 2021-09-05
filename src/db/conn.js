const mongoose = require("mongoose");


mongoose.connect("mongodb+srv://thapa:vinodthapa@cluster0.u5rkm.mongodb.net/mernstack?retryWrites=true&w=majority",{
   useUnifiedTopology:true,
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=>{
    console.log("connection is setup");

}).catch((e)=>{
console.log(e);
})

// mongoose.connect("mongodb://localhost:27017/data",{
//    useUnifiedTopology:true,
//     useNewUrlParser:true,
//     useCreateIndex:true
// }).then(()=>{
//     console.log("connection is setup");

// }).catch((e)=>{
// console.log(e);
// })

