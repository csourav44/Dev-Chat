require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const socket = require("socket.io");

app.use(cors());
app.use(express.json());


// function to connect database (Mongodb)
const connectDb = ()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to Database Successfully");
    })
    .catch((error)=>{
        console.log(error.message)
    })
}
connectDb();
app.use("/api/auth" , require("./routes/auth"));
app.use("/api/messages" , require('./routes/messages'));

const port = process.env.PORT || 5000
const server = app.listen(port , ()=>{
    console.log("server started on port "+port);
})

const io = socket(server , {
    cors:{
        origin:"http://localhost:3000",
        credentials:true
    }
});

global.onlineUsers = new Map();
io.on('connection',(socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId , socket.id)
    });
    socket.on("send-msg",(data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve" , data.message)
        }
    });

});