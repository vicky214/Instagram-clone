const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cors = require('cors')
var bodyParser = require('body-parser')
const {MONGOURI} = require("./config/key")
const PORT = process.env.PORT || 5000


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());
mongoose.connect(MONGOURI,{
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser:true,
});
mongoose.connection.on('connected',()=>{
    console.log("connected to mongodb yeah..")
});

mongoose.connection.on('error',(err)=>{
    console.log("error during connection" ,err)
});

require('./models/user');
require('./models/post');


app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>console.log('server is running on port 5000'));